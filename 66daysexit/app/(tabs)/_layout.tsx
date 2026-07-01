import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary.start,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.background.card,
          borderTopColor: theme.colors.border.primary,
          borderTopWidth: 1,
          paddingTop: Platform.OS === 'ios' ? 8 : 0,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.xs,
          fontWeight: theme.typography.weights.medium,
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: t('tasks.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t('progress.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 