// Unified App Context - Theme, Font, and Language management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../types';
import { ThemeType } from '../types/types';
import { LIGHT_THEME, DARK_THEME } from '../styles/theme';

// Types
export type FontFamily = 'default' | 'serif' | 'monospace' | 'cursive';
export type Language = 'es' | 'en' | 'pt';

interface AppContextType {
  // Theme
  theme: Theme;
  themeType: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (isDark: boolean) => void;
  setThemeType: (type: ThemeType) => void;
  cycleTheme: () => void;
  
  // Font
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  getFontStyle: () => { fontFamily: string };
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  
  // Loading state
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Font mapping
const fontFamilyMap: Record<FontFamily, string> = {
  default: 'System',
  serif: 'serif',
  monospace: 'monospace',
  cursive: 'cursive',
};

// Font display names for UI
export const fontDisplayNames: Record<FontFamily, string> = {
  default: 'Sistema',
  serif: 'Serif',
  monospace: 'Monospace',
  cursive: 'Cursiva',
};

// Translations
const translations: Record<string, Record<string, string>> = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.library': 'Mi Biblioteca',
    'nav.donate': 'Donar',
    'nav.options': 'Opciones',
    'nav.stories': 'Historias',
    
    // Library Screen
    'library.title': 'Mi Biblioteca',
    'library.empty.title': '¡Comienza tu biblioteca!',
    'library.empty.subtitle': 'Importa documentos PDF o Markdown para comenzar tu experiencia de lectura personalizada.',
    'library.import': 'Importar Documento',
    'library.filter.all': 'Todos',
    'library.filter.pdf': 'PDF',
    'library.filter.md': 'Markdown',
    'library.sort.name': 'Nombre',
    'library.sort.type': 'Tipo',
    'library.sort.date': 'Fecha',
    'library.loading': 'Cargando documentos...',
    
    // Stories Screen
    'stories.title': 'Historias',
    'stories.subtitle': 'Explora una colección curada de historias fascinantes de la historia mundial.',
    'stories.loading': 'Cargando historias...',
    'stories.freeStory': 'Historia gratuita',
    
    // Donate Screen
    'donate.title': 'Apoyar LitForge',
    'donate.subtitle': 'Tu apoyo nos ayuda a mantener y mejorar LitForge',
    'donate.button': 'Hacer una Donación',
    'donate.feedback': 'Enviar Comentarios',
    'donate.report': 'Reportar un Error',
    
    // Feedback Screen
    'feedback.title': 'Feedback & Soporte',
    'feedback.subtitle': 'Ayúdanos a mejorar LitForge',
    'feedback.email': 'Enviar por Email',
    'feedback.github': 'Reportar en GitHub',
    'feedback.rate': 'Calificar App',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.theme': 'Tema',
    'settings.font': 'Fuente',
    'settings.language': 'Idioma',
    'settings.about': 'Acerca de',
    
    // Reader
    'reader.bookmarks': 'Marcadores',
    'reader.notes': 'Notas',
    'reader.progress': 'Progreso',
    'reader.unsupported': 'Formato no soportado',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.retry': 'Reintentar',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.done': 'Hecho',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.library': 'My Library',
    'nav.donate': 'Donate',
    'nav.options': 'Options',
    'nav.stories': 'Stories',
    
    // Library Screen
    'library.title': 'My Library',
    'library.empty.title': 'Start your library!',
    'library.empty.subtitle': 'Import PDF or Markdown documents to begin your personalized reading experience.',
    'library.import': 'Import Document',
    'library.filter.all': 'All',
    'library.filter.pdf': 'PDF',
    'library.filter.md': 'Markdown',
    'library.sort.name': 'Name',
    'library.sort.type': 'Type',
    'library.sort.date': 'Date',
    'library.loading': 'Loading documents...',
    
    // Stories Screen
    'stories.title': 'Stories',
    'stories.subtitle': 'Explore a curated collection of fascinating stories from world history.',
    'stories.loading': 'Loading stories...',
    'stories.freeStory': 'Free story',
    
    // Donate Screen
    'donate.title': 'Support LitForge',
    'donate.subtitle': 'Your support helps us maintain and improve LitForge',
    'donate.button': 'Make a Donation',
    'donate.feedback': 'Send Feedback',
    'donate.report': 'Report a Bug',
    
    // Feedback Screen
    'feedback.title': 'Feedback & Support',
    'feedback.subtitle': 'Help us improve LitForge',
    'feedback.email': 'Send via Email',
    'feedback.github': 'Report on GitHub',
    'feedback.rate': 'Rate App',
    
    // Settings
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.font': 'Font',
    'settings.language': 'Language',
    'settings.about': 'About',
    
    // Reader
    'reader.bookmarks': 'Bookmarks',
    'reader.notes': 'Notes',
    'reader.progress': 'Progress',
    'reader.unsupported': 'Unsupported format',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.done': 'Done',
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.library': 'Minha Biblioteca',
    'nav.donate': 'Doar',
    'nav.options': 'Opções',
    'nav.stories': 'Histórias',
    
    // Library Screen
    'library.title': 'Minha Biblioteca',
    'library.empty.title': 'Comece sua biblioteca!',
    'library.empty.subtitle': 'Importe documentos PDF ou Markdown para começar sua experiência de leitura personalizada.',
    'library.import': 'Importar Documento',
    'library.filter.all': 'Todos',
    'library.filter.pdf': 'PDF',
    'library.filter.md': 'Markdown',
    'library.sort.name': 'Nome',
    'library.sort.type': 'Tipo',
    'library.sort.date': 'Data',
    'library.loading': 'Carregando documentos...',
    
    // Stories Screen
    'stories.title': 'Histórias',
    'stories.subtitle': 'Explore uma coleção curada de histórias fascinantes da história mundial.',
    'stories.loading': 'Carregando histórias...',
    'stories.freeStory': 'História gratuita',
    
    // Donate Screen
    'donate.title': 'Apoiar LitForge',
    'donate.subtitle': 'Seu apoio nos ajuda a manter e melhorar o LitForge',
    'donate.button': 'Fazer uma Doação',
    'donate.feedback': 'Enviar Feedback',
    'donate.report': 'Reportar um Bug',
    
    // Feedback Screen
    'feedback.title': 'Feedback & Suporte',
    'feedback.subtitle': 'Ajude-nos a melhorar o LitForge',
    'feedback.email': 'Enviar por Email',
    'feedback.github': 'Reportar no GitHub',
    'feedback.rate': 'Avaliar App',
    
    // Settings
    'settings.title': 'Configurações',
    'settings.theme': 'Tema',
    'settings.font': 'Fonte',
    'settings.language': 'Idioma',
    'settings.about': 'Sobre',
    
    // Reader
    'reader.bookmarks': 'Marcadores',
    'reader.notes': 'Notas',
    'reader.progress': 'Progresso',
    'reader.unsupported': 'Formato não suportado',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.retry': 'Tentar novamente',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.done': 'Concluído',
  },
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [themeType, setThemeTypeState] = useState<ThemeType>('blue');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('default');
  const [language, setLanguageState] = useState<Language>('es');
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedTheme, savedDarkMode, savedFont, savedLanguage] = await Promise.all([
        AsyncStorage.getItem('themeType'),
        AsyncStorage.getItem('isDarkMode'),
        AsyncStorage.getItem('fontFamily'),
        AsyncStorage.getItem('language'),
      ]);

      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        setThemeTypeState(savedTheme as ThemeType);
      }
      
      if (savedDarkMode !== null) {
        setIsDarkMode(savedDarkMode === 'true');
      }
      
      if (savedFont && Object.keys(fontFamilyMap).includes(savedFont)) {
        setFontFamilyState(savedFont as FontFamily);
      }
      
      if (savedLanguage && ['es', 'en', 'pt'].includes(savedLanguage)) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Theme functions
  const toggleTheme = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    try {
      await AsyncStorage.setItem('isDarkMode', newDarkMode.toString());
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  };

  const setThemeMode = async (isDark: boolean) => {
    setIsDarkMode(isDark);
    try {
      await AsyncStorage.setItem('isDarkMode', isDark.toString());
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const setThemeType = async (type: ThemeType) => {
    setThemeTypeState(type);
    try {
      await AsyncStorage.setItem('themeType', type);
    } catch (error) {
      console.error('Error saving theme type:', error);
    }
  };

  const cycleTheme = async () => {
    const themes: ThemeType[] = ['blue', 'green', 'purple', 'orange'];
    const currentIndex = themes.indexOf(themeType);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    await setThemeType(nextTheme);
  };

  // Font functions
  const setFontFamily = async (font: FontFamily) => {
    setFontFamilyState(font);
    try {
      await AsyncStorage.setItem('fontFamily', font);
    } catch (error) {
      console.error('Error saving font family:', error);
    }
  };

  const getFontStyle = () => ({
    fontFamily: fontFamilyMap[fontFamily],
  });

  // Language functions
  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Get current theme
  const getThemeByType = (type: ThemeType): Theme => {
    const baseTheme = isDarkMode ? DARK_THEME : LIGHT_THEME;
    
    // Return complete theme object with all required properties
    return {
      colors: baseTheme.colors,
      dark: isDarkMode,
      type: type,
      spacing: baseTheme.spacing,
      borderRadius: baseTheme.borderRadius,
      typography: baseTheme.typography,
    };
  };

  const theme = getThemeByType(themeType);

  // Don't render until settings are loaded
  if (isLoading) {
    return null;
  }

  const contextValue: AppContextType = {
    // Theme
    theme,
    themeType,
    isDarkMode,
    toggleTheme,
    setThemeMode,
    setThemeType,
    cycleTheme,
    
    // Font
    fontFamily,
    setFontFamily,
    getFontStyle,
    
    // Language
    language,
    setLanguage,
    t,
    
    // Loading
    isLoading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hooks
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Legacy hooks for backward compatibility
export const useTheme = () => {
  const { theme, themeType, isDarkMode, toggleTheme, setThemeMode, setThemeType, cycleTheme } = useApp();
  return { theme, themeType, isDarkMode, toggleTheme, setThemeMode, setThemeType, cycleTheme, isLoading: false };
};

export const useFont = () => {
  const { fontFamily, setFontFamily, getFontStyle } = useApp();
  return { fontFamily, setFontFamily, getFontStyle };
};

export const useLanguage = () => {
  const { language, setLanguage, t } = useApp();
  return { language, setLanguage, t };
};