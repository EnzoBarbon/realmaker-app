import { OnboardingFlow as OnboardingComponent } from '../../components/onboarding/onboarding-flow';

interface OnboardingPageProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  return <OnboardingComponent language="es" />;
}
