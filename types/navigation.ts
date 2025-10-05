// Navigation types for React Navigation
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Document } from './types';

// ============================================================================
// NAVIGATION PARAMETER LISTS
// ============================================================================

// Root Stack Parameter List
export type RootStackParamList = {
  Main: undefined;
  Reader: {
    document: Document;
  };
  BookmarksList: {
    documentId: string;
  };
  NotesList: {
    documentId: string;
  };
  Search: {
    documentId?: string;
  };
};

// Tab Parameter List
export type TabParamList = {
  Library: undefined;
  Settings: undefined;
  Stories: undefined;
  Donate: undefined;
};

// ============================================================================
// SCREEN PROPS TYPES
// ============================================================================

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type TabScreenProps<Screen extends keyof TabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

// ============================================================================
// SPECIFIC SCREEN PROPS
// ============================================================================

export type LibraryScreenProps = TabScreenProps<'Library'>;
export type SettingsScreenProps = TabScreenProps<'Settings'>;
export type StoriesScreenProps = TabScreenProps<'Stories'>;
export type DonateScreenProps = TabScreenProps<'Donate'>;
export type ReaderScreenProps = RootStackScreenProps<'Reader'>;
export type BookmarksListScreenProps = RootStackScreenProps<'BookmarksList'>;
export type NotesListScreenProps = RootStackScreenProps<'NotesList'>;
export type SearchScreenProps = RootStackScreenProps<'Search'>;

// ============================================================================
// GLOBAL TYPE DECLARATION
// ============================================================================

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}