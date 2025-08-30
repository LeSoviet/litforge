import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Language = 'es' | 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
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
    'feedback.donations': 'Donaciones',
    'feedback.donationsDesc': 'Apoya el desarrollo de LitForge y ayúdanos a seguir mejorando la aplicación',
    'feedback.sendFeedback': 'Enviar Feedback',
    'feedback.feedbackDesc': 'Comparte tus ideas, sugerencias y comentarios para mejorar la aplicación',
    'feedback.reportBug': 'Reportar Bug',
    'feedback.bugDesc': '¿Encontraste un problema? Ayúdanos a solucionarlo reportando el bug',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.font': 'Fuente',
    'settings.fontSize': 'Tamaño de Fuente',
    'settings.fontDesc': 'Selecciona el tipo de fuente',
    'settings.appearance': 'Apariencia',
    'settings.reading': 'Lectura',
    'settings.general': 'General',
    'settings.darkMode': 'Modo Oscuro',
    'settings.darkModeDesc': 'Cambiar entre tema claro y oscuro',
    'settings.autoSave': 'Guardado Automático',
    'settings.notifications': 'Notificaciones',
    'settings.about': 'Acerca de',
    'settings.clearData': 'Borrar todos los datos',
    'settings.clearDataDesc': 'Eliminar documentos y configuraciones',
    
    // Languages
    'language.spanish': 'Español',
    'language.english': 'Inglés',
    'language.portuguese': 'Portugués',
    
    // Common
    'common.back': 'Atrás',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.loading': 'Cargando...',
    'common.change': 'Cambiar',
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
    'feedback.donations': 'Donations',
    'feedback.donationsDesc': 'Support LitForge development and help us keep improving the app',
    'feedback.sendFeedback': 'Send Feedback',
    'feedback.feedbackDesc': 'Share your ideas, suggestions and comments to improve the application',
    'feedback.reportBug': 'Report Bug',
    'feedback.bugDesc': 'Found a problem? Help us fix it by reporting the bug',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.font': 'Font',
    'settings.fontSize': 'Font Size',
    'settings.fontDesc': 'Select font type',
    'settings.appearance': 'Appearance',
    'settings.reading': 'Reading',
    'settings.general': 'General',
    'settings.darkMode': 'Dark Mode',
    'settings.darkModeDesc': 'Switch between light and dark theme',
    'settings.autoSave': 'Auto Save',
    'settings.notifications': 'Notifications',
    'settings.about': 'About',
    'settings.clearData': 'Clear all data',
    'settings.clearDataDesc': 'Delete documents and settings',
    
    // Languages
    'language.spanish': 'Spanish',
    'language.english': 'English',
    'language.portuguese': 'Portuguese',
    
    // Common
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.change': 'Change',
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
    'donate.feedback': 'Enviar Comentários',
    'donate.report': 'Reportar um Bug',
    
    // Feedback Screen
    'feedback.title': 'Feedback & Suporte',
    'feedback.donations': 'Doações',
    'feedback.donationsDesc': 'Apoie o desenvolvimento do LitForge e nos ajude a continuar melhorando o aplicativo',
    'feedback.sendFeedback': 'Enviar Feedback',
    'feedback.feedbackDesc': 'Compartilhe suas ideias, sugestões e comentários para melhorar o aplicativo',
    'feedback.reportBug': 'Reportar Bug',
    'feedback.bugDesc': 'Encontrou um problema? Nos ajude a corrigi-lo reportando o bug',
    
    // Settings
    'settings.title': 'Configurações',
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.font': 'Fonte',
    'settings.fontSize': 'Tamanho da Fonte',
    'settings.fontDesc': 'Selecione o tipo de fonte',
    'settings.appearance': 'Aparência',
    'settings.reading': 'Leitura',
    'settings.general': 'Geral',
    'settings.darkMode': 'Modo Escuro',
    'settings.darkModeDesc': 'Alternar entre tema claro e escuro',
    'settings.autoSave': 'Salvamento Automático',
    'settings.notifications': 'Notificações',
    'settings.about': 'Sobre',
    'settings.clearData': 'Limpar todos os dados',
    'settings.clearDataDesc': 'Excluir documentos e configurações',
    
    // Languages
    'language.spanish': 'Espanhol',
    'language.english': 'Inglês',
    'language.portuguese': 'Português',
    
    // Common
    'common.back': 'Voltar',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.loading': 'Carregando...',
    'common.change': 'Alterar',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('@litforge_language');
      if (savedLanguage && ['es', 'en', 'pt'].includes(savedLanguage)) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('@litforge_language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};