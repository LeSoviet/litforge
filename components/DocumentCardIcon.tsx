import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Document } from '../types/Document';

interface DocumentCardIconProps {
  type: Document['type'];
  theme: any;
}

const DocumentCardIcon: React.FC<DocumentCardIconProps> = ({ type, theme }) => {
  const getDocumentIcon = (docType: Document['type']): string => {
    switch (docType) {
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

  const styles = StyleSheet.create({
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
  });

  return (
    <View style={styles.iconContainer}>
      <Ionicons
        name={getDocumentIcon(type) as any}
        size={20}
        color={theme.colors.primary}
      />
    </View>
  );
};

export default DocumentCardIcon;