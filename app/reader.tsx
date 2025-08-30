import Markdown from '@cosmicmedia/react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useCommonStyles } from '../hooks/useCommonStyles';
import { DocumentService } from '../services/DocumentService';
import { Bookmark, Document, Note } from '../types/Document';

function ReaderScreen() {
  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const { theme } = useTheme();
  const { styles, staticStyles } = useCommonStyles();
  const router = useRouter();
  const { documentId, document: documentParam } = useLocalSearchParams();

  useEffect(() => {
    if (documentParam) {
      // Handle document passed as parameter (from stories)
      try {
        const parsedDoc = JSON.parse(documentParam as string);
        setDocument(parsedDoc);
        loadDocumentContentDirect(parsedDoc);
      } catch (error) {
        console.error('Error parsing document parameter:', error);
        setLoading(false);
      }
    } else if (documentId) {
      loadDocument(documentId as string);
    }
  }, [documentId, documentParam]);

  useEffect(() => {
    if (document && currentPage > 0) {
      updateProgress();
    }
  }, [currentPage, document]);

  const loadDocument = async (id: string) => {
    try {
      const doc = await DocumentService.getDocument(id);
      if (doc) {
        setDocument(doc);
        setBookmarks(doc.bookmarks || []);
        setNotes(doc.notes || []);
        await loadDocumentContent(doc);
      } else {
        Alert.alert('Error', 'Documento no encontrado');
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      Alert.alert('Error', 'No se pudo cargar el documento');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentContentDirect = async (doc: Document) => {
    try {
      setLoading(false);
      if (doc.type === 'md') {
        setContent((doc as any).content || '');
        // Calculate pages based on content length (approximate)
        const estimatedPages = Math.max(1, Math.ceil(((doc as any).content || '').length / 2000));
        setTotalPages(estimatedPages);
      }
    } catch (error) {
      console.error('Error loading document content:', error);
      setLoading(false);
    }
  };

  const loadDocumentContent = async (doc: Document) => {
    try {
      if (doc.type === 'pdf') {
        // For PDF files, we don't need to load content as react-native-pdf handles it
        setContent('');
        // For PDFs, use the document's totalPages or default to a reasonable estimate
        setTotalPages(doc.totalPages || 10);
      } else if (doc.type === 'md') {
        // First check if content is already stored in the document
        if ((doc as any).content && (doc as any).content.trim() !== '') {
          setContent((doc as any).content || '');
          // Calculate pages based on content length (approximate)
          const estimatedPages = Math.max(1, Math.ceil(((doc as any).content || '').length / 2000));
          setTotalPages(estimatedPages);
        } else {
          // Try to read the actual markdown file content
          if (doc.uri && doc.uri !== '') {
            try {
              const fileContent = await FileSystem.readAsStringAsync(doc.uri);
              setContent(fileContent);
              // Calculate pages based on content length (approximate)
              const estimatedPages = Math.max(1, Math.ceil(fileContent.length / 2000));
              setTotalPages(estimatedPages);
            } catch (fileError) {
              console.error('Error reading markdown file:', fileError);
              setContent('Error al leer el archivo markdown');
            }
          } else {
            // Fallback to demo content for sample documents
            const markdownContent = `# LitForge - Lector de Documentos

## Características Principales

**LitForge** es una aplicación moderna para la lectura de documentos PDF y Markdown con funcionalidades avanzadas:

### 📚 Soporte de Formatos
- **PDF**: Visualización nativa con navegación fluida
- **Markdown**: Renderizado completo con sintaxis resaltada
- **Importación**: Selección de archivos desde el dispositivo

### 🔖 Funcionalidades de Lectura
- **Marcadores**: Guarda páginas importantes
- **Notas**: Añade comentarios personalizados
- **Progreso**: Seguimiento automático de lectura
- **Navegación**: Controles intuitivos entre páginas

### 🎨 Interfaz de Usuario
- **Tema Azul Profundo**: Diseño moderno y elegante
- **Modo Oscuro/Claro**: Adaptación automática
- **Responsive**: Optimizado para diferentes tamaños de pantalla

## Ejemplo de Código

\`\`\`typescript
const loadDocument = async (id: string) => {
  try {
    const doc = await DocumentService.getDocument(id);
    setDocument(doc);
  } catch (error) {
    console.error('Error:', error);
  }
};
\`\`\`

## Lista de Tareas Completadas

- [x] Implementación de visor PDF
- [x] Renderizado de Markdown
- [x] Sistema de marcadores
- [x] Notas personalizadas
- [x] Seguimiento de progreso
- [x] Importación de archivos
- [x] Interfaz moderna
- [x] Modo oscuro/claro

## Próximas Mejoras

- [ ] Búsqueda en documentos
- [ ] Exportación de notas
- [ ] Sincronización en la nube
- [ ] Más formatos de archivo

## Información Técnica

**Tecnologías utilizadas:**
- React Native + Expo
- TypeScript
- react-native-pdf
- react-native-markdown-display

**Versión:** 1.0.0  
**Última actualización:** ${new Date().toLocaleDateString()}

---

*Desarrollado con ❤️ para mejorar tu experiencia de lectura*`;
            setContent(markdownContent);
            // Calculate pages for demo content
            const estimatedPages = Math.max(1, Math.ceil(markdownContent.length / 2000));
            setTotalPages(estimatedPages);
          }
        }
      } else {
        setContent('Tipo de archivo no soportado');
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent('Error al cargar el contenido');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async () => {
    if (!document) return;
    
    const progress = Math.round((currentPage / (document.totalPages || 1)) * 100);
    const updatedDoc = { ...document, progress };
    
    try {
      await DocumentService.updateDocument(updatedDoc);
      setDocument(updatedDoc);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const toggleBookmark = async () => {
    if (!document) return;

    const existingBookmark = bookmarks.find(b => b.page === currentPage);
    let newBookmarks: Bookmark[];
    let message: string;

    if (existingBookmark) {
      // Remove bookmark
      newBookmarks = bookmarks.filter(b => b.page !== currentPage);
      message = 'Marcador eliminado';
    } else {
      // Add bookmark
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        page: currentPage,
        title: `Página ${currentPage}`,
        dateCreated: new Date(),
      };
      newBookmarks = [...bookmarks, newBookmark];
      message = 'Marcador agregado';
    }

    setBookmarks(newBookmarks);
    
    const updatedDoc = { ...document, bookmarks: newBookmarks };
    try {
      await DocumentService.updateDocument(updatedDoc);
      setDocument(updatedDoc);
    } catch (error) {
      console.error('Error updating bookmarks:', error);
      Alert.alert('Error', 'No se pudo actualizar el marcador');
    }
  };

  const addNote = async () => {
    if (!document || !noteText.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      page: currentPage,
      text: noteText.trim(),
      selectedText: selectedText,
      dateCreated: new Date(),
    };

    const newNotes = [...notes, newNote];
    setNotes(newNotes);
    setNoteText('');
    setSelectedText('');
    setShowNoteModal(false);

    const updatedDoc = { ...document, notes: newNotes };
    try {
      await DocumentService.updateDocument(updatedDoc);
      setDocument(updatedDoc);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const removeNote = async (noteId: string) => {
    if (!document) return;

    const newNotes = notes.filter(n => n.id !== noteId);
    setNotes(newNotes);

    const updatedDoc = { ...document, notes: newNotes };
    try {
      await DocumentService.updateDocument(updatedDoc);
      setDocument(updatedDoc);
    } catch (error) {
      console.error('Error removing note:', error);
    }
  };

  const goBack = () => {
    router.push('/');
  };

  const isBookmarked = bookmarks.some(b => b.page === currentPage);
  const currentPageNotes = notes.filter(n => n.page === currentPage);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Cargando documento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!document) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centerContainer}>
          <Text style={[styles.text, { color: theme.colors.error }]}>Documento no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const contentHeight = contentSize.height;
    const screenHeight = layoutMeasurement.height;
    
    // Calculate current page based on scroll position
    const scrollProgress = scrollY / (contentHeight - screenHeight);
    const calculatedPage = Math.max(1, Math.min(totalPages, Math.ceil(scrollProgress * totalPages) || 1));
    
    if (calculatedPage !== currentPage) {
      setCurrentPage(calculatedPage);
    }
    
    setScrollPosition(scrollY);
  };

  const renderContent = () => {
    if (document?.type === 'pdf') {
      return (
        <View style={styles.container}>
          <View style={styles.centerContainer}>
            <Ionicons name="document-text" size={64} color={theme.colors.text} />
            <Text style={[styles.title, staticStyles.marginTop16]}>PDF Viewer</Text>
            <Text style={[styles.textSecondary, staticStyles.textCenter]}>
              {document.title}
            </Text>
            <Text style={[styles.textSecondary, staticStyles.textCenter]}>
              PDF viewing is temporarily unavailable
            </Text>
          </View>
        </View>
      );
    } else if (document?.type === 'md') {
      return (
        <ScrollView 
          style={[styles.container, staticStyles.padding16]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Markdown
            style={{
              body: {
                color: theme.colors.text,
                fontSize: 16,
                lineHeight: 24,
              },
              heading1: {
                color: theme.colors.text,
                fontSize: 28,
                fontWeight: 'bold',
                marginBottom: 16,
              },
              heading2: {
                color: theme.colors.text,
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 12,
              },
              heading3: {
                color: theme.colors.text,
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 8,
              },
              paragraph: {
                color: theme.colors.text,
                fontSize: 16,
                lineHeight: 24,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottomWidth: 0.5,
                borderBottomColor: theme.colors.border + '30', // Semi-transparent
              },
              code_inline: {
                backgroundColor: theme.colors.surface,
                color: theme.colors.primary,
                padding: 4,
                borderRadius: 4,
                fontFamily: 'monospace',
              },
              code_block: {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                padding: 12,
                borderRadius: 8,
                fontFamily: 'monospace',
                marginBottom: 12,
              },
              list_item: {
                color: theme.colors.text,
                fontSize: 16,
                lineHeight: 24,
              },
              strong: {
                color: theme.colors.text,
                fontWeight: 'bold',
              },
              em: {
                color: theme.colors.text,
                fontStyle: 'italic',
              },
            }}
          >
            {content}
          </Markdown>
        </ScrollView>
      );
    } else if (document?.type === 'doc' || document?.type === 'docx') {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="document" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.title, staticStyles.marginTop16]}>
            Archivo de Word
          </Text>
          <Text style={[styles.textSecondary, staticStyles.textCenter, staticStyles.paddingHorizontal20]}>
            Los archivos DOC/DOCX requieren una biblioteca especializada para su visualización. Próximamente disponible.
          </Text>
        </View>
      );
    } else if (document?.type === 'xls' || document?.type === 'xlsx') {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="grid" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.title, staticStyles.marginTop16]}>
            Archivo de Excel
          </Text>
          <Text style={[styles.textSecondary, staticStyles.textCenter, staticStyles.paddingHorizontal20]}>
            Los archivos XLS/XLSX requieren una biblioteca especializada para su visualización. Próximamente disponible.
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="document" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.title, staticStyles.marginTop16]}>
            Tipo de archivo no soportado
          </Text>
          <Text style={[styles.textSecondary, staticStyles.textCenter, staticStyles.paddingHorizontal20]}>
            Este tipo de archivo ({document?.type}) no es compatible con el visor actual.
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 16, paddingVertical: 12, marginTop: 8 }]}>
        {/* Fila única: Botón atrás, indicador de páginas centrado, e iconos */}
        <View style={[staticStyles.flexRow, staticStyles.alignCenter, staticStyles.justifySpaceBetween]}>
          <TouchableOpacity onPress={goBack} style={[styles.iconButton, { padding: 8, minWidth: 32, minHeight: 32 }]}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          
          {/* Indicador de páginas centrado */}
           <View style={[{ backgroundColor: theme.colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }]}>
             <Text style={[{ fontSize: 14, fontWeight: '600', color: theme.colors.text }]}>
               Página {currentPage} de {totalPages}
             </Text>
           </View>
          
          {/* Iconos marcador y nota - extremo derecho */}
          <View style={[staticStyles.flexRow, { gap: 8 }]}>
            <TouchableOpacity onPress={toggleBookmark} style={[styles.iconButton, { padding: 8, minWidth: 32, minHeight: 32 }]}>
              <Ionicons 
                name={isBookmarked ? "bookmarks" : "bookmarks-outline"} 
                size={20} 
                color={isBookmarked ? theme.colors.primary : theme.colors.text} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setShowNoteModal(true)} 
              style={[styles.iconButton, { padding: 8, minWidth: 32, minHeight: 32 }]}
            >
              <Ionicons name="create" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={staticStyles.flex1}>
        {renderContent()}
        
        {/* Notes for current page */}
        {currentPageNotes.length > 0 && (
          <View style={[staticStyles.marginTop24, staticStyles.paddingTop16, { borderTopWidth: 1, borderTopColor: theme.colors.border }]}>
            <Text style={[styles.subtitle, staticStyles.marginBottom12]}>Notas de esta página:</Text>
            {currentPageNotes.map((note) => (
              <View key={note.id} style={[styles.card, staticStyles.marginBottom8]}>
                {note.selectedText && (
                  <Text style={[styles.textSecondary, { fontSize: 14, fontStyle: 'italic', marginBottom: 4 }]}>"{note.selectedText}"</Text>
                )}
                <Text style={[styles.text, { fontSize: 14, marginBottom: 8 }]}>{note.text}</Text>
                <View style={[staticStyles.flexRow, staticStyles.justifySpaceBetween, staticStyles.alignCenter]}>
                  <Text style={[styles.textSecondary, { fontSize: 12 }]}>
                    {note.dateCreated?.toLocaleDateString() || note.createdAt}
                  </Text>
                  <TouchableOpacity onPress={() => removeNote(note.id)}>
                    <Ionicons name="remove" size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Note Modal */}
      <Modal
        visible={showNoteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNoteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { width: '90%', maxWidth: 400 }]}>
            <Text style={[styles.title, { fontSize: 18, textAlign: 'center', marginBottom: 16 }]}>Agregar Nota</Text>
            
            <TextInput
              style={[styles.input, { minHeight: 100, textAlignVertical: 'top', marginBottom: 16 }]}
              placeholder="Escribe tu nota aquí..."
              placeholderTextColor={theme.colors.textSecondary}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
            />

            <View style={[staticStyles.flexRow, staticStyles.justifySpaceBetween]}>
              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary, { flex: 1, marginRight: 8 }]} 
                onPress={() => setShowNoteModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.buttonPrimary, { flex: 1, marginLeft: 8 }]} 
                onPress={addNote}
              >
                <Text style={styles.buttonPrimaryText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}



export default ReaderScreen;