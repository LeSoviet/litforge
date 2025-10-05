import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';
import { generateId } from './FileUtilsService';

// Storage keys
const STORAGE_KEYS = {
  NOTES: '@litforge_notes',
} as const;

export class NoteService {
  // Get all notes
  static async getAllNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  // Get notes for a specific document
  static async getNotes(documentId: string): Promise<Note[]> {
    try {
      const allNotes = await this.getAllNotes();
      return allNotes.filter(note => note.documentId === documentId);
    } catch (error) {
      console.error('Error getting document notes:', error);
      return [];
    }
  }

  // Add a new note
  static async addNote(note: Omit<Note, 'id'>): Promise<Note> {
    try {
      const newNote: Note = {
        ...note,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

  // Update a note
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

  // Remove a note by ID
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

  // Remove all notes for a specific document
  static async removeNotesByDocument(documentId: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const updatedNotes = notes.filter(note => note.documentId !== documentId);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error removing document notes:', error);
    }
  }

  // Search notes by content
  static async searchNotes(query: string, documentId?: string): Promise<Note[]> {
    try {
      const allNotes = await this.getAllNotes();
      let filteredNotes = allNotes;
      
      if (documentId) {
        filteredNotes = allNotes.filter(note => note.documentId === documentId);
      }
      
      return filteredNotes.filter(note => 
        note.content?.toLowerCase().includes(query.toLowerCase()) ||
        (note.title && note.title.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching notes:', error);
      return [];
    }
  }

  // Clear all notes
  static async clearAllNotes(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.NOTES);
    } catch (error) {
      console.error('Error clearing notes:', error);
      throw error;
    }
  }
}