/**
 * Suites Logiques - Level Configurations
 *
 * Fichier standardisé de niveaux conformément à la structure projet.
 * Les patterns sont définis dans patterns.ts et utilisés ici pour construire les niveaux.
 */

import { PATTERNS, getPatternsByDifficulty, getRandomPattern, getSequenceLength } from './patterns';
import type { PatternDefinition } from '../types';

// ============================================
// TYPES DE NIVEAU
// ============================================

export interface SuitesLogiquesLevel {
  id: string;
  gameId: 'suites-logiques';
  difficulty: 'easy' | 'medium' | 'hard';
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  name: string;
  description: string;
  difficultyLevel: number; // 1-10
  patterns: PatternDefinition[];
  sequenceLength: number;
  hintsAvailable: number;
}

// ============================================
// DÉFINITION DES NIVEAUX
// ============================================

export const suitesLogiquesLevels: SuitesLogiquesLevel[] = [
  // NIVEAU 1 : Alternances simples (6-7 ans)
  {
    id: 'level_1',
    gameId: 'suites-logiques',
    difficulty: 'easy',
    displayOrder: 1,
    targetAge: 6,
    estimatedMinutes: 3,
    name: 'Alternances',
    description: 'Découvre les motifs qui se répètent',
    difficultyLevel: 1,
    patterns: getPatternsByDifficulty(1),
    sequenceLength: getSequenceLength(1),
    hintsAvailable: 3,
  },
  // NIVEAU 2 : Motifs à 3 éléments (7-8 ans)
  {
    id: 'level_2',
    gameId: 'suites-logiques',
    difficulty: 'easy',
    displayOrder: 2,
    targetAge: 7,
    estimatedMinutes: 4,
    name: 'Trios',
    description: 'Des motifs avec 3 éléments différents',
    difficultyLevel: 2,
    patterns: getPatternsByDifficulty(2),
    sequenceLength: getSequenceLength(2),
    hintsAvailable: 3,
  },
  // NIVEAU 3 : Progressions visuelles (8 ans)
  {
    id: 'level_3',
    gameId: 'suites-logiques',
    difficulty: 'easy',
    displayOrder: 3,
    targetAge: 8,
    estimatedMinutes: 4,
    name: 'Transformations',
    description: 'Les formes changent de taille ou tournent',
    difficultyLevel: 3,
    patterns: getPatternsByDifficulty(3),
    sequenceLength: getSequenceLength(3),
    hintsAvailable: 3,
  },
  // NIVEAU 4 : Suites numériques simples (8-9 ans)
  {
    id: 'level_4',
    gameId: 'suites-logiques',
    difficulty: 'medium',
    displayOrder: 4,
    targetAge: 8,
    estimatedMinutes: 5,
    name: 'Suites numériques',
    description: 'Les nombres qui grandissent',
    difficultyLevel: 4,
    patterns: getPatternsByDifficulty(4),
    sequenceLength: getSequenceLength(4),
    hintsAvailable: 2,
  },
  // NIVEAU 5 : Suites complexes (9-10 ans)
  {
    id: 'level_5',
    gameId: 'suites-logiques',
    difficulty: 'medium',
    displayOrder: 5,
    targetAge: 9,
    estimatedMinutes: 5,
    name: 'Fibonacci',
    description: 'Des suites plus mystérieuses',
    difficultyLevel: 5,
    patterns: getPatternsByDifficulty(5),
    sequenceLength: getSequenceLength(5),
    hintsAvailable: 2,
  },
  // NIVEAU 6 : Motifs miroir et symétriques (9-10 ans)
  {
    id: 'level_6',
    gameId: 'suites-logiques',
    difficulty: 'medium',
    displayOrder: 6,
    targetAge: 9,
    estimatedMinutes: 6,
    name: 'Miroirs',
    description: 'Des motifs qui se reflètent',
    difficultyLevel: 6,
    patterns: getPatternsByDifficulty(6),
    sequenceLength: getSequenceLength(6),
    hintsAvailable: 2,
  },
  // NIVEAU 7 : Doubles transformations (10 ans)
  {
    id: 'level_7',
    gameId: 'suites-logiques',
    difficulty: 'medium',
    displayOrder: 7,
    targetAge: 10,
    estimatedMinutes: 6,
    name: 'Double défi',
    description: 'Deux transformations à la fois',
    difficultyLevel: 7,
    patterns: getPatternsByDifficulty(7),
    sequenceLength: getSequenceLength(7),
    hintsAvailable: 2,
  },
  // NIVEAU 8 : Suites avancées (10-11 ans)
  {
    id: 'level_8',
    gameId: 'suites-logiques',
    difficulty: 'hard',
    displayOrder: 8,
    targetAge: 10,
    estimatedMinutes: 7,
    name: 'Carrés magiques',
    description: 'Les nombres au carré',
    difficultyLevel: 8,
    patterns: getPatternsByDifficulty(8),
    sequenceLength: getSequenceLength(8),
    hintsAvailable: 1,
  },
  // NIVEAU 9 : Combinaisons complexes (11 ans)
  {
    id: 'level_9',
    gameId: 'suites-logiques',
    difficulty: 'hard',
    displayOrder: 9,
    targetAge: 10,
    estimatedMinutes: 8,
    name: 'Expert',
    description: 'Combinaisons de plusieurs règles',
    difficultyLevel: 9,
    patterns: getPatternsByDifficulty(9),
    sequenceLength: getSequenceLength(9),
    hintsAvailable: 1,
  },
  // NIVEAU 10 : Expert (11-12 ans)
  {
    id: 'level_10',
    gameId: 'suites-logiques',
    difficulty: 'hard',
    displayOrder: 10,
    targetAge: 10,
    estimatedMinutes: 10,
    name: 'Maître des suites',
    description: 'Les suites les plus difficiles',
    difficultyLevel: 10,
    patterns: getPatternsByDifficulty(10),
    sequenceLength: getSequenceLength(10),
    hintsAvailable: 1,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtient un niveau par son ID
 */
export function getLevel(levelId: string): SuitesLogiquesLevel | undefined {
  return suitesLogiquesLevels.find((level) => level.id === levelId);
}

/**
 * Obtient le niveau par défaut (premier niveau)
 */
export function getDefaultLevel(): SuitesLogiquesLevel {
  return suitesLogiquesLevels[0];
}

/**
 * Obtient un niveau par son ordre d'affichage
 */
export function getLevelByOrder(order: number): SuitesLogiquesLevel | undefined {
  return suitesLogiquesLevels.find((level) => level.displayOrder === order);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): SuitesLogiquesLevel[] {
  return suitesLogiquesLevels.filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient le niveau suivant
 */
export function getNextLevel(currentLevelId: string): SuitesLogiquesLevel | undefined {
  const currentLevel = getLevel(currentLevelId);
  if (!currentLevel) return undefined;
  return suitesLogiquesLevels.find((level) => level.displayOrder === currentLevel.displayOrder + 1);
}

/**
 * Obtient un pattern aléatoire pour un niveau donné
 */
export function getRandomPatternForLevel(levelId: string): PatternDefinition | undefined {
  const level = getLevel(levelId);
  if (!level) return undefined;
  return getRandomPattern(level.difficultyLevel);
}

// ============================================
// EXPORTS
// ============================================

export {
  PATTERNS,
  getPatternsByDifficulty,
  getRandomPattern,
  getSequenceLength,
};
