// Deep Blue Theme for LitForge
// Paleta de colores consistente con tema azul profundo

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Background colors
  background: string;
  surface: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  
  // UI colors
  border: string;
  shadow: string;
  error: string;
  success: string;
  warning: string;
  
  // Reading specific colors
  readerBackground: string;
  highlightYellow: string;
  highlightBlue: string;
  highlightGreen: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    fontSizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeights: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeights: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
}

// Light theme with deep blue accent
const lightColors: ThemeColors = {
  // Deep blue primary palette
  primary: '#1e3a8a', // Deep blue
  primaryLight: '#3b82f6', // Lighter blue
  primaryDark: '#1e40af', // Darker blue
  
  // Clean backgrounds
  background: '#ffffff',
  surface: '#f8fafc',
  
  // Text hierarchy
  text: '#111827',
  textSecondary: '#4b5563',
  
  // UI elements
  border: '#e5e7eb',
  shadow: '#000000',
  error: '#dc2626',
  success: '#059669',
  warning: '#d97706',
  
  // Reading experience
  readerBackground: '#fefefe',
  highlightYellow: '#fef3c7',
  highlightBlue: '#dbeafe',
  highlightGreen: '#d1fae5',
};

// Dark theme with deep blue accent
const darkColors: ThemeColors = {
  // Deep blue primary palette (adjusted for dark mode)
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',
  
  // Dark backgrounds
  background: '#0f172a', // Very dark blue-gray
  surface: '#1e293b', // Dark blue-gray
  
  // Text hierarchy for dark mode
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  
  // UI elements for dark mode
  border: '#334155',
  shadow: '#000000',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  
  // Reading experience (dark mode)
  readerBackground: '#0f172a',
  highlightYellow: '#451a03',
  highlightBlue: '#1e3a8a',
  highlightGreen: '#064e3b',
};

// Base theme structure
const baseTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
};

// Export themes
export const lightTheme: Theme = {
  colors: lightColors,
  ...baseTheme,
};

export const darkTheme: Theme = {
  colors: darkColors,
  ...baseTheme,
};

// Export colors object for easy access
export const colors = {
  light: lightColors,
  dark: darkColors,
};

// Default theme (light)
export const theme = lightTheme;

// Theme utilities
export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};

// Common shadow styles
export const shadows = {
  small: {
    boxShadow: `0px 1px 2px ${theme.colors.shadow}1A`,
    elevation: 2,
  },
  medium: {
    boxShadow: `0px 2px 4px ${theme.colors.shadow}26`,
    elevation: 4,
  },
  large: {
    boxShadow: `0px 4px 8px ${theme.colors.shadow}33`,
    elevation: 8,
  },
};

// Typography presets
export const typography = {
  h1: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    lineHeight: theme.typography.lineHeights.tight,
    color: theme.colors.text,
  },
  h2: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    lineHeight: theme.typography.lineHeights.tight,
    color: theme.colors.text,
  },
  h3: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    lineHeight: theme.typography.lineHeights.normal,
    color: theme.colors.text,
  },
  body: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.normal,
    lineHeight: theme.typography.lineHeights.normal,
    color: theme.colors.text,
  },
  bodySmall: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.normal,
    lineHeight: theme.typography.lineHeights.normal,
    color: theme.colors.textSecondary,
  },
  caption: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.normal,
    lineHeight: theme.typography.lineHeights.normal,
    color: theme.colors.textSecondary,
  },
};

// Button styles
export const buttonStyles = {
  primary: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
};

// Input styles
export const inputStyles = {
  default: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  focused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
};

// Card styles
export const cardStyles = {
  default: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...shadows.medium,
  },
  elevated: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...shadows.large,
  },
};