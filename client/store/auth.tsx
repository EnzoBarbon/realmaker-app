import { createAuthProvider } from '@realmaker/shared/authStore';
import { router } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
const { AuthProvider: SharedAuthProvider, useAuth: useSharedAuth } = createAuthProvider(apiBaseUrl);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SharedAuthProvider>{children}</SharedAuthProvider>;
}

export function useAuth() {
  const auth = useSharedAuth();
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  // Augment shared auth with navigation side effects
  const loginWithNav = async (email: string, password: string) => {
    const me = await auth.login(email, password);
    router.replace(isMobile ? '/(tabs)/dashboard' : '/');
    return me;
  };

  const registerWithNav = async (payload: Parameters<typeof auth.register>[0]) => {
    const me = await auth.register(payload);
    router.replace('/onboarding');
    return me;
  };

  const logoutWithNav = async () => {
    await auth.logout();
    router.replace('/login');
  };

  return {
    ...auth,
    login: loginWithNav,
    register: registerWithNav,
    logout: logoutWithNav,
  };
}
