/**
 * Collectible Cards System
 * 20 animal cards with different rarity levels unlocked through gameplay
 */

export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface UnlockCondition {
  type: 'performance' | 'level' | 'attempts';
  minStars?: number; // 0-3 stars for performance-based
  levelId?: string; // Specific level required
  minAttempts?: number; // Minimum number of game completions
}

export interface CollectibleCard {
  id: string;
  emoji: string;
  name: string;
  trait: string;
  traitEmoji: string;
  rarity: CardRarity;
  unlockCondition: UnlockCondition;
}

/**
 * Complete card database (20 cards)
 * - 8 Common: Awarded for completing specific levels or attempts
 * - 7 Rare: Awarded for 2+ stars performance
 * - 4 Epic: Awarded for 3 stars performance
 * - 1 Legendary: Awarded for perfect performance (3 stars + 0 hints)
 */
export const COLLECTIBLE_CARDS: CollectibleCard[] = [
  // ===== COMMON CARDS (8) =====
  {
    id: 'card_rabbit',
    emoji: '🐰',
    name: 'Léa le Lapin',
    trait: 'Rapide',
    traitEmoji: '⚡',
    rarity: 'common',
    unlockCondition: { type: 'level', levelId: 'level_1' },
  },
  {
    id: 'card_turtle',
    emoji: '🐢',
    name: 'Tom la Tortue',
    trait: 'Patient',
    traitEmoji: '🕐',
    rarity: 'common',
    unlockCondition: { type: 'level', levelId: 'level_2' },
  },
  {
    id: 'card_cat',
    emoji: '🐱',
    name: 'Mia le Chat',
    trait: 'Curieux',
    traitEmoji: '🔍',
    rarity: 'common',
    unlockCondition: { type: 'level', levelId: 'level_3' },
  },
  {
    id: 'card_dog',
    emoji: '🐶',
    name: 'Max le Chien',
    trait: 'Fidèle',
    traitEmoji: '💛',
    rarity: 'common',
    unlockCondition: { type: 'level', levelId: 'level_4' },
  },
  {
    id: 'card_bear',
    emoji: '🐻',
    name: "Bruno l'Ours",
    trait: 'Fort',
    traitEmoji: '💪',
    rarity: 'common',
    unlockCondition: { type: 'level', levelId: 'level_5' },
  },
  {
    id: 'card_panda',
    emoji: '🐼',
    name: 'Lily le Panda',
    trait: 'Zen',
    traitEmoji: '☮️',
    rarity: 'common',
    unlockCondition: { type: 'attempts', minAttempts: 3 },
  },
  {
    id: 'card_koala',
    emoji: '🐨',
    name: 'Koki le Koala',
    trait: 'Calme',
    traitEmoji: '😌',
    rarity: 'common',
    unlockCondition: { type: 'attempts', minAttempts: 5 },
  },
  {
    id: 'card_hamster',
    emoji: '🐹',
    name: 'Hugo le Hamster',
    trait: 'Actif',
    traitEmoji: '🏃',
    rarity: 'common',
    unlockCondition: { type: 'attempts', minAttempts: 10 },
  },

  // ===== RARE CARDS (7) =====
  {
    id: 'card_fox',
    emoji: '🦊',
    name: 'Félix le Renard',
    trait: 'Rusé',
    traitEmoji: '🎯',
    rarity: 'rare',
    unlockCondition: { type: 'performance', minStars: 2 },
  },
  {
    id: 'card_owl',
    emoji: '🦉',
    name: 'Olivia la Chouette',
    trait: 'Sage',
    traitEmoji: '📚',
    rarity: 'rare',
    unlockCondition: { type: 'performance', minStars: 2, levelId: 'level_4' },
  },
  {
    id: 'card_lion',
    emoji: '🦁',
    name: 'Léo le Lion',
    trait: 'Courageux',
    traitEmoji: '🛡️',
    rarity: 'rare',
    unlockCondition: { type: 'performance', minStars: 2, levelId: 'level_5' },
  },
  {
    id: 'card_monkey',
    emoji: '🐵',
    name: 'Milo le Singe',
    trait: 'Malin',
    traitEmoji: '🧩',
    rarity: 'rare',
    unlockCondition: { type: 'performance', minStars: 2, levelId: 'level_3' },
  },
  {
    id: 'card_penguin',
    emoji: '🐧',
    name: 'Pablo le Pingouin',
    trait: 'Élégant',
    traitEmoji: '🎩',
    rarity: 'rare',
    unlockCondition: { type: 'performance', minStars: 2, levelId: 'level_2' },
  },
  {
    id: 'card_elephant',
    emoji: '🐘',
    name: "Élie l'Éléphant",
    trait: 'Mémoire',
    traitEmoji: '🧠',
    rarity: 'rare',
    unlockCondition: { type: 'performance', minStars: 2 },
  },
  {
    id: 'card_dolphin',
    emoji: '🐬',
    name: 'Dali le Dauphin',
    trait: 'Intelligent',
    traitEmoji: '💡',
    rarity: 'rare',
    unlockCondition: { type: 'performance', minStars: 2 },
  },

  // ===== EPIC CARDS (4) =====
  {
    id: 'card_dragon',
    emoji: '🐉',
    name: 'Drago le Dragon',
    trait: 'Légendaire',
    traitEmoji: '✨',
    rarity: 'epic',
    unlockCondition: { type: 'performance', minStars: 3 },
  },
  {
    id: 'card_unicorn',
    emoji: '🦄',
    name: 'Luna la Licorne',
    trait: 'Magique',
    traitEmoji: '🌟',
    rarity: 'epic',
    unlockCondition: { type: 'performance', minStars: 3, levelId: 'level_4' },
  },
  {
    id: 'card_phoenix',
    emoji: '🦅',
    name: 'Phénix le Faucon',
    trait: 'Persévérant',
    traitEmoji: '🔥',
    rarity: 'epic',
    unlockCondition: { type: 'performance', minStars: 3, levelId: 'level_5' },
  },
  {
    id: 'card_tiger',
    emoji: '🐯',
    name: 'Tigrou le Tigre',
    trait: 'Stratège',
    traitEmoji: '♟️',
    rarity: 'epic',
    unlockCondition: { type: 'performance', minStars: 3, levelId: 'level_3' },
  },

  // ===== LEGENDARY CARD (1) =====
  {
    id: 'card_master',
    emoji: '👑',
    name: 'Le Maître',
    trait: 'Parfait',
    traitEmoji: '🏆',
    rarity: 'legendary',
    unlockCondition: { type: 'performance', minStars: 3, levelId: 'level_5' },
  },
];

/**
 * Rarity display configuration
 */
export const RARITY_CONFIG: Record<
  CardRarity,
  { color: string; label: string; gradient: [string, string] }
> = {
  common: {
    color: '#9CA3AF',
    label: 'Commun',
    gradient: ['#9CA3AF', '#6B7280'],
  },
  rare: {
    color: '#5B8DEE',
    label: 'Rare',
    gradient: ['#5B8DEE', '#3498DB'],
  },
  epic: {
    color: '#9B59B6',
    label: 'Épique',
    gradient: ['#E056FD', '#9B59B6'],
  },
  legendary: {
    color: '#FFD700',
    label: 'Légendaire',
    gradient: ['#FFD93D', '#F39C12'],
  },
};

/**
 * Get card by ID
 */
export function getCardById(cardId: string): CollectibleCard | undefined {
  return COLLECTIBLE_CARDS.find((card) => card.id === cardId);
}

/**
 * Get all cards of a specific rarity
 */
export function getCardsByRarity(rarity: CardRarity): CollectibleCard[] {
  return COLLECTIBLE_CARDS.filter((card) => card.rarity === rarity);
}

/**
 * Get total card count
 */
export function getTotalCardCount(): number {
  return COLLECTIBLE_CARDS.length;
}
