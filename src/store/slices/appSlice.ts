/**
 * App-level state slice
 * Settings, preferences, and app lifecycle
 */

import { StateCreator } from 'zustand';
import type { DaltonismMode } from '../../theme/daltonismModes';

export interface AppState {
  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  language: 'fr' | 'en';

  // Accessibility settings
  dyslexicFontEnabled: boolean;
  daltonismMode: DaltonismMode;
  highContrastEnabled: boolean;

  // App lifecycle
  hasCompletedOnboarding: boolean;
  lastOpenedAt: number | null;

  // Tutorial flags
  hasSeenHanoiTutorial: boolean;

  // Hydration status
  hasHydrated: boolean;
}

export interface AppActions {
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setLanguage: (lang: 'fr' | 'en') => void;

  // Accessibility actions
  setDyslexicFontEnabled: (enabled: boolean) => void;
  setDaltonismMode: (mode: DaltonismMode) => void;
  setHighContrastEnabled: (enabled: boolean) => void;

  completeOnboarding: () => void;
  updateLastOpened: () => void;
  setHasHydrated: (hydrated: boolean) => void;
  setHasSeenHanoiTutorial: () => void;
}

export type AppSlice = AppState & AppActions;

export const initialAppState: AppState = {
  soundEnabled: true,
  musicEnabled: true,
  hapticEnabled: true,
  language: 'fr',

  // Accessibility defaults
  dyslexicFontEnabled: false,
  daltonismMode: 'normal',
  highContrastEnabled: false,

  hasCompletedOnboarding: false,
  lastOpenedAt: null,
  hasSeenHanoiTutorial: false,
  hasHydrated: false,
};

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set) => ({
  ...initialAppState,

  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
  setHapticEnabled: (enabled) => set({ hapticEnabled: enabled }),
  setLanguage: (lang) => set({ language: lang }),

  // Accessibility setters
  setDyslexicFontEnabled: (enabled) => set({ dyslexicFontEnabled: enabled }),
  setDaltonismMode: (mode) => set({ daltonismMode: mode }),
  setHighContrastEnabled: (enabled) => set({ highContrastEnabled: enabled }),

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  updateLastOpened: () => set({ lastOpenedAt: Date.now() }),
  setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
  setHasSeenHanoiTutorial: () => set({ hasSeenHanoiTutorial: true }),
});
