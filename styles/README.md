# Sistema de Diseño - LitForge

## Descripción General

Este directorio contiene el sistema de diseño centralizado de LitForge, diseñado para facilitar la modificación manual de estilos y mantener consistencia visual en toda la aplicación.

## Archivos Principales

### 📁 `designConfig.ts` - **ARCHIVO PRINCIPAL PARA MODIFICACIONES**

Este es el archivo que debes modificar para cambiar la apariencia de la aplicación. Contiene:

- **DESIGN_SPACING**: Espaciado y márgenes
- **DESIGN_COLORS**: Paleta de colores completa
- **DESIGN_TYPOGRAPHY**: Tamaños y pesos de fuente
- **DESIGN_BORDERS**: Radios de borde y anchos
- **DESIGN_SHADOWS**: Sombras compatibles con web y móvil
- **DESIGN_COMPONENTS**: Configuración específica de componentes
- **DESIGN_ANIMATIONS**: Duraciones y curvas de animación

### 📁 `designTokens.ts` - Compatibilidad hacia atrás

Mantiene la compatibilidad con el código existente. **No modifiques este archivo directamente**, usa `designConfig.ts` en su lugar.

### 📁 Otros archivos

- `componentStyles.ts`: Estilos específicos de componentes
- `layoutStyles.ts`: Estilos de layout y navegación
- `index.ts`: Exportaciones principales

## Cómo Modificar Estilos

### ✅ Forma Correcta - Modificar `designConfig.ts`

```typescript
// Para cambiar el espaciado global
export const DESIGN_SPACING = {
  xs: 4,    // Cambia este valor
  sm: 8,    // Cambia este valor
  md: 16,   // Cambia este valor (era 12)
  // ...
};

// Para cambiar colores
export const DESIGN_COLORS = {
  primary: '#FF6B6B',     // Cambia el color primario
  secondary: '#4ECDC4',   // Cambia el color secundario
  // ...
};

// Para cambiar sombras
export const DESIGN_SHADOWS = {
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Aumentar sombra
    shadowOpacity: 0.25,                   // Más opaca
    shadowRadius: 6,                       // Más difusa
    elevation: 6,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
  },
};
```

### ❌ Forma Incorrecta - No modifiques otros archivos

```typescript
// ❌ NO hagas esto en componentStyles.ts
card: {
  padding: 20, // Valor hardcodeado
  margin: 15,  // Valor hardcodeado
}

// ✅ En su lugar, modifica designConfig.ts y usa:
card: {
  padding: DESIGN_SYSTEM.spacing.lg,
  margin: DESIGN_SYSTEM.spacing.md,
}
```

## Ejemplos de Modificaciones Comunes

### Cambiar el espaciado general

```typescript
// En designConfig.ts
export const DESIGN_SPACING = {
  xs: 6,    // Era 4, ahora más espacioso
  sm: 12,   // Era 8, ahora más espacioso
  md: 18,   // Era 12, ahora más espacioso
  lg: 24,   // Era 16, ahora más espacioso
  // ...
};
```

### Cambiar la paleta de colores

```typescript
// En designConfig.ts
export const DESIGN_COLORS = {
  // Tema azul oscuro
  primary: '#1E3A8A',
  primaryLight: '#3B82F6',
  primaryDark: '#1E40AF',
  
  // Superficie más oscura
  background: '#F8FAFC',
  surface: '#FFFFFF',
  // ...
};
```

### Ajustar sombras

```typescript
// En designConfig.ts
export const DESIGN_SHADOWS = {
  // Sombras más sutiles
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,  // Más sutil
    shadowRadius: 1,
    elevation: 1,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.05)',
  },
  // ...
};
```

### Modificar componentes específicos

```typescript
// En designConfig.ts
export const DESIGN_COMPONENTS = {
  card: {
    padding: DESIGN_SPACING.xl,        // Más padding
    borderRadius: DESIGN_BORDERS.radius.lg, // Más redondeado
    shadow: DESIGN_SHADOWS.lg,         // Sombra más pronunciada
  },
  
  button: {
    height: {
      sm: 36,  // Era 32, ahora más alto
      md: 48,  // Era 44, ahora más alto
      lg: 60,  // Era 56, ahora más alto
    },
  },
};
```

## Beneficios del Sistema

1. **Modificación Centralizada**: Cambia un valor y se aplica en toda la app
2. **Consistencia**: Todos los componentes usan los mismos tokens
3. **Compatibilidad Web/Móvil**: Las sombras funcionan en ambas plataformas
4. **TypeScript**: Autocompletado y verificación de tipos
5. **Fácil Mantenimiento**: Un solo lugar para todos los estilos

## Estructura de Archivos

```
styles/
├── designConfig.ts      ← MODIFICA AQUÍ
├── designTokens.ts      ← No modificar (compatibilidad)
├── componentStyles.ts   ← Usa tokens de designConfig
├── layoutStyles.ts      ← Usa tokens de designConfig
├── index.ts            ← Exportaciones
└── README.md           ← Esta documentación
```

## Migración de Código Existente

Si encuentras código con valores hardcodeados, reemplázalos:

```typescript
// ❌ Antes
style={{
  padding: 16,
  margin: 8,
  borderRadius: 12,
  backgroundColor: '#FFFFFF'
}}

// ✅ Después
style={{
  padding: DESIGN_SYSTEM.spacing.lg,
  margin: DESIGN_SYSTEM.spacing.sm,
  borderRadius: DESIGN_SYSTEM.borders.radius.md,
  backgroundColor: DESIGN_SYSTEM.colors.surface
}}
```

## Soporte

Si tienes dudas sobre cómo modificar algún estilo específico, revisa:

1. Este README
2. Los comentarios en `designConfig.ts`
3. Los ejemplos en `componentStyles.ts`