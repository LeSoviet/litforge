import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Document } from '../types/Document';
import { getTheme, shadows } from '../theme/colors';
import { useFont } from '../contexts/FontContext';
import DocumentCardIcon from './DocumentCardIcon';
import DocumentCardMetadata from './DocumentCardMetadata';
import DocumentCardProgress from './DocumentCardProgress';
import DocumentCardLastOpened from './DocumentCardLastOpened';

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



  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.sm,
      padding: 12,
      marginVertical: 3,
      marginHorizontal: 0,
      ...shadows.small,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      marginLeft: 12,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
      lineHeight: 18,
      ...getFontStyle(),
    },
    rightSection: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      minWidth: 80,
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
        <DocumentCardIcon type={document.type} theme={theme} />
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {document.title}
          </Text>
          <DocumentCardMetadata
            type={document.type}
            size={document.size}
            createdAt={document.createdAt}
            theme={theme}
          />
        </View>
      </View>

      <View style={styles.rightSection}>
        <DocumentCardProgress progress={document.progress} theme={theme} />
        <DocumentCardLastOpened lastOpenedAt={document.lastOpenedAt} theme={theme} />
      </View>
    </TouchableOpacity>
  );
};

export default DocumentCard;