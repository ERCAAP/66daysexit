import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import Button from './Button';
import Card from './Card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            retry={this.handleRetry} 
          />
        );
      }

      // Default error UI
      return (
        <SafeAreaView style={styles.container}>
          <LinearGradient
            colors={theme.gradients.background.colors as [string, string, ...string[]]}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Card variant="glass" style={styles.errorCard}>
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name="warning-outline" 
                    size={64} 
                    color={theme.colors.status.error} 
                  />
                </View>
                
                <Text style={styles.title}>Something went wrong</Text>
                <Text style={styles.subtitle}>
                  We&apos;re sorry! An unexpected error occurred. Please try again.
                </Text>
                
                {__DEV__ && this.state.error && (
                  <View style={styles.errorDetails}>
                    <Text style={styles.errorMessage}>
                      {this.state.error.toString()}
                    </Text>
                  </View>
                )}
                
                <View style={styles.actions}>
                  <Button
                    title="Try Again"
                    variant="primary"
                    size="large"
                    onPress={this.handleRetry}
                    style={styles.retryButton}
                  />
                  
                  <TouchableOpacity 
                    style={styles.reportButton}
                    onPress={() => {
                      // In production, implement error reporting
                      console.log('Report error tapped');
                    }}
                  >
                    <Text style={styles.reportText}>Report Issue</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          </LinearGradient>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  errorCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  errorDetails: {
    backgroundColor: theme.colors.surface.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xl,
    width: '100%',
  },
  errorMessage: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.status.error,
    fontFamily: 'monospace',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
  },
  retryButton: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  reportButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  reportText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textDecorationLine: 'underline',
  },
});

export default ErrorBoundary; 