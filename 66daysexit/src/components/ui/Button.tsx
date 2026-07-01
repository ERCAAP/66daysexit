import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ViewStyle,
  TouchableOpacityProps,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
}

function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  hapticFeedback = true,
  style,
  onPress,
  disabled,
  ...props
}: ButtonProps) {
  const handlePress = (event: any) => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.(event);
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return theme.gradients.primary.colors;
      case 'secondary':
        return theme.gradients.secondary.colors;
      case 'success':
        return theme.gradients.success.colors;
      default:
        return theme.gradients.primary.colors;
    }
  };

  const getTextStyle = () => {
    return {
      color: variant === 'outline' || variant === 'ghost' 
        ? theme.colors.text.primary 
        : theme.colors.text.inverse,
      fontSize: size === 'small' 
        ? theme.typography.sizes.sm 
        : size === 'large' 
        ? theme.typography.sizes.lg 
        : theme.typography.sizes.base,
      fontWeight: theme.typography.weights.semibold,
    };
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: size === 'small' ? 40 : size === 'large' ? 56 : 48,
      paddingHorizontal: size === 'small' 
        ? theme.spacing.md 
        : size === 'large' 
        ? theme.spacing.xl 
        : theme.spacing.lg,
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...(fullWidth && { width: '100%' }),
      opacity: disabled ? 0.5 : 1,
    };

    if (variant === 'outline') {
      return {
        ...baseStyle,
        borderWidth: 1.5,
        borderColor: theme.colors.border.focus,
        backgroundColor: 'transparent',
      };
    }

    if (variant === 'ghost') {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.surface.glass,
      };
    }

    return baseStyle;
  };

  if (variant === 'outline' || variant === 'ghost') {
    return (
      <TouchableOpacity
        style={[getButtonStyle(), style]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        {...props}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={theme.colors.text.primary} 
          />
        ) : (
          <Text style={getTextStyle()}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={theme.gradients.primary.start}
        end={theme.gradients.primary.end}
        style={getButtonStyle()}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={theme.colors.text.inverse} 
          />
        ) : (
          <Text style={getTextStyle()}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default Button; 