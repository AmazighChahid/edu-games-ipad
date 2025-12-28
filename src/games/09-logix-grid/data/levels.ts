/**
 * Logix Grid - Level Configurations
 *
 * Fichier standardisé de niveaux conformément à la structure projet.
 * Les puzzles sont définis dans puzzles.ts et utilisés ici pour construire les niveaux.
 */

import {
  LOGIX_PUZZLES,
  getPuzzleById,
  getPuzzlesByDifficulty as getPuzzlesByDifficultyLevel,
  getFirstPuzzle,
  getAllPuzzles,
} from './puzzles';
import type { LogixPuzzle, LogixDifficulty } from '../types';

// ============================================
// TYPES DE NIVEAU STANDARDISÉ
// ============================================

export interface LogixLevelConfig {
  id: string;
  gameId: 'logix-grid';
  difficulty: 'easy' | 'medium' | 'hard';
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  name: string;
  description: string;
  difficultyLevel: LogixDifficulty;
  puzzle: LogixPuzzle;
  hintsAvailable: number;
  categoryCount: number;
}

// ============================================
// CONVERSION PUZZLE → LEVEL_CONFIG
// ============================================

function puzzleToLevelConfig(puzzle: LogixPuzzle, index: number): LogixLevelConfig {
  const difficultyMap: Record<LogixDifficulty, 'easy' | 'medium' | 'hard'> = {
    1: 'easy',
    2: 'medium',
    3: 'hard',
  };

  const ageMap: Record<LogixDifficulty, number> = {
    1: 7,
    2: 8,
    3: 9,
  };

  return {
    id: `level_${index + 1}`,
    gameId: 'logix-grid',
    difficulty: difficultyMap[puzzle.difficulty],
    displayOrder: index + 1,
    targetAge: ageMap[puzzle.difficulty],
    estimatedMinutes: Math.ceil(puzzle.idealTime / 60),
    name: puzzle.name,
    description: puzzle.description,
    difficultyLevel: puzzle.difficulty,
    puzzle,
    hintsAvailable: puzzle.hintsAvailable,
    categoryCount: puzzle.categories.length,
  };
}

// ============================================
// DÉFINITION DES NIVEAUX
// ============================================

export const logixLevels: LogixLevelConfig[] = LOGIX_PUZZLES.map(puzzleToLevelConfig);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtient un niveau par son ID
 */
export function getLevel(levelId: string): LogixLevelConfig | undefined {
  return logixLevels.find((level) => level.id === levelId);
}

/**
 * Obtient le niveau par défaut (premier niveau)
 */
export function getDefaultLevel(): LogixLevelConfig {
  return logixLevels[0];
}

/**
 * Obtient un niveau par son ordre d'affichage
 */
export function getLevelByOrder(order: number): LogixLevelConfig | undefined {
  return logixLevels.find((level) => level.displayOrder === order);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): LogixLevelConfig[] {
  return logixLevels.filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient le niveau suivant
 */
export function getNextLevel(currentLevelId: string): LogixLevelConfig | undefined {
  const currentLevel = getLevel(currentLevelId);
  if (!currentLevel) return undefined;
  return logixLevels.find((level) => level.displayOrder === currentLevel.displayOrder + 1);
}

/**
 * Obtient un niveau par l'ID du puzzle
 */
export function getLevelByPuzzleId(puzzleId: string): LogixLevelConfig | undefined {
  return logixLevels.find((level) => level.puzzle.id === puzzleId);
}

// ============================================
// RE-EXPORTS DEPUIS PUZZLES
// ============================================

export {
  LOGIX_PUZZLES,
  getPuzzleById,
  getPuzzlesByDifficultyLevel,
  getFirstPuzzle,
  getAllPuzzles,
};
