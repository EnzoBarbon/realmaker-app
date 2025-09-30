// deno-lint-ignore-file
import { ApiError, Middleware, RequestContext } from './types.ts';

export const parseJsonBody = <TBody = unknown>(): Middleware<TBody> => {
  return async (context) => {
    if (!['POST', 'PUT', 'PATCH'].includes(context.req.method)) return context;
    try {
      const body = await context.req.json();
      return { ...context, body } as RequestContext<TBody>;
    } catch {
      throw new ApiError('Invalid JSON body', 400);
    }
  };
};

export const authMiddleware: Middleware = async (context) => {
  const auth = context.req.headers.get('authorization') || '';
  if (!auth) throw new ApiError('Unauthorized', 401);
  return { ...context, user: { id: 'user', isService: false } };
};

export const optionalAuthMiddleware: Middleware = async (context) => {
  const auth = context.req.headers.get('authorization') || '';
  if (!auth) return context;
  return { ...context, user: { id: 'user', isService: false } };
};

export const serviceOrUserAuthMiddleware: Middleware = async (context) => {
  const auth = context.req.headers.get('authorization') || '';
  if (!auth) throw new ApiError('Unauthorized', 401);
  const isService = auth === `Bearer ${Deno.env.get('SERVICE_ROLE')}`;
  return { ...context, user: { id: isService ? 'service' : 'user', isService } };
};

export function validateRequestBody<T>(required: (keyof T)[]): Middleware<T> {
  return async (context) => {
    const body = (context.body ?? {}) as Record<string, unknown>;
    const missing = required.filter((k) => !((k as string) in body));
    if (missing.length) throw new ApiError(`Missing required fields: ${missing.join(', ')}`, 400);
    return context as RequestContext<T>;
  };
}

export function withErrorHandling<T>(
  handler: (ctx: RequestContext<T>) => Promise<Response>,
): (ctx: RequestContext<T>) => Promise<Response> {
  return async (ctx) => {
    try {
      return await handler(ctx);
    } catch (e) {
      if (e instanceof ApiError) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: e.status,
          headers: { 'content-type': 'application/json' },
        });
      }
      console.error(e);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }
  };
}
