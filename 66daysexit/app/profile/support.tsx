import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';

interface FAQ {
  question: string;
  answer: string;
  expanded: boolean;
}

export default function SupportScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: 'How does the 66-day program work?',
      answer: 'The 66-day program is based on scientific research showing it takes an average of 66 days to form a new habit. Our app guides you through daily tasks across 6 core areas: sleep, water, exercise, mind, screen time, and shower habits.',
      expanded: false,
    },
    {
      question: 'Can I customize my daily tasks?',
      answer: 'Yes! During onboarding, we assess your current habits and goals to create a personalized program. As you progress, the app adapts to your performance and preferences.',
      expanded: false,
    },
    {
      question: 'What happens if I miss a day?',
      answer: 'Don&apos;t worry! Missing a day doesn&apos;t reset your progress. The app is designed to be forgiving. Your streak might reset, but your overall progress and XP remain. The key is to get back on track as soon as possible.',
      expanded: false,
    },
    {
      question: 'How is my XP and level calculated?',
      answer: 'You earn XP by completing daily tasks. Different tasks have different XP values based on their difficulty. Your level increases as you accumulate XP, with each level requiring more XP than the previous one.',
      expanded: false,
    },
    {
      question: 'Can I use the app offline?',
      answer: 'Yes! Most features work offline. Your progress is saved locally and synced when you reconnect to the internet. However, some features like achievements and social sharing require an internet connection.',
      expanded: false,
    },
    {
      question: 'How do I reset my progress?',
      answer: 'If you want to start over, you can reset your progress in the profile settings. Note that this action cannot be undone and will delete all your current progress, XP, and achievements.',
      expanded: false,
    },
  ]);

  const toggleFAQ = (index: number) => {
    setFaqs(prev => prev.map((faq, i) => 
      i === index ? { ...faq, expanded: !faq.expanded } : faq
    ));
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you\'d like to contact us:',
      [
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@phoenix66days.com?subject=Phoenix Support Request'),
        },
        {
          text: 'Help Center',
          onPress: () => Linking.openURL('https://phoenix66days.com/help'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleReportBug = () => {
    Alert.alert(
      'Report a Bug',
      'Help us improve the app by reporting bugs:',
      [
        {
          text: 'Send Email',
          onPress: () => Linking.openURL('mailto:bugs@phoenix66days.com?subject=Bug Report - Phoenix App'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleFeatureRequest = () => {
    Alert.alert(
      'Feature Request',
      'Have an idea for a new feature?',
      [
        {
          text: 'Send Suggestion',
          onPress: () => Linking.openURL('mailto:features@phoenix66days.com?subject=Feature Request - Phoenix App'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const supportOptions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: 'headset-outline',
      onPress: handleContactSupport,
    },
    {
      title: 'Report a Bug',
      description: 'Found something that isn\'t working?',
      icon: 'bug-outline',
      onPress: handleReportBug,
    },
    {
      title: 'Feature Request',
      description: 'Suggest new features or improvements',
      icon: 'bulb-outline',
      onPress: handleFeatureRequest,
    },
    {
      title: 'Help Center',
      description: 'Browse our online help resources',
      icon: 'library-outline',
      onPress: () => Linking.openURL('https://phoenix66days.com/help'),
    },
  ];

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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={theme.colors.text.primary} 
              />
            </TouchableOpacity>
            <Text style={styles.title}>Support</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Quick Actions */}
          <Card variant="glass" style={styles.card}>
            <Text style={styles.sectionTitle}>How can we help?</Text>
            
            {supportOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.supportOption,
                  index < supportOptions.length - 1 && styles.supportOptionBorder
                ]}
                onPress={option.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.supportIcon}>
                  <Ionicons 
                    name={option.icon as any} 
                    size={24} 
                    color={theme.colors.primary.start} 
                  />
                </View>
                
                <View style={styles.supportContent}>
                  <Text style={styles.supportTitle}>{option.title}</Text>
                  <Text style={styles.supportDescription}>{option.description}</Text>
                </View>
                
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={theme.colors.text.muted} 
                />
              </TouchableOpacity>
            ))}
          </Card>

          {/* FAQs */}
          <Card variant="glass" style={styles.card}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Ionicons 
                    name={faq.expanded ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
                
                {faq.expanded && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </Card>

          {/* System Info */}
          <Card variant="glass" style={styles.card}>
            <Text style={styles.sectionTitle}>System Information</Text>
            
            <View style={styles.systemInfo}>
              <View style={styles.systemInfoItem}>
                <Text style={styles.systemInfoLabel}>App Version</Text>
                <Text style={styles.systemInfoValue}>1.0.0</Text>
              </View>
              
              <View style={styles.systemInfoItem}>
                <Text style={styles.systemInfoLabel}>Platform</Text>
                <Text style={styles.systemInfoValue}>React Native</Text>
              </View>
              
              <View style={styles.systemInfoItem}>
                <Text style={styles.systemInfoLabel}>Support ID</Text>
                <Text style={styles.systemInfoValue}>#PHX-2024-001</Text>
              </View>
            </View>
          </Card>

          {/* Emergency Contact */}
          <Card variant="glass" style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Ionicons 
                name="warning-outline" 
                size={24} 
                color={theme.colors.warning.start} 
              />
              <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
            </View>
            
            <Text style={styles.emergencyText}>
              If you're experiencing a mental health crisis, please contact your local emergency services or a mental health professional immediately.
            </Text>
            
            <Button
              title="Crisis Resources"
              variant="outline"
              size="medium"
              onPress={() => Linking.openURL('https://phoenix66days.com/crisis-resources')}
              style={styles.emergencyButton}
            />
          </Card>
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
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
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  supportOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  supportDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  faqItem: {
    marginBottom: theme.spacing.md,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  faqQuestionText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  faqAnswer: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  faqAnswerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm,
  },
  systemInfo: {
    gap: theme.spacing.md,
  },
  systemInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  systemInfoLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  systemInfoValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  emergencyCard: {
    borderWidth: 1,
    borderColor: theme.colors.warning.start,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  emergencyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.warning.start,
    marginLeft: theme.spacing.md,
  },
  emergencyText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm,
    marginBottom: theme.spacing.lg,
  },
  emergencyButton: {
    borderColor: theme.colors.warning.start,
  },
}); 