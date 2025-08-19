// Design tokens - spacing, colors, typography, and other design constants
// NOTA: Para modificaciones fáciles, usa designConfig.ts
// Este archivo mantiene compatibilidad hacia atrás

import { DESIGN_SYSTEM } from './designConfig';

// Espaciado estándar usado en toda la app
// Usa DESIGN_SYSTEM.spacing para modificaciones centralizadas
export const SPACING = DESIGN_SYSTEM.spacing;

// Radios de borde estándar
// Usa DESIGN_SYSTEM.borders.radius para modificaciones centralizadas
export const BORDER_RADIUS = {
  sm: DESIGN_SYSTEM.borders.radius.sm,
  md: DESIGN_SYSTEM.borders.radius.md,
  lg: DESIGN_SYSTEM.borders.radius.lg,
  xl: DESIGN_SYSTEM.borders.radius.xl,
} as const;

// Sombras estándar - Compatible con react-native-web
// Usa DESIGN_SYSTEM.shadows para modificaciones centralizadas
export const SHADOWS = {
  sm: DESIGN_SYSTEM.shadows.sm,
  md: DESIGN_SYSTEM.shadows.md,
  lg: DESIGN_SYSTEM.shadows.lg,
} as const;

// Tamaños de fuente estándar
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
} as const;

// Pesos de fuente
export const FONT_WEIGHTS = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;