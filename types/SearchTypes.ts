// Search-related types and interfaces

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