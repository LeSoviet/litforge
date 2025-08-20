// Component-specific styles (cards, buttons, inputs, etc.)
import { StyleSheet } from 'react-native';
import { Theme } from '../types';
import { SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZES, FONT_WEIGHTS } from './designTokens';
import { useAndroidFixes } from './androidFixes';

/**
 * Estilos de componentes que dependen del tema
 */
export const createComponentStyles = (theme: Theme) => {
  return StyleSheet.create({
    // Headers comunes
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
      textAlignVertical: 'center',
      includeFontPadding: false,
    },
    
    headerSubtitle: {
      fontSize: FONT_SIZES.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      textAlignVertical: 'center',
      includeFontPadding: false,
      marginTop: SPACING.xs,
    },

    // Cards comunes
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
      marginHorizontal: 0,
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

    // Botones principales
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      alignItems: 'center',
      justifyContent: 'center',
      primary: {
        backgroundColor: theme.colors.primary,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
      },
      icon: {
        backgroundColor: 'transparent',
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
      },
    } as any,
    
    buttonPrimary: {
      backgroundColor: theme.colors.primary,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.md,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.sm,
    },
    
    buttonSecondary: {
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    
    buttonText: {
      color: theme.colors.background,
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.semibold,
    },
    
    buttonPrimaryText: {
      color: theme.colors.background,
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.semibold,
    },
    
    buttonTextSecondary: {
      color: theme.colors.text,
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.semibold,
    },
    
    buttonSecondaryText: {
      color: theme.colors.text,
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.semibold,
    },

    // Botones de iconos
    iconButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.sm,
      padding: SPACING.xs, // Reducido de sm a xs para hacer el botón más pequeño
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: 36, // Tamaño mínimo más compacto
      minHeight: 36,
    },

    // Contenedores de listas
    listContainer: {
      paddingHorizontal: SPACING.md,
      paddingBottom: SPACING.lg,
    },

    emptyListContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
    },

    // Inputs comunes
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.sm,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      fontSize: FONT_SIZES.md,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      chip: {
        backgroundColor: theme.colors.surface,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        marginRight: SPACING.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      chipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      },
      chipText: {
        fontSize: FONT_SIZES.sm,
        color: theme.colors.text,
      },
      chipTextActive: {
        color: theme.colors.background,
      },
    } as any,

    // Modales
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    modal: {
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
      margin: SPACING.lg,
      ...SHADOWS.lg,
    },
    
    title: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: theme.colors.text,
      marginBottom: SPACING.md,
    },

    // Estados vacíos
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPACING.xxl,
    },
    
    emptyStateText: {
      fontSize: FONT_SIZES.lg,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: SPACING.lg,
    },
    
    emptyStateSubtext: {
      fontSize: FONT_SIZES.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: SPACING.xl,
    },
  });
};