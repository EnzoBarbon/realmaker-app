import { parseJsonBodyMiddleware } from '../../_shared/middleware.ts';
import { EndpointConfig, RequestContext } from '../../_shared/types.ts';
import { AuthResponse } from './shared.ts';

type RegisterRequest = {
  email: string;
  password: string;
  name?: string;
  companyName?: string;
};

const registerHandler = async (context: RequestContext<RegisterRequest>) => {
  const body = context.body;
  if (!body?.email || !body?.password) {
    return { error: 'Email and password are required', status: 400 };
  }

  if (body.password.length < 8) {
    return { error: 'Password must be at least 8 characters', status: 400 };
  }

  const email = body.email.trim().toLowerCase();
  const existing = await context.prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'Email already registered', status: 409 };
  }

  // Ensure FREE plan exists
  let freePlan = await context.prisma.plan.findUnique({ where: { name: 'FREE' } });
  if (!freePlan) {
    freePlan = await context.prisma.plan.create({
      data: {
        name: 'FREE',
        price: 0,
        currency: 'USD',
        features: {},
      },
    });
  }

  // Create Company with Subscription
  const companyName = body.companyName || (body.name ? `${body.name}'s Company` : 'My Company');
  const company = await context.prisma.company.create({
    data: {
      name: companyName,
      subscriptions: {
        create: {
          planId: freePlan.id,
          status: 'ACTIVE',
        },
      },
    },
  });

  const auth = context.auth!;
  const user = await auth.instance.createUser({
    key: {
      providerId: 'email',
      providerUserId: email,
      password: body.password,
    },
    attributes: {
      email,
      name: body.name ?? null,
      companyId: company.id,
      role: 'BILLING_ADMIN',
    },
  });

  // Set billing admin
  await context.prisma.company.update({
    where: { id: company.id },
    data: { billingContactId: user.userId },
  });

  const session = await auth.instance.createSession({
    userId: user.userId,
    attributes: {},
  });
  auth.request.setSession(session);

  return {
    data: {
      id: user.userId,
      email: user.email,
      name: user.name,
      companyId: company.id,
      onboardingCompleted: false,
    } satisfies AuthResponse,
  };
};

export const register: EndpointConfig<RegisterRequest, AuthResponse> = {
  domain: 'auth',
  method: 'POST',
  path: '/register',
  description: 'Register a new account and start a session',
  handler: registerHandler,
  middleware: [parseJsonBodyMiddleware<RegisterRequest>()],
};
