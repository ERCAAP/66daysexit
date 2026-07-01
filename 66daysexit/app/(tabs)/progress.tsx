import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import Card from '../../src/components/ui/Card';
import ProgressBar from '../../src/components/ui/ProgressBar';
import CircularProgress from '../../src/components/ui/CircularProgress';
import AnimatedCounter from '../../src/components/ui/AnimatedCounter';
import { LineChart, BarChart } from '../../src/components/ui/Charts';
import { useAuthStore } from '../../src/stores/authStore';

export default function ProgressScreen() {
  const { t } = useTranslation();
  const { userProfile } = useAuthStore();

  // Mock data for demo - in real app this would come from Firebase
  const stats = {
    totalDays: userProfile?.currentDay || 15,
    completionRate: 78,
    currentStreak: userProfile?.streak || 8,
    longestStreak: 15,
    totalXP: userProfile?.xp || 1240,
    level: userProfile?.level || 4,
    weeklyProgress: [65, 72, 68, 81, 75, 78, 85], // Last 7 days completion %
    categoryProgress: [
      { label: 'Sleep', value: 85, color: theme.colors.primary.start },
      { label: 'Water', value: 92, color: theme.colors.success.start },
      { label: 'Exercise', value: 73, color: theme.colors.secondary.start },
      { label: 'Mind', value: 88, color: theme.colors.warning.start },
      { label: 'Screen', value: 56, color: theme.colors.status.error },
      { label: 'Shower', value: 94, color: theme.colors.status.info },
    ],
    monthlyData: [45, 52, 48, 65, 72, 68, 81, 75, 78, 85, 89, 92], // Last 12 months
    habitCompletion: {
      completed: 234,
      total: 300,
      percentage: 78,
    },
  };

  const achievements = [
    { 
      title: 'Week Warrior', 
      description: '7-day streak completed!', 
      unlocked: true,
      rarity: 'rare' as const
    },
    { 
      title: 'Hydration Hero', 
      description: '30 days of perfect water intake', 
      unlocked: true,
      rarity: 'epic' as const
    },
    { 
      title: 'Phoenix Rising', 
      description: 'Complete the 66-day journey', 
      unlocked: false,
      rarity: 'legendary' as const
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
            <Text style={styles.title}>{t('progress.title')}</Text>
            <Text style={styles.subtitle}>Track your transformation journey</Text>
          </View>

          {/* Key Metrics */}
          <View style={styles.metricsGrid}>
            <Card variant="glass" style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                  <Ionicons name="calendar" size={24} color={theme.colors.primary.start} />
                </View>
                <AnimatedCounter 
                  value={stats.totalDays} 
                  style={styles.metricValue}
                />
                <Text style={styles.metricLabel}>Days Active</Text>
              </View>
            </Card>

            <Card variant="glass" style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                  <Ionicons name="trending-up" size={24} color={theme.colors.success.start} />
                </View>
                <AnimatedCounter 
                  value={stats.completionRate} 
                  suffix="%" 
                  style={styles.metricValue}
                />
                <Text style={styles.metricLabel}>Completion Rate</Text>
              </View>
            </Card>

            <Card variant="glass" style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                  <Ionicons name="flame" size={24} color={theme.colors.secondary.start} />
                </View>
                <AnimatedCounter 
                  value={stats.currentStreak} 
                  style={styles.metricValue}
                />
                <Text style={styles.metricLabel}>Current Streak</Text>
              </View>
            </Card>

            <Card variant="glass" style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={styles.metricIcon}>
                  <Ionicons name="star" size={24} color={theme.colors.warning.start} />
                </View>
                <AnimatedCounter 
                  value={stats.totalXP} 
                  style={styles.metricValue}
                />
                <Text style={styles.metricLabel}>Total XP</Text>
              </View>
            </Card>
          </View>

          {/* Weekly Progress Chart */}
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Weekly Progress</Text>
              <Text style={styles.cardSubtitle}>Your consistency over the last 7 days</Text>
            </View>
            <LineChart
              data={stats.weeklyProgress}
              labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
              color={theme.colors.primary.start}
              style={styles.chart}
            />
          </Card>

          {/* Category Performance */}
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Category Performance</Text>
              <Text style={styles.cardSubtitle}>How you&apos;re doing in each area</Text>
            </View>
            <View style={styles.categoryList}>
              {stats.categoryProgress.map((category, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                    <Text style={styles.categoryValue}>{category.value}%</Text>
                  </View>
                  <ProgressBar
                    progress={category.value}
                    height={8}
                    color={category.color}
                    animated
                    style={styles.categoryProgress}
                  />
                </View>
              ))}
            </View>
          </Card>

          {/* Habit Completion Overview */}
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Overall Progress</Text>
              <Text style={styles.cardSubtitle}>Your journey at a glance</Text>
            </View>
            <View style={styles.overallProgressContainer}>
              <CircularProgress
                progress={stats.habitCompletion.percentage}
                size={120}
                strokeWidth={12}
                color={theme.colors.primary.start}
                backgroundColor={theme.colors.surface.glass}
                showPercentage
                style={styles.circularProgress}
              />
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <AnimatedCounter value={stats.habitCompletion.completed} style={styles.statValue} />
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.progressStat}>
                  <AnimatedCounter value={stats.habitCompletion.total} style={styles.statValue} />
                  <Text style={styles.statLabel}>Total Tasks</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Monthly Trend */}
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Monthly Trend</Text>
              <Text style={styles.cardSubtitle}>Long-term progress over the year</Text>
            </View>
            <BarChart
              data={stats.monthlyData}
              labels={['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']}
              color={theme.colors.secondary.start}
              style={styles.chart}
            />
          </Card>

          {/* Achievements Section */}
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Recent Achievements</Text>
              <Text style={styles.cardSubtitle}>Celebrating your wins!</Text>
            </View>
            <View style={styles.achievementsList}>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.unlocked ? theme.colors.success.start : theme.colors.surface.secondary }
                  ]}>
                    <Ionicons 
                      name={achievement.unlocked ? "trophy" : "lock-closed"} 
                      size={20} 
                      color={achievement.unlocked ? theme.colors.text.inverse : theme.colors.text.muted}
                    />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={[
                      styles.achievementTitle,
                      !achievement.unlocked && styles.achievementTitleLocked
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      !achievement.unlocked && styles.achievementDescriptionLocked
                    ]}>
                      {achievement.description}
                    </Text>
                  </View>
                  <View style={styles.achievementRarity}>
                    <Text style={[
                      styles.rarityText,
                      { color: getRarityColor(achievement.rarity) }
                    ]}>
                      {achievement.rarity.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* Insights */}
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Insights & Tips</Text>
              <Text style={styles.cardSubtitle}>Personalized recommendations</Text>
            </View>
            <View style={styles.insightsList}>
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="bulb" size={20} color={theme.colors.warning.start} />
                </View>
                <Text style={styles.insightText}>
                  You&apos;re doing great with hydration! Keep up the excellent work.
                </Text>
              </View>
              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Ionicons name="trending-up" size={20} color={theme.colors.success.start} />
                </View>
                <Text style={styles.insightText}>
                  Your consistency has improved 15% this week. Amazing progress!
                </Text>
              </View>
            </View>
          </Card>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function getRarityColor(rarity: 'common' | 'rare' | 'epic' | 'legendary'): string {
  const colors = {
    common: theme.colors.text.secondary,
    rare: theme.colors.primary.start,
    epic: theme.colors.secondary.start,
    legendary: theme.colors.warning.start,
  };
  return colors[rarity];
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
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  metricCard: {
    width: '48%',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  metricContent: {
    alignItems: 'center',
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  metricValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  metricLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.xl,
  },
  cardHeader: {
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  chart: {
    marginTop: theme.spacing.md,
  },
  categoryList: {
    marginTop: theme.spacing.md,
  },
  categoryItem: {
    marginBottom: theme.spacing.lg,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryLabel: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  categoryValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.secondary,
  },
  categoryProgress: {
    marginTop: theme.spacing.xs,
  },
  overallProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  circularProgress: {
    marginRight: theme.spacing.xl,
  },
  progressStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
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
  achievementsList: {
    marginTop: theme.spacing.md,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  achievementTitleLocked: {
    color: theme.colors.text.muted,
  },
  achievementDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  achievementDescriptionLocked: {
    color: theme.colors.text.muted,
  },
  achievementRarity: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface.glass,
  },
  rarityText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
  },
  insightsList: {
    marginTop: theme.spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  insightText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
}); 