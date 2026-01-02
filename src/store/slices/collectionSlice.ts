/**
 * Collection Slice
 * Extended card collection management with dates, progression, and unlock logic
 */

import { StateCreator } from 'zustand';
import {
  Card,
  CardCategory,
  CardRarity,
  ALL_CARDS,
  getCardById,
  getRandomCardFromPool,
  getCategoryProgress,
  RARITY_CONFIG,
  shouldUnlockCard,
  getLegendaryCards,
} from '../../data/cards';

// ============================================
// TYPES
// ============================================

export interface UnlockedCardData {
  cardId: string;
  unlockedAt: number; // timestamp
  seenInCollection: boolean; // has user viewed it in collection
  unlockedFrom: {
    gameId: string;
    levelId?: string;
    source: 'level_complete' | 'streak' | 'collection_milestone' | 'random_drop';
  };
}

export interface CollectionState {
  // Extended card data
  collectionData: Record<string, UnlockedCardData>;

  // Cards marked as "NEW!" (not yet seen in collection)
  newCardIds: string[];

  // Currently unlocking card (for animation screen)
  pendingUnlockCard: string | null;

  // Last random drop timestamp (to prevent spam)
  lastRandomDropAt: number | null;

  // Favorite cards
  favoriteCardIds: string[];
}

export interface CollectionActions {
  // Unlock a specific card
  unlockCard: (
    cardId: string,
    source: UnlockedCardData['unlockedFrom']
  ) => boolean;

  // Try to unlock a random card from pool
  tryRandomUnlock: (
    gameId: string,
    levelId: string,
    levelNumber: number
  ) => Card | null;

  // Check and unlock fixed legendary cards
  checkLegendaryUnlocks: (params: {
    gameId: string;
    levelNumber: number;
    isOptimal?: boolean;
    streakDays?: number;
    categoryCompletion?: Record<CardCategory, number>;
  }) => Card[];

  // Mark card as seen (removes NEW! badge)
  markCardAsSeen: (cardId: string) => void;

  // Mark all cards as seen
  markAllCardsSeen: () => void;

  // Set pending unlock for animation
  setPendingUnlockCard: (cardId: string | null) => void;

  // Toggle favorite
  toggleFavorite: (cardId: string) => void;

  // Getters
  isCardUnlocked: (cardId: string) => boolean;
  isCardNew: (cardId: string) => boolean;
  isCardFavorite: (cardId: string) => boolean;
  getUnlockedCards: () => Card[];
  getUnlockedCardsCount: () => number;
  getUnlockedCardData: (cardId: string) => UnlockedCardData | undefined;
  getCategoryStats: (category: CardCategory) => {
    unlocked: number;
    total: number;
    percentage: number;
  };
  getAllCategoryStats: () => Record<CardCategory, {
    unlocked: number;
    total: number;
    percentage: number;
  }>;
  getRarityStats: () => Record<CardRarity, {
    unlocked: number;
    total: number;
  }>;
  getCollectionPercentage: () => number;
  getNewCardsCount: () => number;
}

export type CollectionSlice = CollectionState & CollectionActions;

// ============================================
// INITIAL STATE
// ============================================

export const initialCollectionState: CollectionState = {
  collectionData: {},
  newCardIds: [],
  pendingUnlockCard: null,
  lastRandomDropAt: null,
  favoriteCardIds: [],
};

// ============================================
// CONSTANTS
// ============================================

// Minimum time between random drops (30 seconds)
const MIN_RANDOM_DROP_INTERVAL = 30 * 1000;

// Base chance for random drop per level complete
const BASE_RANDOM_DROP_CHANCE = 0.25; // 25%

// ============================================
// SLICE CREATOR
// ============================================

export const createCollectionSlice: StateCreator<
  CollectionSlice,
  [],
  [],
  CollectionSlice
> = (set, get) => ({
  ...initialCollectionState,

  // ========== ACTIONS ==========

  unlockCard: (cardId, source) => {
    const state = get();

    // Already unlocked
    if (state.collectionData[cardId]) {
      return false;
    }

    // Verify card exists
    const card = getCardById(cardId);
    if (!card) {
      console.warn(`[Collection] Card not found: ${cardId}`);
      return false;
    }

    const unlockData: UnlockedCardData = {
      cardId,
      unlockedAt: Date.now(),
      seenInCollection: false,
      unlockedFrom: source,
    };

    set({
      collectionData: {
        ...state.collectionData,
        [cardId]: unlockData,
      },
      newCardIds: [...state.newCardIds, cardId],
      pendingUnlockCard: cardId,
    });

    if (__DEV__) console.log(`[Collection] Card unlocked: ${card.name} (${card.rarity})`);
    return true;
  },

  tryRandomUnlock: (gameId, levelId, levelNumber) => {
    const state = get();
    const now = Date.now();

    // Check cooldown
    if (
      state.lastRandomDropAt &&
      now - state.lastRandomDropAt < MIN_RANDOM_DROP_INTERVAL
    ) {
      return null;
    }

    // Roll for drop chance (increases with level)
    const dropChance = Math.min(BASE_RANDOM_DROP_CHANCE + levelNumber * 0.02, 0.5);
    if (Math.random() > dropChance) {
      return null;
    }

    // Get unlocked card IDs
    const unlockedIds = Object.keys(state.collectionData);

    // Try to get a random card
    const card = getRandomCardFromPool(unlockedIds, levelNumber);
    if (!card) {
      return null;
    }

    // Unlock it
    const unlocked = get().unlockCard(card.id, {
      gameId,
      levelId,
      source: 'random_drop',
    });

    if (unlocked) {
      set({ lastRandomDropAt: now });
      return card;
    }

    return null;
  },

  checkLegendaryUnlocks: (params) => {
    const { gameId, levelNumber, isOptimal, streakDays, categoryCompletion } = params;
    const state = get();
    const unlockedCards: Card[] = [];

    // Get all legendary cards with fixed unlock conditions
    const legendaryCards = getLegendaryCards();

    for (const card of legendaryCards) {
      // Skip if already unlocked
      if (state.collectionData[card.id]) continue;

      // Check if conditions are met
      const shouldUnlock = shouldUnlockCard(card, gameId, levelNumber, {
        isOptimal,
        streakDays,
        categoryCompletion: categoryCompletion
          ? Math.min(...Object.values(categoryCompletion))
          : undefined,
      });

      if (shouldUnlock) {
        const unlocked = get().unlockCard(card.id, {
          gameId,
          source: 'level_complete',
        });
        if (unlocked) {
          unlockedCards.push(card);
        }
      }
    }

    // Check streak unlock (Stella)
    if (streakDays && streakDays >= 7) {
      const stellaCard = ALL_CARDS.find((c) => c.id === 'card_stella_star');
      if (stellaCard && !state.collectionData[stellaCard.id]) {
        const unlocked = get().unlockCard(stellaCard.id, {
          gameId: 'streak',
          source: 'streak',
        });
        if (unlocked) {
          unlockedCards.push(stellaCard);
        }
      }
    }

    // Check collection milestone unlock (Flora)
    if (categoryCompletion) {
      const completedCategories = Object.values(categoryCompletion).filter(
        (p) => p >= 100
      );
      if (completedCategories.length > 0) {
        const floraCard = ALL_CARDS.find((c) => c.id === 'card_flora_guardian');
        if (floraCard && !state.collectionData[floraCard.id]) {
          const unlocked = get().unlockCard(floraCard.id, {
            gameId: 'collection',
            source: 'collection_milestone',
          });
          if (unlocked) {
            unlockedCards.push(floraCard);
          }
        }
      }
    }

    return unlockedCards;
  },

  markCardAsSeen: (cardId) => {
    set((state) => {
      const cardData = state.collectionData[cardId];
      if (!cardData) return state;

      return {
        collectionData: {
          ...state.collectionData,
          [cardId]: {
            ...cardData,
            seenInCollection: true,
          },
        },
        newCardIds: state.newCardIds.filter((id) => id !== cardId),
      };
    });
  },

  markAllCardsSeen: () => {
    set((state) => {
      const updatedData = { ...state.collectionData };
      for (const cardId of state.newCardIds) {
        if (updatedData[cardId]) {
          updatedData[cardId] = {
            ...updatedData[cardId],
            seenInCollection: true,
          };
        }
      }
      return {
        collectionData: updatedData,
        newCardIds: [],
      };
    });
  },

  setPendingUnlockCard: (cardId) => {
    set({ pendingUnlockCard: cardId });
  },

  toggleFavorite: (cardId) => {
    set((state) => {
      const isFavorite = state.favoriteCardIds.includes(cardId);
      return {
        favoriteCardIds: isFavorite
          ? state.favoriteCardIds.filter((id) => id !== cardId)
          : [...state.favoriteCardIds, cardId],
      };
    });
  },

  // ========== GETTERS ==========

  isCardUnlocked: (cardId) => {
    return !!get().collectionData[cardId];
  },

  isCardNew: (cardId) => {
    return get().newCardIds.includes(cardId);
  },

  isCardFavorite: (cardId) => {
    return get().favoriteCardIds.includes(cardId);
  },

  getUnlockedCards: () => {
    const unlockedIds = Object.keys(get().collectionData);
    return ALL_CARDS.filter((card) => unlockedIds.includes(card.id));
  },

  getUnlockedCardsCount: () => {
    return Object.keys(get().collectionData).length;
  },

  getUnlockedCardData: (cardId) => {
    return get().collectionData[cardId];
  },

  getCategoryStats: (category) => {
    const unlockedIds = Object.keys(get().collectionData);
    return getCategoryProgress(category, unlockedIds);
  },

  getAllCategoryStats: () => {
    const unlockedIds = Object.keys(get().collectionData);
    return {
      animals: getCategoryProgress('animals', unlockedIds),
      robots: getCategoryProgress('robots', unlockedIds),
      nature: getCategoryProgress('nature', unlockedIds),
      stars: getCategoryProgress('stars', unlockedIds),
    };
  },

  getRarityStats: () => {
    const unlockedIds = Object.keys(get().collectionData);
    const unlockedCards = ALL_CARDS.filter((c) => unlockedIds.includes(c.id));

    const stats: Record<CardRarity, { unlocked: number; total: number }> = {
      common: { unlocked: 0, total: 0 },
      rare: { unlocked: 0, total: 0 },
      epic: { unlocked: 0, total: 0 },
      legendary: { unlocked: 0, total: 0 },
    };

    for (const card of ALL_CARDS) {
      stats[card.rarity].total++;
      if (unlockedIds.includes(card.id)) {
        stats[card.rarity].unlocked++;
      }
    }

    return stats;
  },

  getCollectionPercentage: () => {
    const unlocked = Object.keys(get().collectionData).length;
    return Math.round((unlocked / ALL_CARDS.length) * 100);
  },

  getNewCardsCount: () => {
    return get().newCardIds.length;
  },
});
