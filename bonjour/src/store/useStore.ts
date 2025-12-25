/**
 * Combined Zustand store
 * Merges all slices with persistence
 */

import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createAppSlice, type AppSlice, initialAppState } from './slices/appSlice';
import { createProgressSlice, type ProgressSlice, initialProgressState } from './slices/progressSlice';
import { createAssistantSlice, type AssistantSlice, initialAssistantState } from './slices/assistantSlice';
import { createGameSessionSlice, type GameSessionSlice, initialGameSessionState } from './slices/gameSessionSlice';

// Combined store type
export type RootStore = AppSlice & ProgressSlice & AssistantSlice & GameSessionSlice;

// Keys to persist (exclude ephemeral state)
const PERSISTED_KEYS: (keyof RootStore)[] = [
  // AppSlice
  'soundEnabled',
  'musicEnabled',
  'hapticEnabled',
  'language',
  'hasCompletedOnboarding',
  'lastOpenedAt',
  // ProgressSlice
  'gameProgress',
  'recentSessions',
];

export const useStore = create<RootStore>()(
  persist(
    (...args) => ({
      ...createAppSlice(...args),
      ...createProgressSlice(...args),
      ...createAssistantSlice(...args),
      ...createGameSessionSlice(...args),
    }),
    {
      name: 'edu-games-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const persisted: Partial<RootStore> = {};
        for (const key of PERSISTED_KEYS) {
          (persisted as Record<string, unknown>)[key] = state[key];
        }
        return persisted;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

// Selectors for convenience
export const useAppSettings = () =>
  useStore(
    useShallow((state) => ({
      soundEnabled: state.soundEnabled,
      musicEnabled: state.musicEnabled,
      hapticEnabled: state.hapticEnabled,
      language: state.language,
      setSoundEnabled: state.setSoundEnabled,
      setMusicEnabled: state.setMusicEnabled,
      setHapticEnabled: state.setHapticEnabled,
      setLanguage: state.setLanguage,
    }))
  );

export const useGameProgress = (gameId: string) =>
  useStore((state) => state.gameProgress[gameId]);

export const useCurrentSession = () =>
  useStore((state) => state.currentSession);

export const useAssistant = () =>
  useStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      currentMessage: state.currentMessage,
      mood: state.mood,
      showMessage: state.showMessage,
      hideMessage: state.hideMessage,
      queueMessage: state.queueMessage,
    }))
  );

export const useHasHydrated = () => useStore((state) => state.hasHydrated);
