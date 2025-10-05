import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts';
import { DocumentService } from '../services/DocumentService';
import { Asset } from 'expo-asset';
import { useCommonStyles } from '../hooks/useCommonStyles';

// Mapeo de archivos .md usando require()
const storyAssets = {
  'A_Cry_for_Freedom.md': require('../stories/A_Cry_for_Freedom.md'),
  'Inherit_the_Wind.md': require('../stories/Inherit_the_Wind.md'),
  'Socialism_with_a_Human_Face.md': require('../stories/Socialism_with_a_Human_Face.md'),
  'The_Able_Archer_83_War_Scare.md': require('../stories/The_Able_Archer_83_War_Scare.md'),
  'The_Abolitionists_Voice.md': require('../stories/The_Abolitionists_Voice.md'),
  'The_Age_of_Discovery.md': require('../stories/The_Age_of_Discovery.md'),
  'The_Age_of_Smoke_and_Steam.md': require('../stories/The_Age_of_Smoke_and_Steam.md'),
  'The_Angel_of_Mons.md': require('../stories/The_Angel_of_Mons.md'),
  'The_Anti-Apartheid_Struggle.md': require('../stories/The_Anti-Apartheid_Struggle.md'),
  'The_Assassination_of_Julius_Caesar.md': require('../stories/The_Assassination_of_Julius_Caesar.md'),
  'The_Battle_of_Actium.md': require('../stories/The_Battle_of_Actium.md'),
  'The_Battle_of_Agincourt.md': require('../stories/The_Battle_of_Agincourt.md'),
  'The_Battle_of_Hastings.md': require('../stories/The_Battle_of_Hastings.md'),
  'The_Battle_of_Marathon.md': require('../stories/The_Battle_of_Marathon.md'),
  'The_Battle_of_Midway.md': require('../stories/The_Battle_of_Midway.md'),
  'The_Battle_of_Stalingrad.md': require('../stories/The_Battle_of_Stalingrad.md'),
  'The_Battle_of_the_Bulge.md': require('../stories/The_Battle_of_the_Bulge.md'),
  'The_Bear_Trap.md': require('../stories/The_Bear_Trap.md'),
  'The_Beat_Generations_Howl.md': require('../stories/The_Beat_Generations_Howl.md'),
  'The_Birth_of_Jazz.md': require('../stories/The_Birth_of_Jazz.md'),
  'The_Black_Deaths_Toll.md': require('../stories/The_Black_Deaths_Toll.md'),
  'The_Boudicas_Rebellion.md': require('../stories/The_Boudicas_Rebellion.md'),
  'The_Building_of_the_Parthenon.md': require('../stories/The_Building_of_the_Parthenon.md'),
  'The_Burning_of_the_Library_of_Alexandria.md': require('../stories/The_Burning_of_the_Library_of_Alexandria.md'),
  'The_Candy_Bomber_of_Berlin.md': require('../stories/The_Candy_Bomber_of_Berlin.md'),
  'The_Chernobyl_Meltdown.md': require('../stories/The_Chernobyl_Meltdown.md'),
  'The_Childrens_Crusade.md': require('../stories/The_Childrens_Crusade.md'),
  'The_Christmas_Truce.md': require('../stories/The_Christmas_Truce.md'),
  'The_City_of_Fire.md': require('../stories/The_City_of_Fire.md'),
  'The_City_of_God_The_City_of_Men.md': require('../stories/The_City_of_God_The_City_of_Men.md'),
  'The_Codebreakers_of_Bletchley_Park.md': require('../stories/The_Codebreakers_of_Bletchley_Park.md'),
  'The_Concrete_Curtain.md': require('../stories/The_Concrete_Curtain.md'),
  'The_Conquest_of_Granada.md': require('../stories/The_Conquest_of_Granada.md'),
  'The_Cracks_in_the_Wall.md': require('../stories/The_Cracks_in_the_Wall.md'),
  'The_Crimson_Ring.md': require('../stories/The_Crimson_Ring.md'),
  'The_Death_of_Stalin.md': require('../stories/The_Death_of_Stalin.md'),
  'The_Desert_Rats.md': require('../stories/The_Desert_Rats.md'),
  'The_Die_is_Cast.md': require('../stories/The_Die_is_Cast.md'),
  'The_Discovery_of_Penicillin.md': require('../stories/The_Discovery_of_Penicillin.md'),
  'The_Divided_House.md': require('../stories/The_Divided_House.md'),
  'The_Eagle_and_the_Asp.md': require('../stories/The_Eagle_and_the_Asp.md'),
  'The_End_of_the_War_in_Europe.md': require('../stories/The_End_of_the_War_in_Europe.md'),
  'The_Enlightenment_Salon.md': require('../stories/The_Enlightenment_Salon.md'),
  'The_Eruption_of_Vesuvius.md': require('../stories/The_Eruption_of_Vesuvius.md'),
  'The_Failed_Invasion.md': require('../stories/The_Failed_Invasion.md'),
  'The_Fall_of_Rome.md': require('../stories/The_Fall_of_Rome.md'),
  'The_Fall_of_the_Aztec_Empire.md': require('../stories/The_Fall_of_the_Aztec_Empire.md'),
  'The_Fall_of_the_Empire.md': require('../stories/The_Fall_of_the_Empire.md'),
  'The_First_Earth_Day.md': require('../stories/The_First_Earth_Day.md'),
  'The_First_Olympic_Games.md': require('../stories/The_First_Olympic_Games.md'),
  'The_Forgotten_War.md': require('../stories/The_Forgotten_War.md'),
  'The_French_Revolution_Reign_of_Terror.md': require('../stories/The_French_Revolution_Reign_of_Terror.md'),
  'The_Gallipoli_Campaign.md': require('../stories/The_Gallipoli_Campaign.md'),
  'The_Gladiators_Choice.md': require('../stories/The_Gladiators_Choice.md'),
  'The_Golden_Fever.md': require('../stories/The_Golden_Fever.md'),
  'The_Grapes_of_Dust.md': require('../stories/The_Grapes_of_Dust.md'),
  'The_Great_Escape.md': require('../stories/The_Great_Escape.md'),
  'The_Great_Pyramids_Secret.md': require('../stories/The_Great_Pyramids_Secret.md'),
  'The_Great_Schism.md': require('../stories/The_Great_Schism.md'),
  'The_Great_Walls_Shadow.md': require('../stories/The_Great_Walls_Shadow.md'),
  'The_Han_Dynastys_Silk_Road.md': require('../stories/The_Han_Dynastys_Silk_Road.md'),
  'The_Hanseatic_Leagues_Power.md': require('../stories/The_Hanseatic_Leagues_Power.md'),
  'The_Hundred_Years_War.md': require('../stories/The_Hundred_Years_War.md'),
  'The_Hunt_for_a_Traitor.md': require('../stories/The_Hunt_for_a_Traitor.md'),
  'The_Iran-Contra_Affair.md': require('../stories/The_Iran-Contra_Affair.md'),
  'The_Irish_Potato_Famine.md': require('../stories/The_Irish_Potato_Famine.md'),
  'The_Iron_Spine.md': require('../stories/The_Iron_Spine.md'),
  'The_Journey_of_Marco_Polo.md': require('../stories/The_Journey_of_Marco_Polo.md'),
  'The_Jungle_and_the_World.md': require('../stories/The_Jungle_and_the_World.md'),
  'The_Kitchen_Debate.md': require('../stories/The_Kitchen_Debate.md'),
  'The_Last_Empty_Sky.md': require('../stories/The_Last_Empty_Sky.md'),
  'The_Last_Horizon.md': require('../stories/The_Last_Horizon.md'),
  'The_Last_Pharaohs_Stand.md': require('../stories/The_Last_Pharaohs_Stand.md'),
  'The_Last_Sunset_on_the_Atlantic.md': require('../stories/The_Last_Sunset_on_the_Atlantic.md'),
  'The_Laws_of_Hammurabi.md': require('../stories/The_Laws_of_Hammurabi.md'),
  'The_Life_of_a_Medieval_Serf.md': require('../stories/The_Life_of_a_Medieval_Serf.md'),
  'The_Long_Walk_to_Dawn.md': require('../stories/The_Long_Walk_to_Dawn.md'),
  'The_Longest_Cemetery.md': require('../stories/The_Longest_Cemetery.md'),
  'The_Longest_Dawn.md': require('../stories/The_Longest_Dawn.md'),
  'The_Lost_Battalion.md': require('../stories/The_Lost_Battalion.md'),
  'The_Luddites_Rebellion.md': require('../stories/The_Luddites_Rebellion.md'),
  'The_Manhattan_Project.md': require('../stories/The_Manhattan_Project.md'),
  'The_March_on_Washington.md': require('../stories/The_March_on_Washington.md'),
  'The_Mongol_Invasion_of_Europe.md': require('../stories/The_Mongol_Invasion_of_Europe.md'),
  'The_Nuremberg_Trials.md': require('../stories/The_Nuremberg_Trials.md'),
  'The_Oracle_of_Delphis_Prophecy.md': require('../stories/The_Oracle_of_Delphis_Prophecy.md'),
  'The_Path_Between_the_Seas.md': require('../stories/The_Path_Between_the_Seas.md'),
  'The_Printing_Press_Revolution.md': require('../stories/The_Printing_Press_Revolution.md'),
  'The_Protestant_Reformation.md': require('../stories/The_Protestant_Reformation.md'),
  'The_Proxy_War.md': require('../stories/The_Proxy_War.md'),
  'The_Race_to_the_Moon.md': require('../stories/The_Race_to_the_Moon.md'),
  'The_Rape_of_Nanking.md': require('../stories/The_Rape_of_Nanking.md'),
  'The_Red_Barons_Last_Flight.md': require('../stories/The_Red_Barons_Last_Flight.md'),
  'The_Red_Dawn.md': require('../stories/The_Red_Dawn.md'),
  'The_Rise_of_the_First_Emperor.md': require('../stories/The_Rise_of_the_First_Emperor.md'),
  'The_Rise_of_the_Knights_Templar.md': require('../stories/The_Rise_of_the_Knights_Templar.md'),
  'The_Rise_of_the_Medici.md': require('../stories/The_Rise_of_the_Medici.md'),
  'The_Russian_Revolution.md': require('../stories/The_Russian_Revolution.md'),
  'The_Scopes_Monkey_Trial.md': require('../stories/The_Scopes_Monkey_Trial.md'),
  'The_Serpent_and_the_Sea.md': require('../stories/The_Serpent_and_the_Sea.md'),
  'The_Serpent_and_the_Sun.md': require('../stories/The_Serpent_and_the_Sun.md'),
  'The_Shadow_of_the_Guillotine.md': require('../stories/The_Shadow_of_the_Guillotine.md'),
  'The_Shattered_Cross.md': require('../stories/The_Shattered_Cross.md'),
  'The_Siege_of_Constantinople.md': require('../stories/The_Siege_of_Constantinople.md'),
  'The_Siege_of_Leningrad.md': require('../stories/The_Siege_of_Leningrad.md'),
  'The_Spanish_Inquisitions_Shadow.md': require('../stories/The_Spanish_Inquisitions_Shadow.md'),
  'The_Spartans_Last_Stand.md': require('../stories/The_Spartans_Last_Stand.md'),
  'The_Spy_in_the_Sky.md': require('../stories/The_Spy_in_the_Sky.md'),
  'The_Stasi_The_Eyes_and_Ears_of_the_Party.md': require('../stories/The_Stasi_The_Eyes_and_Ears_of_the_Party.md'),
  'The_Stonewall_Uprising.md': require('../stories/The_Stonewall_Uprising.md'),
  'The_Suffragettes_Sacrifice.md': require('../stories/The_Suffragettes_Sacrifice.md'),
  'The_Summer_of_Love.md': require('../stories/The_Summer_of_Love.md'),
  'The_Sun_Stone_and_the_Steel_Sword.md': require('../stories/The_Sun_Stone_and_the_Steel_Sword.md'),
  'The_Tiananmen_Square_Protests.md': require('../stories/The_Tiananmen_Square_Protests.md'),
  'The_Trial_of_Galileo.md': require('../stories/The_Trial_of_Galileo.md'),
  'The_Trial_of_Socrates.md': require('../stories/The_Trial_of_Socrates.md'),
  'The_Trojan_Horse.md': require('../stories/The_Trojan_Horse.md'),
  'The_Tunnels_of_Cu_Chi.md': require('../stories/The_Tunnels_of_Cu_Chi.md'),
  'The_Tuskegee_Airmen.md': require('../stories/The_Tuskegee_Airmen.md'),
  'The_Velvet_Revolution.md': require('../stories/The_Velvet_Revolution.md'),
  'The_Vikings_Saga.md': require('../stories/The_Vikings_Saga.md'),
  'The_Wall_of_Shame.md': require('../stories/The_Wall_of_Shame.md'),
  'The_Wars_of_the_Roses.md': require('../stories/The_Wars_of_the_Roses.md'),
  'The_Warsaw_Uprising.md': require('../stories/The_Warsaw_Uprising.md'),
  'The_Wolf_of_the_Waves.md': require('../stories/The_Wolf_of_the_Waves.md'),
  'The_Women_of_the_Resistance.md': require('../stories/The_Women_of_the_Resistance.md'),
  'The_World_Turned_Upside_Down.md': require('../stories/The_World_Turned_Upside_Down.md'),
  'The_Year_of_Three_Kings.md': require('../stories/The_Year_of_Three_Kings.md'),
  'Thirteen_Days_in_October.md': require('../stories/Thirteen_Days_in_October.md')
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
  const { theme, t } = useApp();
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