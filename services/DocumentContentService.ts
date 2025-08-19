import * as FileSystem from 'expo-file-system';
import * as mammoth from 'mammoth';

export class DocumentContentService {
  // Get document content based on type
  static async getDocumentContent(uri: string, type: string): Promise<string> {
    try {
      switch (type) {
        case 'docx':
          return await this.getDocxContent(uri);
        case 'txt':
        case 'md':
          return await this.getTextContent(uri);
        case 'pdf':
          // PDF content extraction would require additional libraries
          return 'Contenido PDF no disponible para vista previa';
        default:
          return 'Tipo de documento no soportado para vista previa';
      }
    } catch (error) {
      console.error('Error getting document content:', error);
      return 'Error al cargar el contenido del documento';
    }
  }

  // Get DOCX content and convert to HTML
  private static async getDocxContent(uri: string): Promise<string> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to ArrayBuffer
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer: bytes.buffer });
      return result.value;
    } catch (error) {
      console.error('Error converting DOCX:', error);
      throw error;
    }
  }

  // Get plain text content
  private static async getTextContent(uri: string): Promise<string> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      return await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (error) {
      console.error('Error reading text file:', error);
      throw error;
    }
  }

  // Extract text content for search indexing
  static async extractTextForSearch(uri: string, type: string): Promise<string> {
    try {
      const content = await this.getDocumentContent(uri, type);
      
      // Remove HTML tags if present
      const textContent = content.replace(/<[^>]*>/g, '');
      
      // Clean up whitespace
      return textContent.replace(/\s+/g, ' ').trim();
    } catch (error) {
      console.error('Error extracting text for search:', error);
      return '';
    }
  }

  // Get document metadata (page count, word count, etc.)
  static async getDocumentMetadata(uri: string, type: string): Promise<{
    pageCount?: number;
    wordCount?: number;
    characterCount?: number;
  }> {
    try {
      const content = await this.extractTextForSearch(uri, type);
      
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      const characterCount = content.length;
      
      // Estimate page count (assuming ~250 words per page)
      const pageCount = Math.max(1, Math.ceil(wordCount / 250));
      
      return {
        pageCount,
        wordCount,
        characterCount,
      };
    } catch (error) {
      console.error('Error getting document metadata:', error);
      return {
        pageCount: 1,
        wordCount: 0,
        characterCount: 0,
      };
    }
  }

  // Check if document type supports content extraction
  static supportsContentExtraction(type: string): boolean {
    return ['docx', 'txt', 'md'].includes(type);
  }

  // Check if document type supports full-text search
  static supportsFullTextSearch(type: string): boolean {
    return this.supportsContentExtraction(type);
  }
}