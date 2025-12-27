/**
 * Feedback components barrel export
 *
 * Note: ConfettiLayer, ActionButtons, and PerformanceAnalysis have been factorized to @/components/common
 * - Use Confetti from '@/components/common' instead of ConfettiLayer
 * - Use GameActionButtons from '@/components/common' instead of ActionButtons
 * - Use PerformanceStats from '@/components/common' instead of PerformanceAnalysis
 */

export { VictoryOverlay } from './VictoryOverlay';
export type { VictoryOverlayProps } from './VictoryOverlay';
export { PopupHeader } from './PopupHeader';
export { CollectibleCardFlip } from './CollectibleCardFlip';
export { CardBack } from './CardBack';
export { CardFront } from './CardFront';
export { CollectionProgress } from './CollectionProgress';
export { StatsSection } from './StatsSection';
export { VictoryPopup } from './VictoryPopup';
export { MascotCelebration } from './MascotCelebration';
export { VictoryMascot } from './VictoryMascot';

// Re-export from common for backward compatibility
export {
  Confetti as ConfettiLayer,
  GameActionButtons as ActionButtons,
  PerformanceStats as PerformanceAnalysis,
} from '@/components/common';
