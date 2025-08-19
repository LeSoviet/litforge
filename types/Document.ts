// Types for LitForge document management
// Interfaces para documentos, marcadores y notas

export interface Document {
  id: string;
  title: string;
  uri: string;
  filePath?: string; // Added for PDF support
  type: 'pdf' | 'doc' | 'docx' | 'md' | 'xls' | 'xlsx';
  size: number;
  createdAt: string;
  dateAdded?: Date; // Added for compatibility with index.tsx
  lastOpenedAt?: string;
  progress: number; // 0-1, representing reading progress
  totalPages?: number;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  bookmarks?: Bookmark[];
  notes?: Note[];
}

export interface Bookmark {
  id: string;
  documentId?: string;
  page: number;
  title: string;
  createdAt?: string;
  dateCreated?: Date; // Added for compatibility
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
  selectedText?: string;
  createdAt?: string;
  dateCreated?: Date; // Added for compatibility
  updatedAt?: string;
  position?: {
    x: number;
    y: number;
  };
  color?: string;
}

export interface ReadingSession {
  id: string;
  documentId: string;
  startTime: string;
  endTime?: string;
  pagesRead: number;
  timeSpent: number; // in minutes
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
  documentsCompleted: number;
  favoriteGenre?: string;
}

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

// Navigation types
export type RootStackParamList = {
  Library: undefined;
  Reader: {
    document: Document;
  };
  Settings: undefined;
  BookmarksList: {
    documentId: string;
  };
  NotesList: {
    documentId: string;
  };
  Search: {
    documentId?: string;
  };
  TabNavigator: undefined;
};

export type TabParamList = {
  Library: undefined;
  Settings: undefined;
};

// Settings types
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
  theme: 'light' | 'dark' | 'auto';
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  autoSave: boolean;
  pageTransition: 'slide' | 'fade' | 'none';
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

// File picker result type
export interface DocumentPickerResult {
  uri: string;
  name: string;
  size: number;
  type: string;
  mimeType?: string;
}

// Export/Import types
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

// Error types
export interface DocumentError {
  code: 'FILE_NOT_FOUND' | 'UNSUPPORTED_FORMAT' | 'CORRUPTED_FILE' | 'PERMISSION_DENIED' | 'UNKNOWN_ERROR';
  message: string;
  documentId?: string;
}

// Progress tracking
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

// Text selection and highlighting
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

// Search functionality
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

// Theme types (extending from theme/colors.ts)
export type ThemePreference = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  mode: ThemePreference;
  primaryColor: string;
  accentColor: string;
  customColors?: {
    [key: string]: string;
  };
}