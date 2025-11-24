import { parseJsonBodyMiddleware } from '../../_shared/middleware.ts';
import { EndpointConfig, RequestContext } from '../../_shared/types.ts';

type OnboardingPayload = {
  businessName: string;
  businessPhone?: string;
  website?: string;
  teamSize?: string;
  socials?: Record<string, string | undefined>;
  communication?: {
    whatsapp?: boolean;
    email?: boolean;
    phone?: boolean;
  };
  assistant: {
    channel: 'whatsapp' | 'email' | 'phone';
    name: string;
    objective?: string;
    welcomeMessage?: string;
    farewellMessage?: string;
    quickActions?: string[];
  };
  leadSources?: {
    portals?: string[];
    crm?: string | null;
    inboxEmail?: string;
  };
  preferences?: {
    showPropertyStats?: boolean;
    marketingOptIn?: boolean;
  };
};

const completeHandler = async (context: RequestContext<OnboardingPayload>) => {
  const auth = context.auth!;
  if (!auth.session) {
    return { error: 'Unauthorized', status: 401 };
  }

  const companyId = auth.session.user.companyId;
  if (!companyId) {
    return { error: 'User does not belong to a company', status: 400 };
  }

  const body = context.body;
  if (!body || !body.businessName) {
    return { error: 'Missing onboarding payload', status: 400 };
  }

  await context.prisma.company.update({
    where: { id: companyId },
    data: {
      name: body.businessName,
      onboardingData: body,
      onboardingCompletedAt: new Date(),
    },
  });

  return { data: { success: true } };
};

export const complete: EndpointConfig<OnboardingPayload, { success: boolean }> = {
  domain: 'onboarding',
  method: 'POST',
  path: '/complete',
  description: 'Persist onboarding data for the authenticated company',
  handler: completeHandler,
  middleware: [parseJsonBodyMiddleware<OnboardingPayload>()],
};
