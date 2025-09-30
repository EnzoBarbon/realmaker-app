import { api, clearToken, getToken, saveToken } from '@/lib/httpClient';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

export type AuthUser = { id: string; email: string } | null;

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        setStatus('unauthenticated');
        return;
      }
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
    const { token } = await api.login(email, password);
    await saveToken(token);
    const me = await api.getUser();
    setUser(me);
    setStatus('authenticated');
    const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
    router.replace(isMobile ? '/(tabs)/dashboard' : '/');
  };

  const logout = async () => {
    await clearToken();
    setUser(null);
    setStatus('unauthenticated');
    const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
    if (!isMobile) {
      router.replace('/');
      return;
    }
  };

  const value = useMemo(() => ({ status, user, login, logout }), [status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
