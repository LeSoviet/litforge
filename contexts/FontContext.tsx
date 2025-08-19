import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FontFamily = 'default' | 'serif' | 'monospace' | 'cursive';

interface FontContextType {
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  getFontStyle: () => { fontFamily: string };
}

const FontContext = createContext<FontContextType | undefined>(undefined);

const fontFamilyMap: Record<FontFamily, string> = {
  default: 'System',
  serif: 'serif',
  monospace: 'monospace',
  cursive: 'cursive',
};

const fontDisplayNames: Record<FontFamily, string> = {
  default: 'Sistema',
  serif: 'Serif',
  monospace: 'Monospace',
  cursive: 'Cursiva',
};

export const FontProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('default');

  useEffect(() => {
    loadFontFamily();
  }, []);

  const loadFontFamily = async () => {
    try {
      const savedFont = await AsyncStorage.getItem('fontFamily');
      if (savedFont && Object.keys(fontFamilyMap).includes(savedFont)) {
        setFontFamilyState(savedFont as FontFamily);
      }
    } catch (error) {
      console.error('Error loading font family:', error);
    }
  };

  const setFontFamily = async (font: FontFamily) => {
    try {
      await AsyncStorage.setItem('fontFamily', font);
      setFontFamilyState(font);
    } catch (error) {
      console.error('Error saving font family:', error);
    }
  };

  const getFontStyle = () => {
    return { fontFamily: fontFamilyMap[fontFamily] };
  };

  return (
    <FontContext.Provider value={{ fontFamily, setFontFamily, getFontStyle }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};

export { fontDisplayNames };