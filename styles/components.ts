// Consolidated component styles - Cards, buttons, inputs, and UI components
import { StyleSheet } from 'react-native';
import { Theme } from '../types';
import { SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZES, FONT_WEIGHTS } from './theme';

/**
 * COMPONENT STYLES - Theme-dependent component styles
 */
export const createComponentStyles = (theme: Theme) => {
  return StyleSheet.create({
    // Headers
    header: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.md,
      marginHorizontal: SPACING.md,
      marginBottom: SPACING.lg,
      ...SHADOWS.sm,
    },
    
    headerTitle: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: theme.colors.text,
      textAlign: 'center',
    },
    
    headerSubtitle: {
      fontSize: FONT_SIZES.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: SPACING.xs,
    },

    // Cards
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
      marginVertical: SPACING.sm,
      ...SHADOWS.md,
    },
    
    cardHorizontal: {
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
      marginVertical: SPACING.sm,
      ...SHADOWS.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    cardTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.semibold,
      color: theme.colors.text,
      marginBottom: SPACING.xs,
    },
    
    cardSubtitle: {
      fontSize: FONT_SIZES.sm,
      color: theme.colors.textSecondary,
      marginBottom: SPACING.sm,
    },
    
    cardContent: {
      flex: 1,
    },
    
    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: BORDER_RADIUS.sm,
      marginRight: SPACING.md,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Buttons
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.sm,
    },
    
    buttonSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    buttonText: {
      color: '#FFFFFF',
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.semibold,
    },
    
    buttonTextSecondary: {
      color: theme.colors.primary,
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.semibold,
    },
    
    buttonSmall: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    
    buttonLarge: {
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.lg,
    },

    // Inputs
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: FONT_SIZES.md,
      color: theme.colors.text,
    },
    
    inputFocused: {
      borderColor: theme.colors.primary,
      ...SHADOWS.sm,
    },
    
    inputLabel: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: theme.colors.text,
      marginBottom: SPACING.xs,
    },
    
    inputError: {
      borderColor: theme.colors.error,
    },
    
    inputErrorText: {
      fontSize: FONT_SIZES.xs,
      color: theme.colors.error,
      marginTop: SPACING.xs,
    },

    // Lists
    listItem: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    listItemTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.medium,
      color: theme.colors.text,
      flex: 1,
    },
    
    listItemSubtitle: {
      fontSize: FONT_SIZES.sm,
      color: theme.colors.textSecondary,
      marginTop: SPACING.xs,
    },
    
    listItemIcon: {
      marginRight: SPACING.md,
    },
    
    listItemChevron: {
      marginLeft: SPACING.sm,
    },

    // Progress indicators
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: BORDER_RADIUS.sm,
      overflow: 'hidden',
    },
    
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: BORDER_RADIUS.sm,
    },
    
    progressText: {
      fontSize: FONT_SIZES.xs,
      color: theme.colors.textSecondary,
      marginTop: SPACING.xs,
    },

    // Badges and tags
    badge: {
      backgroundColor: theme.colors.primary,
      borderRadius: BORDER_RADIUS.lg,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      alignSelf: 'flex-start',
    },
    
    badgeText: {
      color: '#FFFFFF',
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.medium,
    },
    
    badgeSecondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    
    badgeTextSecondary: {
      color: theme.colors.text,
    },

    // Dividers
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: SPACING.md,
    },
    
    dividerThick: {
      height: 2,
      backgroundColor: theme.colors.border,
      marginVertical: SPACING.lg,
    },

    // Modal and overlay
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    modal: {
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
      margin: SPACING.lg,
      maxWidth: '90%',
      ...SHADOWS.lg,
    },
    
    modalTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: theme.colors.text,
      marginBottom: SPACING.md,
      textAlign: 'center',
    },
    
    modalContent: {
      marginBottom: SPACING.lg,
    },
    
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SPACING.md,
    },

    // Status indicators
    statusSuccess: {
      backgroundColor: theme.colors.success,
    },
    
    statusWarning: {
      backgroundColor: theme.colors.warning,
    },
    
    statusError: {
      backgroundColor: theme.colors.error,
    },
    
    statusInfo: {
      backgroundColor: theme.colors.info,
    },

    // Android-specific fixes (simplified)
    androidCenter: {
      textAlignVertical: 'center',
      includeFontPadding: false,
    },
  });
};

/**
 * STATIC COMPONENT STYLES - Theme-independent styles
 */
export const staticComponentStyles = StyleSheet.create({
  // Absolute positioning
  absolute: {
    position: 'absolute',
  },
  
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Flex utilities
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  
  // Flex layout
  flexRow: { flexDirection: 'row' },
  flexColumn: { flexDirection: 'column' },
  
  // Alignment
  alignCenter: { alignItems: 'center' },
  alignStart: { alignItems: 'flex-start' },
  alignEnd: { alignItems: 'flex-end' },
  
  justifyCenter: { justifyContent: 'center' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyBetween: { justifyContent: 'space-between' },
  
  // Text alignment
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  
  // Margins
  marginVerticalMedium: { marginVertical: SPACING.md },
  marginVerticalLarge: { marginVertical: SPACING.lg },
  marginHorizontalMedium: { marginHorizontal: SPACING.md },
  marginHorizontalLarge: { marginHorizontal: SPACING.lg },
  marginTopMedium: { marginTop: SPACING.md },
  marginTopLarge: { marginTop: SPACING.lg },
  marginBottomSmall: { marginBottom: SPACING.sm },
  marginBottomMedium: { marginBottom: SPACING.md },
  marginBottomLarge: { marginBottom: SPACING.lg },
  marginRightMedium: { marginRight: SPACING.md },
  marginLeftMedium: { marginLeft: SPACING.md },
  
  // Padding
  paddingBottomLarge: { paddingBottom: SPACING.lg },
  paddingBottomXLarge: { paddingBottom: SPACING.xl },
  paddingHorizontalMedium: { paddingHorizontal: SPACING.md },
  paddingHorizontalLarge: { paddingHorizontal: SPACING.lg },
  
  // Additional margin styles
  marginBottom8: { marginBottom: 8 },
  marginBottom12: { marginBottom: 12 },
  marginTop16: { marginTop: 16 },
  marginTop24: { marginTop: 24 },
  
  // Additional padding styles
  padding16: { padding: 16 },
  paddingTop16: { paddingTop: 16 },
  paddingHorizontal20: { paddingHorizontal: 20 },
  
  // Overflow
  overflowHidden: { overflow: 'hidden' },
  overflowVisible: { overflow: 'visible' },
  
  // Opacity
  opacity50: { opacity: 0.5 },
  opacity75: { opacity: 0.75 },
  
  // Borders
  borderTop: { borderTopWidth: 1 },
  borderBottom: { borderBottomWidth: 1 },
  borderLeft: { borderLeftWidth: 1 },
  borderRight: { borderRightWidth: 1 },
});