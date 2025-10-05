import { StyleSheet } from 'react-native';
import { Theme } from '../types';
import {
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_SIZES,
  createLayoutStyles,
  createTextStyles,
} from './theme';
import { createComponentStyles, staticComponentStyles } from './components';

// Re-export design tokens for backward compatibility
export {
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_SIZES,
} from './theme';

/**
 * Función para crear estilos comunes que combina todos los módulos
 * Mantiene compatibilidad con el código existente
 */
export const createCommonStyles = (theme: Theme) => {
  const layoutStyles = createLayoutStyles(theme);
  const textStyles = createTextStyles(theme);
  const componentStyles = createComponentStyles(theme);

  // Combinar estilos preservando estructura anidada
  const combinedStyles = {
    ...layoutStyles,
    ...componentStyles,
    ...textStyles,
  };

  return combinedStyles;
};

/**
 * Estilos que no dependen del tema
 * Re-exporta desde components para compatibilidad
 */
export const staticStyles = staticComponentStyles;