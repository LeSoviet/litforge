// Layout and container styles
import { StyleSheet } from 'react-native';
import { Theme } from '../types';
import { SPACING, BORDER_RADIUS } from './designTokens';

/**
 * Estilos de layout que dependen del tema
 */
export const createLayoutStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    // Contenedores principales
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    main: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    surface: {
      backgroundColor: theme.colors.surface,
      borderRadius: BORDER_RADIUS.md,
    },
  } as any,


    
    safeContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },

    // Layouts flexibles comunes
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    column: {
      flexDirection: 'column',
    },
    
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // Contenedor centrado
    centerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPACING.lg,
    },
    
    // Contenido principal
    content: {
      flex: 1,
      paddingHorizontal: SPACING.lg,
    },
    
    // Contenedor de iconos
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
    },

    // Márgenes y padding comunes
    marginHorizontal: {
      marginHorizontal: SPACING.md,
    },
    
    marginVertical: {
      marginVertical: SPACING.md,
    },
    
    paddingHorizontal: {
      paddingHorizontal: SPACING.lg,
    },
    
    paddingVertical: {
      paddingVertical: SPACING.md,
    },

    // Separadores
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: SPACING.md,
    },
    
    spacer: {
      height: SPACING.lg,
    },

    // Layout system
    layout: {
      row: {
        flexDirection: 'row',
      },
      column: {
        flexDirection: 'column',
      },
    } as any,

    // Spacing system
    spacing: {
      padding: {
        sm: {
          padding: SPACING.sm,
        },
        md: {
          padding: SPACING.md,
        },
        lg: {
          padding: SPACING.lg,
        },
      },
      margin: {
        topMd: {
          marginTop: SPACING.md,
        },
        bottomXs: {
          marginBottom: SPACING.xs,
        },
        bottomSm: {
          marginBottom: SPACING.sm,
        },
        bottomMd: {
          marginBottom: SPACING.md,
        },
        bottomLg: {
          marginBottom: SPACING.lg,
        },
        bottomXl: {
          marginBottom: SPACING.xl,
        },
        leftMd: {
          marginLeft: SPACING.md,
        },
        rightMd: {
          marginRight: SPACING.md,
        },
        rightSm: {
          marginRight: SPACING.sm,
        },
      },
    } as any,
  });

  // Añadir propiedades anidadas después de StyleSheet.create()
  return {
    ...baseStyles,
    header: {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        backgroundColor: theme.colors.background,
      },
      title: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
      },
    },
    text: {
      label: {
        fontSize: 14,
        color: theme.colors.text,
        marginBottom: SPACING.xs,
      },
      title: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
      },
      caption: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 8,
      },
    },
  };
};

/**
 * Estilos de layout que no dependen del tema
 */
export const staticLayoutStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  
  absolute: {
    position: 'absolute',
  },
  
  hidden: {
    display: 'none',
  },
  
  visible: {
    display: 'flex',
  },
  
  // Text alignment
  textCenter: {
    textAlign: 'center',
  },
  
  // Margins
  marginVerticalMedium: {
    marginVertical: SPACING.md,
  },
  
  marginTopMedium: {
    marginTop: SPACING.md,
  },
  
  marginBottomSmall: {
    marginBottom: SPACING.sm,
  },
  
  marginRightMedium: {
    marginRight: SPACING.md,
  },
  
  marginBottomMedium: {
    marginBottom: SPACING.md,
  },
  
  marginTop16: {
    marginTop: 16,
  },
  
  // Padding
  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  
  paddingBottomLarge: {
    paddingBottom: SPACING.xl,
  },
  
  // Flex layout
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  
  flexRow: {
    flexDirection: 'row',
  },
  
  alignCenter: {
    alignItems: 'center',
  },
  
  marginBottom12: {
    marginBottom: 12,
  },
  
  marginBottom8: {
    marginBottom: 8,
  },
  
  padding16: {
    padding: 16,
  },
  
  marginHorizontal8: {
    marginHorizontal: 8,
  },
  
  marginLeft8: {
    marginLeft: 8,
  },
  
  marginTop24: {
    marginTop: 24,
  },
  
  paddingTop16: {
    paddingTop: 16,
  },
});