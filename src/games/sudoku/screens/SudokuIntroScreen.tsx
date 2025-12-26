/**
 * Sudoku Intro + Game Screen
 * Unified screen with level selection and gameplay
 */

import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '@/theme';
import { IconButton } from '@/components/common';
import { AssistantBubble } from '@/components/assistant';
import { GameContainer } from '@/components/layout';
// import { ParentZone, type GameMode } from '@/components/parent/ParentZone';

type GameMode = 'discovery' | 'challenge' | 'expert';

import { SudokuGrid, SymbolSelector } from '../components';
import { useSudokuGame } from '../hooks/useSudokuGame';
import type { SudokuSize, SudokuTheme, SudokuDifficulty, SudokuConfig } from '../types';

const THEMES: { id: SudokuTheme; label: string; emoji: string }[] = [
  { id: 'fruits', label: 'Fruits', emoji: '🍎' },
  { id: 'animals', label: 'Animaux', emoji: '🐶' },
  { id: 'shapes', label: 'Formes', emoji: '⬛' },
  { id: 'colors', label: 'Couleurs', emoji: '🔴' },
  { id: 'numbers', label: 'Nombres', emoji: '123' },
];

const SIZES: { value: SudokuSize; label: string }[] = [
  { value: 4, label: '4×4 (Facile)' },
  { value: 6, label: '6×6 (Moyen)' },
  { value: 9, label: '9×9 (Expert)' },
];

export function SudokuIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Configuration state
  const [selectedSize, setSelectedSize] = useState<SudokuSize>(4);
  const [selectedTheme, setSelectedTheme] = useState<SudokuTheme>('fruits');
  const [selectedDifficulty, setSelectedDifficulty] = useState<SudokuDifficulty>(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Game configuration - only set when starting
  const [gameConfig, setGameConfig] = useState<SudokuConfig | null>(null);

  // Parent zone state
  const [showParentZone, setShowParentZone] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('discovery');

  // Assistant state
  const [assistantMessage, setAssistantMessage] = useState<string>(
    'Choisis une grille pour commencer ! 🦊'
  );

  const handleStartGame = useCallback(() => {
    // Create config with current selections
    const config: SudokuConfig = {
      size: selectedSize,
      theme: selectedTheme,
      difficulty: selectedDifficulty,
      showConflicts: true,
      allowAnnotations: selectedSize >= 6,
    };

    setGameConfig(config);
    setIsPlaying(true);
    setAssistantMessage('Choisis une case vide !');
  }, [selectedSize, selectedTheme, selectedDifficulty]);

  if (!isPlaying) {
    return (
      <GameContainer>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <IconButton icon={<Text style={{fontSize: 24}}>⬅️</Text>} onPress={() => router.back()} accessibilityLabel="Retour" />
            <Text style={textStyles.h1}>Sudoku Montessori</Text>
            <IconButton
              icon={<Text style={{fontSize: 24}}>👨‍👩‍👧</Text>}
              onPress={() => setShowParentZone(true)}
              accessibilityLabel="Parents"
            />
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Theme selection */}
            <View style={styles.section}>
              <Text style={textStyles.h2}>Choisis un thème</Text>
              <View style={styles.optionsRow}>
                {THEMES.map((theme) => (
                  <Pressable
                    key={theme.id}
                    onPress={() => setSelectedTheme(theme.id)}
                    style={[
                      styles.optionCard,
                      selectedTheme === theme.id && styles.optionCardSelected,
                    ]}
                  >
                    <Text style={styles.optionEmoji}>{theme.emoji}</Text>
                    <Text style={styles.optionLabel}>{theme.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Size selection */}
            <View style={styles.section}>
              <Text style={textStyles.h2}>Choisis une taille</Text>
              <View style={styles.optionsColumn}>
                {SIZES.map((size) => (
                  <Pressable
                    key={size.value}
                    onPress={() => setSelectedSize(size.value)}
                    style={[
                      styles.sizeButton,
                      selectedSize === size.value && styles.sizeButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sizeLabel,
                        selectedSize === size.value && styles.sizeLabelSelected,
                      ]}
                    >
                      {size.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Difficulty selection */}
            <View style={styles.section}>
              <Text style={textStyles.h2}>Choisis une difficulté</Text>
              <View style={styles.optionsRow}>
                {[1, 2, 3].map((diff) => (
                  <Pressable
                    key={diff}
                    onPress={() => setSelectedDifficulty(diff as SudokuDifficulty)}
                    style={[
                      styles.difficultyButton,
                      selectedDifficulty === diff && styles.difficultyButtonSelected,
                    ]}
                  >
                    <Text style={styles.starText}>{'⭐'.repeat(diff)}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Start button */}
            <Pressable onPress={handleStartGame} style={styles.startButton}>
              <Text style={styles.startButtonText}>Commencer 🎯</Text>
            </Pressable>
          </ScrollView>

          {/* Assistant */}
          {assistantMessage && (
            <AssistantBubble
              message={{
                id: 'intro-' + Date.now(),
                text: assistantMessage,
                duration: 5000,
                mood: 'happy',
                triggerType: 'game_start',
              }}
              mood="happy"
              onDismiss={() => setAssistantMessage('')}
            />
          )}
        </View>
      </GameContainer>
    );
  }

  // Game screen - only render if we have a config
  if (!gameConfig) return null;

  return <SudokuGameScreen
    config={gameConfig}
    onBack={() => {
      setIsPlaying(false);
      setGameConfig(null);
    }}
    assistantMessage={assistantMessage}
    setAssistantMessage={setAssistantMessage}
  />;
}

// Separate component for the game screen to properly use the hook
function SudokuGameScreen({
  config,
  onBack,
  assistantMessage,
  setAssistantMessage,
}: {
  config: SudokuConfig;
  onBack: () => void;
  assistantMessage: string;
  setAssistantMessage: (msg: string) => void;
}) {
  const insets = useSafeAreaInsets();

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
      setAssistantMessage('🎉 Bravo champion !');
    },
  });

  const handleShowHint = useCallback(() => {
    const hint = handleHint();
    if (hint) {
      if (hint.possibilities.length === 1) {
        setAssistantMessage('💡 Regarde cette case !');
      } else {
        setAssistantMessage('💡 Cherche une case facile.');
      }
    }
  }, [handleHint, setAssistantMessage]);

  const handleCheckGrid = useCallback(() => {
    const isValid = handleVerify();
    if (isValid) {
      setAssistantMessage('✅ Super ! Continue !');
    } else {
      setAssistantMessage('⚠️ Regarde bien les cases oranges.');
    }
  }, [handleVerify, setAssistantMessage]);

  return (
    <GameContainer>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Game header */}
        <View style={styles.gameHeader}>
          <IconButton icon={<Text style={{fontSize: 24}}>🏠</Text>} onPress={onBack} accessibilityLabel="Menu" />
          <View style={styles.gameInfo}>
            <Text style={styles.gameInfoText}>
              {config.size}×{config.size} {'⭐'.repeat(config.difficulty)}
            </Text>
            {errorCount > 0 && (
              <Text style={styles.errorText}>Erreurs: {errorCount}</Text>
            )}
          </View>
          <View style={styles.headerButtons}>
            <IconButton icon={<Text style={{fontSize: 20}}>💡</Text>} onPress={handleShowHint} accessibilityLabel="Indice" />
            <IconButton icon={<Text style={{fontSize: 20}}>✓</Text>} onPress={handleCheckGrid} accessibilityLabel="Vérifier" />
            <IconButton icon={<Text style={{fontSize: 20}}>🔄</Text>} onPress={handleReset} accessibilityLabel="Reset" />
          </View>
        </View>

        {/* Grid */}
        <View style={styles.gameContent}>
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

        {/* Assistant messages */}
        {assistantMessage && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <AssistantBubble
              message={{
                id: 'game-' + Date.now(),
                text: assistantMessage,
                duration: 5000,
                mood: 'encouraging',
                triggerType: 'hint_requested',
              }}
              mood="encouraging"
              onDismiss={() => setAssistantMessage('')}
            />
          </Animated.View>
        )}

        {/* Victory overlay */}
        {gameState.isComplete && (
          <Animated.View
            entering={FadeIn}
            style={styles.victoryOverlay}
          >
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
      </View>

      {/* Parent zone modal - TODO: Implement with correct props */}
      {/* {showParentZone && (
        <View>
          <Text>Parent Zone Coming Soon</Text>
        </View>
      )} */}
    </GameContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[4],
  },
  section: {
    marginBottom: spacing[6],
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginTop: spacing[3],
  },
  optionsColumn: {
    gap: spacing[3],
    marginTop: spacing[3],
  },
  optionCard: {
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    minWidth: 100,
    minHeight: 64, // UX guide: 64dp minimum touch target
    borderWidth: 2,
    borderColor: colors.ui.border,
    ...shadows.sm,
  },
  optionCardSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '20',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  optionLabel: {
    ...textStyles.body,
    textAlign: 'center',
  },
  sizeButton: {
    padding: spacing[4],
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.card,
    minHeight: 64, // UX guide: 64dp minimum touch target
    borderWidth: 2,
    borderColor: colors.ui.border,
    justifyContent: 'center',
  },
  sizeButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '20',
  },
  sizeLabel: {
    ...textStyles.button,
    textAlign: 'center',
  },
  sizeLabelSelected: {
    color: colors.primary.main,
  },
  difficultyButton: {
    padding: spacing[4],
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.ui.border,
    minWidth: 80,
    minHeight: 64, // UX guide: 64dp minimum touch target
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyButtonSelected: {
    borderColor: colors.secondary.main,
    backgroundColor: colors.secondary.light + '20',
  },
  starText: {
    fontSize: 24,
  },
  startButton: {
    backgroundColor: colors.primary.main,
    padding: spacing[5],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  startButtonText: {
    ...textStyles.h2,
    color: colors.primary.contrast,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  gameInfo: {
    alignItems: 'center',
  },
  gameInfoText: {
    ...textStyles.h3,
  },
  errorText: {
    ...textStyles.caption,
    color: colors.sudoku.symbolConflict, // Orange, not aggressive red
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  gameContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
