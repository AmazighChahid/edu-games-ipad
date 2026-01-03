/**
 * Hooks Index
 * Export all custom hooks
 */

export { useCardUnlock } from './useCardUnlock';
export { default as useChildProfile } from './useChildProfile';
export { default as useGamesProgress } from './useGamesProgress';
export { default as useSound } from './useSound';
export { useHomeData } from './useHomeData';
export type { HomeData } from './useHomeData';

// Accessibility hooks
export {
  useAccessibilityAnimations,
  useFeedbackAnimation,
  useGameAnimations,
  useMascotAnimations,
  useBackgroundAnimations,
  createAccessibleSpring,
  createAccessibleTiming,
} from './useAccessibilityAnimations';

export {
  useDaltonismColors,
  useFeedbackColors,
  useSudokuColors,
  useHanoiDiskColors,
  useCategoryColors,
} from './useDaltonismColors';

export {
  useDyslexicFont,
  useFontFamily,
  createDyslexicTextStyle,
} from './useDyslexicFont';

// Game intro orchestrator (January 2026 - Standardization)
export {
  useGameIntroOrchestrator,
  type GameIntroOrchestratorConfig,
  type GameIntroOrchestratorReturn,
  type EmotionType,
  type AnimationConfig,
} from './useGameIntroOrchestrator';
