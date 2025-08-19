import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, getTheme, shadows } from '../theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme === 'dark');

  // Get button styles based on variant
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.colors.surface : theme.colors.primary,
          ...shadows.small,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.colors.surface : theme.colors.surface,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? theme.colors.border : theme.colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.colors.surface : theme.colors.error,
            ...shadows.small,
        };
      default:
        return baseStyle;
    }
  };

  // Get text styles based on variant
  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: disabled ? theme.colors.textSecondary : '#ffffff',
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: disabled ? theme.colors.textSecondary : theme.colors.text,
        };
      case 'outline':
        return {
          ...baseStyle,
          color: disabled ? theme.colors.textSecondary : theme.colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: disabled ? theme.colors.textSecondary : theme.colors.primary,
        };
      case 'danger':
        return {
          ...baseStyle,
          color: disabled ? theme.colors.textSecondary : '#ffffff',
        };
      default:
        return baseStyle;
    }
  };

  // Get size styles
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          container: {
            paddingHorizontal: 12,
            paddingVertical: 8,
            minHeight: 32,
          },
          text: {
            fontSize: 12,
          },
        };
      case 'medium':
        return {
          container: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            minHeight: 44,
          },
          text: {
            fontSize: 14,
          },
        };
      case 'large':
        return {
          container: {
            paddingHorizontal: 20,
            paddingVertical: 16,
            minHeight: 52,
          },
          text: {
            fontSize: 16,
          },
        };
      default:
        return {
          container: {},
          text: {},
        };
    }
  };

  // Get icon color
  const getIconColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return disabled ? theme.colors.textSecondary : '#ffffff';
      case 'secondary':
        return disabled ? theme.colors.textSecondary : theme.colors.text;
      case 'outline':
      case 'ghost':
        return disabled ? theme.colors.textSecondary : theme.colors.primary;
      default:
        return theme.colors.text;
    }
  };

  const sizeStyles = getSizeStyles();
  const buttonStyles = getButtonStyles();
  const textStyles = getTextStyles();
  const iconColor = getIconColor();
  const iconSize = size === 'small' ? 14 : size === 'large' ? 18 : 16;

  const styles = StyleSheet.create({
    container: {
      ...buttonStyles,
      ...sizeStyles.container,
      ...(fullWidth && { width: '100%' }),
      opacity: disabled ? 0.6 : 1,
    },
    text: {
      ...textStyles,
      ...sizeStyles.text,
    },
    iconLeft: {
      marginRight: 8,
    },
    iconRight: {
      marginLeft: 8,
    },
  });

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={iconColor}
        />
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <Ionicons
            name={icon as any}
            size={iconSize}
            color={iconColor}
            style={styles.iconLeft}
          />
        )}
        <Text style={[styles.text, textStyle]}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <Ionicons
            name={icon as any}
            size={iconSize}
            color={iconColor}
            style={styles.iconRight}
          />
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;