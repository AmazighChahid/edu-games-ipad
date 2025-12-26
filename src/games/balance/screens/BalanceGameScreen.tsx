/**
 * Balance Game Screen
 * Main game interface with all features: levels, sandbox, journal, mascot
 * Integrates Montessori principles - balance IS the control of error
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  ZoomIn,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, touchTargets, shadows, borderRadius } from '@/theme';
import { BalanceScale } from '../components/BalanceScale';
import { WeightObject } from '../components/WeightObject';
import { DrHibou } from '../components/DrHibou';
import { EquivalenceJournal } from '../components/EquivalenceJournal';
import { LevelSelector } from '../components/LevelSelector';
import { SandboxMode } from '../components/SandboxMode';
import { useBalanceGame } from '../hooks/useBalanceGame';
import { getAllPuzzles, getPuzzleById, getPuzzlesByPhase } from '../data/puzzles';
import { createObject, OBJECTS_LIBRARY } from '../data/objects';
import type {
  WeightObject as WeightObjectType,
  Puzzle,
  Phase,
  Equivalence,
  PlayerProgress,
  MascotMood,
  DialogueContext,
} from '../types';
import { PHASE_INFO } from '../types';

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

  // State
  const [view, setView] = useState<GameView>('menu');
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(INITIAL_PROGRESS);
  const [showJournal, setShowJournal] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('neutral');
  const [mascotContext, setMascotContext] = useState<DialogueContext>('intro');
  const [showMascotBubble, setShowMascotBubble] = useState(true);

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

  // Calculate stars based on performance
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
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.background.primary, colors.background.secondary]}
          style={styles.background}
        >
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.menuHeader}>
              <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>{'<'}</Text>
              </Pressable>
              <Text style={styles.menuTitle}>Balance Logique</Text>
              <View style={styles.menuTitleIcon}>
                <Text style={styles.menuTitleEmoji}>⚖️</Text>
              </View>
            </View>

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
                <Text style={styles.menuButtonEmoji}>🔬</Text>
                <View>
                  <Text style={styles.menuButtonTitle}>Niveaux</Text>
                  <Text style={styles.menuButtonSubtitle}>30 défis à résoudre</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuButton, styles.menuButtonSecondary]}
                onPress={() => setView('sandbox')}
              >
                <Text style={styles.menuButtonEmoji}>🎨</Text>
                <View>
                  <Text style={styles.menuButtonTitle}>Mode Libre</Text>
                  <Text style={styles.menuButtonSubtitle}>Expérimente sans limite</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuButton, styles.menuButtonTertiary]}
                onPress={() => setShowJournal(true)}
              >
                <Text style={styles.menuButtonEmoji}>📖</Text>
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
          </SafeAreaView>
        </LinearGradient>

        {/* Journal modal */}
        <EquivalenceJournal
          equivalences={playerProgress.discoveredEquivalences}
          isVisible={showJournal}
          onClose={() => setShowJournal(false)}
        />
      </View>
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

  const puzzle = currentPuzzle || firstPuzzle;
  const phaseInfo = PHASE_INFO[puzzle.phase];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.secondary]}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => setView('menu')} style={styles.backButton}>
              <Text style={styles.backButtonText}>{'<'}</Text>
            </Pressable>

            <View style={styles.headerCenter}>
              <Text style={styles.headerEmoji}>{phaseInfo.icon}</Text>
              <View>
                <Text style={styles.levelTitle}>Niveau {puzzle.level}</Text>
                <Text style={styles.phaseTitle}>{phaseInfo.name}</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <Pressable onPress={requestHint} style={styles.hintButton}>
                <Text style={styles.hintButtonText}>💡</Text>
              </Pressable>
              <Pressable onPress={reset} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>↻</Text>
              </Pressable>
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
              <Text style={styles.mascotEmoji}>🦉</Text>
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

          {/* Victory Overlay */}
          {isVictory && (
            <Animated.View entering={FadeIn} style={styles.victoryOverlay}>
              <Animated.View
                entering={ZoomIn.springify().damping(12)}
                style={styles.victoryCard}
              >
                <Text style={styles.victoryEmoji}>🎉</Text>
                <Text style={styles.victoryTitle}>Eurêka !</Text>
                <Text style={styles.victoryMessage}>
                  Tu as équilibré la balance !
                </Text>

                {/* Stars */}
                <View style={styles.starsRow}>
                  {[1, 2, 3].map((star) => {
                    const earnedStars = calculateStars(
                      attempts,
                      hintsUsed,
                      puzzle.maxAttemptsForThreeStars,
                      puzzle.maxHintsForThreeStars
                    );
                    return (
                      <Animated.Text
                        key={star}
                        entering={ZoomIn.delay(star * 200)}
                        style={[
                          styles.victoryStar,
                          star <= earnedStars && styles.victoryStarEarned,
                        ]}
                      >
                        {star <= earnedStars ? '★' : '☆'}
                      </Animated.Text>
                    );
                  })}
                </View>

                {/* Discovered equivalences */}
                {discoveredEquivalences.length > 0 && (
                  <View style={styles.discoveryContainer}>
                    <Text style={styles.discoveryTitle}>Tu as découvert :</Text>
                    {discoveredEquivalences.map((eq, index) => (
                      <Text key={index} style={styles.discoveryText}>
                        {eq}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Buttons */}
                <View style={styles.victoryButtons}>
                  <Pressable onPress={reset} style={styles.victoryButton}>
                    <Text style={styles.victoryButtonText}>Rejouer</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleNextPuzzle}
                    style={[styles.victoryButton, styles.victoryButtonPrimary]}
                  >
                    <Text style={[styles.victoryButtonText, styles.victoryButtonTextPrimary]}>
                      Suivant
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>
            </Animated.View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Menu styles
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  backButton: {
    position: 'absolute',
    left: spacing[4],
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  menuTitleIcon: {
    marginLeft: spacing[1],
  },
  menuTitleEmoji: {
    fontSize: 28,
  },
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
    borderRadius: borderRadius.large,
    ...shadows.medium,
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
    fontSize: 40,
  },
  menuButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  menuButtonSubtitle: {
    fontSize: 14,
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  progressLabel: {
    fontSize: 12,
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  headerEmoji: {
    fontSize: 28,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  phaseTitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  hintButton: {
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  hintButtonText: {
    fontSize: 20,
  },
  resetButton: {
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  resetButtonText: {
    fontSize: 20,
    color: colors.text.secondary,
  },

  // Puzzle info
  puzzleInfo: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    alignItems: 'center',
  },
  puzzleDescription: {
    fontSize: 14,
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
    borderRadius: borderRadius.large,
    ...shadows.medium,
  },
  mascotEmoji: {
    fontSize: 32,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    color: colors.primary.main,
    lineHeight: 20,
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
    gap: 4,
  },
  plateObject: {
    padding: 2,
  },
  plateObjectEmoji: {
    fontSize: 28,
  },

  // Stock
  stockContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    ...shadows.small,
  },
  stockTitle: {
    fontSize: 14,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.secondary,
  },

  // Game mascot
  gameMascot: {
    position: 'absolute',
    bottom: 180,
    right: spacing[2],
  },

  // Victory overlay
  victoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  victoryCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    alignItems: 'center',
    maxWidth: 350,
    ...shadows.large,
  },
  victoryEmoji: {
    fontSize: 64,
    marginBottom: spacing[3],
  },
  victoryTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.feedback.success,
    marginBottom: spacing[2],
  },
  victoryMessage: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  victoryStar: {
    fontSize: 36,
    color: colors.ui.disabled,
  },
  victoryStarEarned: {
    color: colors.secondary.main,
  },
  discoveryContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing[4],
    borderRadius: borderRadius.large,
    marginBottom: spacing[4],
    width: '100%',
    alignItems: 'center',
  },
  discoveryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  discoveryText: {
    fontSize: 20,
    color: colors.primary.main,
    textAlign: 'center',
  },
  victoryButtons: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  victoryButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.large,
    backgroundColor: colors.background.secondary,
    ...shadows.small,
  },
  victoryButtonPrimary: {
    backgroundColor: colors.primary.main,
  },
  victoryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  victoryButtonTextPrimary: {
    color: colors.text.inverse,
  },
});

export default BalanceGameScreen;
