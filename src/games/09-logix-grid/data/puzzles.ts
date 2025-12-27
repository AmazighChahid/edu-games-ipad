/**
 * Logix Grid Puzzles
 *
 * Collection de puzzles de grilles logiques pour enfants
 */

import type { LogixPuzzle, Category, Clue } from '../types';

// ============================================================================
// PUZZLES NIVEAU 1 (Facile - 2 catégories, 3 éléments)
// ============================================================================

const PUZZLE_ANIMAUX_COULEURS: LogixPuzzle = {
  id: 'animaux-couleurs-1',
  name: 'Les animaux colorés',
  description: 'Trouve la couleur de chaque animal !',
  difficulty: 1,
  categories: [
    {
      id: 'animal',
      name: 'Animal',
      items: [
        { id: 'chat', name: 'Chat', emoji: '🐱' },
        { id: 'chien', name: 'Chien', emoji: '🐶' },
        { id: 'lapin', name: 'Lapin', emoji: '🐰' },
      ],
    },
    {
      id: 'couleur',
      name: 'Couleur',
      items: [
        { id: 'rouge', name: 'Rouge', emoji: '🔴' },
        { id: 'bleu', name: 'Bleu', emoji: '🔵' },
        { id: 'vert', name: 'Vert', emoji: '🟢' },
      ],
    },
  ],
  clues: [
    {
      id: 'clue1',
      text: 'Le chat aime le rouge.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'chat', category1: 'animal', subject2: 'rouge', category2: 'couleur' },
    },
    {
      id: 'clue2',
      text: 'Le chien n\'aime pas le vert.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'chien', category1: 'animal', subject2: 'vert', category2: 'couleur', isNegative: true },
    },
    {
      id: 'clue3',
      text: 'Le lapin préfère le vert.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'lapin', category1: 'animal', subject2: 'vert', category2: 'couleur' },
    },
  ],
  solution: {
    animal: {
      chat: ['rouge'],
      chien: ['bleu'],
      lapin: ['vert'],
    },
  },
  hintsAvailable: 3,
  idealTime: 60,
};

const PUZZLE_ENFANTS_FRUITS: LogixPuzzle = {
  id: 'enfants-fruits-1',
  name: 'Les fruits préférés',
  description: 'Quel fruit préfère chaque enfant ?',
  difficulty: 1,
  categories: [
    {
      id: 'enfant',
      name: 'Enfant',
      items: [
        { id: 'marie', name: 'Marie', emoji: '👧' },
        { id: 'tom', name: 'Tom', emoji: '👦' },
        { id: 'léa', name: 'Léa', emoji: '👧' },
      ],
    },
    {
      id: 'fruit',
      name: 'Fruit',
      items: [
        { id: 'pomme', name: 'Pomme', emoji: '🍎' },
        { id: 'banane', name: 'Banane', emoji: '🍌' },
        { id: 'orange', name: 'Orange', emoji: '🍊' },
      ],
    },
  ],
  clues: [
    {
      id: 'clue1',
      text: 'Marie adore les pommes.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'marie', category1: 'enfant', subject2: 'pomme', category2: 'fruit' },
    },
    {
      id: 'clue2',
      text: 'Tom n\'aime pas les bananes.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'tom', category1: 'enfant', subject2: 'banane', category2: 'fruit', isNegative: true },
    },
    {
      id: 'clue3',
      text: 'Léa mange toujours des bananes.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'léa', category1: 'enfant', subject2: 'banane', category2: 'fruit' },
    },
  ],
  solution: {
    enfant: {
      marie: ['pomme'],
      tom: ['orange'],
      léa: ['banane'],
    },
  },
  hintsAvailable: 3,
  idealTime: 60,
};

const PUZZLE_METIERS_OUTILS: LogixPuzzle = {
  id: 'metiers-outils-1',
  name: 'Les outils des métiers',
  description: 'Associe chaque métier à son outil !',
  difficulty: 1,
  categories: [
    {
      id: 'metier',
      name: 'Métier',
      items: [
        { id: 'pompier', name: 'Pompier', emoji: '👨‍🚒' },
        { id: 'docteur', name: 'Docteur', emoji: '👨‍⚕️' },
        { id: 'cuisinier', name: 'Cuisinier', emoji: '👨‍🍳' },
      ],
    },
    {
      id: 'outil',
      name: 'Outil',
      items: [
        { id: 'tuyau', name: 'Tuyau', emoji: '🚿' },
        { id: 'stethoscope', name: 'Stéthoscope', emoji: '🩺' },
        { id: 'casserole', name: 'Casserole', emoji: '🍳' },
      ],
    },
  ],
  clues: [
    {
      id: 'clue1',
      text: 'Le pompier utilise le tuyau.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'pompier', category1: 'metier', subject2: 'tuyau', category2: 'outil' },
    },
    {
      id: 'clue2',
      text: 'Le docteur n\'a pas besoin de casserole.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'docteur', category1: 'metier', subject2: 'casserole', category2: 'outil', isNegative: true },
    },
    {
      id: 'clue3',
      text: 'Le cuisinier cuisine avec sa casserole.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'cuisinier', category1: 'metier', subject2: 'casserole', category2: 'outil' },
    },
  ],
  solution: {
    metier: {
      pompier: ['tuyau'],
      docteur: ['stethoscope'],
      cuisinier: ['casserole'],
    },
  },
  hintsAvailable: 3,
  idealTime: 60,
};

// ============================================================================
// PUZZLES NIVEAU 2 (Moyen - 3 catégories, 3 éléments)
// ============================================================================

const PUZZLE_ANIMAUX_MAISONS: LogixPuzzle = {
  id: 'animaux-maisons-2',
  name: 'Où habitent les animaux ?',
  description: 'Trouve où habite chaque animal et sa couleur préférée !',
  difficulty: 2,
  categories: [
    {
      id: 'animal',
      name: 'Animal',
      items: [
        { id: 'ours', name: 'Ours', emoji: '🐻' },
        { id: 'hibou', name: 'Hibou', emoji: '🦉' },
        { id: 'poisson', name: 'Poisson', emoji: '🐟' },
      ],
    },
    {
      id: 'habitat',
      name: 'Habitat',
      items: [
        { id: 'foret', name: 'Forêt', emoji: '🌲' },
        { id: 'arbre', name: 'Arbre', emoji: '🌳' },
        { id: 'riviere', name: 'Rivière', emoji: '🏞️' },
      ],
    },
    {
      id: 'couleur',
      name: 'Couleur',
      items: [
        { id: 'marron', name: 'Marron', emoji: '🟤' },
        { id: 'gris', name: 'Gris', emoji: '⚫' },
        { id: 'bleu', name: 'Bleu', emoji: '🔵' },
      ],
    },
  ],
  clues: [
    {
      id: 'clue1',
      text: 'L\'ours vit dans la forêt.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'ours', category1: 'animal', subject2: 'foret', category2: 'habitat' },
    },
    {
      id: 'clue2',
      text: 'L\'ours est marron.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'ours', category1: 'animal', subject2: 'marron', category2: 'couleur' },
    },
    {
      id: 'clue3',
      text: 'Le poisson n\'est pas gris.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'poisson', category1: 'animal', subject2: 'gris', category2: 'couleur', isNegative: true },
    },
    {
      id: 'clue4',
      text: 'Le hibou dort dans l\'arbre.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'hibou', category1: 'animal', subject2: 'arbre', category2: 'habitat' },
    },
    {
      id: 'clue5',
      text: 'L\'animal bleu vit dans la rivière.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'bleu', category1: 'couleur', subject2: 'riviere', category2: 'habitat' },
    },
  ],
  solution: {
    animal: {
      ours: ['foret', 'marron'],
      hibou: ['arbre', 'gris'],
      poisson: ['riviere', 'bleu'],
    },
    habitat: {
      foret: ['marron'],
      arbre: ['gris'],
      riviere: ['bleu'],
    },
  },
  hintsAvailable: 3,
  idealTime: 120,
};

const PUZZLE_SPORTS_ENFANTS: LogixPuzzle = {
  id: 'sports-enfants-2',
  name: 'Les sports préférés',
  description: 'Quel sport pratique chaque enfant et quel jour ?',
  difficulty: 2,
  categories: [
    {
      id: 'enfant',
      name: 'Enfant',
      items: [
        { id: 'paul', name: 'Paul', emoji: '👦' },
        { id: 'emma', name: 'Emma', emoji: '👧' },
        { id: 'lucas', name: 'Lucas', emoji: '👦' },
      ],
    },
    {
      id: 'sport',
      name: 'Sport',
      items: [
        { id: 'foot', name: 'Football', emoji: '⚽' },
        { id: 'tennis', name: 'Tennis', emoji: '🎾' },
        { id: 'natation', name: 'Natation', emoji: '🏊' },
      ],
    },
    {
      id: 'jour',
      name: 'Jour',
      items: [
        { id: 'lundi', name: 'Lundi', emoji: '📅' },
        { id: 'mercredi', name: 'Mercredi', emoji: '📅' },
        { id: 'samedi', name: 'Samedi', emoji: '📅' },
      ],
    },
  ],
  clues: [
    {
      id: 'clue1',
      text: 'Paul joue au football.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'paul', category1: 'enfant', subject2: 'foot', category2: 'sport' },
    },
    {
      id: 'clue2',
      text: 'Emma ne fait pas de tennis.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'emma', category1: 'enfant', subject2: 'tennis', category2: 'sport', isNegative: true },
    },
    {
      id: 'clue3',
      text: 'La natation se pratique le mercredi.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'natation', category1: 'sport', subject2: 'mercredi', category2: 'jour' },
    },
    {
      id: 'clue4',
      text: 'Paul n\'a pas cours le samedi.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'paul', category1: 'enfant', subject2: 'samedi', category2: 'jour', isNegative: true },
    },
    {
      id: 'clue5',
      text: 'Lucas fait du sport le samedi.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'lucas', category1: 'enfant', subject2: 'samedi', category2: 'jour' },
    },
  ],
  solution: {
    enfant: {
      paul: ['foot', 'lundi'],
      emma: ['natation', 'mercredi'],
      lucas: ['tennis', 'samedi'],
    },
    sport: {
      foot: ['lundi'],
      natation: ['mercredi'],
      tennis: ['samedi'],
    },
  },
  hintsAvailable: 3,
  idealTime: 120,
};

// ============================================================================
// PUZZLES NIVEAU 3 (Difficile - 3 catégories, 4 éléments)
// ============================================================================

const PUZZLE_MAISON_COMPLETE: LogixPuzzle = {
  id: 'maison-complete-3',
  name: 'Le quartier mystère',
  description: 'Trouve qui habite où avec quel animal !',
  difficulty: 3,
  categories: [
    {
      id: 'personne',
      name: 'Personne',
      items: [
        { id: 'alice', name: 'Alice', emoji: '👩' },
        { id: 'bob', name: 'Bob', emoji: '👨' },
        { id: 'clara', name: 'Clara', emoji: '👩' },
        { id: 'david', name: 'David', emoji: '👨' },
      ],
    },
    {
      id: 'maison',
      name: 'Maison',
      items: [
        { id: 'rouge', name: 'Rouge', emoji: '🏠' },
        { id: 'bleue', name: 'Bleue', emoji: '🏡' },
        { id: 'verte', name: 'Verte', emoji: '🏘️' },
        { id: 'jaune', name: 'Jaune', emoji: '🏚️' },
      ],
    },
    {
      id: 'animal',
      name: 'Animal',
      items: [
        { id: 'chat', name: 'Chat', emoji: '🐱' },
        { id: 'chien', name: 'Chien', emoji: '🐶' },
        { id: 'hamster', name: 'Hamster', emoji: '🐹' },
        { id: 'perroquet', name: 'Perroquet', emoji: '🦜' },
      ],
    },
  ],
  clues: [
    {
      id: 'clue1',
      text: 'Alice habite la maison rouge.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'alice', category1: 'personne', subject2: 'rouge', category2: 'maison' },
    },
    {
      id: 'clue2',
      text: 'Le chat vit dans la maison bleue.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'chat', category1: 'animal', subject2: 'bleue', category2: 'maison' },
    },
    {
      id: 'clue3',
      text: 'Bob n\'a pas de chien.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'bob', category1: 'personne', subject2: 'chien', category2: 'animal', isNegative: true },
    },
    {
      id: 'clue4',
      text: 'Clara a un perroquet.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'clara', category1: 'personne', subject2: 'perroquet', category2: 'animal' },
    },
    {
      id: 'clue5',
      text: 'David habite la maison jaune.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'david', category1: 'personne', subject2: 'jaune', category2: 'maison' },
    },
    {
      id: 'clue6',
      text: 'Le hamster n\'est pas dans la maison verte.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'hamster', category1: 'animal', subject2: 'verte', category2: 'maison', isNegative: true },
    },
    {
      id: 'clue7',
      text: 'Alice a un chien.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'alice', category1: 'personne', subject2: 'chien', category2: 'animal' },
    },
  ],
  solution: {
    personne: {
      alice: ['rouge', 'chien'],
      bob: ['bleue', 'chat'],
      clara: ['verte', 'perroquet'],
      david: ['jaune', 'hamster'],
    },
    maison: {
      rouge: ['chien'],
      bleue: ['chat'],
      verte: ['perroquet'],
      jaune: ['hamster'],
    },
  },
  hintsAvailable: 4,
  idealTime: 180,
};

// ============================================================================
// EXPORTS
// ============================================================================

export const LOGIX_PUZZLES: LogixPuzzle[] = [
  // Niveau 1
  PUZZLE_ANIMAUX_COULEURS,
  PUZZLE_ENFANTS_FRUITS,
  PUZZLE_METIERS_OUTILS,
  // Niveau 2
  PUZZLE_ANIMAUX_MAISONS,
  PUZZLE_SPORTS_ENFANTS,
  // Niveau 3
  PUZZLE_MAISON_COMPLETE,
];

/**
 * Obtient un puzzle par ID
 */
export function getPuzzleById(id: string): LogixPuzzle | undefined {
  return LOGIX_PUZZLES.find((p) => p.id === id);
}

/**
 * Obtient les puzzles par difficulté
 */
export function getPuzzlesByDifficulty(difficulty: 1 | 2 | 3): LogixPuzzle[] {
  return LOGIX_PUZZLES.filter((p) => p.difficulty === difficulty);
}

/**
 * Obtient le premier puzzle
 */
export function getFirstPuzzle(): LogixPuzzle {
  return LOGIX_PUZZLES[0];
}

/**
 * Obtient tous les puzzles
 */
export function getAllPuzzles(): LogixPuzzle[] {
  return LOGIX_PUZZLES;
}
