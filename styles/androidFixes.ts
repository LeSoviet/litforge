// Correcciones específicas para Android - Modo oscuro y centrado
import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../types';

/**
 * Estilos específicos para corregir inconsistencias en Android
 * Especialmente para modo oscuro y problemas de centrado
 */
export const createAndroidFixes = (theme: Theme) => {
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
    // Corrección para centrado de texto en Android modo oscuro
    textCenterFix: {
      textAlign: 'center',
      textAlignVertical: 'center', // Específico para Android
      includeFontPadding: false, // Elimina padding extra en Android
    },
    
    // Corrección para centrado de botones en Android
    buttonCenterFix: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlignVertical: 'center',
      includeFontPadding: false,
    },
    
    // Corrección para contenedores centrados
    centerContainerFix: {
      alignItems: 'center',
      justifyContent: 'center',
      // Forzar re-render en cambio de tema
      backgroundColor: theme.colors.background,
    },
    
    // Corrección para botones en modo oscuro
    buttonDarkModeFix: {
      backgroundColor: theme.dark ? theme.colors.surface : theme.colors.primary,
      borderWidth: theme.dark ? 1 : 0,
      borderColor: theme.dark ? theme.colors.border : 'transparent',
      elevation: theme.dark ? 2 : 4, // Sombra específica para Android
    },
    
    // Corrección para texto en modo oscuro
    textDarkModeFix: {
      color: theme.colors.text,
      // Forzar contraste en modo oscuro
      textShadowColor: theme.dark ? 'rgba(0,0,0,0.3)' : 'transparent',
      textShadowOffset: theme.dark ? { width: 0, height: 1 } : { width: 0, height: 0 },
      textShadowRadius: theme.dark ? 1 : 0,
    },
    
    // Corrección para superficies en modo oscuro
    surfaceDarkModeFix: {
      backgroundColor: theme.colors.surface,
      // Asegurar contraste adecuado
      borderWidth: theme.dark ? StyleSheet.hairlineWidth : 0,
      borderColor: theme.dark ? theme.colors.border : 'transparent',
    },
    
    // Corrección para iconos en modo oscuro
    iconDarkModeFix: {
      tintColor: theme.colors.text,
      // Mejorar visibilidad en modo oscuro
      opacity: theme.dark ? 0.9 : 1,
    },
    
    // Corrección para inputs en modo oscuro
    inputDarkModeFix: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.dark ? theme.colors.border : theme.colors.primary,
      // Padding específico para Android
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    
    // Corrección para headers en modo oscuro
    headerDarkModeFix: {
      backgroundColor: theme.colors.background,
      borderBottomWidth: theme.dark ? StyleSheet.hairlineWidth : 0,
      borderBottomColor: theme.dark ? theme.colors.border : 'transparent',
      elevation: theme.dark ? 1 : 3,
    },
  });
};

/**
 * Hook para aplicar correcciones específicas de Android
 */
export const useAndroidFixes = (theme: Theme) => {
  return createAndroidFixes(theme);
};

/**
 * Utilidad para combinar estilos con correcciones de Android
 */
export const withAndroidFixes = (baseStyles: any, theme: Theme) => {
  const androidFixes = createAndroidFixes(theme);
  
  return {
    ...baseStyles,
    ...androidFixes,
  };
};