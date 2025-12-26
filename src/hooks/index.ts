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
