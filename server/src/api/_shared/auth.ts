import { prisma as prismaAdapter } from '@lucia-auth/adapter-prisma';
import { type Auth, type Cookie, lucia as createLucia, LuciaError, type Session } from 'lucia';
import { lucia as luciaMiddleware } from 'lucia/middleware';
import { Scrypt } from 'oslo/password';

import type { PrismaClient } from '../../../prisma/generated/client.ts';
import { Logger } from '../../shared/logger.ts';
import type { Middleware } from './types.ts';

const passwordHasher = new Scrypt();

export type LuciaInstance = Auth;

export const createAuth = (prisma: PrismaClient): LuciaInstance =>
  createLucia({
    adapter: prismaAdapter(prisma),
    env: Deno.env.get('NODE_ENV') === 'production' ? 'PROD' : 'DEV',
    middleware: luciaMiddleware(),
    //TODO: Improve this. Auth was failing on post requests because of csrf protection
    csrfProtection: false,
    sessionCookie: {
      name: 'rm_session',
      attributes: {
        sameSite: 'lax',
        path: '/',
      },
    },
    passwordHash: {
      generate: (password: string) => passwordHasher.hash(password),
      validate: (password: string, hash: string) => passwordHasher.verify(hash, password),
    },
    getUserAttributes: (user: {
      email: string;
      name: string | null;
      companyId: string | null;
      role: string | null;
    }) => ({
      email: user.email,
      name: user.name,
      companyId: user.companyId,
      role: user.role,
    }),
  });

export const createAuthMiddleware = (auth: LuciaInstance, logger: Logger): Middleware => {
  return async (context, next) => {
    const cookiesToSet: string[] = [];
    const rawCookie = context.req.headers.get('cookie');
    logger.debug(`raw cookie header: ${rawCookie}`);
    const sessionCookie = auth.readSessionCookie(rawCookie);
    logger.debug(`parsed session cookie: ${sessionCookie}`);

    const authRequest = auth.handleRequest({
      request: {
        method: context.req.method,
        headers: context.req.headers,
        url: context.req.url,
      },
      sessionCookie,
      setCookie: (cookie: Cookie) => {
        cookiesToSet.push(cookie.serialize());
      },
    });

    let session: Session | null = null;
    logger.debug('validating the session');
    try {
      session = await authRequest.validate();
      logger.debug(`session: ${JSON.stringify(session)}`);
    } catch (error) {
      if (error instanceof LuciaError) {
        console.log('error', error);
        logger.error(`Auth Error: ${error.message}`);
        session = null;
      } else {
        console.log('error', error);
        throw error;
      }
    }

    const user = session
      ? {
          id: session.user.userId,
          email: session.user.email ?? undefined,
        }
      : context.user;

    return next({
      ...context,
      user,
      auth: {
        instance: auth,
        request: authRequest,
        session,
        cookies: cookiesToSet,
      },
    });
  };
};
