import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFont } from '../contexts/FontContext';

interface DocumentCardMetadataProps {
  type: string;
  size: number;
  createdAt: string;
  theme: any;
}

const DocumentCardMetadata: React.FC<DocumentCardMetadataProps> = ({
  type,
  size,
  createdAt,
  theme,
}) => {
  const { getFontStyle } = useFont();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hoy';
    } else if (diffDays === 2) {
      return 'Ayer';
    } else if (diffDays <= 7) {
      return `Hace ${diffDays - 1} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const styles = StyleSheet.create({
    metadata: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    metadataText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '400',
      ...getFontStyle(),
    },
    separator: {
      color: theme.colors.textSecondary,
      marginHorizontal: 6,
    },
  });

  return (
    <View style={styles.metadata}>
      <Text style={styles.metadataText}>
        {type.toUpperCase()}
      </Text>
      <Text style={styles.separator}>•</Text>
      <Text style={styles.metadataText}>
        {formatFileSize(size)}
      </Text>
      <Text style={styles.separator}>•</Text>
      <Text style={styles.metadataText}>
        {formatDate(createdAt)}
      </Text>
    </View>
  );
};

export default DocumentCardMetadata;