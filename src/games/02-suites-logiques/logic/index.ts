/**
 * Suites Logiques Engine - Exports publics
 *
 * Point d'entree unique pour le moteur pedagogique adaptatif.
 */

// ============================================
// TYPES
// ============================================

export type {
  LogicFamily,
  ErrorType,
  HintType,
  HighlightKey,
  QualityIssue,
  SequencePuzzle,
  AttemptResult,
  HintPayload,
  HintTemplate,
  RollingStats,
  PlayerModel,
  DifficultySelection,
  QualityReport,
  EngineConfig,
  SeededRandom,
} from './types';

export {
  PATTERN_TO_FAMILY,
  getPatternFamily,
  DEFAULT_ENGINE_CONFIG,
  createSeededRandom,
  defaultRandom,
} from './types';

// ============================================
// PLAYER MODEL
// ============================================

export {
  createPlayerModel,
  savePlayerModel,
  loadPlayerModel,
  deletePlayerModel,
  updateModelFromAttempt,
  getSkillLevel,
  getWeakestFamily,
  getStrongestFamily,
  getMostCommonError,
  getSuggestedDifficulty,
  isFamilyOverplayed,
  getAvailableFamilies,
} from './playerModel';

// ============================================
// SEQUENCE ENGINE
// ============================================

export {
  generatePuzzle,
  validateAnswer,
  puzzleToSequence,
  sequenceToPuzzle,
  generatePuzzleForLevel,
  generatePuzzleBatch,
  getPuzzleDebugInfo,
} from './sequenceEngine';

export type { GeneratePuzzleParams } from './sequenceEngine';

// ============================================
// ERROR DIAGNOSTIC
// ============================================

export {
  diagnoseError,
  calculateElementDistance,
  getErrorDescription,
  getErrorDimension,
} from './errorDiagnostic';

// ============================================
// HINT SYSTEM
// ============================================

export {
  getHint,
  getEncouragementMessage,
  getUIHighlightConfig,
  canShowMoreHints,
  getHintButtonText,
  ENCOURAGEMENT_MESSAGES,
} from './hintSystem';

// ============================================
// QUALITY GATES
// ============================================

export {
  scorePuzzle,
  shouldRegeneratePuzzle,
  getDetailedQualityReport,
  getSafePattern,
  SAFE_PATTERNS,
} from './qualityGates';

// ============================================
// DIFFICULTY CONTROLLER
// ============================================

export {
  DifficultyController,
  createDifficultyController,
  selectNextPuzzleSimple,
  analyzeSelection,
  simulateSelections,
} from './difficultyController';
