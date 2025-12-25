/**
 * App-level state slice
 * Settings, preferences, and app lifecycle
 */

import { StateCreator } from 'zustand';

export interface AppState {
  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  language: 'fr' | 'en';

  // App lifecycle
  hasCompletedOnboarding: boolean;
  lastOpenedAt: number | null;

  // Hydration status
  hasHydrated: boolean;
}

export interface AppActions {
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setLanguage: (lang: 'fr' | 'en') => void;
  completeOnboarding: () => void;
  updateLastOpened: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export type AppSlice = AppState & AppActions;

export const initialAppState: AppState = {
  soundEnabled: true,
  musicEnabled: true,
  hapticEnabled: true,
  language: 'fr',
  hasCompletedOnboarding: false,
  lastOpenedAt: null,
  hasHydrated: false,
};

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set) => ({
  ...initialAppState,

  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
  setHapticEnabled: (enabled) => set({ hapticEnabled: enabled }),
  setLanguage: (lang) => set({ language: lang }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  updateLastOpened: () => set({ lastOpenedAt: Date.now() }),
  setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
});
