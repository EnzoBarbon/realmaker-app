import { EndpointConfig, RequestContext } from '../_shared/types.ts';

export const domain = 'auth';

type LoginRequest = { email: string; password: string };

type LoginResponse = { token: string };

type GetUserResponse = { id: string; email: string };

const loginHandler = async (context: RequestContext<LoginRequest>) => {
  const token = crypto.randomUUID().replace(/-/g, '');
  return { data: { token } satisfies LoginResponse };
};

export const login: EndpointConfig<LoginRequest, LoginResponse> = {
  method: 'POST',
  path: '/login',
  description: 'Mock login returns a random token',
  middleware: [],
  handler: loginHandler,
};

const getUserHandler = async (context: RequestContext<void>) => {
  const auth = context.req.headers.get('authorization') || '';
  if (!auth?.toLowerCase().startsWith('bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }
  // return a mock user; token is not validated beyond presence
  return { data: { id: 'user_123', email: 'mock@example.com' } satisfies GetUserResponse };
};

export const getUser: EndpointConfig<void, GetUserResponse> = {
  method: 'GET',
  path: '/get-user',
  description: 'Return mock user if Authorization header present; 401 otherwise',
  handler: getUserHandler,
};
