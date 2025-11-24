import type { PrismaClient } from '../../../prisma/generated/client.ts';
import type { Logger } from '../../shared/logger.ts';
import {
  ApiResponse,
  createResponse,
  EndpointConfig,
  extractPathParams,
  extractQueryParams,
  Middleware,
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

export type CorsOptions = {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  allowCredentials: boolean;
};

export class EdgeFunctionPipeline {
  private endpoints = new Map<string, EndpointConfig>();
  private globalMiddleware: Middleware[] = [];
  private corsOptions: CorsOptions = {
    allowedOrigins: ['*'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'authorization',
      'content-type',
      'apikey',
      'x-forwarded-for',
      'cf-connecting-ip',
    ],
    allowCredentials: true,
  };
  private prisma: PrismaClient;
  private logger: Logger;

  constructor(prisma: PrismaClient, logger: Logger, corsOptions?: Partial<CorsOptions>) {
    this.prisma = prisma;
    this.logger = logger;
    if (corsOptions) {
      this.corsOptions = { ...this.corsOptions, ...corsOptions };
    }
  }

  setLogger(logger: Logger) {
    this.logger = logger;
  }

  addGlobalMiddleware(mw: Middleware) {
    this.globalMiddleware.push(mw);
  }

  registerEndpoint(domain: string, endpoint: EndpointConfig) {
    const key = this.makeKey(domain, endpoint.method, endpoint.path);
    this.endpoints.set(key, endpoint);
    this.logger.debug?.(`📝 Registered ${endpoint.method} /${domain}${endpoint.path || ''}`);
  }

  async autoRegisterEndpoints(dirRelativeToThisFile = '../endpoints/') {
    const base = new URL(dirRelativeToThisFile, import.meta.url);
    this.logger.info(`Scanning endpoints in ${base.pathname}`);
    await this.scanDirectory(base);
    this.logger.success(`Auto-registration complete. Total: ${this.endpoints.size} endpoints.`);
  }

  async processRequest(req: Request): Promise<Response> {
    const start = Date.now();
    const url = new URL(req.url);
    const { domain, subpath } = parsePath(url);

    const cors = this.handleCors(req);

    if (cors && req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: cors.headers,
      });
    }

    const resolved = this.resolveEndpoint(domain, req.method, subpath);
    if (!resolved) {
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    const { endpoint, params } = resolved;

    const context: RequestContext = {
      req,
      url,
      prisma: this.prisma,
      params,
      query: extractQueryParams(url),
      corsHeaders: cors?.headers,
    };

    const allMiddleware = [...this.globalMiddleware, ...(endpoint.middleware ?? [])];

    const executeEndpoint = async (ctx: RequestContext): Promise<Response> => {
      const result = await endpoint.handler(ctx);
      const res = createResponse(result);
      const end = Date.now() - start;
      this.logger.info(`Processed ${req.method} /${domain}${subpath} in ${end}ms`);
      const responseWithCookies = this.applyCookies(res, ctx.auth?.cookies);
      const finalResponse = this.applyCorsHeaders(responseWithCookies, ctx.corsHeaders);
      return finalResponse;
    };

    const dispatch = async (
      index: number,
      currentContext: RequestContext,
    ): Promise<ApiResponse<unknown> | Response> => {
      if (index >= allMiddleware.length) {
        return await executeEndpoint(currentContext);
      }

      const mw = allMiddleware[index];
      return mw(currentContext, async (nextContext) => {
        return await dispatch(index + 1, nextContext);
      });
    };

    const finalResult = await dispatch(0, context);

    return createResponse(finalResult);
  }

  private applyCookies(res: Response, cookies?: string[]): Response {
    if (!cookies?.length) {
      return res;
    }

    const headers = new Headers(res.headers);
    cookies.forEach((cookie) => headers.append('set-cookie', cookie));
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  }

  private applyCorsHeaders(res: Response, corsHeaders?: Record<string, string>): Response {
    if (!corsHeaders) return res;
    const headers = new Headers(res.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  }

  private handleCors(req: Request) {
    const origin = req.headers.get('origin');
    if (!origin) return;
    if (
      this.corsOptions.allowedOrigins.includes('*') ||
      this.corsOptions.allowedOrigins.includes(origin)
    ) {
      return {
        allowed: true,
        headers: {
          'access-control-allow-origin': origin,
          'access-control-allow-methods': this.corsOptions.allowedMethods.join(','),
          'access-control-allow-headers': this.corsOptions.allowedHeaders.join(','),
          'access-control-allow-credentials': this.corsOptions.allowCredentials ? 'true' : 'false',
        },
      };
    }
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

  private async scanDirectory(dirUrl: URL) {
    for await (const entry of Deno.readDir(dirUrl)) {
      if (entry.isDirectory) {
        const subDirUrl = new URL(entry.name + '/', dirUrl);
        await this.scanDirectory(subDirUrl);
      } else if (entry.isFile && entry.name.endsWith('.ts')) {
        const modUrl = new URL(entry.name, dirUrl).href;
        const mod = await import(modUrl);
        for (const value of Object.values(mod)) {
          const ep = value as EndpointConfig | undefined;
          if (ep && typeof ep === 'object' && 'method' in ep && 'path' in ep && 'handler' in ep) {
            const d = ep.domain ?? entry.name.replace(/\.ts$/, '');
            this.registerEndpoint(d, ep);
          }
        }
      }
    }
  }
}
