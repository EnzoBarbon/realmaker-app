export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  companyId?: string | null;
  onboardingCompleted?: boolean;
};

export type RegisterPayload = {
  name?: string;
  email: string;
  password: string;
  companyName?: string;
};
