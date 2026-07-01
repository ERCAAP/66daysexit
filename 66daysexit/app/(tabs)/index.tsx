import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import SkeletonLoader, { SkeletonCard, SkeletonList } from '../../src/components/ui/SkeletonLoader';
import CircularProgress from '../../src/components/ui/CircularProgress';
import AnimatedCounter from '../../src/components/ui/AnimatedCounter';
import { useAuthStore } from '../../src/stores/authStore';
import { programGenerator, DailyTask } from '../../src/services/programGenerator';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const [todaysTasks, setTodaysTasks] = useState<DailyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock program for testing - in real app this would come from Firebase
      if (userProfile) {
        const mockProgram = programGenerator.generateProgram(
          {
            sleep: 6,
            exercise: 2,
            water: 5,
            screenTime: 8,
            stress: 4,
            goals: ['Better Sleep', 'More Exercise', 'Less Screen Time']
          },
          userProfile.id
        );
        
        const tasks = programGenerator.getTodaysTasks(mockProgram);
        setTodaysTasks(tasks);
      }
      
      setIsLoading(false);
    };

    loadDashboardData();
  }, [userProfile]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completedTasksCount = todaysTasks.filter(task => task.isCompleted).length;
  const completionPercentage = todaysTasks.length > 0 ? (completedTasksCount / todaysTasks.length) * 100 : 0;

  const getCategoryColor = (category: string): string => {
    const colors = {
      sleep: theme.colors.primary.start,
      water: theme.colors.success.start,
      exercise: theme.colors.secondary.start,
      mind: theme.colors.warning.start,
      screenTime: theme.colors.status.error,
      shower: theme.colors.status.info,
    };
    return colors[category as keyof typeof colors] || theme.colors.text.secondary;
  };

  const getCategoryIcon = (category: string): any => {
    const icons = {
      sleep: 'moon',
      water: 'water',
      exercise: 'fitness',
      mind: 'brain',
      screenTime: 'phone-portrait',
      shower: 'water-outline',
    };
    return icons[category as keyof typeof icons] || 'ellipse';
  };

  if (isLoading) {
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
            {/* Header Skeleton */}
            <View style={styles.headerSkeleton}>
              <SkeletonLoader width="40%" height={32} style={styles.titleSkeleton} />
              <SkeletonLoader width="60%" height={20} style={styles.subtitleSkeleton} />
            </View>

            {/* Progress Card Skeleton */}
            <SkeletonCard style={styles.progressCardSkeleton} />

            {/* Level Card Skeleton */}
            <SkeletonCard style={styles.levelCardSkeleton} />

            {/* Tasks Skeleton */}
            <SkeletonCard style={styles.tasksCardSkeleton}>
              <SkeletonLoader width="50%" height={24} style={{ marginBottom: 16 }} />
              <SkeletonList count={3} />
            </SkeletonCard>

            {/* Quick Actions Skeleton */}
            <View style={styles.quickActionsSkeleton}>
              <SkeletonLoader width={120} height={48} style={styles.actionButtonSkeleton} />
              <SkeletonLoader width={120} height={48} style={styles.actionButtonSkeleton} />
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
        >
          {/* Greeting Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>
              {userProfile?.displayName || 'Phoenix Warrior'}
            </Text>
          </View>

          {/* Today's Progress */}
          <Card variant="glass" style={styles.progressCard}>
            <Text style={styles.cardTitle}>{t('dashboard.todaysProgress')}</Text>
            
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>Day {userProfile?.currentDay || 1}</Text>
                <Text style={styles.statLabel}>of 66</Text>
              </View>
              
              <CircularProgress
                progress={completionPercentage}
                size={100}
                color="primary"
                showPercentage={false}
              >
                <View style={styles.circularProgressContent}>
                  <AnimatedCounter 
                    value={completionPercentage} 
                    format={(val) => `${Math.round(val)}%`}
                    size="medium"
                  />
                  <Text style={styles.circularProgressLabel}>Complete</Text>
                </View>
              </CircularProgress>
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile?.streak || 0}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </Card>

          {/* Level & XP */}
          <Card variant="glass" style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <Text style={styles.cardTitle}>Level {userProfile?.level || 1}</Text>
              <Text style={styles.xpText}>{userProfile?.xp || 0} XP</Text>
            </View>
            
            <View style={styles.xpBar}>
              <View style={styles.xpBarBackground}>
                <View 
                  style={[
                    styles.xpBarFill,
                    { width: `${((userProfile?.xp || 0) % 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.xpNextLevel}>
                {100 - ((userProfile?.xp || 0) % 100)} XP to next level
              </Text>
            </View>
          </Card>

          {/* Today's Tasks Preview */}
          <Card variant="glass" style={styles.tasksCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{t('dashboard.todaysTasks')}</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
                <Text style={styles.viewAllButton}>{t('dashboard.viewAll')}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tasksList}>
              {todaysTasks.slice(0, 3).map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={styles.taskContent}>
                    <View style={[
                      styles.taskIcon,
                      { backgroundColor: getCategoryColor(task.category) }
                    ]}>
                      <Ionicons 
                        name={getCategoryIcon(task.category)} 
                        size={16} 
                        color={theme.colors.text.inverse} 
                      />
                    </View>
                    
                    <View style={styles.taskInfo}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <Text style={styles.taskMeta}>
                        {task.timeEstimate} • {task.xpReward} XP
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.taskCheckbox,
                      task.isCompleted && styles.taskCheckboxCompleted
                    ]}
                  >
                    {task.isCompleted && (
                      <Ionicons 
                        name="checkmark" 
                        size={16} 
                        color={theme.colors.text.inverse} 
                      />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
              
              {todaysTasks.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons 
                    name="calendar-outline" 
                    size={48} 
                    color={theme.colors.text.muted} 
                  />
                  <Text style={styles.emptyStateText}>
                    No tasks for today
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    Your personalized tasks will appear here
                  </Text>
                </View>
              )}
            </View>
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Button
              title="View All Tasks"
              variant="primary"
              size="medium"
              onPress={() => router.push('/(tabs)/tasks')}
              style={styles.actionButton}
            />
            
            <Button
              title="Check Progress"
              variant="outline"
              size="medium"
              onPress={() => router.push('/(tabs)/progress')}
              style={styles.actionButton}
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
    paddingBottom: theme.spacing.xl,
  },
  
  // Loading States
  headerSkeleton: {
    marginBottom: theme.spacing.xl,
  },
  titleSkeleton: {
    marginBottom: theme.spacing.sm,
  },
  subtitleSkeleton: {
    marginBottom: theme.spacing.sm,
  },
  progressCardSkeleton: {
    height: 160,
    marginBottom: theme.spacing.lg,
  },
  levelCardSkeleton: {
    height: 120,
    marginBottom: theme.spacing.lg,
  },
  tasksCardSkeleton: {
    height: 200,
    marginBottom: theme.spacing.lg,
  },
  quickActionsSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  actionButtonSkeleton: {
    flex: 1,
    borderRadius: theme.radius.lg,
  },
  
  // Regular styles
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  progressCard: {
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  circularProgressContent: {
    alignItems: 'center',
  },
  circularProgressLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  levelCard: {
    marginBottom: theme.spacing.lg,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  xpText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
  },
  xpBar: {
    gap: theme.spacing.sm,
  },
  xpBarBackground: {
    height: 8,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary.start,
    borderRadius: theme.radius.full,
  },
  xpNextLevel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  tasksCard: {
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  viewAllButton: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary.start,
  },
  tasksList: {
    gap: theme.spacing.md,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  taskMeta: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCheckboxCompleted: {
    backgroundColor: theme.colors.success.start,
    borderColor: theme.colors.success.start,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
}); 