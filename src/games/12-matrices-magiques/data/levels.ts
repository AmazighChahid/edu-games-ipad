/**
 * Levels configuration for Matrices Magiques
 * Defines level progression and difficulty settings
 */

import type { LevelConfig } from '../../../components/common';

// =============================================================================
// LEVEL CONFIGURATION
// =============================================================================

export interface MatricesLevelConfig {
  id: string;
  number: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  worldId: string;
  puzzleCount: number;
  gridSize: 2 | 3; // 2x2 or 3x3 matrices
  transformations: TransformationType[];
  timeLimit?: number; // Optional time limit in seconds
  hintsAllowed: number;
}

export type TransformationType =
  | 'rotation'      // Rotation 90°, 180°, 270°
  | 'reflection'    // Horizontal/vertical flip
  | 'color_shift'   // Color changes
  | 'size_change'   // Size modifications
  | 'addition'      // Elements added
  | 'subtraction'   // Elements removed
  | 'pattern'       // Pattern completion
  | 'sequence';     // Sequence continuation

// =============================================================================
// LEVELS DATA
// =============================================================================

export const MATRICES_LEVELS: MatricesLevelConfig[] = [
  // World 1: Forêt Enchantée (Easy)
  {
    id: 'level-1',
    number: 1,
    name: 'Premiers pas',
    difficulty: 'easy',
    worldId: 'forest',
    puzzleCount: 5,
    gridSize: 2,
    transformations: ['pattern'],
    hintsAllowed: 3,
  },
  {
    id: 'level-2',
    number: 2,
    name: 'Découverte',
    difficulty: 'easy',
    worldId: 'forest',
    puzzleCount: 5,
    gridSize: 2,
    transformations: ['pattern', 'rotation'],
    hintsAllowed: 3,
  },
  {
    id: 'level-3',
    number: 3,
    name: 'Progression',
    difficulty: 'easy',
    worldId: 'forest',
    puzzleCount: 6,
    gridSize: 2,
    transformations: ['pattern', 'rotation', 'color_shift'],
    hintsAllowed: 3,
  },

  // World 2: Océan Profond (Medium)
  {
    id: 'level-4',
    number: 4,
    name: 'Plongée',
    difficulty: 'medium',
    worldId: 'ocean',
    puzzleCount: 6,
    gridSize: 2,
    transformations: ['pattern', 'rotation', 'reflection'],
    hintsAllowed: 2,
  },
  {
    id: 'level-5',
    number: 5,
    name: 'Exploration',
    difficulty: 'medium',
    worldId: 'ocean',
    puzzleCount: 6,
    gridSize: 3,
    transformations: ['pattern', 'addition'],
    hintsAllowed: 2,
  },
  {
    id: 'level-6',
    number: 6,
    name: 'Profondeurs',
    difficulty: 'medium',
    worldId: 'ocean',
    puzzleCount: 7,
    gridSize: 3,
    transformations: ['pattern', 'rotation', 'addition', 'subtraction'],
    hintsAllowed: 2,
  },

  // World 3: Montagne Mystique (Medium-Hard)
  {
    id: 'level-7',
    number: 7,
    name: 'Ascension',
    difficulty: 'medium',
    worldId: 'mountain',
    puzzleCount: 7,
    gridSize: 3,
    transformations: ['pattern', 'rotation', 'reflection', 'size_change'],
    hintsAllowed: 2,
  },
  {
    id: 'level-8',
    number: 8,
    name: 'Sommet',
    difficulty: 'hard',
    worldId: 'mountain',
    puzzleCount: 8,
    gridSize: 3,
    transformations: ['pattern', 'rotation', 'reflection', 'sequence'],
    hintsAllowed: 1,
  },

  // World 4: Espace Cosmique (Hard)
  {
    id: 'level-9',
    number: 9,
    name: 'Décollage',
    difficulty: 'hard',
    worldId: 'space',
    puzzleCount: 8,
    gridSize: 3,
    transformations: ['pattern', 'rotation', 'reflection', 'color_shift', 'sequence'],
    hintsAllowed: 1,
  },
  {
    id: 'level-10',
    number: 10,
    name: 'Galaxie',
    difficulty: 'hard',
    worldId: 'space',
    puzzleCount: 10,
    gridSize: 3,
    transformations: ['pattern', 'rotation', 'reflection', 'addition', 'subtraction', 'sequence'],
    timeLimit: 120,
    hintsAllowed: 1,
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getLevelById(levelId: string): MatricesLevelConfig | undefined {
  return MATRICES_LEVELS.find(level => level.id === levelId);
}

export function getLevelByNumber(number: number): MatricesLevelConfig | undefined {
  return MATRICES_LEVELS.find(level => level.number === number);
}

export function getLevelsByWorld(worldId: string): MatricesLevelConfig[] {
  return MATRICES_LEVELS.filter(level => level.worldId === worldId);
}

export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): MatricesLevelConfig[] {
  return MATRICES_LEVELS.filter(level => level.difficulty === difficulty);
}

// =============================================================================
// EXPORT
// =============================================================================

export default MATRICES_LEVELS;
