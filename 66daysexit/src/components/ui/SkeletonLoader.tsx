import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'rectangular' | 'circular' | 'text';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius,
  style,
  variant = 'rectangular',
}) => {
  const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [shimmerAnimatedValue]);

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'circular':
        const circularSize = typeof width === 'number' ? width : 40;
        return {
          width: circularSize,
          height: circularSize,
          borderRadius: circularSize / 2,
        };
      case 'text':
        return {
          width,
          height: typeof height === 'number' ? height : 16,
          borderRadius: borderRadius ?? theme.radius.sm,
        };
      default:
        return {
          width,
          height,
          borderRadius: borderRadius ?? theme.radius.md,
        };
    }
  };

  const shimmerTranslateX = shimmerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  const shimmerOpacity = shimmerAnimatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <View style={[styles.container, getVariantStyle(), style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslateX }],
            opacity: shimmerOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.15)',
            'rgba(255, 255, 255, 0.05)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

// Skeleton card component for complex layouts
export const SkeletonCard: React.FC<{ 
  style?: ViewStyle; 
  children?: React.ReactNode; 
}> = ({ style, children }) => (
  <View style={[styles.card, style]}>
    {children ? (
      children
    ) : (
      <>
        <View style={styles.cardHeader}>
          <SkeletonLoader variant="circular" width={40} height={40} />
          <View style={styles.cardHeaderText}>
            <SkeletonLoader width="60%" height={16} />
            <SkeletonLoader width="40%" height={12} style={{ marginTop: 4 }} />
          </View>
        </View>
        <SkeletonLoader width="100%" height={12} style={{ marginTop: 12 }} />
        <SkeletonLoader width="80%" height={12} style={{ marginTop: 8 }} />
        <SkeletonLoader width="90%" height={12} style={{ marginTop: 8 }} />
      </>
    )}
  </View>
);

// Skeleton list component
export const SkeletonList: React.FC<{ count?: number; style?: ViewStyle }> = ({ 
  count = 3, 
  style 
}) => (
  <View style={style}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} style={{ marginBottom: theme.spacing.md }} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.secondary,
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: theme.colors.surface.glass,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
});

export default SkeletonLoader; 