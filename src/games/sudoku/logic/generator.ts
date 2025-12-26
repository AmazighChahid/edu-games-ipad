/**
 * Sudoku Grid Generator
 * Generates valid Sudoku puzzles with unique solutions
 */

import type { SudokuGrid, SudokuConfig, SudokuCell, SudokuValue, SudokuSize } from '../types';
import { THEME_SYMBOLS, DIFFICULTY_CONFIGS } from '../types';
import { validatePlacement, isGridComplete } from './validation';

/**
 * Generates a complete valid Sudoku grid
 */
function generateFullGrid(size: number, symbols: SudokuValue[]): SudokuValue[][] {
  const grid: (SudokuValue)[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));

  function isValid(row: number, col: number, value: SudokuValue): boolean {
    // Check row
    for (let c = 0; c < size; c++) {
      if (grid[row][c] === value) return false;
    }

    // Check column
    for (let r = 0; r < size; r++) {
      if (grid[r][col] === value) return false;
    }

    // Check box
    const boxSize = Math.sqrt(size);
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;

    for (let r = boxRow; r < boxRow + boxSize; r++) {
      for (let c = boxCol; c < boxCol + boxSize; c++) {
        if (grid[r][c] === value) return false;
      }
    }

    return true;
  }

  function fillGrid(): boolean {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === null) {
          // Shuffle symbols for randomness
          const shuffled = [...symbols].sort(() => Math.random() - 0.5);

          for (const symbol of shuffled) {
            if (isValid(row, col, symbol)) {
              grid[row][col] = symbol;

              if (fillGrid()) {
                return true;
              }

              grid[row][col] = null;
            }
          }

          return false;
        }
      }
    }
    return true;
  }

  fillGrid();
  return grid;
}

/**
 * Counts number of solutions for a grid (used to ensure uniqueness)
 */
function countSolutions(
  grid: (SudokuValue)[][],
  symbols: SudokuValue[],
  limit: number = 2
): number {
  const size = grid.length;
  let count = 0;

  function isValid(row: number, col: number, value: SudokuValue): boolean {
    const boxSize = Math.sqrt(size);

    for (let i = 0; i < size; i++) {
      if (grid[row][i] === value || grid[i][col] === value) {
        return false;
      }
    }

    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;

    for (let r = boxRow; r < boxRow + boxSize; r++) {
      for (let c = boxCol; c < boxCol + boxSize; c++) {
        if (grid[r][c] === value) return false;
      }
    }

    return true;
  }

  function solve(): void {
    if (count >= limit) return;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === null) {
          for (const symbol of symbols) {
            if (isValid(row, col, symbol)) {
              grid[row][col] = symbol;
              solve();
              grid[row][col] = null;

              if (count >= limit) return;
            }
          }
          return;
        }
      }
    }

    count++;
  }

  solve();
  return count;
}

/**
 * Removes cells from complete grid to create puzzle
 */
function removeClues(
  fullGrid: SudokuValue[][],
  symbols: SudokuValue[],
  targetFilled: number
): SudokuValue[][] {
  const size = fullGrid.length;
  const puzzle = fullGrid.map((row) => [...row]);

  // Create list of all cell positions
  const positions: [number, number][] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      positions.push([row, col]);
    }
  }

  // Shuffle positions
  positions.sort(() => Math.random() - 0.5);

  let removed = 0;
  const totalCells = size * size;
  const maxToRemove = totalCells - targetFilled;

  for (const [row, col] of positions) {
    if (removed >= maxToRemove) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = null;

    // Check if puzzle still has unique solution
    const gridCopy = puzzle.map((r) => [...r]);
    const solutions = countSolutions(gridCopy, symbols, 2);

    if (solutions === 1) {
      removed++;
    } else {
      // Restore cell if multiple solutions or no solution
      puzzle[row][col] = backup;
    }
  }

  return puzzle;
}

/**
 * Converts solution grid to SudokuCell grid
 */
function createCellGrid(
  puzzleGrid: SudokuValue[][],
  solution: SudokuValue[][]
): SudokuCell[][] {
  const size = puzzleGrid.length;
  const cells: SudokuCell[][] = [];

  for (let row = 0; row < size; row++) {
    cells[row] = [];
    for (let col = 0; col < size; col++) {
      cells[row][col] = {
        row,
        col,
        value: puzzleGrid[row][col],
        isFixed: puzzleGrid[row][col] !== null,
        annotations: [],
        hasConflict: false,
      };
    }
  }

  return cells;
}

/**
 * Main generator function
 */
export function generateSudoku(config: SudokuConfig): SudokuGrid {
  const symbols = THEME_SYMBOLS[config.theme][config.size];
  const difficultyConfig = DIFFICULTY_CONFIGS[config.size][config.difficulty];

  // Generate complete valid grid
  const fullGrid = generateFullGrid(config.size, symbols);

  // Remove cells according to difficulty
  const puzzleGrid = removeClues(
    fullGrid,
    symbols,
    difficultyConfig.prefilledCells
  );

  // Create cell structure
  const cells = createCellGrid(puzzleGrid, fullGrid);

  return {
    size: config.size,
    cells,
    theme: config.theme,
    symbols,
    solution: fullGrid,
  };
}

/**
 * Generates pre-made easy grids for quick start (4x4 tutorials)
 */
export function getPreMadeGrid(theme: SudokuConfig['theme']): SudokuGrid {
  const size: SudokuSize = 4;
  const symbols = THEME_SYMBOLS[theme][size];

  // Pre-made 4x4 easy puzzle
  const puzzle: (SudokuValue)[][] = [
    [symbols[0], symbols[1], null, symbols[2]],
    [null, symbols[2], symbols[0], symbols[1]],
    [symbols[2], null, symbols[1], symbols[0]],
    [symbols[1], symbols[0], symbols[2], null],
  ];

  const solution: SudokuValue[][] = [
    [symbols[0], symbols[1], symbols[3], symbols[2]],
    [symbols[3], symbols[2], symbols[0], symbols[1]],
    [symbols[2], symbols[3], symbols[1], symbols[0]],
    [symbols[1], symbols[0], symbols[2], symbols[3]],
  ];

  const cells = createCellGrid(puzzle, solution);

  return {
    size,
    cells,
    theme,
    symbols,
    solution,
  };
}
