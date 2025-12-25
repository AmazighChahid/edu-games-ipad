/**
 * Calcul Posé types
 * Written calculation with handwriting recognition
 */

import type { LevelConfig } from '@/types';

export type Operation = 'addition' | 'subtraction';

export interface CalculationProblem {
  operand1: number;
  operand2: number;
  operation: Operation;
  result: number;
}

export interface DigitCell {
  id: string;
  row: number; // 0 = operand1, 1 = operand2, 2 = result
  column: number; // 0 = units, 1 = tens, 2 = hundreds
  expectedValue: number | null; // null for given digits
  userValue: number | null;
  isEditable: boolean;
  isCorrect: boolean | null;
}

export interface DrawingPath {
  id: string;
  points: Array<{ x: number; y: number }>;
  timestamp: number;
}

export interface CalculPoseGameState {
  problem: CalculationProblem;
  cells: DigitCell[];
  currentCellId: string | null;
  drawingPaths: DrawingPath[];
  recognizedDigit: number | null;
  carry: number[]; // Carries for addition
}

export interface CalculPoseLevelConfig extends LevelConfig {
  operation: Operation;
  minOperand: number;
  maxOperand: number;
  requiresCarry: boolean;
  problemCount: number;
}

export interface RecognitionResult {
  digit: number;
  confidence: number;
}
