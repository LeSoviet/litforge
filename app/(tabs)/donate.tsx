import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function FeedbackScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleDonation = () => {
    Alert.alert(
      'Donaciones',
      '¡Gracias por tu interés en apoyar el proyecto! Las donaciones estarán disponibles próximamente.',
      [{ text: 'OK' }]
    );
  };

  const handleFeedback = () => {
    const email = 'feedback@litforge.app';
    const subject = 'Feedback sobre LitForge';
    const body = 'Hola, me gustaría compartir mi feedback sobre la aplicación:';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        } else {
          Alert.alert(
            'Error',
            'No se pudo abrir el cliente de correo. Por favor envía tu feedback a: feedback@litforge.app'
          );
        }
      })
      .catch(() => {
        Alert.alert(
          'Error',
          'No se pudo abrir el cliente de correo. Por favor envía tu feedback a: feedback@litforge.app'
        );
      });
  };

  const handleBugReport = () => {
    const email = 'bugs@litforge.app';
    const subject = 'Reporte de Bug - LitForge';
    const body = 'Hola, he encontrado un bug en la aplicación:\n\nDescripción del problema:\n\nPasos para reproducir:\n\nDispositivo y versión:';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        } else {
          Alert.alert(
            'Error',
            'No se pudo abrir el cliente de correo. Por favor envía tu reporte a: bugs@litforge.app'
          );
        }
      })
      .catch(() => {
        Alert.alert(
          'Error',
          'No se pudo abrir el cliente de correo. Por favor envía tu reporte a: bugs@litforge.app'
        );
      });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 40,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    optionIcon: {
      marginRight: 16,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    optionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('feedback.title')}</Text>
        
        <TouchableOpacity style={styles.optionButton} onPress={handleDonation}>
          <View style={styles.optionIcon}>
            <IconSymbol size={32} name="heart.fill" color={theme.colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{t('feedback.donations')}</Text>
            <Text style={styles.optionDescription}>
              {t('feedback.donationsDesc')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={handleFeedback}>
          <View style={styles.optionIcon}>
            <IconSymbol size={32} name="message.fill" color={theme.colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{t('feedback.sendFeedback')}</Text>
            <Text style={styles.optionDescription}>
              {t('feedback.feedbackDesc')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={handleBugReport}>
          <View style={styles.optionIcon}>
            <IconSymbol size={32} name="exclamationmark.triangle.fill" color={theme.colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{t('feedback.reportBug')}</Text>
            <Text style={styles.optionDescription}>
              {t('feedback.bugDesc')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}