import React, { createContext, useContext, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme, ThemeType, getTheme, getThemeByType } from '../theme/colors';
import { useThemePersistence } from '../hooks';

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (isDark: boolean) => void;
  setThemeType: (type: ThemeType) => void;
  cycleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { 
    themeType, 
    isDarkMode, 
    isLoading, 
    toggleTheme, 
    setThemeMode, 
    setThemeType, 
    cycleTheme 
  } = useThemePersistence();
  
  const theme = getThemeByType(themeType);

  // Don't render until theme is loaded to prevent flash
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeType,
        isDarkMode,
        toggleTheme,
        setThemeMode,
        setThemeType,
        cycleTheme,
        isLoading,
      }}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});