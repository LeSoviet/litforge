// Navigation-related types and interfaces
import { Document } from './DocumentTypes';

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