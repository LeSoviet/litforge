import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCommonStyles } from '../hooks/useCommonStyles';
import { DocumentService } from '../services/DocumentService';

// Mapeo de archivos .md usando require()
const storyAssets = {
  '100_stories_plan.md': require('../stories/100_stories_plan.md'),
  'A_Cry_for_Freedom.md': require('../stories/A_Cry_for_Freedom.md'),
  'Inherit_the_Wind.md': require('../stories/Inherit_the_Wind.md'),
  'README.md': require('../stories/README.md'),
  'Socialism_with_a_Human_Face.md': require('../stories/Socialism_with_a_Human_Face.md'),
  'The_Able_Archer_83_War_Scare.md': require('../stories/The_Able_Archer_83_War_Scare.md'),
  'The_Abolitionists_Voice.md': require('../stories/The_Abolitionists_Voice.md'),
  'The_Age_of_Discovery.md': require('../stories/The_Age_of_Discovery.md'),
  'The_Age_of_Smoke_and_Steam.md': require('../stories/The_Age_of_Smoke_and_Steam.md'),
  'The_Angel_of_Mons.md': require('../stories/The_Angel_of_Mons.md'),
};

interface Story {
  id: string;
  title: string;
  fileName: string;
  asset: any;
  content?: string;
}

export default function StoriesScreen() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const { styles, staticStyles } = useCommonStyles();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      
      // Lista de archivos de historias usando el mapeo de assets
      const storyFiles = Object.keys(storyAssets);

      const storyList: Story[] = storyFiles.map((fileName, index) => ({
        id: `story-${index}`,
        title: fileName.replace('.md', '').replace(/_/g, ' '),
        fileName,
        asset: Asset.fromModule((storyAssets as Record<string, any>)[fileName]),
      }));

      setStories(storyList);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryPress = async (story: Story) => {
    try {
      // Registrar el archivo .md como documento en DocumentService usando el asset
      await DocumentService.addStoryDocumentFromAsset(story.id, story.title, story.asset);
      
      // Navegar al reader pasando el documentId
      router.push({
        pathname: '/reader',
        params: { documentId: story.id }
      });
    } catch (error) {
      console.error('Error al abrir la historia:', error);
    }
  };

  const renderStory = ({ item }: { item: Story }) => (
    <TouchableOpacity
      style={[styles.card, staticStyles.marginBottomMedium]}
      onPress={() => handleStoryPress(item)}
    >
      <View style={[styles.iconContainer, staticStyles.marginRightMedium]}>
        <Ionicons name="book" size={24} color={theme.colors.primary} />
      </View>
      <View style={staticStyles.flex1}>
        <Text style={[styles.cardTitle, staticStyles.marginBottomSmall]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.textSecondary}>{t('stories.freeStory')}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.textSecondary, staticStyles.marginTopMedium]}>{t('stories.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.subtitle, staticStyles.textCenter, staticStyles.marginVerticalMedium]}>
          {t('stories.subtitle')}
        </Text>
        
        <FlatList
          data={stories}
          renderItem={renderStory}
          keyExtractor={item => item.id}
          contentContainerStyle={staticStyles.paddingBottomLarge}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}