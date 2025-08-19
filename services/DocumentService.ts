import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Document, Bookmark, Note, ReadingProgress, ExportData, ImportResult, DocumentError } from '../types/Document';
import { SettingsService } from './SettingsService';
import mammoth from 'mammoth';

// Storage keys
const STORAGE_KEYS = {
  DOCUMENTS: '@litforge_documents',
  BOOKMARKS: '@litforge_bookmarks',
  NOTES: '@litforge_notes',
  SETTINGS: '@litforge_settings',
  READING_PROGRESS: '@litforge_progress',
} as const;

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get file extension from URI
const getFileExtension = (uri: string): string => {
  const parts = uri.split('.');
  return parts[parts.length - 1].toLowerCase();
};

// Get document type from file extension
const getDocumentType = (extension: string): Document['type'] | null => {
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'doc':
      return 'doc';
    case 'docx':
      return 'docx';
    case 'xls':
      return 'xls';
    case 'xlsx':
      return 'xlsx';
    case 'md':
    case 'markdown':
      return 'md';
    default:
      return null;
  }
};

// Extract filename from URI
const getFilenameFromUri = (uri: string): string => {
  const parts = uri.split('/');
  return parts[parts.length - 1] || 'Documento sin título';
};

export class DocumentService {
  // Document management
  static async getAllDocuments(): Promise<Document[]> {
    try {
      const documentsJson = await AsyncStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      const documents = documentsJson ? JSON.parse(documentsJson) : [];
      
      // Convert dateAdded strings back to Date objects
      return documents.map((doc: any) => ({
        ...doc,
        dateAdded: doc.dateAdded ? new Date(doc.dateAdded) : undefined,
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  static async addDocument(file: any): Promise<Document> {
    try {
      // Handle pre-created document objects (like sample documents)
      if (file.id && file.type) {
        const documents = await this.getAllDocuments();
        documents.push(file);
        await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
        return file;
      }

      // Handle file picker results
      const extension = getFileExtension(file.uri);
      const type = getDocumentType(extension);
      
      if (!type) {
        throw new Error('Formato de archivo no soportado');
      }

      // Copy file to app's document directory
      const filename = `${generateId()}.${extension}`;
      const destinationUri = `${FileSystem.documentDirectory}${filename}`;
      
      await FileSystem.copyAsync({
        from: file.uri,
        to: destinationUri,
      });

      const document: Document = {
        id: generateId(),
        title: file.name || getFilenameFromUri(file.uri),
        uri: destinationUri,
        filePath: destinationUri,
        type,
        size: file.size || 0,
        createdAt: new Date().toISOString(),
        dateAdded: new Date(),
        progress: 0,
        totalPages: type === 'md' ? 1 : (file.size ? Math.ceil(file.size / 1000) : 1),
        bookmarks: [],
        notes: [],
      };

      const documents = await this.getAllDocuments();
      documents.push(document);
      await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));

      return document;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  static async removeDocument(documentId: string): Promise<void> {
    try {
      const documents = await this.getAllDocuments();
      const document = documents.find(doc => doc.id === documentId);
      
      if (document) {
        // Remove file from filesystem
        try {
          await FileSystem.deleteAsync(document.uri);
        } catch (fileError) {
          console.warn('Could not delete file:', fileError);
        }
        
        // Remove from documents list
        const updatedDocuments = documents.filter(doc => doc.id !== documentId);
        await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocuments));
        
        // Remove associated bookmarks and notes
        await this.removeBookmarksByDocument(documentId);
        await this.removeNotesByDocument(documentId);
      }
    } catch (error) {
      console.error('Error removing document:', error);
      throw error;
    }
  }

  static async updateProgress(documentId: string, progress: number): Promise<void> {
    try {
      const documents = await this.getAllDocuments();
      const documentIndex = documents.findIndex(doc => doc.id === documentId);
      
      if (documentIndex !== -1) {
        documents[documentIndex].progress = Math.max(0, Math.min(1, progress));
        documents[documentIndex].lastOpenedAt = new Date().toISOString();
        await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  static async updateDocument(document: Document): Promise<void> {
    try {
      const documents = await this.getAllDocuments();
      const documentIndex = documents.findIndex(doc => doc.id === document.id);
      
      if (documentIndex !== -1) {
        documents[documentIndex] = { ...documents[documentIndex], ...document };
        await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
      }
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  static async getDocument(documentId: string): Promise<Document | null> {
    try {
      const documents = await this.getAllDocuments();
      return documents.find(doc => doc.id === documentId) || null;
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  }

  // Content reading
  static async getDocumentContent(uri: string): Promise<string> {
    try {
      const content = await FileSystem.readAsStringAsync(uri);
      return content;
    } catch (error) {
      console.error('Error reading document content:', error);
      throw new Error('No se pudo leer el contenido del documento');
    }
  }

  static async convertDocxToHtml(uri: string): Promise<string> {
    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Convert base64 to ArrayBuffer
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Use mammoth to convert to HTML
      const result = await mammoth.convertToHtml({ arrayBuffer: bytes.buffer });
      return result.value;
    } catch (error) {
      console.error('Error converting DOCX:', error);
      throw new Error('No se pudo convertir el documento DOCX');
    }
  }

  // Bookmark management
  static async getAllBookmarks(): Promise<Bookmark[]> {
    try {
      const bookmarksJson = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return bookmarksJson ? JSON.parse(bookmarksJson) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  }

  static async getBookmarks(documentId: string): Promise<Bookmark[]> {
    try {
      const allBookmarks = await this.getAllBookmarks();
      return allBookmarks.filter(bookmark => bookmark.documentId === documentId);
    } catch (error) {
      console.error('Error getting document bookmarks:', error);
      return [];
    }
  }

  static async addBookmark(bookmark: Omit<Bookmark, 'id'>): Promise<Bookmark> {
    try {
      const newBookmark: Bookmark = {
        ...bookmark,
        id: generateId(),
      };

      const bookmarks = await this.getAllBookmarks();
      bookmarks.push(newBookmark);
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));

      return newBookmark;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  static async removeBookmark(bookmarkId: string): Promise<void> {
    try {
      const bookmarks = await this.getAllBookmarks();
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  static async removeBookmarksByDocument(documentId: string): Promise<void> {
    try {
      const bookmarks = await this.getAllBookmarks();
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.documentId !== documentId);
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error removing document bookmarks:', error);
    }
  }

  // Note management
  static async getAllNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  static async getNotes(documentId: string): Promise<Note[]> {
    try {
      const allNotes = await this.getAllNotes();
      return allNotes.filter(note => note.documentId === documentId);
    } catch (error) {
      console.error('Error getting document notes:', error);
      return [];
    }
  }

  static async addNote(note: Omit<Note, 'id'>): Promise<Note> {
    try {
      const newNote: Note = {
        ...note,
        id: generateId(),
      };

      const notes = await this.getAllNotes();
      notes.push(newNote);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));

      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }

  static async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const noteIndex = notes.findIndex(note => note.id === noteId);
      
      if (noteIndex !== -1) {
        notes[noteIndex] = {
          ...notes[noteIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      }
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  static async removeNote(noteId: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const updatedNotes = notes.filter(note => note.id !== noteId);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error removing note:', error);
      throw error;
    }
  }

  static async removeNotesByDocument(documentId: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const updatedNotes = notes.filter(note => note.documentId !== documentId);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error removing document notes:', error);
    }
  }

  // Data management
  static async exportAllData(): Promise<ExportData> {
    try {
      const [documents, bookmarks, notes] = await Promise.all([
        this.getAllDocuments(),
        this.getAllBookmarks(),
        this.getAllNotes(),
      ]);

      const exportData: ExportData = {
        documents,
        bookmarks,
        notes,
        categories: [], // TODO: Implement categories
        settings: await SettingsService.getSettings(),
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      // Clear AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.DOCUMENTS),
        AsyncStorage.removeItem(STORAGE_KEYS.BOOKMARKS),
        AsyncStorage.removeItem(STORAGE_KEYS.NOTES),
      ]);

      // Clear document files
      try {
        const documentDir = FileSystem.documentDirectory;
        if (documentDir) {
          const files = await FileSystem.readDirectoryAsync(documentDir);
          const deletePromises = files
            .filter(file => /\.(pdf|doc|docx|md)$/i.test(file))
            .map(file => FileSystem.deleteAsync(`${documentDir}${file}`));
          
          await Promise.all(deletePromises);
        }
      } catch (fileError) {
        console.warn('Error clearing document files:', fileError);
      }
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Search functionality
  static async searchInDocument(documentId: string, query: string): Promise<any[]> {
    try {
      const documents = await this.getAllDocuments();
      const document = documents.find(doc => doc.id === documentId);
      
      if (!document) {
        throw new Error('Documento no encontrado');
      }

      // For now, return empty array - implement actual search based on document type
      // TODO: Implement PDF text extraction and search
      // TODO: Implement DOCX text search
      // TODO: Implement Markdown text search
      
      return [];
    } catch (error) {
      console.error('Error searching in document:', error);
      throw error;
    }
  }

  // Statistics
  static async getDocumentStats(): Promise<any> {
    try {
      const documents = await this.getAllDocuments();
      const bookmarks = await this.getAllBookmarks();
      const notes = await this.getAllNotes();

      const totalDocuments = documents.length;
      const completedDocuments = documents.filter(doc => doc.progress >= 0.95).length;
      const averageProgress = documents.reduce((sum, doc) => sum + doc.progress, 0) / totalDocuments || 0;

      return {
        totalDocuments,
        completedDocuments,
        averageProgress,
        totalBookmarks: bookmarks.length,
        totalNotes: notes.length,
      };
    } catch (error) {
      console.error('Error getting document stats:', error);
      return {
        totalDocuments: 0,
        completedDocuments: 0,
        averageProgress: 0,
        totalBookmarks: 0,
        totalNotes: 0,
      };
    }
  }

  // Save document (update existing document)
  static async saveDocument(document: Document): Promise<void> {
    try {
      const documents = await this.getAllDocuments();
      const documentIndex = documents.findIndex(doc => doc.id === document.id);
      
      if (documentIndex !== -1) {
        documents[documentIndex] = { ...documents[documentIndex], ...document };
        await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
      } else {
        // If document doesn't exist, add it
        documents.push(document);
        await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
      }
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  }

  // Add story document from stories directory
  static async addStoryDocument(storyId: string, title: string, filePath: string): Promise<Document> {
    try {
      const document: Document = {
        id: storyId,
        title: title,
        uri: filePath,
        filePath: filePath,
        type: 'md',
        size: 0, // Will be calculated when loaded
        createdAt: new Date().toISOString(),
        dateAdded: new Date(),
        progress: 0,
        totalPages: 1,
        bookmarks: [],
        notes: [],
      };

      // Check if document already exists
      const existingDoc = await this.getDocument(storyId);
      if (existingDoc) {
        return existingDoc;
      }

      // Add to documents list
      const documents = await this.getAllDocuments();
      documents.push(document);
      await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));

      return document;
    } catch (error) {
      console.error('Error adding story document:', error);
      throw error;
    }
  }

  static async addStoryDocumentFromAsset(storyId: string, title: string, asset: any): Promise<Document> {
    try {
      // Ensure asset is downloaded
      if (!asset.localUri) {
        await asset.downloadAsync();
      }

      // Read the content from the asset
      let content = '';
      try {
        const response = await fetch(asset.uri);
        content = await response.text();
      } catch (fetchError) {
        console.warn('Failed to fetch from asset.uri, trying localUri:', fetchError);
        if (asset.localUri) {
          const response = await fetch(asset.localUri);
          content = await response.text();
        }
      }

      const document: Document = {
        id: storyId,
        title: title,
        uri: asset.localUri || asset.uri,
        filePath: asset.localUri || asset.uri,
        type: 'md',
        size: content.length,
        createdAt: new Date().toISOString(),
        dateAdded: new Date(),
        progress: 0,
        totalPages: 1,
        bookmarks: [],
        notes: [],
        content: content, // Store the actual content
      };

      // Check if document already exists
      const existingDoc = await this.getDocument(storyId);
      if (existingDoc) {
        // Update with new content if it exists
        existingDoc.content = content;
        const documents = await this.getAllDocuments();
        const index = documents.findIndex(doc => doc.id === storyId);
        if (index !== -1) {
          documents[index] = existingDoc;
          await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
        }
        return existingDoc;
      }

      // Add to documents list
      const documents = await this.getAllDocuments();
      documents.push(document);
      await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));

      return document;
    } catch (error) {
      console.error('Error adding story document from asset:', error);
      throw error;
    }
  }
}