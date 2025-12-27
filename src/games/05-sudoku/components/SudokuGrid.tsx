/**
 * SudokuGrid Component
 * Main grid displaying all Sudoku cells with proper box divisions
 */

import { View, StyleSheet, Dimensions } from 'react-native';

import { colors, spacing } from '../../../theme';
import type { SudokuGrid as GridType } from '../types';
import { SudokuCell } from './SudokuCell';

interface SudokuGridProps {
  grid: GridType;
  selectedCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
  showConflicts: boolean;
}

const GRID_PADDING = spacing[4];
const GRID_MAX_WIDTH = Dimensions.get('window').width - (spacing[6] * 2);

export function SudokuGrid({
  grid,
  selectedCell,
  onCellPress,
  showConflicts,
}: SudokuGridProps) {
  const cellSize = calculateCellSize(grid.size);

  // Calculate box dimensions based on grid size
  // 4x4: 2x2 blocks
  // 6x6: 2x3 blocks (2 rows, 3 columns)
  const boxRows = grid.size === 6 ? 2 : Math.sqrt(grid.size);
  const boxCols = grid.size === 6 ? 3 : Math.sqrt(grid.size);

  const renderCell = (row: number, col: number) => {
    const cell = grid.cells[row][col];
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;

    return (
      <View
        key={`${row}-${col}`}
        style={[
          styles.cellWrapper,
          // Add thicker borders for box boundaries
          col % boxCols === 0 && col !== 0 && styles.boxBorderLeft,
          row % boxRows === 0 && row !== 0 && styles.boxBorderTop,
        ]}
      >
        <SudokuCell
          cell={cell}
          isSelected={isSelected}
          onPress={() => onCellPress(row, col)}
          cellSize={cellSize}
          showConflict={showConflicts}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.grid,
          {
            width: cellSize * grid.size + GRID_PADDING * 2,
            height: cellSize * grid.size + GRID_PADDING * 2,
          },
        ]}
      >
        {grid.cells.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </View>
        ))}
      </View>
    </View>
  );
}

function calculateCellSize(gridSize: number): number {
  const availableWidth = GRID_MAX_WIDTH - (GRID_PADDING * 2);
  const cellSize = Math.floor(availableWidth / gridSize);

  // Ensure minimum and maximum cell sizes (64dp minimum per UX guide)
  const MIN_CELL_SIZE = 64;
  const MAX_CELL_SIZE = 80;

  return Math.min(Math.max(cellSize, MIN_CELL_SIZE), MAX_CELL_SIZE);
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    backgroundColor: colors.background.card,
    padding: GRID_PADDING,
    borderRadius: 12,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
  },
  cellWrapper: {
    position: 'relative',
  },
  boxBorderLeft: {
    borderLeftWidth: 2,
    borderLeftColor: colors.sudoku.gridBorder,
  },
  boxBorderTop: {
    borderTopWidth: 2,
    borderTopColor: colors.sudoku.gridBorder,
  },
});
