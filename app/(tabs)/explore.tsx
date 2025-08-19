import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../../contexts/ThemeContext';
import { useFont, FontFamily, fontDisplayNames } from '../../contexts/FontContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SettingsScreen() {
  const [fontSize, setFontSize] = useState(16);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { theme, isDarkMode, setThemeMode } = useTheme();
  const { fontFamily, setFontFamily } = useFont();
  const { language, setLanguage, t } = useLanguage();
  const styles = createStyles(theme);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      const savedAutoSave = await AsyncStorage.getItem('autoSave');
      const savedNotifications = await AsyncStorage.getItem('notifications');

      if (savedFontSize !== null) {
        setFontSize(parseInt(savedFontSize));
      }

      if (savedAutoSave !== null) {
        setAutoSave(JSON.parse(savedAutoSave));
      }

      if (savedNotifications !== null) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSetting = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleDarkModeToggle = (value: boolean) => {
    setThemeMode(value);
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    saveSetting('fontSize', newSize);
  };

  const handleAutoSaveToggle = (value: boolean) => {
    setAutoSave(value);
    saveSetting('autoSave', value);
  };

  const handleNotificationsToggle = (value: boolean) => {
    setNotifications(value);
    saveSetting('notifications', value);
  };

  const showFontSelector = () => {
    const fontOptions = Object.entries(fontDisplayNames).map(([key, displayName]) => ({
      text: displayName,
      onPress: () => setFontFamily(key as FontFamily),
    }));

    Alert.alert(
      t('settings.font'),
      t('settings.fontDesc'),
      [
        ...fontOptions,
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const showLanguageSelector = () => {
    const languageOptions = [
      { text: t('language.spanish'), onPress: () => setLanguage('es') },
      { text: t('language.english'), onPress: () => setLanguage('en') },
      { text: t('language.portuguese'), onPress: () => setLanguage('pt') },
    ];

    Alert.alert(
      t('settings.language'),
      'Selecciona el idioma de la aplicación',
      [
        ...languageOptions,
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const clearAllData = () => {
    Alert.alert(
      'Borrar todos los datos',
      'Esta acción eliminará todos los documentos, notas y configuraciones. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Éxito', 'Todos los datos han sido eliminados');
              // Reset to default values
              setThemeMode(false);
              setFontSize(16);
              setAutoSave(true);
              setNotifications(true);
            } catch (error) {
              Alert.alert('Error', 'No se pudieron eliminar los datos');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    children 
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    children: React.ReactNode;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color={theme.colors.primary} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
          
          <SettingItem
            icon="moon"
            title={t('settings.darkMode')}
            subtitle="Cambiar entre tema claro y oscuro"
          >
            <Switch
              value={isDarkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={isDarkMode ? theme.colors.primary : theme.colors.surface}
            />
          </SettingItem>

          <SettingItem
            icon="text"
            title={t('settings.fontSize')}
            subtitle={`Actual: ${fontSize}px`}
          >
            <View style={styles.fontSizeControls}>
              <TouchableOpacity
                style={styles.fontButton}
                onPress={() => handleFontSizeChange(Math.max(12, fontSize - 2))}
              >
                <Text style={styles.fontButtonText}>A-</Text>
              </TouchableOpacity>
              <Text style={styles.fontSizeText}>{fontSize}</Text>
              <TouchableOpacity
                style={styles.fontButton}
                onPress={() => handleFontSizeChange(Math.min(24, fontSize + 2))}
              >
                <Text style={styles.fontButtonText}>A+</Text>
              </TouchableOpacity>
            </View>
          </SettingItem>

          <SettingItem
            icon="library"
            title={t('settings.font')}
            subtitle={`Actual: ${fontDisplayNames[fontFamily]}`}
          >
            <TouchableOpacity
              style={styles.fontSelectorButton}
              onPress={showFontSelector}
            >
              <Text style={styles.fontSelectorText}>{t('common.change')}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </SettingItem>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.general')}</Text>
          
          <SettingItem
            icon="language"
            title={t('settings.language')}
            subtitle={language === 'es' ? 'Español' : language === 'en' ? 'English' : 'Português'}
          >
            <TouchableOpacity
              style={styles.fontSelectorButton}
              onPress={showLanguageSelector}
            >
              <Text style={styles.fontSelectorText}>{t('common.change')}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </SettingItem>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.reading')}</Text>
          
          <SettingItem
            icon="save"
            title={t('settings.autoSave')}
            subtitle="Guardar progreso automáticamente"
          >
            <Switch
              value={autoSave}
              onValueChange={handleAutoSaveToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={autoSave ? theme.colors.primary : theme.colors.surface}
            />
          </SettingItem>

          <SettingItem
            icon="notifications"
            title={t('settings.notifications')}
            subtitle="Recibir recordatorios de lectura"
          >
            <Switch
              value={notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={notifications ? theme.colors.primary : theme.colors.surface}
            />
          </SettingItem>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
            <Ionicons name="trash" size={24} color={theme.colors.error} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.colors.error }]}>
                {t('settings.clearData')}
              </Text>
              <Text style={styles.settingSubtitle}>
                {t('settings.clearDataDesc')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>LitForge</Text>
            <Text style={styles.version}>Versión 1.0.0</Text>
            <Text style={styles.description}>
              Tu compañero de lectura digital para documentos PDF, DOCX y Markdown
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    marginHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  fontButtonText: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  fontSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  fontSelectorText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  aboutContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
