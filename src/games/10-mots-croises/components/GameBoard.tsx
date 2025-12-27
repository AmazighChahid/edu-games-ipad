/**
 * Mots Croisés GameBoard Component
 *
 * Plateau de jeu complet pour les mots croisés
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows, fontFamily } from '../../../theme';
import { useAccessibilityAnimations } from '../../../hooks';
import type { CrosswordGameState } from '../types';
import { CrosswordGrid } from './CrosswordGrid';
import { ClueList } from './ClueList';
import { Keyboard } from './Keyboard';

// ============================================================================
// TYPES
// ============================================================================

interface GameBoardProps {
  /** État du jeu */
  gameState: CrosswordGameState;
  /** Pourcentage de complétion */
  completionPercent: number;
  /** Callback sélection cellule */
  onCellPress: (row: number, col: number) => void;
  /** Callback entrée lettre */
  onLetterInput: (letter: string) => void;
  /** Callback suppression */
  onDelete: () => void;
  /** Callback sélection mot */
  onWordSelect: (wordId: string) => void;
  /** Callback révéler lettre */
  onRevealLetter: () => void;
  /** Callback pause */
  onPause: () => void;
  /** Callback retour */
  onBack: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_TABLET = SCREEN_WIDTH >= 768;

// ============================================================================
// COMPONENT
// ============================================================================

export function GameBoard({
  gameState,
  completionPercent,
  onCellPress,
  onLetterInput,
  onDelete,
  onWordSelect,
  onRevealLetter,
  onPause,
  onBack,
}: GameBoardProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();
  const { level, timeElapsed, hintsUsed, completedWordIds, words } = gameState;

  // Formater le temps
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Séparer les mots horizontaux et verticaux
  const horizontalWords = words.filter((w) => w.direction === 'horizontal');
  const verticalWords = words.filter((w) => w.direction === 'vertical');

  // Définition actuelle
  const currentWord = gameState.selectedWordId
    ? words.find((w) => w.id === gameState.selectedWordId)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View
        style={styles.header}
        entering={shouldAnimate ? FadeInUp.duration(getDuration(300)) : undefined}
      >
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>

        <View style={styles.levelInfo}>
          <Text style={styles.levelName}>{level.themeEmoji} {level.name}</Text>
          <Text style={styles.levelDifficulty}>
            {'⭐'.repeat(level.difficulty)}{'☆'.repeat(3 - level.difficulty)}
          </Text>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statValue}>⏱️ {formatTime(timeElapsed)}</Text>
        </View>

        <Pressable style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseButtonText}>⏸️</Text>
        </Pressable>
      </Animated.View>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: `${completionPercent}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedWordIds.length}/{words.length} mots trouvés
        </Text>
      </View>

      {/* Corps principal */}
      <View style={styles.body}>
        {IS_TABLET ? (
          // Layout tablette
          <View style={styles.tabletLayout}>
            <View style={styles.tabletLeft}>
              <CrosswordGrid
                gameState={gameState}
                onCellPress={onCellPress}
              />
            </View>
            <View style={styles.tabletRight}>
              <ClueList
                horizontalWords={horizontalWords}
                verticalWords={verticalWords}
                completedWordIds={completedWordIds}
                selectedWordId={gameState.selectedWordId}
                onWordSelect={onWordSelect}
              />
            </View>
          </View>
        ) : (
          // Layout téléphone
          <ScrollView style={styles.phoneLayout}>
            <CrosswordGrid
              gameState={gameState}
              onCellPress={onCellPress}
            />

            {/* Définition actuelle */}
            {currentWord && (
              <View style={styles.currentClue}>
                <Text style={styles.currentClueNumber}>
                  {currentWord.number}. {currentWord.direction === 'horizontal' ? '→' : '↓'}
                </Text>
                <Text style={styles.currentClueText}>
                  {currentWord.emoji && `${currentWord.emoji} `}{currentWord.clue}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Bouton indice */}
      <View style={styles.hintContainer}>
        <Pressable
          style={[
            styles.hintButton,
            hintsUsed >= level.hintsAvailable && styles.hintButtonDisabled,
          ]}
          onPress={onRevealLetter}
          disabled={hintsUsed >= level.hintsAvailable}
        >
          <Text style={styles.hintButtonText}>
            💡 Indice ({level.hintsAvailable - hintsUsed})
          </Text>
        </Pressable>
      </View>

      {/* Clavier */}
      <Keyboard
        onLetterPress={onLetterInput}
        onDelete={onDelete}
        disabled={gameState.phase !== 'playing'}
      />
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  levelInfo: {
    flex: 1,
    alignItems: 'center',
  },
  levelName: {
    fontSize: 16,
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  levelDifficulty: {
    fontSize: 12,
    marginTop: 2,
  },
  stats: {
    marginRight: spacing[2],
  },
  statValue: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.text.secondary,
  },
  pauseButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  pauseButtonText: {
    fontSize: 20,
  },
  progressContainer: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary.main,
    borderRadius: borderRadius.round,
  },
  progressText: {
    fontSize: 11,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing[1],
  },
  body: {
    flex: 1,
  },
  tabletLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  tabletLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  tabletRight: {
    width: 280,
  },
  phoneLayout: {
    flex: 1,
  },
  currentClue: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  currentClueNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary.main,
    marginBottom: spacing[1],
  },
  currentClueText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 22,
  },
  hintContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    alignItems: 'center',
  },
  hintButton: {
    backgroundColor: colors.secondary.main,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.round,
    ...shadows.sm,
  },
  hintButtonDisabled: {
    opacity: 0.4,
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
});

export default GameBoard;
