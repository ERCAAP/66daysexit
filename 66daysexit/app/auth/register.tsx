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

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signUpWithEmail, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
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

    if (!confirmPassword.trim()) {
      setConfirmPasswordError(t('auth.passwordsDontMatch'));
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t('auth.passwordsDontMatch'));
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await signUpWithEmail(email, password);
      router.replace('/onboarding');
    } catch {
      Alert.alert('Error', t('auth.signUpError'));
    }
  };

  const handleNavigateToLogin = () => {
    router.back();
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
            <Text style={styles.title}>{t('auth.createAccount')}</Text>
            <Text style={styles.subtitle}>Start your 66-day transformation</Text>
          </View>

          {/* Register Form */}
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
                  placeholder="Create a password"
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

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('auth.confirmPassword')}</Text>
                <TextInput
                  style={[styles.input, confirmPasswordError ? styles.inputError : null]}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.text.muted}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </View>

              {/* Global Error */}
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              {/* Sign Up Button */}
              <Button
                title={t('auth.signUp')}
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
                onPress={handleSignUp}
                style={styles.signUpButton}
              />
            </View>
          </Card>

          {/* Terms and Privacy */}
          <View style={styles.termsSection}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>

          {/* Navigation to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('auth.alreadyHaveAccount')}
            </Text>
            <Button
              title={t('auth.signIn')}
              variant="ghost"
              size="medium"
              onPress={handleNavigateToLogin}
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
  signUpButton: {
    marginTop: theme.spacing.sm,
  },
  termsSection: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  termsText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm,
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