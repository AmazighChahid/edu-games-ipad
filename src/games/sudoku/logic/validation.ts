/**
 * Sudoku Validation Logic
 * Implements rule checking and conflict detection
 */

import type { SudokuGrid, SudokuValue, ValidationResult, Conflict, SudokuCell } from '../types';

/**
 * Get box dimensions for a given grid size
 */
function getBoxDimensions(size: number): { rows: number; cols: number } {
  if (size === 4) return { rows: 2, cols: 2 };
  if (size === 6) return { rows: 2, cols: 3 };
  if (size === 9) return { rows: 3, cols: 3 };
  throw new Error(`Unsupported grid size: ${size}`);
}

/**
 * Validates if a value can be placed in a specific cell
 */
export function validatePlacement(
  grid: SudokuGrid,
  row: number,
  col: number,
  value: SudokuValue
): ValidationResult {
  if (!value) {
    return { valid: true, conflicts: [] };
  }

  const conflicts: Conflict[] = [];

  // Check row
  for (let c = 0; c < grid.size; c++) {
    if (c !== col && grid.cells[row][c].value === value) {
      conflicts.push({ type: 'row', row, col: c });
    }
  }

  // Check column
  for (let r = 0; r < grid.size; r++) {
    if (r !== row && grid.cells[r][col].value === value) {
      conflicts.push({ type: 'column', row: r, col });
    }
  }

  // Check box/region
  const box = getBoxDimensions(grid.size);
  const boxRow = Math.floor(row / box.rows) * box.rows;
  const boxCol = Math.floor(col / box.cols) * box.cols;

  for (let r = boxRow; r < boxRow + box.rows; r++) {
    for (let c = boxCol; c < boxCol + box.cols; c++) {
      if ((r !== row || c !== col) && grid.cells[r][c].value === value) {
        conflicts.push({ type: 'box', row: r, col: c });
      }
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts,
  };
}

/**
 * Validates the entire grid for rule violations
 */
export function validateGrid(grid: SudokuGrid): Map<string, Conflict[]> {
  const conflictMap = new Map<string, Conflict[]>();

  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      const cell = grid.cells[row][col];
      if (cell.value) {
        const result = validatePlacement(grid, row, col, cell.value);
        if (!result.valid) {
          const key = `${row},${col}`;
          conflictMap.set(key, result.conflicts);
        }
      }
    }
  }

  return conflictMap;
}

/**
 * Checks if the Sudoku grid is completely and correctly filled
 */
export function isGridComplete(grid: SudokuGrid): boolean {
  // Check if all cells are filled
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      if (!grid.cells[row][col].value) {
        return false;
      }
    }
  }

  // Check if there are no conflicts
  const conflictMap = validateGrid(grid);
  return conflictMap.size === 0;
}

/**
 * Checks if the grid matches the solution
 */
export function checkAgainstSolution(grid: SudokuGrid): boolean {
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      if (grid.cells[row][col].value !== grid.solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Gets possible values for a cell based on current grid state
 */
export function getPossibleValues(
  grid: SudokuGrid,
  row: number,
  col: number
): SudokuValue[] {
  const possible: SudokuValue[] = [];

  for (const symbol of grid.symbols) {
    const result = validatePlacement(grid, row, col, symbol);
    if (result.valid) {
      possible.push(symbol);
    }
  }

  return possible;
}

/**
 * Finds the easiest cell to solve (with fewest possibilities)
 * Useful for hints
 */
export function findEasiestEmptyCell(grid: SudokuGrid): { row: number; col: number; possibilities: SudokuValue[] } | null {
  let easiest: { row: number; col: number; possibilities: SudokuValue[] } | null = null;
  let minPossibilities = grid.size + 1;

  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      const cell = grid.cells[row][col];
      if (!cell.value && !cell.isFixed) {
        const possibilities = getPossibleValues(grid, row, col);
        if (possibilities.length > 0 && possibilities.length < minPossibilities) {
          minPossibilities = possibilities.length;
          easiest = { row, col, possibilities };
        }
      }
    }
  }

  return easiest;
}

/**
 * Marks cells with conflicts
 */
export function markConflicts(grid: SudokuGrid): SudokuGrid {
  const conflictMap = validateGrid(grid);
  const updatedGrid = { ...grid };
  updatedGrid.cells = grid.cells.map((rowCells) =>
    rowCells.map((cell) => ({ ...cell }))
  );

  // Reset all conflicts
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      updatedGrid.cells[row][col].hasConflict = false;
    }
  }

  // Mark cells with conflicts
  conflictMap.forEach((conflicts, key) => {
    const [row, col] = key.split(',').map(Number);
    updatedGrid.cells[row][col].hasConflict = true;

    // Also mark conflicting cells
    conflicts.forEach((conflict) => {
      updatedGrid.cells[conflict.row][conflict.col].hasConflict = true;
    });
  });

  return updatedGrid;
}
