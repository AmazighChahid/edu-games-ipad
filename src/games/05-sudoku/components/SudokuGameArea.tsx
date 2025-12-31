/**
 * SudokuGameArea Component
 * Zone de jeu contenant la grille Sudoku et le sélecteur de symboles
 * Avec support du drag & drop
 */

import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { colors, spacing } from '@/theme';
import type { SudokuState, SudokuValue } from '../types';
import { SudokuGrid } from './SudokuGrid';
import { SymbolSelector } from './SymbolSelector';
import { DragDropProvider, useDragDrop } from '../context/DragDropContext';
import { FloatingDragPreview } from './DraggableSymbol';

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
  onDrop?: (
    symbol: SudokuValue,
    targetRow: number,
    targetCol: number,
    sourceCell?: { row: number; col: number }
  ) => void;
}

// ============================================
// INNER COMPONENT (with drag/drop context)
// ============================================

interface SudokuGameAreaInnerProps extends SudokuGameAreaProps {}

function SudokuGameAreaInner({
  gameState,
  onCellPress,
  onSymbolSelect,
  onClear,
  selectedSymbol,
  showConflicts = true,
  onDrop,
}: SudokuGameAreaInnerProps) {
  const { grid, selectedCell } = gameState;
  const { dragState, dropTarget, endDrag } = useDragDrop();

  // Handle drop when drag ends
  useEffect(() => {
    if (!dragState.isDragging && dropTarget && dragState.symbol !== null) {
      // A drop just happened
      if (onDrop) {
        onDrop(
          dragState.symbol,
          dropTarget.row,
          dropTarget.col,
          dragState.sourceCell || undefined
        );
      }
    }
  }, [dragState.isDragging]);

  // Calculate used symbols
  const usedSymbols = useMemo(() => {
    const used = new Set<SudokuValue>();
    const counts: Record<string, number> = {};

    grid.cells.flat().forEach((cell) => {
      if (cell.value !== null) {
        const key = String(cell.value);
        counts[key] = (counts[key] || 0) + 1;
      }
    });

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
          highlightedSymbol={gameState.highlightedSymbol}
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

      {/* Floating preview pendant le drag */}
      <FloatingDragPreview theme={grid.theme} />
    </View>
  );
}

// ============================================
// MAIN COMPONENT (with provider wrapper)
// ============================================

export function SudokuGameArea(props: SudokuGameAreaProps) {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <DragDropProvider>
        <SudokuGameAreaInner {...props} />
      </DragDropProvider>
    </GestureHandlerRootView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
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
