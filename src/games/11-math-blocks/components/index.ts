/**
 * MathBlocks Components Index
 *
 * Note: TimerBar has been factorized to @/components/common
 * - Use ProgressIndicator from '../../../components/common' with type="timer"
 */

export { MathBlock } from './MathBlock';
export { GameGrid } from './GameGrid';
export { ScoreDisplay } from './ScoreDisplay';

// Re-export from common for backward compatibility
export { ProgressIndicator as TimerBar } from '../../../components/common';
