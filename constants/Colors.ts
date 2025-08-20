// Re-export colors from theme/colors for backward compatibility
import { colors } from '../theme/colors';

export { colors };

// Export light and dark color themes for backward compatibility
export const Colors = {
  light: colors.light,
  dark: colors.dark,
};