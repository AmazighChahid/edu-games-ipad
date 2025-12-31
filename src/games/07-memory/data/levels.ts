/**
 * Memory Game Levels
 *
 * Niveau 0 (Entraînement) + 10 niveaux progressifs pour le jeu Super Mémoire
 * Progression : 4 → 6 → 8 → 10 → 12 paires
 */

import type { MemoryLevel, Difficulty, CardTheme } from '../types';

// ============================================================================
// NIVEAU 0 - ENTRAÎNEMENT (personnalisable)
// ============================================================================

/**
 * Niveau 0 - Mode Entraînement
 * Permet de choisir le thème et le nombre de paires
 * Toujours débloqué, pas de limite de temps
 */
const level0: MemoryLevel = {
  id: 'memory-level-00',
  name: 'Entraînement',
  description: 'Entraîne-toi librement avec le thème de ton choix',
  pairCount: 4,
  theme: 'animals',
  difficulty: 'easy',
  timeLimit: 0,
  idealTime: 0, // Pas d'objectif en mode entraînement
  idealAttempts: 0,
  ageRange: '4-10',
  locked: false,
  isTraining: true,
};

/**
 * Crée un niveau d'entraînement personnalisé
 */
export function createTrainingLevel(
  theme: CardTheme,
  pairCount: number
): MemoryLevel {
  const difficulty: Difficulty =
    pairCount <= 4 ? 'easy' :
    pairCount <= 6 ? 'easy' :
    pairCount <= 8 ? 'medium' : 'hard';

  return {
    ...level0,
    theme,
    pairCount,
    difficulty,
    name: `Entraînement (${pairCount} paires)`,
    description: `Mode libre avec ${pairCount} paires`,
  };
}

// ============================================================================
// LES 10 NIVEAUX DU JEU
// ============================================================================

/**
 * Niveau 1 - Premier Match (4 paires, animaux)
 * Introduction au jeu, pas de limite de temps
 */
const level1: MemoryLevel = {
  id: 'memory-level-01',
  name: 'Premier Match',
  description: 'Découvre le jeu de mémoire avec 4 paires',
  pairCount: 4,
  theme: 'animals',
  difficulty: 'easy',
  timeLimit: 0,
  idealTime: 30,
  idealAttempts: 6,
  ageRange: '4-6',
  locked: false,
};

/**
 * Niveau 2 - Fruits Jumeaux (4 paires, fruits)
 * Nouveau thème, même difficulté
 */
const level2: MemoryLevel = {
  id: 'memory-level-02',
  name: 'Fruits Jumeaux',
  description: 'Des fruits délicieux à associer',
  pairCount: 4,
  theme: 'fruits',
  difficulty: 'easy',
  timeLimit: 0,
  idealTime: 35,
  idealAttempts: 6,
  ageRange: '4-6',
  locked: false,
};

/**
 * Niveau 3 - Plus de Cartes (6 paires, animaux)
 * Introduction de 6 paires
 */
const level3: MemoryLevel = {
  id: 'memory-level-03',
  name: 'Plus de Cartes',
  description: '6 paires à retrouver !',
  pairCount: 6,
  theme: 'animals',
  difficulty: 'easy',
  timeLimit: 0,
  idealTime: 50,
  idealAttempts: 10,
  ageRange: '5-7',
  locked: false,
};

/**
 * Niveau 4 - Véhicules Express (6 paires, véhicules)
 * 6 paires avec nouveau thème
 */
const level4: MemoryLevel = {
  id: 'memory-level-04',
  name: 'Véhicules Express',
  description: 'Des voitures et des avions',
  pairCount: 6,
  theme: 'vehicles',
  difficulty: 'easy',
  timeLimit: 0,
  idealTime: 55,
  idealAttempts: 10,
  ageRange: '5-7',
  locked: false,
};

/**
 * Niveau 5 - Nature Secrète (6 paires, nature)
 * Dernier niveau facile
 */
const level5: MemoryLevel = {
  id: 'memory-level-05',
  name: 'Nature Secrète',
  description: 'Les merveilles de la nature',
  pairCount: 6,
  theme: 'nature',
  difficulty: 'easy',
  timeLimit: 0,
  idealTime: 60,
  idealAttempts: 10,
  ageRange: '5-7',
  locked: false,
};

/**
 * Niveau 6 - Grand Défi (8 paires, animaux)
 * Passage à 8 paires, difficulté moyenne
 */
const level6: MemoryLevel = {
  id: 'memory-level-06',
  name: 'Grand Défi',
  description: '8 paires à retrouver !',
  pairCount: 8,
  theme: 'animals',
  difficulty: 'medium',
  timeLimit: 0,
  idealTime: 75,
  idealAttempts: 14,
  ageRange: '6-8',
  locked: false,
};

/**
 * Niveau 7 - Émojis Fous (8 paires, emojis)
 * 8 paires avec thème fun
 */
const level7: MemoryLevel = {
  id: 'memory-level-07',
  name: 'Émojis Fous',
  description: 'Les émojis jouent à cache-cache',
  pairCount: 8,
  theme: 'emojis',
  difficulty: 'medium',
  timeLimit: 0,
  idealTime: 80,
  idealAttempts: 14,
  ageRange: '6-8',
  locked: false,
};

/**
 * Niveau 8 - Voyage Spatial (10 paires, espace)
 * Passage à 10 paires, difficulté difficile
 */
const level8: MemoryLevel = {
  id: 'memory-level-08',
  name: 'Voyage Spatial',
  description: '10 paires dans l\'espace !',
  pairCount: 10,
  theme: 'space',
  difficulty: 'hard',
  timeLimit: 0,
  idealTime: 100,
  idealAttempts: 18,
  ageRange: '7-10',
  locked: false,
};

/**
 * Niveau 9 - Méga Mémoire (12 paires, emojis)
 * Maximum de paires
 */
const level9: MemoryLevel = {
  id: 'memory-level-09',
  name: 'Méga Mémoire',
  description: '12 paires ! Le maximum !',
  pairCount: 12,
  theme: 'emojis',
  difficulty: 'hard',
  timeLimit: 0,
  idealTime: 120,
  idealAttempts: 22,
  ageRange: '8-10',
  locked: false,
};

/**
 * Niveau 10 - Maître Mémoire (12 paires, espace, chrono)
 * Niveau ultime avec limite de temps
 */
const level10: MemoryLevel = {
  id: 'memory-level-10',
  name: 'Maître Mémoire',
  description: '12 paires en temps limité !',
  pairCount: 12,
  theme: 'space',
  difficulty: 'hard',
  timeLimit: 180, // 3 minutes
  idealTime: 120,
  idealAttempts: 22,
  ageRange: '8-10',
  locked: false,
};

// ============================================================================
// TABLEAU DES NIVEAUX
// ============================================================================

/** Tous les niveaux incluant le niveau 0 (entraînement) */
const ALL_LEVELS_WITH_TRAINING: MemoryLevel[] = [
  level0,
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
];

/** Niveaux de jeu uniquement (1-10) */
const ALL_LEVELS: MemoryLevel[] = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtient tous les niveaux
 */
export function getAllLevels(): MemoryLevel[] {
  return ALL_LEVELS;
}

/**
 * Obtient un niveau par son ID
 */
export function getLevelById(id: string): MemoryLevel | undefined {
  return ALL_LEVELS.find((level) => level.id === id);
}

/**
 * Obtient un niveau par son numéro (0-10)
 * Le niveau 0 est le mode entraînement
 */
export function getLevelByNumber(num: number): MemoryLevel | undefined {
  if (num < 0 || num > 10) return undefined;
  if (num === 0) return level0;
  return ALL_LEVELS[num - 1];
}

/**
 * Obtient le niveau d'entraînement (niveau 0)
 */
export function getTrainingLevel(): MemoryLevel {
  return level0;
}

/**
 * Obtient tous les niveaux incluant le niveau 0
 */
export function getAllLevelsWithTraining(): MemoryLevel[] {
  return ALL_LEVELS_WITH_TRAINING;
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: Difficulty): MemoryLevel[] {
  return ALL_LEVELS.filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient le prochain niveau
 */
export function getNextLevel(currentId: string): MemoryLevel | undefined {
  const currentIndex = ALL_LEVELS.findIndex((level) => level.id === currentId);

  if (currentIndex === -1 || currentIndex === ALL_LEVELS.length - 1) {
    return undefined;
  }

  return ALL_LEVELS[currentIndex + 1];
}

/**
 * Obtient le premier niveau
 */
export function getFirstLevel(): MemoryLevel {
  return level1;
}

/**
 * Obtient le nombre total de niveaux
 */
export function getTotalLevels(): number {
  return ALL_LEVELS.length;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ALL_LEVELS as MEMORY_LEVELS,
  ALL_LEVELS_WITH_TRAINING as MEMORY_LEVELS_WITH_TRAINING,
  level0, level1, level2, level3, level4, level5,
  level6, level7, level8, level9, level10,
};
