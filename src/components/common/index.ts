/**
 * Common components exports
 */

export { Button } from './Button';
export { IconButton } from './IconButton';
export { ParentGate } from './ParentGate';

// New standardized components
export { ScreenHeader } from './ScreenHeader';
export type { ScreenHeaderProps, ScreenHeaderVariant } from './ScreenHeader';

export { BackButton } from './BackButton';
export type { BackButtonProps } from './BackButton';

export { ScreenBackground } from './ScreenBackground';
export type { ScreenBackgroundProps, ScreenBackgroundVariant } from './ScreenBackground';

export { PageContainer } from './PageContainer';
export type { PageContainerProps } from './PageContainer';

export { GameModal } from './GameModal';
export type { GameModalProps, GameModalVariant } from './GameModal';

export { VictoryCard } from './VictoryCard';
export type { VictoryCardProps, VictoryStats, VictoryBadge, CustomStat } from './VictoryCard';

// Factorized game components (December 2024)
export { Confetti } from './Confetti';
export { SpeechBubble } from './SpeechBubble';
export { GameActionButtons } from './GameActionButtons';
export { ProgressIndicator } from './ProgressIndicator';
export type { StatItem, IndicatorType, ColorScheme } from './ProgressIndicator';

// Medium priority factorized components
export { VictoryOverlayBase } from './VictoryOverlayBase';
export { CardFlip } from './CardFlip';
export { PerformanceStats } from './PerformanceStats';
export type { PerformanceLevel, PerformanceTip } from './PerformanceStats';
export { HintButton } from './HintButton';
export type { HintButtonProps, HintButtonSize, HintButtonColorScheme } from './HintButton';

// Game Intro Template (December 2024 - Hanoi pattern unification)
export { GameIntroTemplate, calculateLevelsForAge, generateDefaultLevels, DEFAULT_ANIMATION_CONFIG } from './GameIntroTemplate';
export type {
  GameIntroTemplateProps,
  LevelConfig,
  TrainingConfig,
  TrainingParam,
  IntroAnimationConfig,
} from './GameIntroTemplate.types';
