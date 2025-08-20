import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { useCommonStyles } from '../../hooks/useCommonStyles';
import { useAndroidFixes } from '../../styles/androidFixes';

export default function SettingsScreen() {
  const [fontSize, setFontSize] = useState(16);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { theme, isDarkMode, setThemeMode } = useTheme();
  const { fontFamily, setFontFamily } = useFont();
  const { language, setLanguage, t } = useLanguage();
  const { styles, staticStyles } = useCommonStyles();
  const androidFixes = useAndroidFixes(theme);

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
    <View style={[styles.card, styles.layout.row, { justifyContent: 'space-between' }]}>
      <View style={[styles.layout.row, staticStyles.flex1]}>
        <Ionicons name={icon as any} size={24} color={theme.colors.primary} />
        <View style={[styles.spacing.margin.leftMd, staticStyles.flex1]}>
          <Text style={[styles.text.title, { color: theme.colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.text.caption, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container.main}>
      <View style={styles.header.container}>
        <Text style={[styles.header.title, { color: theme.colors.text, textAlign: 'center' }]}>Settings</Text>
      </View>

      <ScrollView style={staticStyles.flex1} showsVerticalScrollIndicator={false}>
        <View style={styles.spacing.margin.bottomXl}>
          <Text style={[styles.text.subtitle, styles.spacing.margin.bottomLg, { color: theme.colors.text, textAlign: 'center' }]}>Appearance</Text>
          
          <SettingItem
            icon="moon"
            title={t('settings.darkMode')}
            subtitle={t('settings.darkModeDesc')}
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
            <View style={styles.layout.row}>
              <TouchableOpacity
                style={[styles.button.primary, styles.spacing.margin.rightSm]}
                onPress={() => handleFontSizeChange(Math.max(12, fontSize - 2))}
              >
                <Text style={styles.button.primaryText}>A-</Text>
              </TouchableOpacity>
              <Text style={[styles.text.body, { minWidth: 24, textAlign: 'center', color: theme.colors.text }, styles.spacing.margin.rightSm]}>{fontSize}</Text>
              <TouchableOpacity
                style={styles.button.primary}
                onPress={() => handleFontSizeChange(Math.min(24, fontSize + 2))}
              >
                <Text style={styles.button.primaryText}>A+</Text>
              </TouchableOpacity>
            </View>
          </SettingItem>

          <SettingItem
            icon="library"
            title={t('settings.font')}
            subtitle={`Actual: ${fontDisplayNames[fontFamily]}`}
          >
            <TouchableOpacity
              style={[styles.layout.row, styles.spacing.padding.sm, { backgroundColor: theme.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border }]}
              onPress={showFontSelector}
            >
              <Text style={[styles.text.caption, { color: theme.colors.primary, fontWeight: '500', marginRight: 4, textAlign: 'center' }]}>{t('common.change')}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </SettingItem>
        </View>

        <View style={styles.spacing.margin.bottomXl}>
          <Text style={[styles.text.subtitle, styles.spacing.margin.bottomLg, { color: theme.colors.text, textAlign: 'center' }]}>General</Text>
          
          <SettingItem
            icon="language"
            title={t('settings.language')}
            subtitle={language === 'es' ? 'Español' : language === 'en' ? 'English' : 'Português'}
          >
            <TouchableOpacity
              style={[styles.layout.row, styles.spacing.padding.sm, { backgroundColor: theme.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border }]}
              onPress={showLanguageSelector}
            >
              <Text style={[styles.text.caption, { color: theme.colors.primary, fontWeight: '500', marginRight: 4, textAlign: 'center' }]}>{t('common.change')}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </SettingItem>
        </View>

        <View style={styles.spacing.margin.bottomXl}>
          <Text style={[styles.text.subtitle, styles.spacing.margin.bottomLg, { color: theme.colors.text, textAlign: 'center' }]}>Reading</Text>
          
          <SettingItem
            icon="save"
            title={t('settings.autoSave')}
            subtitle="Save reading progress automatically"
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
            subtitle="Receive reading reminders"
          >
            <Switch
              value={notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={notifications ? theme.colors.primary : theme.colors.surface}
            />
          </SettingItem>
        </View>

        <View style={styles.spacing.margin.bottomXl}>
          <Text style={[styles.text.subtitle, styles.spacing.margin.bottomLg, { color: theme.colors.text, textAlign: 'center' }]}>Storage</Text>
          
          <TouchableOpacity style={[styles.layout.row, styles.card, { borderWidth: 1, borderColor: theme.colors.error }]} onPress={clearAllData}>
            <Ionicons name="trash" size={24} color={theme.colors.error} />
            <View style={[styles.spacing.margin.leftMd, staticStyles.flex1]}>
              <Text style={[styles.text.title, { color: theme.colors.error }]}>
                {t('settings.clearData')}
              </Text>
              <Text style={[styles.text.caption, { color: theme.colors.textSecondary }]}>
                {t('settings.clearDataDesc')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.spacing.margin.bottomXl}>
          <Text style={[styles.text.subtitle, styles.spacing.margin.bottomLg, { color: theme.colors.text, textAlign: 'center' }]}>About</Text>
          <View style={[styles.card, { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16 }]}>
            <Text style={[styles.text.heading, { color: theme.colors.primary, marginBottom: 8, textAlign: 'center' }]}>LitForge</Text>
            <Text style={[styles.text.body, { color: theme.colors.textSecondary, marginBottom: 16, textAlign: 'center' }]}>Version 1.0.0</Text>
            <Text style={[styles.text.caption, { 
              textAlign: 'center', 
              lineHeight: 18, 
              color: theme.colors.text,
              maxWidth: '90%'
            }]}>
              Your digital reading companion for PDF, DOCX and Markdown documents
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
