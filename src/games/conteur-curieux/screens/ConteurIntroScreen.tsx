/**
 * ConteurIntroScreen Component
 *
 * Écran d'introduction et sélection d'histoire pour Le Conteur Curieux
 * - Liste des histoires avec filtres par thème
 * - Plume la mascotte avec bulle de dialogue
 * - Modal de sélection du mode de lecture
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  useWindowDimensions,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily } from '@/theme';
import { useAccessibilityAnimations } from '@/hooks';

import { PlumeMascot } from '../components/PlumeMascot';
import { StoryCard } from '../components/StoryCard';
import { FilterTabs } from '../components/FilterTabs';
import { ModeSelectionModal } from '../components/ModeSelectionModal';
import { getAllLevels, getLevelsByTheme } from '../data/stories';
import type { ConteurLevel, ReadingMode, StoryTheme } from '../types';

// Messages de Plume pour l'écran d'intro
const PLUME_INTRO_MESSAGES = [
  'Bienvenue dans ma bibliothèque ! Choisis une histoire !',
  'Chaque histoire est une nouvelle aventure !',
  'Je suis Plume, ton guide de lecture !',
  'Prêt à découvrir de belles histoires ?',
];

interface ConteurIntroScreenProps {
  onStartStory?: (level: ConteurLevel, mode: ReadingMode) => void;
}

export function ConteurIntroScreen({ onStartStory }: ConteurIntroScreenProps) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  // État
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<ConteurLevel | null>(null);
  const [selectedMode, setSelectedMode] = useState<ReadingMode>('mixed');
  const [showModeModal, setShowModeModal] = useState(false);

  // Responsive
  const isTablet = width >= 768;
  const isLandscape = width > height;
  const numColumns = isTablet ? (isLandscape ? 4 : 3) : 2;

  // Messages aléatoire de Plume
  const plumeMessage = useMemo(() => {
    return PLUME_INTRO_MESSAGES[Math.floor(Math.random() * PLUME_INTRO_MESSAGES.length)];
  }, []);

  // Filtrer les histoires
  const levels = useMemo(() => {
    if (selectedTheme === 'all') {
      return getAllLevels();
    }
    return getLevelsByTheme(selectedTheme);
  }, [selectedTheme]);

  // Handlers
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const handleSelectTheme = useCallback((theme: StoryTheme | 'all') => {
    Haptics.selectionAsync();
    setSelectedTheme(theme);
  }, []);

  const handleSelectStory = useCallback((level: ConteurLevel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedLevel(level);
    setShowModeModal(true);
  }, []);

  const handleSelectMode = useCallback((mode: ReadingMode) => {
    setSelectedMode(mode);
  }, []);

  const handleStartStory = useCallback(() => {
    if (!selectedLevel) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowModeModal(false);

    if (onStartStory) {
      onStartStory(selectedLevel, selectedMode);
    } else {
      // Navigation vers l'écran de lecture
      router.push({
        pathname: '/(games)/conteur-curieux/story',
        params: {
          levelId: selectedLevel.id,
          mode: selectedMode,
        },
      });
    }
  }, [selectedLevel, selectedMode, onStartStory, router]);

  const handleCloseModal = useCallback(() => {
    setShowModeModal(false);
    setSelectedLevel(null);
  }, []);

  // Render story card
  const renderStoryCard = useCallback(
    ({ item, index }: ListRenderItemInfo<ConteurLevel>) => {
      // TODO: Récupérer le vrai statut depuis le storage
      const isCompleted = false;
      const stars = 0;

      return (
        <Animated.View
          entering={shouldAnimate ? FadeInUp.delay(index * 50).duration(getDuration(300)) : undefined}
          style={styles.cardWrapper}
        >
          <StoryCard
            level={item}
            onPress={handleSelectStory}
            isCompleted={isCompleted}
            stars={stars}
          />
        </Animated.View>
      );
    },
    [shouldAnimate, getDuration, handleSelectStory]
  );

  // Key extractor
  const keyExtractor = useCallback((item: ConteurLevel) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View
        style={styles.header}
        entering={shouldAnimate ? FadeIn.duration(getDuration(300)) : undefined}
      >
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>{'<'} Retour</Text>
        </Pressable>

        <Text style={styles.title}>Le Conteur Curieux</Text>

        <View style={styles.headerRight}>
          {/* Placeholder pour bouton parent/paramètres */}
        </View>
      </Animated.View>

      {/* Main content */}
      <View style={[styles.content, isTablet && isLandscape && styles.contentLandscape]}>
        {/* Plume mascot (côté gauche sur tablet landscape) */}
        {isTablet && isLandscape && (
          <Animated.View
            style={styles.plumeContainer}
            entering={shouldAnimate ? FadeInRight.duration(getDuration(400)) : undefined}
          >
            <PlumeMascot
              expression="happy"
              size="large"
              message={plumeMessage}
              showBubble
              bubblePosition="right"
            />
          </Animated.View>
        )}

        {/* Stories list */}
        <View style={styles.storiesSection}>
          {/* Plume compact (sur mobile ou tablet portrait) */}
          {(!isTablet || !isLandscape) && (
            <Animated.View
              style={styles.plumeCompact}
              entering={shouldAnimate ? FadeInUp.duration(getDuration(300)) : undefined}
            >
              <PlumeMascot
                expression="happy"
                size="small"
                message={plumeMessage}
                showBubble
                bubblePosition="top"
              />
            </Animated.View>
          )}

          {/* Filter tabs */}
          <FilterTabs
            selectedTheme={selectedTheme}
            onSelectTheme={handleSelectTheme}
          />

          {/* Stories grid */}
          <FlatList
            data={levels}
            renderItem={renderStoryCard}
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            key={`grid-${numColumns}`}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📚</Text>
                <Text style={styles.emptyText}>
                  Aucune histoire dans ce thème pour l'instant !
                </Text>
              </View>
            }
          />
        </View>
      </View>

      {/* Mode selection modal */}
      <ModeSelectionModal
        visible={showModeModal}
        level={selectedLevel}
        selectedMode={selectedMode}
        onSelectMode={handleSelectMode}
        onStart={handleStartStory}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0', // Warm library background
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[2],
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary.main,
    fontFamily: fontFamily.medium,
  },
  title: {
    fontSize: 20,
    fontFamily: fontFamily.displayBold,
    color: '#9B59B6', // Purple theme
  },
  headerRight: {
    width: 80, // Balance with back button
  },

  // Content
  content: {
    flex: 1,
  },
  contentLandscape: {
    flexDirection: 'row',
  },

  // Plume section (tablet landscape)
  plumeContainer: {
    width: 280,
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(155,89,182,0.05)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(155,89,182,0.1)',
  },

  // Plume compact (mobile/portrait)
  plumeCompact: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },

  // Stories section
  storiesSection: {
    flex: 1,
  },

  // Grid
  gridContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  gridRow: {
    justifyContent: 'flex-start',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '48%',
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[12],
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: spacing[4],
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default ConteurIntroScreen;
