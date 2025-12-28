/**
 * Conteur Curieux - Level Configurations
 *
 * Fichier standardisé de niveaux conformément à la structure projet.
 * Les histoires et niveaux sont définis dans stories.ts et utilisés ici.
 */

import {
  CONTEUR_LEVELS,
  getLevelById,
  getLevelsByDifficulty as getStoriesByDifficulty,
  getFirstLevel,
  getAllLevels,
} from './stories';
import type { ConteurLevel, ConteurDifficulty, Story } from '../types';

// ============================================
// TYPES DE NIVEAU STANDARDISÉ
// ============================================

export interface ConteurLevelConfig {
  id: string;
  gameId: 'conteur-curieux';
  difficulty: 'easy' | 'medium' | 'hard';
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  name: string;
  description: string;
  difficultyLevel: ConteurDifficulty;
  story: Story;
  hintsAvailable: number;
  passingScore: number;
}

// ============================================
// CONVERSION CONTEUR_LEVEL → LEVEL_CONFIG
// ============================================

function conteurLevelToConfig(level: ConteurLevel, index: number): ConteurLevelConfig {
  const difficultyMap: Record<ConteurDifficulty, 'easy' | 'medium' | 'hard'> = {
    1: 'easy',
    2: 'medium',
    3: 'hard',
  };

  const ageMap: Record<ConteurDifficulty, number> = {
    1: 6,
    2: 8,
    3: 9,
  };

  return {
    id: `level_${index + 1}`,
    gameId: 'conteur-curieux',
    difficulty: difficultyMap[level.difficulty],
    displayOrder: index + 1,
    targetAge: ageMap[level.difficulty],
    estimatedMinutes: level.story.readingTime + Math.ceil(level.story.questions.length * 0.5),
    name: level.name,
    description: level.description,
    difficultyLevel: level.difficulty,
    story: level.story,
    hintsAvailable: level.hintsAvailable,
    passingScore: level.passingScore,
  };
}

// ============================================
// DÉFINITION DES NIVEAUX
// ============================================

export const conteurLevels: ConteurLevelConfig[] = CONTEUR_LEVELS.map(conteurLevelToConfig);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtient un niveau par son ID
 */
export function getLevel(levelId: string): ConteurLevelConfig | undefined {
  return conteurLevels.find((level) => level.id === levelId);
}

/**
 * Obtient le niveau par défaut (premier niveau)
 */
export function getDefaultLevel(): ConteurLevelConfig {
  return conteurLevels[0];
}

/**
 * Obtient un niveau par son ordre d'affichage
 */
export function getLevelByOrder(order: number): ConteurLevelConfig | undefined {
  return conteurLevels.find((level) => level.displayOrder === order);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ConteurLevelConfig[] {
  return conteurLevels.filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient le niveau suivant
 */
export function getNextLevel(currentLevelId: string): ConteurLevelConfig | undefined {
  const currentLevel = getLevel(currentLevelId);
  if (!currentLevel) return undefined;
  return conteurLevels.find((level) => level.displayOrder === currentLevel.displayOrder + 1);
}

/**
 * Obtient un niveau par l'ID original du ConteurLevel
 */
export function getLevelByOriginalId(originalId: string): ConteurLevelConfig | undefined {
  const originalLevel = getLevelById(originalId);
  if (!originalLevel) return undefined;
  const index = CONTEUR_LEVELS.findIndex((l) => l.id === originalId);
  if (index === -1) return undefined;
  return conteurLevels[index];
}

// ============================================
// RE-EXPORTS DEPUIS STORIES
// ============================================

export {
  CONTEUR_LEVELS,
  getLevelById as getOriginalLevelById,
  getStoriesByDifficulty,
  getFirstLevel as getFirstOriginalLevel,
  getAllLevels as getAllOriginalLevels,
};
