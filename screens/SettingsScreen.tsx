import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { Theme, ThemeType } from '../types/types';
import { useTheme } from '../contexts';
import { useAndroidFixes } from '../styles/androidFixes';
// TODO: Create and implement SettingsService
import { SettingsService } from '../services/SettingsService';
import { DocumentService } from '../services/DocumentService';
import { AppSettings } from '../types';
import type { SettingsScreenProps } from '../types/navigation';

const SettingsScreen: React.FC<SettingsScreenProps> = ({ route }) => {
  const { theme, themeType, setThemeType, cycleTheme } = useTheme();
  const androidFixes = useAndroidFixes(theme);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: theme.dark,
    hapticFeedback: true,
    autoSaveProgress: true,
    defaultFontSize: 16,
    keepScreenOn: false,
    defaultReadingMode: 'scroll',
    highlightColor: theme.colors.primary,
    fontSize: 16,
    fontFamily: 'Inter',
    readingMode: 'scroll',
    notifications: true,
    brightness: 1.0,
    language: 'es',
    theme: themeType,
    lineHeight: 1.5,
    textAlign: 'left',
    autoSave: true,
    pageTransition: 'slide',
    autoBackup: false,
    backupFrequency: 'weekly',
  });
  const styles = createStyles(theme, androidFixes);
  const [storageInfo, setStorageInfo] = useState({
    documentsCount: 0,
    bookmarksCount: 0,
    notesCount: 0,
  });

  useEffect(() => {
    loadSettings();
    loadStorageInfo();
  }, []);

  // Sincronizar el estado local cuando cambie el tema desde el contexto
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme: themeType,
      darkMode: theme.dark
    }));
  }, [themeType, theme.dark]);

  const loadSettings = async () => {
    try {
      const savedSettings = await SettingsService.getSettings();
      setSettings(prev => ({ ...prev, ...savedSettings }));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadStorageInfo = async () => {
    try {
      const documents = await DocumentService.getAllDocuments();
      const bookmarks = await DocumentService.getAllBookmarks();
      const notes = await DocumentService.getAllNotes();
      
      setStorageInfo({
        documentsCount: documents.length,
        bookmarksCount: bookmarks.length,
        notesCount: notes.length,
      });
    } catch (error) {
      console.error('Error loading storage info:', error);
    }
  };

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // Sincronizar con el contexto de temas si es necesario
      if (key === 'theme' && (value === 'blue' || value === 'green' || value === 'purple' || value === 'orange')) {
        setThemeType(value);
      }
      
      await SettingsService.updateSetting(key, value);
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This action will delete all documents, bookmarks and notes. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await DocumentService.clearAllData();
              await SettingsService.clearSettings();
              setStorageInfo({
                documentsCount: 0,
                bookmarksCount: 0,
                notesCount: 0,
              });
              Alert.alert('Success', 'All data has been deleted');
            } catch (error) {
              Alert.alert('Error', 'Could not delete data');
            }
          },
        },
      ]
    );
  };

  const exportData = async () => {
    try {
      const data = await DocumentService.exportAllData();
      // Here you would implement the actual export functionality
      // For now, we'll just show an alert
      Alert.alert(
        'Export Data',
        'Export functionality in development'
      );
    } catch (error) {
      Alert.alert('Error', 'Could not export data');
    }
  };

  const getThemeDisplayName = (themeType: ThemeType): string => {
    switch (themeType) {
      case 'blue':
        return 'Blue';
      case 'green':
        return 'Green';
      case 'purple':
        return 'Purple';
      case 'orange':
        return 'Orange';
      default:
        return 'Blue';
    }
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    rightComponent?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightComponent && (
        <View style={styles.settingRight}>{rightComponent}</View>
      )}
    </TouchableOpacity>
  );


  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection(
          'Appearance',
          <>
            {renderSettingItem(
              'color-palette',
              'Color Theme',
              `Current theme: ${getThemeDisplayName(themeType)}`,
              <TouchableOpacity
                style={styles.themeButton}
                onPress={cycleTheme}
              >
                <Text style={styles.themeButtonText}>Change</Text>
              </TouchableOpacity>
            )}
            {renderSettingItem(
              'text',
              'Default Font Size',
              undefined,
              <View style={styles.fontSizeControls}>
                <TouchableOpacity
                  style={styles.fontSizeButton}
                  onPress={() =>
                    updateSetting(
                      'defaultFontSize',
                      Math.max(12, settings.defaultFontSize - 2)
                    )
                  }
                >
                  <Text style={[styles.fontSizeButtonText, { color: theme.colors.text }]}>A-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.fontSizeButton}
                  onPress={() =>
                    updateSetting(
                      'defaultFontSize',
                      Math.min(24, settings.defaultFontSize + 2)
                    )
                  }
                >
                  <Text style={[styles.fontSizeButtonText, { color: theme.colors.text }]}>A+</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {renderSection(
          'Reading',
          <>
            {renderSettingItem(
              'vibration',
              'Haptic Feedback',
              'Vibration when turning pages and marking text',
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(value) => updateSetting('hapticFeedback', value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.primary}
              />
            )}
            {renderSettingItem(
              'save',
              'Auto-save Progress',
              'Save reading position when changing pages',
              <Switch
                value={settings.autoSaveProgress}
                onValueChange={(value) => updateSetting('autoSaveProgress', value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.primary}
              />
            )}
            {renderSettingItem(
              'phone-portrait',
              'Mantener pantalla encendida',
              'Evitar que la pantalla se apague durante la lectura',
              <Switch
                value={settings.keepScreenOn}
                onValueChange={(value) => updateSetting('keepScreenOn', value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.primary}
              />
            )}
          </>
        )}

        {renderSection(
          'Storage',
          <>
            {renderSettingItem(
              'library',
              'Documents',
              `${storageInfo.documentsCount} files`,
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.colors.textSecondary}
              />
            )}
            {renderSettingItem(
              'bookmarks',
              'Bookmarks',
              `${storageInfo.bookmarksCount} saved bookmarks`
            )}
            {renderSettingItem(
              'create',
              'Notes',
              `${storageInfo.notesCount} saved notes`
            )}
            {renderSettingItem(
              'cloud-upload',
              'Export Data',
              'Create backup of your data',
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.colors.textSecondary}
              />,
              exportData
            )}
          </>
        )}



        {renderSection(
          'Danger Zone',
          renderSettingItem(
            'trash',
            'Clear All Data',
            'Delete documents, bookmarks and notes',
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.error}
            />,
            clearAllData
          )
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

type AndroidFixesStyles = ReturnType<typeof useAndroidFixes>;

const createStyles = (theme: Theme, androidFixes: AndroidFixesStyles) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    ...(androidFixes.textCenterFix || {}),
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 8,
    ...(androidFixes.textCenterFix || {}),
  },
  sectionContent: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    flexWrap: 'wrap', // Allow text to wrap
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  settingRight: {
    marginLeft: 12,
    justifyContent: 'center', // Center content vertically
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    minWidth: 120, // Ensure consistent width
    justifyContent: 'space-between',
  },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    ...(androidFixes.buttonCenterFix || {}),
    elevation: 2, // Add shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  fontSizeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.background,
  },
  fontSizeDisplay: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    minWidth: 32,
    textAlign: 'center',
    lineHeight: 36, // Match button height for perfect vertical alignment
    ...(androidFixes.textCenterFix || {}),
  },
  themeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 80, // Ensure consistent button width
    ...(androidFixes.buttonCenterFix || {}),
    elevation: 2, // Add shadow for better visibility
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  themeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.surface,
    textAlign: 'center',
    ...(androidFixes.textCenterFix || {}),
  },
});

export default SettingsScreen;