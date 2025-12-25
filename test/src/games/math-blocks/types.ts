/**
 * Types for MathBlocks game
 * A math matching game where players pair calculations with results
 */

import type { LevelConfig } from '@/types/game.types';

// Math operation types
export type MathOperation = 'add' | 'subtract' | 'multiply' | 'divide';

// A block can be either a calculation or a result
export interface MathBlock {
  id: string;
  type: 'operation' | 'result';
  value: number;                    // The numeric result
  display: string;                  // What's shown ("4+1" or "5")
  operation?: MathOperation;        // Operation type if calculation
  operands?: [number, number];      // Operands if calculation
  row: number;
  col: number;
  isSelected: boolean;
  isMatched: boolean;
}

// Grid type - 2D array of blocks or null (empty space)
export type GameGrid = (MathBlock | null)[][];

// Game state
export interface MathGameState {
  grid: GameGrid;
  selectedBlock: MathBlock | null;
  score: number;
  combo: number;                    // Consecutive pairs found
  matchesFound: number;
  totalPairs: number;
  timeRemaining: number;            // Seconds
  isPlaying: boolean;
}

// Level configuration
export interface MathLevelConfig extends LevelConfig {
  gridRows: number;                 // Number of rows
  gridCols: number;                 // Number of columns
  operations: MathOperation[];      // Allowed operations
  numberRange: [number, number];    // Number range [min, max]
  timeLimit: number;                // Time in seconds (0 = no limit)
  targetPairs: number;              // Pairs to find for victory
}

// Operation symbols for display
export const OPERATION_SYMBOLS: Record<MathOperation, string> = {
  add: '+',
  subtract: '-',
  multiply: 'x',
  divide: '/',
};

// Score values
export const SCORE_VALUES = {
  correctMatch: 100,
  comboBonus: 50,      // Per combo level
  timeBonus: 10,       // Per second remaining
  perfectBonus: 500,   // No wrong attempts
} as const;