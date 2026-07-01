import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { theme } from '../../src/theme';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import { auth } from '../../src/config/firebase';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    setEmailError('');

    if (!email.trim()) {
      setEmailError(t('auth.invalidEmail'));
      return false;
    } else if (!validateEmail(email)) {
      setEmailError(t('auth.invalidEmail'));
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    handleResetPassword();
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={theme.gradients.background.colors as [string, string, ...string[]]}
          style={styles.gradient}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header with back button */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBackToLogin}
              >
                <Ionicons 
                  name="arrow-back" 
                  size={24} 
                  color={theme.colors.text.primary} 
                />
              </TouchableOpacity>
            </View>

            {/* Success Message */}
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons 
                  name="mail-outline" 
                  size={64} 
                  color={theme.colors.success.start} 
                />
              </View>
              
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successMessage}>
                We've sent password reset instructions to {email}
              </Text>

              <Card variant="glass" style={styles.instructionsCard}>
                <Text style={styles.instructionsTitle}>What's Next?</Text>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionNumber}>1</Text>
                  <Text style={styles.instructionText}>
                    Check your email inbox (and spam folder)
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionNumber}>2</Text>
                  <Text style={styles.instructionText}>
                    Click the reset password link in the email
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionNumber}>3</Text>
                  <Text style={styles.instructionText}>
                    Create a new secure password
                  </Text>
                </View>
              </Card>

              <View style={styles.actionButtons}>
                <Button
                  title="Resend Email"
                  variant="outline"
                  size="large"
                  fullWidth
                  onPress={handleResendEmail}
                  style={styles.resendButton}
                />
                
                <Button
                  title="Back to Login"
                  variant="primary"
                  size="large"
                  fullWidth
                  onPress={handleBackToLogin}
                  style={styles.backToLoginButton}
                />
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

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
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={theme.colors.text.primary} 
              />
            </TouchableOpacity>
            <Text style={styles.title}>Reset Password</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>
          </View>

          {/* Reset Form */}
          <Card variant="glass" style={styles.formCard}>
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color={theme.colors.text.muted} 
                    style={styles.inputIcon}
                  />
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
                    autoFocus
                  />
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* Reset Button */}
              <Button
                title="Send Reset Instructions"
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
                onPress={handleResetPassword}
                style={styles.resetButton}
              />
            </View>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Remember your password?
            </Text>
            <Button
              title="Back to Login"
              variant="ghost"
              size="medium"
              onPress={handleBackToLogin}
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
    paddingTop: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.xl,
  },
  description: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.base,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: theme.spacing.xl,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  inputIcon: {
    marginLeft: theme.spacing.md,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  errorText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.status.error,
  },
  resetButton: {
    marginTop: theme.spacing.sm,
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
  // Success screen styles
  successContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: theme.spacing['2xl'],
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  successTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  successMessage: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.base,
  },
  instructionsCard: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  instructionsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary.start,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: theme.spacing.md,
  },
  instructionText: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.base,
  },
  actionButtons: {
    width: '100%',
    gap: theme.spacing.md,
  },
  resendButton: {
    marginBottom: theme.spacing.sm,
  },
  backToLoginButton: {},
}); 