// Correcciones específicas para Android - Modo oscuro y centrado
import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../types';

/**
 * Estilos específicos para corregir inconsistencias en Android
 * Versión simplificada para evitar crashes en Android Go
 */
export const createAndroidFixes = (theme: Theme) => {
  // Simplificar para Android Go - solo aplicar fixes básicos
  if (Platform.OS !== 'android') {
    return StyleSheet.create({
      textCenterFix: {},
      buttonCenterFix: {},
      centerContainerFix: {},
      buttonDarkModeFix: {},
      textDarkModeFix: {},
      surfaceDarkModeFix: {},
      iconDarkModeFix: {},
      inputDarkModeFix: {},
      headerDarkModeFix: {},
    });
  }

  return StyleSheet.create({
    // Corrección básica para centrado de texto
    textCenterFix: {
      textAlign: 'center',
    },
    
    // Corrección básica para botones
    buttonCenterFix: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    // Corrección básica para contenedores
    centerContainerFix: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // Corrección simplificada para botones en modo oscuro
    buttonDarkModeFix: {
      backgroundColor: theme.colors.surface,
    },
    
    // Corrección simplificada para texto en modo oscuro
    textDarkModeFix: {
      color: theme.colors.text,
    },
    
    // Corrección simplificada para superficies en modo oscuro
    surfaceDarkModeFix: {
      backgroundColor: theme.colors.surface,
    },
    
    // Corrección simplificada para iconos en modo oscuro
    iconDarkModeFix: {
      color: theme.colors.text,
    },
    
    // Corrección simplificada para inputs en modo oscuro
    inputDarkModeFix: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderColor: theme.colors.border,
    },
    
    // Corrección simplificada para headers en modo oscuro
    headerDarkModeFix: {
      backgroundColor: theme.colors.background,
    },
  });
};

/**
 * Hook simplificado para aplicar correcciones específicas de Android
 */
export const useAndroidFixes = (theme: Theme) => {
  return createAndroidFixes(theme);
};

/**
 * Utilidad simplificada para combinar estilos con correcciones de Android
 */
export const withAndroidFixes = (baseStyles: any, theme: Theme) => {
  const androidFixes = createAndroidFixes(theme);
  
  return {
    ...baseStyles,
    ...androidFixes,
  };
};