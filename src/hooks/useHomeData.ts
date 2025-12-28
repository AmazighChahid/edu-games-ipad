/**
 * useHomeData - Hook to gather all data needed for the V9 home screen
 * Connects to the Zustand store and computes derived data
 */

import { useMemo } from 'react';
import { useStore, useActiveProfile, useCollection, useGameProgress } from '@/store';
import {
  UserProfileV9,
  PiouAdvice,
  GardenStats,
  StreakData,
  WeekDay,
  CollectionDataV9,
  GameCategoryV9,
  MedalType,
  FlowerType,
} from '@/types/home.types';
import { buildGameCategories, FLOWER_EMOJIS, WEEK_DAYS_CONFIG } from '@/data/gamesConfig';
import { ALL_CARDS, getCardById } from '@/data/cards';

// ============ HELPER FUNCTIONS ============

/**
 * Calculate medal type based on completed levels
 */
function getMedalFromProgress(completedLevels: number): MedalType {
  if (completedLevels >= 6) return 'diamond';
  if (completedLevels >= 4) return 'gold';
  if (completedLevels >= 2) return 'silver';
  if (completedLevels >= 1) return 'bronze';
  return 'none';
}

/**
 * Format play time in hours
 */
function formatPlayTime(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

/**
 * Get day of week (0 = Monday, 6 = Sunday)
 */
function getDayOfWeek(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Sunday=6
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

// ============ MAIN HOOK ============

export interface HomeData {
  profile: UserProfileV9;
  piouAdvice: PiouAdvice;
  gardenStats: GardenStats;
  streakData: StreakData;
  collectionData: CollectionDataV9;
  gameCategories: GameCategoryV9[];
}

export function useHomeData(): HomeData {
  const activeProfile = useActiveProfile();
  const { collectionData, newCardIds, getUnlockedCardsCount } = useCollection();
  const gameProgress = useStore((state) => state.gameProgress);
  const dailyRecords = useStore((state) => state.dailyRecords);

  // ============ PROFILE ============
  const profile = useMemo<UserProfileV9>(() => {
    // Calculate total medals (games with at least bronze)
    let totalMedals = 0;
    let totalCompletedLevels = 0;

    Object.values(gameProgress).forEach((progress) => {
      const completed = Object.keys(progress.completedLevels || {}).length;
      totalCompletedLevels += completed;
      if (completed >= 1) totalMedals++;
    });

    // Calculate level based on total progress
    const level = Math.floor(totalCompletedLevels / 3) + 1;

    // Calculate gems (virtual currency based on completions)
    const gems = totalCompletedLevels * 10 + getUnlockedCardsCount() * 25;

    return {
      name: activeProfile?.name || 'Emma',
      avatarEmoji: activeProfile?.avatar || '🦊',
      level: Math.min(level, 99),
      gems,
      totalMedals,
    };
  }, [activeProfile, gameProgress, getUnlockedCardsCount]);

  // ============ GARDEN STATS ============
  const gardenStats = useMemo<GardenStats>(() => {
    let totalGames = 0;
    let totalPlayTime = 0;

    Object.values(gameProgress).forEach((progress) => {
      const completed = Object.keys(progress.completedLevels || {}).length;
      totalGames += completed;
      totalPlayTime += progress.totalPlayTimeMinutes || 0;
    });

    // 1 flower per 10 completed levels, max 5
    const flowerCount = Math.min(5, Math.floor(totalGames / 10));
    const flowers = FLOWER_EMOJIS.slice(0, flowerCount) as FlowerType[];

    return {
      flowers,
      totalGames,
      totalTime: formatPlayTime(totalPlayTime),
    };
  }, [gameProgress]);

  // ============ STREAK DATA ============
  const streakData = useMemo<StreakData>(() => {
    const today = new Date();
    const todayIndex = getDayOfWeek(today);

    // Build week days
    const weekDays: WeekDay[] = WEEK_DAYS_CONFIG.map((config, index) => {
      // Calculate the date for this day of the week
      const dayOffset = index - todayIndex;
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      const dateKey = formatDateKey(date);

      // Check if there's activity on this day
      const record = dailyRecords?.[dateKey];
      const completed = record && record.totalMinutes > 0;

      return {
        day: config.label as WeekDay['day'],
        label: config.label,
        completed: completed || false,
        isToday: index === todayIndex,
      };
    });

    // Calculate current streak (consecutive days up to today)
    let currentStreak = 0;
    for (let i = todayIndex; i >= 0; i--) {
      if (weekDays[i].completed || weekDays[i].isToday) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      currentStreak,
      weekDays,
    };
  }, [dailyRecords]);

  // ============ COLLECTION DATA ============
  const collectionDataV9 = useMemo<CollectionDataV9>(() => {
    const unlockedIds = Object.keys(collectionData);
    const unlockedCards = unlockedIds.map((id) => {
      const card = getCardById(id);
      return card?.emoji || '❓';
    });

    return {
      unlockedCards,
      totalCards: ALL_CARDS.length,
      newCardIds,
    };
  }, [collectionData, newCardIds]);

  // ============ PIOU ADVICE ============
  const piouAdvice = useMemo<PiouAdvice>(() => {
    // Find game closest to next medal
    const defaultAdvice: PiouAdvice = {
      message: 'Continue comme ça, tu progresses super bien !',
      highlightedPart: 'super bien',
      actionLabel: 'Continuer',
    };

    // Check each game for progress toward next medal
    type UpgradeInfo = { gameId: string; levelsNeeded: number };
    let closestToUpgrade: UpgradeInfo | undefined;

    const entries = Object.entries(gameProgress);
    for (const [gameId, progress] of entries) {
      const completed = Object.keys(progress.completedLevels || {}).length;
      const currentMedal = getMedalFromProgress(completed);

      // Calculate levels needed for next medal
      let levelsNeeded = 0;
      if (currentMedal === 'none') levelsNeeded = 1 - completed;
      else if (currentMedal === 'bronze') levelsNeeded = 2 - completed;
      else if (currentMedal === 'silver') levelsNeeded = 4 - completed;
      else if (currentMedal === 'gold') levelsNeeded = 6 - completed;

      if (levelsNeeded > 0 && levelsNeeded <= 2) {
        if (!closestToUpgrade || levelsNeeded < closestToUpgrade.levelsNeeded) {
          closestToUpgrade = { gameId, levelsNeeded };
        }
      }
    }

    if (closestToUpgrade) {
      const { levelsNeeded, gameId: targetGameId } = closestToUpgrade;
      const currentMedal = getMedalFromProgress(
        Object.keys(gameProgress[targetGameId]?.completedLevels || {}).length
      );

      let nextMedal = 'Bronze';
      if (currentMedal === 'bronze') nextMedal = 'Argent';
      else if (currentMedal === 'silver') nextMedal = 'Or';
      else if (currentMedal === 'gold') nextMedal = 'Diamant';

      return {
        message: `Tu es à ${levelsNeeded} niveau${levelsNeeded > 1 ? 'x' : ''} du rang ${nextMedal} !`,
        highlightedPart: `${levelsNeeded} niveau${levelsNeeded > 1 ? 'x' : ''}`,
        actionLabel: "C'est parti !",
        targetGameId: targetGameId,
      };
    }

    if (streakData.currentStreak >= 3) {
      // Encourage streak
      return {
        message: `Bravo ! Tu as une série de ${streakData.currentStreak} jours !`,
        highlightedPart: `${streakData.currentStreak} jours`,
        actionLabel: 'Continuer',
      };
    }

    return defaultAdvice;
  }, [gameProgress, streakData.currentStreak]);

  // ============ GAME CATEGORIES ============
  const gameCategories = useMemo<GameCategoryV9[]>(() => {
    const getMedalForGame = (gameId: string): MedalType => {
      const progress = gameProgress[gameId];
      if (!progress) return 'none';
      const completed = Object.keys(progress.completedLevels || {}).length;
      return getMedalFromProgress(completed);
    };

    // Filtrer les jeux par tranche d'âge du profil actif
    const ageGroup = activeProfile?.ageGroup;
    return buildGameCategories(getMedalForGame, ageGroup);
  }, [gameProgress, activeProfile?.ageGroup]);

  return {
    profile,
    piouAdvice,
    gardenStats,
    streakData,
    collectionData: collectionDataV9,
    gameCategories,
  };
}
