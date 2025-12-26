/**
 * Collectible cards for Matrices Magiques
 * Cards are unlocked by completing worlds with good performance
 */

import { CollectibleCard, CardRarity, WorldTheme, BadgeType } from '../types';

/** All collectible cards */
export const COLLECTIBLE_CARDS: CollectibleCard[] = [
  // ============================================================================
  // FOREST CARDS
  // ============================================================================
  {
    id: 'forest_fox',
    name: 'Renard Curieux',
    nameKey: 'cards.forest.fox.name',
    description: 'Le renard qui observe tout',
    descriptionKey: 'cards.forest.fox.description',
    emoji: '🦊',
    rarity: 'common',
    trait: 'Observateur',
    traitKey: 'cards.forest.fox.trait',
    traitIcon: '👀',
    worldId: 'forest',
    unlockCondition: {
      type: 'world_complete',
      worldId: 'forest',
    },
  },
  {
    id: 'forest_owl',
    name: 'Hibou Sage',
    nameKey: 'cards.forest.owl.name',
    description: 'Le hibou qui connaît tous les secrets',
    descriptionKey: 'cards.forest.owl.description',
    emoji: '🦉',
    rarity: 'rare',
    trait: 'Sage',
    traitKey: 'cards.forest.owl.trait',
    traitIcon: '📚',
    worldId: 'forest',
    unlockCondition: {
      type: 'world_perfect',
      worldId: 'forest',
      starsRequired: 3,
    },
  },
  {
    id: 'forest_butterfly',
    name: 'Papillon Magique',
    nameKey: 'cards.forest.butterfly.name',
    description: 'Un papillon aux ailes pleines de patterns',
    descriptionKey: 'cards.forest.butterfly.description',
    emoji: '🦋',
    rarity: 'epic',
    trait: 'Maître des Patterns',
    traitKey: 'cards.forest.butterfly.trait',
    traitIcon: '✨',
    worldId: 'forest',
    unlockCondition: {
      type: 'badge_earned',
      badgeId: 'no_hints_hero',
    },
  },

  // ============================================================================
  // SPACE CARDS
  // ============================================================================
  {
    id: 'space_robot',
    name: 'Robot Explorateur',
    nameKey: 'cards.space.robot.name',
    description: 'Un robot qui analyse les étoiles',
    descriptionKey: 'cards.space.robot.description',
    emoji: '🤖',
    rarity: 'common',
    trait: 'Analytique',
    traitKey: 'cards.space.robot.trait',
    traitIcon: '🔬',
    worldId: 'space',
    unlockCondition: {
      type: 'world_complete',
      worldId: 'space',
    },
  },
  {
    id: 'space_alien',
    name: 'Alien Amical',
    nameKey: 'cards.space.alien.name',
    description: 'Un extraterrestre qui aime les puzzles',
    descriptionKey: 'cards.space.alien.description',
    emoji: '👽',
    rarity: 'rare',
    trait: 'Logique Cosmique',
    traitKey: 'cards.space.alien.trait',
    traitIcon: '🌌',
    worldId: 'space',
    unlockCondition: {
      type: 'world_perfect',
      worldId: 'space',
      starsRequired: 3,
    },
  },
  {
    id: 'space_astronaut',
    name: 'Astronaute Champion',
    nameKey: 'cards.space.astronaut.name',
    description: 'Le meilleur astronaute de la galaxie',
    descriptionKey: 'cards.space.astronaut.description',
    emoji: '🧑‍🚀',
    rarity: 'epic',
    trait: 'Expert Spatial',
    traitKey: 'cards.space.astronaut.trait',
    traitIcon: '🚀',
    worldId: 'space',
    unlockCondition: {
      type: 'badge_earned',
      badgeId: 'rotation_expert',
    },
  },

  // ============================================================================
  // CASTLE CARDS
  // ============================================================================
  {
    id: 'castle_knight',
    name: 'Chevalier Courageux',
    nameKey: 'cards.castle.knight.name',
    description: 'Un chevalier qui ne recule jamais',
    descriptionKey: 'cards.castle.knight.description',
    emoji: '🤺',
    rarity: 'common',
    trait: 'Persévérant',
    traitKey: 'cards.castle.knight.trait',
    traitIcon: '⚔️',
    worldId: 'castle',
    unlockCondition: {
      type: 'world_complete',
      worldId: 'castle',
    },
  },
  {
    id: 'castle_wizard',
    name: 'Sorcier Mystérieux',
    nameKey: 'cards.castle.wizard.name',
    description: 'Un mage qui voit au-delà des apparences',
    descriptionKey: 'cards.castle.wizard.description',
    emoji: '🧙',
    rarity: 'rare',
    trait: 'Vision Magique',
    traitKey: 'cards.castle.wizard.trait',
    traitIcon: '🔮',
    worldId: 'castle',
    unlockCondition: {
      type: 'world_perfect',
      worldId: 'castle',
      starsRequired: 3,
    },
  },
  {
    id: 'castle_dragon',
    name: 'Dragon Royal',
    nameKey: 'cards.castle.dragon.name',
    description: 'Le gardien ultime du château',
    descriptionKey: 'cards.castle.dragon.description',
    emoji: '🐉',
    rarity: 'legendary',
    trait: 'Gardien Suprême',
    traitKey: 'cards.castle.dragon.trait',
    traitIcon: '👑',
    worldId: 'castle',
    unlockCondition: {
      type: 'badge_earned',
      badgeId: 'world_conqueror',
    },
  },

  // ============================================================================
  // ART CARDS
  // ============================================================================
  {
    id: 'art_painter',
    name: 'Peintre Créatif',
    nameKey: 'cards.art.painter.name',
    description: 'Un artiste qui voit les patterns partout',
    descriptionKey: 'cards.art.painter.description',
    emoji: '👨‍🎨',
    rarity: 'common',
    trait: 'Créatif',
    traitKey: 'cards.art.painter.trait',
    traitIcon: '🎨',
    worldId: 'art',
    unlockCondition: {
      type: 'world_complete',
      worldId: 'art',
    },
  },
  {
    id: 'art_sculptor',
    name: 'Sculpteur Génie',
    nameKey: 'cards.art.sculptor.name',
    description: 'Il transforme les formes comme personne',
    descriptionKey: 'cards.art.sculptor.description',
    emoji: '🗿',
    rarity: 'rare',
    trait: 'Transformateur',
    traitKey: 'cards.art.sculptor.trait',
    traitIcon: '🔄',
    worldId: 'art',
    unlockCondition: {
      type: 'world_perfect',
      worldId: 'art',
      starsRequired: 3,
    },
  },
  {
    id: 'art_muse',
    name: 'Muse Inspirante',
    nameKey: 'cards.art.muse.name',
    description: 'L\'inspiration incarnée',
    descriptionKey: 'cards.art.muse.description',
    emoji: '🧚',
    rarity: 'epic',
    trait: 'Source d\'Inspiration',
    traitKey: 'cards.art.muse.trait',
    traitIcon: '💫',
    worldId: 'art',
    unlockCondition: {
      type: 'badge_earned',
      badgeId: 'color_master',
    },
  },

  // ============================================================================
  // MYSTERY CARDS
  // ============================================================================
  {
    id: 'mystery_detective',
    name: 'Pixel le Détective',
    nameKey: 'cards.mystery.pixel.name',
    description: 'Le renard qui résout tous les mystères',
    descriptionKey: 'cards.mystery.pixel.description',
    emoji: '🦊',
    rarity: 'epic',
    trait: 'Maître des Patterns',
    traitKey: 'cards.mystery.pixel.trait',
    traitIcon: '🔍',
    worldId: 'mystery',
    unlockCondition: {
      type: 'world_complete',
      worldId: 'mystery',
    },
  },
  {
    id: 'mystery_oracle',
    name: 'Oracle du Temps',
    nameKey: 'cards.mystery.oracle.name',
    description: 'Il voit le passé et le futur',
    descriptionKey: 'cards.mystery.oracle.description',
    emoji: '🔮',
    rarity: 'legendary',
    trait: 'Vision Temporelle',
    traitKey: 'cards.mystery.oracle.trait',
    traitIcon: '⏳',
    worldId: 'mystery',
    unlockCondition: {
      type: 'world_perfect',
      worldId: 'mystery',
      starsRequired: 3,
    },
  },
  {
    id: 'mystery_phoenix',
    name: 'Phénix Ultime',
    nameKey: 'cards.mystery.phoenix.name',
    description: 'La carte la plus rare. Tu es un GÉNIE !',
    descriptionKey: 'cards.mystery.phoenix.description',
    emoji: '🦅',
    rarity: 'legendary',
    trait: 'Génie Absolu',
    traitKey: 'cards.mystery.phoenix.trait',
    traitIcon: '🧠',
    worldId: 'mystery',
    unlockCondition: {
      type: 'badge_earned',
      badgeId: 'ultimate_genius',
    },
  },
];

/** Get card by ID */
export function getCardById(id: string): CollectibleCard | undefined {
  return COLLECTIBLE_CARDS.find((c) => c.id === id);
}

/** Get cards for a specific world */
export function getCardsForWorld(worldId: WorldTheme): CollectibleCard[] {
  return COLLECTIBLE_CARDS.filter((c) => c.worldId === worldId);
}

/** Get cards by rarity */
export function getCardsByRarity(rarity: CardRarity): CollectibleCard[] {
  return COLLECTIBLE_CARDS.filter((c) => c.rarity === rarity);
}

/** Check if card can be unlocked */
export interface CardUnlockParams {
  completedWorlds: WorldTheme[];
  worldStars: Record<WorldTheme, number>;
  earnedBadges: BadgeType[];
}

export function canUnlockCard(
  card: CollectibleCard,
  params: CardUnlockParams
): boolean {
  const { type, worldId, starsRequired, badgeId } = card.unlockCondition;

  switch (type) {
    case 'world_complete':
      return worldId ? params.completedWorlds.includes(worldId) : false;

    case 'world_perfect':
      if (!worldId) return false;
      const stars = params.worldStars[worldId] || 0;
      return stars >= (starsRequired || 3);

    case 'badge_earned':
      return badgeId ? params.earnedBadges.includes(badgeId) : false;

    default:
      return false;
  }
}

/** Get all unlockable cards based on current progress */
export function getUnlockableCards(
  unlockedCardIds: string[],
  params: CardUnlockParams
): CollectibleCard[] {
  return COLLECTIBLE_CARDS.filter((card) => {
    // Already unlocked
    if (unlockedCardIds.includes(card.id)) return false;
    // Check if can be unlocked now
    return canUnlockCard(card, params);
  });
}

/** Get collection progress */
export interface CollectionProgress {
  total: number;
  unlocked: number;
  byRarity: Record<CardRarity, { total: number; unlocked: number }>;
  byWorld: Record<WorldTheme, { total: number; unlocked: number }>;
}

export function getCollectionProgress(
  unlockedCardIds: string[]
): CollectionProgress {
  const progress: CollectionProgress = {
    total: COLLECTIBLE_CARDS.length,
    unlocked: unlockedCardIds.length,
    byRarity: {
      common: { total: 0, unlocked: 0 },
      rare: { total: 0, unlocked: 0 },
      epic: { total: 0, unlocked: 0 },
      legendary: { total: 0, unlocked: 0 },
    },
    byWorld: {
      forest: { total: 0, unlocked: 0 },
      space: { total: 0, unlocked: 0 },
      castle: { total: 0, unlocked: 0 },
      art: { total: 0, unlocked: 0 },
      mystery: { total: 0, unlocked: 0 },
    },
  };

  for (const card of COLLECTIBLE_CARDS) {
    progress.byRarity[card.rarity].total++;
    progress.byWorld[card.worldId].total++;

    if (unlockedCardIds.includes(card.id)) {
      progress.byRarity[card.rarity].unlocked++;
      progress.byWorld[card.worldId].unlocked++;
    }
  }

  return progress;
}

/** Get rarity color gradient */
export const RARITY_COLORS: Record<CardRarity, [string, string]> = {
  common: ['#A0A0A0', '#808080'],
  rare: ['#E056FD', '#9B59B6'],
  epic: ['#5B8DEE', '#3498DB'],
  legendary: ['#FFD93D', '#F39C12'],
};

/** Get rarity display name */
export const RARITY_NAMES: Record<CardRarity, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};
