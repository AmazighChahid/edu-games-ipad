/**
 * CrosswordGrid Component
 *
 * Grille de mots croisés
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows } from '../../../theme';
import { useAccessibilityAnimations } from '../../../hooks';
import type { CrosswordGameState, CrosswordCell as CellType } from '../types';
import { CrosswordCell } from './CrosswordCell';

// ============================================================================
// TYPES
// ============================================================================

interface CrosswordGridProps {
  /** État du jeu */
  gameState: CrosswordGameState;
  /** Callback sélection cellule */
  onCellPress: (row: number, col: number) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16;
const MAX_CELL_SIZE = 45;

// ============================================================================
// COMPONENT
// ============================================================================

export function CrosswordGrid({ gameState, onCellPress }: CrosswordGridProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();
  const { grid, level, selectedCell, selectedWordId, words } = gameState;

  // Calculer la taille des cellules
  const availableWidth = SCREEN_WIDTH - GRID_PADDING * 2;
  const cellSize = Math.min(
    MAX_CELL_SIZE,
    Math.floor(availableWidth / level.gridSize.cols) - 2
  );

  // Obtenir le mot sélectionné
  const selectedWord = words.find((w) => w.id === selectedWordId);

  // Vérifier si une cellule fait partie du mot sélectionné
  const isCellInSelectedWord = (row: number, col: number): boolean => {
    if (!selectedWord) return false;

    const { row: wordRow, col: wordCol, direction, word } = selectedWord;

    if (direction === 'horizontal') {
      return row === wordRow && col >= wordCol && col < wordCol + word.length;
    } else {
      return col === wordCol && row >= wordRow && row < wordRow + word.length;
    }
  };

  return (
    <Animated.View
      style={styles.container}
      entering={shouldAnimate ? FadeIn.duration(getDuration(300)) : undefined}
    >
      <View style={styles.gridContainer}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <CrosswordCell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                size={cellSize}
                isSelected={
                  selectedCell?.row === rowIndex &&
                  selectedCell?.col === colIndex
                }
                isInSelectedWord={isCellInSelectedWord(rowIndex, colIndex)}
                onPress={() => onCellPress(rowIndex, colIndex)}
                disabled={gameState.phase !== 'playing'}
              />
            ))}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: GRID_PADDING,
  },
  gridContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[2],
    ...shadows.lg,
  },
  row: {
    flexDirection: 'row',
  },
});

export default CrosswordGrid;
