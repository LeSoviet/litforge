import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useFont } from '../contexts';

interface DocumentCardLastOpenedProps {
  lastOpenedAt?: string;
  theme: any;
}

const DocumentCardLastOpened: React.FC<DocumentCardLastOpenedProps> = ({
  lastOpenedAt,
  theme,
}) => {
  const { getFontStyle } = useFont();

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
    lastOpened: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      fontWeight: '400',
      marginTop: 4,
      ...getFontStyle(),
    },
  });

  if (!lastOpenedAt) return null;

  return (
    <Text style={styles.lastOpened}>
      Última lectura: {formatDate(lastOpenedAt)}
    </Text>
  );
};

export default DocumentCardLastOpened;