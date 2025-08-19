import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCommonStyles } from '../../hooks/useCommonStyles';

export default function FeedbackScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { styles, staticStyles } = useCommonStyles();

  const handleDonation = () => {
    Alert.alert(
      t('feedback.donations'),
      'Thank you for your interest in supporting the project! Donations will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handleFeedback = () => {
    const email = 'feedback@litforge.app';
    const subject = 'LitForge Feedback';
    const body = 'Hello, I would like to share my feedback about the application:';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        } else {
          Alert.alert(
            'Error',
            'Could not open email client. Please send your feedback to: feedback@litforge.app'
          );
        }
      })
      .catch(() => {
        Alert.alert(
          'Error',
          'Could not open email client. Please send your feedback to: feedback@litforge.app'
        );
      });
  };

  const handleBugReport = () => {
    const email = 'bugs@litforge.app';
    const subject = 'Bug Report - LitForge';
    const body = 'Hello, I found a bug in the application:\n\nProblem description:\n\nSteps to reproduce:\n\nDevice and version:';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        } else {
          Alert.alert(
            'Error',
            'Could not open email client. Please send your report to: bugs@litforge.app'
          );
        }
      })
      .catch(() => {
        Alert.alert(
          'Error',
          'Could not open email client. Please send your report to: bugs@litforge.app'
        );
      });
  };



  return (
    <SafeAreaView style={[staticStyles.flex1, { backgroundColor: theme.colors.background }]}>
      <View style={[staticStyles.flex1, styles.spacing.padding.lg, { justifyContent: 'center' }]}>
        <Text style={[styles.text.largeTitle, { textAlign: 'center', marginBottom: 40, color: theme.colors.text }]}>{t('feedback.title')}</Text>
        
        <TouchableOpacity style={[styles.layout.row, styles.card, styles.spacing.margin.bottomMd]} onPress={handleDonation}>
          <View style={styles.spacing.margin.rightMd}>
            <IconSymbol size={32} name="heart.fill" color={theme.colors.primary} />
          </View>
          <View style={staticStyles.flex1}>
            <Text style={[styles.text.subtitle, styles.spacing.margin.bottomXs, { color: theme.colors.text }]}>{t('feedback.donations')}</Text>
            <Text style={[styles.text.caption, { lineHeight: 20, color: theme.colors.textSecondary }]}>
              {t('feedback.donationsDesc')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.layout.row, styles.card, styles.spacing.margin.bottomMd]} onPress={handleFeedback}>
          <View style={styles.spacing.margin.rightMd}>
            <IconSymbol size={32} name="message.fill" color={theme.colors.primary} />
          </View>
          <View style={staticStyles.flex1}>
            <Text style={[styles.text.subtitle, styles.spacing.margin.bottomXs, { color: theme.colors.text }]}>{t('feedback.sendFeedback')}</Text>
            <Text style={[styles.text.caption, { lineHeight: 20, color: theme.colors.textSecondary }]}>
              {t('feedback.feedbackDesc')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.layout.row, styles.card, styles.spacing.margin.bottomMd]} onPress={handleBugReport}>
          <View style={styles.spacing.margin.rightMd}>
            <IconSymbol size={32} name="exclamationmark.triangle.fill" color={theme.colors.primary} />
          </View>
          <View style={staticStyles.flex1}>
            <Text style={[styles.text.subtitle, styles.spacing.margin.bottomXs, { color: theme.colors.text }]}>{t('feedback.reportBug')}</Text>
            <Text style={[styles.text.caption, { lineHeight: 20, color: theme.colors.textSecondary }]}>
              {t('feedback.bugDesc')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}