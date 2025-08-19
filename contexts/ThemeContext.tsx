import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme, View, StyleSheet } from 'react-native';
import { Theme, getTheme } from '../theme/colors';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (isDark: boolean) => void;
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
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      } else {
        // Use system preference if no saved preference
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setIsDarkMode(systemColorScheme === 'dark');
    } finally {
      setIsLoaded(true);
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(isDark));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    saveThemePreference(newTheme);
  };

  const setThemeMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    saveThemePreference(isDark);
  };

  const theme = getTheme(isDarkMode);

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleTheme,
        setThemeMode,
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