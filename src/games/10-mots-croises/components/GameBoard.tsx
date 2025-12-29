/**
 * Mots Croisés GameBoard Component
 *
 * Plateau de jeu complet pour les mots croisés
 * Refactorisé pour utiliser les composants communs et respecter les guidelines UX
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
  fontSize,
  touchTargets,
} from '../../../theme';
import { PageContainer } from '../../../components/common';
import { Icons } from '../../../constants/icons';
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

  // Générer les étoiles de difficulté
  const renderDifficultyStars = () => {
    const stars = [];
    for (let i = 1; i <= 3; i++) {
      stars.push(
        <Text
          key={i}
          style={i <= level.difficulty ? styles.starFilled : styles.starEmpty}
        >
          {i <= level.difficulty ? Icons.star : Icons.starEmpty}
        </Text>
      );
    }
    return stars;
  };

  return (
    <PageContainer scrollable={false}>
      {/* Header custom avec temps et pause */}
      <View style={styles.header}>
        {/* Bouton retour */}
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Retour"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>{Icons.back}</Text>
        </Pressable>

        {/* Titre */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>
            {level.themeEmoji} {level.name}
          </Text>
        </View>

        {/* Temps et pause */}
        <View style={styles.headerRight}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>{Icons.timer}</Text>
            <Text style={styles.timeValue}>{formatTime(timeElapsed)}</Text>
          </View>
          <Pressable
            style={styles.pauseButton}
            onPress={onPause}
            accessibilityLabel="Mettre en pause"
            accessibilityRole="button"
          >
            <Text style={styles.pauseButtonText}>{Icons.pause}</Text>
          </Pressable>
        </View>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.difficultyRow}>
          <View style={styles.starsContainer}>{renderDifficultyStars()}</View>
        </View>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, { width: `${completionPercent}%` }]}
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
                grid={gameState.grid}
                selectedCell={gameState.selectedCell}
                selectedWordId={gameState.selectedWordId}
                onCellPress={onCellPress}
                words={gameState.words}
              />
            </View>
            <View style={styles.tabletRight}>
              <ClueList
                words={words}
                completedWordIds={completedWordIds}
                selectedWordId={gameState.selectedWordId}
                onWordPress={onWordSelect}
              />
            </View>
          </View>
        ) : (
          // Layout téléphone
          <ScrollView style={styles.phoneLayout}>
            <CrosswordGrid
              grid={gameState.grid}
              selectedCell={gameState.selectedCell}
              selectedWordId={gameState.selectedWordId}
              onCellPress={onCellPress}
              words={gameState.words}
            />

            {/* Définition actuelle */}
            {currentWord && (
              <View style={styles.currentClue}>
                <Text style={styles.currentClueNumber}>
                  {currentWord.number}.{' '}
                  {currentWord.direction === 'horizontal'
                    ? Icons.arrowRight
                    : Icons.arrowDown}
                </Text>
                <Text style={styles.currentClueText}>
                  {currentWord.emoji && `${currentWord.emoji} `}
                  {currentWord.clue}
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
          accessibilityLabel={`Utiliser un indice. ${level.hintsAvailable - hintsUsed} restants`}
          accessibilityRole="button"
        >
          <Text style={styles.hintButtonIcon}>{Icons.lightbulb}</Text>
          <Text style={styles.hintButtonText}>
            Indice ({level.hintsAvailable - hintsUsed})
          </Text>
        </Pressable>
      </View>

      {/* Clavier */}
      <Keyboard
        onKeyPress={onLetterInput}
        onDelete={onDelete}
        disabled={gameState.phase !== 'playing'}
      />
    </PageContainer>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Header custom
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  backButton: {
    width: touchTargets.minimum, // 64dp minimum
    height: touchTargets.minimum,
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
  },
  timeIcon: {
    fontSize: fontSize.base,
  },
  timeValue: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.semiBold,
    color: colors.text.primary,
  },
  pauseButton: {
    width: touchTargets.minimum, // 64dp minimum
    height: touchTargets.minimum,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  pauseButtonText: {
    fontSize: 24,
  },

  // Progression
  progressContainer: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  difficultyRow: {
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  starFilled: {
    fontSize: fontSize.lg,
    color: colors.secondary.main,
  },
  starEmpty: {
    fontSize: fontSize.lg,
    color: colors.text.muted,
    opacity: 0.3,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.feedback.success,
    borderRadius: borderRadius.round,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing[1],
  },

  // Body layouts
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

  // Current clue
  currentClue: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  currentClueNumber: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.primary.main,
    marginBottom: spacing[1],
  },
  currentClueText: {
    fontSize: fontSize.lg, // 18pt minimum
    color: colors.text.primary,
    lineHeight: 26,
  },

  // Hint button
  hintContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    alignItems: 'center',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.secondary.main,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.round,
    minHeight: touchTargets.minimum, // 64dp minimum
    ...shadows.md,
  },
  hintButtonDisabled: {
    opacity: 0.4,
  },
  hintButtonIcon: {
    fontSize: 20,
  },
  hintButtonText: {
    fontSize: fontSize.lg, // 18pt minimum
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default GameBoard;
