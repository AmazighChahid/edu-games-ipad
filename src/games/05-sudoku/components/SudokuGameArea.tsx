/**
 * SudokuGameArea Component
 * Zone de jeu contenant la grille Sudoku et le sélecteur de symboles
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { colors, spacing } from '@/theme';
import type { SudokuState, SudokuValue } from '../types';
import { SudokuGrid } from './SudokuGrid';
import { SymbolSelector } from './SymbolSelector';

// ============================================
// TYPES
// ============================================

interface SudokuGameAreaProps {
  gameState: SudokuState;
  onCellPress: (row: number, col: number) => void;
  onSymbolSelect: (symbol: SudokuValue) => void;
  onClear: () => void;
  selectedSymbol: SudokuValue;
  showConflicts?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function SudokuGameArea({
  gameState,
  onCellPress,
  onSymbolSelect,
  onClear,
  selectedSymbol,
  showConflicts = true,
}: SudokuGameAreaProps) {
  const { grid, selectedCell } = gameState;

  // Calculer les symboles déjà utilisés (tous présents dans la grille)
  const usedSymbols = useMemo(() => {
    const used = new Set<SudokuValue>();

    // Compter les occurrences de chaque symbole
    const counts: Record<string, number> = {};
    grid.cells.flat().forEach((cell) => {
      if (cell.value !== null) {
        const key = String(cell.value);
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    // Un symbole est "utilisé" s'il apparaît autant de fois que la taille de la grille
    grid.symbols.forEach((symbol) => {
      if (symbol !== null) {
        const key = String(symbol);
        if (counts[key] >= grid.size) {
          used.add(symbol);
        }
      }
    });

    return used;
  }, [grid.cells, grid.symbols, grid.size]);

  return (
    <View style={styles.container}>
      {/* Grille Sudoku */}
      <View style={styles.gridContainer}>
        <SudokuGrid
          grid={grid}
          selectedCell={selectedCell}
          onCellPress={onCellPress}
          showConflicts={showConflicts}
        />
      </View>

      {/* Sélecteur de symboles */}
      <SymbolSelector
        symbols={grid.symbols}
        onSymbolSelect={onSymbolSelect}
        selectedSymbol={selectedSymbol}
        onClear={onClear}
        theme={grid.theme}
        usedSymbols={usedSymbols}
      />
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
});

export default SudokuGameArea;
