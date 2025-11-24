import { LuciaError } from 'lucia';
import { parseJsonBodyMiddleware } from '../../_shared/middleware.ts';
import { EndpointConfig, RequestContext } from '../../_shared/types.ts';
import { AuthResponse } from './shared.ts';

type LoginRequest = {
  email: string;
  password: string;
};

const loginHandler = async (context: RequestContext<LoginRequest>) => {
  const body = context.body!;
  if (!body?.email || !body?.password) {
    return { error: 'Email and password are required', status: 400 };
  }

  const auth = context.auth!;
  const email = body.email.trim().toLowerCase();

  try {
    const key = await auth.instance.useKey('email', email, body.password);
    const user = await auth.instance.getUser(key.userId);

    const session = await auth.instance.createSession({
      userId: key.userId,
      attributes: {},
    });
    auth.request.setSession(session);

    return {
      data: {
        id: user.userId,
        email: user.email,
        name: user.name ?? null,
      } satisfies AuthResponse,
    };
  } catch (error) {
    if (error instanceof LuciaError) {
      return { error: 'Invalid email or password', status: 401 };
    }
    throw error;
  }
};

export const login: EndpointConfig<LoginRequest, AuthResponse> = {
  domain: 'auth',
  method: 'POST',
  path: '/login',
  description: 'Authenticate a user and return session info',
  handler: loginHandler,
  middleware: [parseJsonBodyMiddleware<LoginRequest>()],
};
