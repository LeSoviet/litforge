import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 40,
      color: theme.colors.text,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    iconContainer: {
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
      color: theme.colors.text,
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },
  });

export default function FeedbackScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(theme);

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
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl).catch(() =>
      Alert.alert(
        'Error',
        'Could not open email client. Please send your feedback to: feedback@litforge.app'
      )
    );
  };

  const handleBugReport = () => {
    const email = 'bugs@litforge.app';
    const subject = 'Bug Report - LitForge';
    const body =
      'Hello, I found a bug in the application:\n\nProblem description:\n\nSteps to reproduce:\n\nDevice and version:';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl).catch(() =>
      Alert.alert(
        'Error',
        'Could not open email client. Please send your report to: bugs@litforge.app'
      )
    );
  };

  const renderCard = (
    icon: string,
    title: string,
    caption: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <IconSymbol size={32} name={icon as any} color={theme.colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>{title}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('feedback.title')}</Text>
        {renderCard(
          'heart.fill',
          t('feedback.donations'),
          t('feedback.donationsDesc'),
          handleDonation
        )}
        {renderCard(
          'message.fill',
          t('feedback.sendFeedback'),
          t('feedback.feedbackDesc'),
          handleFeedback
        )}
        {renderCard(
          'exclamationmark.triangle.fill',
          t('feedback.reportBug'),
          t('feedback.bugDesc'),
          handleBugReport
        )}
      </ScrollView>
    </SafeAreaView>
  );
}