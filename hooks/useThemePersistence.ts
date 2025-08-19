// Custom hook for theme persistence logic
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { ThemeType } from '../theme/colors';

const THEME_STORAGE_KEY = 'themePreference';
const LEGACY_THEME_KEY = 'darkMode'; // For backward compatibility

interface UseThemePersistenceReturn {
  themeType: ThemeType;
  isDarkMode: boolean;
  isLoading: boolean;
  toggleTheme: () => void;
  setThemeMode: (isDark: boolean) => void;
  setThemeType: (type: ThemeType) => void;
  cycleTheme: () => void;
}

export const useThemePersistence = (): UseThemePersistenceReturn => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeTypeState] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Derived state for backward compatibility
  const isDarkMode = themeType === 'dark';

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      // Try to load new theme preference format first
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        const parsedTheme = JSON.parse(savedTheme) as ThemeType;
        if (['light', 'dark'].includes(parsedTheme)) {
          setThemeTypeState(parsedTheme);
        } else {
          // Fallback to system preference
          setThemeTypeState(systemColorScheme === 'dark' ? 'dark' : 'light');
        }
      } else {
        // Check for legacy theme preference
        const legacyTheme = await AsyncStorage.getItem(LEGACY_THEME_KEY);
        if (legacyTheme !== null) {
          const isDark = JSON.parse(legacyTheme);
          setThemeTypeState(isDark ? 'dark' : 'light');
          // Migrate to new format
          await saveThemePreference(isDark ? 'dark' : 'light');
          await AsyncStorage.removeItem(LEGACY_THEME_KEY);
        } else {
          // Use system preference if no saved preference
          setThemeTypeState(systemColorScheme === 'dark' ? 'dark' : 'light');
        }
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setThemeTypeState(systemColorScheme === 'dark' ? 'dark' : 'light');
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (theme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    // Toggle between light and dark themes
    const newTheme: ThemeType = themeType === 'light' ? 'dark' : 'light';
    setThemeTypeState(newTheme);
    saveThemePreference(newTheme);
  };

  const setThemeMode = (isDark: boolean) => {
    // Legacy function - converts to appropriate theme type
    const newTheme: ThemeType = isDark ? 'dark' : 'light';
    setThemeTypeState(newTheme);
    saveThemePreference(newTheme);
  };

  const setThemeType = (type: ThemeType) => {
    setThemeTypeState(type);
    saveThemePreference(type);
  };

  const cycleTheme = () => {
    // Cycle through all available themes
    const themes: ThemeType[] = ['light', 'dark'];
    const currentIndex = themes.indexOf(themeType);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    setThemeTypeState(newTheme);
    saveThemePreference(newTheme);
  };

  return {
    themeType,
    isDarkMode,
    isLoading,
    toggleTheme,
    setThemeMode,
    setThemeType,
    cycleTheme,
  };
};