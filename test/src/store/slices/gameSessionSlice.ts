/**
 * Game session slice (ephemeral - not persisted)
 * Manages the current active game session
 */

import { StateCreator } from 'zustand';
import type { GameSession, GameStatus, CompletedSession } from '@/types';

export interface GameSessionState {
  currentSession: GameSession | null;
  sessionStartTime: number | null;
}

export interface GameSessionActions {
  startSession: <S>(gameId: string, levelId: string, initialState: S) => void;
  updateGameState: <S>(state: S) => void;
  incrementMoves: () => void;
  recordInvalidMove: () => void;
  useHint: () => void;
  setStatus: (status: GameStatus) => void;
  endSession: () => CompletedSession | null;
  clearSession: () => void;
}

export type GameSessionSlice = GameSessionState & GameSessionActions;

export const initialGameSessionState: GameSessionState = {
  currentSession: null,
  sessionStartTime: null,
};

export const createGameSessionSlice: StateCreator<
  GameSessionSlice,
  [],
  [],
  GameSessionSlice
> = (set, get) => ({
  ...initialGameSessionState,

  startSession: <S>(gameId: string, levelId: string, initialState: S) => {
    const now = Date.now();
    set({
      currentSession: {
        gameId,
        levelId,
        startedAt: now,
        moveCount: 0,
        hintsUsed: 0,
        invalidMoves: 0,
        gameState: initialState,
        status: 'playing',
      },
      sessionStartTime: now,
    });
  },

  updateGameState: <S>(gameState: S) => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          gameState,
        },
      };
    });
  },

  incrementMoves: () => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          moveCount: state.currentSession.moveCount + 1,
        },
      };
    });
  },

  recordInvalidMove: () => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          invalidMoves: state.currentSession.invalidMoves + 1,
        },
      };
    });
  },

  useHint: () => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          hintsUsed: state.currentSession.hintsUsed + 1,
        },
      };
    });
  },

  setStatus: (status) => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          status,
        },
      };
    });
  },

  endSession: () => {
    const { currentSession, sessionStartTime } = get();
    if (!currentSession || !sessionStartTime) return null;

    const timeSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);

    const completedSession: CompletedSession = {
      gameId: currentSession.gameId,
      levelId: currentSession.levelId,
      completedAt: Date.now(),
      moveCount: currentSession.moveCount,
      timeSeconds,
      hintsUsed: currentSession.hintsUsed,
    };

    set({
      currentSession: null,
      sessionStartTime: null,
    });

    return completedSession;
  },

  clearSession: () => {
    set({
      currentSession: null,
      sessionStartTime: null,
    });
  },
});
