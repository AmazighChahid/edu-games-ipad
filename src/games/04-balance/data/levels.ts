/**
 * Balance Logic - Level Configurations
 *
 * Fichier standardisé de niveaux conformément à la structure projet.
 * Les puzzles sont définis dans puzzles.ts et utilisés ici pour construire les niveaux.
 */

import {
  balancePuzzles,
  getAllPuzzles,
  getPuzzleById,
  getPuzzleByLevel,
  getPuzzlesByPhase,
  getPuzzlesByDifficulty,
  getPuzzlesByAgeGroup,
  getNextPuzzle,
  isPhaseUnlocked,
  getPhaseProgress,
} from './puzzles';
import type { Puzzle, Phase } from '../types';

// ============================================
// TYPES DE NIVEAU
// ============================================

export interface BalanceLevel {
  id: string;
  gameId: 'balance';
  difficulty: 'easy' | 'medium' | 'hard';
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  name: string;
  description: string;
  phase: Phase;
  puzzle: Puzzle;
  hintsAvailable: number;
}

// ============================================
// CONVERSION PUZZLE → LEVEL
// ============================================

function puzzleToLevel(puzzle: Puzzle): BalanceLevel {
  const difficultyMap: Record<number, 'easy' | 'medium' | 'hard'> = {
    1: 'easy',
    2: 'easy',
    3: 'medium',
    4: 'medium',
    5: 'hard',
  };

  const ageMap: Record<string, number> = {
    '6-7': 6,
    '7-8': 7,
    '8-9': 8,
    '9-10': 9,
  };

  return {
    id: `level_${puzzle.level}`,
    gameId: 'balance',
    difficulty: difficultyMap[puzzle.difficulty] || 'medium',
    displayOrder: puzzle.level,
    targetAge: ageMap[puzzle.ageGroup] || 7,
    estimatedMinutes: Math.ceil(puzzle.maxAttemptsForThreeStars * 1.5),
    name: puzzle.name,
    description: puzzle.description,
    phase: puzzle.phase,
    puzzle,
    hintsAvailable: puzzle.hints.length,
  };
}

// ============================================
// DÉFINITION DES NIVEAUX
// ============================================

export const balanceLevels: BalanceLevel[] = balancePuzzles.map(puzzleToLevel);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtient un niveau par son ID
 */
export function getLevel(levelId: string): BalanceLevel | undefined {
  return balanceLevels.find((level) => level.id === levelId);
}

/**
 * Obtient le niveau par défaut (premier niveau)
 */
export function getDefaultLevel(): BalanceLevel {
  return balanceLevels[0];
}

/**
 * Obtient un niveau par son ordre d'affichage
 */
export function getLevelByOrder(order: number): BalanceLevel | undefined {
  return balanceLevels.find((level) => level.displayOrder === order);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): BalanceLevel[] {
  return balanceLevels.filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient les niveaux par phase
 */
export function getLevelsByPhase(phase: Phase): BalanceLevel[] {
  return balanceLevels.filter((level) => level.phase === phase);
}

/**
 * Obtient le niveau suivant
 */
export function getNextLevel(currentLevelId: string): BalanceLevel | undefined {
  const currentLevel = getLevel(currentLevelId);
  if (!currentLevel) return undefined;
  return balanceLevels.find((level) => level.displayOrder === currentLevel.displayOrder + 1);
}

/**
 * Vérifie si une phase est débloquée
 */
export function isLevelPhaseUnlocked(phase: Phase, completedLevels: number): boolean {
  return isPhaseUnlocked(phase, completedLevels);
}

/**
 * Obtient la progression d'une phase
 */
export function getLevelPhaseProgress(phase: Phase, completedLevelIds: string[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  // Convertir les IDs de niveau en IDs de puzzle
  const completedPuzzleIds = completedLevelIds.map((id) => {
    const levelNum = parseInt(id.replace('level_', ''), 10);
    return `balance_${levelNum}`;
  });
  return getPhaseProgress(phase, completedPuzzleIds);
}

// ============================================
// RE-EXPORTS DEPUIS PUZZLES
// ============================================

export {
  balancePuzzles,
  getAllPuzzles,
  getPuzzleById,
  getPuzzleByLevel,
  getPuzzlesByPhase,
  getPuzzlesByDifficulty as getPuzzlesByDifficultyLevel,
  getPuzzlesByAgeGroup,
  getNextPuzzle,
  isPhaseUnlocked,
  getPhaseProgress,
};
