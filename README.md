# LitForge 📚

Una aplicación completa de lectura de documentos construida con React Native y Expo. Lee documentos PDF y Markdown con funciones avanzadas de lectura, marcadores, notas y seguimiento de progreso.

## ✨ Características principales

### 📖 Soporte de documentos
- **PDF nativo**: Visualización fluida con `react-native-pdf`
- **Markdown completo**: Renderizado con sintaxis resaltada usando `@cosmicmedia/react-native-markdown-display`
- **Importación fácil**: Selecciona archivos directamente desde tu dispositivo

### 🎯 Funciones de lectura
- **Marcadores inteligentes**: Guarda tus páginas favoritas
- **Sistema de notas**: Añade comentarios personalizados
- **Progreso automático**: Seguimiento del avance de lectura
- **Navegación fluida**: Desliza entre páginas con controles intuitivos

### 🎨 Interfaz moderna
- **Tema deep blue**: Diseño elegante y profesional
- **Modo oscuro/claro**: Cambia según tu preferencia
- **Diseño responsivo**: Adaptado para diferentes tamaños de pantalla
- **Animaciones suaves**: Transiciones fluidas entre pantallas

## 🚀 Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Dispositivo móvil con Expo Go o emulador

### Pasos de instalación

```
# Clona el repositorio
git clone <repository-url>
cd litforge

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm start
```

## 📱 Uso

### Importar documentos
1. Abre la aplicación
2. Toca el botón "+" en la pantalla principal
3. Selecciona archivos PDF o Markdown desde tu dispositivo
4. Los documentos se copiarán automáticamente a la biblioteca local

### Leer documentos
1. Toca cualquier documento en tu biblioteca
2. Usa gestos para navegar:
   - **Deslizar**: Cambiar páginas (PDF)
   - **Pellizcar**: Zoom in/out
   - **Tocar**: Mostrar/ocultar controles

### Marcadores y notas
- **Añadir marcador**: Toca el ícono de estrella en la barra superior
- **Añadir nota**: Toca el ícono de nota y escribe tu comentario
- **Ver marcadores**: Accede desde el menú de navegación

### Historias de ejemplo
- Explora una colección curada de historias fascinantes de la historia mundial
- Accede a través de la pestaña "Historias" en la navegación inferior

### Configuración
- Accede a la pestaña "Explorar" para:
  - Cambiar tema (oscuro/claro)
  - Ajustar tamaño de fuente
  - Configurar auto-guardado
  - Gestionar notificaciones

## 🏗️ Estructura del proyecto

```
litforge/
├── app/                          # Pantallas principales
│   ├── (tabs)/
│   │   ├── index.tsx            # Biblioteca de documentos
│   │   ├── explore.tsx          # Configuraciones
│   │   └── stories.tsx          # Historias de ejemplo
│   └── reader.tsx               # Lector de documentos
├── components/                   # Componentes reutilizables
│   ├── ThemedText.tsx
│   └── ThemedView.tsx
├── constants/                    # Constantes y configuración
│   └── Colors.ts
├── hooks/                        # Hooks personalizados
│   └── useThemeColor.ts
├── services/                     # Lógica de negocio
│   ├── DocumentService.ts       # Gestión de documentos
│   └── SettingsService.ts       # Configuraciones
├── theme/                        # Sistema de temas
│   └── colors.ts
└── types/                        # Definiciones TypeScript
    └── index.ts
```

## 🛠️ Tecnologías utilizadas

### Core
- **React Native**: Framework multiplataforma
- **Expo**: Herramientas de desarrollo y despliegue
- **TypeScript**: Tipado estático para mejor desarrollo

### Dependencias principales
- `react-native-pdf`: Visor de PDF nativo
- `@cosmicmedia/react-native-markdown-display`: Renderizado de Markdown
- `expo-document-picker`: Selección de archivos
- `expo-file-system`: Manejo del sistema de archivos
- `@react-native-async-storage/async-storage`: Almacenamiento local

### Desarrollo
- `@expo/vector-icons`: Iconografía
- `expo-router`: Navegación basada en archivos
- `expo-constants`: Constantes del sistema

## 📋 Scripts disponibles

```bash
# Desarrollo
npm start              # Inicia Expo development server
npm run android        # Ejecuta en Android
npm run ios           # Ejecuta en iOS
npm run web           # Ejecuta en navegador web

# Construcción
npm run build         # Construye para producción
```

## 🎯 Funcionalidades implementadas

- ✅ Visor de PDF con navegación fluida
- ✅ Renderizado completo de Markdown
- ✅ Sistema de marcadores inteligentes
- ✅ Notas personalizadas por documento
- ✅ Seguimiento de progreso de lectura
- ✅ Importación desde dispositivo
- ✅ Interfaz moderna y responsiva
- ✅ Tema oscuro/claro
- ✅ Gestión completa de documentos
- ✅ Scroll en página de configuraciones
- ✅ Colección de historias de ejemplo

## 🔮 Próximas mejoras

- [ ] Sincronización en la nube
- [ ] Estadísticas de lectura detalladas
- [ ] Búsqueda dentro de documentos
- [ ] Widgets para pantalla de inicio
- [ ] Más temas personalizables
- [ ] Soporte para más formatos (EPUB, DOCX)
- [ ] Compartir documentos y notas
- [ ] Modo de lectura nocturna avanzado

## 🐛 Problemas resueltos recientemente

- ✅ Corregidas advertencias de StatusBar en Android
- ✅ Solucionados errores de eliminación de archivos
- ✅ Mejorada la estabilidad general de la aplicación
- ✅ Eliminada funcionalidad OCR problemática

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

1. Revisa los [issues existentes](../../issues)
2. Crea un nuevo issue con detalles del problema
3. Incluye información del dispositivo y versión de la app

---

**¡Disfruta leyendo con LitForge!** 🚀📖✨