// Settings and theme-related types and interfaces

export interface AppSettings {
  darkMode: boolean;
  hapticFeedback: boolean;
  autoSaveProgress: boolean;
  defaultFontSize: number;
  keepScreenOn: boolean;
  defaultReadingMode: 'scroll' | 'page';
  highlightColor: string;
  fontSize: number;
  fontFamily: string;
  readingMode: 'scroll' | 'page';
  notifications: boolean;
  brightness: number;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  autoSave: boolean;
  pageTransition: 'slide' | 'fade' | 'none';
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

export type ThemePreference = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  mode: ThemePreference;
  primaryColor: string;
  accentColor: string;
  customColors?: {
    [key: string]: string;
  };
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    accent: string;
    card: string;
    notification: string;
  };
  dark: boolean;
}