/**
 * Validation logic for Matrices Magiques
 * Validates answers, calculates scores, and tracks progress
 */

import {
  PuzzleConfig,
  ShapeConfig,
  HintLevel,
  WorldTheme,
  DifficultyLevel,
  PuzzleAttempt,
  SessionState,
} from '../types';
import { shapesEqual } from './transformations';

// ============================================================================
// ANSWER VALIDATION
// ============================================================================

/**
 * Check if the selected answer is correct
 */
export function checkAnswer(
  puzzle: PuzzleConfig,
  selectedIndex: number
): boolean {
  if (selectedIndex < 0 || selectedIndex >= puzzle.choices.length) {
    return false;
  }

  const selectedShape = puzzle.choices[selectedIndex];
  return shapesEqual(selectedShape, puzzle.correctAnswer);
}

/**
 * Get the correct choice index for a puzzle
 */
export function getCorrectChoiceIndex(puzzle: PuzzleConfig): number {
  return puzzle.choices.findIndex((c) => shapesEqual(c, puzzle.correctAnswer));
}

// ============================================================================
// SCORING
// ============================================================================

/** Base points per puzzle */
const BASE_POINTS = 100;

/** Bonus for first attempt */
const FIRST_ATTEMPT_BONUS = 50;

/** Bonus for no hints */
const NO_HINTS_BONUS = 30;

/** Speed bonus threshold (seconds) */
const SPEED_BONUS_THRESHOLD = 30;
const SPEED_BONUS_POINTS = 20;

/** Hint cost per level */
const HINT_COSTS: Record<HintLevel, number> = {
  1: 0,   // First hint is free
  2: 10,
  3: 20,
  4: 30,
};

/** Difficulty multipliers */
const DIFFICULTY_MULTIPLIERS: Record<DifficultyLevel, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
  expert: 3.0,
};

/**
 * Calculate score for a puzzle attempt
 */
export function calculatePuzzleScore(
  difficulty: DifficultyLevel,
  attemptNumber: number,
  hintsUsed: HintLevel[],
  timeSeconds: number
): number {
  // Base score with difficulty multiplier
  let score = BASE_POINTS * DIFFICULTY_MULTIPLIERS[difficulty];

  // First attempt bonus
  if (attemptNumber === 1) {
    score += FIRST_ATTEMPT_BONUS;
  } else {
    // Reduce score for multiple attempts (but never below 50% of base)
    const attemptPenalty = Math.min((attemptNumber - 1) * 15, BASE_POINTS * 0.5);
    score -= attemptPenalty;
  }

  // No hints bonus
  if (hintsUsed.length === 0) {
    score += NO_HINTS_BONUS;
  } else {
    // Subtract hint costs
    const hintCost = hintsUsed.reduce((sum, level) => sum + HINT_COSTS[level], 0);
    score -= hintCost;
  }

  // Speed bonus
  if (timeSeconds < SPEED_BONUS_THRESHOLD) {
    score += SPEED_BONUS_POINTS;
  }

  // Ensure minimum score
  return Math.max(Math.round(score), 10);
}

/**
 * Calculate stars earned (0-3) for a world completion
 */
export function calculateStars(
  puzzlesCompleted: number,
  totalPuzzles: number,
  totalHintsUsed: number,
  averageAttempts: number
): number {
  // Base requirement: complete all puzzles
  if (puzzlesCompleted < totalPuzzles) {
    return 0;
  }

  let stars = 1; // Completing the world = 1 star

  // 2 stars: Low hint usage (< 1 hint per puzzle on average)
  const hintsPerPuzzle = totalHintsUsed / totalPuzzles;
  if (hintsPerPuzzle < 1) {
    stars = 2;
  }

  // 3 stars: Low hints AND low attempts (< 1.5 average attempts)
  if (hintsPerPuzzle < 0.5 && averageAttempts < 1.5) {
    stars = 3;
  }

  return stars;
}

// ============================================================================
// SESSION TRACKING
// ============================================================================

/**
 * Create initial session state
 */
export function createInitialSession(
  worldId: WorldTheme,
  puzzles: PuzzleConfig[]
): SessionState {
  return {
    worldId,
    startedAt: Date.now(),
    puzzles,
    currentPuzzleIndex: 0,
    attempts: [],
    hintsUsedTotal: 0,
    starsEarned: 0,
    gameState: 'playing',
    selectedChoiceIndex: null,
    currentAttemptNumber: 1,
  };
}

/**
 * Record a puzzle attempt
 */
export function recordAttempt(
  session: SessionState,
  selectedIndex: number,
  isCorrect: boolean,
  hintsUsed: HintLevel[]
): SessionState {
  const attempt: PuzzleAttempt = {
    puzzleId: session.puzzles[session.currentPuzzleIndex].id,
    selectedChoiceIndex: selectedIndex,
    isCorrect,
    timestamp: Date.now(),
    hintsUsed,
    attemptNumber: session.currentAttemptNumber,
  };

  return {
    ...session,
    attempts: [...session.attempts, attempt],
    hintsUsedTotal: session.hintsUsedTotal + hintsUsed.length,
    currentAttemptNumber: isCorrect ? 1 : session.currentAttemptNumber + 1,
  };
}

/**
 * Move to next puzzle
 */
export function nextPuzzle(session: SessionState): SessionState {
  const nextIndex = session.currentPuzzleIndex + 1;

  if (nextIndex >= session.puzzles.length) {
    // Session complete
    const stats = getSessionStats(session);
    return {
      ...session,
      currentPuzzleIndex: nextIndex,
      gameState: 'complete',
      starsEarned: calculateStars(
        stats.puzzlesSolved,
        session.puzzles.length,
        stats.totalHintsUsed,
        stats.averageAttempts
      ),
    };
  }

  return {
    ...session,
    currentPuzzleIndex: nextIndex,
    selectedChoiceIndex: null,
    currentAttemptNumber: 1,
    gameState: 'playing',
  };
}

/**
 * Get session statistics
 */
export interface SessionStats {
  puzzlesSolved: number;
  puzzlesFailed: number;
  totalAttempts: number;
  averageAttempts: number;
  totalHintsUsed: number;
  totalTimeSeconds: number;
  scoreTotal: number;
}

export function getSessionStats(session: SessionState): SessionStats {
  const puzzlesSolved = new Set(
    session.attempts
      .filter((a) => a.isCorrect)
      .map((a) => a.puzzleId)
  ).size;

  const puzzlesFailed = new Set(
    session.attempts
      .filter((a) => !a.isCorrect && a.attemptNumber >= 3)
      .map((a) => a.puzzleId)
  ).size;

  const totalAttempts = session.attempts.length;
  const averageAttempts = puzzlesSolved > 0
    ? totalAttempts / puzzlesSolved
    : 0;

  const totalTimeSeconds = Math.floor(
    (Date.now() - session.startedAt) / 1000
  );

  // Calculate total score
  let scoreTotal = 0;
  const solvedPuzzleIds = new Set<string>();

  for (const attempt of session.attempts) {
    if (attempt.isCorrect && !solvedPuzzleIds.has(attempt.puzzleId)) {
      const puzzle = session.puzzles.find((p) => p.id === attempt.puzzleId);
      if (puzzle) {
        scoreTotal += calculatePuzzleScore(
          puzzle.difficulty,
          attempt.attemptNumber,
          attempt.hintsUsed,
          30 // Default time since we don't track per-puzzle time
        );
        solvedPuzzleIds.add(attempt.puzzleId);
      }
    }
  }

  return {
    puzzlesSolved,
    puzzlesFailed,
    totalAttempts,
    averageAttempts,
    totalHintsUsed: session.hintsUsedTotal,
    totalTimeSeconds,
    scoreTotal,
  };
}

// ============================================================================
// HINT SYSTEM
// ============================================================================

/** Maximum hints per puzzle */
export const MAX_HINTS_PER_PUZZLE = 4;

/** Maximum attempts before reveal */
export const MAX_ATTEMPTS_BEFORE_REVEAL = 3;

/**
 * Check if user should receive a hint suggestion
 */
export function shouldSuggestHint(
  attemptNumber: number,
  hintsUsed: HintLevel[]
): boolean {
  // Suggest hint after 2 failed attempts if no hints used
  return attemptNumber >= 2 && hintsUsed.length === 0;
}

/**
 * Check if solution should be revealed
 */
export function shouldRevealSolution(attemptNumber: number): boolean {
  return attemptNumber > MAX_ATTEMPTS_BEFORE_REVEAL;
}

/**
 * Get available hint levels
 */
export function getAvailableHintLevels(usedLevels: HintLevel[]): HintLevel[] {
  const all: HintLevel[] = [1, 2, 3, 4];
  return all.filter((l) => !usedLevels.includes(l));
}

/**
 * Get next hint level to show
 */
export function getNextHintLevel(usedLevels: HintLevel[]): HintLevel | null {
  const available = getAvailableHintLevels(usedLevels);
  return available.length > 0 ? available[0] : null;
}
