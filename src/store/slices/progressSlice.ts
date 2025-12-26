/**
 * Progress tracking slice
 * Stores per-game progress and session history
 */

import { StateCreator } from 'zustand';
import type { GameProgress, LevelCompletion, CompletedSession } from '@/types';

export interface ProgressState {
  gameProgress: Record<string, GameProgress>;
  recentSessions: CompletedSession[];
  unlockedCards: string[]; // Array of unlocked card IDs across all games
  newlyUnlockedCard: string | null; // For "NEW!" badge display
}

export interface ProgressActions {
  initGameProgress: (gameId: string) => void;
  unlockLevel: (gameId: string, levelId: string) => void;
  recordCompletion: (session: CompletedSession) => void;
  getGameProgress: (gameId: string) => GameProgress | undefined;
  addPlayTime: (gameId: string, minutes: number) => void;
  unlockCard: (cardId: string) => void;
  markCardAsSeen: () => void;
  getUnlockedCardsCount: () => number;
  isCardNew: (cardId: string) => boolean;
  getTotalCompletions: (gameId: string) => number;
}

export type ProgressSlice = ProgressState & ProgressActions;

const MAX_RECENT_SESSIONS = 50;

export const initialProgressState: ProgressState = {
  gameProgress: {},
  recentSessions: [],
  unlockedCards: [],
  newlyUnlockedCard: null,
};

const createDefaultGameProgress = (gameId: string): GameProgress => ({
  gameId,
  unlockedLevels: ['level_1'],
  completedLevels: {},
  totalPlayTimeMinutes: 0,
  lastPlayedAt: null,
});

export const createProgressSlice: StateCreator<ProgressSlice, [], [], ProgressSlice> = (
  set,
  get
) => ({
  ...initialProgressState,

  initGameProgress: (gameId) => {
    const current = get().gameProgress[gameId];
    if (!current) {
      set((state) => ({
        gameProgress: {
          ...state.gameProgress,
          [gameId]: createDefaultGameProgress(gameId),
        },
      }));
    }
  },

  unlockLevel: (gameId, levelId) => {
    set((state) => {
      const progress = state.gameProgress[gameId] || createDefaultGameProgress(gameId);
      if (progress.unlockedLevels.includes(levelId)) {
        return state;
      }
      return {
        gameProgress: {
          ...state.gameProgress,
          [gameId]: {
            ...progress,
            unlockedLevels: [...progress.unlockedLevels, levelId],
          },
        },
      };
    });
  },

  recordCompletion: (session) => {
    set((state) => {
      const progress = state.gameProgress[session.gameId] || createDefaultGameProgress(session.gameId);
      const existingCompletion = progress.completedLevels[session.levelId];

      const newCompletion: LevelCompletion = {
        levelId: session.levelId,
        completedAt: session.completedAt,
        bestMoveCount: existingCompletion
          ? Math.min(existingCompletion.bestMoveCount, session.moveCount)
          : session.moveCount,
        bestTimeSeconds: existingCompletion
          ? Math.min(existingCompletion.bestTimeSeconds, session.timeSeconds)
          : session.timeSeconds,
        timesCompleted: (existingCompletion?.timesCompleted || 0) + 1,
        hintsUsed: session.hintsUsed,
      };

      const updatedSessions = [session, ...state.recentSessions].slice(0, MAX_RECENT_SESSIONS);

      return {
        gameProgress: {
          ...state.gameProgress,
          [session.gameId]: {
            ...progress,
            completedLevels: {
              ...progress.completedLevels,
              [session.levelId]: newCompletion,
            },
            lastPlayedAt: session.completedAt,
          },
        },
        recentSessions: updatedSessions,
      };
    });
  },

  getGameProgress: (gameId) => {
    return get().gameProgress[gameId];
  },

  addPlayTime: (gameId, minutes) => {
    set((state) => {
      const progress = state.gameProgress[gameId] || createDefaultGameProgress(gameId);
      return {
        gameProgress: {
          ...state.gameProgress,
          [gameId]: {
            ...progress,
            totalPlayTimeMinutes: progress.totalPlayTimeMinutes + minutes,
            lastPlayedAt: Date.now(),
          },
        },
      };
    });
  },

  unlockCard: (cardId) => {
    set((state) => {
      if (state.unlockedCards.includes(cardId)) {
        return state; // Already unlocked
      }
      return {
        unlockedCards: [...state.unlockedCards, cardId],
        newlyUnlockedCard: cardId, // Mark as new for "NEW!" badge
      };
    });
  },

  markCardAsSeen: () => {
    set({ newlyUnlockedCard: null });
  },

  getUnlockedCardsCount: () => {
    return get().unlockedCards.length;
  },

  isCardNew: (cardId) => {
    return get().newlyUnlockedCard === cardId;
  },

  getTotalCompletions: (gameId) => {
    const progress = get().gameProgress[gameId];
    if (!progress) return 0;

    return Object.values(progress.completedLevels).reduce(
      (total, completion) => total + completion.timesCompleted,
      0
    );
  },
});
