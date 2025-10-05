// Consolidated types for LitForge application
// This file contains all core types, interfaces, and type definitions

// ============================================================================
// DOCUMENT TYPES
// ============================================================================

export interface Document {
  id: string;
  title: string;
  uri: string;
  filePath?: string;
  type: 'pdf' | 'doc' | 'docx' | 'md' | 'xls' | 'xlsx';
  size: number;
  createdAt: string;
  dateAdded?: Date;
  lastOpenedAt?: string;
  progress: number; // 0-1, representing reading progress
  totalPages?: number;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  bookmarks?: Bookmark[];
  notes?: Note[];
  content?: string;
}

export interface Bookmark {
  id: string;
  documentId?: string;
  page: number;
  title: string;
  createdAt?: string;
  dateCreated?: Date;
  note?: string;
  position?: {
    x: number;
    y: number;
  };
}

export interface Note {
  id: string;
  documentId?: string;
  page: number;
  text: string;
  title?: string;
  content?: string;
  selectedText?: string;
  createdAt?: string;
  dateCreated?: Date;
  updatedAt?: string;
  position?: {
    x: number;
    y: number;
  };
  color?: string;
}

export interface DocumentMetadata {
  author?: string;
  title?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  keywords?: string[];
  pageCount?: number;
  fileSize: number;
  mimeType: string;
}

export interface DocumentPickerResult {
  uri: string;
  name: string;
  size: number;
  type: string;
  mimeType?: string;
}

export interface DocumentError {
  code: 'FILE_NOT_FOUND' | 'UNSUPPORTED_FORMAT' | 'CORRUPTED_FILE' | 'PERMISSION_DENIED' | 'UNKNOWN_ERROR';
  message: string;
  documentId?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  documentCount: number;
}

export interface DocumentStats {
  totalDocuments: number;
  totalPages: number;
  totalReadingTime: number; // in minutes
  averageProgress: number;
}

// ============================================================================
// READING TYPES
// ============================================================================

export interface ReadingSession {
  id: string;
  documentId: string;
  startTime: string;
  endTime?: string;
  pagesRead: number;
  timeSpent: number; // in minutes
}

export interface ReadingProgress {
  documentId: string;
  currentPage: number;
  totalPages: number;
  percentage: number;
  lastUpdated: string;
  scrollPosition?: number;
  chapterProgress?: {
    [chapterIndex: number]: number;
  };
}

export interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
  page: number;
  boundingRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Highlight {
  id: string;
  documentId: string;
  selection: TextSelection;
  color: string;
  note?: string;
  createdAt: string;
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchResult {
  documentId: string;
  page: number;
  text: string;
  context: string;
  position: {
    x: number;
    y: number;
  };
}

export interface SearchOptions {
  caseSensitive: boolean;
  wholeWords: boolean;
  regex: boolean;
  scope: 'current' | 'all';
}

export interface SearchQuery {
  term: string;
  options: SearchOptions;
  documentId?: string;
}

// ============================================================================
// SETTINGS TYPES
// ============================================================================

export interface AppSettings {
  darkMode: boolean;
  hapticFeedback: boolean;
  autoSaveProgress: boolean;
  defaultFontSize: number;
  keepScreenOn: boolean;
  defaultReadingMode: 'scroll' | 'page';
  highlightColor: string;
  fontSize: number;
  fontFamily: string;
  readingMode: 'scroll' | 'page';
  notifications: boolean;
  brightness: number;
  language: string;
  theme: ThemeType;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  autoSave: boolean;
  pageTransition: 'slide' | 'fade' | 'none';
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

export type ThemePreference = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemePreference;
  primaryColor: string;
  accentColor: string;
  customColors?: {
    [key: string]: string;
  };
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    accent: string;
    card: string;
    notification: string;
    shadow: string;
    
    // Reading specific colors
    readerBackground: string;
    highlightYellow: string;
    highlightBlue: string;
    highlightGreen: string;
  };
  dark: boolean;
  type: ThemeType;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    fontSizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeights: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeights: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
}

// ============================================================================
// DATA IMPORT/EXPORT TYPES
// ============================================================================

export interface ExportData {
  documents: Document[];
  bookmarks: Bookmark[];
  notes: Note[];
  categories: Category[];
  settings: AppSettings;
  exportDate: string;
  version: string;
}

export interface ImportResult {
  success: boolean;
  documentsImported: number;
  bookmarksImported: number;
  notesImported: number;
  errors: string[];
}

// ============================================================================
// CONTEXT TYPES (for unified AppContext)
// ============================================================================

export type FontFamily = 'default' | 'serif' | 'monospace' | 'cursive';
export type Language = 'es' | 'en' | 'pt';
export type ThemeType = 'blue' | 'green' | 'purple' | 'orange';