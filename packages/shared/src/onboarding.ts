export type OnboardingPayload = {
  businessName: string;
  businessPhone?: string;
  website?: string;
  teamSize?: string;
  socials: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  communication: {
    whatsapp: boolean;
    email: boolean;
    phone: boolean;
  };
  assistant: {
    channel: 'whatsapp' | 'email' | 'phone';
    name: string;
    objective: string;
    welcomeMessage: string;
    farewellMessage: string;
    quickActions: string[];
  };
  leadSources: {
    portals: string[];
    crm?: string | null;
    inboxEmail?: string;
  };
  preferences: {
    showPropertyStats: boolean;
    marketingOptIn: boolean;
  };
};
