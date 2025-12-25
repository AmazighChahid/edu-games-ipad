/**
 * Calcul Posé level configurations
 */

import type { CalculPoseLevelConfig } from '../types';

export const calculPoseLevels: CalculPoseLevelConfig[] = [
  // Easy: Single digit addition without carry
  {
    id: 'cp_level_1',
    gameId: 'calcul-pose',
    difficulty: 'easy',
    displayOrder: 1,
    targetAge: 6,
    estimatedMinutes: 2,
    operation: 'addition',
    minOperand: 1,
    maxOperand: 9,
    requiresCarry: false,
    problemCount: 3,
  },
  // Easy: Two digit addition without carry
  {
    id: 'cp_level_2',
    gameId: 'calcul-pose',
    difficulty: 'easy',
    displayOrder: 2,
    targetAge: 6,
    estimatedMinutes: 3,
    operation: 'addition',
    minOperand: 10,
    maxOperand: 44,
    requiresCarry: false,
    problemCount: 3,
  },
  // Medium: Two digit addition with carry
  {
    id: 'cp_level_3',
    gameId: 'calcul-pose',
    difficulty: 'medium',
    displayOrder: 3,
    targetAge: 7,
    estimatedMinutes: 4,
    operation: 'addition',
    minOperand: 15,
    maxOperand: 59,
    requiresCarry: true,
    problemCount: 3,
  },
  // Medium: Two digit subtraction without borrow
  {
    id: 'cp_level_4',
    gameId: 'calcul-pose',
    difficulty: 'medium',
    displayOrder: 4,
    targetAge: 7,
    estimatedMinutes: 4,
    operation: 'subtraction',
    minOperand: 10,
    maxOperand: 50,
    requiresCarry: false,
    problemCount: 3,
  },
  // Hard: Larger additions with carry
  {
    id: 'cp_level_5',
    gameId: 'calcul-pose',
    difficulty: 'hard',
    displayOrder: 5,
    targetAge: 8,
    estimatedMinutes: 5,
    operation: 'addition',
    minOperand: 20,
    maxOperand: 99,
    requiresCarry: true,
    problemCount: 4,
  },
  // Hard: Subtraction with borrow
  {
    id: 'cp_level_6',
    gameId: 'calcul-pose',
    difficulty: 'hard',
    displayOrder: 6,
    targetAge: 8,
    estimatedMinutes: 5,
    operation: 'subtraction',
    minOperand: 30,
    maxOperand: 99,
    requiresCarry: true,
    problemCount: 4,
  },
];

export function getLevel(id: string): CalculPoseLevelConfig | undefined {
  return calculPoseLevels.find(level => level.id === id);
}

export function getDefaultLevel(): CalculPoseLevelConfig {
  return calculPoseLevels[0];
}

export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): CalculPoseLevelConfig[] {
  return calculPoseLevels.filter(level => level.difficulty === difficulty);
}
