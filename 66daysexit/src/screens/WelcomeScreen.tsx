import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';

function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signInAnonymously, isLoading } = useAuthStore();

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const handleContinueAsGuest = async () => {
    try {
      await signInAnonymously();
      router.push('/onboarding');
    } catch (error) {
      console.error('Anonymous sign in failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={theme.gradients.background.colors as [string, string, ...string[]]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Phoenix</Text>
            </View>
            
            <Text style={styles.title}>
              {t('onboarding.welcome')}
            </Text>
            
            <Text style={styles.subtitle}>
              {t('onboarding.subtitle')}
            </Text>
          </View>

          {/* Features Cards */}
          <View style={styles.featuresSection}>
            <Card variant="glass" style={styles.featureCard}>
              <Text style={styles.featureTitle}>66 Days</Text>
              <Text style={styles.featureDescription}>
                Scientifically proven timeframe to build lasting habits
              </Text>
            </Card>

            <Card variant="glass" style={styles.featureCard}>
              <Text style={styles.featureTitle}>6 Core Areas</Text>
              <Text style={styles.featureDescription}>
                Sleep, Water, Exercise, Mind, Screen Time, Shower
              </Text>
            </Card>

            <Card variant="glass" style={styles.featureCard}>
              <Text style={styles.featureTitle}>RPG-Style Progress</Text>
              <Text style={styles.featureDescription}>
                Level up in real life with XP, achievements, and streaks
              </Text>
            </Card>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <Button
              title={t('onboarding.getStarted')}
              variant="primary"
              size="large"
              fullWidth
              onPress={handleGetStarted}
              style={styles.primaryButton}
            />
            
            <Button
              title={t('auth.continueAsGuest')}
              variant="ghost"
              size="large"
              fullWidth
              loading={isLoading}
              onPress={handleContinueAsGuest}
              style={styles.secondaryButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Transform your life, one day at a time
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing['3xl'],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  logoText: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  title: {
    fontSize: theme.typography.sizes['4xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.lg,
  },
  featuresSection: {
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  featureCard: {
    marginBottom: theme.spacing.sm,
  },
  featureTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  featureDescription: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.base,
  },
  actionsSection: {
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  primaryButton: {
    marginBottom: theme.spacing.sm,
  },
  secondaryButton: {
    // Additional styling if needed
  },
  footer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});

export default WelcomeScreen; 