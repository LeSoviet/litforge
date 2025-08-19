// Core document types and interfaces

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
  content?: string; // Added for search functionality
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
  title?: string; // Added for search functionality
  content?: string; // Added for search functionality
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