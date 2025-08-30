import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { DocumentService } from '../services/DocumentService';
import { OcrService } from '../services/OcrService';

export default function OcrScannerScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    })();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // @ts-ignore - expo-camera types are not fully updated
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      
      // Process the captured image with OCR
      const result = await OcrService.processImage(photo.uri);
      setOcrResult(result.text);
    } catch (error) {
      console.error('OCR processing error:', error);
      Alert.alert(t('ocr.error.title') || 'Error', t('ocr.error.processing') || 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!ocrResult) return;
    
    try {
      const document = await DocumentService.createDocumentFromOcrText(
        ocrResult, 
        `Scanned Document ${new Date().toLocaleDateString()}`
      );
      
      // Navigate to the reader with the new document
      router.push({
        pathname: '/reader',
        params: { documentId: document.id }
      });
    } catch (error) {
      console.error('Error saving OCR document:', error);
      Alert.alert(t('ocr.error.title') || 'Error', t('ocr.error.saving') || 'Failed to save document. Please try again.');
    }
  };

  const handleRetake = () => {
    setOcrResult(null);
  };

  const toggleCameraFacing = () => {
    setFacing(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const toggleFlash = () => {
    setFlash(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  if (!permission || hasMediaLibraryPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <Text style={[styles.permissionText, { color: theme.colors.text }]}>
          {t('ocr.permission.requesting') || 'Requesting camera permissions...'}
        </Text>
      </View>
    );
  }

  if (!permission.granted || hasMediaLibraryPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <Text style={[styles.permissionText, { color: theme.colors.text }]}>
          {t('ocr.permission.denied') || 'Camera and media library permissions are required for OCR functionality.'}
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary, marginTop: 16 }]}
          onPress={() => router.push('/')}
        >
          <Text style={[styles.buttonText, { color: theme.colors.background }]}>
            {t('common.back') || 'Back'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('ocr.scanner.title') || 'Scan Document'}
      </Text>
      
      {ocrResult ? (
        <View style={styles.resultContainer}>
          <Text style={[styles.resultText, { color: theme.colors.text }]}>
            {ocrResult}
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.colors.surface, marginRight: 16 }]}
              onPress={handleRetake}
            >
              <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                {t('ocr.scanner.retake') || 'Retake'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={handleSaveDocument}
            >
              <Text style={[styles.buttonText, { color: theme.colors.background }]}>
                {t('ocr.scanner.save') || 'Save Document'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            flash={flash}
            ratio="4:3"
          />
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.controlButton, { backgroundColor: theme.colors.surface }]}
              onPress={toggleCameraFacing}
            >
              <Text style={[styles.controlButtonText, { color: theme.colors.text }]}>
                {facing === 'back' ? '📷' : '👤'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.captureButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleCapture}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color={theme.colors.background} />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, { backgroundColor: theme.colors.surface }]}
              onPress={toggleFlash}
            >
              <Text style={[styles.controlButtonText, { color: theme.colors.text }]}>
                {flash === 'off' ? '⚡' : flash === 'on' ? '💡' : 'AUTO'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    paddingTop: 16,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '70%',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 32,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: 20,
  },
  resultContainer: {
    flex: 1,
    padding: 16,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});