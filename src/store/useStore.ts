/**
 * Combined Zustand store
 * Merges all slices with persistence
 *
 * Utilise StorageService pour une persistance robuste :
 * - SQLite sur mobile natif (iOS/Android)
 * - AsyncStorage sur web (fallback)
 * - Prêt pour sync serveur future
 */

import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createZustandStorage } from '../services/storage';

import { createAppSlice, type AppSlice, initialAppState } from './slices/appSlice';
import { createProgressSlice, type ProgressSlice, initialProgressState } from './slices/progressSlice';
import { createAssistantSlice, type AssistantSlice, initialAssistantState } from './slices/assistantSlice';
import { createGameSessionSlice, type GameSessionSlice, initialGameSessionState } from './slices/gameSessionSlice';
import { createProfileSlice, type ProfileSlice, initialProfileState } from './slices/profileSlice';
import { createGoalsSlice, type GoalsSlice, initialGoalsState } from './slices/goalsSlice';
import { createScreenTimeSlice, type ScreenTimeSlice, initialScreenTimeState } from './slices/screenTimeSlice';
import { createCollectionSlice, type CollectionSlice, initialCollectionState } from './slices/collectionSlice';

// Combined store type
export type RootStore = AppSlice &
  ProgressSlice &
  AssistantSlice &
  GameSessionSlice &
  ProfileSlice &
  GoalsSlice &
  ScreenTimeSlice &
  CollectionSlice;

// Keys to persist (exclude ephemeral state)
const PERSISTED_KEYS: (keyof RootStore)[] = [
  // AppSlice
  'soundEnabled',
  'musicEnabled',
  'hapticEnabled',
  'language',
  'hasCompletedOnboarding',
  'lastOpenedAt',
  'hasSeenHanoiTutorial',
  'favoriteGameIds',
  // ProgressSlice
  'gameProgress',
  'recentSessions',
  'unlockedCards',
  // ProfileSlice
  'profiles',
  'activeProfileId',
  // GoalsSlice
  'goals',
  // ScreenTimeSlice
  'dailyRecords',
  'settings',
  // CollectionSlice
  'collectionData',
  'newCardIds',
  'favoriteCardIds',
];

export const useStore = create<RootStore>()(
  persist(
    (...args) => ({
      ...createAppSlice(...args),
      ...createProgressSlice(...args),
      ...createAssistantSlice(...args),
      ...createGameSessionSlice(...args),
      ...createProfileSlice(...args),
      ...createGoalsSlice(...args),
      ...createScreenTimeSlice(...args),
      ...createCollectionSlice(...args),
    }),
    {
      name: 'edu-games-storage',
      storage: createJSONStorage(() => createZustandStorage()),
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

// Profile selectors
export const useActiveProfile = () =>
  useStore((state) => state.profiles.find((p) => p.id === state.activeProfileId) || null);

export const useProfiles = () => useStore((state) => state.profiles);

// Goals selectors
export const useActiveGoals = (profileId: string) =>
  useStore((state) => state.goals.filter((g) => g.profileId === profileId && g.status === 'active'));

export const useAllGoals = (profileId: string) =>
  useStore((state) => state.goals.filter((g) => g.profileId === profileId));

// Screen time selectors
export const useTodayScreenTime = () =>
  useStore((state) => {
    const today = new Date().toISOString().split('T')[0];
    return state.dailyRecords[today] || null;
  });

export const useScreenTimeSettings = () => useStore((state) => state.settings);

// Recent sessions selector
export const useRecentSessions = () => useStore((state) => state.recentSessions);

// Collection selectors
export const useCollection = () =>
  useStore(
    useShallow((state) => ({
      collectionData: state.collectionData,
      newCardIds: state.newCardIds,
      pendingUnlockCard: state.pendingUnlockCard,
      favoriteCardIds: state.favoriteCardIds,
      unlockCard: state.unlockCard,
      tryRandomUnlock: state.tryRandomUnlock,
      checkLegendaryUnlocks: state.checkLegendaryUnlocks,
      markCardAsSeen: state.markCardAsSeen,
      markAllCardsSeen: state.markAllCardsSeen,
      setPendingUnlockCard: state.setPendingUnlockCard,
      toggleFavorite: state.toggleFavorite,
      isCardUnlocked: state.isCardUnlocked,
      isCardNew: state.isCardNew,
      isCardFavorite: state.isCardFavorite,
      getUnlockedCards: state.getUnlockedCards,
      getUnlockedCardsCount: state.getUnlockedCardsCount,
      getUnlockedCardData: state.getUnlockedCardData,
      getCategoryStats: state.getCategoryStats,
      getAllCategoryStats: state.getAllCategoryStats,
      getRarityStats: state.getRarityStats,
      getCollectionPercentage: state.getCollectionPercentage,
      getNewCardsCount: state.getNewCardsCount,
    }))
  );

export const useCollectionStats = () =>
  useStore(
    useShallow((state) => ({
      totalUnlocked: state.getUnlockedCardsCount(),
      percentage: state.getCollectionPercentage(),
      newCount: state.getNewCardsCount(),
      categoryStats: state.getAllCategoryStats(),
      rarityStats: state.getRarityStats(),
    }))
  );

export const usePendingUnlockCard = () =>
  useStore((state) => state.pendingUnlockCard);
