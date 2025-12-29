/**
 * Sudoku Levels Configuration
 *
 * Niveaux progressifs de Sudoku pour enfants :
 * - 4×4 : Introduction (6-7 ans)
 * - 6×6 : Intermédiaire (7-8 ans)
 * - 9×9 : Avancé (9-10 ans)
 */

// ============================================================================
// TYPES
// ============================================================================

export type GridSize = '4x4' | '6x6' | '9x9';

export interface SudokuLevel {
  id: string;
  name: string;
  description: string;
  gridSize: GridSize;
  difficulty: 'easy' | 'medium' | 'hard';
  /** Nombre de cases pré-remplies (plus = plus facile) */
  prefilled: number;
  /** Symboles utilisés (chiffres, animaux, formes) */
  symbolSet: 'numbers' | 'animals' | 'shapes' | 'emojis';
  /** Temps idéal en secondes (pour calcul étoiles) */
  idealTime: number;
  /** Nombre minimum de coups optimal */
  optimalMoves: number;
  /** Âge recommandé */
  ageRange: string;
  /** Verrouillé par défaut */
  locked: boolean;
  /** Condition de déverrouillage */
  unlockCondition?: string;
}

export interface LevelCategory {
  id: string;
  name: string;
  description: string;
  gridSize: GridSize;
  levels: SudokuLevel[];
}

// ============================================================================
// SYMBOLES DISPONIBLES
// ============================================================================

export const SYMBOL_SETS = {
  numbers: {
    4: ['1', '2', '3', '4'],
    6: ['1', '2', '3', '4', '5', '6'],
    9: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  },
  animals: {
    4: ['🐱', '🐶', '🐰', '🐻'],
    6: ['🐱', '🐶', '🐰', '🐻', '🦊', '🐼'],
    9: ['🐱', '🐶', '🐰', '🐻', '🦊', '🐼', '🐨', '🦁', '🐯'],
  },
  shapes: {
    4: ['●', '■', '▲', '★'],
    6: ['●', '■', '▲', '★', '◆', '♥'],
    9: ['●', '■', '▲', '★', '◆', '♥', '♣', '♠', '⬟'],
  },
  emojis: {
    4: ['🌟', '🌙', '☀️', '⭐'],
    6: ['🌟', '🌙', '☀️', '⭐', '🌈', '🌸'],
    9: ['🌟', '🌙', '☀️', '⭐', '🌈', '🌸', '🍀', '🌺', '❄️'],
  },
} as const;

// ============================================================================
// NIVEAUX 4×4 (INTRODUCTION)
// ============================================================================

const levels4x4: SudokuLevel[] = [
  {
    id: 'sudoku-4x4-01',
    name: 'Premier Pas',
    description: 'Découvre le Sudoku avec une petite grille',
    gridSize: '4x4',
    difficulty: 'easy',
    prefilled: 12, // 12/16 cases pré-remplies = très facile
    symbolSet: 'animals',
    idealTime: 60,
    optimalMoves: 4,
    ageRange: '6-7',
    locked: false,
  },
  {
    id: 'sudoku-4x4-02',
    name: 'Animaux Cachés',
    description: 'Trouve où placer les animaux manquants',
    gridSize: '4x4',
    difficulty: 'easy',
    prefilled: 10,
    symbolSet: 'animals',
    idealTime: 90,
    optimalMoves: 6,
    ageRange: '6-7',
    locked: false,
  },
  {
    id: 'sudoku-4x4-03',
    name: 'Formes Magiques',
    description: 'Les formes géométriques te guident',
    gridSize: '4x4',
    difficulty: 'easy',
    prefilled: 10,
    symbolSet: 'shapes',
    idealTime: 90,
    optimalMoves: 6,
    ageRange: '6-7',
    locked: false,
    unlockCondition: 'Complete sudoku-4x4-02',
  },
  {
    id: 'sudoku-4x4-04',
    name: 'Étoiles & Lune',
    description: 'Un ciel étoilé à compléter',
    gridSize: '4x4',
    difficulty: 'medium',
    prefilled: 8,
    symbolSet: 'emojis',
    idealTime: 120,
    optimalMoves: 8,
    ageRange: '6-7',
    locked: false,
    unlockCondition: 'Complete sudoku-4x4-03',
  },
  {
    id: 'sudoku-4x4-05',
    name: 'Premiers Chiffres',
    description: 'On passe aux chiffres maintenant !',
    gridSize: '4x4',
    difficulty: 'medium',
    prefilled: 8,
    symbolSet: 'numbers',
    idealTime: 120,
    optimalMoves: 8,
    ageRange: '6-7',
    locked: false,
    unlockCondition: 'Complete sudoku-4x4-04',
  },
  {
    id: 'sudoku-4x4-06',
    name: 'Le Défi',
    description: 'Es-tu prêt pour un vrai défi ?',
    gridSize: '4x4',
    difficulty: 'hard',
    prefilled: 6,
    symbolSet: 'numbers',
    idealTime: 180,
    optimalMoves: 10,
    ageRange: '6-7',
    locked: false,
    unlockCondition: 'Complete sudoku-4x4-05 twice',
  },
];

// ============================================================================
// NIVEAUX 6×6 (INTERMÉDIAIRE)
// ============================================================================

const levels6x6: SudokuLevel[] = [
  {
    id: 'sudoku-6x6-01',
    name: 'Nouvelle Aventure',
    description: 'Une grille plus grande, plus de possibilités !',
    gridSize: '6x6',
    difficulty: 'easy',
    prefilled: 24, // 24/36 = 67%
    symbolSet: 'animals',
    idealTime: 180,
    optimalMoves: 12,
    ageRange: '7-8',
    locked: false,
    unlockCondition: 'Complete all 4x4 levels',
  },
  {
    id: 'sudoku-6x6-02',
    name: 'Zoo Puzzle',
    description: 'Le zoo a besoin de ton aide pour ranger les animaux',
    gridSize: '6x6',
    difficulty: 'easy',
    prefilled: 22,
    symbolSet: 'animals',
    idealTime: 210,
    optimalMoves: 14,
    ageRange: '7-8',
    locked: false,
    unlockCondition: 'Complete sudoku-6x6-01',
  },
  {
    id: 'sudoku-6x6-03',
    name: 'Chiffres en Folie',
    description: 'Les chiffres de 1 à 6 te défient',
    gridSize: '6x6',
    difficulty: 'medium',
    prefilled: 20,
    symbolSet: 'numbers',
    idealTime: 240,
    optimalMoves: 16,
    ageRange: '7-8',
    locked: false,
    unlockCondition: 'Complete sudoku-6x6-02',
  },
  {
    id: 'sudoku-6x6-04',
    name: 'Réflexion Intense',
    description: 'Il faut bien réfléchir maintenant...',
    gridSize: '6x6',
    difficulty: 'medium',
    prefilled: 18,
    symbolSet: 'numbers',
    idealTime: 300,
    optimalMoves: 18,
    ageRange: '7-8',
    locked: false,
    unlockCondition: 'Complete sudoku-6x6-03',
  },
  {
    id: 'sudoku-6x6-05',
    name: 'Expert en Herbe',
    description: 'Tu deviens vraiment fort !',
    gridSize: '6x6',
    difficulty: 'hard',
    prefilled: 16,
    symbolSet: 'numbers',
    idealTime: 360,
    optimalMoves: 20,
    ageRange: '7-8',
    locked: false,
    unlockCondition: 'Complete sudoku-6x6-04',
  },
  {
    id: 'sudoku-6x6-06',
    name: 'Maître du 6×6',
    description: 'Le niveau ultime des grilles 6×6',
    gridSize: '6x6',
    difficulty: 'hard',
    prefilled: 14,
    symbolSet: 'numbers',
    idealTime: 420,
    optimalMoves: 22,
    ageRange: '7-8',
    locked: false,
    unlockCondition: 'Complete sudoku-6x6-05 twice',
  },
];

// ============================================================================
// NIVEAUX 9×9 (AVANCÉ)
// ============================================================================

const levels9x9: SudokuLevel[] = [
  {
    id: 'sudoku-9x9-01',
    name: 'Le Vrai Sudoku',
    description: 'La grille classique du Sudoku !',
    gridSize: '9x9',
    difficulty: 'easy',
    prefilled: 45, // 45/81 = 56%
    symbolSet: 'numbers',
    idealTime: 300,
    optimalMoves: 36,
    ageRange: '9-10',
    locked: false,
    unlockCondition: 'Complete all 6x6 levels',
  },
  {
    id: 'sudoku-9x9-02',
    name: 'Concentration',
    description: 'Un peu moins d\'aide, un peu plus de réflexion',
    gridSize: '9x9',
    difficulty: 'easy',
    prefilled: 42,
    symbolSet: 'numbers',
    idealTime: 360,
    optimalMoves: 39,
    ageRange: '9-10',
    locked: false,
    unlockCondition: 'Complete sudoku-9x9-01',
  },
  {
    id: 'sudoku-9x9-03',
    name: 'Logique Pure',
    description: 'Fais travailler tes méninges !',
    gridSize: '9x9',
    difficulty: 'medium',
    prefilled: 38,
    symbolSet: 'numbers',
    idealTime: 420,
    optimalMoves: 43,
    ageRange: '9-10',
    locked: false,
    unlockCondition: 'Complete sudoku-9x9-02',
  },
  {
    id: 'sudoku-9x9-04',
    name: 'Challenge Intermédiaire',
    description: 'Tu es vraiment doué !',
    gridSize: '9x9',
    difficulty: 'medium',
    prefilled: 35,
    symbolSet: 'numbers',
    idealTime: 480,
    optimalMoves: 46,
    ageRange: '9-10',
    locked: false,
    unlockCondition: 'Complete sudoku-9x9-03',
  },
  {
    id: 'sudoku-9x9-05',
    name: 'Pro du Sudoku',
    description: 'Niveau digne des champions',
    gridSize: '9x9',
    difficulty: 'hard',
    prefilled: 32,
    symbolSet: 'numbers',
    idealTime: 600,
    optimalMoves: 49,
    ageRange: '9-10',
    locked: false,
    unlockCondition: 'Complete sudoku-9x9-04',
  },
  {
    id: 'sudoku-9x9-06',
    name: 'Maître Sudoku',
    description: 'Le niveau suprême ! 🏆',
    gridSize: '9x9',
    difficulty: 'hard',
    prefilled: 28,
    symbolSet: 'numbers',
    idealTime: 720,
    optimalMoves: 53,
    ageRange: '9-10',
    locked: false,
    unlockCondition: 'Complete sudoku-9x9-05 twice',
  },
];

// ============================================================================
// CATÉGORIES
// ============================================================================

export const LEVEL_CATEGORIES: LevelCategory[] = [
  {
    id: 'category-4x4',
    name: 'Mini Sudoku',
    description: 'Grilles 4×4 pour débuter',
    gridSize: '4x4',
    levels: levels4x4,
  },
  {
    id: 'category-6x6',
    name: 'Sudoku Moyen',
    description: 'Grilles 6×6 pour progresser',
    gridSize: '6x6',
    levels: levels6x6,
  },
  {
    id: 'category-9x9',
    name: 'Sudoku Classique',
    description: 'Grilles 9×9 traditionnelles',
    gridSize: '9x9',
    levels: levels9x9,
  },
];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtient tous les niveaux
 */
export function getAllLevels(): SudokuLevel[] {
  return [...levels4x4, ...levels6x6, ...levels9x9];
}

/**
 * Obtient un niveau par son ID
 */
export function getLevelById(id: string): SudokuLevel | undefined {
  return getAllLevels().find((level) => level.id === id);
}

/**
 * Obtient les niveaux par taille de grille
 */
export function getLevelsByGridSize(gridSize: GridSize): SudokuLevel[] {
  switch (gridSize) {
    case '4x4':
      return levels4x4;
    case '6x6':
      return levels6x6;
    case '9x9':
      return levels9x9;
    default:
      return [];
  }
}

/**
 * Obtient le prochain niveau
 */
export function getNextLevel(currentId: string): SudokuLevel | undefined {
  const allLevels = getAllLevels();
  const currentIndex = allLevels.findIndex((level) => level.id === currentId);

  if (currentIndex === -1 || currentIndex === allLevels.length - 1) {
    return undefined;
  }

  return allLevels[currentIndex + 1];
}

/**
 * Obtient les symboles pour une taille de grille
 */
export function getSymbols(symbolSet: SudokuLevel['symbolSet'], gridSize: GridSize): string[] {
  const size = parseInt(gridSize.split('x')[0]);
  return SYMBOL_SETS[symbolSet][size as 4 | 6 | 9] || SYMBOL_SETS.numbers[size as 4 | 6 | 9];
}

/**
 * Compte le nombre de cases pour une grille
 */
export function getTotalCells(gridSize: GridSize): number {
  const size = parseInt(gridSize.split('x')[0]);
  return size * size;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  levels4x4 as SUDOKU_LEVELS_4X4,
  levels6x6 as SUDOKU_LEVELS_6X6,
  levels9x9 as SUDOKU_LEVELS_9X9,
};

export default getAllLevels;
