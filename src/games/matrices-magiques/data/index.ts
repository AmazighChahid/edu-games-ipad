/**
 * Data exports for Matrices Magiques
 */

// Worlds
export {
  WORLDS,
  WORLDS_ARRAY,
  WORLD_ORDER,
  FOREST_WORLD,
  SPACE_WORLD,
  CASTLE_WORLD,
  ART_WORLD,
  MYSTERY_WORLD,
  getWorldById,
  getNextWorld,
  isWorldUnlocked,
  getWorldColors,
} from './worlds';

// Shapes
export {
  BASIC_SHAPES,
  FOREST_SHAPES,
  SPACE_SHAPES,
  CASTLE_SHAPES,
  ART_SHAPES,
  MYSTERY_SHAPES,
  SHAPE_METADATA,
  COLOR_SEQUENCES,
  COLOR_PATTERNS,
  getRandomColorSequence,
  getNextColor,
  getColorHex,
  getPatternForColor,
} from './shapes';
export type { ShapeMetadata, PatternType } from './shapes';

// Dialogues
export {
  PIXEL_DIALOGUES,
  INTRO_DIALOGUES,
  PUZZLE_START_DIALOGUES,
  HINT_DIALOGUES,
  CORRECT_DIALOGUES,
  INCORRECT_DIALOGUES,
  REVEAL_DIALOGUES,
  WORLD_COMPLETE_DIALOGUES,
  BADGE_EARNED_DIALOGUES,
  CARD_UNLOCKED_DIALOGUES,
  ENCOURAGEMENT_DIALOGUES,
  getRandomDialogue,
  getDialogueForContext,
} from './pixelDialogues';
export type { DialogueEntry } from './pixelDialogues';

// Badges
export {
  BADGES,
  getBadgeById,
  checkBadgeEarned,
  getNewlyEarnedBadges,
  getBadgeDisplayData,
} from './badges';
export type { BadgeCheckParams, BadgeDisplay } from './badges';

// Collectible Cards
export {
  COLLECTIBLE_CARDS,
  getCardById,
  getCardsForWorld,
  getCardsByRarity,
  canUnlockCard,
  getUnlockableCards,
  getCollectionProgress,
  RARITY_COLORS,
  RARITY_NAMES,
} from './collectibleCards';
export type { CardUnlockParams, CollectionProgress } from './collectibleCards';
