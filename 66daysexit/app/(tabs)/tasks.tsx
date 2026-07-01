import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../../src/theme';
import Card from '../../src/components/ui/Card';
import SkeletonLoader, { SkeletonCard, SkeletonList } from '../../src/components/ui/SkeletonLoader';
import ProgressBar from '../../src/components/ui/ProgressBar';
import { useAuthStore } from '../../src/stores/authStore';
import { programGenerator, DailyTask } from '../../src/services/programGenerator';
import CircularProgress from '../../src/components/ui/CircularProgress';

export default function TasksScreen() {
  const { t } = useTranslation();
  const { userProfile, updateUserProfile } = useAuthStore();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock program for testing
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
        
        const todaysTasks = programGenerator.getTodaysTasks(mockProgram);
        setTasks(todaysTasks);
      }
      
      setIsLoading(false);
    };

    loadTasks();
  }, [userProfile]);

  const handleTaskToggle = (taskId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const isCompleting = !task.isCompleted;
          
          // Update user XP and streak if completing
          if (isCompleting && userProfile) {
            const newXP = userProfile.xp + task.xpReward;
            const newLevel = programGenerator.calculateLevel(newXP);
            
            // Calculate streak update
            const currentStreak = userProfile.streak;
            const completedTasksToday = prevTasks.filter(t => t.isCompleted).length + 1;
            const totalTasksToday = prevTasks.length;
            
            // If this completes all tasks for today, increment streak
            let newStreak = currentStreak;
            if (completedTasksToday === totalTasksToday) {
              newStreak = currentStreak + 1;
            }
            
            updateUserProfile({
              xp: newXP,
              level: newLevel,
              streak: newStreak,
              lastLoginAt: new Date().toISOString(),
            });
          }
          
          return { ...task, isCompleted: !task.isCompleted };
        }
        return task;
      })
    );
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return !task.isCompleted;
      case 'completed':
        return task.isCompleted;
      default:
        return true;
    }
  });

  const completedCount = tasks.filter(task => task.isCompleted).length;
  const completionPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

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

  const renderTask = ({ item: task }: { item: DailyTask }) => (
    <Card variant="glass" style={styles.taskCard}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => handleTaskToggle(task.id)}
        activeOpacity={0.7}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <View style={[
              styles.categoryIcon,
              { backgroundColor: getCategoryColor(task.category) }
            ]}>
              <Ionicons 
                name={getCategoryIcon(task.category)} 
                size={20} 
                color={theme.colors.text.inverse} 
              />
            </View>
            
            <View style={styles.taskTextContainer}>
              <Text style={[
                styles.taskTitle,
                task.isCompleted && styles.taskTitleCompleted
              ]}>
                {task.title}
              </Text>
              <Text style={styles.taskDescription}>
                {task.description}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.taskCheckbox,
              task.isCompleted && styles.taskCheckboxCompleted
            ]}
            onPress={() => handleTaskToggle(task.id)}
          >
            {task.isCompleted && (
              <Ionicons 
                name="checkmark" 
                size={18} 
                color={theme.colors.text.inverse} 
              />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.taskMeta}>
          <View style={styles.metaItem}>
            <Ionicons 
              name="time-outline" 
              size={14} 
              color={theme.colors.text.muted} 
            />
            <Text style={styles.metaText}>{task.timeEstimate}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons 
              name="star-outline" 
              size={14} 
              color={theme.colors.warning.start} 
            />
            <Text style={styles.metaText}>{task.xpReward} XP</Text>
          </View>
          
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(task.difficulty) }
          ]}>
            <Text style={styles.difficultyText}>
              {task.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return theme.colors.success.start;
      case 'medium': return theme.colors.warning.start;
      case 'hard': return theme.colors.status.error;
      default: return theme.colors.text.secondary;
    }
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
              <SkeletonLoader width="60%" height={32} style={{ marginBottom: 8 }} />
              <SkeletonLoader width="40%" height={20} />
            </View>

            {/* Progress Card Skeleton */}
            <SkeletonCard style={styles.summaryCardSkeleton} />

            {/* Filter Tabs Skeleton */}
            <View style={styles.filterTabsSkeleton}>
              <SkeletonLoader width={80} height={40} style={{ borderRadius: 20 }} />
              <SkeletonLoader width={80} height={40} style={{ borderRadius: 20 }} />
              <SkeletonLoader width={80} height={40} style={{ borderRadius: 20 }} />
            </View>

            {/* Tasks List Skeleton */}
            <SkeletonList count={5} />
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('tasks.title')}</Text>
          <Text style={styles.subtitle}>
            Day {userProfile?.currentDay || 1} of 66
          </Text>
        </View>

        {/* Completion Summary */}
        <Card variant="glass" style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryTitle}>Today&apos;s Progress</Text>
              <Text style={styles.summarySubtitle}>
                {completedCount} of {tasks.length} tasks completed
              </Text>
            </View>
            <View style={styles.summaryCircle}>
              <CircularProgress
                progress={completionPercentage}
                size={60}
                strokeWidth={6}
                color={theme.colors.primary.start}
                backgroundColor={theme.colors.surface.glass}
                showPercentage
              />
            </View>
          </View>
          
          <ProgressBar
            progress={completionPercentage}
            height={8}
            showPercentage={false}
            animated={true}
            color="primary"
          />
          
          {completionPercentage === 100 && (
            <View style={styles.completionBadge}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success.start} />
              <Text style={styles.completionText}>Perfect day! All tasks completed 🎉</Text>
            </View>
          )}
        </Card>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['all', 'pending', 'completed'] as const).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterTab,
                filter === filterType && styles.filterTabActive
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text style={[
                styles.filterTabText,
                filter === filterType && styles.filterTabTextActive
              ]}>
                {t(`tasks.${filterType}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tasks List */}
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tasksList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons 
                name="checkmark-circle-outline" 
                size={64} 
                color={theme.colors.text.muted} 
              />
              <Text style={styles.emptyTitle}>
                {filter === 'completed' ? 'No completed tasks yet' : 'No tasks available'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {filter === 'completed' 
                  ? 'Complete some tasks to see them here'
                  : 'Your personalized tasks will appear here'
                }
              </Text>
            </View>
          }
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
  summaryCardSkeleton: {
    height: 120,
    marginBottom: theme.spacing.lg,
  },
  filterTabsSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  summaryCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  summarySubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  summaryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 3,
    borderColor: theme.colors.primary.start,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary.start,
    borderRadius: theme.radius.full,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  filterTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.surface.secondary,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary.start,
  },
  filterTabText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
  },
  filterTabTextActive: {
    color: theme.colors.text.inverse,
  },
  tasksList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  taskCard: {
    marginBottom: theme.spacing.md,
  },
  taskContent: {
    // No additional styling needed, Card handles it
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  taskInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.text.secondary,
  },
  taskDescription: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.base,
  },
  taskCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  taskCheckboxCompleted: {
    backgroundColor: theme.colors.success.start,
    borderColor: theme.colors.success.start,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metaText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    marginLeft: 'auto',
  },
  difficultyText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.inverse,
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.secondary,
  },
  completionText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['3xl'],
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
}); 