/**
 * Sudoku Game Types
 * Based on Montessori specifications for ages 6-10
 */

export type SudokuTheme = 'fruits' | 'animals' | 'shapes' | 'colors' | 'numbers';
export type SudokuSize = 4 | 6 | 9;
export type SudokuDifficulty = 1 | 2 | 3; // ★ | ★★ | ★★★
export type SudokuValue = string | number | null;

export interface SudokuCell {
  row: number;
  col: number;
  value: SudokuValue;
  isFixed: boolean;        // Pre-filled cell (cannot be modified)
  annotations: SudokuValue[]; // Candidate notes
  hasConflict: boolean;    // Visual indicator for rule violations
}

export interface SudokuGrid {
  size: SudokuSize;
  cells: SudokuCell[][];
  theme: SudokuTheme;
  symbols: SudokuValue[];  // Available symbols for this grid
  solution: SudokuValue[][]; // Complete solution for validation
}

export interface Conflict {
  type: 'row' | 'column' | 'box';
  row: number;
  col: number;
}

export interface ValidationResult {
  valid: boolean;
  conflicts: Conflict[];
}

export interface SudokuState {
  grid: SudokuGrid;
  selectedCell: { row: number; col: number } | null;
  history: SudokuGrid[];   // For undo functionality
  hintsUsed: number;
  startTime: Date;
  isComplete: boolean;
  difficulty: SudokuDifficulty;
}

export interface SudokuConfig {
  size: SudokuSize;
  difficulty: SudokuDifficulty;
  theme: SudokuTheme;
  showConflicts: boolean;    // Immediate validation feedback
  allowAnnotations: boolean; // Enable candidate notes (for advanced)
}

export interface GameStats {
  activityId: 'sudoku';
  difficulty: SudokuDifficulty;
  size: SudokuSize;
  completed: boolean;
  hintsUsed: number;
  duration: number;          // in milliseconds
  errorsCount: number;
  timestamp: Date;
}

/**
 * Theme symbol definitions
 */
export const THEME_SYMBOLS: Record<SudokuTheme, Record<SudokuSize, SudokuValue[]>> = {
  fruits: {
    4: ['🍎', '🍌', '🍇', '🍊'],
    6: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉'],
    9: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍑', '🍋', '🥝'],
  },
  animals: {
    4: ['🐶', '🐱', '🐰', '🐻'],
    6: ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊'],
    9: ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🦁', '🐯', '🐨'],
  },
  shapes: {
    4: ['⬛', '🔵', '🔺', '⭐'],
    6: ['⬛', '🔵', '🔺', '⭐', '💚', '🔶'],
    9: ['⬛', '🔵', '🔺', '⭐', '💚', '🔶', '🔷', '🟣', '🔸'],
  },
  colors: {
    4: ['🔴', '🔵', '🟢', '🟡'],
    6: ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'],
    9: ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '🟤', '⚪', '⚫'],
  },
  numbers: {
    4: [1, 2, 3, 4],
    6: [1, 2, 3, 4, 5, 6],
    9: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
};

/**
 * Difficulty configurations per grid size
 */
export interface DifficultyConfig {
  prefilledCells: number;
  techniques: string[];
  ageRange: string;
}

export const DIFFICULTY_CONFIGS: Record<SudokuSize, Record<SudokuDifficulty, DifficultyConfig>> = {
  4: {
    1: { prefilledCells: 11, techniques: ['Simple observation'], ageRange: '6-7 ans' },
    2: { prefilledCells: 9, techniques: ['Basic elimination'], ageRange: '7-8 ans' },
    3: { prefilledCells: 7, techniques: ['2-step deduction'], ageRange: '7-8 ans' },
  },
  6: {
    1: { prefilledCells: 22, techniques: ['Methodical observation'], ageRange: '8 ans' },
    2: { prefilledCells: 18, techniques: ['Systematic elimination'], ageRange: '8-9 ans' },
    3: { prefilledCells: 14, techniques: ['Hidden pairs'], ageRange: '9 ans' },
  },
  9: {
    1: { prefilledCells: 45, techniques: ['All basic techniques'], ageRange: '9-10 ans' },
    2: { prefilledCells: 35, techniques: ['Intermediate techniques'], ageRange: '10 ans' },
    3: { prefilledCells: 27, techniques: ['Advanced techniques'], ageRange: '10+ ans' },
  },
};

// ============================================
// LEVEL SYSTEM TYPES (10 progressive levels)
// ============================================

/**
 * Level configuration for the 10-level progression system
 */
export interface SudokuLevelConfig {
  id: string;
  number: number;              // 1-10
  label: string;               // Display name
  size: SudokuSize;            // Grid size
  difficulty: SudokuDifficulty;
  emptyCells: number;          // Number of empty cells to fill
  theme: SudokuTheme;          // Default theme for this level
  isUnlocked: boolean;
  isCompleted: boolean;
  stars?: number;              // 0-3 stars
  bestTime?: number;           // Best completion time in ms
}

/**
 * Training mode configuration (free play)
 */
export interface TrainingConfig {
  size: SudokuSize;
  theme: SudokuTheme;
  difficulty: SudokuDifficulty;
}

/**
 * Emotion types for Felix mascot
 */
export type FelixEmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

/**
 * Messages for Felix based on game state
 */
export interface FelixMessages {
  intro: string[];
  levelSelect: string[];
  playing: string[];
  hint: string[];
  error: string[];
  success: string[];
  victory: string[];
}

/**
 * Progress data for the game
 */
export interface SudokuProgressData {
  currentLevel: number;
  completedLevels: string[];
  totalStars: number;
  hintsUsed: number;
  errorsCount: number;
  bestTimes: Record<string, number>;
}
