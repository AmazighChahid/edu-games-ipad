/**
 * Balance Game Screen
 * Main game interface with all features: levels, sandbox, journal, mascot
 * Integrates Montessori principles - balance IS the control of error
 *
 * Refactoré avec PageContainer, ScreenHeader, Icons centralisés, touch targets 64dp
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  ZoomIn,
} from 'react-native-reanimated';

import { colors, spacing, touchTargets, shadows, borderRadius, fontFamily, fontSize } from '../../../theme';
import { PageContainer, ScreenHeader, Button } from '../../../components/common';
import { Icons } from '../../../constants/icons';
import { BalanceScale } from '../components/BalanceScale';
import { WeightObject } from '../components/WeightObject';
import { DrHibou } from '../components/DrHibou';
import { EquivalenceJournal } from '../components/EquivalenceJournal';
import { LevelSelector } from '../components/LevelSelector';
import { SandboxMode } from '../components/SandboxMode';
import { useBalanceGame } from '../hooks/useBalanceGame';
import { getAllPuzzles } from '../data/puzzles';
import type {
  WeightObject as WeightObjectType,
  Puzzle,
  Equivalence,
  PlayerProgress,
  MascotMood,
  DialogueContext,
} from '../types';
import { PHASE_INFO } from '../types';
import { VictoryCard, type VictoryBadge } from '../../../components/common';
import { CardUnlockScreen } from '../../../components/collection';
import { useCardUnlock } from '../../../hooks/useCardUnlock';
import { useCollection } from '../../../store';

// Fonction pour calculer le badge non-compétitif de Balance
const getBalanceBadge = (attempts: number, hintsUsed: number, stars: number): VictoryBadge => {
  if (stars === 3 && hintsUsed === 0) {
    return { icon: Icons.balance, label: 'Équilibriste' };
  } else if (stars >= 2) {
    return { icon: Icons.experiment, label: 'Scientifique' };
  } else if (hintsUsed >= 2) {
    return { icon: Icons.muscle, label: 'Persévérant' };
  } else {
    return { icon: Icons.star, label: 'Explorateur' };
  }
};

// Calculate stars based on performance (moved outside component for use before hooks)
const calculateStars = (
  attempts: number,
  hints: number,
  maxAttempts: number,
  maxHints: number
): 1 | 2 | 3 => {
  if (attempts <= maxAttempts && hints <= maxHints) return 3;
  if (attempts <= maxAttempts * 1.5 || hints <= maxHints * 1.5) return 2;
  return 1;
};

// ============================================
// TYPES
// ============================================

type GameView = 'menu' | 'levels' | 'game' | 'sandbox' | 'journal';

// ============================================
// MOCK PLAYER PROGRESS (to be replaced with Zustand store)
// ============================================

const INITIAL_PROGRESS: PlayerProgress = {
  completedPuzzles: [],
  starsPerPuzzle: {},
  discoveredEquivalences: [],
  unlockedPhases: [1], // Phase 1 is always unlocked
  totalTime: 0,
  currentStreak: 0,
  sandboxTimeSpent: 0,
};

// ============================================
// MAIN COMPONENT
// ============================================

export function BalanceGameScreen() {
  const router = useRouter();
  const { getUnlockedCardsCount } = useCollection();

  // State
  const [view, setView] = useState<GameView>('menu');
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(INITIAL_PROGRESS);
  const [showJournal, setShowJournal] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('neutral');
  const [mascotContext, setMascotContext] = useState<DialogueContext>('intro');
  const [showMascotBubble, setShowMascotBubble] = useState(true);
  const [hasCheckedUnlock, setHasCheckedUnlock] = useState(false);

  // Get first puzzle for default
  const allPuzzles = useMemo(() => getAllPuzzles(), []);
  const firstPuzzle = allPuzzles[0];

  // Use balance game hook when puzzle is selected
  const {
    balanceState,
    availableObjects,
    placeObject,
    removeObject,
    requestHint,
    currentHint,
    hintsUsed,
    attempts,
    isVictory,
    discoveredEquivalences,
    reset,
  } = useBalanceGame({
    puzzle: currentPuzzle || firstPuzzle,
    onComplete: (stats) => {
      handlePuzzleComplete(stats);
    },
  });

  // Calculer si la performance est optimale (3 étoiles)
  const puzzle = currentPuzzle || firstPuzzle;
  const earnedStars = isVictory ? calculateStars(
    attempts,
    hintsUsed,
    puzzle.maxAttemptsForThreeStars,
    puzzle.maxHintsForThreeStars
  ) : 1;
  const isOptimal = earnedStars === 3 && hintsUsed === 0;

  // Système de déblocage de cartes
  const {
    unlockedCard,
    showUnlockAnimation,
    checkAndUnlockCard,
    dismissUnlockAnimation,
  } = useCardUnlock({
    gameId: 'balance',
    levelId: `level_${puzzle.level}`,
    levelNumber: puzzle.level,
    isOptimal,
  });

  // Check pour déblocage de carte après victoire
  useEffect(() => {
    if (isVictory && !hasCheckedUnlock) {
      const timer = setTimeout(() => {
        checkAndUnlockCard();
        setHasCheckedUnlock(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isVictory, hasCheckedUnlock, checkAndUnlockCard]);

  // Reset l'état quand on recommence
  useEffect(() => {
    if (!isVictory) {
      setHasCheckedUnlock(false);
    }
  }, [isVictory]);

  // Handlers pour le déblocage de cartes
  const handleViewCollection = useCallback(() => {
    dismissUnlockAnimation();
    router.push('/(games)/collection');
  }, [dismissUnlockAnimation, router]);

  const handleContinueAfterUnlock = useCallback(() => {
    dismissUnlockAnimation();
  }, [dismissUnlockAnimation]);

  // Handle puzzle selection
  const handleSelectPuzzle = useCallback((puzzle: Puzzle) => {
    setCurrentPuzzle(puzzle);
    setView('game');
    setMascotContext('level_start');
    setMascotMood('curious');
    setShowMascotBubble(true);
  }, []);

  // Handle puzzle completion
  const handlePuzzleComplete = useCallback((stats: {
    puzzleId: string;
    completed: boolean;
    attempts: number;
    hintsUsed: number;
    timeSpent: number;
    equivalenciesDiscovered: string[];
  }) => {
    if (!currentPuzzle) return;

    // Calculate stars
    const stars = calculateStars(
      stats.attempts,
      stats.hintsUsed,
      currentPuzzle.maxAttemptsForThreeStars,
      currentPuzzle.maxHintsForThreeStars
    );

    // Update progress
    setPlayerProgress(prev => ({
      ...prev,
      completedPuzzles: [...new Set([...prev.completedPuzzles, stats.puzzleId])],
      starsPerPuzzle: {
        ...prev.starsPerPuzzle,
        [stats.puzzleId]: stars,
      },
      totalTime: prev.totalTime + stats.timeSpent,
    }));

    // Update mascot
    setMascotMood('celebratory');
    setMascotContext('balanced');
  }, [currentPuzzle]);

  // Handle object drop on plate
  const handleObjectDrop = useCallback((object: WeightObjectType, x: number, y: number) => {
    // Determine which plate based on x position
    const screenWidth = 400; // approximate
    const centerX = screenWidth / 2;

    if (x < centerX - 50) {
      placeObject(object, 'left');
      setMascotContext('first_move');
      setMascotMood('curious');
    } else if (x > centerX + 50) {
      placeObject(object, 'right');
      setMascotContext('first_move');
      setMascotMood('curious');
    }
  }, [placeObject]);

  // Handle next puzzle
  const handleNextPuzzle = useCallback(() => {
    if (!currentPuzzle) return;

    // Find next puzzle
    const currentIndex = allPuzzles.findIndex(p => p.id === currentPuzzle.id);
    if (currentIndex < allPuzzles.length - 1) {
      setCurrentPuzzle(allPuzzles[currentIndex + 1]);
      reset();
      setMascotContext('level_start');
      setMascotMood('curious');
    } else {
      // All puzzles complete
      setView('menu');
    }
  }, [currentPuzzle, allPuzzles, reset]);

  // Handle equivalence discovery in sandbox
  const handleSandboxDiscovery = useCallback((equivalence: Equivalence) => {
    setPlayerProgress(prev => ({
      ...prev,
      discoveredEquivalences: [
        ...prev.discoveredEquivalences,
        equivalence,
      ],
    }));
  }, []);

  // Render plate content
  const renderPlateContent = (side: 'left' | 'right') => {
    const plate = side === 'left' ? balanceState.leftPlate : balanceState.rightPlate;

    return (
      <View style={styles.plateContent}>
        {plate.objects.map((obj) => (
          <TouchableOpacity
            key={obj.id}
            onPress={() => removeObject(obj.id, side)}
            activeOpacity={0.7}
            style={styles.plateObjectTouchable}
          >
            <Animated.View entering={ZoomIn.springify()} style={styles.plateObject}>
              <Text style={styles.plateObjectEmoji}>{obj.emoji}</Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ============================================
  // RENDER: MENU VIEW
  // ============================================

  if (view === 'menu') {
    return (
      <PageContainer variant="playful">
        <ScreenHeader
          variant="game"
          title="Balance Logique"
          emoji={Icons.balance}
          onBack={() => router.back()}
        />

        {/* Dr. Hibou welcome */}
        <View style={styles.mascotContainer}>
          <DrHibou
            mood="excited"
            context={showMascotBubble ? 'intro' : undefined}
            size="large"
            position="center"
            onMessageDismiss={() => setShowMascotBubble(false)}
          />
        </View>

        {/* Menu buttons */}
        <View style={styles.menuButtons}>
          <TouchableOpacity
            style={[styles.menuButton, styles.menuButtonPrimary]}
            onPress={() => setView('levels')}
          >
            <Text style={styles.menuButtonEmoji}>{Icons.lab}</Text>
            <View>
              <Text style={styles.menuButtonTitle}>Niveaux</Text>
              <Text style={styles.menuButtonSubtitle}>30 défis à résoudre</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.menuButtonSecondary]}
            onPress={() => setView('sandbox')}
          >
            <Text style={styles.menuButtonEmoji}>{Icons.sandbox}</Text>
            <View>
              <Text style={styles.menuButtonTitle}>Mode Libre</Text>
              <Text style={styles.menuButtonSubtitle}>Expérimente sans limite</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.menuButtonTertiary]}
            onPress={() => setShowJournal(true)}
          >
            <Text style={styles.menuButtonEmoji}>{Icons.journal}</Text>
            <View>
              <Text style={styles.menuButtonTitle}>Mon Journal</Text>
              <Text style={styles.menuButtonSubtitle}>
                {playerProgress.discoveredEquivalences.length} découvertes
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progress summary */}
        <View style={styles.progressSummary}>
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>
              {playerProgress.completedPuzzles.length}
            </Text>
            <Text style={styles.progressLabel}>Niveaux</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>
              {playerProgress.discoveredEquivalences.length}
            </Text>
            <Text style={styles.progressLabel}>Découvertes</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>
              {playerProgress.unlockedPhases.length}
            </Text>
            <Text style={styles.progressLabel}>Phases</Text>
          </View>
        </View>

        {/* Journal modal */}
        <EquivalenceJournal
          equivalences={playerProgress.discoveredEquivalences}
          isVisible={showJournal}
          onClose={() => setShowJournal(false)}
        />
      </PageContainer>
    );
  }

  // ============================================
  // RENDER: LEVEL SELECTOR VIEW
  // ============================================

  if (view === 'levels') {
    return (
      <LevelSelector
        playerProgress={playerProgress}
        onSelectPuzzle={handleSelectPuzzle}
        onClose={() => setView('menu')}
      />
    );
  }

  // ============================================
  // RENDER: SANDBOX VIEW
  // ============================================

  if (view === 'sandbox') {
    return (
      <SandboxMode
        onDiscovery={handleSandboxDiscovery}
        onExit={() => setView('menu')}
        discoveredEquivalences={playerProgress.discoveredEquivalences}
      />
    );
  }

  // ============================================
  // RENDER: GAME VIEW
  // ============================================

  // Afficher l'écran de déblocage de carte si une carte a été débloquée
  if (showUnlockAnimation && unlockedCard) {
    return (
      <CardUnlockScreen
        card={unlockedCard}
        unlockedCount={getUnlockedCardsCount()}
        onViewCollection={handleViewCollection}
        onContinue={handleContinueAfterUnlock}
      />
    );
  }

  const phaseInfo = PHASE_INFO[puzzle.phase];

  return (
    <PageContainer variant="playful">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setView('menu')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{Icons.back}</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>{phaseInfo.icon}</Text>
          <View>
            <Text style={styles.levelTitle}>Niveau {puzzle.level}</Text>
            <Text style={styles.phaseTitle}>{phaseInfo.name}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={requestHint} style={styles.hintButton}>
            <Text style={styles.hintButtonText}>{Icons.lightbulb}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={reset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>{Icons.refresh}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Puzzle description */}
      <View style={styles.puzzleInfo}>
        <Text style={styles.puzzleDescription}>{puzzle.description}</Text>
      </View>

      {/* Mascot hint bubble */}
      {currentHint && (
        <Animated.View
          entering={SlideInUp.springify()}
          exiting={FadeOut}
          style={styles.hintBubble}
        >
          <Text style={styles.mascotEmoji}>{Icons.owl}</Text>
          <Text style={styles.hintText}>{currentHint}</Text>
        </Animated.View>
      )}

      {/* Balance Scale */}
      <View style={styles.balanceContainer}>
        <BalanceScale
          balanceState={balanceState}
          leftPlateContent={renderPlateContent('left')}
          rightPlateContent={renderPlateContent('right')}
          showWeightIndicators={puzzle.phase >= 3}
          onVictory={() => {
            setMascotMood('celebratory');
            setMascotContext('balanced');
          }}
        />
      </View>

      {/* Available Objects */}
      <View style={styles.stockContainer}>
        <Text style={styles.stockTitle}>Objets disponibles</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stockScroll}
        >
          {availableObjects.map((obj) => (
            <WeightObject
              key={obj.id}
              object={obj}
              onDragEnd={(x, y) => handleObjectDrop(obj, x, y)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{attempts}</Text>
          <Text style={styles.statLabel}>Coups</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{hintsUsed}</Text>
          <Text style={styles.statLabel}>Indices</Text>
        </View>
      </View>

      {/* Dr. Hibou mascot */}
      <View style={styles.gameMascot}>
        <DrHibou
          mood={mascotMood}
          context={showMascotBubble ? mascotContext : undefined}
          size="small"
          position="right"
          autoHideDelay={4000}
          onMessageDismiss={() => setShowMascotBubble(false)}
        />
      </View>

      {/* Victory Overlay avec VictoryCard unifié */}
      {isVictory && (() => {
        const earnedStars = calculateStars(
          attempts,
          hintsUsed,
          puzzle.maxAttemptsForThreeStars,
          puzzle.maxHintsForThreeStars
        );
        return (
          <VictoryCard
            variant="overlay"
            title="Eurêka !"
            message="Tu as équilibré la balance !"
            mascot={{
              emoji: Icons.owl,
              message: earnedStars === 3 ? 'Parfait !' : 'Bien joué !',
            }}
            stats={{
              moves: attempts,
              hintsUsed: hintsUsed,
              stars: earnedStars,
              customStats: discoveredEquivalences.length > 0
                ? discoveredEquivalences.map((eq, i) => ({
                    label: i === 0 ? 'Découverte' : '',
                    value: eq,
                    icon: Icons.lab
                  }))
                : undefined,
            }}
            badge={getBalanceBadge(attempts, hintsUsed, earnedStars)}
            onReplay={reset}
            onNextLevel={handleNextPuzzle}
            hasNextLevel={currentPuzzle ? allPuzzles.findIndex(p => p.id === currentPuzzle.id) < allPuzzles.length - 1 : false}
            nextLevelLabel="Puzzle suivant"
            onHome={() => setView('menu')}
            onCollection={handleViewCollection}
          />
        );
      })()}
    </PageContainer>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Menu styles
  mascotContainer: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  menuButtons: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    minHeight: touchTargets.large,
    ...shadows.md,
  },
  menuButtonPrimary: {
    backgroundColor: colors.home.categories.logic,
  },
  menuButtonSecondary: {
    backgroundColor: colors.home.categories.memory,
  },
  menuButtonTertiary: {
    backgroundColor: colors.home.categories.numbers,
  },
  menuButtonEmoji: {
    fontSize: 36, // Grande taille pour emojis de menu
  },
  menuButtonTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  menuButtonSubtitle: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressSummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: fontSize['2xl'],
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  progressLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.ui.divider,
  },

  // Game header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  backButton: {
    width: touchTargets.large,
    height: touchTargets.large,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  backButtonText: {
    fontSize: fontSize.xl,
    color: colors.text.primary,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  headerEmoji: {
    fontSize: fontSize['2xl'],
  },
  levelTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  phaseTitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  hintButton: {
    width: touchTargets.large,
    height: touchTargets.large,
    borderRadius: borderRadius.round,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  hintButtonText: {
    fontSize: fontSize.xl,
  },
  resetButton: {
    width: touchTargets.large,
    height: touchTargets.large,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  resetButtonText: {
    fontSize: fontSize.xl,
    color: colors.text.secondary,
  },

  // Puzzle info
  puzzleInfo: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    alignItems: 'center',
  },
  puzzleDescription: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Hint bubble
  hintBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.background.card,
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  mascotEmoji: {
    fontSize: fontSize['2xl'],
  },
  hintText: {
    flex: 1,
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: colors.primary.main,
    lineHeight: 24,
  },

  // Balance container
  balanceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  plateObjectTouchable: {
    minWidth: touchTargets.minimum,
    minHeight: touchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateObject: {
    padding: spacing[1],
  },
  plateObjectEmoji: {
    fontSize: fontSize['2xl'],
  },

  // Stock
  stockContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    ...shadows.sm,
  },
  stockTitle: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  stockScroll: {
    gap: spacing[3],
    paddingVertical: spacing[2],
  },

  // Stats
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[8],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
  },

  // Game mascot
  gameMascot: {
    position: 'absolute',
    bottom: 180,
    right: spacing[2],
  },
});

export default BalanceGameScreen;
