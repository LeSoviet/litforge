import { StyleSheet } from 'react-native';
import { Theme } from '../types';
import {
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_SIZES,
} from './designTokens';
import { createLayoutStyles, staticLayoutStyles } from './layoutStyles';
import { createComponentStyles } from './componentStyles';
import { createTextStyles } from './textStyles';

// Re-export design tokens for backward compatibility
export {
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_SIZES,
} from './designTokens';

/**
 * Función para crear estilos comunes que combina todos los módulos
 * Mantiene compatibilidad con el código existente
 */
export const createCommonStyles = (theme: Theme) => {
  const layoutStyles = createLayoutStyles(theme);
  const componentStyles = createComponentStyles(theme);
  const textStyles = createTextStyles(theme);

  // Combinar estilos preservando estructura anidada
  const combinedStyles = {
    ...layoutStyles,
    ...componentStyles,
    ...textStyles,
  };

  // Asegurar que las propiedades anidadas se preserven
  if (layoutStyles.header && componentStyles.header) {
    // Combinar header de layoutStyles (con propiedades anidadas) y componentStyles (plano)
    (combinedStyles as any).header = {
      ...componentStyles.header, // Estilos base del header
      container: layoutStyles.header.container,
      title: layoutStyles.header.title,
    };
  } else if (layoutStyles.header) {
    (combinedStyles as any).header = layoutStyles.header;
  } else if (componentStyles.header) {
    (combinedStyles as any).header = componentStyles.header;
  }
  
  if (layoutStyles.text) {
    (combinedStyles as any).text = {
      ...combinedStyles.text,
      ...layoutStyles.text,
    };
  }
  
  if (textStyles.emptyState) {
    (combinedStyles as any).emptyState = {
      ...combinedStyles.emptyState,
      ...textStyles.emptyState,
    };
  }

  return combinedStyles;
};

/**
 * Estilos que no dependen del tema
 * Re-exporta desde layoutStyles para compatibilidad
 */
export const staticStyles = staticLayoutStyles;