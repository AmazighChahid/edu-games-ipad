/**
 * CrosswordGrid Component
 *
 * Grille de mots croisés
 * Refactorisé pour supporter les nouvelles props et respecter les guidelines UX
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows } from '../../../theme';
import { useAccessibilityAnimations } from '../../../hooks';
import type { CrosswordCell as CellType, CrosswordWord } from '../types';
import { CrosswordCell } from './CrosswordCell';

// ============================================================================
// TYPES
// ============================================================================

interface CrosswordGridProps {
  /** Grille de cellules */
  grid: CellType[][];
  /** Cellule sélectionnée */
  selectedCell: { row: number; col: number } | null;
  /** ID du mot sélectionné */
  selectedWordId: string | null;
  /** Liste des mots */
  words: CrosswordWord[];
  /** Callback sélection cellule */
  onCellPress: (row: number, col: number) => void;
  /** Phase du jeu (optionnel) */
  phase?: 'intro' | 'playing' | 'paused' | 'victory';
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16;
const MAX_CELL_SIZE = 45;
const MIN_CELL_SIZE = 32;

// ============================================================================
// COMPONENT
// ============================================================================

export function CrosswordGrid({
  grid,
  selectedCell,
  selectedWordId,
  words,
  onCellPress,
  phase = 'playing',
}: CrosswordGridProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  // Calculer le nombre de colonnes
  const numCols = grid[0]?.length || 6;

  // Calculer la taille des cellules
  const availableWidth = SCREEN_WIDTH - GRID_PADDING * 2;
  const cellSize = Math.max(
    MIN_CELL_SIZE,
    Math.min(MAX_CELL_SIZE, Math.floor(availableWidth / numCols) - 2)
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
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                }
                isInSelectedWord={isCellInSelectedWord(rowIndex, colIndex)}
                onPress={() => onCellPress(rowIndex, colIndex)}
                disabled={phase !== 'playing'}
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
