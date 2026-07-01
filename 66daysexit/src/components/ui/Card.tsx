import React from 'react';
import { View, ViewStyle, ViewProps } from 'react-native';
import { theme } from '../../theme';

interface CardProps extends ViewProps {
  variant?: 'glass' | 'solid' | 'elevated';
  children: React.ReactNode;
}

function Card({
  variant = 'glass',
  children,
  style,
  ...props
}: CardProps) {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      ...theme.shadows.medium,
    };

    switch (variant) {
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surface.glass,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        };
      case 'solid':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.background.card,
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.background.elevated,
          ...theme.shadows.large,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
}

export default Card; 