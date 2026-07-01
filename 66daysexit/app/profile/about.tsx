import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import Card from '../../src/components/ui/Card';

export default function AboutScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const appInfo = {
    version: '1.0.0',
    buildNumber: '2024.1.0',
    releaseDate: 'January 2024',
    platform: 'React Native',
  };

  const legalLinks = [
    {
      title: 'Privacy Policy',
      description: 'How we protect your data',
      icon: 'shield-checkmark-outline',
      onPress: () => Linking.openURL('https://phoenix66days.com/privacy'),
    },
    {
      title: 'Terms of Service',
      description: 'Terms and conditions of use',
      icon: 'document-text-outline',
      onPress: () => Linking.openURL('https://phoenix66days.com/terms'),
    },
    {
      title: 'Cookie Policy',
      description: 'How we use cookies',
      icon: 'analytics-outline',
      onPress: () => Linking.openURL('https://phoenix66days.com/cookies'),
    },
    {
      title: 'Data Export',
      description: 'Download your data',
      icon: 'download-outline',
      onPress: () => Linking.openURL('https://phoenix66days.com/data-export'),
    },
  ];

  const socialLinks = [
    {
      title: 'Website',
      url: 'https://phoenix66days.com',
      icon: 'globe-outline',
    },
    {
      title: 'Twitter',
      url: 'https://twitter.com/phoenix66days',
      icon: 'logo-twitter',
    },
    {
      title: 'Instagram',
      url: 'https://instagram.com/phoenix66days',
      icon: 'logo-instagram',
    },
    {
      title: 'LinkedIn',
      url: 'https://linkedin.com/company/phoenix66days',
      icon: 'logo-linkedin',
    },
  ];

  const credits = [
    'Built with React Native & Expo',
    'Icons by Ionicons',
    'Fonts by Google Fonts',
    'Illustrations by Undraw',
    'Research based on Dr. Phillippa Lally\'s habit formation study',
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
            <Text style={styles.title}>About</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* App Info */}
          <Card variant="glass" style={styles.card}>
            <View style={styles.appLogoSection}>
              <View style={styles.appLogo}>
                <Text style={styles.appLogoText}>Phoenix</Text>
              </View>
              <Text style={styles.appName}>Phoenix - 66 Day Life Transformation</Text>
              <Text style={styles.appTagline}>Transform your life, one day at a time</Text>
            </View>
          </Card>

          {/* Version Info */}
          <Card variant="glass" style={styles.card}>
            <Text style={styles.sectionTitle}>Version Information</Text>
            
            <View style={styles.versionInfo}>
              <View style={styles.versionItem}>
                <Text style={styles.versionLabel}>Version</Text>
                <Text style={styles.versionValue}>{appInfo.version}</Text>
              </View>
              
              <View style={styles.versionItem}>
                <Text style={styles.versionLabel}>Build</Text>
                <Text style={styles.versionValue}>{appInfo.buildNumber}</Text>
              </View>
              
              <View style={styles.versionItem}>
                <Text style={styles.versionLabel}>Release Date</Text>
                <Text style={styles.versionValue}>{appInfo.releaseDate}</Text>
              </View>
              
              <View style={styles.versionItem}>
                <Text style={styles.versionLabel}>Platform</Text>
                <Text style={styles.versionValue}>{appInfo.platform}</Text>
              </View>
            </View>
          </Card>

          {/* About the App */}
          <Card variant="glass" style={styles.card}>
            <Text style={styles.sectionTitle}>About Phoenix</Text>
            
            <Text style={styles.aboutText}>
              Phoenix is designed to help you build lasting habits through scientifically-backed methodology. 
              Based on research showing it takes 66 days on average to form a new habit, our app guides you 
              through a comprehensive transformation journey.
            </Text>
            
            <Text style={styles.aboutText}>
              We focus on six core areas of life: sleep, hydration, exercise, mental health, screen time 
              management, and personal hygiene. Each area is carefully crafted to support your overall 
              well-being and personal growth.
            </Text>
          </Card>

          {/* Legal & Privacy */}
          <Card variant="glass" style={styles.card}>
            <Text style={styles.sectionTitle}>Legal & Privacy</Text>
            
            {legalLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.legalLink,
                  index < legalLinks.length - 1 && styles.legalLinkBorder
                ]}
                onPress={link.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.legalIcon}>
                  <Ionicons 
                    name={link.icon as any} 
                    size={20} 
                    color={theme.colors.text.secondary} 
                  />
                </View>
                
                <View style={styles.legalContent}>
                  <Text style={styles.legalTitle}>{link.title}</Text>
                  <Text style={styles.legalDescription}>{link.description}</Text>
                </View>
                
                <Ionicons 
                  name="open-outline" 
                  size={16} 
                  color={theme.colors.text.muted} 
                />
              </TouchableOpacity>
            ))}
          </Card>

          {/* Social Links */}
          <Card variant="glass" style={styles.card}>
            <Text style={styles.sectionTitle}>Connect With Us</Text>
            
            <View style={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.socialLink}
                  onPress={() => Linking.openURL(social.url)}
                  activeOpacity={0.7}
                >
                  <View style={styles.socialIcon}>
                    <Ionicons 
                      name={social.icon as any} 
                      size={24} 
                      color={theme.colors.primary.start} 
                    />
                  </View>
                  <Text style={styles.socialTitle}>{social.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Credits */}
          <Card variant="glass" style={styles.card}>
            <Text style={styles.sectionTitle}>Credits & Acknowledgments</Text>
            
            {credits.map((credit, index) => (
              <View key={index} style={styles.creditItem}>
                <Ionicons 
                  name="checkmark-circle-outline" 
                  size={16} 
                  color={theme.colors.success.start} 
                />
                <Text style={styles.creditText}>{credit}</Text>
              </View>
            ))}
          </Card>

          {/* Copyright */}
          <View style={styles.copyright}>
            <Text style={styles.copyrightText}>
              © 2024 Phoenix App. All rights reserved.
            </Text>
            <Text style={styles.copyrightSubtext}>
              Made with ❤️ for your transformation journey
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
  appLogoSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  appLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary.start,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  appLogoText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.inverse,
  },
  appName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  appTagline: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  versionInfo: {
    gap: theme.spacing.md,
  },
  versionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  versionValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  aboutText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.base,
    marginBottom: theme.spacing.md,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  legalLinkBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  legalIcon: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  legalContent: {
    flex: 1,
  },
  legalTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  legalDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  socialLink: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.md,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  socialTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  creditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  creditText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  copyright: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  copyrightText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  copyrightSubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
}); 