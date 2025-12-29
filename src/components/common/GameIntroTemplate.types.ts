/**
 * GameIntroTemplate Types
 * Types for the unified game intro screen template
 * Following Hanoi pattern: level selection visible, game preview below, animated transition
 */

import type { ReactNode } from 'react';

// ============================================
// LEVEL CONFIGURATION
// ============================================

export interface LevelConfig {
  id: string;
  number: number; // 1-10
  label?: string; // Optional custom label
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  isUnlocked: boolean;
  isCompleted: boolean;
  stars?: number; // 0-3 stars earned
  bestScore?: number;
  // Game-specific config passed through
  config?: Record<string, unknown>;
}

// ============================================
// TRAINING MODE
// ============================================

export interface TrainingParam {
  id: string;
  label: string;
  type: 'select' | 'slider' | 'toggle';
  options?: { value: string | number; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue: string | number | boolean;
}

export interface TrainingConfig {
  availableParams: TrainingParam[];
  currentValues: Record<string, string | number | boolean>;
  onParamChange: (paramId: string, value: string | number | boolean) => void;
}

// ============================================
// ANIMATION CONFIGURATION
// ============================================

export interface IntroAnimationConfig {
  /** Duration for selector slide up animation (default: 400ms) */
  selectorSlideDuration: number;
  /** Duration for selector fade out animation (default: 300ms) */
  selectorFadeDuration: number;
  /** Delay before progress panel appears (default: 200ms) */
  progressDelayDuration: number;
  /** Duration for mascot slide animation (default: 400ms) */
  mascotSlideDuration: number;
  /** Distance to slide selector up (default: -150) */
  selectorSlideDistance: number;
  /** Distance to slide mascot up (default: -180) */
  mascotSlideDistance: number;
  /** Spring damping for return animations (default: 15) */
  springDamping: number;
  /** Spring stiffness for return animations (default: 150) */
  springStiffness: number;
}

export const DEFAULT_ANIMATION_CONFIG: IntroAnimationConfig = {
  selectorSlideDuration: 400,
  selectorFadeDuration: 300,
  progressDelayDuration: 200,
  mascotSlideDuration: 400,
  selectorSlideDistance: -150,
  mascotSlideDistance: -180,
  springDamping: 15,
  springStiffness: 150,
};

// ============================================
// MAIN TEMPLATE PROPS
// ============================================

export interface GameIntroTemplateProps {
  // === HEADER ===
  /** Game title displayed in header */
  title: string;
  /** Emoji displayed next to title */
  emoji: string;
  /** Callback when back button is pressed */
  onBack: () => void;
  /** Callback when parent button is pressed */
  onParentPress?: () => void;
  /** Callback when help button is pressed */
  onHelpPress?: () => void;
  /** Show parent access button (default: true) */
  showParentButton?: boolean;
  /** Show help button (default: true) */
  showHelpButton?: boolean;

  // === LEVEL SELECTION ===
  /** Array of 10 levels (calculated based on child age) */
  levels: LevelConfig[];
  /** Currently selected level (null if none) */
  selectedLevel: LevelConfig | null;
  /** Callback when a level is selected */
  onSelectLevel: (level: LevelConfig) => void;
  /** Custom render function for level cards */
  renderLevelCard?: (level: LevelConfig, isSelected: boolean) => ReactNode;
  /** Number of columns for level grid (default: 5) */
  levelColumns?: number;

  // === TRAINING MODE ===
  /** Show training mode button (default: true) */
  showTrainingMode?: boolean;
  /** Training mode configuration */
  trainingConfig?: TrainingConfig;
  /** Callback when training mode is activated */
  onTrainingPress?: () => void;
  /** Whether currently in training mode */
  isTrainingMode?: boolean;

  // === GAME AREA ===
  /** Render function for the game component (always visible) */
  renderGame: () => ReactNode;
  /** Whether the game is currently being played */
  isPlaying: boolean;
  /** Callback to start playing (transitions UI) */
  onStartPlaying?: () => void;

  // === PROGRESS PANEL (visible when playing) ===
  /** Render function for progress/stats panel */
  renderProgress?: () => ReactNode;

  // === MASCOT ===
  /** Mascot component specific to this game */
  mascotComponent: ReactNode;
  /** Current mascot message */
  mascotMessage?: string;
  /** Mascot message type for styling */
  mascotMessageType?: 'intro' | 'hint' | 'error' | 'encourage' | 'victory';

  // === CUSTOMIZATION ===
  /** Custom background component (replaces default) */
  backgroundComponent?: ReactNode;
  /** Background color fallback */
  backgroundColor?: string;

  // === ANIMATION ===
  /** Custom animation configuration */
  animationConfig?: Partial<IntroAnimationConfig>;

  // === FLOATING BUTTONS (visible when playing) ===
  /** Show reset button during gameplay */
  showResetButton?: boolean;
  /** Callback for reset button */
  onReset?: () => void;
  /** Show hint button during gameplay */
  showHintButton?: boolean;
  /** Callback for hint button */
  onHint?: () => void;
  /** Number of hints remaining */
  hintsRemaining?: number;
  /** Whether hints are disabled */
  hintsDisabled?: boolean;
  /** Callback to force complete/validate level */
  onForceComplete?: () => void;
  /** Show force complete button (default: true if onForceComplete provided) */
  showForceCompleteButton?: boolean;

  // === VICTORY ===
  /** Whether the game is won */
  isVictory?: boolean;
  /** Victory overlay component */
  victoryComponent?: ReactNode;

  // === PLAY BUTTON ===
  /** Show play button when level is selected but not playing (default: true) */
  showPlayButton?: boolean;
  /** Text for play button (default: "C'est parti !") */
  playButtonText?: string;
  /** Emoji for play button (default: "🚀") */
  playButtonEmoji?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate recommended levels based on child's age
 * @param birthDate - Child's birth date timestamp
 * @param totalLevels - Total number of levels (default: 10)
 * @returns Starting difficulty and unlocked levels
 */
export function calculateLevelsForAge(
  birthDate: number | undefined,
  totalLevels: number = 10
): { startingDifficulty: LevelConfig['difficulty']; unlockedCount: number } {
  if (!birthDate) {
    // Default: medium difficulty, 3 levels unlocked
    return { startingDifficulty: 'medium', unlockedCount: 3 };
  }

  const ageInYears = (Date.now() - birthDate) / (1000 * 60 * 60 * 24 * 365);

  if (ageInYears < 6) {
    return { startingDifficulty: 'easy', unlockedCount: 5 };
  } else if (ageInYears < 7) {
    return { startingDifficulty: 'easy', unlockedCount: 4 };
  } else if (ageInYears < 8) {
    return { startingDifficulty: 'medium', unlockedCount: 3 };
  } else if (ageInYears < 9) {
    return { startingDifficulty: 'medium', unlockedCount: 3 };
  } else {
    return { startingDifficulty: 'hard', unlockedCount: 2 };
  }
}

/**
 * Generate default 10 levels with progressive difficulty
 * @param gameId - Game identifier
 * @param birthDate - Child's birth date for difficulty calculation
 * @param completedLevels - Array of completed level IDs
 */
export function generateDefaultLevels(
  gameId: string,
  birthDate?: number,
  completedLevels: string[] = []
): LevelConfig[] {
  const difficultyMap: Record<number, LevelConfig['difficulty']> = {
    1: 'easy',
    2: 'easy',
    3: 'easy',
    4: 'medium',
    5: 'medium',
    6: 'medium',
    7: 'hard',
    8: 'hard',
    9: 'expert',
    10: 'expert',
  };

  return Array.from({ length: 10 }, (_, i) => {
    const levelNumber = i + 1;
    const levelId = `${gameId}_level_${levelNumber}`;
    const isCompleted = completedLevels.includes(levelId);

    return {
      id: levelId,
      number: levelNumber,
      difficulty: difficultyMap[levelNumber],
      isUnlocked: true, // All levels unlocked by default
      isCompleted,
      stars: isCompleted ? Math.floor(Math.random() * 3) + 1 : undefined, // Placeholder
    };
  });
}
