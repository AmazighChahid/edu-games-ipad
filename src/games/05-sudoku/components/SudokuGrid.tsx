/**
 * SudokuGrid Component
 * Main grid displaying all Sudoku cells with proper box divisions
 * Includes visual highlighting for selected row/column/box
 */

import { View, StyleSheet, Dimensions } from 'react-native';

import { colors, spacing } from '@/theme';
import type { SudokuGrid as GridType, SudokuValue, SudokuSize } from '../types';
import { SudokuCell } from './SudokuCell';

interface SudokuGridProps {
  grid: GridType;
  selectedCell: { row: number; col: number } | null;
  highlightedSymbol: SudokuValue;
  onCellPress: (row: number, col: number) => void;
  showConflicts: boolean;
}

// Helper to check if two cells are in the same box
function isSameBox(
  row1: number,
  col1: number,
  row2: number,
  col2: number,
  size: SudokuSize
): boolean {
  const boxRows = size === 6 ? 2 : Math.sqrt(size);
  const boxCols = size === 6 ? 3 : Math.sqrt(size);

  const box1Row = Math.floor(row1 / boxRows);
  const box1Col = Math.floor(col1 / boxCols);
  const box2Row = Math.floor(row2 / boxRows);
  const box2Col = Math.floor(col2 / boxCols);

  return box1Row === box2Row && box1Col === box2Col;
}

const GRID_PADDING = spacing[4];
const GRID_MAX_WIDTH = Dimensions.get('window').width - (spacing[6] * 2);

export function SudokuGrid({
  grid,
  selectedCell,
  highlightedSymbol,
  onCellPress,
  showConflicts,
}: SudokuGridProps) {
  const cellSize = calculateCellSize(grid.size);

  // Calculate box dimensions based on grid size
  const boxRows = grid.size === 6 ? 2 : Math.sqrt(grid.size);
  const boxCols = grid.size === 6 ? 3 : Math.sqrt(grid.size);

  const renderCell = (row: number, col: number) => {
    const cell = grid.cells[row][col];
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;

    // Check if this cell has the same value as the highlighted symbol
    const isHighlighted =
      highlightedSymbol !== null &&
      cell.value !== null &&
      cell.value === highlightedSymbol;

    // Check if this cell is in the same row, column, or box as selected cell
    const isInSelectedZone = selectedCell
      ? row === selectedCell.row ||
        col === selectedCell.col ||
        isSameBox(row, col, selectedCell.row, selectedCell.col, grid.size)
      : false;

    // Check if cell is at the edge of selected row/column for border drawing
    const isInSelectedRow = selectedCell?.row === row;
    const isInSelectedCol = selectedCell?.col === col;
    const isFirstInRow = col === 0;
    const isLastInRow = col === grid.size - 1;
    const isFirstInCol = row === 0;
    const isLastInCol = row === grid.size - 1;

    return (
      <View
        key={`${row}-${col}`}
        style={[
          styles.cellWrapper,
          // Add thicker borders for box boundaries
          col % boxCols === 0 && col !== 0 && styles.boxBorderLeft,
          row % boxRows === 0 && row !== 0 && styles.boxBorderTop,
          // Row highlight border (top/bottom edges)
          isInSelectedRow && !isSelected && styles.rowHighlight,
          isInSelectedRow && isFirstInRow && styles.rowHighlightLeft,
          isInSelectedRow && isLastInRow && styles.rowHighlightRight,
          // Column highlight border (left/right edges)
          isInSelectedCol && !isSelected && styles.colHighlight,
          isInSelectedCol && isFirstInCol && styles.colHighlightTop,
          isInSelectedCol && isLastInCol && styles.colHighlightBottom,
        ]}
      >
        <SudokuCell
          cell={cell}
          isSelected={isSelected}
          isHighlighted={isHighlighted}
          isInSelectedZone={isInSelectedZone && !isSelected}
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

// Couleur d'encadrement pour la ligne/colonne
const ZONE_BORDER_COLOR = '#5C9CE5'; // Bleu clair visible

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
  // Row highlighting - horizontal band
  rowHighlight: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: ZONE_BORDER_COLOR,
    borderBottomColor: ZONE_BORDER_COLOR,
  },
  rowHighlightLeft: {
    borderLeftWidth: 2,
    borderLeftColor: ZONE_BORDER_COLOR,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  rowHighlightRight: {
    borderRightWidth: 2,
    borderRightColor: ZONE_BORDER_COLOR,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  // Column highlighting - vertical band
  colHighlight: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderLeftColor: ZONE_BORDER_COLOR,
    borderRightColor: ZONE_BORDER_COLOR,
  },
  colHighlightTop: {
    borderTopWidth: 2,
    borderTopColor: ZONE_BORDER_COLOR,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  colHighlightBottom: {
    borderBottomWidth: 2,
    borderBottomColor: ZONE_BORDER_COLOR,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});
