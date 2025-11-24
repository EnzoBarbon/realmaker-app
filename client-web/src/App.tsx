import { useAuth } from '@realmaker/shared/authStore';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthPage } from './pages/auth/auth-page';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { OnboardingPage } from './pages/onboarding/onboarding-page';
import { PublicPropertyPage } from './pages/public/public-property-page';

export default function App() {
  const { status, login, register, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicPropertyRoute = location.pathname.startsWith('/property/');

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' && !isPublicPropertyRoute && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
    if (status === 'authenticated') {
      if (location.pathname === '/login') {
        navigate('/', { replace: true });
      } else if (!user?.onboardingCompleted && location.pathname !== '/onboarding') {
        navigate('/onboarding', { replace: true });
      } else if (user?.onboardingCompleted && location.pathname === '/onboarding') {
        navigate('/', { replace: true });
      }
    }
  }, [status, location.pathname, isPublicPropertyRoute, navigate, user?.onboardingCompleted]);

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    await login(email, password);
    // Navigation handled by useEffect
  };

  const handleRegister = async (payload: {
    name: string;
    email: string;
    password: string;
    company: string;
  }) => {
    await register({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      companyName: payload.company,
    });
    // Navigation handled by useEffect
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/property/:id" element={<PublicPropertyPage />} />
        <Route
          path="/login"
          element={
            status === 'authenticated' ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            status !== 'authenticated' ? (
              <Navigate to="/login" replace />
            ) : user?.onboardingCompleted ? (
              <Navigate to="/" replace />
            ) : (
              <OnboardingPage />
            )
          }
        />
        <Route
          path="/*"
          element={
            status !== 'authenticated' ? (
              <Navigate to="/login" replace />
            ) : !user?.onboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <DashboardPage
                onLogout={handleLogout}
                userEmail={user?.email ?? ''}
                userName={user?.email ?? 'Usuario'}
              />
            )
          }
        />
      </Routes>
    </>
  );
}
