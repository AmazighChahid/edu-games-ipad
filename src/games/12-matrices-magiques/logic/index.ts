/**
 * Logic exports for Matrices Magiques
 */

// Transformations
export {
  getNextSize,
  getPreviousSize,
  applyRotation,
  getNextRotation90,
  getNextRotation45,
  toggleFill,
  getNextCount,
  getPreviousCount,
  applyTransformation,
  reverseTransformation,
  detectTransformation,
  shapesEqual,
  createTransformationSequence,
  validateSequence,
} from './transformations';

// Puzzle Engine
export {
  generateRandomShape,
  generatePuzzle,
  generateSession,
  validatePuzzle,
} from './puzzleEngine';

// Validator
export {
  checkAnswer,
  getCorrectChoiceIndex,
  calculatePuzzleScore,
  calculateStars,
  createInitialSession,
  recordAttempt,
  nextPuzzle,
  getSessionStats,
  MAX_HINTS_PER_PUZZLE,
  MAX_ATTEMPTS_BEFORE_REVEAL,
  shouldSuggestHint,
  shouldRevealSolution,
  getAvailableHintLevels,
  getNextHintLevel,
} from './validator';
export type { SessionStats } from './validator';
