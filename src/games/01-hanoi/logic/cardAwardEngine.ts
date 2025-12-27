/**
 * Card Award Engine
 * Determines which collectible card to award based on performance
 */

import {
  COLLECTIBLE_CARDS,
  type CollectibleCard,
  type CardRarity,
} from '../data/collectibleCards';

/**
 * Calculate star rating based on move efficiency
 * @param moves - Number of moves made
 * @param optimalMoves - Optimal solution move count
 * @returns Star rating (0-3)
 */
export function getStars(moves: number, optimalMoves: number): number {
  const efficiency = moves / optimalMoves;
  if (efficiency <= 1.0) return 3; // Perfect
  if (efficiency <= 1.3) return 3; // Excellent
  if (efficiency <= 1.5) return 2; // Good
  if (efficiency <= 2.0) return 1; // Completed
  return 0; // Many attempts
}

/**
 * Check if performance qualifies for perfect achievement
 * @param moves - Number of moves made
 * @param optimalMoves - Optimal solution move count
 * @param hintsUsed - Number of hints used
 * @returns true if perfect (optimal moves + no hints)
 */
export function isPerfectRun(
  moves: number,
  optimalMoves: number,
  hintsUsed: number
): boolean {
  return moves === optimalMoves && hintsUsed === 0;
}

/**
 * Determine which collectible card to award based on performance
 * Priority: legendary > epic > rare > common
 * Filters out already unlocked cards
 *
 * @param levelId - ID of the completed level
 * @param stars - Star rating (0-3)
 * @param hintsUsed - Number of hints used
 * @param unlockedCards - Array of already unlocked card IDs
 * @param totalCompletions - Total number of game completions (for attempt-based cards)
 * @returns Collectible card to award, or null if no eligible cards
 */
export function determineAwardedCard(
  levelId: string,
  stars: number,
  hintsUsed: number,
  unlockedCards: string[],
  totalCompletions: number = 0
): CollectibleCard | null {
  // Filter eligible cards
  const eligibleCards = COLLECTIBLE_CARDS.filter((card) => {
    // Skip already unlocked cards
    if (unlockedCards.includes(card.id)) {
      return false;
    }

    const { type, minStars, levelId: reqLevelId, minAttempts } =
      card.unlockCondition;

    // Performance-based unlock
    if (type === 'performance') {
      // Check star requirement
      if (minStars && stars < minStars) {
        return false;
      }

      // Check level-specific requirement
      if (reqLevelId && reqLevelId !== levelId) {
        return false;
      }

      // Legendary cards require perfect run (3 stars + no hints)
      if (card.rarity === 'legendary') {
        if (hintsUsed > 0 || stars !== 3) {
          return false;
        }
        // Also require level 5 completion
        if (reqLevelId && reqLevelId !== levelId) {
          return false;
        }
      }

      return true;
    }

    // Level-specific unlock (common cards)
    if (type === 'level') {
      return reqLevelId === levelId;
    }

    // Attempts-based unlock
    if (type === 'attempts') {
      return minAttempts !== undefined && totalCompletions >= minAttempts;
    }

    return false;
  });

  if (eligibleCards.length === 0) {
    return null;
  }

  // Priority order for rarity
  const rarityOrder: Record<CardRarity, number> = {
    legendary: 4,
    epic: 3,
    rare: 2,
    common: 1,
  };

  // Sort by rarity priority (highest first)
  const sortedCards = eligibleCards.sort(
    (a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]
  );

  // Return highest rarity eligible card
  return sortedCards[0];
}

/**
 * Get a motivational message based on the awarded card rarity
 * @param card - Awarded collectible card (or null)
 * @param stars - Star rating
 * @param isPerfect - Whether the run was perfect
 * @returns Motivational message string
 */
export function getVictoryMessage(
  card: CollectibleCard | null,
  stars: number,
  isPerfect: boolean
): string {
  if (!card) {
    return 'Bravo ! Continue de jouer pour débloquer plus de cartes !';
  }

  if (card.rarity === 'legendary') {
    return `Incroyable ! Tu as débloqué ${card.name}, la carte la plus rare !`;
  }

  if (card.rarity === 'epic' && isPerfect) {
    return `Parfait ! Tu as débloqué ${card.name}, une carte épique !`;
  }

  if (card.rarity === 'epic') {
    return `Excellent ! Tu as débloqué ${card.name} !`;
  }

  if (card.rarity === 'rare' && stars === 3) {
    return `Super ! Tu as débloqué ${card.name} !`;
  }

  if (card.rarity === 'rare') {
    return `Bien joué ! Tu as débloqué ${card.name} !`;
  }

  // Common cards
  return `Bravo ! Tu as débloqué ${card.name} !`;
}

/**
 * Get mascot speech bubble message
 * @param isPerfect - Whether the run was perfect
 * @param stars - Star rating
 * @param cardRarity - Rarity of awarded card (or null)
 * @returns Mascot message string
 */
export function getMascotMessage(
  isPerfect: boolean,
  stars: number,
  cardRarity: CardRarity | null
): string {
  if (isPerfect && cardRarity === 'legendary') {
    return 'INCROYABLE ! Solution parfaite ! 🏆';
  }

  if (isPerfect) {
    return 'Parfait ! Aucune erreur ! 🌟';
  }

  if (stars === 3 && cardRarity === 'epic') {
    return 'Excellent travail ! 🎉';
  }

  if (stars === 3) {
    return 'Super ! Tu maîtrises bien ! ⭐';
  }

  if (stars === 2) {
    return 'Très bien ! Continue comme ça ! 💪';
  }

  return 'Bravo ! Tu progresses ! 🎊';
}
