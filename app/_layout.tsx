import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
// Removed unused SplashScreen import
import { StatusBar } from 'expo-status-bar';
// Removed unused useEffect import
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { FontProvider } from '../contexts/FontContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function AppContent() {
  const { isDarkMode, theme, isLoading } = useTheme();
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]} />
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="stories" 
            options={{ 
              headerShown: true,
              title: 'Stories',
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: {
                color: theme.colors.text,
              },
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="reader" 
            options={{ 
              headerShown: false,
              presentation: 'modal'
            }} 
          />
        </Stack>
        <StatusBar 
          style={isDarkMode ? 'light' : 'dark'}
        />
      </NavigationThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <FontProvider>
          <AppContent />
        </FontProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
});