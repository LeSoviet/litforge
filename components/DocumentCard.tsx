import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Document } from '../types/Document';
import { colors, getTheme, shadows } from '../theme/colors';
import { useFont } from '../contexts/FontContext';

interface DocumentCardProps {
  document: Document;
  onPress: (document: Document) => void;
  onLongPress?: (document: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onLongPress,
}) => {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme === 'dark');
  const { getFontStyle } = useFont();

  // Get icon based on document type
  const getDocumentIcon = (type: Document['type']): string => {
    switch (type) {
      case 'pdf':
        return 'document-text';
      case 'doc':
      case 'docx':
        return 'document';
      case 'md':
        return 'logo-markdown';
      case 'xls':
      case 'xlsx':
        return 'grid';
      default:
        return 'document-outline';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Format date
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

  // Get progress color
  const getProgressColor = (progress: number): string => {
    if (progress >= 0.95) return theme.colors.success;
    if (progress >= 0.5) return theme.colors.warning;
    return theme.colors.primary;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: 16,
      marginVertical: 6,
      marginHorizontal: 16,
      ...shadows.small,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    contentContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
      lineHeight: 20,
      ...getFontStyle(),
    },
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
    lastOpened: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        fontWeight: '400',
        marginTop: 4,
        ...getFontStyle(),
      },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(document)}
      onLongPress={() => onLongPress?.(document)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={getDocumentIcon(document.type) as any}
            size={20}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {document.title}
          </Text>
          <View style={styles.metadata}>
            <Text style={styles.metadataText}>
              {document.type.toUpperCase()}
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.metadataText}>
              {formatFileSize(document.size)}
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.metadataText}>
              {formatDate(document.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {document.progress > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressLabel}>
            <Text style={styles.progressText}>Progreso de lectura</Text>
            <Text style={styles.progressPercentage}>
              {Math.round(document.progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${document.progress * 100}%`,
                  backgroundColor: getProgressColor(document.progress),
                },
              ]}
            />
          </View>
        </View>
      )}

      {document.lastOpenedAt && (
        <Text style={styles.lastOpened}>
          Última lectura: {formatDate(document.lastOpenedAt)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default DocumentCard;