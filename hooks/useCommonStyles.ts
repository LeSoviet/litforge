import { useMemo } from 'react';
import { useApp } from '../contexts';
import { createCommonStyles, staticStyles, SPACING, BORDER_RADIUS, SHADOWS } from '../styles/commonStyles';

/**
 * Hook personalizado para acceder a estilos comunes con tema
 * 
 * Este hook optimiza el rendimiento mediante memoización y proporciona
 * acceso centralizado a todos los estilos comunes de la aplicación.
 * 
 * Elimina la necesidad de crear StyleSheet.create() en cada componente,
 * reduciendo re-renders innecesarios identificados en el análisis.
 * 
 * @returns Objeto con estilos comunes, constantes de diseño y utilidades
 */
export const useCommonStyles = () => {
  const { theme } = useApp();
  
  // Memoización para evitar recrear estilos en cada render
  const themedStyles = useMemo(() => {
    return createCommonStyles(theme) as any;
  }, [theme]);
  
  // Retorna todos los estilos y constantes necesarios
  return {
    // Estilos que dependen del tema (memoizados)
    styles: themedStyles,
    
    // Estilos estáticos (no cambian con el tema)
    staticStyles,
    
    // Constantes de diseño para uso directo
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    
    // Tema actual para casos especiales
    theme,
  };
};

/**
 * Hook simplificado para casos donde solo se necesitan los estilos
 * 
 * @returns Solo los estilos comunes con tema aplicado
 */
export const useStyles = () => {
  const { styles } = useCommonStyles();
  return styles;
};

/**
 * Hook para acceder solo a las constantes de diseño
 * 
 * @returns Constantes de espaciado, bordes y sombras
 */
export const useDesignTokens = () => {
  return {
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
  };
};