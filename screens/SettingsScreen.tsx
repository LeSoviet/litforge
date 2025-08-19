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
import { useColorScheme } from 'react-native';
import { colors, getTheme } from '../theme/colors';
// TODO: Create and implement SettingsService
import { SettingsService } from '../services/SettingsService';
import { DocumentService } from '../services/DocumentService';
import { AppSettings } from '../types/Document';
import type { SettingsScreenProps } from '../types/navigation';

const SettingsScreen: React.FC<SettingsScreenProps> = ({ route }) => {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: systemColorScheme === 'dark',
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
  });
  const theme = getTheme(settings.darkMode);
  const styles = createStyles(theme);
  const [storageInfo, setStorageInfo] = useState({
    documentsCount: 0,
    bookmarksCount: 0,
    notesCount: 0,
  });

  useEffect(() => {
    loadSettings();
    loadStorageInfo();
  }, []);

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
      await SettingsService.updateSetting(key, value);
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Borrar todos los datos',
      'Esta acción eliminará todos los documentos, marcadores y notas. ¿Estás seguro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
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
              Alert.alert('Éxito', 'Todos los datos han sido eliminados');
            } catch (error) {
              Alert.alert('Error', 'No se pudieron eliminar los datos');
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
        'Exportar datos',
        'Funcionalidad de exportación en desarrollo'
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron exportar los datos');
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
        <Text style={styles.title}>Configuración</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection(
          'Apariencia',
          <>
            {renderSettingItem(
              'moon',
              'Modo oscuro',
              'Usar tema oscuro en toda la aplicación',
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => updateSetting('darkMode', value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primaryLight,
                }}
                thumbColor={theme.colors.primary}
              />
            )}
            {renderSettingItem(
              'text',
              'Tamaño de fuente predeterminado',
              `${settings.defaultFontSize}px`,
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
                  <Ionicons name="remove" size={16} color={theme.colors.text} />
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
                  <Ionicons name="add" size={16} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {renderSection(
          'Lectura',
          <>
            {renderSettingItem(
              'vibration',
              'Retroalimentación háptica',
              'Vibración al cambiar páginas y marcar texto',
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(value) => updateSetting('hapticFeedback', value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primaryLight,
                }}
                thumbColor={theme.colors.primary}
              />
            )}
            {renderSettingItem(
              'save',
              'Guardar progreso automáticamente',
              'Guardar posición de lectura al cambiar de página',
              <Switch
                value={settings.autoSaveProgress}
                onValueChange={(value) => updateSetting('autoSaveProgress', value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primaryLight,
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
                  true: theme.colors.primaryLight,
                }}
                thumbColor={theme.colors.primary}
              />
            )}
          </>
        )}

        {renderSection(
          'Almacenamiento',
          <>
            {renderSettingItem(
              'library',
              'Documentos',
              `${storageInfo.documentsCount} archivos`,
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.colors.textSecondary}
              />
            )}
            {renderSettingItem(
              'bookmarks',
              'Marcadores',
              `${storageInfo.bookmarksCount} marcadores guardados`
            )}
            {renderSettingItem(
              'create',
              'Notas',
              `${storageInfo.notesCount} notas guardadas`
            )}
            {renderSettingItem(
              'cloud-upload',
              'Exportar datos',
              'Crear copia de seguridad de tus datos',
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
          'Acerca de',
          <>
            {renderSettingItem(
              'information-circle',
              'Versión',
              '1.0.0'
            )}
            {renderSettingItem(
              'book',
              'LitForge',
              'Un lector de ebooks limpio y minimalista'
            )}
            {renderSettingItem(
              'heart',
              'Hecho con amor',
              'Gratuito, sin anuncios, código abierto'
            )}
          </>
        )}

        {renderSection(
          'Zona de peligro',
          renderSettingItem(
            'trash',
            'Borrar todos los datos',
            'Eliminar documentos, marcadores y notas',
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.error}
            />,
            clearAllData
          )
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            LitForge v1.0.0 • Hecho con React Native + Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
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
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 8,
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
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
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
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSizeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default SettingsScreen;