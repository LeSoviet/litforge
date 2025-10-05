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
    primary: '#1e3a8a', // Deep blue
    primaryLight: '#3b82f6', // Lighter blue
    primaryDark: '#1e40af', // Darker blue
    secondary: COLORS.secondary,
    background: '#1e3a8a', // Deep blue background
    surface: '#3b82f6', // Blue surface
    text: COLORS.white, // White text for contrast
    textSecondary: '#e5e7eb', // Light gray for secondary text
    border: '#60a5fa', // Light blue border
    shadow: COLORS.black,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
    accent: '#1e3a8a', // Deep blue accent
    card: '#3b82f6', // Blue cards
    notification: COLORS.error,
    // Reading experience
    readerBackground: '#1e3a8a', // Deep blue reader background
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
    primary: '#4a90e2', // Soft blue for primary elements
    primaryLight: '#6ba3e8', // Lighter soft blue
    primaryDark: '#2c5aa0', // Darker soft blue
    secondary: '#7b68ee', // Soft purple for secondary elements
    background: '#0f1419', // Very dark blue-gray background
    surface: '#1a2332', // Dark blue-gray surface
    text: '#e8f4f8', // Very light blue-white for text
    textSecondary: '#a8c8d8', // Soft blue-gray for secondary text
    border: '#2d3748', // Dark blue-gray border
    shadow: '#000000',
    success: '#48bb78', // Soft green
    warning: '#ed8936', // Soft orange
    error: '#f56565', // Soft red
    info: '#4299e1', // Soft blue
    accent: '#4a90e2', // Soft blue accent
    card: '#1a2332', // Dark blue-gray cards
    notification: '#f56565',
    // Reading experience - optimized for comfortable reading
    readerBackground: '#0f1419', // Very dark blue-gray for reading
    highlightYellow: '#4a4520', // Muted yellow highlight
    highlightBlue: '#1e3a5f', // Muted blue highlight
    highlightGreen: '#1a4037', // Muted green highlight
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

    // Utility styles
    flexWrap: { flexWrap: 'wrap' },
    borderBottom: { 
      borderBottomWidth: 1, 
      borderBottomColor: theme.colors.border 
    },
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