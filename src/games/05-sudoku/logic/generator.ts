/**
 * Sudoku Grid Generator
 * Generates valid Sudoku puzzles with unique solutions
 *
 * Adapted from David Bau's algorithm (port by Blagovest Dachev)
 * Uses bit manipulation for efficient constraint propagation
 * Supports 4×4, 6×6, and 9×9 grids with themed symbols
 */

import type { SudokuGrid, SudokuConfig, SudokuCell, SudokuValue, SudokuSize } from '../types';
import { THEME_SYMBOLS, DIFFICULTY_CONFIGS } from '../types';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

// ============================================
// SIZE-AGNOSTIC HELPERS
// ============================================

interface GridConfig {
  size: number;
  boxRows: number;
  boxCols: number;
  totalCells: number;
  allBits: number; // All positions set to 1 (e.g., 511 for 9x9, 63 for 6x6, 15 for 4x4)
}

function getGridConfig(size: SudokuSize): GridConfig {
  const boxRows = size === 6 ? 2 : Math.sqrt(size);
  const boxCols = size === 6 ? 3 : Math.sqrt(size);
  return {
    size,
    boxRows,
    boxCols,
    totalCells: size * size,
    allBits: (1 << size) - 1, // e.g., 2^9 - 1 = 511
  };
}

/**
 * Calculate position index for a given coordinate and axis
 * axis 0: row-major (row, col)
 * axis 1: column-major (col, row)
 * axis 2: box-major
 */
function posfor(x: number, y: number, axis: number, config: GridConfig): number {
  const { size, boxRows, boxCols } = config;

  if (axis === 0) {
    return x * size + y;
  } else if (axis === 1) {
    return y * size + x;
  }

  // Box positions - generalized for any box size
  const boxIndex = x;
  const cellInBox = y;

  const boxRow = Math.floor(boxIndex / (size / boxCols));
  const boxCol = boxIndex % (size / boxCols);
  const cellRow = Math.floor(cellInBox / boxCols);
  const cellCol = cellInBox % boxCols;

  return (boxRow * boxRows + cellRow) * size + (boxCol * boxCols + cellCol);
}

/**
 * Get axis index (row/col/box) for a position
 */
function axisfor(pos: number, axis: number, config: GridConfig): number {
  const { size, boxRows, boxCols } = config;

  if (axis === 0) {
    return Math.floor(pos / size);
  } else if (axis === 1) {
    return pos % size;
  }

  // Box index
  const row = Math.floor(pos / size);
  const col = pos % size;
  return Math.floor(row / boxRows) * (size / boxCols) + Math.floor(col / boxCols);
}

/**
 * Get missing numbers in an axis as a bitmask
 */
function axismissing(board: (number | null)[], x: number, axis: number, config: GridConfig): number {
  const { size, allBits } = config;
  let bits = 0;

  for (let y = 0; y < size; y++) {
    const e = board[posfor(x, y, axis, config)];
    if (e !== null) {
      bits |= 1 << e;
    }
  }

  return allBits ^ bits;
}

/**
 * Convert bitmask to list of set bit positions
 */
function listbits(bits: number, size: number): number[] {
  const list: number[] = [];
  for (let y = 0; y < size; y++) {
    if ((bits & (1 << y)) !== 0) {
      list.push(y);
    }
  }
  return list;
}

// ============================================
// CONSTRAINT PROPAGATION (BIT MANIPULATION)
// ============================================

interface FigureBitsResult {
  allowed: number[];
  needed: number[];
}

function figurebits(board: (number | null)[], config: GridConfig): FigureBitsResult {
  const { size, allBits } = config;
  const needed: number[] = [];
  const allowed: number[] = board.map((val) => (val === null ? allBits : 0));

  for (let axis = 0; axis < 3; axis++) {
    for (let x = 0; x < size; x++) {
      const bits = axismissing(board, x, axis, config);
      needed.push(bits);

      for (let y = 0; y < size; y++) {
        const pos = posfor(x, y, axis, config);
        allowed[pos] = allowed[pos] & bits;
      }
    }
  }

  return { allowed, needed };
}

interface Guess {
  pos: number;
  num: number;
}

function pickbetter(
  b: Guess[] | null,
  c: number,
  t: Guess[]
): { guess: Guess[]; count: number } {
  if (b === null || t.length < b.length) {
    return { guess: t, count: 1 };
  } else if (t.length > b.length) {
    return { guess: b, count: c };
  } else if (Math.floor(Math.random() * c) === 0) {
    return { guess: t, count: c + 1 };
  }
  return { guess: b, count: c + 1 };
}

/**
 * Deduce as much as possible from the current board state
 * Returns null if solved, empty array if impossible, or guesses if stuck
 */
function deduce(board: (number | null)[], config: GridConfig): Guess[] | null {
  const { size } = config;

  while (true) {
    let stuck = true;
    let guess: Guess[] | null = null;
    let count = 0;

    // Fill in any spots determined by direct conflicts
    let { allowed, needed } = figurebits(board, config);

    for (let pos = 0; pos < config.totalCells; pos++) {
      if (board[pos] === null) {
        const numbers = listbits(allowed[pos], size);

        if (numbers.length === 0) {
          return []; // Impossible state
        } else if (numbers.length === 1) {
          board[pos] = numbers[0];
          stuck = false;
        } else if (stuck) {
          const t = numbers.map((val) => ({ pos, num: val }));
          const result = pickbetter(guess, count, t);
          guess = result.guess;
          count = result.count;
        }
      }
    }

    if (!stuck) {
      const newBits = figurebits(board, config);
      allowed = newBits.allowed;
      needed = newBits.needed;
    }

    // Fill in any spots determined by elimination of other locations
    for (let axis = 0; axis < 3; axis++) {
      for (let x = 0; x < size; x++) {
        const numbers = listbits(needed[axis * size + x], size);

        for (const n of numbers) {
          const bit = 1 << n;
          const spots: number[] = [];

          for (let y = 0; y < size; y++) {
            const pos = posfor(x, y, axis, config);
            if (allowed[pos] & bit) {
              spots.push(pos);
            }
          }

          if (spots.length === 0) {
            return []; // Impossible state
          } else if (spots.length === 1) {
            board[spots[0]] = n;
            stuck = false;
          } else if (stuck) {
            const t = spots.map((val) => ({ pos: val, num: n }));
            const result = pickbetter(guess, count, t);
            guess = result.guess;
            count = result.count;
          }
        }
      }
    }

    if (stuck) {
      if (guess !== null) {
        return shuffleArray(guess);
      }
      return guess;
    }
  }
}

// ============================================
// SOLVER
// ============================================

interface TrackItem {
  guesses: Guess[];
  count: number;
  board: (number | null)[];
}

interface SolveResult {
  state: TrackItem[];
  answer: (number | null)[] | null;
}

function solveboard(original: (number | null)[], config: GridConfig): SolveResult {
  const board = [...original];
  const guesses = deduce(board, config);

  if (guesses === null) {
    return { state: [], answer: board };
  }

  const track: TrackItem[] = [{ guesses, count: 0, board }];
  return solvenext(track, config);
}

function solvenext(remembered: TrackItem[], config: GridConfig): SolveResult {
  while (remembered.length > 0) {
    const tuple1 = remembered.pop()!;

    if (tuple1.count >= tuple1.guesses.length) {
      continue;
    }

    remembered.push({
      guesses: tuple1.guesses,
      count: tuple1.count + 1,
      board: tuple1.board,
    });

    const workspace = [...tuple1.board];
    const tuple2 = tuple1.guesses[tuple1.count];
    workspace[tuple2.pos] = tuple2.num;

    const guesses = deduce(workspace, config);

    if (guesses === null) {
      return { state: remembered, answer: workspace };
    }

    remembered.push({ guesses, count: 0, board: workspace });
  }

  return { state: [], answer: null };
}

function solvepuzzle(board: (number | null)[], config: GridConfig): (number | null)[] | null {
  return solveboard(board, config).answer;
}

// ============================================
// PUZZLE GENERATOR
// ============================================

function boardforentries(entries: Guess[], totalCells: number): (number | null)[] {
  const board = makeArray<number | null>(totalCells, null);

  for (const { pos, num } of entries) {
    board[pos] = num;
  }

  return board;
}

function boardmatches(b1: (number | null)[], b2: (number | null)[]): boolean {
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] !== b2[i]) {
      return false;
    }
  }
  return true;
}

function checkpuzzle(
  puzzle: (number | null)[],
  board: (number | null)[] | null,
  config: GridConfig
): number {
  const tuple1 = solveboard(puzzle, config);

  if (tuple1.answer === null) {
    return -1;
  }

  if (board !== null && !boardmatches(board, tuple1.answer)) {
    return -1;
  }

  const difficulty = tuple1.state.length;
  const tuple2 = solvenext(tuple1.state, config);

  if (tuple2.answer !== null) {
    return -1; // Multiple solutions
  }

  return difficulty;
}

function makepuzzle(board: (number | null)[], config: GridConfig): (number | null)[] {
  const { totalCells } = config;
  const puzzle: Guess[] = [];
  const deduced = makeArray<number | null>(totalCells, null);
  let order = Array.from({ length: totalCells }, (_, i) => i);

  order = shuffleArray(order);

  for (const pos of order) {
    if (deduced[pos] === null) {
      puzzle.push({ pos, num: board[pos]! });
      deduced[pos] = board[pos];
      deduce(deduced, config);
    }
  }

  const shuffledPuzzle = shuffleArray(puzzle);

  // Remove clues while maintaining unique solution
  for (let i = shuffledPuzzle.length - 1; i >= 0; i--) {
    const e = shuffledPuzzle[i];
    shuffledPuzzle.splice(i, 1);

    const rating = checkpuzzle(boardforentries(shuffledPuzzle, totalCells), board, config);

    if (rating === -1) {
      shuffledPuzzle.push(e);
    }
  }

  return boardforentries(shuffledPuzzle, totalCells);
}

// ============================================
// PUBLIC API
// ============================================

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
 * Convert 1D number array to 2D symbol grid
 */
function numberBoardToSymbolGrid(
  board: (number | null)[],
  size: number,
  symbols: SudokuValue[]
): SudokuValue[][] {
  const grid: SudokuValue[][] = [];

  for (let row = 0; row < size; row++) {
    grid[row] = [];
    for (let col = 0; col < size; col++) {
      const num = board[row * size + col];
      grid[row][col] = num !== null ? symbols[num] : null;
    }
  }

  return grid;
}

/**
 * Generate a Sudoku puzzle with the given configuration
 */
export function generateSudoku(config: SudokuConfig): SudokuGrid {
  const gridConfig = getGridConfig(config.size);
  const symbols = THEME_SYMBOLS[config.theme][config.size];
  const difficultyConfig = DIFFICULTY_CONFIGS[config.size][config.difficulty];

  // Generate complete solution first
  const emptyBoard = makeArray<number | null>(gridConfig.totalCells, null);
  const solution = solvepuzzle(emptyBoard, gridConfig);

  if (!solution) {
    throw new Error('Failed to generate solution');
  }

  // Create puzzle from solution
  let puzzle = makepuzzle(solution, gridConfig);

  // Adjust difficulty by adding back clues if needed
  const currentFilled = puzzle.filter((v) => v !== null).length;
  const targetFilled = difficultyConfig.prefilledCells;

  if (currentFilled < targetFilled) {
    // Add back some clues to match target difficulty
    const emptyPositions = puzzle
      .map((v, i) => (v === null ? i : -1))
      .filter((i) => i !== -1);

    const shuffledEmpty = shuffleArray(emptyPositions);
    const toAdd = Math.min(targetFilled - currentFilled, shuffledEmpty.length);

    for (let i = 0; i < toAdd; i++) {
      const pos = shuffledEmpty[i];
      puzzle[pos] = solution[pos];
    }
  }

  // Convert to 2D grids with symbols
  const puzzleGrid = numberBoardToSymbolGrid(puzzle, config.size, symbols);
  const solutionGrid = numberBoardToSymbolGrid(solution, config.size, symbols);

  // Create cell structure
  const cells = createCellGrid(puzzleGrid, solutionGrid);

  return {
    size: config.size,
    cells,
    theme: config.theme,
    symbols,
    solution: solutionGrid,
  };
}

/**
 * Rate puzzle difficulty (higher = harder)
 */
export function ratePuzzle(puzzle: (number | null)[], config: GridConfig, samples: number = 4): number {
  let total = 0;

  for (let i = 0; i < samples; i++) {
    const tuple = solveboard(puzzle, config);

    if (tuple.answer === null) {
      return -1;
    }

    total += tuple.state.length;
  }

  return total / samples;
}

/**
 * Generates pre-made easy grids for quick start (4x4 tutorials)
 */
export function getPreMadeGrid(theme: SudokuConfig['theme']): SudokuGrid {
  const size: SudokuSize = 4;
  const symbols = THEME_SYMBOLS[theme][size];

  // Pre-made 4x4 easy puzzle
  const puzzle: SudokuValue[][] = [
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
