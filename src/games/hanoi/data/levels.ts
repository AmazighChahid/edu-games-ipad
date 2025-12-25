/**
 * Tower of Hanoi level configurations
 */

import type { HanoiLevelConfig } from '../types';

export const hanoiLevels: HanoiLevelConfig[] = [
  {
    id: 'level_1',
    gameId: 'hanoi',
    difficulty: 'easy',
    displayOrder: 1,
    targetAge: 5,
    estimatedMinutes: 1,
    diskCount: 2,
    sourceTower: 0,
    targetTower: 2,
    optimalMoves: 3,
  },
  {
    id: 'level_2',
    gameId: 'hanoi',
    difficulty: 'easy',
    displayOrder: 2,
    targetAge: 6,
    estimatedMinutes: 2,
    diskCount: 3,
    sourceTower: 0,
    targetTower: 2,
    optimalMoves: 7,
  },
  {
    id: 'level_3',
    gameId: 'hanoi',
    difficulty: 'medium',
    displayOrder: 3,
    targetAge: 7,
    estimatedMinutes: 4,
    diskCount: 4,
    sourceTower: 0,
    targetTower: 2,
    optimalMoves: 15,
  },
  {
    id: 'level_4',
    gameId: 'hanoi',
    difficulty: 'medium',
    displayOrder: 4,
    targetAge: 8,
    estimatedMinutes: 6,
    diskCount: 5,
    sourceTower: 0,
    targetTower: 2,
    optimalMoves: 31,
  },
  {
    id: 'level_5',
    gameId: 'hanoi',
    difficulty: 'hard',
    displayOrder: 5,
    targetAge: 9,
    estimatedMinutes: 10,
    diskCount: 6,
    sourceTower: 0,
    targetTower: 2,
    optimalMoves: 63,
  },
];

export const getLevel = (levelId: string): HanoiLevelConfig | undefined => {
  return hanoiLevels.find((level) => level.id === levelId);
};

export const getDefaultLevel = (): HanoiLevelConfig => {
  return hanoiLevels[0];
};
