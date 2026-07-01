import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'xp' | 'tasks' | 'category' | 'level' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  requirement: {
    value: number;
    category?: string;
  };
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0-100
}

export interface UserAchievements {
  achievements: Achievement[];
  totalXP: number;
  unlockedCount: number;
  lastChecked: string;
}

const ACHIEVEMENTS_STORAGE_KEY = 'user_achievements';

class AchievementSystem {
  private achievements: Achievement[] = [
    // Streak Achievements
    {
      id: 'first_day',
      title: 'First Steps',
      description: 'Complete your first day',
      icon: 'trophy',
      type: 'streak',
      rarity: 'common',
      xpReward: 50,
      requirement: { value: 1 },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'flame',
      type: 'streak',
      rarity: 'rare',
      xpReward: 200,
      requirement: { value: 7 },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'phoenix_rising',
      title: 'Phoenix Rising',
      description: 'Reach a 30-day streak',
      icon: 'trending-up',
      type: 'streak',
      rarity: 'epic',
      xpReward: 500,
      requirement: { value: 30 },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'immortal',
      title: 'Immortal',
      description: 'Complete the full 66-day journey',
      icon: 'star',
      type: 'streak',
      rarity: 'legendary',
      xpReward: 1000,
      requirement: { value: 66 },
      isUnlocked: false,
      progress: 0,
    },

    // XP Achievements
    {
      id: 'experience_seeker',
      title: 'Experience Seeker',
      description: 'Earn 500 XP',
      icon: 'diamond',
      type: 'xp',
      rarity: 'common',
      xpReward: 100,
      requirement: { value: 500 },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'power_user',
      title: 'Power User',
      description: 'Earn 2000 XP',
      icon: 'flash',
      type: 'xp',
      rarity: 'rare',
      xpReward: 300,
      requirement: { value: 2000 },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'master_achiever',
      title: 'Master Achiever',
      description: 'Earn 5000 XP',
      icon: 'medal',
      type: 'xp',
      rarity: 'epic',
      xpReward: 750,
      requirement: { value: 5000 },
      isUnlocked: false,
      progress: 0,
    },

    // Level Achievements
    {
      id: 'level_up',
      title: 'Level Up!',
      description: 'Reach Level 5',
      icon: 'chevron-up',
      type: 'level',
      rarity: 'common',
      xpReward: 150,
      requirement: { value: 5 },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'elite_status',
      title: 'Elite Status',
      description: 'Reach Level 10',
      icon: 'crown',
      type: 'level',
      rarity: 'epic',
      xpReward: 400,
      requirement: { value: 10 },
      isUnlocked: false,
      progress: 0,
    },

    // Task Achievements
    {
      id: 'task_master',
      title: 'Task Master',
      description: 'Complete 100 tasks',
      icon: 'checkmark-circle',
      type: 'tasks',
      rarity: 'rare',
      xpReward: 250,
      requirement: { value: 100 },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete all tasks for 7 consecutive days',
      icon: 'star-outline',
      type: 'special',
      rarity: 'epic',
      xpReward: 600,
      requirement: { value: 7 },
      isUnlocked: false,
      progress: 0,
    },

    // Category Achievements
    {
      id: 'sleep_master',
      title: 'Sleep Master',
      description: 'Complete 30 sleep tasks',
      icon: 'moon',
      type: 'category',
      rarity: 'rare',
      xpReward: 200,
      requirement: { value: 30, category: 'sleep' },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'hydration_hero',
      title: 'Hydration Hero',
      description: 'Complete 30 water tasks',
      icon: 'water',
      type: 'category',
      rarity: 'rare',
      xpReward: 200,
      requirement: { value: 30, category: 'water' },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'fitness_fanatic',
      title: 'Fitness Fanatic',
      description: 'Complete 30 exercise tasks',
      icon: 'fitness',
      type: 'category',
      rarity: 'rare',
      xpReward: 200,
      requirement: { value: 30, category: 'exercise' },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'mindful_master',
      title: 'Mindful Master',
      description: 'Complete 30 mind tasks',
      icon: 'brain',
      type: 'category',
      rarity: 'rare',
      xpReward: 200,
      requirement: { value: 30, category: 'mind' },
      isUnlocked: false,
      progress: 0,
    },

    // Special Achievements
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Complete tasks before 8 AM for 7 days',
      icon: 'sunny',
      type: 'special',
      rarity: 'rare',
      xpReward: 300,
      requirement: { value: 7 },
      isUnlocked: false,
      progress: 0,
    },
    {
      id: 'comeback_kid',
      title: 'Comeback Kid',
      description: 'Start a new streak after breaking one',
      icon: 'refresh',
      type: 'special',
      rarity: 'common',
      xpReward: 100,
      requirement: { value: 1 },
      isUnlocked: false,
      progress: 0,
    },
  ];

  async getUserAchievements(): Promise<UserAchievements> {
    try {
      const stored = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }

    // Return default achievements
    return {
      achievements: [...this.achievements],
      totalXP: 0,
      unlockedCount: 0,
      lastChecked: new Date().toISOString(),
    };
  }

  async saveUserAchievements(userAchievements: UserAchievements): Promise<void> {
    try {
      await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(userAchievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  async checkAndUnlockAchievements(userStats: {
    streak: number;
    xp: number;
    level: number;
    completedTasks: number;
    categoryStats: { [key: string]: number };
    lastTaskCompletionTime?: string;
    perfectDays?: number;
  }): Promise<Achievement[]> {
    const userAchievements = await this.getUserAchievements();
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of userAchievements.achievements) {
      if (achievement.isUnlocked) continue;

      let shouldUnlock = false;
      let progress = 0;

      switch (achievement.type) {
        case 'streak':
          progress = Math.min((userStats.streak / achievement.requirement.value) * 100, 100);
          shouldUnlock = userStats.streak >= achievement.requirement.value;
          break;

        case 'xp':
          progress = Math.min((userStats.xp / achievement.requirement.value) * 100, 100);
          shouldUnlock = userStats.xp >= achievement.requirement.value;
          break;

        case 'level':
          progress = Math.min((userStats.level / achievement.requirement.value) * 100, 100);
          shouldUnlock = userStats.level >= achievement.requirement.value;
          break;

        case 'tasks':
          progress = Math.min((userStats.completedTasks / achievement.requirement.value) * 100, 100);
          shouldUnlock = userStats.completedTasks >= achievement.requirement.value;
          break;

        case 'category':
          if (achievement.requirement.category) {
            const categoryCount = userStats.categoryStats[achievement.requirement.category] || 0;
            progress = Math.min((categoryCount / achievement.requirement.value) * 100, 100);
            shouldUnlock = categoryCount >= achievement.requirement.value;
          }
          break;

        case 'special':
          // Handle special achievements with custom logic
          if (achievement.id === 'perfectionist') {
            progress = Math.min(((userStats.perfectDays || 0) / achievement.requirement.value) * 100, 100);
            shouldUnlock = (userStats.perfectDays || 0) >= achievement.requirement.value;
          } else if (achievement.id === 'early_bird') {
            // This would need additional tracking for early task completion
            progress = 0; // Placeholder
          } else if (achievement.id === 'comeback_kid') {
            // This would need streak history tracking
            progress = 0; // Placeholder
          }
          break;
      }

      achievement.progress = progress;

      if (shouldUnlock && !achievement.isUnlocked) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        newlyUnlocked.push(achievement);
        userAchievements.totalXP += achievement.xpReward;
        userAchievements.unlockedCount++;
      }
    }

    userAchievements.lastChecked = new Date().toISOString();
    await this.saveUserAchievements(userAchievements);

    return newlyUnlocked;
  }

  getRarityColor(rarity: Achievement['rarity']): string {
    switch (rarity) {
      case 'common':
        return theme.colors.text.secondary;
      case 'rare':
        return theme.colors.primary.start;
      case 'epic':
        return theme.colors.secondary.start;
      case 'legendary':
        return theme.colors.warning.start;
      default:
        return theme.colors.text.secondary;
    }
  }

  getRarityBackground(rarity: Achievement['rarity']): string {
    switch (rarity) {
      case 'common':
        return 'rgba(156, 163, 175, 0.1)';
      case 'rare':
        return `${theme.colors.primary.start}20`;
      case 'epic':
        return `${theme.colors.secondary.start}20`;
      case 'legendary':
        return `${theme.colors.warning.start}20`;
      default:
        return 'rgba(156, 163, 175, 0.1)';
    }
  }

  getProgressToNextAchievement(userStats: {
    streak: number;
    xp: number;
    level: number;
    completedTasks: number;
    categoryStats: { [key: string]: number };
  }): Achievement | null {
    // Find the next closest achievement that's not unlocked
    const userAchievements = this.achievements.filter(a => !a.isUnlocked);
    
    if (userAchievements.length === 0) return null;

    // Sort by progress and return the closest one
    return userAchievements.sort((a, b) => {
      let progressA = 0;
      let progressB = 0;

      // Calculate progress for each achievement
      switch (a.type) {
        case 'streak':
          progressA = (userStats.streak / a.requirement.value) * 100;
          break;
        case 'xp':
          progressA = (userStats.xp / a.requirement.value) * 100;
          break;
        case 'level':
          progressA = (userStats.level / a.requirement.value) * 100;
          break;
        case 'tasks':
          progressA = (userStats.completedTasks / a.requirement.value) * 100;
          break;
      }

      switch (b.type) {
        case 'streak':
          progressB = (userStats.streak / b.requirement.value) * 100;
          break;
        case 'xp':
          progressB = (userStats.xp / b.requirement.value) * 100;
          break;
        case 'level':
          progressB = (userStats.level / b.requirement.value) * 100;
          break;
        case 'tasks':
          progressB = (userStats.completedTasks / b.requirement.value) * 100;
          break;
      }

      return progressB - progressA;
    })[0];
  }
}

export const achievementSystem = new AchievementSystem(); 