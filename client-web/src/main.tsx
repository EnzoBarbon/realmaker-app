import { createAuthProvider } from '@realmaker/shared/authStore';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { TrialDaysProvider } from './contexts/trial-days-context.tsx';
import './index.css';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';
const { AuthProvider } = createAuthProvider(apiBaseUrl);

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* //TODO: remove the trial days provider. AI SLOP */}
      <TrialDaysProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </TrialDaysProvider>
    </AuthProvider>
  );
}
createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>,
);
