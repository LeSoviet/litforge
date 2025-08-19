import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, ThemePreference } from '../types/Document';

// Storage key for settings
const SETTINGS_KEY = '@litforge_settings';

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  hapticFeedback: true,
  autoSaveProgress: true,
  defaultFontSize: 16,
  keepScreenOn: false,
  defaultReadingMode: 'scroll',
  highlightColor: '#3B82F6',
  fontSize: 16,
  fontFamily: 'Inter',
  readingMode: 'scroll',
  notifications: true,
  brightness: 1.0,
  language: 'es',
  theme: 'light',
  lineHeight: 1.5,
  textAlign: 'left',
  autoSave: true,
  pageTransition: 'slide',
  autoBackup: false,
  backupFrequency: 'weekly',
};

export class SettingsService {
  // Get all settings
  static async getSettings(): Promise<AppSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settingsJson) {
        const savedSettings = JSON.parse(settingsJson);
        // Merge with defaults to ensure all properties exist
        return { ...DEFAULT_SETTINGS, ...savedSettings };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  // Update settings
  static async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...updates };
      
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      return newSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Get specific setting
  static async getSetting<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    try {
      const settings = await this.getSettings();
      return settings[key];
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      return DEFAULT_SETTINGS[key];
    }
  }

  // Update specific setting
  static async setSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    try {
      await this.updateSettings({ [key]: value } as Partial<AppSettings>);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  }

  // Alias for setSetting to match usage in screens
  static async updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    return this.setSetting(key, value);
  }

  // Clear all settings (reset to defaults)
  static async clearSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      console.error('Error clearing settings:', error);
      throw error;
    }
  }

  // Reset to defaults
  static async resetSettings(): Promise<AppSettings> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }

  // Theme-specific methods
  static async toggleDarkMode(): Promise<boolean> {
    try {
      const currentSettings = await this.getSettings();
      const newDarkMode = !currentSettings.darkMode;
      await this.setSetting('darkMode', newDarkMode);
      return newDarkMode;
    } catch (error) {
      console.error('Error toggling dark mode:', error);
      throw error;
    }
  }

  static async setTheme(theme: ThemePreference): Promise<void> {
    try {
      await this.setSetting('theme', theme);
    } catch (error) {
      console.error('Error setting theme:', error);
      throw error;
    }
  }

  // Font settings
  static async updateFontSize(fontSize: number): Promise<void> {
    try {
      // Clamp font size between 12 and 24
      const clampedSize = Math.max(12, Math.min(24, fontSize));
      await this.setSetting('fontSize', clampedSize);
    } catch (error) {
      console.error('Error updating font size:', error);
      throw error;
    }
  }

  static async updateFontFamily(fontFamily: string): Promise<void> {
    try {
      await this.setSetting('fontFamily', fontFamily);
    } catch (error) {
      console.error('Error updating font family:', error);
      throw error;
    }
  }

  // Reading preferences
  static async setReadingMode(mode: 'scroll' | 'page'): Promise<void> {
    try {
      await this.setSetting('readingMode', mode);
    } catch (error) {
      console.error('Error setting reading mode:', error);
      throw error;
    }
  }

  static async setPageTransition(transition: 'slide' | 'fade' | 'none'): Promise<void> {
    try {
      await this.setSetting('pageTransition', transition);
    } catch (error) {
      console.error('Error setting page transition:', error);
      throw error;
    }
  }

  static async updateLineHeight(lineHeight: number): Promise<void> {
    try {
      // Clamp line height between 1.0 and 2.0
      const clampedHeight = Math.max(1.0, Math.min(2.0, lineHeight));
      await this.setSetting('lineHeight', clampedHeight);
    } catch (error) {
      console.error('Error updating line height:', error);
      throw error;
    }
  }

  static async setTextAlign(align: 'left' | 'center' | 'right' | 'justify'): Promise<void> {
    try {
      await this.setSetting('textAlign', align);
    } catch (error) {
      console.error('Error setting text align:', error);
      throw error;
    }
  }

  // System preferences
  static async toggleHapticFeedback(): Promise<boolean> {
    try {
      const currentSettings = await this.getSettings();
      const newHapticFeedback = !currentSettings.hapticFeedback;
      await this.setSetting('hapticFeedback', newHapticFeedback);
      return newHapticFeedback;
    } catch (error) {
      console.error('Error toggling haptic feedback:', error);
      throw error;
    }
  }

  static async toggleKeepScreenOn(): Promise<boolean> {
    try {
      const currentSettings = await this.getSettings();
      const newKeepScreenOn = !currentSettings.keepScreenOn;
      await this.setSetting('keepScreenOn', newKeepScreenOn);
      return newKeepScreenOn;
    } catch (error) {
      console.error('Error toggling keep screen on:', error);
      throw error;
    }
  }

  static async toggleAutoSave(): Promise<boolean> {
    try {
      const currentSettings = await this.getSettings();
      const newAutoSave = !currentSettings.autoSave;
      await this.setSetting('autoSave', newAutoSave);
      return newAutoSave;
    } catch (error) {
      console.error('Error toggling auto save:', error);
      throw error;
    }
  }

  static async toggleNotifications(): Promise<boolean> {
    try {
      const currentSettings = await this.getSettings();
      const newNotifications = !currentSettings.notifications;
      await this.setSetting('notifications', newNotifications);
      return newNotifications;
    } catch (error) {
      console.error('Error toggling notifications:', error);
      throw error;
    }
  }

  static async toggleAutoBackup(): Promise<boolean> {
    try {
      const currentSettings = await this.getSettings();
      const newAutoBackup = !currentSettings.autoBackup;
      await this.setSetting('autoBackup', newAutoBackup);
      return newAutoBackup;
    } catch (error) {
      console.error('Error toggling auto backup:', error);
      throw error;
    }
  }

  // Brightness control
  static async updateBrightness(brightness: number): Promise<void> {
    try {
      // Clamp brightness between 0.1 and 1.0
      const clampedBrightness = Math.max(0.1, Math.min(1.0, brightness));
      await this.setSetting('brightness', clampedBrightness);
    } catch (error) {
      console.error('Error updating brightness:', error);
      throw error;
    }
  }

  // Language setting
  static async setLanguage(language: string): Promise<void> {
    try {
      await this.setSetting('language', language);
    } catch (error) {
      console.error('Error setting language:', error);
      throw error;
    }
  }

  // Export settings
  static async exportSettings(): Promise<string> {
    try {
      const settings = await this.getSettings();
      return JSON.stringify(settings, null, 2);
    } catch (error) {
      console.error('Error exporting settings:', error);
      throw error;
    }
  }

  // Import settings
  static async importSettings(settingsJson: string): Promise<AppSettings> {
    try {
      const importedSettings = JSON.parse(settingsJson);
      
      // Validate imported settings against default structure
      const validatedSettings: Partial<AppSettings> = {};
      
      Object.keys(DEFAULT_SETTINGS).forEach(key => {
        const settingKey = key as keyof AppSettings;
        if (importedSettings.hasOwnProperty(key)) {
          validatedSettings[settingKey] = importedSettings[key];
        }
      });
      
      return await this.updateSettings(validatedSettings);
    } catch (error) {
      console.error('Error importing settings:', error);
      throw error;
    }
  }

  // Get reading statistics
  static async getReadingStats(): Promise<any> {
    try {
      // This would integrate with DocumentService to get reading statistics
      // For now, return basic info
      const settings = await this.getSettings();
      
      return {
        preferredFontSize: settings.fontSize,
        preferredFontFamily: settings.fontFamily,
        readingMode: settings.readingMode,
        darkModeEnabled: settings.darkMode,
        totalReadingTime: 0, // TODO: Implement reading time tracking
        averageReadingSpeed: 0, // TODO: Implement reading speed calculation
      };
    } catch (error) {
      console.error('Error getting reading stats:', error);
      return {};
    }
  }
}