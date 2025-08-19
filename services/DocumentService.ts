import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Document } from '../types/Document';
import { ExportData } from '../types/DataTypes';
import { BookmarkService } from './BookmarkService';
import { NoteService } from './NoteService';
import { DocumentContentService } from './DocumentContentService';
import { SettingsService } from './SettingsService';
import {
  generateId,
  getFileExtension,
  getDocumentType,
  getFilenameFromUri,
} from './FileUtilsService';

// Storage keys
const STORAGE_KEYS = {
  DOCUMENTS: '@litforge_documents',
} as const;

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

      // Get document metadata
      const metadata = await DocumentContentService.getDocumentMetadata(destinationUri, type);

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
        totalPages: metadata.pageCount || 1,
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
        
        // Remove associated bookmarks and notes using the new services
        await BookmarkService.removeBookmarksByDocument(documentId);
        await NoteService.removeNotesByDocument(documentId);
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







  // Convenience methods that proxy to the new services
  // These maintain compatibility with existing code
  
  // Bookmark methods
  static async getAllBookmarks() {
    return BookmarkService.getAllBookmarks();
  }
  
  static async getBookmarks(documentId: string) {
    return BookmarkService.getBookmarks(documentId);
  }
  
  static async addBookmark(bookmark: any) {
    return BookmarkService.addBookmark(bookmark);
  }
  
  static async removeBookmark(bookmarkId: string) {
    return BookmarkService.removeBookmark(bookmarkId);
  }
  
  // Note methods
  static async getAllNotes() {
    return NoteService.getAllNotes();
  }
  
  static async getNotes(documentId: string) {
    return NoteService.getNotes(documentId);
  }
  
  static async addNote(note: any) {
    return NoteService.addNote(note);
  }
  
  static async updateNote(noteId: string, updates: any) {
    return NoteService.updateNote(noteId, updates);
  }
  
  static async removeNote(noteId: string) {
    return NoteService.removeNote(noteId);
  }
  
  // Content methods
  static async getDocumentContent(uri: string, type: string) {
    return DocumentContentService.getDocumentContent(uri, type);
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
      await AsyncStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
      await BookmarkService.clearAllBookmarks();
      await NoteService.clearAllNotes();
      
      // Also clear the documents directory
      const documentsDir = FileSystem.documentDirectory + 'documents/';
      const dirInfo = await FileSystem.getInfoAsync(documentsDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(documentsDir);
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