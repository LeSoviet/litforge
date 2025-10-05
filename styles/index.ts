// Centralized exports for consolidated style system

// Design tokens and theme system
export {
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_SIZES,
  FONT_WEIGHTS,
  COLORS,
  LIGHT_THEME,
  DARK_THEME,
  createLayoutStyles,
  createTextStyles,
} from './theme';

// Component styles
export {
  createComponentStyles,
  staticComponentStyles,
} from './components';

// Legacy common styles (for backward compatibility)
export {
  createCommonStyles,
} from './commonStyles';