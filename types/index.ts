// Main types export file - centralized exports for all type modules

// Core document types
export * from './DocumentTypes';

// Reading and progress types
export * from './ReadingTypes';

// Search functionality types
export * from './SearchTypes';

// Settings and theme types
export * from './SettingsTypes';

// Navigation types
export * from './NavigationTypes';

// Data import/export types
export * from './DataTypes';

// OCR types
export * from './OcrTypes';

// Legacy compatibility - re-export everything from the original Document.ts
// This ensures existing imports continue to work during the transition
export * from './Document';
