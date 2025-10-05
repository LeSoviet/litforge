import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark } from '../types';
import { generateId } from './FileUtilsService';

// Storage keys
const STORAGE_KEYS = {
  BOOKMARKS: '@litforge_bookmarks',
} as const;

export class BookmarkService {
  // Get all bookmarks
  static async getAllBookmarks(): Promise<Bookmark[]> {
    try {
      const bookmarksJson = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return bookmarksJson ? JSON.parse(bookmarksJson) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  }

  // Get bookmarks for a specific document
  static async getBookmarks(documentId: string): Promise<Bookmark[]> {
    try {
      const allBookmarks = await this.getAllBookmarks();
      return allBookmarks.filter(bookmark => bookmark.documentId === documentId);
    } catch (error) {
      console.error('Error getting document bookmarks:', error);
      return [];
    }
  }

  // Add a new bookmark
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

  // Remove a bookmark by ID
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

  // Remove all bookmarks for a specific document
  static async removeBookmarksByDocument(documentId: string): Promise<void> {
    try {
      const bookmarks = await this.getAllBookmarks();
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.documentId !== documentId);
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error removing document bookmarks:', error);
    }
  }

  // Update a bookmark
  static async updateBookmark(bookmarkId: string, updates: Partial<Bookmark>): Promise<void> {
    try {
      const bookmarks = await this.getAllBookmarks();
      const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id === bookmarkId);
      
      if (bookmarkIndex !== -1) {
        bookmarks[bookmarkIndex] = { ...bookmarks[bookmarkIndex], ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }
  }

  // Clear all bookmarks
  static async clearAllBookmarks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      throw error;
    }
  }
}