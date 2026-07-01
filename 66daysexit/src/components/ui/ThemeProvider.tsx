import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme as lightTheme } from '../../theme';

// Dark theme configuration
const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      card: '#1f1f1f',
      elevated: '#2f2f2f',
    },
    surface: {
      primary: 'rgba(26, 26, 26, 0.8)',
      secondary: 'rgba(42, 42, 42, 0.6)',
      glass: 'rgba(255, 255, 255, 0.05)',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      muted: '#a0a0a0',
      inverse: '#000000',
    },
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)',
      focus: '#4f46e5',
    },
    // Keep the same accent colors but with better contrast
    primary: {
      ...lightTheme.colors.primary,
    },
    secondary: {
      ...lightTheme.colors.secondary,
    },
    success: {
      ...lightTheme.colors.success,
    },
    warning: {
      ...lightTheme.colors.warning,
    },
    status: {
      ...lightTheme.colors.status,
    },
  },
  gradients: {
    background: {
      colors: ['#0a0a0a', '#1a1a1a', '#0f0f0f'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    primary: {
      colors: ['#6366f1', '#8b5cf6'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    secondary: {
      colors: ['#ec4899', '#f97316'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    success: {
      colors: ['#22c55e', '#16a34a'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    warning: {
      colors: ['#f59e0b', '#d97706'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    error: {
      colors: ['#ef4444', '#dc2626'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
};

export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme_mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Determine if we should use dark theme
  const isDark = 
    themeMode === 'dark' || 
    (themeMode === 'system' && systemColorScheme === 'dark');

  // Select the appropriate theme
  const theme = isDark ? darkTheme : lightTheme;

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Listen to system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // Save theme preference
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
      setThemeModeState(mode); // Still update state even if save fails
    }
  };

  // Toggle between light and dark (not system)
  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const contextValue: ThemeContextType = {
    theme,
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for getting theme colors easily
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

// Hook for getting theme gradients easily
export const useThemeGradients = () => {
  const { theme } = useTheme();
  return theme.gradients;
}; 