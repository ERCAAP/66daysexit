import { Dimensions } from 'react-native';
import { 
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

// Colors
export const colors = {
  // Primary gradients
  primary: {
    start: '#6366f1', // indigo-500
    end: '#8b5cf6',   // violet-500
  },
  secondary: {
    start: '#ec4899', // pink-500
    end: '#f97316',   // orange-500
  },
  success: {
    start: '#10b981', // emerald-500
    end: '#06b6d4',   // cyan-500
  },
  warning: {
    start: '#f59e0b', // amber-500
    end: '#ef4444',   // red-500
  },
  
  // Background colors
  background: {
    primary: '#0a0a0a',    // Almost black
    secondary: '#1a1a1a',  // Dark gray
    card: '#262626',       // Card background
    elevated: '#404040',   // Elevated surfaces
  },
  
  // Surface colors with transparency
  surface: {
    primary: 'rgba(38, 38, 38, 0.8)',
    secondary: 'rgba(64, 64, 64, 0.6)',
    glass: 'rgba(255, 255, 255, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#a3a3a3',
    muted: '#737373',
    inverse: '#000000',
  },
  
  // Border colors
  border: {
    primary: 'rgba(255, 255, 255, 0.1)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    focus: '#6366f1',
  },
  
  // Status colors
  status: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
};

// Typography
export const typography = {
  sizes: {
    xs: wp('3%'),
    sm: wp('3.5%'),
    base: wp('4%'),
    lg: wp('4.5%'),
    xl: wp('5%'),
    '2xl': wp('6%'),
    '3xl': wp('7.5%'),
    '4xl': wp('9%'),
    '5xl': wp('12%'),
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Spacing
export const spacing = {
  xs: wp('1%'),
  sm: wp('2%'),
  md: wp('4%'),
  lg: wp('6%'),
  xl: wp('8%'),
  '2xl': wp('12%'),
  '3xl': wp('16%'),
};

// Border radius
export const radius = {
  none: 0,
  sm: wp('1%'),
  md: wp('2%'),
  lg: wp('3%'),
  xl: wp('4%'),
  full: 999,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
};

// Animation timing
export const timing = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Screen dimensions
export const dimensions = {
  width,
  height,
  isSmallScreen: width < 375,
  isMediumScreen: width >= 375 && width < 414,
  isLargeScreen: width >= 414,
};

// Common gradient configurations
export const gradients = {
  primary: {
    colors: [colors.primary.start, colors.primary.end],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  secondary: {
    colors: [colors.secondary.start, colors.secondary.end],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  success: {
    colors: [colors.success.start, colors.success.end],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  background: {
    colors: [colors.background.primary, colors.background.secondary],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  timing,
  dimensions,
  gradients,
}; 