/**
 * Logix Grid - Level Configurations
 *
 * Fichier standardisé de niveaux conformément à la structure projet.
 * Les puzzles sont définis dans puzzles.ts et utilisés ici pour construire les niveaux.
 *
 * Système de 25 niveaux avec chevauchement par tranches d'âge:
 * - 6 ans: niveaux 1-10
 * - 7 ans: niveaux 5-14
 * - 8 ans: niveaux 10-19
 * - 9 ans: niveaux 15-24
 * - 10 ans: niveaux 16-25
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
// TRANCHES D'ÂGE → PLAGES DE NIVEAUX
// ============================================

/**
 * Mapping des tranches d'âge vers les plages de niveaux affichées
 * L'enfant voit toujours 10 niveaux correspondant à son âge
 * Avec un chevauchement entre les tranches pour une progression naturelle
 */
export const LEVEL_RANGES: Record<number, { start: number; end: number }> = {
  6: { start: 1, end: 10 },   // Niveaux 1-10 pour 6 ans
  7: { start: 5, end: 14 },   // Niveaux 5-14 pour 7 ans
  8: { start: 10, end: 19 },  // Niveaux 10-19 pour 8 ans
  9: { start: 15, end: 24 },  // Niveaux 15-24 pour 9 ans
  10: { start: 16, end: 25 }, // Niveaux 16-25 pour 10 ans
};

/**
 * Obtient la plage de niveaux pour un âge donné
 */
export function getLevelRangeForAge(age: number): { start: number; end: number } {
  // Clamp age between 6 and 10
  const clampedAge = Math.max(6, Math.min(10, age));
  return LEVEL_RANGES[clampedAge] || LEVEL_RANGES[8]; // Default 8 ans
}

/**
 * Calcule l'âge à partir d'une date de naissance
 */
export function calculateAgeFromBirthDate(birthDate: number | undefined): number {
  if (!birthDate) return 8; // Défaut: 8 ans
  const ageInYears = (Date.now() - birthDate) / (1000 * 60 * 60 * 24 * 365);
  return Math.floor(ageInYears);
}

/**
 * Obtient les niveaux pour un âge donné (10 niveaux)
 */
export function getLevelsForAge(age: number): LogixLevelConfig[] {
  const range = getLevelRangeForAge(age);
  return logixLevels.filter(
    (level) => level.displayOrder >= range.start && level.displayOrder <= range.end
  );
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
