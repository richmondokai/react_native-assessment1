import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    white: string;
    black: string;
    gray50: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
    background: string;
    backgroundSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    shadow: string;
    card: string;
    border: string;
  };
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: '#007AFF',
    primaryDark: '#0056CC',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9F9FB',
    gray100: '#F2F2F7',
    gray200: '#E5E5EA',
    gray300: '#D1D1D6',
    gray400: '#C7C7CC',
    gray500: '#AEAEB2',
    gray600: '#8E8E93',
    gray700: '#636366',
    gray800: '#48484A',
    gray900: '#1C1C1E',
    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    textPrimary: '#000000',
    textSecondary: '#3C3C43',
    textTertiary: '#8E8E93',
    shadow: '#000000',
    card: '#FFFFFF',
    border: '#E5E5EA',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#0A84FF',
    primaryDark: '#0056CC',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FF9F0A',
    danger: '#FF453A',
    white: '#000000',
    black: '#FFFFFF',
    gray50: '#1C1C1E',
    gray100: '#2C2C2E',
    gray200: '#3A3A3C',
    gray300: '#48484A',
    gray400: '#636366',
    gray500: '#8E8E93',
    gray600: '#AEAEB2',
    gray700: '#C7C7CC',
    gray800: '#D1D1D6',
    gray900: '#F2F2F7',
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',
    shadow: '#000000',
    card: '#2C2C2E',
    border: '#48484A',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  followSystemTheme?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  followSystemTheme = true 
}) => {
  const [isDark, setIsDark] = useState(false);
  const [followSystem, setFollowSystem] = useState(followSystemTheme);

  useEffect(() => {
    if (followSystem) {
      const colorScheme = Appearance.getColorScheme();
      setIsDark(colorScheme === 'dark');

      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        if (followSystem) {
          setIsDark(colorScheme === 'dark');
        }
      });

      return () => subscription.remove();
    }
  }, [followSystem]);

  const toggleTheme = () => {
    setFollowSystem(false);
    setIsDark(!isDark);
  };

  const setTheme = (dark: boolean) => {
    setFollowSystem(false);
    setIsDark(dark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
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

// Hook to get theme-aware colors
export const useColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};
