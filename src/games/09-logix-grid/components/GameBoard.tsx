/**
 * Logix Grid GameBoard Component
 *
 * Plateau de jeu complet pour Logix Grid
 * Refactorisé avec ScreenHeader, PageContainer, touch targets 64dp et Icons
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { theme } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import { PageContainer, ScreenHeader, IconButton, HintButton } from '../../../components/common';
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

  // Calculer les indices restants
  const hintsRemaining = puzzle.hintsAvailable - hintsUsed;

  // Générer les étoiles de difficulté
  const difficultyStars = `${Icons.star.repeat(puzzle.difficulty)}${Icons.starEmpty.repeat(3 - puzzle.difficulty)}`;

  return (
    <PageContainer variant="playful">
      {/* Header */}
      <Animated.View
        entering={shouldAnimate ? FadeInUp.duration(getDuration(300)) : undefined}
      >
        <ScreenHeader
          variant="game"
          title={puzzle.name}
          emoji={Icons.search}
          onBack={onBack}
          showHelpButton={false}
          rightContent={
            <View style={styles.headerRight}>
              {/* Timer */}
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>{Icons.timer}</Text>
                <Text style={styles.statValue}>{formatTime(timeElapsed)}</Text>
              </View>
              {/* Pause button */}
              <IconButton
                icon={Icons.pause}
                onPress={onPause}
                size={64}
                variant="secondary"
                accessibilityLabel="Pause"
              />
            </View>
          }
        />
      </Animated.View>

      {/* Sous-header avec difficulté */}
      <View style={styles.subHeader}>
        <Text style={styles.difficultyText}>{difficultyStars}</Text>
      </View>

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
        <HintButton
          remaining={hintsRemaining}
          maxHints={puzzle.hintsAvailable}
          onPress={onHintRequest}
          disabled={hintsRemaining <= 0}
        />
      </Animated.View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructions}>
          Touche une case pour marquer {Icons.checkmark} ou {Icons.crossMark}
        </Text>
      </View>
    </PageContainer>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  subHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing[1],
  },
  difficultyText: {
    fontSize: theme.fontSize.lg, // 18pt
    fontFamily: theme.fontFamily.regular,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  statIcon: {
    fontSize: theme.fontSize.lg, // 18pt
  },
  statValue: {
    fontSize: theme.fontSize.lg, // 18pt
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.text.secondary,
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
    height: theme.spacing[4] * 11, // ~176dp (spacing[4]=16, donc 16*11=176)
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
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    gap: theme.spacing[2],
  },
  instructionsContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  instructions: {
    fontSize: theme.fontSize.lg, // 18pt minimum
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default GameBoard;
