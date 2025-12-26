/**
 * Tests for Progression Montessori
 */

import {
  checkLevelUnlock,
  canUnlockNextLevel,
  getUnlockedLevels,
  getAdaptiveHelpLevel,
  shouldOfferHint,
  calculateMontessoriProgress,
  calculatePerformanceStats,
  calculateStars,
  DEFAULT_REQUIRED_COMPLETIONS,
} from '../../../src/core/pedagogy/progression';
import type { LevelConfig, LevelProgress, SessionSummary } from '../../../src/core/types/core.types';

describe('progression', () => {
  // Test level configs
  const levels: LevelConfig[] = [
    {
      id: 'level-1',
      gameId: 'hanoi',
      difficulty: 'easy',
      minAge: 6,
      maxAge: 10,
      estimatedDuration: 120,
      requiredCompletions: 2,
    },
    {
      id: 'level-2',
      gameId: 'hanoi',
      difficulty: 'medium',
      minAge: 6,
      maxAge: 10,
      estimatedDuration: 180,
      requiredCompletions: 2,
    },
    {
      id: 'level-3',
      gameId: 'hanoi',
      difficulty: 'hard',
      minAge: 6,
      maxAge: 10,
      estimatedDuration: 240,
      requiredCompletions: 2,
    },
  ];

  describe('checkLevelUnlock', () => {
    it('should always unlock first level', () => {
      const progresses: Record<string, LevelProgress> = {};
      expect(checkLevelUnlock('level-1', progresses, levels)).toBe(true);
    });

    it('should unlock level when previous completed enough times', () => {
      const progresses: Record<string, LevelProgress> = {
        'level-1': {
          levelId: 'level-1',
          completions: 2,
          bestTime: 30,
          bestMoves: 7,
          lastPlayedAt: Date.now(),
          unlocked: true,
        },
      };

      expect(checkLevelUnlock('level-2', progresses, levels)).toBe(true);
    });

    it('should not unlock level when previous not completed enough', () => {
      const progresses: Record<string, LevelProgress> = {
        'level-1': {
          levelId: 'level-1',
          completions: 1,
          bestTime: 30,
          bestMoves: 7,
          lastPlayedAt: Date.now(),
          unlocked: true,
        },
      };

      expect(checkLevelUnlock('level-2', progresses, levels)).toBe(false);
    });

    it('should return false for unknown level', () => {
      expect(checkLevelUnlock('unknown', {}, levels)).toBe(false);
    });

    it('should require exactly 2 completions by default', () => {
      const progresses: Record<string, LevelProgress> = {
        'level-1': {
          levelId: 'level-1',
          completions: 1,
          bestTime: 30,
          bestMoves: 7,
          lastPlayedAt: Date.now(),
          unlocked: true,
        },
      };

      expect(checkLevelUnlock('level-2', progresses, levels)).toBe(false);

      progresses['level-1'].completions = 2;
      expect(checkLevelUnlock('level-2', progresses, levels)).toBe(true);
    });
  });

  describe('canUnlockNextLevel', () => {
    it('should return true when completions >= required', () => {
      expect(canUnlockNextLevel(2, 2)).toBe(true);
      expect(canUnlockNextLevel(3, 2)).toBe(true);
    });

    it('should return false when completions < required', () => {
      expect(canUnlockNextLevel(1, 2)).toBe(false);
      expect(canUnlockNextLevel(0, 2)).toBe(false);
    });

    it('should use default required completions', () => {
      expect(canUnlockNextLevel(DEFAULT_REQUIRED_COMPLETIONS)).toBe(true);
      expect(canUnlockNextLevel(DEFAULT_REQUIRED_COMPLETIONS - 1)).toBe(false);
    });
  });

  describe('getUnlockedLevels', () => {
    it('should return only first level when no progress', () => {
      const unlocked = getUnlockedLevels('hanoi', {}, levels);
      expect(unlocked).toEqual(['level-1']);
    });

    it('should return multiple levels based on progress', () => {
      const progresses: Record<string, LevelProgress> = {
        'level-1': {
          levelId: 'level-1',
          completions: 2,
          bestTime: 30,
          bestMoves: 7,
          lastPlayedAt: Date.now(),
          unlocked: true,
        },
        'level-2': {
          levelId: 'level-2',
          completions: 3,
          bestTime: 45,
          bestMoves: 15,
          lastPlayedAt: Date.now(),
          unlocked: true,
        },
      };

      const unlocked = getUnlockedLevels('hanoi', progresses, levels);
      expect(unlocked).toContain('level-1');
      expect(unlocked).toContain('level-2');
      expect(unlocked).toContain('level-3');
    });

    it('should filter by gameId', () => {
      const mixedLevels: LevelConfig[] = [
        ...levels,
        { id: 'sudoku-1', gameId: 'sudoku', difficulty: 'easy', minAge: 6, maxAge: 10, estimatedDuration: 120, requiredCompletions: 2 },
      ];

      const unlocked = getUnlockedLevels('hanoi', {}, mixedLevels);
      expect(unlocked).not.toContain('sudoku-1');
    });
  });

  describe('getAdaptiveHelpLevel', () => {
    it('should return full for 0 completions', () => {
      expect(getAdaptiveHelpLevel(0, 0)).toBe('full');
    });

    it('should return medium after 2 completions', () => {
      expect(getAdaptiveHelpLevel(2, 0)).toBe('medium');
    });

    it('should return low after 4 completions', () => {
      expect(getAdaptiveHelpLevel(4, 0)).toBe('low');
    });

    it('should return none after 6 completions', () => {
      expect(getAdaptiveHelpLevel(6, 0)).toBe('none');
    });

    it('should increase help level on many errors', () => {
      expect(getAdaptiveHelpLevel(6, 5)).toBe('full');
      expect(getAdaptiveHelpLevel(4, 3)).toBe('medium');
    });

    it('should prioritize error-based help', () => {
      // Even with many completions, errors should increase help
      expect(getAdaptiveHelpLevel(10, 5)).toBe('full');
    });
  });

  describe('shouldOfferHint', () => {
    it('should offer hint after 2 errors by default', () => {
      expect(shouldOfferHint(2)).toBe(true);
      expect(shouldOfferHint(3)).toBe(true);
    });

    it('should not offer hint before threshold', () => {
      expect(shouldOfferHint(0)).toBe(false);
      expect(shouldOfferHint(1)).toBe(false);
    });

    it('should respect custom threshold', () => {
      expect(shouldOfferHint(1, 1)).toBe(true);
      expect(shouldOfferHint(4, 5)).toBe(false);
    });
  });

  describe('calculateMontessoriProgress', () => {
    it('should return 0 for empty sessions', () => {
      expect(calculateMontessoriProgress([])).toBe(0);
    });

    it('should calculate progress for single session', () => {
      const sessions: SessionSummary[] = [
        {
          sessionId: '1',
          levelId: 'level-1',
          startedAt: 1000,
          endedAt: 2000,
          completed: true,
          errorCount: 2,
          hintsUsed: 1,
          moveCount: 10,
        },
      ];

      const progress = calculateMontessoriProgress(sessions);
      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    it('should show improvement over time', () => {
      // First half: more errors and hints
      const sessions: SessionSummary[] = [
        {
          sessionId: '1',
          levelId: 'level-1',
          startedAt: 1000,
          endedAt: 2000,
          completed: true,
          errorCount: 5,
          hintsUsed: 3,
          moveCount: 15,
        },
        {
          sessionId: '2',
          levelId: 'level-1',
          startedAt: 3000,
          endedAt: 4000,
          completed: true,
          errorCount: 4,
          hintsUsed: 2,
          moveCount: 12,
        },
        // Second half: fewer errors and hints
        {
          sessionId: '3',
          levelId: 'level-1',
          startedAt: 5000,
          endedAt: 6000,
          completed: true,
          errorCount: 1,
          hintsUsed: 0,
          moveCount: 8,
        },
        {
          sessionId: '4',
          levelId: 'level-1',
          startedAt: 7000,
          endedAt: 8000,
          completed: true,
          errorCount: 0,
          hintsUsed: 0,
          moveCount: 7,
        },
      ];

      const progress = calculateMontessoriProgress(sessions);
      expect(progress).toBeGreaterThan(50); // Shows improvement
    });
  });

  describe('calculatePerformanceStats', () => {
    it('should return zeros for empty sessions', () => {
      const stats = calculatePerformanceStats([]);

      expect(stats.totalSessions).toBe(0);
      expect(stats.completedSessions).toBe(0);
      expect(stats.completionRate).toBe(0);
    });

    it('should calculate correct statistics', () => {
      const sessions: SessionSummary[] = [
        {
          sessionId: '1',
          levelId: 'level-1',
          startedAt: 0,
          endedAt: 30000,
          completed: true,
          errorCount: 2,
          hintsUsed: 1,
          moveCount: 10,
        },
        {
          sessionId: '2',
          levelId: 'level-1',
          startedAt: 0,
          endedAt: 45000,
          completed: true,
          errorCount: 0,
          hintsUsed: 0,
          moveCount: 7,
        },
        {
          sessionId: '3',
          levelId: 'level-1',
          startedAt: 0,
          endedAt: 60000,
          completed: false,
          errorCount: 5,
          hintsUsed: 2,
          moveCount: 20,
        },
      ];

      const stats = calculatePerformanceStats(sessions);

      expect(stats.totalSessions).toBe(3);
      expect(stats.completedSessions).toBe(2);
      expect(stats.completionRate).toBeCloseTo(2 / 3);
      expect(stats.averageErrors).toBeCloseTo(7 / 3);
      expect(stats.averageHints).toBe(1);
      expect(stats.bestTime).toBe(30000);
    });

    it('should calculate current streak', () => {
      const sessions: SessionSummary[] = [
        {
          sessionId: '1',
          levelId: 'level-1',
          startedAt: 0,
          endedAt: 1000,
          completed: false,
          errorCount: 5,
          hintsUsed: 2,
          moveCount: 20,
        },
        {
          sessionId: '2',
          levelId: 'level-1',
          startedAt: 0,
          endedAt: 1000,
          completed: true,
          errorCount: 1,
          hintsUsed: 0,
          moveCount: 8,
        },
        {
          sessionId: '3',
          levelId: 'level-1',
          startedAt: 0,
          endedAt: 1000,
          completed: true,
          errorCount: 0,
          hintsUsed: 0,
          moveCount: 7,
        },
      ];

      const stats = calculatePerformanceStats(sessions);
      expect(stats.currentStreak).toBe(2);
    });
  });

  describe('calculateStars', () => {
    const baseSession: SessionSummary = {
      sessionId: '1',
      levelId: 'level-1',
      startedAt: 0,
      endedAt: 30000,
      completed: true,
      errorCount: 0,
      hintsUsed: 0,
      moveCount: 7,
    };

    it('should return 1 star for incomplete', () => {
      const session = { ...baseSession, completed: false };
      expect(calculateStars(session)).toBe(1);
    });

    it('should return 3 stars for perfect game', () => {
      expect(calculateStars(baseSession, 7, 30)).toBe(3);
    });

    it('should return 2 stars for good but not perfect', () => {
      const session = { ...baseSession, moveCount: 10, errorCount: 1 };
      expect(calculateStars(session, 7)).toBe(2);
    });

    it('should award 3 stars for no errors and no hints', () => {
      const session = { ...baseSession, errorCount: 0, hintsUsed: 0, moveCount: 20 };
      expect(calculateStars(session)).toBe(3);
    });
  });
});
