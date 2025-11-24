// deno-lint-ignore-file
import { Logger } from '../../shared/logger.ts';
import { ApiError, Middleware, RequestContext } from './types.ts';

const parseJsonBody: Middleware = async (context, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(context.req.method)) return next(context);
  let body: unknown = null;
  try {
    body = await context.req.json();
  } catch {
    throw new ApiError('Invalid JSON body, could not parse', 400);
  }
  return next({ ...context, body } as RequestContext);
};

export const parseJsonBodyMiddleware = <TBody = unknown>(): Middleware<TBody> => {
  return async (context, next) => {
    if (!['POST', 'PUT', 'PATCH'].includes(context.req.method)) return next(context);
    try {
      const body = await context.req.json();
      return next({ ...context, body });
    } catch {
      throw new ApiError('Invalid JSON body', 400);
    }
  };
};

export const createErrorMiddleware = (logger: Logger): Middleware => {
  return async (context, next) => {
    try {
      const result = await next(context);
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        logger.error((error as Error).message);
        return new Response(JSON.stringify({ error: error.message }), {
          status: error.status,
          headers: { 'content-type': 'application/json' },
        });
      }
      const message = (error as Error).message;
      logger.error(`Internal Server Error: ${message}`);
      return new Response(JSON.stringify({ error: `Internal Server Error: ${message}` }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }
  };
};

export function validateRequestBody<T>(required: (keyof T)[]): Middleware<T> {
  return async (context, next) => {
    const body = (context.body ?? {}) as Record<string, unknown>;
    const missing = required.filter((k) => !((k as string) in body));
    if (missing.length) throw new ApiError(`Missing required fields: ${missing.join(', ')}`, 400);
    return next(context as RequestContext<T>);
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
