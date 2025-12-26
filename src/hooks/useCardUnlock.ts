/**
 * useCardUnlock Hook
 * Manages card unlocking logic after level completion
 */

import { useCallback, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, getCardById } from '@/data/cards';

interface UseCardUnlockOptions {
  gameId: string;
  levelId: string;
  levelNumber: number;
  isOptimal?: boolean;
}

interface UseCardUnlockResult {
  unlockedCard: Card | null;
  showUnlockAnimation: boolean;
  checkAndUnlockCard: () => Card | null;
  dismissUnlockAnimation: () => void;
}

export function useCardUnlock(options: UseCardUnlockOptions): UseCardUnlockResult {
  const { gameId, levelId, levelNumber, isOptimal = false } = options;

  const [unlockedCard, setUnlockedCard] = useState<Card | null>(null);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  const {
    tryRandomUnlock,
    checkLegendaryUnlocks,
    pendingUnlockCard,
    setPendingUnlockCard,
    getAllCategoryStats,
  } = useStore((state) => ({
    tryRandomUnlock: state.tryRandomUnlock,
    checkLegendaryUnlocks: state.checkLegendaryUnlocks,
    pendingUnlockCard: state.pendingUnlockCard,
    setPendingUnlockCard: state.setPendingUnlockCard,
    getAllCategoryStats: state.getAllCategoryStats,
  }));

  const checkAndUnlockCard = useCallback((): Card | null => {
    // Get category stats for milestone checks
    const categoryStats = getAllCategoryStats();
    const categoryCompletion: Record<string, number> = {};
    Object.entries(categoryStats).forEach(([key, value]) => {
      categoryCompletion[key] = value.percentage;
    });

    // First, check for legendary unlocks (fixed conditions)
    const legendaryUnlocks = checkLegendaryUnlocks({
      gameId,
      levelNumber,
      isOptimal,
      categoryCompletion: categoryCompletion as any,
    });

    if (legendaryUnlocks.length > 0) {
      const card = legendaryUnlocks[0];
      setUnlockedCard(card);
      setShowUnlockAnimation(true);
      return card;
    }

    // Then, try random unlock
    const randomCard = tryRandomUnlock(gameId, levelId, levelNumber);
    if (randomCard) {
      setUnlockedCard(randomCard);
      setShowUnlockAnimation(true);
      return randomCard;
    }

    return null;
  }, [
    gameId,
    levelId,
    levelNumber,
    isOptimal,
    tryRandomUnlock,
    checkLegendaryUnlocks,
    getAllCategoryStats,
  ]);

  const dismissUnlockAnimation = useCallback(() => {
    setShowUnlockAnimation(false);
    setPendingUnlockCard(null);
  }, [setPendingUnlockCard]);

  return {
    unlockedCard,
    showUnlockAnimation,
    checkAndUnlockCard,
    dismissUnlockAnimation,
  };
}

export default useCardUnlock;
