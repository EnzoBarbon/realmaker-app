import { EndpointConfig, RequestContext } from '../../_shared/types.ts';

type LogoutResponse = { success: true };

const logoutHandler = async (context: RequestContext) => {
  const auth = context.auth!;
  const session = auth.session;

  if (session) {
    await auth.instance.invalidateSession(session.sessionId);
  }

  auth.request.setSession(null);
  return { data: { success: true } satisfies LogoutResponse };
};

export const logout: EndpointConfig<void, LogoutResponse> = {
  domain: 'auth',
  method: 'POST',
  path: '/logout',
  description: 'Invalidate the current session',
  handler: logoutHandler,
};
