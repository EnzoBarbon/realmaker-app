// deno-lint-ignore-file
import { PrismaClient } from '../../../prisma/generated/client.ts';
import { corsHeaders, handleOptions } from './cors.ts';
import type { Logger } from './logger.ts';
import { ConsoleLogger } from './logger.ts';
import {
  ApiError,
  createResponse,
  EndpointConfig,
  extractPathParams,
  extractQueryParams,
  RequestContext,
} from './types.ts';

function parsePath(url: URL) {
  // supports /functions/v1/main/{domain}/{path?} | /main/{domain}/{path?} | /{domain}/{path?}
  const seg = url.pathname.split('/').filter(Boolean);
  let domain = '';
  let rest: string[] = [];
  if (seg[0] === 'functions' && seg[2] === 'main') {
    domain = seg[3] ?? '';
    rest = seg.slice(4);
  } else if (seg[0] === 'main') {
    domain = seg[1] ?? '';
    rest = seg.slice(2);
  } else {
    domain = seg[0] ?? '';
    rest = seg.slice(1);
  }
  return { domain, subpath: '/' + rest.join('/') };
}

export class EdgeFunctionPipeline {
  private endpoints = new Map<string, EndpointConfig<any, any>>();
  private globalMiddleware: ((ctx: RequestContext) => Promise<RequestContext | Response>)[] = [];
  private prisma: PrismaClient;
  private logger: Logger;

  constructor(prisma: PrismaClient, logger: Logger = new ConsoleLogger()) {
    this.prisma = prisma;
    this.logger = logger;
  }

  setLogger(logger: Logger) {
    this.logger = logger;
  }

  addGlobalMiddleware(mw: (ctx: RequestContext) => Promise<RequestContext | Response>) {
    this.globalMiddleware.push(mw);
  }

  registerEndpoint(domain: string, endpoint: EndpointConfig<any, any>) {
    const key = this.makeKey(domain, endpoint.method, endpoint.path);
    this.endpoints.set(key, endpoint);
    this.logger.debug?.(`📝 Registered ${endpoint.method} /${domain}${endpoint.path || ''}`);
  }

  async autoRegisterEndpoints(dirRelativeToThisFile = '../endpoints/') {
    const base = new URL(dirRelativeToThisFile, import.meta.url);
    this.logger.info(`Scanning endpoints in ${base.pathname}`);
    for await (const entry of Deno.readDir(base)) {
      if (!entry.isFile || !entry.name.endsWith('.ts')) continue;
      const modUrl = new URL(entry.name, base).href;
      const mod = await import(modUrl);
      const domain: string | undefined = mod.domain;
      for (const value of Object.values(mod)) {
        const ep = value as EndpointConfig | undefined;
        if (ep && typeof ep === 'object' && 'method' in ep && 'path' in ep && 'handler' in ep) {
          const d = domain ?? entry.name.replace(/\.ts$/, '');
          this.registerEndpoint(d, ep);
        }
      }
    }
    this.logger.success(`Auto-registration complete. Total: ${this.endpoints.size} endpoints.`);
  }

  private makeKey(domain: string, method: string, path: string) {
    return `${domain}::${method.toUpperCase()}::${path}`;
  }

  private resolveEndpoint(domain: string, method: string, path: string) {
    // exact
    const exact = this.endpoints.get(this.makeKey(domain, method, path));
    if (exact) return { endpoint: exact, params: {} as Record<string, string> };

    // pattern match :params with same segment count
    const candidates = [...this.endpoints.entries()].filter(([k]) =>
      k.startsWith(`${domain}::${method.toUpperCase()}::`),
    );
    for (const [, ep] of candidates) {
      const p = ep.path || '';
      const pSeg = p.split('/').filter(Boolean);
      const aSeg = path.split('/').filter(Boolean);
      if (pSeg.length !== aSeg.length) continue;
      const match = pSeg.every((s, i) => s.startsWith(':') || s === aSeg[i]);
      if (match) return { endpoint: ep, params: extractPathParams(p, path) };
    }
    return null;
  }

  async processRequest(req: Request): Promise<Response> {
    if (req.method === 'OPTIONS') return handleOptions();

    const start = Date.now();
    const url = new URL(req.url);
    const { domain, subpath } = parsePath(url);

    const resolved = this.resolveEndpoint(domain, req.method, subpath);
    if (!resolved)
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: corsHeaders,
      });

    const { endpoint, params } = resolved;

    let context: RequestContext = {
      req,
      url,
      prisma: this.prisma,
      params,
      query: extractQueryParams(url),
    };

    // global middleware
    for (const mw of this.globalMiddleware) {
      const out = await mw(context);
      if (out instanceof Response) return this.withCors(out);
      context = out;
    }

    // endpoint middleware
    for (const mw of endpoint.middleware ?? []) {
      const out = await mw(context);
      if (out instanceof Response) return this.withCors(out);
      context = out;
    }

    // privilege hook (placeholder)
    if (endpoint.requiredPrivileges) {
      const ok = await endpoint.requiredPrivileges(context.billing?.role, context);
      if (!ok) throw new ApiError('Unauthorized', 401);
    }

    const result = await endpoint.handler(context);
    const res = createResponse(result);
    const end = Date.now() - start;
    this.logger.info(`Processed ${req.method} /${domain}${subpath} in ${end}ms`);
    return this.withCors(res);
  }

  private withCors(res: Response): Response {
    const headers = new Headers(res.headers);
    Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, String(v)));
    return new Response(res.body, { status: res.status, headers });
  }
}
