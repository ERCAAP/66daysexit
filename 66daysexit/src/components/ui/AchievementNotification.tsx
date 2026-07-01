import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';
import { Achievement } from '../../services/achievementSystem';

interface AchievementNotificationProps {
  achievement: Achievement;
  visible: boolean;
  onDismiss: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  visible,
  onDismiss,
}) => {
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handleDismiss = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (visible) {
      // Trigger haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Slide in animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 6,
          useNativeDriver: true,
        }),
        // Glow animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ])
        ),
      ]).start();

      // Auto dismiss after 4 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      // Reset animations
      slideAnim.setValue(-200);
      scaleAnim.setValue(0.8);
      glowAnim.setValue(0);
    }
  }, [visible, slideAnim, scaleAnim, glowAnim, handleDismiss]);

  if (!visible) return null;

  const getRarityColor = () => {
    const colors = {
      common: theme.colors.text.secondary,
      rare: theme.colors.primary.start,
      epic: theme.colors.secondary.start,
      legendary: theme.colors.warning.start,
    };
    return colors[achievement.rarity] || theme.colors.primary.start;
  };

  const getRarityGradient = () => {
    const gradients = {
      common: [theme.colors.surface.secondary, theme.colors.surface.primary],
      rare: [theme.colors.primary.start, theme.colors.primary.end],
      epic: [theme.colors.secondary.start, theme.colors.secondary.end],
      legendary: [theme.colors.warning.start, '#FFD700'],
    };
    return gradients[achievement.rarity] || gradients.common;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity onPress={handleDismiss} activeOpacity={0.9}>
        <LinearGradient
          colors={getRarityGradient() as [string, string, ...string[]]}
          style={styles.card}
        >
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowAnim,
                shadowColor: getRarityColor(),
              },
            ]}
          />
          
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: getRarityColor() }]}>
              <Ionicons 
                name={achievement.icon as any} 
                size={24} 
                color={theme.colors.text.inverse} 
              />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>🏆 Achievement Unlocked!</Text>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.description}>{achievement.description}</Text>
              <Text style={styles.xpReward}>+{achievement.xpReward} XP</Text>
            </View>
            
            <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
              <Ionicons name="close" size={20} color={theme.colors.text.muted} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  glowContainer: {
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 20,
  },
  gradient: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  rarity: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 1,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: theme.spacing.lg,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reward: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.warning.start,
    marginLeft: theme.spacing.xs,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.warning.start,
    marginHorizontal: theme.spacing.xs,
  },
  dismissText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    fontStyle: 'italic',
  },
  card: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    padding: theme.spacing.lg,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.radius.xl,
    opacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.5,
    elevation: 20,
  },
  textContainer: {
    marginTop: theme.spacing.lg,
  },
  achievementTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  xpReward: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.warning.start,
    marginTop: theme.spacing.xs,
  },
  dismissButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
});

export default AchievementNotification; 