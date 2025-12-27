/**
 * Mots Croisés Grids
 *
 * Collection de grilles de mots croisés pour enfants
 */

import type { CrosswordLevel, CrosswordWord } from '../types';

// ============================================================================
// GRILLES NIVEAU 1 (Facile - mots de 3-5 lettres)
// ============================================================================

const GRID_ANIMAUX_1: CrosswordLevel = {
  id: 'animaux-1',
  name: 'Les Animaux',
  description: 'Découvre les noms des animaux !',
  difficulty: 1,
  theme: 'Animaux',
  themeEmoji: '🐾',
  gridSize: { rows: 6, cols: 6 },
  words: [
    {
      id: 'chat',
      word: 'CHAT',
      clue: 'Animal qui fait miaou',
      row: 0,
      col: 0,
      direction: 'horizontal',
      number: 1,
      emoji: '🐱',
    },
    {
      id: 'chien',
      word: 'CHIEN',
      clue: 'Le meilleur ami de l\'homme',
      row: 0,
      col: 0,
      direction: 'vertical',
      number: 1,
      emoji: '🐶',
    },
    {
      id: 'ours',
      word: 'OURS',
      clue: 'Grand animal de la forêt',
      row: 2,
      col: 2,
      direction: 'horizontal',
      number: 2,
      emoji: '🐻',
    },
    {
      id: 'lion',
      word: 'LION',
      clue: 'Le roi des animaux',
      row: 4,
      col: 1,
      direction: 'horizontal',
      number: 3,
      emoji: '🦁',
    },
  ],
  hintsAvailable: 4,
  idealTime: 120,
};

const GRID_FRUITS_1: CrosswordLevel = {
  id: 'fruits-1',
  name: 'Les Fruits',
  description: 'Trouve les noms des fruits !',
  difficulty: 1,
  theme: 'Fruits',
  themeEmoji: '🍎',
  gridSize: { rows: 6, cols: 7 },
  words: [
    {
      id: 'pomme',
      word: 'POMME',
      clue: 'Fruit rouge ou vert, souvent dans les tartes',
      row: 0,
      col: 0,
      direction: 'horizontal',
      number: 1,
      emoji: '🍎',
    },
    {
      id: 'poire',
      word: 'POIRE',
      clue: 'Fruit jaune-vert en forme de goutte',
      row: 0,
      col: 0,
      direction: 'vertical',
      number: 1,
      emoji: '🍐',
    },
    {
      id: 'kiwi',
      word: 'KIWI',
      clue: 'Petit fruit vert et poilu',
      row: 2,
      col: 3,
      direction: 'horizontal',
      number: 2,
      emoji: '🥝',
    },
    {
      id: 'raisin',
      word: 'RAISIN',
      clue: 'Petites boules en grappe',
      row: 4,
      col: 0,
      direction: 'horizontal',
      number: 3,
      emoji: '🍇',
    },
  ],
  hintsAvailable: 4,
  idealTime: 120,
};

const GRID_COULEURS_1: CrosswordLevel = {
  id: 'couleurs-1',
  name: 'Les Couleurs',
  description: 'Les couleurs de l\'arc-en-ciel !',
  difficulty: 1,
  theme: 'Couleurs',
  themeEmoji: '🌈',
  gridSize: { rows: 6, cols: 6 },
  words: [
    {
      id: 'rouge',
      word: 'ROUGE',
      clue: 'Couleur des tomates',
      row: 0,
      col: 0,
      direction: 'horizontal',
      number: 1,
      emoji: '🔴',
    },
    {
      id: 'bleu',
      word: 'BLEU',
      clue: 'Couleur du ciel',
      row: 2,
      col: 0,
      direction: 'horizontal',
      number: 2,
      emoji: '🔵',
    },
    {
      id: 'vert',
      word: 'VERT',
      clue: 'Couleur de l\'herbe',
      row: 4,
      col: 1,
      direction: 'horizontal',
      number: 3,
      emoji: '🟢',
    },
    {
      id: 'rose',
      word: 'ROSE',
      clue: 'Couleur des flamants',
      row: 0,
      col: 0,
      direction: 'vertical',
      number: 1,
      emoji: '🩷',
    },
  ],
  hintsAvailable: 4,
  idealTime: 90,
};

// ============================================================================
// GRILLES NIVEAU 2 (Moyen - mots de 4-6 lettres)
// ============================================================================

const GRID_ECOLE_2: CrosswordLevel = {
  id: 'ecole-2',
  name: 'À l\'École',
  description: 'Le vocabulaire de l\'école !',
  difficulty: 2,
  theme: 'École',
  themeEmoji: '🏫',
  gridSize: { rows: 8, cols: 8 },
  words: [
    {
      id: 'cahier',
      word: 'CAHIER',
      clue: 'On y écrit nos leçons',
      row: 0,
      col: 0,
      direction: 'horizontal',
      number: 1,
      emoji: '📓',
    },
    {
      id: 'crayon',
      word: 'CRAYON',
      clue: 'Pour dessiner et écrire',
      row: 0,
      col: 0,
      direction: 'vertical',
      number: 1,
      emoji: '✏️',
    },
    {
      id: 'gomme',
      word: 'GOMME',
      clue: 'Pour effacer les erreurs',
      row: 2,
      col: 2,
      direction: 'horizontal',
      number: 2,
      emoji: '🧽',
    },
    {
      id: 'livre',
      word: 'LIVRE',
      clue: 'On le lit pour apprendre',
      row: 4,
      col: 1,
      direction: 'horizontal',
      number: 3,
      emoji: '📚',
    },
    {
      id: 'table',
      word: 'TABLE',
      clue: 'Meuble pour travailler',
      row: 6,
      col: 0,
      direction: 'horizontal',
      number: 4,
      emoji: '🪑',
    },
  ],
  hintsAvailable: 4,
  idealTime: 180,
};

const GRID_MAISON_2: CrosswordLevel = {
  id: 'maison-2',
  name: 'La Maison',
  description: 'Les pièces et objets de la maison !',
  difficulty: 2,
  theme: 'Maison',
  themeEmoji: '🏠',
  gridSize: { rows: 8, cols: 8 },
  words: [
    {
      id: 'cuisine',
      word: 'CUISINE',
      clue: 'Pièce où on prépare les repas',
      row: 0,
      col: 0,
      direction: 'horizontal',
      number: 1,
      emoji: '🍳',
    },
    {
      id: 'chambre',
      word: 'CHAMBRE',
      clue: 'Pièce pour dormir',
      row: 0,
      col: 0,
      direction: 'vertical',
      number: 1,
      emoji: '🛏️',
    },
    {
      id: 'salon',
      word: 'SALON',
      clue: 'Pièce avec le canapé',
      row: 2,
      col: 3,
      direction: 'horizontal',
      number: 2,
      emoji: '🛋️',
    },
    {
      id: 'jardin',
      word: 'JARDIN',
      clue: 'Espace vert dehors',
      row: 4,
      col: 1,
      direction: 'horizontal',
      number: 3,
      emoji: '🌻',
    },
  ],
  hintsAvailable: 4,
  idealTime: 180,
};

// ============================================================================
// GRILLES NIVEAU 3 (Difficile - mots de 5-8 lettres)
// ============================================================================

const GRID_NATURE_3: CrosswordLevel = {
  id: 'nature-3',
  name: 'La Nature',
  description: 'Découvre le vocabulaire de la nature !',
  difficulty: 3,
  theme: 'Nature',
  themeEmoji: '🌲',
  gridSize: { rows: 10, cols: 10 },
  words: [
    {
      id: 'montagne',
      word: 'MONTAGNE',
      clue: 'Relief très haut avec de la neige',
      row: 0,
      col: 0,
      direction: 'horizontal',
      number: 1,
      emoji: '🏔️',
    },
    {
      id: 'riviere',
      word: 'RIVIERE',
      clue: 'Cours d\'eau naturel',
      row: 2,
      col: 1,
      direction: 'horizontal',
      number: 2,
      emoji: '🏞️',
    },
    {
      id: 'foret',
      word: 'FORET',
      clue: 'Grand espace plein d\'arbres',
      row: 4,
      col: 2,
      direction: 'horizontal',
      number: 3,
      emoji: '🌳',
    },
    {
      id: 'fleur',
      word: 'FLEUR',
      clue: 'Plante colorée et parfumée',
      row: 6,
      col: 0,
      direction: 'horizontal',
      number: 4,
      emoji: '🌸',
    },
    {
      id: 'soleil',
      word: 'SOLEIL',
      clue: 'Étoile qui nous éclaire',
      row: 8,
      col: 2,
      direction: 'horizontal',
      number: 5,
      emoji: '☀️',
    },
    {
      id: 'nuage',
      word: 'NUAGE',
      clue: 'Blanc et flottant dans le ciel',
      row: 0,
      col: 0,
      direction: 'vertical',
      number: 1,
      emoji: '☁️',
    },
  ],
  hintsAvailable: 5,
  idealTime: 240,
};

const GRID_METIERS_3: CrosswordLevel = {
  id: 'metiers-3',
  name: 'Les Métiers',
  description: 'Découvre différents métiers !',
  difficulty: 3,
  theme: 'Métiers',
  themeEmoji: '👨‍🔧',
  gridSize: { rows: 10, cols: 10 },
  words: [
    {
      id: 'pompier',
      word: 'POMPIER',
      clue: 'Il éteint les incendies',
      row: 0,
      col: 0,
      direction: 'horizontal',
      number: 1,
      emoji: '👨‍🚒',
    },
    {
      id: 'docteur',
      word: 'DOCTEUR',
      clue: 'Il soigne les malades',
      row: 2,
      col: 1,
      direction: 'horizontal',
      number: 2,
      emoji: '👨‍⚕️',
    },
    {
      id: 'pilote',
      word: 'PILOTE',
      clue: 'Il conduit les avions',
      row: 4,
      col: 0,
      direction: 'horizontal',
      number: 3,
      emoji: '👨‍✈️',
    },
    {
      id: 'boulanger',
      word: 'BOULANGER',
      clue: 'Il fait le pain',
      row: 6,
      col: 0,
      direction: 'horizontal',
      number: 4,
      emoji: '👨‍🍳',
    },
    {
      id: 'policier',
      word: 'POLICIER',
      clue: 'Il protège les gens',
      row: 0,
      col: 0,
      direction: 'vertical',
      number: 1,
      emoji: '👮',
    },
  ],
  hintsAvailable: 5,
  idealTime: 240,
};

// ============================================================================
// EXPORTS
// ============================================================================

export const CROSSWORD_GRIDS: CrosswordLevel[] = [
  // Niveau 1
  GRID_ANIMAUX_1,
  GRID_FRUITS_1,
  GRID_COULEURS_1,
  // Niveau 2
  GRID_ECOLE_2,
  GRID_MAISON_2,
  // Niveau 3
  GRID_NATURE_3,
  GRID_METIERS_3,
];

/**
 * Obtient une grille par ID
 */
export function getGridById(id: string): CrosswordLevel | undefined {
  return CROSSWORD_GRIDS.find((g) => g.id === id);
}

/**
 * Obtient les grilles par difficulté
 */
export function getGridsByDifficulty(difficulty: 1 | 2 | 3): CrosswordLevel[] {
  return CROSSWORD_GRIDS.filter((g) => g.difficulty === difficulty);
}

/**
 * Obtient la première grille
 */
export function getFirstGrid(): CrosswordLevel {
  return CROSSWORD_GRIDS[0];
}

/**
 * Obtient toutes les grilles
 */
export function getAllGrids(): CrosswordLevel[] {
  return CROSSWORD_GRIDS;
}
