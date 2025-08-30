# LitForge App Fix Roadmap

## Overview
This document outlines the issues identified in the LitForge app and provides a roadmap for fixing them. The main issues include:
1. StatusBar warnings related to edge-to-edge mode on Android
2. File deletion errors when clearing documents
3. Performance optimization opportunities

## Issue Analysis

### 1. StatusBar Warnings
**Problem**: Multiple warnings about StatusBar backgroundColor and translucent props not being supported with edge-to-edge enabled.
```
WARN StatusBar backgroundColor is not supported with edge-to-edge enabled. Render a view under the status bar to change its background.
WARN StatusBar is always translucent when edge-to-edge is enabled. The translucent prop is ignored.
```

**Root Cause**: The app.json has `edgeToEdgeEnabled: true` for Android, but the StatusBar component is still trying to set backgroundColor and translucent props which are incompatible with edge-to-edge mode.

### 2. File Deletion Errors
**Problem**: Errors when trying to delete files during document clearing operations.
```
WARN Could not delete file: [Error: Call to function 'ExponentFileSystem.deleteAsync' has been rejected.
→ Caused by: java.io.IOException: Location '' isn't deletable.]
```

**Root Cause**: The [clearAllData](file:///c:/Users/TeamOS/Desktop/Projects/Litforge/services/DocumentService.ts#L239-L259) method in DocumentService is trying to delete a directory that may not exist or may not be deletable. Additionally, individual document deletion may be failing because file paths are empty or invalid.

## Fix Roadmap

### Phase 1: StatusBar Issues (High Priority)

#### 1.1 Update app.json Configuration
- [ ] Modify Android configuration to either disable edge-to-edge mode or properly handle StatusBar
- [ ] Consider setting `edgeToEdgeEnabled: false` if StatusBar customization is needed

#### 1.2 Update StatusBar Component Usage
- [ ] Modify [app/_layout.tsx](file:///c:/Users/TeamOS/Desktop/Projects/Litforge/app/_layout.tsx) to conditionally set StatusBar props based on edge-to-edge mode
- [ ] Implement proper view-based background coloring for edge-to-edge mode

### Phase 2: File Deletion Issues (High Priority)

#### 2.1 Fix clearAllData Method
- [ ] Update [DocumentService.clearAllData()](file:///c:/Users/TeamOS/Desktop/Projects/Litforge/services/DocumentService.ts#L239-L259) to properly check if directory exists before deletion
- [ ] Add proper error handling and logging
- [ ] Ensure the documents directory path is correct

#### 2.2 Fix removeDocument Method
- [ ] Update [DocumentService.removeDocument()](file:///c:/Users/TeamOS/Desktop/Projects/Litforge/services/DocumentService.ts#L94-L121) to validate file paths before attempting deletion
- [ ] Add checks for empty or invalid URIs
- [ ] Improve error handling to provide more informative logs

#### 2.3 Implement Proper File Management
- [ ] Ensure consistent file path handling across all document operations
- [ ] Add file existence checks before operations
- [ ] Implement better cleanup procedures

### Phase 3: Performance Optimization (Medium Priority)

#### 3.1 Optimize Bundle Size
- [ ] Analyze the large bundle size (10156ms for node_modules\expo-router\entry.js)
- [ ] Identify and remove unused dependencies
- [ ] Implement code splitting where appropriate

#### 3.2 Improve Document Loading
- [ ] Optimize document loading and caching mechanisms
- [ ] Implement lazy loading for large document lists
- [ ] Add loading indicators for better UX

## Detailed Implementation Plan

### 1. StatusBar Fix Implementation

#### Step 1: Update app.json
```json
{
  "expo": {
    "android": {
      "edgeToEdgeEnabled": false
    }
  }
}
```

#### Step 2: Update StatusBar Component
In [app/_layout.tsx](file:///c:/Users/TeamOS/Desktop/Projects/Litforge/app/_layout.tsx):
```typescript
<StatusBar 
  style={isDarkMode ? 'light' : 'dark'} 
  backgroundColor={Platform.OS === 'android' && !isEdgeToEdgeEnabled ? theme.colors.background : undefined}
  translucent={Platform.OS === 'android' && !isEdgeToEdgeEnabled ? false : undefined}
/>
```

#### Step 3: Add Edge-to-Edge Support (Optional)
If keeping edge-to-edge mode, implement proper view-based status bar background:
```typescript
// Add a status bar background view when edge-to-edge is enabled
{isEdgeToEdgeEnabled && Platform.OS === 'android' && (
  <View style={{
    height: StatusBar.currentHeight,
    backgroundColor: theme.colors.background,
  }} />
)}
```

### 2. File Deletion Fix Implementation

#### Step 1: Fix clearAllData Method
```typescript
static async clearAllData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    await BookmarkService.clearAllBookmarks();
    await NoteService.clearAllNotes();
    
    // Also clear the documents directory
    const documentsDir = `${FileSystem.documentDirectory}documents/`;
    const dirInfo = await FileSystem.getInfoAsync(documentsDir);
    if (dirInfo.exists && dirInfo.isDirectory) {
      await FileSystem.deleteAsync(documentsDir, { idempotent: true });
    }
  } catch (error) {
    console.error('Error clearing all data:', error);
    // Don't throw error to prevent app crash, but log for debugging
  }
}
```

#### Step 2: Fix removeDocument Method
```typescript
static async removeDocument(documentId: string): Promise<void> {
  try {
    const documents = await this.getAllDocuments();
    const document = documents.find(doc => doc.id === documentId);
    
    if (document) {
      // Remove file from filesystem only if URI exists and is valid
      if (document.uri && document.uri.length > 0) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(document.uri);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(document.uri, { idempotent: true });
          }
        } catch (fileError) {
          console.warn(`Could not delete file ${document.uri}:`, fileError);
        }
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
```

### 3. Performance Optimization

#### Step 1: Analyze Bundle Size
- Use `npx expo-optimize` to optimize assets
- Review dependencies in package.json for unused packages
- Consider using `expo-build-properties` to optimize build settings

#### Step 2: Implement Lazy Loading
- For document lists, implement pagination or virtualized lists
- Load document content only when needed
- Cache frequently accessed data

## Testing Plan

### 1. StatusBar Testing
- [ ] Test on Android devices with different Android versions
- [ ] Verify StatusBar appearance in both light and dark modes
- [ ] Check that no warnings appear in the console

### 2. File Deletion Testing
- [ ] Test document import and deletion workflows
- [ ] Verify that files are properly cleaned up
- [ ] Check error handling with invalid file paths
- [ ] Test clearAllData functionality

### 3. Performance Testing
- [ ] Measure app startup time before and after optimizations
- [ ] Monitor bundle size reduction
- [ ] Test document loading performance with large libraries

## Timeline

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | StatusBar fixes | 1-2 days |
| 2 | File deletion fixes | 2-3 days |
| 3 | Performance optimization | 3-5 days |
| 4 | Testing and refinement | 2-3 days |

Total estimated time: 8-13 days

## Success Metrics

1. **Elimination of StatusBar warnings** - No more edge-to-edge related warnings in console
2. **Proper file deletion** - No errors when deleting documents or clearing all data
3. **Reduced bundle size** - Decrease in app loading time
4. **Improved user experience** - Smoother document management operations

## Risk Mitigation

1. **Backup current implementation** - Create branches before making changes
2. **Incremental testing** - Test each fix individually before moving to the next
3. **Error logging** - Maintain detailed error logging to help with debugging
4. **User feedback** - Gather feedback from test users after each phase

## Next Steps

1. Begin with StatusBar fixes as they are the most visible issues
2. Proceed to file deletion fixes which will improve data integrity
3. Implement performance optimizations for better user experience
4. Conduct thorough testing of all fixes