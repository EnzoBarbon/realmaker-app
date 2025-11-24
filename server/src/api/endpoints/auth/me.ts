import { EndpointConfig, RequestContext } from '../../_shared/types.ts';
import { AuthResponse } from './shared.ts';

const meHandler = async (context: RequestContext) => {
  // Fetch latest user data to get company info
  const user = await context.prisma.user.findUnique({
    where: { id: context.auth!.session!.user.userId },
    include: { company: true },
  });

  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  return {
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      companyId: user.companyId,
      onboardingCompleted: !!user.company?.onboardingData,
    } satisfies AuthResponse,
  };
};

export const me: EndpointConfig<void, AuthResponse> = {
  domain: 'auth',
  method: 'GET',
  path: '/me',
  description: 'Return the authenticated user',
  handler: meHandler,
};
