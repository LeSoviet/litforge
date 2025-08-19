import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DocumentService } from '../../services/DocumentService';
import { Document } from '../../types/Document';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LibraryScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'date'>('date');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'md'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(theme);
  const router = useRouter();

  useEffect(() => {
    loadDocuments();
    // Añadir algunos documentos de ejemplo si no hay ninguno
    addSampleDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await DocumentService.getAllDocuments();
      setDocuments(docs);
      applyFiltersAndSort(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFiltersAndSort = (docs: Document[]) => {
    let filtered = docs;
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = docs.filter(doc => doc.type === filterType);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          const dateA = new Date(a.dateAdded || a.createdAt).getTime();
          const dateB = new Date(b.dateAdded || b.createdAt).getTime();
          return dateB - dateA; // Most recent first
      }
    });
    
    setFilteredDocuments(filtered);
  };

  useEffect(() => {
    if (documents.length > 0) {
      applyFiltersAndSort(documents);
    }
  }, [sortBy, filterType, documents]);

  const clearAllDocuments = async () => {
    try {
      await AsyncStorage.removeItem('@litforge_documents');
      console.log('All documents cleared from storage');
    } catch (error) {
      console.error('Error clearing documents:', error);
    }
  };

  const addSampleDocuments = async () => {
    try {
      // Clear existing documents first
      await clearAllDocuments();
      
      const sampleDocs: Document[] = [
        {
          id: '1',
          title: 'Guía de React Native',
          size: 2048000,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          uri: '',
          filePath: '',
          type: 'pdf',
          dateAdded: new Date(Date.now() - 86400000), // Ayer
          progress: 3,
          totalPages: 10,
          bookmarks: [],
          notes: [],
        },
      ];

      for (const doc of sampleDocs) {
        await DocumentService.addDocument(doc);
      }
      await loadDocuments();
    } catch (error) {
      console.error('Error adding sample documents:', error);
    }
  };

  const pickDocument = async () => {
    if (importing) return;
    
    setImporting(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'text/markdown',
          'text/plain',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        // Crear directorio para documentos si no existe
        const documentsDir = `${FileSystem.documentDirectory}documents/`;
        await FileSystem.makeDirectoryAsync(documentsDir, { intermediates: true });
        
        // Copiar archivo al directorio de documentos
        const fileName = file.name || `document_${Date.now()}`;
        const localPath = `${documentsDir}${fileName}`;
        await FileSystem.copyAsync({
          from: file.uri,
          to: localPath,
        });

        const document: Document = {
          id: Date.now().toString(),
          title: fileName,
          size: file.size || 0,
          createdAt: new Date().toISOString(),
          uri: file.uri,
          filePath: localPath,
          type: getDocumentType(file.mimeType || '', fileName),
          dateAdded: new Date(),
          progress: 0,
          totalPages: file.size ? Math.ceil(file.size / 1000) : 1, // Estimación básica
          bookmarks: [],
          notes: [],
        };

        await DocumentService.addDocument(document);
        await loadDocuments();
        
        Alert.alert(
          'Documento importado',
          `${fileName} se ha añadido a tu biblioteca`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'No se pudo importar el documento');
    } finally {
      setImporting(false);
    }
  };

  const getDocumentType = (mimeType: string, fileName: string): Document['type'] => {
    if (mimeType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('officedocument') || fileName.toLowerCase().endsWith('.docx')) return 'docx';
    if (fileName.toLowerCase().endsWith('.doc')) return 'doc';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || fileName.toLowerCase().endsWith('.xlsx')) return 'xlsx';
    if (fileName.toLowerCase().endsWith('.xls')) return 'xls';
    if (fileName.toLowerCase().endsWith('.md') || fileName.toLowerCase().endsWith('.markdown')) return 'md';
    return 'md'; // Default to markdown for text files
  };

  const openDocument = (document: Document) => {
    router.push({
      pathname: '/reader',
      params: { documentId: document.id }
    });
  };

  const deleteDocument = async (documentId: string) => {
    Alert.alert(
      'Eliminar documento',
      '¿Estás seguro de que quieres eliminar este documento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await DocumentService.removeDocument(documentId);
              await loadDocuments();
            } catch (error) {
              console.error('Error deleting document:', error);
              Alert.alert('Error', 'No se pudo eliminar el documento');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDocuments();
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'document-text';
      case 'md':
        return 'logo-markdown';
      case 'doc':
      case 'docx':
        return 'document';
      case 'xls':
      case 'xlsx':
        return 'grid';
      default:
        return 'document-outline';
    }
  };

  const renderDocument = ({ item }: { item: Document }) => (
    <TouchableOpacity
      style={styles.documentItem}
      onPress={() => openDocument(item)}
      activeOpacity={0.7}
    >
      <View style={styles.documentIcon}>
        <Ionicons
          name={getDocumentIcon(item.type)}
          size={28}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.documentMeta}>
          {item.type.toUpperCase()} • {(() => {
                  try {
                    if (item.dateAdded && typeof item.dateAdded === 'object' && item.dateAdded instanceof Date) {
                      return item.dateAdded.toLocaleDateString();
                    } else if (item.dateAdded && typeof item.dateAdded === 'string') {
                      return new Date(item.dateAdded).toLocaleDateString();
                    } else {
                      return new Date(item.createdAt).toLocaleDateString();
                    }
                  } catch (error) {
                    console.error('Date formatting error:', error, 'dateAdded:', item.dateAdded, 'type:', typeof item.dateAdded);
                    return new Date(item.createdAt).toLocaleDateString();
                  }
                })()}
        </Text>
        {(item.totalPages || 0) > 0 && item.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min((item.progress / (item.totalPages || 1)) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(Math.min((item.progress / (item.totalPages || 1)) * 100, 100))}%
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          deleteDocument(item.id);
        }}
      >
        <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="library-outline" size={64} color={theme.colors.textSecondary} />
      <Text style={styles.emptyTitle}>{t('library.empty.title')}</Text>
      <Text style={styles.emptyText}>
        {t('library.empty.subtitle')}
      </Text>
      <TouchableOpacity
        style={styles.importButton}
        onPress={pickDocument}
        disabled={importing}
      >
        {importing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.importButtonText}>{t('library.import')}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('library.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('library.title')}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.storiesButton}
            onPress={() => router.push('/stories')}
          >
            <Ionicons name="book" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={pickDocument}
            disabled={importing}
          >
            {importing ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Ionicons name="add" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Ordenar por:</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[styles.filterChip, sortBy === 'date' && styles.filterChipActive]}
                onPress={() => setSortBy('date')}
              >
                <Text style={[styles.filterChipText, sortBy === 'date' && styles.filterChipTextActive]}>Fecha</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, sortBy === 'name' && styles.filterChipActive]}
                onPress={() => setSortBy('name')}
              >
                <Text style={[styles.filterChipText, sortBy === 'name' && styles.filterChipTextActive]}>Nombre</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, sortBy === 'type' && styles.filterChipActive]}
                onPress={() => setSortBy('type')}
              >
                <Text style={[styles.filterChipText, sortBy === 'type' && styles.filterChipTextActive]}>Tipo</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Filtrar por tipo:</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
                onPress={() => setFilterType('all')}
              >
                <Text style={[styles.filterChipText, filterType === 'all' && styles.filterChipTextActive]}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, filterType === 'pdf' && styles.filterChipActive]}
                onPress={() => setFilterType('pdf')}
              >
                <Text style={[styles.filterChipText, filterType === 'pdf' && styles.filterChipTextActive]}>PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, filterType === 'md' && styles.filterChipActive]}
                onPress={() => setFilterType('md')}
              >
                <Text style={[styles.filterChipText, filterType === 'md' && styles.filterChipTextActive]}>Markdown</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Documents List */}
      <FlatList
        data={filteredDocuments}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredDocuments.length === 0 ? styles.emptyListContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.text,
    fontSize: 16,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    marginHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storiesButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 12,
  },
  filterButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filtersContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  importButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: `0px 4px 8px ${theme.colors.shadow}33`,
    elevation: 5,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyListContainer: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${theme.colors.shadow}14`,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  documentMeta: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.primary,
    minWidth: 35,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
  },
});
