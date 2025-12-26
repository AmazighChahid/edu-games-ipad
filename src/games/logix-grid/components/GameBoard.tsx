/**
 * Logix Grid GameBoard Component
 *
 * Plateau de jeu complet pour Logix Grid
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows, fontFamily } from '@/theme';
import { useAccessibilityAnimations } from '@/hooks';
import type { LogixGameState, CellState } from '../types';
import { LogixGrid } from './LogixGrid';
import { CluePanel } from './CluePanel';

// ============================================================================
// TYPES
// ============================================================================

interface GameBoardProps {
  /** État du jeu */
  gameState: LogixGameState;
  /** Erreurs dans la grille */
  errors: Array<{ rowItemId: string; colItemId: string }>;
  /** Callback toggle cellule */
  onCellToggle: (rowItemId: string, colItemId: string) => void;
  /** Callback sélection cellule */
  onCellSelect: (rowItemId: string | null, colItemId: string | null) => void;
  /** Callback utilisation d'un indice */
  onClueUse: (clueId: string) => void;
  /** Callback demande d'indice */
  onHintRequest: () => void;
  /** Obtient l'état d'une cellule */
  getCellState: (rowItemId: string, colItemId: string) => CellState;
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
  errors,
  onCellToggle,
  onCellSelect,
  onClueUse,
  onHintRequest,
  getCellState,
  onPause,
  onBack,
}: GameBoardProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();
  const { puzzle, usedClueIds, hintsUsed, timeElapsed, activeHint } = gameState;

  // Formater le temps
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculer la progression
  const progress = (usedClueIds.length / puzzle.clues.length) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View
        style={styles.header}
        entering={shouldAnimate ? FadeInUp.duration(getDuration(300)) : undefined}
      >
        {/* Bouton retour */}
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>

        {/* Infos niveau */}
        <View style={styles.levelInfo}>
          <Text style={styles.levelName}>{puzzle.name}</Text>
          <Text style={styles.levelDifficulty}>
            {'⭐'.repeat(puzzle.difficulty)}{'☆'.repeat(3 - puzzle.difficulty)}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>{formatTime(timeElapsed)}</Text>
          </View>
        </View>

        {/* Bouton pause */}
        <Pressable style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseButtonText}>⏸️</Text>
        </Pressable>
      </Animated.View>

      {/* Corps principal */}
      <View style={IS_TABLET ? styles.bodyTablet : styles.bodyPhone}>
        {/* Panneau des indices */}
        <View style={IS_TABLET ? styles.cluePanelTablet : styles.cluePanelPhone}>
          <CluePanel
            clues={puzzle.clues}
            usedClueIds={usedClueIds}
            activeClueId={activeHint?.clueId ?? null}
            onCluePress={onClueUse}
          />
        </View>

        {/* Grille */}
        <View style={IS_TABLET ? styles.gridContainerTablet : styles.gridContainerPhone}>
          <LogixGrid
            gameState={gameState}
            errors={errors}
            onCellToggle={onCellToggle}
            onCellSelect={onCellSelect}
            getCellState={getCellState}
          />
        </View>
      </View>

      {/* Boutons de contrôle */}
      <Animated.View
        style={styles.controls}
        entering={shouldAnimate ? FadeIn.delay(200).duration(getDuration(300)) : undefined}
      >
        {/* Bouton indice */}
        <Pressable
          style={[
            styles.controlButton,
            styles.hintButton,
            hintsUsed >= puzzle.hintsAvailable && styles.controlButtonDisabled,
          ]}
          onPress={onHintRequest}
          disabled={hintsUsed >= puzzle.hintsAvailable}
        >
          <Text style={styles.controlButtonText}>💡</Text>
          <Text style={styles.controlButtonLabel}>
            Indice ({puzzle.hintsAvailable - hintsUsed})
          </Text>
        </Pressable>
      </Animated.View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructions}>
          Touche une case pour marquer ✓ ou ✗
        </Text>
      </View>
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
    height: 60,
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
    fontSize: 18,
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  levelDifficulty: {
    fontSize: 14,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  statIcon: {
    fontSize: 16,
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
  bodyTablet: {
    flex: 1,
    flexDirection: 'row',
  },
  bodyPhone: {
    flex: 1,
    flexDirection: 'column',
  },
  cluePanelTablet: {
    width: '35%',
    maxWidth: 300,
  },
  cluePanelPhone: {
    height: 180,
  },
  gridContainerTablet: {
    flex: 1,
  },
  gridContainerPhone: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  controlButtonDisabled: {
    opacity: 0.4,
  },
  hintButton: {
    backgroundColor: colors.secondary.main,
  },
  controlButtonText: {
    fontSize: 24,
  },
  controlButtonLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  instructionsContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  instructions: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default GameBoard;
