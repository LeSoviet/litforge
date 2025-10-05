import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
// Removed unused SplashScreen import
import { StatusBar } from 'expo-status-bar';
// Removed unused useEffect import
import { View, StyleSheet, Platform } from 'react-native';
import 'react-native-reanimated';

import { AppProvider, useTheme } from '../contexts';

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
          backgroundColor={Platform.OS === 'android' ? theme.colors.background : undefined}
          translucent={Platform.OS === 'android' ? false : undefined}
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
    <AppProvider>
      <AppContent />
    </AppProvider>
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
