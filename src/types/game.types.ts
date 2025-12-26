/**
 * Core game types for EduGames
 * Defines the game module system and shared types
 */

import { ImageSourcePropType } from 'react-native';

// ============================================
// GAME CATEGORIES & SKILLS
// ============================================

export type GameCategory =
  | 'logic'
  | 'memory'
  | 'spatial'
  | 'math'
  | 'language';

export type CognitiveSkill =
  | 'planning'
  | 'inhibition'
  | 'working_memory'
  | 'problem_solving'
  | 'perseverance'
  | 'concentration'
  | 'pattern_recognition'
  | 'sequencing'
  | 'deductive_reasoning'
  | 'patience'
  | 'systematic_thinking';

// ============================================
// GAME METADATA
// ============================================

export interface GameMetadata {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  icon: ImageSourcePropType | null;
  minAge: number;
  maxAge: number;
  category: GameCategory;
  skills: CognitiveSkill[];
  status: 'available' | 'coming_soon' | 'locked';
  route: string;
}

// ============================================
// GAME SESSION
// ============================================

export type GameStatus =
  | 'intro'
  | 'playing'
  | 'paused'
  | 'victory'
  | 'abandoned';

export interface GameSession<TState = unknown> {
  gameId: string;
  levelId: string;
  startedAt: number;
  moveCount: number;
  hintsUsed: number;
  invalidMoves: number;
  gameState: TState;
  status: GameStatus;
}

// ============================================
// LEVEL CONFIGURATION
// ============================================

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LevelConfig {
  id: string;
  gameId: string;
  difficulty: Difficulty;
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  optimalMoves?: number;
}

export type UnlockCondition =
  | { type: 'always' }
  | { type: 'after_level'; levelId: string }
  | { type: 'after_levels'; levelIds: string[] };

// ============================================
// MOVE VALIDATION
// ============================================

export type InvalidMoveReason =
  | 'disk_too_large'
  | 'blocked'
  | 'invalid_target'
  | 'out_of_bounds'
  | 'same_position';

export interface MoveValidation {
  valid: boolean;
  reason?: InvalidMoveReason;
}

// ============================================
// PROGRESS TRACKING
// ============================================

export interface LevelCompletion {
  levelId: string;
  completedAt: number;
  bestMoveCount: number;
  bestTimeSeconds: number;
  timesCompleted: number;
  hintsUsed: number;
}

export interface GameProgress {
  gameId: string;
  unlockedLevels: string[];
  completedLevels: Record<string, LevelCompletion>;
  totalPlayTimeMinutes: number;
  lastPlayedAt: number | null;
}

export interface CompletedSession {
  gameId: string;
  levelId: string;
  completedAt: number;
  moveCount: number;
  timeSeconds: number;
  hintsUsed: number;
}
