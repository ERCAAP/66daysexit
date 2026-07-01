import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '../../theme';

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
  children?: React.ReactNode;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showPercentage = true,
  label,
  animated = true,
  children,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<any>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: animated ? 1000 : 0,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, animated, animatedValue]);

  useEffect(() => {
    if (showPercentage) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: animated ? 1000 : 0,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [progress, animated, showPercentage, animatedValue]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      if (circleRef.current) {
        const strokeDashoffset = circumference - (circumference * value) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    return () => animatedValue.removeListener(listener);
  }, [circumference]);

  const getGradientId = () => `gradient-${color}`;

  const getGradientColors = () => {
    switch (color) {
      case 'primary':
        return [theme.colors.primary.start, theme.colors.primary.end];
      case 'secondary':
        return [theme.colors.secondary.start, theme.colors.secondary.end];
      case 'success':
        return [theme.colors.success.start, theme.colors.success.end];
      case 'warning':
        return [theme.colors.warning.start, theme.colors.warning.end];
      default:
        return [theme.colors.primary.start, theme.colors.primary.end];
    }
  };

  const gradientColors = getGradientColors();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
        </Defs>
        
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.surface.secondary}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${getGradientId()})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      <View style={styles.content}>
        {children || (
          <>
            {showPercentage && (
              <Text style={styles.percentage}>{Math.round(progress)}%</Text>
            )}
            {label && <Text style={styles.label}>{label}</Text>}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  percentage: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});

export default CircularProgress; 