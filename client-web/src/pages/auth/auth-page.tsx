import { AuthPage as AuthComponent } from '../../components/auth/auth-page';

interface AuthPageProps {
  onLogin: (data: any) => void;
  onRegister: (data: any) => void;
}

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  return (
    <AuthComponent
      onBack={() => {}} // No back navigation in standalone page
      defaultTab="login"
      onLanguageChange={() => {}}
      onLogin={onLogin}
      onRegister={onRegister}
    />
  );
}
