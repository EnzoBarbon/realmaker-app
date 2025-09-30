import { Shell } from '@/components/layout/Shell';
import { AuthProvider, useAuth } from '@/store/auth';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from './login';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayoutWeb() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  return <RootShell />;
}

function RootShell() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <AuthStackWeb />
      </AuthProvider>
    </ThemeProvider>
  );
}

const authRoutes = () => {
  return (
    <Shell>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Modal screens for web */}
        <Stack.Screen
          name="conversation/[id]"
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="leads/[id]"
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />
      </Stack>
    </Shell>
  );
};

const nonAuthRoutes = () => {
  return <LoginScreen></LoginScreen>;
};

function AuthStackWeb() {
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
