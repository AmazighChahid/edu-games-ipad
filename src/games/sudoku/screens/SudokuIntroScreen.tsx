/**
 * Sudoku unified screen - Intro + Game with seamless transition
 * Matches the design system of Hanoi and Home screens
 *
 * Features:
 * - Theme, size, and difficulty selection
 * - Visual feedback and encouragement
 * - Smooth transition to gameplay
 * - Parent zone integration
 */

import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '@/theme';
import { SudokuBackground } from '../components/SudokuBackground';
import { SudokuGrid, SymbolSelector } from '../components';
import { useSudokuGame } from '../hooks/useSudokuGame';
import type { SudokuSize, SudokuTheme, SudokuDifficulty, SudokuConfig } from '../types';
import { ParentZone, type GameMode } from '@/components/parent/ParentZone';

const THEMES: { id: SudokuTheme; label: string; emoji: string; color: string }[] = [
  { id: 'fruits', label: 'Fruits', emoji: '🍎', color: '#FF6B6B' },
  { id: 'animals', label: 'Animaux', emoji: '🐶', color: '#4ECDC4' },
  { id: 'shapes', label: 'Formes', emoji: '⬛', color: '#95E1D3' },
  { id: 'colors', label: 'Couleurs', emoji: '🔴', color: '#F38181' },
  { id: 'numbers', label: 'Nombres', emoji: '1️⃣', color: '#AA96DA' },
];

const SIZES: { value: SudokuSize; label: string; description: string }[] = [
  { value: 4, label: '4×4', description: 'Facile' },
  { value: 6, label: '6×6', description: 'Moyen' },
  { value: 9, label: '9×9', description: 'Expert' },
];

const DIFFICULTIES: { value: SudokuDifficulty; stars: string; label: string }[] = [
  { value: 1, stars: '⭐', label: 'Découverte' },
  { value: 2, stars: '⭐⭐', label: 'Défi' },
  { value: 3, stars: '⭐⭐⭐', label: 'Expert' },
];

// Owl messages based on game state
type OwlMessageType = 'intro' | 'hint' | 'encourage' | 'victory';

const getOwlMessage = (
  isPlaying: boolean,
  isVictory: boolean,
  errorCount: number,
  progress: number
): { message: string; type: OwlMessageType } => {
  if (isVictory) {
    return { message: 'Bravo ! Tu as complété la grille ! 🎉', type: 'victory' };
  }
  if (errorCount > 5) {
    return { message: 'Prends ton temps, tu vas y arriver ! 💪', type: 'encourage' };
  }
  if (progress > 0.7) {
    return { message: 'Plus que quelques cases ! Tu y es presque ! ✨', type: 'encourage' };
  }
  if (!isPlaying) {
    return { message: 'Choisis ta grille et lance-toi ! 🎯', type: 'intro' };
  }
  return { message: 'Regarde bien les lignes et colonnes ! 🤔', type: 'hint' };
};

export function SudokuIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Selection state
  const [selectedSize, setSelectedSize] = useState<SudokuSize>(4);
  const [selectedTheme, setSelectedTheme] = useState<SudokuTheme>('fruits');
  const [selectedDifficulty, setSelectedDifficulty] = useState<SudokuDifficulty>(1);

  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameConfig, setGameConfig] = useState<SudokuConfig | null>(null);

  // Parent zone state
  const [showParentZone, setShowParentZone] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('discovery');

  // Animation values
  const selectorY = useSharedValue(0);
  const selectorOpacity = useSharedValue(1);
  const gameOpacity = useSharedValue(0);
  const playButtonScale = useSharedValue(1);

  const handleStartGame = useCallback(() => {
    const config: SudokuConfig = {
      size: selectedSize,
      theme: selectedTheme,
      difficulty: selectedDifficulty,
      showConflicts: true,
      allowAnnotations: selectedSize >= 6,
    };

    setGameConfig(config);

    // Animations
    selectorY.value = withTiming(-200, { duration: 400, easing: Easing.out(Easing.quad) });
    selectorOpacity.value = withTiming(0, { duration: 300 });
    gameOpacity.value = withTiming(1, { duration: 400 });

    setTimeout(() => setIsPlaying(true), 300);
  }, [selectedSize, selectedTheme, selectedDifficulty, selectorY, selectorOpacity, gameOpacity]);

  const handleBack = () => {
    if (isPlaying) {
      // Return to selection
      setIsPlaying(false);
      setGameConfig(null);
      selectorY.value = withSpring(0, { damping: 15 });
      selectorOpacity.value = withTiming(1, { duration: 300 });
      gameOpacity.value = withTiming(0, { duration: 200 });
    } else {
      router.back();
    }
  };

  const handlePlay = () => {
    playButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    handleStartGame();
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
  };

  // Animated styles
  const selectorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: selectorY.value }],
    opacity: selectorOpacity.value,
  }));

  const gameStyle = useAnimatedStyle(() => ({
    opacity: gameOpacity.value,
  }));

  return (
    <SudokuBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + spacing[2],
            paddingBottom: insets.bottom + spacing[2],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>←</Text>
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerEmoji}>🧩</Text>
            <Text style={styles.headerTitle}>Sudoku Montessori</Text>
            <Text style={styles.headerEmoji}>✨</Text>
          </View>

          <View style={styles.headerRightButtons}>
            <Pressable onPress={() => setShowParentZone(!showParentZone)} style={styles.parentButton}>
              <Text style={styles.parentButtonIcon}>👨‍👩‍👧</Text>
            </Pressable>
          </View>
        </View>

        {/* Mascot messages */}
        {!isPlaying && (
          <Animated.View entering={FadeIn} style={styles.mascotBubble}>
            <Text style={styles.mascotEmoji}>🦊</Text>
            <View style={styles.mascotMessageContainer}>
              <Text style={styles.mascotMessage}>Choisis ta grille et lance-toi ! 🎯</Text>
            </View>
          </Animated.View>
        )}

        {/* Level Selector - slides up when playing */}
        <Animated.View
          style={[styles.selectorContainer, selectorStyle]}
          pointerEvents={isPlaying ? 'none' : 'auto'}
        >
          <ScrollView
            contentContainerStyle={styles.selectorContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Theme selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choisis un thème</Text>
              <View style={styles.themeGrid}>
                {THEMES.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <Pressable
                      key={theme.id}
                      onPress={() => setSelectedTheme(theme.id)}
                      style={[
                        styles.themeButton,
                        isSelected && styles.themeButtonSelected,
                        { borderColor: theme.color },
                      ]}
                    >
                      <Text style={styles.themeEmoji}>{theme.emoji}</Text>
                      <Text style={[styles.themeLabel, isSelected && styles.themeLabelSelected]}>
                        {theme.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Size selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choisis une taille</Text>
              <View style={styles.sizeGrid}>
                {SIZES.map((size) => {
                  const isSelected = selectedSize === size.value;
                  return (
                    <Pressable
                      key={size.value}
                      onPress={() => setSelectedSize(size.value)}
                      style={[
                        styles.sizeButton,
                        isSelected && styles.sizeButtonSelected,
                      ]}
                    >
                      <Text style={[styles.sizeNumber, isSelected && styles.sizeNumberSelected]}>
                        {size.label}
                      </Text>
                      <Text style={[styles.sizeDescription, isSelected && styles.sizeDescriptionSelected]}>
                        {size.description}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Difficulty selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choisis une difficulté</Text>
              <View style={styles.difficultyGrid}>
                {DIFFICULTIES.map((diff) => {
                  const isSelected = selectedDifficulty === diff.value;
                  return (
                    <Pressable
                      key={diff.value}
                      onPress={() => setSelectedDifficulty(diff.value)}
                      style={[
                        styles.difficultyButton,
                        isSelected && styles.difficultyButtonSelected,
                      ]}
                    >
                      <Text style={styles.difficultyStars}>{diff.stars}</Text>
                      <Text style={[styles.difficultyLabel, isSelected && styles.difficultyLabelSelected]}>
                        {diff.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Play button */}
            <Animated.View style={{ transform: [{ scale: playButtonScale }], alignItems: 'center' }}>
              <Pressable onPress={handlePlay} style={styles.playButton}>
                <Text style={styles.playButtonIcon}>▶</Text>
                <Text style={styles.playButtonText}>Jouer</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </Animated.View>

        {/* Game Screen - appears when playing */}
        {gameConfig && (
          <Animated.View
            style={[styles.gameContainer, gameStyle]}
            pointerEvents={isPlaying ? 'auto' : 'none'}
          >
            <SudokuGameScreen
              config={gameConfig}
              gameMode={gameMode}
              onBack={handleBack}
            />
          </Animated.View>
        )}

        {/* Parent Zone */}
        <ParentZone
          progression={0}
          maxProgression={100}
          hintsRemaining={3}
          maxHints={3}
          currentMode={gameMode}
          onModeChange={handleModeChange}
          onHintPress={() => {}}
          isVisible={showParentZone}
        />
      </View>
    </SudokuBackground>
  );
}

// Separate game screen component
function SudokuGameScreen({
  config,
  gameMode,
  onBack,
}: {
  config: SudokuConfig;
  gameMode: GameMode;
  onBack: () => void;
}) {
  const {
    gameState,
    selectedSymbol,
    errorCount,
    handleCellPress,
    handleSymbolSelect,
    handleClearCell,
    handleUndo,
    handleHint,
    handleReset,
    handleVerify,
  } = useSudokuGame({
    config,
    onComplete: (stats) => {
      console.log('Game completed!', stats);
    },
  });

  const progress = gameState.grid.cells.flat().filter(c => c.value !== null).length /
    (config.size * config.size);

  const owlState = getOwlMessage(true, gameState.isComplete, errorCount, progress);

  return (
    <View style={styles.gameContent}>
      {/* Mascot with contextual messages */}
      {!gameState.isComplete && (
        <View style={styles.gameMascotBubble}>
          <Text style={styles.mascotEmoji}>🦊</Text>
          <View style={styles.mascotMessageContainer}>
            <Text style={styles.mascotMessage}>{owlState.message}</Text>
          </View>
        </View>
      )}

      {/* Game HUD */}
      <View style={styles.gameHud}>
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>Erreurs</Text>
          <Text style={styles.hudValue}>{errorCount}</Text>
        </View>
        <View style={styles.hudDivider} />
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>Indices</Text>
          <Text style={styles.hudValueOptimal}>{gameState.hintsUsed}</Text>
        </View>
        <Pressable onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>↻</Text>
        </Pressable>
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        <SudokuGrid
          grid={gameState.grid}
          selectedCell={gameState.selectedCell}
          onCellPress={handleCellPress}
          showConflicts={config.showConflicts}
        />
      </View>

      {/* Symbol selector */}
      <SymbolSelector
        symbols={gameState.grid.symbols}
        onSymbolSelect={handleSymbolSelect}
        selectedSymbol={selectedSymbol}
        onClear={handleClearCell}
        theme={config.theme}
      />

      {/* Victory overlay */}
      {gameState.isComplete && (
        <Animated.View entering={FadeIn} style={styles.victoryOverlay}>
          <View style={styles.victoryCard}>
            <Text style={styles.victoryTitle}>🎉 Bravo !</Text>
            <Text style={styles.victoryText}>
              Tu as complété la grille {config.size}×{config.size} !
            </Text>
            <Text style={styles.victoryStats}>
              Indices utilisés: {gameState.hintsUsed}
            </Text>
            <Text style={styles.victoryStats}>
              Erreurs: {errorCount}
            </Text>
            <Pressable onPress={handleReset} style={styles.playAgainButton}>
              <Text style={styles.playAgainText}>Rejouer</Text>
            </Pressable>
            <Pressable onPress={onBack} style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Menu</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* Floating action buttons */}
      <View style={styles.floatingButtons}>
        <Pressable onPress={() => handleHint()} style={styles.floatingButton}>
          <Text style={styles.floatingButtonText}>💡</Text>
        </Pressable>
        <Pressable onPress={handleVerify} style={styles.floatingButton}>
          <Text style={styles.floatingButtonText}>✓</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  headerButton: {
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  headerButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  parentButton: {
    height: 40,
    paddingHorizontal: spacing[3],
    borderRadius: 20,
    backgroundColor: '#FFA94D',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing[1],
    ...shadows.sm,
  },
  parentButtonIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: '#E8943D',
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: 22,
    overflow: 'hidden',
  },
  mascotBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[3],
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    ...shadows.md,
  },
  mascotEmoji: {
    fontSize: 32,
    marginRight: spacing[2],
  },
  mascotMessageContainer: {
    flex: 1,
  },
  mascotMessage: {
    ...textStyles.body,
    color: colors.text.primary,
  },
  selectorContainer: {
    flex: 1,
  },
  selectorContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  section: {
    marginBottom: spacing[5],
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    justifyContent: 'center',
  },
  themeButton: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 3,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  themeButtonSelected: {
    backgroundColor: colors.primary.light + '20',
  },
  themeEmoji: {
    fontSize: 32,
    marginBottom: spacing[1],
  },
  themeLabel: {
    ...textStyles.body,
    color: colors.text.secondary,
    fontSize: 14,
  },
  themeLabelSelected: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  sizeGrid: {
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
  },
  sizeButton: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 3,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  sizeButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main,
  },
  sizeNumber: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  sizeNumberSelected: {
    color: colors.primary.contrast,
  },
  sizeDescription: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  sizeDescriptionSelected: {
    color: colors.primary.contrast,
  },
  difficultyGrid: {
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
  },
  difficultyButton: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    minWidth: 80,
    minHeight: touchTargets.large,
    borderWidth: 3,
    borderColor: 'transparent',
    justifyContent: 'center',
    ...shadows.sm,
  },
  difficultyButtonSelected: {
    borderColor: colors.secondary.main,
    backgroundColor: colors.secondary.light + '20',
  },
  difficultyStars: {
    fontSize: 20,
    marginBottom: spacing[1],
  },
  difficultyLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  difficultyLabelSelected: {
    color: colors.secondary.main,
    fontWeight: '600',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.full,
    marginTop: spacing[4],
    ...shadows.lg,
  },
  playButtonIcon: {
    fontSize: 24,
    color: colors.primary.contrast,
  },
  playButtonText: {
    ...textStyles.h3,
    color: colors.primary.contrast,
  },
  gameContainer: {
    ...StyleSheet.absoluteFillObject,
    top: 80, // Below header
  },
  gameContent: {
    flex: 1,
  },
  gameMascotBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[2],
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    ...shadows.sm,
  },
  gameHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    gap: spacing[4],
  },
  hudItem: {
    alignItems: 'center',
  },
  hudLabel: {
    ...textStyles.caption,
    color: colors.text.muted,
  },
  hudValue: {
    ...textStyles.h3,
    color: colors.primary.main,
  },
  hudValueOptimal: {
    ...textStyles.h3,
    color: colors.feedback.success,
  },
  hudDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.background.secondary,
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing[2],
    ...shadows.sm,
  },
  resetButtonText: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  victoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  victoryCard: {
    backgroundColor: colors.background.card,
    padding: spacing[6],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    maxWidth: '80%',
    ...shadows.lg,
  },
  victoryTitle: {
    fontSize: 48,
    marginBottom: spacing[4],
  },
  victoryText: {
    ...textStyles.h2,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  victoryStats: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  playAgainButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.md,
    marginTop: spacing[4],
  },
  playAgainText: {
    ...textStyles.button,
    color: colors.primary.contrast,
  },
  menuButton: {
    paddingVertical: spacing[3],
    marginTop: spacing[3],
  },
  menuButtonText: {
    ...textStyles.button,
    color: colors.primary.main,
  },
  floatingButtons: {
    position: 'absolute',
    right: spacing[4],
    bottom: 100,
    gap: spacing[3],
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  floatingButtonText: {
    fontSize: 24,
  },
});
