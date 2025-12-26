/**
 * useHintSystem - Hook for managing the progressive hint system
 * 4 levels of hints with increasing specificity
 */

import { useState, useCallback, useMemo } from 'react';
import {
  HintLevel,
  HintConfig,
  HintState,
  PuzzleConfig,
  WorldTheme,
} from '../types';
import { PIXEL_DIALOGUES } from '../data';
import {
  getNextHintLevel,
  getAvailableHintLevels,
  MAX_HINTS_PER_PUZZLE,
} from '../logic/validator';

// ============================================================================
// TYPES
// ============================================================================

interface UseHintSystemReturn {
  hintState: HintState;
  currentHint: HintConfig | null;
  canRequestHint: boolean;
  hintsRemaining: number;
  requestHint: () => HintConfig | null;
  resetHints: () => void;
  getHintDialogue: (level: HintLevel) => string;
}

// ============================================================================
// HINT GENERATION
// ============================================================================

/**
 * Generate hint configuration for a puzzle
 */
function generateHint(
  puzzle: PuzzleConfig,
  level: HintLevel
): HintConfig {
  const starCosts: Record<HintLevel, number> = {
    1: 0,   // First hint is free
    2: 1,
    3: 2,
    4: 3,
  };

  // Generate appropriate message and visual hint based on level
  switch (level) {
    case 1:
      // General encouragement - look at the pattern
      return {
        level: 1,
        message: getRandomDialogue('hint_1'),
        starCost: starCosts[1],
      };

    case 2:
      // Hint about direction - row or column
      const direction = puzzle.transformations[0]?.direction || 'row';
      return {
        level: 2,
        message: getRandomDialogue('hint_2'),
        visualHint: direction === 'row' ? 'highlight_row' : 'highlight_column',
        starCost: starCosts[2],
      };

    case 3:
      // Hint about transformation type
      return {
        level: 3,
        message: getRandomDialogue('hint_3'),
        visualHint: 'show_pattern',
        starCost: starCosts[3],
      };

    case 4:
      // Last resort - show the answer
      return {
        level: 4,
        message: getRandomDialogue('hint_4'),
        visualHint: 'reveal_answer',
        starCost: starCosts[4],
      };
  }
}

/**
 * Get random dialogue for a context
 */
function getRandomDialogue(context: keyof typeof PIXEL_DIALOGUES): string {
  const dialogues = PIXEL_DIALOGUES[context];
  if (!dialogues || dialogues.length === 0) {
    return "Regarde bien le motif...";
  }
  return dialogues[Math.floor(Math.random() * dialogues.length)];
}

// ============================================================================
// HOOK
// ============================================================================

export function useHintSystem(puzzle: PuzzleConfig | null): UseHintSystemReturn {
  const [hintsUsed, setHintsUsed] = useState<HintLevel[]>([]);
  const [currentHint, setCurrentHint] = useState<HintConfig | null>(null);

  // Calculate remaining hints
  const hintsRemaining = MAX_HINTS_PER_PUZZLE - hintsUsed.length;
  const canRequestHint = hintsRemaining > 0 && puzzle !== null;

  // Hint state for tracking
  const hintState: HintState = useMemo(() => ({
    hintsUsed,
    availableHints: hintsRemaining,
    currentHint,
  }), [hintsUsed, hintsRemaining, currentHint]);

  /**
   * Request next hint
   */
  const requestHint = useCallback((): HintConfig | null => {
    if (!puzzle || !canRequestHint) return null;

    const nextLevel = getNextHintLevel(hintsUsed);
    if (!nextLevel) return null;

    const hint = generateHint(puzzle, nextLevel);

    setHintsUsed((prev) => [...prev, nextLevel]);
    setCurrentHint(hint);

    return hint;
  }, [puzzle, canRequestHint, hintsUsed]);

  /**
   * Reset hints for new puzzle
   */
  const resetHints = useCallback(() => {
    setHintsUsed([]);
    setCurrentHint(null);
  }, []);

  /**
   * Get dialogue for specific hint level
   */
  const getHintDialogue = useCallback((level: HintLevel): string => {
    const contextMap: Record<HintLevel, keyof typeof PIXEL_DIALOGUES> = {
      1: 'hint_1',
      2: 'hint_2',
      3: 'hint_3',
      4: 'hint_4',
    };
    return getRandomDialogue(contextMap[level]);
  }, []);

  return {
    hintState,
    currentHint,
    canRequestHint,
    hintsRemaining,
    requestHint,
    resetHints,
    getHintDialogue,
  };
}
