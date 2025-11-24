import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { createApiClient } from './httpClient';
import { OnboardingPayload } from './onboarding';
import { AuthUser, RegisterPayload } from './types';

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  completeOnboarding: (payload: OnboardingPayload) => Promise<void>;
  setUser: (u: AuthUser) => void;
  setStatus: (s: AuthStatus) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function createAuthProvider(apiBaseUrl: string) {
  const api = createApiClient(apiBaseUrl);

  function AuthProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<AuthStatus>('loading');
    const [user, setUser] = useState<AuthUser | null>(null);

    //This is called as soon as the component is mounted.
    //Calls the API to get the user, if we have the cookie it's automatically sent.
    //This should make the user available as logged in if the cookie is valid as soon as the app starts.
    useEffect(() => {
      (async () => {
        try {
          const me = await api.getUser();
          setUser(me);
          setStatus('authenticated');
        } catch {
          setStatus('unauthenticated');
        }
      })();
    }, []);

    const login = async (email: string, password: string) => {
      const me = await api.login(email, password);
      setUser(me);
      setStatus('authenticated');
      return me;
    };

    const register = async (payload: RegisterPayload) => {
      const me = await api.register(payload);
      setUser(me);
      setStatus('authenticated');
      return me;
    };

    const logout = async () => {
      try {
        await api.logout();
      } catch {
        // ignore logout errors, we'll just clear local state
      }
      setUser(null);
      setStatus('unauthenticated');
    };

    const completeOnboarding = async (payload: OnboardingPayload) => {
      await api.completeOnboarding(payload);
      // Refresh user to get updated onboarding status
      const me = await api.getUser();
      setUser(me);
    };

    const value = useMemo(
      () => ({ status, user, login, register, logout, completeOnboarding, setUser, setStatus }),
      [status, user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  return { AuthProvider, useAuth };
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
