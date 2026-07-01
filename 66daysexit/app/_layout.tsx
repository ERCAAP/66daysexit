import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import '../src/i18n';
import { useAuthStore } from '../src/stores/authStore';
import { ThemeProvider } from '../src/components/ui/ThemeProvider';
import ErrorBoundary from '../src/components/ui/ErrorBoundary';

export default function RootLayout() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor="transparent" translucent />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="auth/forgot-password" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="profile/edit" />
            <Stack.Screen name="profile/notifications" />
            <Stack.Screen name="profile/support" />
            <Stack.Screen name="profile/about" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
