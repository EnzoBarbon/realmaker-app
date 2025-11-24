export type AuthResponse = {
  id: string;
  email: string;
  name?: string | null;
  companyId?: string | null;
  onboardingCompleted?: boolean;
};
