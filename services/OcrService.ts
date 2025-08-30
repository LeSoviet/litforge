import { Document } from '../types/Document';
import { OcrBlock, OcrResult, OcrWord } from '../types/OcrTypes';
import { DocumentService } from './DocumentService';
// @ts-ignore
import { recognize } from 'react-native-mlkit-ocr';

export class OcrService {
  /**
   * Process an image and extract text using OCR
   * @param imageUri - URI of the image to process
   * @returns Promise resolving to extracted text
   */
  static async processImage(imageUri: string): Promise<OcrResult> {
    try {
      // Process the image using MLKit OCR
      const result = await recognize(imageUri);
      
      // Extract text from the result
      let fullText = '';
      const blocks: OcrBlock[] = [];
      const words: OcrWord[] = [];
      
      // Process each block in the result
      result.forEach((block: any) => {
        fullText += block.text + '\n';
        
        const ocrBlock: OcrBlock = {
          text: block.text,
          boundingBox: {
            x: block.bounding_box[0].x,
            y: block.bounding_box[0].y,
            width: block.bounding_box[2].x - block.bounding_box[0].x,
            height: block.bounding_box[2].y - block.bounding_box[0].y
          },
          confidence: block.confidence || 1.0,
          words: []
        };
        
        // Process words in the block
        if (block.components) {
          block.components.forEach((word: any) => {
            const ocrWord: OcrWord = {
              text: word.text,
              boundingBox: {
                x: word.bounding_box[0].x,
                y: word.bounding_box[0].y,
                width: word.bounding_box[2].x - word.bounding_box[0].x,
                height: word.bounding_box[2].y - word.bounding_box[0].y
              },
              confidence: word.confidence || 1.0
            };
            
            ocrBlock.words.push(ocrWord);
            words.push(ocrWord);
          });
        }
        
        blocks.push(ocrBlock);
      });
      
      return {
        text: fullText.trim(),
        confidence: 1.0, // Overall confidence - could be calculated from individual blocks
        blocks
      };
    } catch (error) {
      console.error('Error processing image with OCR:', error);
      throw new Error(`Failed to process image with OCR: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a document from OCR extracted text
   * @param text - Extracted text from OCR
   * @param title - Title for the new document
   * @returns Promise resolving to a new Document object
   */
  static async createDocumentFromText(text: string, title: string): Promise<Document> {
    try {
      // Use the existing DocumentService method to create a document from OCR text
      return await DocumentService.createDocumentFromOcrText(text, title);
    } catch (error) {
      console.error('Error creating document from OCR text:', error);
      throw new Error(`Failed to create document from OCR text: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Process multiple images and combine text
   * @param imageUris - Array of image URIs to process
   * @returns Promise resolving to combined extracted text
   */
  static async processMultipleImages(imageUris: string[]): Promise<OcrResult> {
    try {
      let combinedText = '';
      const allBlocks: OcrBlock[] = [];
      
      // Process each image
      for (const uri of imageUris) {
        const result = await this.processImage(uri);
        combinedText += result.text + '\n\n'; // Add spacing between pages
        allBlocks.push(...result.blocks);
      }
      
      return {
        text: combinedText.trim(),
        confidence: 1.0, // Could calculate average confidence
        blocks: allBlocks
      };
    } catch (error: any) {
      console.error('Error processing multiple images with OCR:', error);
      throw new Error(`Failed to process multiple images with OCR: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}