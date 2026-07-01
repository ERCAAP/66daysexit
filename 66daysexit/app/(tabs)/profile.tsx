import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/stores/authStore';
import { changeLanguage } from '../../src/i18n';
import { SocialFeatures } from '../../src/utils/socialFeatures';
import { useTheme } from '../../src/components/ui/ThemeProvider';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  disabled?: boolean;
  rightComponent?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showArrow = true,
  disabled = false,
  rightComponent 
}) => (
  <TouchableOpacity 
    style={[styles.settingItem, disabled && styles.settingItemDisabled]} 
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.settingIcon}>
      <Ionicons 
        name={icon as any} 
        size={20} 
        color={disabled ? theme.colors.text.muted : theme.colors.primary.start} 
      />
    </View>
    <View style={styles.settingContent}>
      <Text style={[styles.settingTitle, disabled && styles.settingTitleDisabled]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.settingSubtitle, disabled && styles.settingSubtitleDisabled]}>
          {subtitle}
        </Text>
      )}
    </View>
    {rightComponent}
    {showArrow && !rightComponent && (
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={disabled ? theme.colors.text.muted : theme.colors.text.secondary} 
      />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { userProfile, signOut } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    Alert.alert(
      t('profile.signOut'),
      t('profile.signOutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('profile.signOut'), 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/welcome');
          }
        },
      ]
    );
  };

  const handleLanguageChange = async () => {
    const newLanguage = i18n.language === 'en' ? 'tr' : 'en';
    await changeLanguage(newLanguage);
  };

  const handleShareApp = () => {
    SocialFeatures.shareApp();
  };

  const handleRateApp = () => {
    SocialFeatures.rateApp();
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
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('profile.title')}</Text>
          </View>

          {/* Profile Card */}
          <Card variant="glass" style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {userProfile?.displayName || 'Phoenix User'}
                </Text>
                <Text style={styles.profileEmail}>
                  {userProfile?.email || 'Anonymous User'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => router.push('/profile/edit' as any)}
              >
                <Ionicons name="create-outline" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile?.currentDay || 0}</Text>
                <Text style={styles.statLabel}>Days Active</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile?.level || 1}</Text>
                <Text style={styles.statLabel}>Level</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile?.xp || 0}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile?.streak || 0}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </Card>

          {/* Settings Sections */}
          
          {/* Account Settings */}
          <Card variant="glass" style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <SettingItem
              icon="person-outline"
              title="Edit Profile" 
              subtitle="Update your personal information"
              onPress={() => router.push('/profile/edit' as any)}
            />
            
            <SettingItem
              icon="lock-closed-outline"
              title="Change Password"
              subtitle="Update your account password"
              onPress={() => router.push('/auth/forgot-password' as any)}
            />
          </Card>

          {/* App Settings */}
          <Card variant="glass" style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Manage your notification preferences"
              onPress={() => router.push('/profile/notifications' as any)}
            />

            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              subtitle={isDark ? 'Dark theme enabled' : 'Light theme enabled'}
              onPress={() => {}}
              showArrow={false}
              rightComponent={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ 
                    false: theme.colors.surface.secondary, 
                    true: theme.colors.primary.start 
                  }}
                  thumbColor={isDark ? theme.colors.primary.end : theme.colors.text.muted}
                />
              }
            />

            <SettingItem
              icon="language-outline"
              title="Language"
              subtitle={i18n.language === 'en' ? 'English' : 'Türkçe'}
              onPress={handleLanguageChange}
            />
          </Card>

          {/* Support */}
          <Card variant="glass" style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <SettingItem
              icon="help-circle-outline"
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() => router.push('/profile/support' as any)}
            />

            <SettingItem
              icon="star-outline"
              title="Rate App"
              subtitle="Rate us on the App Store"
              onPress={handleRateApp}
            />

            <SettingItem
              icon="share-outline"
              title="Share App"
              subtitle="Share Phoenix with friends"
              onPress={handleShareApp}
            />

            <SettingItem
              icon="information-circle-outline"
              title="About"
              subtitle="App version and legal information"
              onPress={() => router.push('/profile/about' as any)}
            />
          </Card>

          {/* Social Features */}
          <Card variant="glass" style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Social</Text>
            
            <SettingItem
              icon="logo-twitter"
              title="Follow us on Twitter"
              subtitle="@phoenix66days"
              onPress={() => SocialFeatures.openTwitter()}
            />

            <SettingItem
              icon="logo-instagram"
              title="Follow us on Instagram"
              subtitle="@phoenix66days"
              onPress={() => SocialFeatures.openInstagram()}
            />
          </Card>

          {/* Sign Out */}
          <View style={styles.signOutContainer}>
            <Button
              title={t('profile.signOut')}
              variant="outline"
              size="large"
              onPress={handleSignOut}
              style={styles.signOutButton}
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  profileCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary.start,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.inverse,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  editButton: {
    padding: theme.spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  settingsCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.glass,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  settingTitleDisabled: {
    color: theme.colors.text.muted,
  },
  settingSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  settingSubtitleDisabled: {
    color: theme.colors.text.muted,
  },
  signOutContainer: {
    marginTop: theme.spacing.xl,
  },
  signOutButton: {
    borderColor: theme.colors.status.error,
  },
}); 