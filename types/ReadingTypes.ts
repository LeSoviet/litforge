// Reading-related types and interfaces

export interface ReadingSession {
  id: string;
  documentId: string;
  startTime: string;
  endTime?: string;
  pagesRead: number;
  timeSpent: number; // in minutes
}

export interface ReadingProgress {
  documentId: string;
  currentPage: number;
  totalPages: number;
  percentage: number;
  lastUpdated: string;
  scrollPosition?: number;
  chapterProgress?: {
    [chapterIndex: number]: number;
  };
}

export interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
  page: number;
  boundingRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Highlight {
  id: string;
  documentId: string;
  selection: TextSelection;
  color: string;
  note?: string;
  createdAt: string;
}