// Configuración centralizada de diseño - Fácil modificación manual
// Este archivo centraliza todos los tokens de diseño para facilitar modificaciones

/**
 * ESPACIADO - Modifica estos valores para cambiar el espaciado global
 */
export const DESIGN_SPACING = {
  // Espaciado base (multiplica por estos valores)
  baseUnit: 4,
  
  // Espaciado específico (fácil de modificar)
  none: 0,
  xs: 4,    // Extra pequeño
  sm: 8,    // Pequeño
  md: 12,   // Mediano
  lg: 16,   // Grande
  xl: 20,   // Extra grande
  xxl: 24,  // Extra extra grande
  xxxl: 32, // Máximo
} as const;

/**
 * COLORES - Modifica estos valores para cambiar la paleta de colores
 */
export const DESIGN_COLORS = {
  // Colores primarios
  primary: '#007AFF',
  primaryLight: '#4DA3FF',
  primaryDark: '#0056CC',
  
  // Colores secundarios
  secondary: '#5856D6',
  secondaryLight: '#7B7AE8',
  secondaryDark: '#3F3EB3',
  
  // Colores de estado
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // Colores neutros
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
  
  // Colores de superficie
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F2F2F7',
  
  // Colores de texto
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textInverse: '#FFFFFF',
} as const;

/**
 * TIPOGRAFÍA - Modifica estos valores para cambiar la tipografía
 */
export const DESIGN_TYPOGRAPHY = {
  // Tamaños de fuente
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Pesos de fuente
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  
  // Altura de línea
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
} as const;

/**
 * BORDES - Modifica estos valores para cambiar los bordes y radios
 */
export const DESIGN_BORDERS = {
  // Radios de borde
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999, // Completamente redondeado
  },
  
  // Anchos de borde
  width: {
    none: 0,
    thin: 1,
    medium: 2,
    thick: 4,
  },
} as const;

/**
 * SOMBRAS - Modifica estos valores para cambiar las sombras
 */
export const DESIGN_SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    boxShadow: 'none',
  },
  
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.05)',
  },
  
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.25)',
  },
} as const;

/**
 * COMPONENTES - Configuración específica de componentes
 */
export const DESIGN_COMPONENTS = {
  // Configuración de botones
  button: {
    height: {
      sm: 32,
      md: 44,
      lg: 56,
    },
    padding: {
      horizontal: DESIGN_SPACING.lg,
      vertical: DESIGN_SPACING.sm,
    },
    borderRadius: DESIGN_BORDERS.radius.md,
  },
  
  // Configuración de cards
  card: {
    padding: DESIGN_SPACING.lg,
    margin: {
      horizontal: DESIGN_SPACING.md,
      vertical: DESIGN_SPACING.sm,
    },
    borderRadius: DESIGN_BORDERS.radius.md,
    shadow: DESIGN_SHADOWS.md,
  },
  
  // Configuración de inputs
  input: {
    height: 44,
    padding: {
      horizontal: DESIGN_SPACING.md,
      vertical: DESIGN_SPACING.sm,
    },
    borderRadius: DESIGN_BORDERS.radius.sm,
    borderWidth: DESIGN_BORDERS.width.thin,
  },
  
  // Configuración de headers
  header: {
    padding: {
      horizontal: DESIGN_SPACING.lg,
      vertical: DESIGN_SPACING.md,
    },
    margin: {
      horizontal: DESIGN_SPACING.md,
      bottom: DESIGN_SPACING.lg,
    },
    borderRadius: DESIGN_BORDERS.radius.md,
    shadow: DESIGN_SHADOWS.sm,
  },
} as const;

/**
 * ANIMACIONES - Configuración de animaciones y transiciones
 */
export const DESIGN_ANIMATIONS = {
  // Duraciones
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  // Curvas de animación
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Exportar todo como un objeto principal para fácil acceso
export const DESIGN_SYSTEM = {
  spacing: DESIGN_SPACING,
  colors: DESIGN_COLORS,
  typography: DESIGN_TYPOGRAPHY,
  borders: DESIGN_BORDERS,
  shadows: DESIGN_SHADOWS,
  components: DESIGN_COMPONENTS,
  animations: DESIGN_ANIMATIONS,
} as const;

// Tipos para TypeScript
export type DesignSpacing = keyof typeof DESIGN_SPACING;
export type DesignColors = keyof typeof DESIGN_COLORS;
export type DesignFontSize = keyof typeof DESIGN_TYPOGRAPHY.fontSize;
export type DesignFontWeight = keyof typeof DESIGN_TYPOGRAPHY.fontWeight;
export type DesignBorderRadius = keyof typeof DESIGN_BORDERS.radius;
export type DesignShadow = keyof typeof DESIGN_SHADOWS;