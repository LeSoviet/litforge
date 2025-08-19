// Typography styles
import { StyleSheet } from 'react-native';
import { Theme } from '../types';
import { FONT_SIZES, FONT_WEIGHTS } from './designTokens';

/**
 * Estilos de tipografía que dependen del tema
 */
export const createTextStyles = (theme: Theme) => {
  return StyleSheet.create({
    // Texto básico
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

    // Sistema de texto
    textTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: theme.colors.text,
    },
    
    textSubtitle: {
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
    
    textLabel: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: theme.colors.text,
    },
    
    textHeading: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: theme.colors.text,
    },
    
    textLargeTitle: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: theme.colors.text,
    },

    // Botón con icono
    buttonIcon: {
      fontSize: FONT_SIZES.md,
      color: theme.colors.primary,
    },

    // Títulos y encabezados
    heading1: {
      color: theme.colors.text,
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
    },
    
    heading2: {
      color: theme.colors.text,
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
    },
    
    heading3: {
      color: theme.colors.text,
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.semibold,
    },
    
    // Subtítulo
    subtitle: {
    color: theme.colors.textSecondary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  


    // Texto de enlaces y acciones
    linkText: {
      color: theme.colors.primary,
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.medium,
    },
    
    // Texto de error
    errorText: {
      color: theme.colors.error || '#FF3B30',
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.normal,
    },
    
    // Texto de éxito
    successText: {
      color: theme.colors.success || '#34C759',
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.normal,
    },

    // Texto centrado
    textCenter: {
      textAlign: 'center',
    },
    
    // Texto alineado a la derecha
    textRight: {
      textAlign: 'right',
    },
    
    // Objeto text con propiedades anidadas
    text: {
      label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium,
        color: theme.colors.text,
      },
    } as any,
    
    // Estado vacío
    emptyState: {
      title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: theme.colors.text,
        textAlign: 'center',
      },
      subtitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.normal,
        color: theme.colors.textSecondary,
        textAlign: 'center',
      },
    } as any,
  });
};