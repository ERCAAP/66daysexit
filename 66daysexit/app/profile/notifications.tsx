import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import TimePicker from '../../src/components/ui/TimePicker';

interface NotificationSettings {
  dailyReminders: boolean;
  taskReminders: boolean;
  achievements: boolean;
  weeklyProgress: boolean;
  motivation: boolean;
  streakReminders: boolean;
  reminderTime: string;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
}

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [settings, setSettings] = useState<NotificationSettings>({
    dailyReminders: true,
    taskReminders: true,
    achievements: true,
    weeklyProgress: true,
    motivation: false,
    streakReminders: true,
    reminderTime: '09:00',
    quietHours: true,
    quietStart: '22:00',
    quietEnd: '07:00',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [timePickerType, setTimePickerType] = useState<'reminderTime' | 'quietStart' | 'quietEnd'>('reminderTime');

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would save to Firebase/backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Your notification settings have been updated.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimePress = (timeType: 'reminderTime' | 'quietStart' | 'quietEnd') => {
    setTimePickerType(timeType);
    setTimePickerVisible(true);
  };

  const handleTimeConfirm = (time: string) => {
    setSettings(prev => ({
      ...prev,
      [timePickerType]: time,
    }));
    setTimePickerVisible(false);
  };

  const formatTime12Hour = (time24: string): string => {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const getTimePickerTitle = (): string => {
    switch (timePickerType) {
      case 'reminderTime':
        return 'Daily Reminder Time';
      case 'quietStart':
        return 'Quiet Hours Start';
      case 'quietEnd':
        return 'Quiet Hours End';
      default:
        return 'Select Time';
    }
  };

  const notificationTypes = [
    {
      key: 'dailyReminders' as keyof NotificationSettings,
      title: 'Daily Reminders',
      description: 'Get reminded to check your daily tasks',
      icon: 'today-outline',
    },
    {
      key: 'taskReminders' as keyof NotificationSettings,
      title: 'Task Reminders',
      description: 'Reminders for incomplete tasks',
      icon: 'checkbox-outline',
    },
    {
      key: 'achievements' as keyof NotificationSettings,
      title: 'Achievements',
      description: 'Celebrate your accomplishments',
      icon: 'trophy-outline',
    },
    {
      key: 'weeklyProgress' as keyof NotificationSettings,
      title: 'Weekly Progress',
      description: 'Weekly summary of your progress',
      icon: 'trending-up-outline',
    },
    {
      key: 'motivation' as keyof NotificationSettings,
      title: 'Motivational Messages',
      description: 'Inspiring quotes and tips',
      icon: 'heart-outline',
    },
    {
      key: 'streakReminders' as keyof NotificationSettings,
      title: 'Streak Reminders',
      description: 'Don\'t lose your streak!',
      icon: 'flame-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradients.background.colors as [string, string, ...string[]]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Notification Types */}
          <Card variant="glass" style={styles.card}>
            <Text style={styles.sectionTitle}>Notification Types</Text>
            
            {notificationTypes.map((item, index) => (
              <View 
                key={item.key} 
                style={[
                  styles.settingItem,
                  index < notificationTypes.length - 1 && styles.settingItemBorder
                ]}
              >
                <View style={styles.settingIcon}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={22} 
                    color={theme.colors.text.secondary} 
                  />
                </View>
                
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingDescription}>{item.description}</Text>
                </View>
                
                <Switch
                  value={settings[item.key] as boolean}
                  onValueChange={() => handleToggle(item.key)}
                  trackColor={{
                    false: theme.colors.surface.secondary,
                    true: theme.colors.primary.start,
                  }}
                  thumbColor={
                    settings[item.key] 
                      ? theme.colors.text.inverse 
                      : theme.colors.text.muted
                  }
                />
              </View>
            ))}
          </Card>

          {/* Timing Settings */}
          <Card variant="glass" style={styles.card}>
            <Text style={styles.sectionTitle}>Timing Settings</Text>
            
            {/* Daily Reminder Time */}
            <TouchableOpacity
              style={styles.timeSettingItem}
              onPress={() => handleTimePress('reminderTime')}
              disabled={!settings.dailyReminders}
            >
              <View style={styles.timeSettingContent}>
                <Text style={[
                  styles.timeSettingTitle,
                  !settings.dailyReminders && styles.disabledText
                ]}>
                  Daily Reminder Time
                </Text>
                <Text style={[
                  styles.timeSettingValue,
                  !settings.dailyReminders && styles.disabledText
                ]}>
                  {formatTime12Hour(settings.reminderTime)}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={settings.dailyReminders ? theme.colors.text.secondary : theme.colors.text.muted} 
              />
            </TouchableOpacity>

            {/* Quiet Hours Toggle */}
            <View style={[styles.settingItem, styles.settingItemBorder]}>
              <View style={styles.settingIcon}>
                <Ionicons 
                  name="moon-outline" 
                  size={22} 
                  color={theme.colors.text.secondary} 
                />
              </View>
              
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Quiet Hours</Text>
                <Text style={styles.settingDescription}>
                  Disable notifications during quiet hours
                </Text>
              </View>
              
              <Switch
                value={settings.quietHours}
                onValueChange={() => handleToggle('quietHours')}
                trackColor={{
                  false: theme.colors.surface.secondary,
                  true: theme.colors.primary.start,
                }}
                thumbColor={
                  settings.quietHours 
                    ? theme.colors.text.inverse 
                    : theme.colors.text.muted
                }
              />
            </View>

            {/* Quiet Hours Time Range */}
            {settings.quietHours && (
              <View style={styles.quietHoursContainer}>
                <TouchableOpacity
                  style={styles.timeSettingItem}
                  onPress={() => handleTimePress('quietStart')}
                >
                  <View style={styles.timeSettingContent}>
                    <Text style={styles.timeSettingTitle}>Start Time</Text>
                    <Text style={styles.timeSettingValue}>
                      {formatTime12Hour(settings.quietStart)}
                    </Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.timeSettingItem}
                  onPress={() => handleTimePress('quietEnd')}
                >
                  <View style={styles.timeSettingContent}>
                    <Text style={styles.timeSettingTitle}>End Time</Text>
                    <Text style={styles.timeSettingValue}>
                      {formatTime12Hour(settings.quietEnd)}
                    </Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
              </View>
            )}
          </Card>

          {/* Permission Notice */}
          <Card variant="glass" style={styles.noticeCard}>
            <View style={styles.noticeIcon}>
              <Ionicons 
                name="information-circle-outline" 
                size={24} 
                color={theme.colors.status.info} 
              />
            </View>
            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle}>Permission Required</Text>
              <Text style={styles.noticeText}>
                Make sure notifications are enabled in your device settings for the best experience.
              </Text>
            </View>
          </Card>

          {/* Save Button */}
          <Button
            title="Save Settings"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            onPress={handleSave}
            style={styles.saveButton}
          />
        </ScrollView>

        {/* Time Picker Modal */}
        <TimePicker
          visible={timePickerVisible}
          onConfirm={handleTimeConfirm}
          onCancel={() => setTimePickerVisible(false)}
          initialTime={settings[timePickerType]}
          title={getTimePickerTitle()}
        />
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  settingIcon: {
    width: 40,
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
  },
  settingDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  timeSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  timeSettingContent: {
    flex: 1,
  },
  timeSettingTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  timeSettingValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary.start,
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.weights.semibold,
  },
  disabledText: {
    color: theme.colors.text.muted,
  },
  quietHoursContainer: {
    marginTop: theme.spacing.md,
    paddingLeft: theme.spacing.xl,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  noticeIcon: {
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  noticeText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: theme.spacing.md,
  },
}); 