import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

export class DocumentContentService {
  // Get document content based on type
  static async getDocumentContent(uri: string, mimeType: string): Promise<string> {
    try {
      switch (mimeType) {
        case 'text/plain':
          return await this.getTextContent(uri);
        case 'application/pdf':
          return await this.getPdfContent(uri);
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return await this.getDocxContent(uri);
        default:
          return 'Tipo de archivo no soportado para vista previa.';
      }
    } catch (error) {
      console.error('Error al obtener contenido del documento:', error);
      return 'Error al cargar el contenido del documento.';
    }
  }

  private static async getDocxContent(uri: string): Promise<string> {
    // Usando expo-document-picker para manejar archivos DOCX
    // En lugar de procesar el contenido directamente, proporcionamos información del archivo
    try {
      // Para archivos DOCX, retornamos información básica
      // En una implementación completa, podrías usar una librería compatible con React Native
      return 'Archivo DOCX detectado. Para ver el contenido completo, use una aplicación compatible con documentos de Word.\n\nNota: La funcionalidad de extracción de texto de DOCX está en desarrollo.';
    } catch (error) {
      console.error('Error al procesar archivo DOCX:', error);
      return 'Error al procesar el archivo DOCX.';
    }
  }

  private static async getPdfContent(uri: string): Promise<string> {
    // Para PDFs, retornamos un mensaje indicando que se debe usar un visor específico
    return 'Archivo PDF detectado. Use el visor de PDF integrado para ver el contenido.';
  }

  private static async getTextContent(uri: string): Promise<string> {
    try {
      const response = await fetch(uri);
      return await response.text();
    } catch (error) {
      console.error('Error al leer archivo de texto:', error);
      return 'Error al leer el archivo de texto.';
    }
  }

  // Método auxiliar para seleccionar documentos usando expo-document-picker
  static async pickDocument(): Promise<DocumentPicker.DocumentPickerResult> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      
      return result;
    } catch (error) {
      console.error('Error al seleccionar documento:', error);
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