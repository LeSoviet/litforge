export interface OcrResult {
  text: string;
  confidence: number;
  blocks: OcrBlock[];
}

export interface OcrBlock {
  text: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  words: OcrWord[];
}

export interface OcrWord {
  text: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
}

export interface OcrOptions {
  language?: string;
  detectOrientation?: boolean;
  confidenceThreshold?: number;
}

export interface OcrProcessingResult {
  success: boolean;
  text?: string;
  error?: string;
  processingTime?: number;
}