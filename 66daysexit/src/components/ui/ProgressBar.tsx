import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  style?: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showPercentage = false,
  label,
  animated = true,
  color = 'primary',
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: animated ? 800 : 0,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [progress, animated, animatedValue]);

  const getGradientColors = () => {
    switch (color) {
      case 'primary':
        return theme.gradients.primary.colors as [string, string, ...string[]];
      case 'secondary':
        return theme.gradients.secondary.colors as [string, string, ...string[]];
      case 'success':
        return theme.gradients.success.colors as [string, string, ...string[]];
      case 'warning':
        return [theme.colors.warning.start, theme.colors.warning.end] as [string, string, ...string[]];
      default:
        return theme.gradients.primary.colors as [string, string, ...string[]];
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.progressContainer}>
        <View style={[styles.track, { height }]}>
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                width: animatedValue.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
                height,
              },
            ]}
          >
            <LinearGradient
              colors={getGradientColors()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.fill, { height }]}
            />
          </Animated.View>
        </View>
        
        {showPercentage && (
          <Text style={styles.percentage}>{Math.round(progress)}%</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  animatedContainer: {
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    borderRadius: theme.radius.full,
  },
  percentage: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
    minWidth: 35,
    textAlign: 'right',
  },
});

export default ProgressBar; 