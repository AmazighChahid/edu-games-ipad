/**
 * Mots Croisés - Level Configurations
 *
 * Fichier standardisé de niveaux conformément à la structure projet.
 * Les grilles sont définies dans grids.ts et utilisées ici pour construire les niveaux.
 */

import {
  CROSSWORD_GRIDS,
  getGridById,
  getGridsByDifficulty as getGridsByDifficultyLevel,
  getFirstGrid,
  getAllGrids,
} from './grids';
import type { CrosswordLevel, CrosswordDifficulty } from '../types';

// ============================================
// TYPES DE NIVEAU STANDARDISÉ
// ============================================

export interface CrosswordLevelConfig {
  id: string;
  gameId: 'mots-croises';
  difficulty: 'easy' | 'medium' | 'hard';
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  name: string;
  description: string;
  difficultyLevel: CrosswordDifficulty;
  grid: CrosswordLevel;
  theme: string;
  themeEmoji: string;
  wordCount: number;
  hintsAvailable: number;
}

// ============================================
// CONVERSION GRID → LEVEL_CONFIG
// ============================================

function gridToLevelConfig(grid: CrosswordLevel, index: number): CrosswordLevelConfig {
  const difficultyMap: Record<CrosswordDifficulty, 'easy' | 'medium' | 'hard'> = {
    1: 'easy',
    2: 'medium',
    3: 'hard',
  };

  const ageMap: Record<CrosswordDifficulty, number> = {
    1: 6,
    2: 8,
    3: 9,
  };

  return {
    id: `level_${index + 1}`,
    gameId: 'mots-croises',
    difficulty: difficultyMap[grid.difficulty],
    displayOrder: index + 1,
    targetAge: ageMap[grid.difficulty],
    estimatedMinutes: Math.ceil(grid.idealTime / 60),
    name: grid.name,
    description: grid.description,
    difficultyLevel: grid.difficulty,
    grid,
    theme: grid.theme,
    themeEmoji: grid.themeEmoji,
    wordCount: grid.words.length,
    hintsAvailable: grid.hintsAvailable,
  };
}

// ============================================
// DÉFINITION DES NIVEAUX
// ============================================

export const crosswordLevels: CrosswordLevelConfig[] = CROSSWORD_GRIDS.map(gridToLevelConfig);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtient un niveau par son ID
 */
export function getLevel(levelId: string): CrosswordLevelConfig | undefined {
  return crosswordLevels.find((level) => level.id === levelId);
}

/**
 * Obtient le niveau par défaut (premier niveau)
 */
export function getDefaultLevel(): CrosswordLevelConfig {
  return crosswordLevels[0];
}

/**
 * Obtient un niveau par son ordre d'affichage
 */
export function getLevelByOrder(order: number): CrosswordLevelConfig | undefined {
  return crosswordLevels.find((level) => level.displayOrder === order);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): CrosswordLevelConfig[] {
  return crosswordLevels.filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient les niveaux par thème
 */
export function getLevelsByTheme(theme: string): CrosswordLevelConfig[] {
  return crosswordLevels.filter((level) => level.theme.toLowerCase() === theme.toLowerCase());
}

/**
 * Obtient le niveau suivant
 */
export function getNextLevel(currentLevelId: string): CrosswordLevelConfig | undefined {
  const currentLevel = getLevel(currentLevelId);
  if (!currentLevel) return undefined;
  return crosswordLevels.find((level) => level.displayOrder === currentLevel.displayOrder + 1);
}

/**
 * Obtient un niveau par l'ID de la grille
 */
export function getLevelByGridId(gridId: string): CrosswordLevelConfig | undefined {
  return crosswordLevels.find((level) => level.grid.id === gridId);
}

// ============================================
// RE-EXPORTS DEPUIS GRIDS
// ============================================

export {
  CROSSWORD_GRIDS,
  getGridById,
  getGridsByDifficultyLevel,
  getFirstGrid,
  getAllGrids,
};
