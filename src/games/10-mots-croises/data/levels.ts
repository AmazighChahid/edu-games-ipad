/**
 * Mots Croisés - Level Configurations
 *
 * Fichier standardisé de niveaux conformément à la structure projet.
 * Compatible avec GameIntroTemplate via LevelConfig.
 */

import { CROSSWORD_GRIDS, getGridById } from './grids';
import type { CrosswordLevel, CrosswordDifficulty } from '../types';

// ============================================
// TYPES DE NIVEAU STANDARDISÉ
// ============================================

export interface MotsCroisesLevel {
  id: string;
  gameId: 'mots-croises';
  difficulty: 'easy' | 'medium' | 'hard';
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  name: string;
  description: string;
  difficultyLevel: number; // 1-10
  grid: CrosswordLevel;
  theme: string;
  themeEmoji: string;
  wordCount: number;
  hintsAvailable: number;
}

// ============================================
// DÉFINITION DES 10 NIVEAUX
// ============================================

export const motsCroisesLevels: MotsCroisesLevel[] = [
  // NIVEAU 1 : Animaux (6 ans - très facile)
  {
    id: 'level_1',
    gameId: 'mots-croises',
    difficulty: 'easy',
    displayOrder: 1,
    targetAge: 6,
    estimatedMinutes: 2,
    name: 'Les Animaux',
    description: 'Découvre les noms des animaux !',
    difficultyLevel: 1,
    grid: CROSSWORD_GRIDS[0], // animaux-1
    theme: 'Animaux',
    themeEmoji: '🐾',
    wordCount: 4,
    hintsAvailable: 4,
  },
  // NIVEAU 2 : Fruits (6-7 ans - facile)
  {
    id: 'level_2',
    gameId: 'mots-croises',
    difficulty: 'easy',
    displayOrder: 2,
    targetAge: 6,
    estimatedMinutes: 2,
    name: 'Les Fruits',
    description: 'Trouve les noms des fruits !',
    difficultyLevel: 2,
    grid: CROSSWORD_GRIDS[1], // fruits-1
    theme: 'Fruits',
    themeEmoji: '🍎',
    wordCount: 4,
    hintsAvailable: 4,
  },
  // NIVEAU 3 : Couleurs (7 ans - facile)
  {
    id: 'level_3',
    gameId: 'mots-croises',
    difficulty: 'easy',
    displayOrder: 3,
    targetAge: 7,
    estimatedMinutes: 2,
    name: 'Les Couleurs',
    description: "Les couleurs de l'arc-en-ciel !",
    difficultyLevel: 3,
    grid: CROSSWORD_GRIDS[2], // couleurs-1
    theme: 'Couleurs',
    themeEmoji: '🌈',
    wordCount: 4,
    hintsAvailable: 4,
  },
  // NIVEAU 4 : Corps humain (7-8 ans - facile)
  {
    id: 'level_4',
    gameId: 'mots-croises',
    difficulty: 'easy',
    displayOrder: 4,
    targetAge: 7,
    estimatedMinutes: 2,
    name: 'Le Corps',
    description: 'Les parties du corps humain !',
    difficultyLevel: 4,
    grid: CROSSWORD_GRIDS[3], // corps-1
    theme: 'Corps',
    themeEmoji: '🧍',
    wordCount: 4,
    hintsAvailable: 4,
  },
  // NIVEAU 5 : École (8 ans - moyen)
  {
    id: 'level_5',
    gameId: 'mots-croises',
    difficulty: 'medium',
    displayOrder: 5,
    targetAge: 8,
    estimatedMinutes: 3,
    name: "À l'École",
    description: "Le vocabulaire de l'école !",
    difficultyLevel: 5,
    grid: CROSSWORD_GRIDS[4], // ecole-2
    theme: 'École',
    themeEmoji: '🏫',
    wordCount: 5,
    hintsAvailable: 4,
  },
  // NIVEAU 6 : Maison (8-9 ans - moyen)
  {
    id: 'level_6',
    gameId: 'mots-croises',
    difficulty: 'medium',
    displayOrder: 6,
    targetAge: 8,
    estimatedMinutes: 3,
    name: 'La Maison',
    description: 'Les pièces et objets de la maison !',
    difficultyLevel: 6,
    grid: CROSSWORD_GRIDS[5], // maison-2
    theme: 'Maison',
    themeEmoji: '🏠',
    wordCount: 4,
    hintsAvailable: 4,
  },
  // NIVEAU 7 : Transports (9 ans - moyen)
  {
    id: 'level_7',
    gameId: 'mots-croises',
    difficulty: 'medium',
    displayOrder: 7,
    targetAge: 9,
    estimatedMinutes: 3,
    name: 'Les Transports',
    description: 'Comment se déplacer ?',
    difficultyLevel: 7,
    grid: CROSSWORD_GRIDS[6], // transport-2
    theme: 'Transport',
    themeEmoji: '🚗',
    wordCount: 5,
    hintsAvailable: 4,
  },
  // NIVEAU 8 : Nature (9-10 ans - difficile)
  {
    id: 'level_8',
    gameId: 'mots-croises',
    difficulty: 'hard',
    displayOrder: 8,
    targetAge: 9,
    estimatedMinutes: 4,
    name: 'La Nature',
    description: 'Découvre le vocabulaire de la nature !',
    difficultyLevel: 8,
    grid: CROSSWORD_GRIDS[7], // nature-3
    theme: 'Nature',
    themeEmoji: '🌲',
    wordCount: 6,
    hintsAvailable: 5,
  },
  // NIVEAU 9 : Métiers (10 ans - difficile)
  {
    id: 'level_9',
    gameId: 'mots-croises',
    difficulty: 'hard',
    displayOrder: 9,
    targetAge: 10,
    estimatedMinutes: 4,
    name: 'Les Métiers',
    description: 'Découvre différents métiers !',
    difficultyLevel: 9,
    grid: CROSSWORD_GRIDS[8], // metiers-3
    theme: 'Métiers',
    themeEmoji: '👨‍🔧',
    wordCount: 5,
    hintsAvailable: 5,
  },
  // NIVEAU 10 : Saisons (10+ ans - expert)
  {
    id: 'level_10',
    gameId: 'mots-croises',
    difficulty: 'hard',
    displayOrder: 10,
    targetAge: 10,
    estimatedMinutes: 5,
    name: 'Les Saisons',
    description: 'Le vocabulaire des quatre saisons !',
    difficultyLevel: 10,
    grid: CROSSWORD_GRIDS[9], // saisons-3
    theme: 'Saisons',
    themeEmoji: '🍂',
    wordCount: 6,
    hintsAvailable: 5,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtient un niveau par son ID
 */
export function getLevel(levelId: string): MotsCroisesLevel | undefined {
  return motsCroisesLevels.find((level) => level.id === levelId);
}

/**
 * Obtient le niveau par défaut (premier niveau)
 */
export function getDefaultLevel(): MotsCroisesLevel {
  return motsCroisesLevels[0];
}

/**
 * Obtient un niveau par son ordre d'affichage
 */
export function getLevelByOrder(order: number): MotsCroisesLevel | undefined {
  return motsCroisesLevels.find((level) => level.displayOrder === order);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard'
): MotsCroisesLevel[] {
  return motsCroisesLevels.filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient le niveau suivant
 */
export function getNextLevel(currentLevelId: string): MotsCroisesLevel | undefined {
  const currentLevel = getLevel(currentLevelId);
  if (!currentLevel) return undefined;
  return motsCroisesLevels.find(
    (level) => level.displayOrder === currentLevel.displayOrder + 1
  );
}

/**
 * Obtient un niveau par l'ID de la grille
 */
export function getLevelByGridId(gridId: string): MotsCroisesLevel | undefined {
  return motsCroisesLevels.find((level) => level.grid.id === gridId);
}

/**
 * Obtient la grille d'un niveau
 */
export function getGridForLevel(levelId: string): CrosswordLevel | undefined {
  const level = getLevel(levelId);
  return level?.grid;
}

// ============================================
// RE-EXPORTS DEPUIS GRIDS
// ============================================

export {
  CROSSWORD_GRIDS,
  getGridById,
} from './grids';
