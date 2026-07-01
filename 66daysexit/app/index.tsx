import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../src/theme';
import { useAuthStore } from '../src/stores/authStore';

export default function Index() {
  const router = useRouter();
  const { user, userProfile, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    // Add a small delay for better UX
    const timer = setTimeout(() => {
      if (!user) {
        // No user, go to welcome screen
        router.replace('/welcome');
      } else if (userProfile && !userProfile.hasCompletedOnboarding) {
        // User exists but hasn't completed onboarding
        router.replace('/onboarding');
      } else {
        // User exists and has completed onboarding
        router.replace('/(tabs)');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [user, userProfile, isInitialized, router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.gradients.background.colors as [string, string, ...string[]]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Phoenix</Text>
          </View>
          <Text style={styles.tagline}>Transform your life in 66 days</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
  },
  logoText: {
    fontSize: theme.typography.sizes['5xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  tagline: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
