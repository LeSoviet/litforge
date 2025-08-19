import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFont } from '../contexts/FontContext';

interface DocumentCardProgressProps {
  progress: number;
  theme: any;
}

const DocumentCardProgress: React.FC<DocumentCardProgressProps> = ({
  progress,
  theme,
}) => {
  const { getFontStyle } = useFont();

  const getProgressColor = (progressValue: number): string => {
    if (progressValue >= 0.95) return theme.colors.success;
    if (progressValue >= 0.5) return theme.colors.warning;
    return theme.colors.primary;
  };

  const styles = StyleSheet.create({
    progressContainer: {
      marginTop: 8,
    },
    progressLabel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    progressText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '500',
      ...getFontStyle(),
    },
    progressPercentage: {
      fontSize: 12,
      color: theme.colors.text,
      fontWeight: '600',
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.surface,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
  });

  if (progress <= 0) return null;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressLabel}>
        <Text style={styles.progressText}>Progreso de lectura</Text>
        <Text style={styles.progressPercentage}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: getProgressColor(progress),
            },
          ]}
        />
      </View>
    </View>
  );
};

export default DocumentCardProgress;