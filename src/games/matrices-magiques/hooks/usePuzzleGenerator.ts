/**
 * usePuzzleGenerator - Hook for generating puzzle sessions
 * Creates a sequence of puzzles with adaptive difficulty
 */

import { useState, useCallback, useMemo } from 'react';
import {
  PuzzleConfig,
  WorldTheme,
  DifficultyLevel,
} from '../types';
import { generateSession, generatePuzzle } from '../logic/puzzleEngine';
import { WORLDS } from '../data';

// ============================================================================
// TYPES
// ============================================================================

interface UsePuzzleGeneratorReturn {
  puzzles: PuzzleConfig[];
  currentPuzzle: PuzzleConfig | null;
  currentIndex: number;
  totalPuzzles: number;
  isLoading: boolean;
  error: string | null;
  generateNewSession: (worldId: WorldTheme, count?: number) => void;
  nextPuzzle: () => PuzzleConfig | null;
  previousPuzzle: () => PuzzleConfig | null;
  goToPuzzle: (index: number) => PuzzleConfig | null;
  resetSession: () => void;
  regenerateCurrentPuzzle: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_PUZZLE_COUNT = 8;

// ============================================================================
// HOOK
// ============================================================================

export function usePuzzleGenerator(
  initialWorldId?: WorldTheme
): UsePuzzleGeneratorReturn {
  const [puzzles, setPuzzles] = useState<PuzzleConfig[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [worldId, setWorldId] = useState<WorldTheme | null>(initialWorldId || null);

  // Current puzzle
  const currentPuzzle = useMemo(() => {
    if (puzzles.length === 0 || currentIndex >= puzzles.length) {
      return null;
    }
    return puzzles[currentIndex];
  }, [puzzles, currentIndex]);

  const totalPuzzles = puzzles.length;

  /**
   * Generate a new session of puzzles
   */
  const generateNewSession = useCallback((
    newWorldId: WorldTheme,
    count: number = DEFAULT_PUZZLE_COUNT
  ) => {
    setIsLoading(true);
    setError(null);
    setWorldId(newWorldId);

    try {
      const newPuzzles = generateSession(newWorldId, count);

      if (newPuzzles.length === 0) {
        throw new Error('Failed to generate puzzles');
      }

      setPuzzles(newPuzzles);
      setCurrentIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setPuzzles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Move to next puzzle
   */
  const nextPuzzle = useCallback((): PuzzleConfig | null => {
    if (currentIndex >= puzzles.length - 1) {
      return null; // Session complete
    }

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return puzzles[newIndex];
  }, [currentIndex, puzzles]);

  /**
   * Move to previous puzzle
   */
  const previousPuzzle = useCallback((): PuzzleConfig | null => {
    if (currentIndex <= 0) {
      return null;
    }

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return puzzles[newIndex];
  }, [currentIndex, puzzles]);

  /**
   * Go to specific puzzle
   */
  const goToPuzzle = useCallback((index: number): PuzzleConfig | null => {
    if (index < 0 || index >= puzzles.length) {
      return null;
    }

    setCurrentIndex(index);
    return puzzles[index];
  }, [puzzles]);

  /**
   * Reset session to beginning
   */
  const resetSession = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  /**
   * Regenerate current puzzle (for testing/debugging)
   */
  const regenerateCurrentPuzzle = useCallback(() => {
    if (!worldId || currentIndex >= puzzles.length) return;

    const world = WORLDS[worldId];
    const difficulty = puzzles[currentIndex]?.difficulty || 'easy';

    try {
      const newPuzzle = generatePuzzle(worldId, difficulty);

      setPuzzles((prev) => {
        const newPuzzles = [...prev];
        newPuzzles[currentIndex] = newPuzzle;
        return newPuzzles;
      });
    } catch (err) {
      console.warn('Failed to regenerate puzzle:', err);
    }
  }, [worldId, currentIndex, puzzles]);

  return {
    puzzles,
    currentPuzzle,
    currentIndex,
    totalPuzzles,
    isLoading,
    error,
    generateNewSession,
    nextPuzzle,
    previousPuzzle,
    goToPuzzle,
    resetSession,
    regenerateCurrentPuzzle,
  };
}
