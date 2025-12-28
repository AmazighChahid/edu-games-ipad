/**
 * Tangram Puzzles
 *
 * Collection de puzzles (silhouettes) à résoudre
 */

import type { TangramPuzzle, TangramLevel, PuzzleCategory, Difficulty } from '../types';

// ============================================================================
// PUZZLES - ANIMAUX
// ============================================================================

const animalPuzzles: TangramPuzzle[] = [
  {
    id: 'tangram-cat',
    name: 'Le Chat',
    description: 'Un chat assis qui attend ses croquettes',
    category: 'animals',
    difficulty: 'easy',
    silhouette: [
      { x: 0.5, y: 0 },
      { x: 0.7, y: 0.2 },
      { x: 0.8, y: 0.5 },
      { x: 0.7, y: 0.8 },
      { x: 0.5, y: 1 },
      { x: 0.3, y: 0.8 },
      { x: 0.2, y: 0.5 },
      { x: 0.3, y: 0.2 },
    ],
    solution: [
      { pieceId: 'large_triangle-0', pieceType: 'large_triangle', transform: { x: 150, y: 100, rotation: 45, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'large_triangle-1', pieceType: 'large_triangle', transform: { x: 150, y: 200, rotation: 135, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'medium_triangle-0', pieceType: 'medium_triangle', transform: { x: 100, y: 150, rotation: 0, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'small_triangle-0', pieceType: 'small_triangle', transform: { x: 180, y: 50, rotation: 90, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'small_triangle-1', pieceType: 'small_triangle', transform: { x: 120, y: 50, rotation: 270, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'square-0', pieceType: 'square', transform: { x: 150, y: 150, rotation: 0, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'parallelogram-0', pieceType: 'parallelogram', transform: { x: 100, y: 250, rotation: 0, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
    ],
    thumbnailEmoji: '🐱',
    idealTime: 120,
    locked: false,
  },
  {
    id: 'tangram-bird',
    name: 'L\'Oiseau',
    description: 'Un oiseau qui vole dans le ciel',
    category: 'animals',
    difficulty: 'easy',
    silhouette: [
      { x: 0.2, y: 0.5 },
      { x: 0.5, y: 0.3 },
      { x: 0.8, y: 0.5 },
      { x: 0.5, y: 0.7 },
    ],
    solution: [
      { pieceId: 'large_triangle-0', pieceType: 'large_triangle', transform: { x: 100, y: 150, rotation: 0, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'large_triangle-1', pieceType: 'large_triangle', transform: { x: 200, y: 150, rotation: 180, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'medium_triangle-0', pieceType: 'medium_triangle', transform: { x: 150, y: 100, rotation: 90, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'small_triangle-0', pieceType: 'small_triangle', transform: { x: 80, y: 120, rotation: 45, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'small_triangle-1', pieceType: 'small_triangle', transform: { x: 220, y: 120, rotation: 135, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'square-0', pieceType: 'square', transform: { x: 150, y: 180, rotation: 45, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
      { pieceId: 'parallelogram-0', pieceType: 'parallelogram', transform: { x: 150, y: 80, rotation: 0, scale: 1, flipped: false }, positionTolerance: 20, rotationTolerance: 15 },
    ],
    thumbnailEmoji: '🐦',
    idealTime: 90,
    locked: false,
  },
  {
    id: 'tangram-rabbit',
    name: 'Le Lapin',
    description: 'Un lapin avec ses grandes oreilles',
    category: 'animals',
    difficulty: 'medium',
    silhouette: [],
    solution: [],
    thumbnailEmoji: '🐰',
    idealTime: 150,
    locked: false,
    unlockCondition: 'Complete tangram-bird',
  },
  {
    id: 'tangram-fox',
    name: 'Le Renard',
    description: 'Un renard rusé',
    category: 'animals',
    difficulty: 'medium',
    silhouette: [],
    solution: [],
    thumbnailEmoji: '🦊',
    idealTime: 180,
    locked: false,
    unlockCondition: 'Complete tangram-rabbit',
  },
];

// ============================================================================
// PUZZLES - OBJETS
// ============================================================================

const objectPuzzles: TangramPuzzle[] = [
  {
    id: 'tangram-house',
    name: 'La Maison',
    description: 'Une jolie maison avec un toit',
    category: 'objects',
    difficulty: 'easy',
    silhouette: [],
    solution: [],
    thumbnailEmoji: '🏠',
    idealTime: 90,
    locked: false,
  },
  {
    id: 'tangram-boat',
    name: 'Le Bateau',
    description: 'Un bateau qui navigue sur l\'eau',
    category: 'objects',
    difficulty: 'easy',
    silhouette: [],
    solution: [],
    thumbnailEmoji: '⛵',
    idealTime: 100,
    locked: false,
    unlockCondition: 'Complete tangram-house',
  },
  {
    id: 'tangram-rocket',
    name: 'La Fusée',
    description: 'Une fusée prête pour le décollage',
    category: 'objects',
    difficulty: 'medium',
    silhouette: [],
    solution: [],
    thumbnailEmoji: '🚀',
    idealTime: 150,
    locked: false,
    unlockCondition: 'Complete tangram-boat',
  },
];

// ============================================================================
// PUZZLES - PERSONNAGES
// ============================================================================

const peoplePuzzles: TangramPuzzle[] = [
  {
    id: 'tangram-person',
    name: 'Le Bonhomme',
    description: 'Un petit bonhomme qui court',
    category: 'people',
    difficulty: 'medium',
    silhouette: [],
    solution: [],
    thumbnailEmoji: '🏃',
    idealTime: 180,
    locked: false,
    unlockCondition: 'Complete 3 easy puzzles',
  },
  {
    id: 'tangram-dancer',
    name: 'La Danseuse',
    description: 'Une danseuse gracieuse',
    category: 'people',
    difficulty: 'hard',
    silhouette: [],
    solution: [],
    thumbnailEmoji: '💃',
    idealTime: 240,
    locked: false,
    unlockCondition: 'Complete tangram-person',
  },
  {
    id: 'tangram-ninja',
    name: 'Le Ninja',
    description: 'Un ninja en position de combat',
    category: 'people',
    difficulty: 'hard',
    silhouette: [],
    solution: [],
    thumbnailEmoji: '🥷',
    idealTime: 300,
    locked: false,
    unlockCondition: 'Complete tangram-dancer',
  },
];

// ============================================================================
// NIVEAUX
// ============================================================================

export function createLevelFromPuzzle(puzzle: TangramPuzzle): TangramLevel {
  return {
    id: `level-${puzzle.id}`,
    name: puzzle.name,
    description: puzzle.description,
    puzzle,
    ageRange: puzzle.difficulty === 'easy' ? '5-7' : puzzle.difficulty === 'medium' ? '7-9' : '9-10',
    hintsAvailable: puzzle.difficulty === 'easy' ? 3 : puzzle.difficulty === 'medium' ? 2 : 1,
    showOutlines: puzzle.difficulty === 'easy',
    autoSnap: true,
    snapThreshold: puzzle.difficulty === 'easy' ? 30 : 20,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtient tous les puzzles
 */
export function getAllPuzzles(): TangramPuzzle[] {
  return [...animalPuzzles, ...objectPuzzles, ...peoplePuzzles];
}

/**
 * Obtient un puzzle par son ID
 */
export function getPuzzleById(id: string): TangramPuzzle | undefined {
  return getAllPuzzles().find(puzzle => puzzle.id === id);
}

/**
 * Obtient les puzzles par catégorie
 */
export function getPuzzlesByCategory(category: PuzzleCategory): TangramPuzzle[] {
  return getAllPuzzles().filter(puzzle => puzzle.category === category);
}

/**
 * Obtient les puzzles par difficulté
 */
export function getPuzzlesByDifficulty(difficulty: Difficulty): TangramPuzzle[] {
  return getAllPuzzles().filter(puzzle => puzzle.difficulty === difficulty);
}

/**
 * Obtient le premier puzzle débloqué
 */
export function getFirstPuzzle(): TangramPuzzle {
  return animalPuzzles[0];
}

/**
 * Obtient le niveau correspondant à un puzzle
 */
export function getLevelForPuzzle(puzzleId: string): TangramLevel | undefined {
  const puzzle = getPuzzleById(puzzleId);
  if (!puzzle) return undefined;
  return createLevelFromPuzzle(puzzle);
}

// ============================================================================
// EXPORTS
// ============================================================================

// TANGRAM_PUZZLES - Tous les puzzles combinés
export const TANGRAM_PUZZLES: TangramPuzzle[] = [...animalPuzzles, ...objectPuzzles, ...peoplePuzzles];

export {
  animalPuzzles as TANGRAM_ANIMAL_PUZZLES,
  objectPuzzles as TANGRAM_OBJECT_PUZZLES,
  peoplePuzzles as TANGRAM_PEOPLE_PUZZLES,
  getAllPuzzles,
  getPuzzleById,
  getPuzzlesByCategory,
  getPuzzlesByDifficulty,
  getFirstPuzzle,
  getLevelForPuzzle,
  createLevelFromPuzzle,
};
