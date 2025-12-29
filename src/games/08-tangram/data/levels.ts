/**
 * Tangram - Level Configurations
 *
 * Fichier standardisé de niveaux conformément à la structure projet.
 * Les puzzles sont définis dans puzzles.ts et utilisés ici pour construire les niveaux.
 */

import {
  TANGRAM_PUZZLES,
  getAllPuzzles,
  getPuzzleById,
  getPuzzlesByCategory,
  getPuzzlesByDifficulty as getPuzzlesByDifficultyLevel,
  getFirstPuzzle,
  getLevelForPuzzle,
  createLevelFromPuzzle,
} from './puzzles';
import type { TangramPuzzle, TangramLevel, Difficulty, PuzzleCategory } from '../types';

// ============================================
// TYPES DE NIVEAU STANDARDISÉ
// ============================================

export interface TangramLevelConfig {
  id: string;
  gameId: 'tangram';
  difficulty: 'easy' | 'medium' | 'hard';
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  name: string;
  description: string;
  puzzle: TangramPuzzle;
  category: PuzzleCategory;
  hintsAvailable: number;
  showOutlines: boolean;
  autoSnap: boolean;
  snapThreshold: number;
}

// ============================================
// CONVERSION PUZZLE → LEVEL_CONFIG
// ============================================

function puzzleToLevelConfig(puzzle: TangramPuzzle, index: number): TangramLevelConfig {
  const ageMap: Record<Difficulty, number> = {
    easy: 6,
    medium: 8,
    hard: 9,
  };

  const hintsMap: Record<Difficulty, number> = {
    easy: 3,
    medium: 2,
    hard: 1,
  };

  return {
    id: `level_${index + 1}`,
    gameId: 'tangram',
    difficulty: puzzle.difficulty,
    displayOrder: index + 1,
    targetAge: ageMap[puzzle.difficulty],
    estimatedMinutes: Math.ceil(puzzle.idealTime / 60),
    name: puzzle.name,
    description: puzzle.description,
    puzzle,
    category: puzzle.category,
    hintsAvailable: hintsMap[puzzle.difficulty],
    showOutlines: puzzle.difficulty === 'easy',
    autoSnap: true,
    snapThreshold: puzzle.difficulty === 'easy' ? 30 : 20,
  };
}

// ============================================
// DÉFINITION DES NIVEAUX
// ============================================

export const tangramLevels: TangramLevelConfig[] = TANGRAM_PUZZLES.map(puzzleToLevelConfig);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtient un niveau par son ID
 */
export function getLevel(levelId: string): TangramLevelConfig | undefined {
  return tangramLevels.find((level) => level.id === levelId);
}

/**
 * Obtient le niveau par défaut (premier niveau)
 */
export function getDefaultLevel(): TangramLevelConfig {
  return tangramLevels[0];
}

/**
 * Obtient un niveau par son ordre d'affichage
 */
export function getLevelByOrder(order: number): TangramLevelConfig | undefined {
  return tangramLevels.find((level) => level.displayOrder === order);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): TangramLevelConfig[] {
  return tangramLevels.filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient les niveaux par catégorie
 */
export function getLevelsByCategory(category: PuzzleCategory): TangramLevelConfig[] {
  return tangramLevels.filter((level) => level.category === category);
}

/**
 * Obtient le niveau suivant
 */
export function getNextLevel(currentLevelId: string): TangramLevelConfig | undefined {
  const currentLevel = getLevel(currentLevelId);
  if (!currentLevel) return undefined;
  return tangramLevels.find((level) => level.displayOrder === currentLevel.displayOrder + 1);
}

/**
 * Obtient un niveau par l'ID du puzzle
 */
export function getLevelByPuzzleId(puzzleId: string): TangramLevelConfig | undefined {
  return tangramLevels.find((level) => level.puzzle.id === puzzleId);
}

// ============================================
// RE-EXPORTS DEPUIS PUZZLES
// ============================================

export {
  TANGRAM_PUZZLES,
  getAllPuzzles,
  getPuzzleById,
  getPuzzlesByCategory,
  getPuzzlesByDifficultyLevel,
  getFirstPuzzle,
  getLevelForPuzzle,
  createLevelFromPuzzle,
};
