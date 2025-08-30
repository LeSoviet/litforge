import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCommonStyles } from '../../hooks/useCommonStyles';
import { DocumentService } from '../../services/DocumentService';
import { Document } from '../../types/Document';

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
  const { styles, staticStyles } = useCommonStyles();
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
          id: 'sample_1',
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
          id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
      style={styles.card}
      onPress={() => openDocument(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { marginRight: 16 }]}>
        <Ionicons
          name={getDocumentIcon(item.type)}
          size={28}
          color={theme.colors.primary}
        />
      </View>
      <View style={staticStyles.flex1}>
        <Text style={[styles.text.title, { marginBottom: 4 }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.text.caption, { marginBottom: 8 }]}>
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
          <View style={[styles.layout.row, { alignItems: 'center' }]}>
            <View style={[staticStyles.flex1, { height: 6, backgroundColor: theme.colors.border, borderRadius: 3, marginRight: 12 }]}>
              <View
                style={[
                  { height: '100%', backgroundColor: theme.colors.primary, borderRadius: 3 },
                  { width: `${Math.min((item.progress / (item.totalPages || 1)) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={[styles.text.caption, { color: theme.colors.primary, minWidth: 35, fontWeight: '600' }]}>
              {Math.round(Math.min((item.progress / (item.totalPages || 1)) * 100, 100))}%
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[styles.spacing.padding.sm, { borderRadius: 8 }]}
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
    <View style={styles.emptyState.container}>
      <Ionicons name="library-outline" size={64} color={theme.colors.textSecondary} />
      <Text style={styles.emptyState.title}>{t('library.empty.title')}</Text>
      <Text style={styles.emptyState.subtitle}>
        {t('library.empty.subtitle')}
      </Text>
      <View style={styles.layout.row}>
        <TouchableOpacity
          style={[styles.button.primary, { marginRight: 12 }]}
          onPress={pickDocument}
          disabled={importing}
        >
          {importing ? (
            <ActivityIndicator size="small" color={theme.colors.background} />
          ) : (
            <>
              <Ionicons name="folder-open" size={20} color={theme.colors.background} />
              <Text style={styles.button.primaryText}>{t('library.import')}</Text>
            </>
          )}
        </TouchableOpacity>
        

      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container.main}>
        <View style={styles.container.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.text.body, styles.spacing.margin.topMd]}>{t('library.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container.main}>
      {/* Header */}
      <View style={[styles.header.container, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.header.title}>{t('library.title')}</Text>
        <View style={[styles.layout.row, { alignItems: 'center' }]}>
          <TouchableOpacity
            style={[styles.button.icon, styles.spacing.margin.rightMd]}
            onPress={() => router.push('/stories')}
          >
            <Ionicons name="book" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button.icon, styles.spacing.margin.rightMd]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button.icon}
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
        <View style={[styles.container.surface, styles.spacing.padding.sm, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
          <View style={styles.spacing.margin.bottomXs}>
            <Text style={[styles.text.label, styles.spacing.margin.bottomXs]}>Sort by:</Text>
            <View style={[styles.layout.row, { flexWrap: 'wrap' }]}>
              <TouchableOpacity
                style={[styles.input.chip, sortBy === 'date' && styles.input.chipActive]}
                onPress={() => {
                  setSortBy('date');
                  setTimeout(() => setShowFilters(false), 500);
                }}
              >
                <Text style={[styles.input.chipText, sortBy === 'date' && styles.input.chipTextActive]}>Date</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.input.chip, sortBy === 'name' && styles.input.chipActive]}
                onPress={() => {
                  setSortBy('name');
                  setTimeout(() => setShowFilters(false), 500);
                }}
              >
                <Text style={[styles.input.chipText, sortBy === 'name' && styles.input.chipTextActive]}>Name</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.input.chip, sortBy === 'type' && styles.input.chipActive]}
                onPress={() => {
                  setSortBy('type');
                  setTimeout(() => setShowFilters(false), 500);
                }}
              >
                <Text style={[styles.input.chipText, sortBy === 'type' && styles.input.chipTextActive]}>Type</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={[styles.text.label, styles.spacing.margin.bottomXs]}>Filter by type:</Text>
            <View style={[styles.layout.row, { flexWrap: 'wrap' }]}>
              <TouchableOpacity
                style={[styles.input.chip, filterType === 'all' && styles.input.chipActive]}
                onPress={() => {
                  setFilterType('all');
                  setTimeout(() => setShowFilters(false), 500);
                }}
              >
                <Text style={[styles.input.chipText, filterType === 'all' && styles.input.chipTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.input.chip, filterType === 'pdf' && styles.input.chipActive]}
                onPress={() => {
                  setFilterType('pdf');
                  setTimeout(() => setShowFilters(false), 500);
                }}
              >
                <Text style={[styles.input.chipText, filterType === 'pdf' && styles.input.chipTextActive]}>PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.input.chip, filterType === 'md' && styles.input.chipActive]}
                onPress={() => {
                  setFilterType('md');
                  setTimeout(() => setShowFilters(false), 500);
                }}
              >
                <Text style={[styles.input.chipText, filterType === 'md' && styles.input.chipTextActive]}>Markdown</Text>
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
