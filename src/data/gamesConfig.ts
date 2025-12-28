/**
 * Games Configuration for Home Screen V9
 * Maps games to categories with visual properties
 */

import { GameCategoryV9, GameV9, GameColor, MedalType } from '../types/home.types';

// ============ GAME DEFINITIONS ============

export interface GameDefinition {
  id: string;
  name: string;
  icon: string;
  color: GameColor;
  categoryId: string;
  badge?: 'new' | 'hot' | 'soon';
  isLocked?: boolean;
}

export const GAMES_DEFINITIONS: GameDefinition[] = [
  // Logique
  {
    id: 'hanoi',
    name: 'Tour Magique',
    icon: '🏰',
    color: 'blue',
    categoryId: 'logic',
  },
  {
    id: 'suites-logiques',
    name: 'Suite Magique',
    icon: '🎲',
    color: 'indigo',
    categoryId: 'logic',
  },
  {
    id: 'logix-grid',
    name: 'Logix Grid',
    icon: '🧩',
    color: 'teal',
    categoryId: 'logic',
    badge: 'new',
  },

  // Chiffres
  {
    id: 'math-blocks',
    name: 'Chiffres Rigolos',
    icon: '🔢',
    color: 'green',
    categoryId: 'numbers',
    badge: 'hot',
  },
  {
    id: 'sudoku',
    name: 'Sudoku Junior',
    icon: '🎯',
    color: 'teal',
    categoryId: 'numbers',
  },

  // Formes
  {
    id: 'tangram',
    name: 'Puzzle Formes',
    icon: '🧩',
    color: 'purple',
    categoryId: 'shapes',
    badge: 'new',
  },
  {
    id: 'labyrinthe',
    name: 'Labyrinthe',
    icon: '🗺️',
    color: 'pink',
    categoryId: 'shapes',
  },

  // Mémoire
  {
    id: 'memory',
    name: 'Super Mémoire',
    icon: '🧠',
    color: 'orange',
    categoryId: 'memory',
  },

  // Mots
  {
    id: 'mots-croises',
    name: 'Mots Croisés',
    icon: '📝',
    color: 'red',
    categoryId: 'words',
  },
  {
    id: 'conteur-curieux',
    name: 'Conteur Curieux',
    icon: '📚',
    color: 'purple',
    categoryId: 'words',
    badge: 'new',
  },

  // Équilibre
  {
    id: 'balance',
    name: 'Balance Logique',
    icon: '⚖️',
    color: 'amber',
    categoryId: 'logic',
  },

  // Matrices
  {
    id: 'matrices-magiques',
    name: 'Matrices Magiques',
    icon: '🔮',
    color: 'cyan',
    categoryId: 'logic',
    badge: 'new',
  },

  // === COMING SOON ===
  {
    id: 'embouteillage',
    name: 'Embouteillage',
    icon: '🚗',
    color: 'red',
    categoryId: 'logic',
    badge: 'soon',
  },
  {
    id: 'fabrique-reactions',
    name: 'Fabrique de Réactions',
    icon: '⚙️',
    color: 'blue',
    categoryId: 'logic',
    badge: 'soon',
  },
  {
    id: 'chasseur-papillons',
    name: 'Chasseur de Papillons',
    icon: '🦋',
    color: 'green',
    categoryId: 'memory',
    badge: 'soon',
  },
];

// ============ CATEGORY DEFINITIONS ============

export interface CategoryDefinition {
  id: string;
  icon: string;
  title: string;
}

export const CATEGORIES_DEFINITIONS: CategoryDefinition[] = [
  { id: 'logic', icon: '🧠', title: 'Logique' },
  { id: 'numbers', icon: '🔢', title: 'Chiffres' },
  { id: 'shapes', icon: '🧩', title: 'Formes' },
  { id: 'memory', icon: '🧠', title: 'Mémoire' },
  { id: 'words', icon: '📖', title: 'Mots' },
];

// ============ HELPER FUNCTIONS ============

/**
 * Get game definition by ID
 */
export function getGameDefinition(gameId: string): GameDefinition | undefined {
  return GAMES_DEFINITIONS.find((g) => g.id === gameId);
}

/**
 * Get all games for a category
 */
export function getGamesForCategory(categoryId: string): GameDefinition[] {
  return GAMES_DEFINITIONS.filter((g) => g.categoryId === categoryId);
}

/**
 * Build categories with games and medal data
 */
export function buildGameCategories(
  getMedalForGame: (gameId: string) => MedalType
): GameCategoryV9[] {
  return CATEGORIES_DEFINITIONS.map((category) => {
    const categoryGames = getGamesForCategory(category.id);

    const games: GameV9[] = categoryGames.map((game) => ({
      id: game.id,
      name: game.name,
      icon: game.icon,
      color: game.color,
      medal: game.isLocked ? 'none' : getMedalForGame(game.id),
      badge: game.badge,
      isLocked: game.isLocked ?? false,
    }));

    return {
      id: category.id,
      icon: category.icon,
      title: category.title,
      games,
    };
  });
}

/**
 * Get category definition by ID
 */
export function getCategoryDefinition(categoryId: string): CategoryDefinition | undefined {
  return CATEGORIES_DEFINITIONS.find((c) => c.id === categoryId);
}

// ============ PIOU ADVICE TEMPLATES ============

export interface PiouAdviceTemplate {
  id: string;
  condition: 'near_diamond' | 'near_gold' | 'streak_broken' | 'new_game' | 'default';
  message: string;
  highlightedPart: string;
  actionLabel: string;
}

export const PIOU_ADVICE_TEMPLATES: PiouAdviceTemplate[] = [
  {
    id: 'near_diamond',
    condition: 'near_diamond',
    message: 'Tu es à {count} niveau du rang Diamant !',
    highlightedPart: '{count} niveau',
    actionLabel: "C'est parti !",
  },
  {
    id: 'near_gold',
    condition: 'near_gold',
    message: 'Plus que {count} niveaux pour le rang Or !',
    highlightedPart: '{count} niveaux',
    actionLabel: 'Je fonce !',
  },
  {
    id: 'streak_broken',
    condition: 'streak_broken',
    message: "Joue aujourd'hui pour garder ta série de {count} jours !",
    highlightedPart: '{count} jours',
    actionLabel: 'Jouer !',
  },
  {
    id: 'new_game',
    condition: 'new_game',
    message: 'Un nouveau jeu est disponible : {gameName} !',
    highlightedPart: '{gameName}',
    actionLabel: 'Découvrir',
  },
  {
    id: 'default',
    condition: 'default',
    message: 'Continue comme ça, tu progresses super bien !',
    highlightedPart: 'super bien',
    actionLabel: 'Continuer',
  },
];

// ============ FLOWER EMOJIS ============

export const FLOWER_EMOJIS = ['🌸', '🌻', '🌷', '🌺', '🌼'] as const;

// ============ WEEK DAYS ============

export const WEEK_DAYS_CONFIG = [
  { key: 'mon', label: 'L' },
  { key: 'tue', label: 'M' },
  { key: 'wed', label: 'M' },
  { key: 'thu', label: 'J' },
  { key: 'fri', label: 'V' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'D' },
] as const;
