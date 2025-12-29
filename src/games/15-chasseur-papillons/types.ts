/**
 * Chasseur de Papillons - Type definitions
 * Selective attention and working memory game
 */

export type ButterflyColor = 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'orange';
export type ButterflyPattern = 'solid' | 'striped' | 'spotted' | 'gradient';
export type ButterflySize = 'small' | 'medium' | 'large';

export interface Butterfly {
  id: string;
  color: ButterflyColor;
  pattern: ButterflyPattern;
  size: ButterflySize;
  x: number; // Position on screen (0-100%)
  y: number;
  velocityX: number;
  velocityY: number;
  isTarget: boolean; // Should be caught based on current rule
}

export type RuleType =
  | 'color'           // Catch butterflies of specific color
  | 'pattern'         // Catch butterflies with specific pattern
  | 'size'            // Catch butterflies of specific size
  | 'color_and_size'  // Catch specific color AND size
  | 'not_color'       // Catch all EXCEPT specific color
  | 'two_colors';     // Catch either of two colors

export interface GameRule {
  type: RuleType;
  values: string[]; // The target values for this rule
  description: string; // French instruction for child
  iconHint?: string; // Visual hint icon
}

export interface ChasseurLevel {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rules: GameRule[];
  butterfliesPerWave: number;
  waveDuration: number; // Seconds per wave
  totalWaves: number;
  targetCatchRate: number; // 0-1, percentage needed to pass
  distractorRatio: number; // 0-1, ratio of non-target butterflies
}

export interface ChasseurGameState {
  level: ChasseurLevel | null;
  currentWave: number;
  currentRule: GameRule | null;
  butterflies: Butterfly[];
  score: number;
  targetsCaught: number;
  targetsMissed: number;
  wrongCatches: number; // Caught non-target
  streak: number; // Consecutive correct catches
  bestStreak: number;
  isPaused: boolean;
  isCompleted: boolean;
  timeRemaining: number;
}

export interface ChasseurProgress {
  levelId: string;
  completed: boolean;
  bestScore: number | null;
  bestAccuracy: number | null; // 0-1
  stars: 1 | 2 | 3 | null;
  lastPlayed: number;
}
