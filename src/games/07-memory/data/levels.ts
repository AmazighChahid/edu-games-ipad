/**
 * Memory Game Levels
 *
 * Configuration des niveaux progressifs
 */

import type { MemoryLevel, Difficulty, CardTheme } from '../types';

// ============================================================================
// NIVEAUX FACILES (4-6 paires)
// ============================================================================

const easyLevels: MemoryLevel[] = [
  {
    id: 'memory-easy-01',
    name: 'Premier Match',
    description: 'Découvre le jeu de mémoire',
    pairCount: 4,
    theme: 'animals',
    difficulty: 'easy',
    timeLimit: 0,
    idealTime: 30,
    idealAttempts: 6,
    ageRange: '4-6',
    locked: false,
  },
  {
    id: 'memory-easy-02',
    name: 'Animaux Cachés',
    description: 'Retrouve les animaux par paires',
    pairCount: 4,
    theme: 'animals',
    difficulty: 'easy',
    timeLimit: 0,
    idealTime: 35,
    idealAttempts: 6,
    ageRange: '4-6',
    locked: false,
  },
  {
    id: 'memory-easy-03',
    name: 'Fruits Jumeaux',
    description: 'Des fruits délicieux à associer',
    pairCount: 4,
    theme: 'fruits',
    difficulty: 'easy',
    timeLimit: 0,
    idealTime: 35,
    idealAttempts: 6,
    ageRange: '4-6',
    locked: true,
    unlockCondition: 'Complete memory-easy-02',
  },
  {
    id: 'memory-easy-04',
    name: 'Plus de Cartes',
    description: 'On ajoute des cartes !',
    pairCount: 6,
    theme: 'animals',
    difficulty: 'easy',
    timeLimit: 0,
    idealTime: 50,
    idealAttempts: 9,
    ageRange: '5-7',
    locked: true,
    unlockCondition: 'Complete memory-easy-03',
  },
  {
    id: 'memory-easy-05',
    name: 'Véhicules Express',
    description: 'Des voitures et des avions',
    pairCount: 6,
    theme: 'vehicles',
    difficulty: 'easy',
    timeLimit: 0,
    idealTime: 55,
    idealAttempts: 9,
    ageRange: '5-7',
    locked: true,
    unlockCondition: 'Complete memory-easy-04',
  },
  {
    id: 'memory-easy-06',
    name: 'Nature Secrète',
    description: 'Les merveilles de la nature',
    pairCount: 6,
    theme: 'nature',
    difficulty: 'easy',
    timeLimit: 0,
    idealTime: 60,
    idealAttempts: 9,
    ageRange: '5-7',
    locked: true,
    unlockCondition: 'Complete memory-easy-05',
  },
];

// ============================================================================
// NIVEAUX MOYENS (8 paires)
// ============================================================================

const mediumLevels: MemoryLevel[] = [
  {
    id: 'memory-medium-01',
    name: 'Grand Défi',
    description: '8 paires à retrouver !',
    pairCount: 8,
    theme: 'animals',
    difficulty: 'medium',
    timeLimit: 0,
    idealTime: 75,
    idealAttempts: 12,
    ageRange: '6-8',
    locked: true,
    unlockCondition: 'Complete all easy levels',
  },
  {
    id: 'memory-medium-02',
    name: 'Contre la Montre',
    description: 'Trouve avant que le temps s\'écoule !',
    pairCount: 8,
    theme: 'fruits',
    difficulty: 'medium',
    timeLimit: 120,
    idealTime: 70,
    idealAttempts: 12,
    ageRange: '6-8',
    locked: true,
    unlockCondition: 'Complete memory-medium-01',
  },
  {
    id: 'memory-medium-03',
    name: 'Émojis Fous',
    description: 'Les émojis jouent à cache-cache',
    pairCount: 8,
    theme: 'emojis',
    difficulty: 'medium',
    timeLimit: 0,
    idealTime: 80,
    idealAttempts: 12,
    ageRange: '6-8',
    locked: true,
    unlockCondition: 'Complete memory-medium-02',
  },
  {
    id: 'memory-medium-04',
    name: 'Voyage Spatial',
    description: 'L\'espace et ses mystères',
    pairCount: 8,
    theme: 'space',
    difficulty: 'medium',
    timeLimit: 100,
    idealTime: 70,
    idealAttempts: 12,
    ageRange: '6-8',
    locked: true,
    unlockCondition: 'Complete memory-medium-03',
  },
];

// ============================================================================
// NIVEAUX DIFFICILES (10-12 paires)
// ============================================================================

const hardLevels: MemoryLevel[] = [
  {
    id: 'memory-hard-01',
    name: 'Champion',
    description: '10 paires pour les pros',
    pairCount: 10,
    theme: 'animals',
    difficulty: 'hard',
    timeLimit: 0,
    idealTime: 100,
    idealAttempts: 15,
    ageRange: '7-10',
    locked: true,
    unlockCondition: 'Complete all medium levels',
  },
  {
    id: 'memory-hard-02',
    name: 'Méga Mémoire',
    description: '12 paires ! Le maximum !',
    pairCount: 12,
    theme: 'emojis',
    difficulty: 'hard',
    timeLimit: 0,
    idealTime: 120,
    idealAttempts: 18,
    ageRange: '8-10',
    locked: true,
    unlockCondition: 'Complete memory-hard-01',
  },
  {
    id: 'memory-hard-03',
    name: 'Speed Run',
    description: '10 paires en 90 secondes !',
    pairCount: 10,
    theme: 'vehicles',
    difficulty: 'hard',
    timeLimit: 90,
    idealTime: 70,
    idealAttempts: 15,
    ageRange: '8-10',
    locked: true,
    unlockCondition: 'Complete memory-hard-02',
  },
  {
    id: 'memory-hard-04',
    name: 'Maître Mémoire',
    description: 'Le niveau ultime !',
    pairCount: 12,
    theme: 'space',
    difficulty: 'hard',
    timeLimit: 120,
    idealTime: 90,
    idealAttempts: 18,
    ageRange: '9-10',
    locked: true,
    unlockCondition: 'Complete memory-hard-03 twice',
  },
];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtient tous les niveaux
 */
export function getAllLevels(): MemoryLevel[] {
  return [...easyLevels, ...mediumLevels, ...hardLevels];
}

/**
 * Obtient un niveau par son ID
 */
export function getLevelById(id: string): MemoryLevel | undefined {
  return getAllLevels().find((level) => level.id === id);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: Difficulty): MemoryLevel[] {
  return getAllLevels().filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient le prochain niveau
 */
export function getNextLevel(currentId: string): MemoryLevel | undefined {
  const allLevels = getAllLevels();
  const currentIndex = allLevels.findIndex((level) => level.id === currentId);

  if (currentIndex === -1 || currentIndex === allLevels.length - 1) {
    return undefined;
  }

  return allLevels[currentIndex + 1];
}

/**
 * Obtient le premier niveau
 */
export function getFirstLevel(): MemoryLevel {
  return easyLevels[0];
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  easyLevels as MEMORY_EASY_LEVELS,
  mediumLevels as MEMORY_MEDIUM_LEVELS,
  hardLevels as MEMORY_HARD_LEVELS,
  getAllLevels,
  getLevelById,
  getLevelsByDifficulty,
  getNextLevel,
  getFirstLevel,
};
