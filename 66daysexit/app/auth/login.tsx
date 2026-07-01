import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../src/theme';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import { useAuthStore } from '../../src/stores/authStore';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signInWithEmail, signInAnonymously, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    
    setEmailError('');
    setPasswordError('');
    clearError();

    if (!email.trim()) {
      setEmailError(t('auth.invalidEmail'));
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(t('auth.invalidEmail'));
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError(t('auth.passwordTooShort'));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t('auth.passwordTooShort'));
      isValid = false;
    }

    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      await signInWithEmail(email, password);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', t('auth.signInError'));
    }
  };

  const handleContinueAsGuest = async () => {
    try {
      await signInAnonymously();
      router.replace('/onboarding');
    } catch {
      Alert.alert('Error', 'Anonymous sign in failed. Please try again.');
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradients.background.colors as [string, string, ...string[]]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('auth.signIn')}</Text>
            <Text style={styles.subtitle}>Welcome back to your journey</Text>
          </View>

          {/* Login Form */}
          <Card variant="glass" style={styles.formCard}>
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('auth.email')}</Text>
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.text.muted}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('auth.password')}</Text>
                <TextInput
                  style={[styles.input, passwordError ? styles.inputError : null]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.text.muted}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Global Error */}
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              {/* Sign In Button */}
              <Button
                title={t('auth.signIn')}
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
                onPress={handleSignIn}
                style={styles.signInButton}
              />

              {/* Forgot Password */}
              <Button
                title={t('auth.forgotPassword')}
                variant="ghost"
                size="medium"
                onPress={() => router.push('/auth/forgot-password')}
                style={styles.forgotButton}
              />
            </View>
          </Card>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Alternative Options */}
          <View style={styles.alternativeSection}>
            <Button
              title={t('auth.continueAsGuest')}
              variant="outline"
              size="large"
              fullWidth
              onPress={handleContinueAsGuest}
              style={styles.guestButton}
            />
          </View>

          {/* Navigation to Register */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('auth.dontHaveAccount')}
            </Text>
            <Button
              title={t('auth.signUp')}
              variant="ghost"
              size="medium"
              onPress={handleNavigateToRegister}
            />
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
    paddingTop: theme.spacing['2xl'],
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: theme.spacing.lg,
  },
  form: {
    gap: theme.spacing.lg,
  },
  inputContainer: {
    gap: theme.spacing.sm,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  input: {
    height: 48,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  errorText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.status.error,
  },
  signInButton: {
    marginTop: theme.spacing.sm,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.primary,
  },
  dividerText: {
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  alternativeSection: {
    marginBottom: theme.spacing.lg,
  },
  guestButton: {
    marginBottom: theme.spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
}); 