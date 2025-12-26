/**
 * Module Pedagogy - Système pédagogique Montessori centralisé
 *
 * Exports :
 * - progression : Gestion des niveaux et déverrouillage
 * - feedback : Messages et animations de feedback bienveillant
 * - difficulty : Adaptation automatique de la difficulté
 */

// Progression Montessori
export {
  checkLevelUnlock,
  canUnlockNextLevel,
  getUnlockedLevels,
  getAdaptiveHelpLevel,
  shouldOfferHint,
  calculateMontessoriProgress,
  calculatePerformanceStats,
  calculateStars,
  DEFAULT_REQUIRED_COMPLETIONS,
  HELP_LEVEL_THRESHOLDS,
} from './progression';

// Feedback pédagogique
export {
  getFeedbackMessage,
  getAnimationConfig,
  FEEDBACK_ANIMATIONS,
  SUCCESS_MESSAGES,
  VICTORY_MESSAGES,
  ERROR_MESSAGES,
  ENCOURAGEMENT_MESSAGES,
  HINT_MESSAGES,
  STREAK_MESSAGES,
  MILESTONE_MESSAGES,
  HANOI_MESSAGES,
  SUDOKU_MESSAGES,
  BALANCE_MESSAGES,
  SUITES_MESSAGES,
} from './feedback';

// Adaptation de difficulté
export {
  adaptDifficulty,
  getVisualHints,
  shouldShowHint,
  adjustHelpRealtime,
  calculateDifficultyScore,
  DEFAULT_ADAPTATION_CONFIG,
} from './difficulty';
