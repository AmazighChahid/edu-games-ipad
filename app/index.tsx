import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Decorations
import { AnimatedSun } from '@/components/decorations/AnimatedSun';
import { AnimatedCloud } from '@/components/decorations/AnimatedCloud';
import { AnimatedTree } from '@/components/decorations/AnimatedTree';
import { AnimatedButterfly } from '@/components/decorations/AnimatedButterfly';
import { FloatingFlowers } from '@/components/decorations/FloatingFlowers';
import { Hills } from '@/components/decorations/Hills';

// Home components
import { Header } from '@/components/home/Header';
import { GamesGrid } from '@/components/home/GamesGrid';
import { ProgressGarden } from '@/components/home/ProgressGarden';
import { DailyStreak } from '@/components/home/DailyStreak';
import { PiouMascot } from '@/components/home/PiouMascot';
import { CardCollection } from '@/components/home/CardCollection';
import { CategoriesNav } from '@/components/home/CategoriesNav';

import { theme } from '@/theme';
import { useStore } from '@/store/useStore';
import { gameRegistry } from '@/games/registry';
import { Game, CategoryId, GameCategory, GameLevel } from '@/types/games';
import { GameProgress } from '@/types/game.types';

// Game icon mapping
const GAME_ICONS: Record<string, string> = {
  'hanoi': '🏰',
  'math-blocks': '🔢',
  'sudoku': '🎯',
  'suites-logiques': '🔮',
  'memory': '🧠',
  'tangram': '🧩',
  'labyrinthe': '🗺️',
  'mots-croises': '📝',
};

// Helper functions for data calculation
const getGameIcon = (gameId: string): string => {
  return GAME_ICONS[gameId] || '🎮';
};

const calculateProgressPercent = (progress?: GameProgress): number => {
  if (!progress) return 0;
  const totalLevels = 10;
  const completedLevels = Object.keys(progress.completedLevels).length;
  return Math.min(Math.round((completedLevels / totalLevels) * 100), 100);
};

// Nouveau: calcul du niveau basé sur la progression
const calculateLevel = (progress?: GameProgress): GameLevel => {
  if (!progress) return 'none';
  const percent = calculateProgressPercent(progress);
  if (percent >= 85) return 'diamond';
  if (percent >= 65) return 'gold';
  if (percent >= 40) return 'silver';
  if (percent >= 20) return 'bronze';
  return 'none';
};

// Calcul de la progression vers le prochain niveau (0-5 points)
const calculateLevelProgress = (progress?: GameProgress): number => {
  if (!progress) return 0;
  const percent = calculateProgressPercent(progress);
  // Normaliser sur une échelle de 0-5 dans chaque tranche
  if (percent >= 85) return Math.min(Math.floor((percent - 85) / 3), 5);
  if (percent >= 65) return Math.min(Math.floor((percent - 65) / 4), 5);
  if (percent >= 40) return Math.min(Math.floor((percent - 40) / 5), 5);
  if (percent >= 20) return Math.min(Math.floor((percent - 20) / 4), 5);
  return Math.min(Math.floor(percent / 4), 5);
};

// Deprecated: gardé pour compatibilité
const calculateStars = (progress?: GameProgress): number => {
  if (!progress || Object.keys(progress.completedLevels).length === 0) return 0;
  const completions = Object.values(progress.completedLevels);
  const totalStars = completions.reduce((sum, level) => {
    const optimalMoves = 15;
    if (level.bestMoveCount <= optimalMoves) return sum + 3;
    if (level.bestMoveCount <= optimalMoves * 1.5) return sum + 2;
    return sum + 1;
  }, 0);
  return Math.min(Math.floor(totalStars / completions.length), 3);
};

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Get real game progress from Zustand store
  const gameProgressMap = useStore(state => state.gameProgress);

  const [activeCategory, setActiveCategory] = useState<CategoryId>('home');

  // Calculate profile stats from real data
  const totalStars = Object.values(gameProgressMap).reduce((sum, gp) =>
    sum + calculateStars(gp), 0
  );

  const totalCompletedLevels = Object.values(gameProgressMap).reduce((sum, gp) =>
    sum + Object.keys(gp.completedLevels).length, 0
  );

  const flowersCount = Math.floor(totalCompletedLevels / 10);

  const gamesCompleted = Object.values(gameProgressMap).filter(gp =>
    Object.keys(gp.completedLevels).length > 0
  ).length;

  const totalPlayTime = Object.values(gameProgressMap).reduce((sum, gp) =>
    sum + gp.totalPlayTimeMinutes, 0
  );

  const profile = {
    id: '1',
    name: 'Emma',
    avatarEmoji: '🦊',
    level: Math.floor(totalStars / 10) + 1,
    totalStars,
    totalBadges: 15,
    currentStreak: 5,
    weekProgress: [true, true, true, true, true, false, false],
    todayIndex: 4, // Vendredi
    flowersCount,
    gamesCompleted,
    totalPlayTime: `${Math.floor(totalPlayTime / 60)}h`,
    collectedCards: 7,
    totalCards: 20,
  };

  // Cartes de collection pour le preview
  const collectionCards = [
    { emoji: '🦊', isUnlocked: true },
    { emoji: '🦉', isUnlocked: true },
    { emoji: '🐰', isUnlocked: true },
    { emoji: '🦋', isUnlocked: true },
    { emoji: '❓', isUnlocked: false },
  ];

  // Convert ALL games from registry to Game format avec le nouveau système de niveaux
  const games: Game[] = gameRegistry.map((gameMeta) => {
    const progress = gameProgressMap[gameMeta.id];

    let displayCategory: GameCategory;
    if (gameMeta.category === 'math') {
      displayCategory = 'numbers';
    } else if (gameMeta.category === 'language') {
      displayCategory = 'language';
    } else {
      displayCategory = gameMeta.category as GameCategory;
    }

    return {
      id: gameMeta.id,
      name: gameMeta.name,
      icon: getGameIcon(gameMeta.id),
      category: displayCategory,
      progress: calculateProgressPercent(progress),
      level: calculateLevel(progress),
      levelProgress: calculateLevelProgress(progress),
      stars: calculateStars(progress), // Deprecated
      isNew: gameMeta.id === 'tangram', // Exemple: tangram est nouveau
      isHot: gameMeta.id === 'math-blocks', // Exemple: math-blocks est populaire
      isComingSoon: gameMeta.status === 'coming_soon',
    };
  });

  // Filter games by category
  const filteredGames = activeCategory === 'home'
    ? games
    : activeCategory === 'numbers'
    ? games.filter(g => g.category === 'numbers' || g.category === 'math')
    : activeCategory === 'words'
    ? games.filter(g => g.category === 'language')
    : games.filter(g => g.category === activeCategory);

  const handleAvatarPress = () => {
    console.log('Avatar pressed - Navigate to avatar customization');
  };

  const handleParentPress = () => {
    router.push('/(parent)');
  };

  const handleGamePress = (gameId: string) => {
    console.log('Game pressed:', gameId);
    const game = gameRegistry.find(g => g.id === gameId);
    if (!game) return;
    if (game.status === 'coming_soon') {
      console.log('Game coming soon:', gameId);
      return;
    }
    router.push(game.route as any);
  };

  // Trouver le jeu avec le moins de progression pour la suggestion Piou
  const getSuggestedGame = () => {
    const availableGames = games.filter(g => !g.isComingSoon);
    const inProgressGames = availableGames.filter(g => g.progress > 0 && g.progress < 100);
    return inProgressGames.sort((a, b) => b.progress - a.progress)[0] || availableGames[0];
  };

  const suggestedGame = getSuggestedGame();
  const levelsToNext = suggestedGame ? (5 - suggestedGame.levelProgress) : 2;

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={[
          theme.colors.home.gradients.skyTop,
          theme.colors.home.gradients.skyMid1,
          theme.colors.home.gradients.skyMid2,
          theme.colors.home.gradients.grassBottom,
        ]}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.background}
      >
        {/* Decorative elements */}
        <AnimatedSun />
        <AnimatedCloud position="left" delay={0} />
        <AnimatedCloud position="center" delay={2000} />
        <AnimatedCloud position="right" delay={4000} />
        <AnimatedButterfly position={1} />
        <AnimatedButterfly position={2} />
        <AnimatedButterfly position={3} />
        <AnimatedButterfly position={4} />
        <AnimatedButterfly position={5} />
        <AnimatedButterfly position={6} />
        <FloatingFlowers position="left" />
        <FloatingFlowers position="right" />

        {/* Hills */}
        <Hills />

        {/* Trees */}
        <AnimatedTree position={1} />
        <AnimatedTree position={2} />
        <AnimatedTree position={3} />
        <AnimatedTree position={4} />

        {/* Content */}
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Header
            childName={profile.name}
            avatarEmoji={profile.avatarEmoji}
            level={profile.level}
            totalStars={profile.totalStars}
            totalBadges={profile.totalBadges}
            onAvatarPress={handleAvatarPress}
            onParentPress={handleParentPress}
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Barre de navigation flottante (filtre) */}
            <CategoriesNav
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            <View style={[styles.mainContent, isLandscape && styles.mainContentLandscape]}>
              {/* Games section */}
              <View style={styles.gamesSection}>
                <GamesGrid games={filteredGames} onGamePress={handleGamePress} />
              </View>

              {/* Sidebar avec widgets V2 */}
              <View style={styles.sidebar}>
                {/* Widget Piou Mascotte (nouveau) */}
                <PiouMascot
                  message={`Tu es à ${levelsToNext} niveaux du rang Diamant sur la ${suggestedGame?.name || 'Tour Magique'} ! On y va ? 🏰`}
                  highlightText={`${levelsToNext} niveaux`}
                  buttonText="C'est parti !"
                  onButtonPress={() => suggestedGame && handleGamePress(suggestedGame.id)}
                />

                {/* Widget Jardin */}
                <ProgressGarden
                  flowers={profile.flowersCount}
                  gamesCompleted={profile.gamesCompleted}
                  totalPlayTime={profile.totalPlayTime}
                />

                {/* Widget Streak */}
                <DailyStreak
                  currentStreak={profile.currentStreak}
                  weekProgress={profile.weekProgress}
                  todayIndex={profile.todayIndex}
                />

                {/* Widget Collection (nouveau) */}
                <CardCollection
                  collectedCards={profile.collectedCards}
                  totalCards={profile.totalCards}
                  previewCards={collectionCards}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainContent: {
    paddingHorizontal: 32,
    paddingTop: 16,
    gap: 24,
  },
  mainContentLandscape: {
    flexDirection: 'row',
    gap: 24,
  },
  gamesSection: {
    flex: 1,
  },
  sidebar: {
    width: 320,
    gap: 16,
  },
});
