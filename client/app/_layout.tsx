import { AuthProvider, useAuth } from '@/store/auth';
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import LoginScreen from './login';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      {/* iOS status bar: light content; background handled by SafeAreaView */}
      <StatusBar style="dark" />
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>
          <AuthStack />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const authRoutes = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Modal screens */}
      <Stack.Screen
        name="conversation/[id]"
        options={{
          presentation: 'modal',
          headerShown: false,
          animation: 'slide_from_bottom',
          contentStyle: {},
        }}
      />
      <Stack.Screen
        name="leads/[id]"
        options={{
          presentation: 'modal',
          headerShown: false,
          animation: 'slide_from_bottom',
          contentStyle: {},
        }}
      />
    </Stack>
  );
};

const nonAuthRoutes = () => {
  return <LoginScreen></LoginScreen>;
};

function AuthStack() {
  const { status } = useAuth();
  const loggedIn = status === 'authenticated';
  const loading = status === 'loading';
  if (loading) return <LoadingScreen />;
  return loggedIn ? authRoutes() : nonAuthRoutes();
}

function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  );
}
