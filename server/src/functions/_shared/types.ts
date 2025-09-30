import { PrismaClient } from '../../../prisma/generated/client.ts';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status?: number;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export type RequestContext<TBody = unknown> = {
  req: Request;
  url: URL;
  prisma: PrismaClient;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  user?: { id: string; isService?: boolean };
  body?: TBody;
  // Billing/entitlements placeholder to match architecture; can be populated by middleware
  billing?: {
    userOrganizationId: string;
    organizationId: string;
    ownerUserId: string;
    role: unknown;
    subscriptionUsage?: unknown;
    plan?: { key: string; name: string; level: number; entitlements?: unknown };
  };
};

export type Middleware<TBody = unknown> = (
  context: RequestContext<TBody>,
) => Promise<RequestContext<TBody> | Response>;

export type EndpointConfig<TBody = unknown, TResponse = unknown> = {
  method: HttpMethod;
  path: string; // '' or '/sub-route' or '/items/:id'
  handler: (context: RequestContext<TBody>) => Promise<ApiResponse<TResponse> | Response>;
  middleware?: Middleware<TBody>[];
  description?: string;
  // Minimal privilege hook placeholder
  requiredPrivileges?: (role: unknown, context: RequestContext<TBody>) => Promise<boolean>;
};

export function createResponse(
  payload: ApiResponse<unknown> | Response,
  init?: ResponseInit,
): Response {
  if (payload instanceof Response) return withJsonHeaders(payload);
  const { data, error, status } = payload;
  return withJsonHeaders(
    new Response(JSON.stringify(error ? { error } : { data }), {
      status: status ?? (error ? 400 : 200),
      headers: { 'content-type': 'application/json' },
      ...init,
    }),
  );
}

export function withJsonHeaders(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set('content-type', headers.get('content-type') ?? 'application/json');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export function extractQueryParams(url: URL): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const [k, v] of url.searchParams.entries()) {
    if (out[k]) {
      const existing = out[k];
      out[k] = Array.isArray(existing) ? [...existing, v] : [existing as string, v];
    } else {
      out[k] = v;
    }
  }
  return out;
}

export function extractPathParams(pattern: string, actual: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pSeg = pattern.split('/').filter(Boolean);
  const aSeg = actual.split('/').filter(Boolean);
  for (let i = 0; i < pSeg.length; i++) {
    const p = pSeg[i];
    const a = aSeg[i];
    if (p?.startsWith(':')) params[p.slice(1)] = a ?? '';
  }
  return params;
}
