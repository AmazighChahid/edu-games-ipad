/**
 * Store principal de l'application
 * Gère les paramètres globaux et les préférences
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppStore {
  // Profil
  childName: string;

  // Paramètres audio
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;

  // Accessibilité
  useDyslexiaFont: boolean;
  textScale: number;  // 1.0, 1.25, 1.5
  highContrastMode: boolean;
  reduceMotion: boolean;

  // Progression
  hasSeenTutorial: boolean;
  gamesCompleted: number;

  // Actions
  setChildName: (name: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setDyslexiaFont: (enabled: boolean) => void;
  setTextScale: (scale: number) => void;
  setHighContrastMode: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
  setHasSeenTutorial: (seen: boolean) => void;
  incrementGamesCompleted: () => void;
  resetProgress: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Valeurs par défaut
      childName: '',
      soundEnabled: true,
      musicEnabled: true,
      hapticEnabled: true,
      useDyslexiaFont: false,
      textScale: 1.0,
      highContrastMode: false,
      reduceMotion: false,
      hasSeenTutorial: false,
      gamesCompleted: 0,

      // Actions
      setChildName: (name) => set({ childName: name }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
      setHapticEnabled: (enabled) => set({ hapticEnabled: enabled }),
      setDyslexiaFont: (enabled) => set({ useDyslexiaFont: enabled }),
      setTextScale: (scale) => set({ textScale: scale }),
      setHighContrastMode: (enabled) => set({ highContrastMode: enabled }),
      setReduceMotion: (enabled) => set({ reduceMotion: enabled }),
      setHasSeenTutorial: (seen) => set({ hasSeenTutorial: seen }),
      incrementGamesCompleted: () =>
        set((state) => ({ gamesCompleted: state.gamesCompleted + 1 })),
      resetProgress: () =>
        set({ hasSeenTutorial: false, gamesCompleted: 0 }),
    }),
    {
      name: 'bonjour-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
