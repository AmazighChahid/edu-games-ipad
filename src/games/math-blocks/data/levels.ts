/**
 * MathBlocks level configurations
 */

import type { MathLevelConfig } from '../types';

export const mathLevels: MathLevelConfig[] = [
  // Niveau 1 - Très facile (addition 1-5)
  {
    id: 'level_1',
    gameId: 'math-blocks',
    difficulty: 'easy',
    displayOrder: 1,
    targetAge: 5,
    estimatedMinutes: 1,
    gridRows: 3,
    gridCols: 4,
    operations: ['add'],
    numberRange: [1, 5],
    timeLimit: 60,
    targetPairs: 6,
  },
  // Niveau 2 - Facile (addition 1-10)
  {
    id: 'level_2',
    gameId: 'math-blocks',
    difficulty: 'easy',
    displayOrder: 2,
    targetAge: 6,
    estimatedMinutes: 2,
    gridRows: 4,
    gridCols: 4,
    operations: ['add'],
    numberRange: [1, 10],
    timeLimit: 90,
    targetPairs: 8,
  },
  // Niveau 3 - Addition et soustraction (1-10)
  {
    id: 'level_3',
    gameId: 'math-blocks',
    difficulty: 'easy',
    displayOrder: 3,
    targetAge: 6,
    estimatedMinutes: 2,
    gridRows: 4,
    gridCols: 4,
    operations: ['add', 'subtract'],
    numberRange: [1, 10],
    timeLimit: 90,
    targetPairs: 8,
  },
  // Niveau 4 - Moyen (addition, soustraction 1-20)
  {
    id: 'level_4',
    gameId: 'math-blocks',
    difficulty: 'medium',
    displayOrder: 4,
    targetAge: 7,
    estimatedMinutes: 3,
    gridRows: 4,
    gridCols: 5,
    operations: ['add', 'subtract'],
    numberRange: [1, 20],
    timeLimit: 120,
    targetPairs: 10,
  },
  // Niveau 5 - Multiplication simple (tables 1-5)
  {
    id: 'level_5',
    gameId: 'math-blocks',
    difficulty: 'medium',
    displayOrder: 5,
    targetAge: 7,
    estimatedMinutes: 3,
    gridRows: 4,
    gridCols: 4,
    operations: ['multiply'],
    numberRange: [1, 5],
    timeLimit: 120,
    targetPairs: 8,
  },
  // Niveau 6 - Multiplication (tables 1-10)
  {
    id: 'level_6',
    gameId: 'math-blocks',
    difficulty: 'medium',
    displayOrder: 6,
    targetAge: 8,
    estimatedMinutes: 4,
    gridRows: 4,
    gridCols: 5,
    operations: ['multiply'],
    numberRange: [1, 10],
    timeLimit: 150,
    targetPairs: 10,
  },
  // Niveau 7 - Division simple
  {
    id: 'level_7',
    gameId: 'math-blocks',
    difficulty: 'medium',
    displayOrder: 7,
    targetAge: 8,
    estimatedMinutes: 4,
    gridRows: 4,
    gridCols: 4,
    operations: ['divide'],
    numberRange: [1, 10],
    timeLimit: 150,
    targetPairs: 8,
  },
  // Niveau 8 - Mix multiplication et division
  {
    id: 'level_8',
    gameId: 'math-blocks',
    difficulty: 'hard',
    displayOrder: 8,
    targetAge: 9,
    estimatedMinutes: 5,
    gridRows: 5,
    gridCols: 5,
    operations: ['multiply', 'divide'],
    numberRange: [1, 10],
    timeLimit: 180,
    targetPairs: 12,
  },
  // Niveau 9 - Toutes opérations (1-20)
  {
    id: 'level_9',
    gameId: 'math-blocks',
    difficulty: 'hard',
    displayOrder: 9,
    targetAge: 10,
    estimatedMinutes: 5,
    gridRows: 5,
    gridCols: 5,
    operations: ['add', 'subtract', 'multiply', 'divide'],
    numberRange: [1, 20],
    timeLimit: 180,
    targetPairs: 12,
  },
  // Niveau 10 - Expert (nombres jusqu'à 50)
  {
    id: 'level_10',
    gameId: 'math-blocks',
    difficulty: 'hard',
    displayOrder: 10,
    targetAge: 11,
    estimatedMinutes: 6,
    gridRows: 5,
    gridCols: 6,
    operations: ['add', 'subtract', 'multiply', 'divide'],
    numberRange: [1, 50],
    timeLimit: 240,
    targetPairs: 15,
  },
];

export const getLevel = (levelId: string): MathLevelConfig | undefined => {
  return mathLevels.find((level) => level.id === levelId);
};

export const getDefaultLevel = (): MathLevelConfig => {
  return mathLevels[0];
};

export const getLevelsByDifficulty = (
  difficulty: 'easy' | 'medium' | 'hard'
): MathLevelConfig[] => {
  return mathLevels.filter((level) => level.difficulty === difficulty);
};
