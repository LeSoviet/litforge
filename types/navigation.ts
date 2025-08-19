import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Document } from './Document';

// Root Stack Parameter List
export type RootStackParamList = {
  Main: undefined;
  Reader: {
    document: Document;
  };
};

// Tab Parameter List
export type TabParamList = {
  Library: undefined;
  Settings: undefined;
};

// Screen Props Types
export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type TabScreenProps<Screen extends keyof TabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

// Specific Screen Props
export type LibraryScreenProps = TabScreenProps<'Library'>;
export type SettingsScreenProps = TabScreenProps<'Settings'>;
export type ReaderScreenProps = RootStackScreenProps<'Reader'>;

// Global type declaration for React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}