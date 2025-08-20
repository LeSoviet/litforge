# Android Dark Mode Fixes

## Problema Identificado

Se detectaron inconsistencias en el modo oscuro específicamente en dispositivos Android, incluyendo:

1. **Problemas de centrado de texto**: El texto no se centraba correctamente debido a padding interno de fuentes en Android
2. **Contraste insuficiente**: Los colores del tema oscuro no proporcionaban suficiente contraste en pantallas Android
3. **StatusBar inconsistente**: La barra de estado no se configuraba correctamente para Android en modo oscuro

## Soluciones Implementadas

### 1. Correcciones de Centrado (`styles/androidFixes.ts`)

- **`textAlignVertical: 'center'`**: Centra el texto verticalmente en Android
- **`includeFontPadding: false`**: Elimina el padding interno de fuentes que causa desalineación
- **Estilos específicos**: Contenedores, botones, inputs y superficies optimizados para Android

### 2. Mejoras de Contraste (`theme/colors.ts`)

- **Background**: Cambiado de `#0f172a` a `#0F0F0F` para mayor contraste
- **Surface**: Cambiado de `#1e293b` a `#1A1A1A` para mejor definición
- **Text**: Cambiado a `#FFFFFF` para máxima legibilidad
- **TextSecondary**: Cambiado a `#B0B0B0` para mejor contraste
- **Border**: Cambiado a `#333333` para bordes más visibles

### 3. Configuración de StatusBar (`app/_layout.tsx`)

- **backgroundColor**: Color específico para Android según el tema
- **translucent**: Deshabilitado en Android para evitar superposiciones
- **Detección de plataforma**: Configuración condicional solo para Android

### 4. Aplicación en Componentes

#### Archivos Actualizados:
- `styles/componentStyles.ts`: Headers con correcciones de centrado
- `styles/textStyles.ts`: Estilos de texto con fixes específicos de Android
- `app/(tabs)/explore.tsx`: Aplicación de androidFixes en elementos de UI
- `screens/SettingsScreen.tsx`: Correcciones en títulos y texto centrado

## Uso de las Correcciones

```typescript
import { useAndroidFixes } from '@/styles/androidFixes';

const MyComponent = () => {
  const { theme } = useTheme();
  const androidFixes = useAndroidFixes(theme);
  
  return (
    <Text style={[styles.myText, androidFixes.textCenterFix]}>
      Texto centrado correctamente en Android
    </Text>
  );
};
```

## Estilos Disponibles

- `textCenterFix`: Centrado de texto optimizado para Android
- `containerCenterFix`: Centrado de contenedores
- `buttonCenterFix`: Centrado de texto en botones
- `surfaceFix`: Superficies con mejor contraste
- `iconCenterFix`: Centrado de iconos
- `inputCenterFix`: Centrado de texto en inputs
- `headerCenterFix`: Centrado de headers

## Beneficios

1. **Consistencia visual**: Mismo aspecto en iOS y Android
2. **Mejor legibilidad**: Contraste optimizado para pantallas Android
3. **UX mejorada**: Elementos correctamente alineados y centrados
4. **Mantenibilidad**: Correcciones centralizadas y reutilizables

## Notas Técnicas

- Las correcciones solo se aplican en Android (`Platform.OS === 'android'`)
- No afectan el comportamiento en iOS o web
- Son completamente opcionales y pueden aplicarse selectivamente
- Mantienen compatibilidad con estilos existentes