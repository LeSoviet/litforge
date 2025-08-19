// Data import/export related types and interfaces
import { Document, Bookmark, Note, Category } from './DocumentTypes';
import { AppSettings } from './SettingsTypes';

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