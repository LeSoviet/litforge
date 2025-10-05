// Consolidated theme system - Design tokens, colors, spacing, and layout
import { StyleSheet } from 'react-native';
import { Theme } from '../types';

/**
 * DESIGN TOKENS - Core design system values
 */
export const SPACING = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
} as const;

export const FONT_WEIGHTS = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
} as const;

/**
 * COLOR PALETTE
 */
export const COLORS = {
  // Primary colors
  primary: '#007AFF',
  primaryLight: '#4DA3FF',
  primaryDark: '#0056CC',
  
  // Secondary colors
  secondary: '#5856D6',
  secondaryLight: '#7B7AE8',
  secondaryDark: '#3F3EB3',
  
  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F2F2F7',
  gray200: '#E5E5EA',
  gray300: '#D1D1D6',
  gray400: '#C7C7CC',
  gray500: '#AEAEB2',
  gray600: '#8E8E93',
  gray700: '#636366',
  gray800: '#48484A',
  gray900: '#1C1C1E',
} as const;

/**
 * THEME DEFINITIONS
 */
export const LIGHT_THEME = {
  colors: {
    primary: COLORS.primary,
    primaryLight: COLORS.primaryLight,
    primaryDark: COLORS.primaryDark,
    secondary: COLORS.secondary,
    background: COLORS.white,
    surface: COLORS.gray100,
    text: COLORS.black,
    textSecondary: COLORS.gray600,
    border: COLORS.gray300,
    shadow: COLORS.black,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
    accent: COLORS.primary,
    card: COLORS.white,
    notification: COLORS.error,
    // Reading experience
    readerBackground: COLORS.white,
    highlightYellow: '#fef3c7',
    highlightBlue: '#dbeafe',
    highlightGreen: '#d1fae5',
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: {
    fontSizes: FONT_SIZES,
    fontWeights: FONT_WEIGHTS,
    lineHeights: LINE_HEIGHTS,
  },
} as const;

export const DARK_THEME = {
  colors: {
    primary: COLORS.primaryLight,
    primaryLight: COLORS.primaryLight,
    primaryDark: COLORS.primaryDark,
    secondary: COLORS.secondaryLight,
    background: COLORS.black,
    surface: COLORS.gray900,
    text: COLORS.white,
    textSecondary: COLORS.gray400,
    border: COLORS.gray700,
    shadow: COLORS.black,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
    accent: COLORS.primaryLight,
    card: COLORS.gray900,
    notification: COLORS.error,
    // Reading experience
    readerBackground: COLORS.black,
    highlightYellow: '#4b3a1a',
    highlightBlue: '#1f3b6e',
    highlightGreen: '#0b3b34',
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: {
    fontSizes: FONT_SIZES,
    fontWeights: FONT_WEIGHTS,
    lineHeights: LINE_HEIGHTS,
  },
} as const;

/**
 * LAYOUT STYLES - Theme-dependent layout and container styles
 */
export const createLayoutStyles = (theme: Theme) => {
  return StyleSheet.create({
    // Main containers
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    
    safeContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },
    
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    
    surface: {
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.md,
    },

    // Flex layouts
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    rowCenter: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    column: {
      flexDirection: 'column',
    },
    
    columnCenter: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Spacing utilities
    paddingXS: { padding: SPACING.xs },
    paddingSM: { padding: SPACING.sm },
    paddingMD: { padding: SPACING.md },
    paddingLG: { padding: SPACING.lg },
    paddingXL: { padding: SPACING.xl },
    
    marginXS: { margin: SPACING.xs },
    marginSM: { margin: SPACING.sm },
    marginMD: { margin: SPACING.md },
    marginLG: { margin: SPACING.lg },
    marginXL: { margin: SPACING.xl },
  });
};

/**
 * TEXT STYLES - Theme-dependent typography styles
 */
export const createTextStyles = (theme: Theme) => {
  return StyleSheet.create({
    // Basic text
    textPrimary: {
      color: theme.colors.text,
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.normal,
    },
    
    textSecondary: {
      color: theme.colors.textSecondary,
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.normal,
    },
    
    textSmall: {
      color: theme.colors.textSecondary,
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.normal,
    },

    // Typography hierarchy
    textTitle: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: theme.colors.text,
    },
    
    textSubtitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.semibold,
      color: theme.colors.text,
    },
    
    textHeading: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.semibold,
      color: theme.colors.text,
    },
    
    textBody: {
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.normal,
      color: theme.colors.text,
    },
    
    textCaption: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.normal,
      color: theme.colors.textSecondary,
    },

    // Text variants
    textBold: {
      fontWeight: FONT_WEIGHTS.bold,
    },
    
    textSemibold: {
      fontWeight: FONT_WEIGHTS.semibold,
    },
    
    textCenter: {
      textAlign: 'center',
    },
    
    textRight: {
      textAlign: 'right',
    },
  });
};