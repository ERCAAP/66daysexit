import React, { useEffect, useRef } from 'react';
import { Animated, TextStyle, Easing } from 'react-native';
import { theme } from '../../theme';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: TextStyle;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const formatValue = (val: number) => {
    return Math.round(val);
  };

  return (
    <Animated.Text
      style={[
        {
          fontSize: theme.typography.sizes.xl,
          fontWeight: theme.typography.weights.bold,
          color: theme.colors.text.primary,
        },
        style,
      ]}
    >
      {animatedValue.interpolate({
        inputRange: [0, value || 1],
        outputRange: [0, value || 1],
        extrapolate: 'clamp',
      }).interpolate({
        inputRange: [0, value || 1],
        outputRange: [`${prefix}0${suffix}`, `${prefix}${formatValue(value)}${suffix}`],
      })}
    </Animated.Text>
  );
};

export default AnimatedCounter; 