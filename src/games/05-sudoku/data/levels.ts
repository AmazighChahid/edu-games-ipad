/**
 * Sudoku Levels Configuration
 *
 * Système de 10 niveaux progressifs cohérent avec les autres jeux
 * + Mode Entraînement pour personnalisation libre
 *
 * Progression :
 * - Niveaux 1-2 : 4×4 Découverte (4-6 cases vides)
 * - Niveaux 3-4 : 4×4 Défi (6-8 cases vides)
 * - Niveaux 5-6 : 6×6 Découverte (8-12 cases vides)
 * - Niveaux 7-8 : 6×6 Défi (12-16 cases vides)
 * - Niveau 9    : 9×9 Découverte (20-25 cases vides)
 * - Niveau 10   : 9×9 Défi (30+ cases vides)
 */

import type {
  SudokuSize,
  SudokuDifficulty,
  SudokuTheme,
  SudokuLevelConfig,
  TrainingConfig,
  THEME_SYMBOLS,
} from '../types';

// ============================================================================
// 10 NIVEAUX PROGRESSIFS
// ============================================================================

export const SUDOKU_LEVELS: SudokuLevelConfig[] = [
  // === Niveaux 1-2 : 4×4 Découverte ===
  {
    id: 'sudoku-level-1',
    number: 1,
    label: 'Premier Pas',
    size: 4,
    difficulty: 1,
    emptyCells: 4,
    theme: 'animals',
    isUnlocked: true,
    isCompleted: false,
  },
  {
    id: 'sudoku-level-2',
    number: 2,
    label: 'Animaux Cachés',
    size: 4,
    difficulty: 1,
    emptyCells: 6,
    theme: 'fruits',
    isUnlocked: false,
    isCompleted: false,
  },

  // === Niveaux 3-4 : 4×4 Défi ===
  {
    id: 'sudoku-level-3',
    number: 3,
    label: 'Petit Défi',
    size: 4,
    difficulty: 2,
    emptyCells: 6,
    theme: 'shapes',
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: 'sudoku-level-4',
    number: 4,
    label: 'Champion Mini',
    size: 4,
    difficulty: 2,
    emptyCells: 8,
    theme: 'colors',
    isUnlocked: false,
    isCompleted: false,
  },

  // === Niveaux 5-6 : 6×6 Découverte ===
  {
    id: 'sudoku-level-5',
    number: 5,
    label: 'Nouvelle Aventure',
    size: 6,
    difficulty: 1,
    emptyCells: 8,
    theme: 'animals',
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: 'sudoku-level-6',
    number: 6,
    label: 'Zoo Puzzle',
    size: 6,
    difficulty: 1,
    emptyCells: 12,
    theme: 'fruits',
    isUnlocked: false,
    isCompleted: false,
  },

  // === Niveaux 7-8 : 6×6 Défi ===
  {
    id: 'sudoku-level-7',
    number: 7,
    label: 'Réflexion',
    size: 6,
    difficulty: 2,
    emptyCells: 14,
    theme: 'shapes',
    isUnlocked: false,
    isCompleted: false,
  },
  {
    id: 'sudoku-level-8',
    number: 8,
    label: 'Expert en Herbe',
    size: 6,
    difficulty: 2,
    emptyCells: 16,
    theme: 'numbers',
    isUnlocked: false,
    isCompleted: false,
  },

  // === Niveau 9 : 9×9 Découverte ===
  {
    id: 'sudoku-level-9',
    number: 9,
    label: 'Vrai Sudoku',
    size: 9,
    difficulty: 1,
    emptyCells: 25,
    theme: 'numbers',
    isUnlocked: false,
    isCompleted: false,
  },

  // === Niveau 10 : 9×9 Défi ===
  {
    id: 'sudoku-level-10',
    number: 10,
    label: 'Maître Sudoku',
    size: 9,
    difficulty: 2,
    emptyCells: 35,
    theme: 'numbers',
    isUnlocked: false,
    isCompleted: false,
  },
];

// ============================================================================
// CONFIGURATION MODE ENTRAÎNEMENT
// ============================================================================

/**
 * Configuration par défaut du mode entraînement
 */
export const DEFAULT_TRAINING_CONFIG: TrainingConfig = {
  size: 4,
  theme: 'fruits',
  difficulty: 1,
};

/**
 * Options disponibles pour le mode entraînement
 */
export const TRAINING_OPTIONS = {
  sizes: [4, 6, 9] as SudokuSize[],
  themes: ['fruits', 'animals', 'shapes', 'colors', 'numbers'] as SudokuTheme[],
  difficulties: [1, 2, 3] as SudokuDifficulty[],
};

/**
 * Labels pour les options d'entraînement
 */
export const TRAINING_LABELS = {
  sizes: {
    4: '4×4 Mini',
    6: '6×6 Moyen',
    9: '9×9 Classique',
  } as Record<SudokuSize, string>,
  themes: {
    fruits: 'Fruits',
    animals: 'Animaux',
    shapes: 'Formes',
    colors: 'Couleurs',
    numbers: 'Chiffres',
  } as Record<SudokuTheme, string>,
  difficulties: {
    1: 'Découverte',
    2: 'Défi',
    3: 'Expert',
  } as Record<SudokuDifficulty, string>,
};

/**
 * Emojis pour les thèmes (affichage dans le sélecteur)
 */
export const THEME_PREVIEW_EMOJIS: Record<SudokuTheme, string> = {
  fruits: '🍎🍌🍇',
  animals: '🐶🐱🐰',
  shapes: '⬛🔵🔺',
  colors: '🔴🔵🟢',
  numbers: '123',
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtient un niveau par son numéro (1-10)
 */
export function getLevelByNumber(number: number): SudokuLevelConfig | undefined {
  return SUDOKU_LEVELS.find((level) => level.number === number);
}

/**
 * Obtient un niveau par son ID
 */
export function getLevelById(id: string): SudokuLevelConfig | undefined {
  return SUDOKU_LEVELS.find((level) => level.id === id);
}

/**
 * Obtient le prochain niveau
 */
export function getNextLevel(currentNumber: number): SudokuLevelConfig | undefined {
  if (currentNumber >= 10) return undefined;
  return getLevelByNumber(currentNumber + 1);
}

/**
 * Obtient le niveau précédent
 */
export function getPreviousLevel(currentNumber: number): SudokuLevelConfig | undefined {
  if (currentNumber <= 1) return undefined;
  return getLevelByNumber(currentNumber - 1);
}

/**
 * Vérifie si un niveau est débloqué basé sur la progression
 */
export function isLevelUnlocked(
  levelNumber: number,
  completedLevels: string[]
): boolean {
  // Le niveau 1 est toujours débloqué
  if (levelNumber === 1) return true;

  // Les autres niveaux nécessitent d'avoir complété le niveau précédent
  const previousLevel = getLevelByNumber(levelNumber - 1);
  if (!previousLevel) return false;

  return completedLevels.includes(previousLevel.id);
}

/**
 * Calcule les étoiles basé sur la performance
 * @param errorsCount Nombre d'erreurs commises
 * @param hintsUsed Nombre d'indices utilisés
 * @param duration Durée en ms
 * @param idealDuration Durée idéale en ms (basée sur le niveau)
 */
export function calculateStars(
  errorsCount: number,
  hintsUsed: number,
  duration: number,
  idealDuration: number
): number {
  // 3 étoiles : 0 erreur, 0 indice, temps < idéal
  // 2 étoiles : ≤1 erreur, ≤1 indice, temps < 2x idéal
  // 1 étoile : terminé

  const isUnderIdealTime = duration <= idealDuration;
  const isUnderDoubleTime = duration <= idealDuration * 2;

  if (errorsCount === 0 && hintsUsed === 0 && isUnderIdealTime) {
    return 3;
  }

  if (errorsCount <= 1 && hintsUsed <= 1 && isUnderDoubleTime) {
    return 2;
  }

  return 1;
}

/**
 * Obtient la durée idéale pour un niveau (en ms)
 */
export function getIdealDuration(level: SudokuLevelConfig): number {
  // Base : 30 secondes par case vide pour débutants
  // Ajusté selon la difficulté
  const baseTimePerCell = 30000; // 30 secondes
  const difficultyMultiplier = level.difficulty === 1 ? 1 : level.difficulty === 2 ? 0.8 : 0.6;

  return Math.round(level.emptyCells * baseTimePerCell * difficultyMultiplier);
}

/**
 * Obtient une description du niveau pour la mascotte
 */
export function getLevelDescription(level: SudokuLevelConfig): string {
  const sizeDescriptions: Record<SudokuSize, string> = {
    4: 'une petite grille 4×4',
    6: 'une grille moyenne 6×6',
    9: 'une grande grille 9×9',
  };

  const difficultyDescriptions: Record<SudokuDifficulty, string> = {
    1: 'pour découvrir',
    2: 'pour un petit défi',
    3: "pour les experts",
  };

  return `C'est ${sizeDescriptions[level.size]} ${difficultyDescriptions[level.difficulty]} !`;
}

/**
 * Messages d'encouragement selon le niveau
 */
export const LEVEL_MESSAGES = {
  start: [
    "C'est parti ! Tu vas y arriver !",
    "Regarde bien chaque ligne et colonne !",
    "Prends ton temps, il n'y a pas de rush !",
  ],
  hint: [
    "Besoin d'un coup de patte ? Regarde cette case !",
    "Je t'ai trouvé un bon endroit pour commencer !",
    "Essaie de voir ce qui manque ici !",
  ],
  error: [
    "Oups ! Ce symbole est déjà dans cette ligne ou colonne.",
    "Hmm, essaie autre chose ! Tu peux le faire !",
    "Pas grave ! On apprend de ses erreurs !",
  ],
  success: [
    "Super ! Tu as bien placé ce symbole !",
    "Excellent travail !",
    "Génial ! Continue comme ça !",
  ],
  victory: [
    "Bravo ! Tu es un champion du Sudoku !",
    "Incroyable ! Tu as réussi !",
    "Victoire ! Tu peux être fier de toi !",
  ],
};

// ============================================================================
// EXPORTS LEGACY (compatibilité avec l'ancien code)
// ============================================================================

export type GridSize = '4x4' | '6x6' | '9x9';

export interface SudokuLevel {
  id: string;
  name: string;
  description: string;
  gridSize: GridSize;
  difficulty: 'easy' | 'medium' | 'hard';
  prefilled: number;
  symbolSet: 'numbers' | 'animals' | 'shapes' | 'emojis';
  idealTime: number;
  optimalMoves: number;
  ageRange: string;
  locked: boolean;
  unlockCondition?: string;
}

// Convertit l'ancien format vers le nouveau si nécessaire
export function convertToLegacyLevel(level: SudokuLevelConfig): SudokuLevel {
  const totalCells = level.size * level.size;
  const prefilled = totalCells - level.emptyCells;

  const gridSizeMap: Record<SudokuSize, GridSize> = {
    4: '4x4',
    6: '6x6',
    9: '9x9',
  };

  const difficultyMap: Record<SudokuDifficulty, 'easy' | 'medium' | 'hard'> = {
    1: 'easy',
    2: 'medium',
    3: 'hard',
  };

  const symbolSetMap: Record<SudokuTheme, 'numbers' | 'animals' | 'shapes' | 'emojis'> = {
    numbers: 'numbers',
    animals: 'animals',
    shapes: 'shapes',
    colors: 'emojis',
    fruits: 'emojis',
  };

  const ageRanges: Record<SudokuSize, string> = {
    4: '6-7',
    6: '7-8',
    9: '9-10',
  };

  return {
    id: level.id,
    name: level.label,
    description: getLevelDescription(level),
    gridSize: gridSizeMap[level.size],
    difficulty: difficultyMap[level.difficulty],
    prefilled,
    symbolSet: symbolSetMap[level.theme],
    idealTime: Math.round(getIdealDuration(level) / 1000),
    optimalMoves: level.emptyCells,
    ageRange: ageRanges[level.size],
    locked: !level.isUnlocked,
    unlockCondition: level.number > 1 ? `Complete level ${level.number - 1}` : undefined,
  };
}

// Pour compatibilité avec l'ancien code
export function getAllLevels(): SudokuLevel[] {
  return SUDOKU_LEVELS.map(convertToLegacyLevel);
}

export default SUDOKU_LEVELS;
