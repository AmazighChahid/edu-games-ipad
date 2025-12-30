/**
 * Home Screen V10 - "Forêt Immersive"
 * Immersive animated forest background with floating widgets and game grid
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, AppState, AppStateStatus, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

// Home V10 Components
import {
  ForestBackgroundV10,
  PiouFloating,
  CollectionFloating,
  HomeHeaderV10,
  GameCardV10,
  CategoryFilters,
  CategoryId,
  CATEGORY_MAPPING,
} from '@/components/home-v10';
import { HomeV10Layout, EdokiWidgetLayout } from '@/theme/home-v10-colors';
import type { EdokiTheme, GameCategory } from '@/components/home-v10/GameCardV10';
import { mapRegistryCategory } from '@/components/home-v10/GameCardV10';
import { getGameById } from '@/games/registry';

// Hooks
import { useHomeData } from '@/hooks/useHomeData';

// Parent dashboard (full-screen modal)
import { ParentDashboard } from '@/components/parent/ParentDashboard';
import { useStore } from '@/store';

// Profile switching
import { ProfileSwitcherModal, ProfileCreationFlow } from '@/components/profile';
import { useProfileSwitcher } from '@/hooks/useProfileSwitcher';

// Mapping des jeux vers les thèmes Edoki (avec illustrations SVG dédiées)
const GAME_THEME_MAPPING: Record<string, EdokiTheme> = {
  hanoi: 'hanoi',
  'suites-logiques': 'suites-logiques',
  'logix-grid': 'logix-grid',
  'math-blocks': 'math-blocks',
  sudoku: 'sudoku',
  tangram: 'tangram',
  labyrinthe: 'labyrinthe',
  memory: 'memory',
  'mots-croises': 'mots-croises',
  'conteur-curieux': 'conteur-curieux',
  balance: 'balance',
  'matrices-magiques': 'matrices-magiques',
  // Coming Soon games
  embouteillage: 'embouteillage',
  'fabrique-reactions': 'fabrique-reactions',
  'chasseur-papillons': 'chasseur-papillons',
};

// Game route mapping
const GAME_ROUTES: Record<string, string> = {
  hanoi: '/(games)/01-hanoi',
  'suites-logiques': '/(games)/02-suites-logiques',
  'logix-grid': '/(games)/09-logix-grid',
  'math-blocks': '/(games)/11-math-blocks',
  sudoku: '/(games)/05-sudoku',
  tangram: '/(games)/08-tangram',
  labyrinthe: '/(games)/03-labyrinthe',
  memory: '/(games)/07-memory',
  'mots-croises': '/(games)/10-mots-croises',
  'conteur-curieux': '/(games)/06-conteur-curieux',
  balance: '/(games)/04-balance',
  'matrices-magiques': '/(games)/12-matrices-magiques',
  // Coming Soon games (routes préparées mais pas encore implémentées)
  embouteillage: '/(games)/13-embouteillage',
  'fabrique-reactions': '/(games)/14-fabrique-reactions',
  'chasseur-papillons': '/(games)/15-chasseur-papillons',
};

// Jeux Coming Soon (pas encore jouables)
const COMING_SOON_GAMES: string[] = [];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const soundRef = useRef<Audio.Sound | null>(null);
  const appState = useRef(AppState.currentState);

  // Forest ambiance audio
  useEffect(() => {
    let isMounted = true;

    const loadAndPlayAudio = async () => {
      try {
        // Configure audio mode for background playback
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // Load and play forest ambiance
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/forest-ambiance.mp3'),
          {
            isLooping: true,
            volume: 0.3,
            shouldPlay: true,
          }
        );

        if (isMounted) {
          soundRef.current = sound;
        } else {
          await sound.unloadAsync();
        }
      } catch (error) {
        console.warn('Failed to load forest ambiance audio:', error);
      }
    };

    loadAndPlayAudio();

    // Handle app state changes (pause when app goes to background)
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        // App going to background - pause audio
        soundRef.current?.pauseAsync();
      } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App coming to foreground - resume audio
        soundRef.current?.playAsync();
      }
      appState.current = nextAppState;
    });

    return () => {
      isMounted = false;
      subscription.remove();
      soundRef.current?.unloadAsync();
    };
  }, []);

  // Get home data from hook
  const {
    profile,
    piouAdvice,
    collectionData,
    gameCategories,
  } = useHomeData();

  // Parent dashboard state
  const [isParentDashboardVisible, setIsParentDashboardVisible] = useState(false);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  // Parallax scroll value for game cards
  const scrollX = useSharedValue(0);
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Profile switching
  const {
    isModalVisible: isProfileSwitcherVisible,
    isCreationFlowVisible,
    profiles,
    activeProfile,
    openSwitcher,
    closeSwitcher,
    openCreationFlow,
    closeCreationFlow,
    switchProfile,
    handleCreateProfile,
  } = useProfileSwitcher();

  // Get game progress for parent drawer stats
  const gameProgress = useStore((state) => state.gameProgress);

  // Favorite games
  const favoriteGameIds = useStore((state) => state.favoriteGameIds);
  const toggleFavoriteGame = useStore((state) => state.toggleFavoriteGame);

  // Calculate stats for parent drawer
  const totalGames = Object.values(gameProgress).reduce(
    (sum, gp) => sum + Object.keys(gp.completedLevels).length,
    0
  );
  const successfulGames = totalGames;

  // Flatten games from categories for horizontal scroll display (Edoki style)
  const allGames = useMemo(() => {
    const games: Array<{
      id: string;
      title: string;
      theme: EdokiTheme;
      progress: number; // 0-4 segments
      isFavorite: boolean;
      categoryId: string;
      category?: GameCategory;
      isComingSoon: boolean;
    }> = [];

    // Carte fictive pour tester la vidéo en arrière-plan (toujours visible)
    games.push({
      id: 'video-demo',
      title: 'Video Demo',
      theme: 'video' as EdokiTheme,
      progress: 0,
      isFavorite: false,
      categoryId: 'all',
      isComingSoon: false,
    });

    gameCategories.forEach((category) => {
      category.games.forEach((game) => {
        // Ne pas inclure les jeux verrouillés dans le scroll horizontal
        if (game.isLocked) return;

        // Calculer la progression (0-4 basé sur la médaille)
        let progress = 0;
        if (game.medal === 'bronze') progress = 1;
        else if (game.medal === 'silver') progress = 2;
        else if (game.medal === 'gold') progress = 3;
        else if (game.medal === 'diamond') progress = 4;

        // Récupérer la catégorie depuis le registry
        const registryGame = getGameById(game.id);
        const gameCategory = registryGame ? mapRegistryCategory(registryGame.category) : undefined;

        games.push({
          id: game.id,
          title: game.name,
          theme: GAME_THEME_MAPPING[game.id] || 'barres',
          progress,
          isFavorite: favoriteGameIds.includes(game.id),
          categoryId: category.id,
          category: gameCategory,
          isComingSoon: COMING_SOON_GAMES.includes(game.id),
        });
      });
    });

    return games;
  }, [gameCategories, favoriteGameIds]);

  // Filtered games based on selected category
  const filteredGames = useMemo(() => {
    if (selectedCategory === 'all') {
      return allGames;
    }
    if (selectedCategory === 'favorites') {
      return allGames.filter((game) => game.isFavorite);
    }
    // Mapper la catégorie sélectionnée vers les catégories du registry
    return allGames.filter((game) => {
      // Toujours inclure les éléments de catégorie "all" (comme video-demo)
      if (game.categoryId === 'all') return true;
      // Vérifier si la catégorie du jeu correspond via le mapping
      const mappedCategory = CATEGORY_MAPPING[game.categoryId];
      return mappedCategory === selectedCategory;
    });
  }, [allGames, selectedCategory]);

  // Handler for toggling favorite
  const handleToggleFavorite = useCallback((gameId: string) => {
    toggleFavoriteGame(gameId);
  }, [toggleFavoriteGame]);

  // Handlers
  const handleParentPress = useCallback(() => {
    setIsParentDashboardVisible(true);
  }, []);

  const handleParentDashboardClose = useCallback(() => {
    setIsParentDashboardVisible(false);
  }, []);

  const handleGamePress = useCallback((gameId: string) => {
    // Ne pas naviguer pour les jeux Coming Soon
    if (COMING_SOON_GAMES.includes(gameId)) {
      Alert.alert(
        'Bientôt disponible ! 🎮',
        'Ce jeu arrive très bientôt. Reviens vite pour le découvrir !',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const route = GAME_ROUTES[gameId];
    if (route) {
      router.push(route as any);
    }
  }, [router]);

  const handlePiouActionPress = useCallback(() => {
    if (piouAdvice.targetGameId) {
      handleGamePress(piouAdvice.targetGameId);
    }
  }, [piouAdvice.targetGameId, handleGamePress]);

  const handleCollectionPress = useCallback(() => {
    router.push('/(games)/collection' as any);
  }, [router]);

  const handleCategoryChange = useCallback((category: CategoryId) => {
    setSelectedCategory(category);
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated forest background V10 */}
      <ForestBackgroundV10>
        {/* Fixed Header with mask - doesn't scroll */}
        <View style={[styles.fixedHeader, { paddingTop: insets.top }]}>
          {/* Gradient mask to hide scrolled content */}
          <LinearGradient
            colors={[
              'rgba(126, 200, 227, 0.95)',
              'rgba(168, 224, 240, 0.9)',
              'rgba(168, 224, 240, 0.7)',
              'rgba(168, 224, 240, 0)',
            ]}
            locations={[0, 0.5, 0.8, 1]}
            style={styles.headerMask}
          />
          <HomeHeaderV10
            profile={profile}
            onParentPress={handleParentPress}
            onAvatarPress={openSwitcher}
          />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 200,
              paddingBottom: insets.bottom + HomeV10Layout.gamesSectionPaddingBottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Piou and Collection - now in scroll */}
          <View style={styles.floatingRow}>
            <PiouFloating
              message={piouAdvice.message}
              highlightedPart={piouAdvice.highlightedPart}
              actionLabel={piouAdvice.actionLabel}
              onActionPress={handlePiouActionPress}
            />

            <CollectionFloating
              cardCount={collectionData.unlockedCards.length}
              onPress={handleCollectionPress}
            />
          </View>

          {/* Category filters - chips colorées */}
          <CategoryFilters
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            style={styles.categoryFilters}
          />

          {/* Games Horizontal Scroll - Style Edoki avec effet parallaxe */}
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gamesHorizontalScroll}
            decelerationRate="fast"
            snapToInterval={EdokiWidgetLayout.widgetWidth + EdokiWidgetLayout.scrollGap}
            snapToAlignment="start"
            onScroll={onScrollHandler}
            scrollEventThrottle={16}
          >
            {filteredGames.map((game, index) => (
              <GameCardV10
                key={game.id}
                id={game.id}
                title={game.title}
                theme={game.theme}
                progress={game.progress}
                category={game.category}
                isFavorite={game.isFavorite}
                isComingSoon={game.isComingSoon}
                onPress={() => handleGamePress(game.id)}
                onToggleFavorite={() => handleToggleFavorite(game.id)}
                scrollX={scrollX}
                index={index}
              />
            ))}
          </Animated.ScrollView>
        </ScrollView>
      </ForestBackgroundV10>

      {/* Parent dashboard modal */}
      <ParentDashboard
        isVisible={isParentDashboardVisible}
        onClose={handleParentDashboardClose}
        childName={profile.name}
        levelsCompleted={totalGames}
        successRate={totalGames > 0 ? Math.round((successfulGames / totalGames) * 100) : 0}
      />

      {/* Profile switcher modal */}
      <ProfileSwitcherModal
        visible={isProfileSwitcherVisible}
        onClose={closeSwitcher}
        profiles={profiles}
        activeProfileId={activeProfile?.id ?? null}
        onSwitchProfile={switchProfile}
        onCreateProfile={openCreationFlow}
      />

      {/* Profile creation flow */}
      <ProfileCreationFlow
        visible={isCreationFlowVisible}
        onClose={closeCreationFlow}
        onComplete={handleCreateProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  floatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryFilters: {
    marginBottom: 16,
  },
  gamesHorizontalScroll: {
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 40,
    gap: EdokiWidgetLayout.scrollGap,
  },
});
