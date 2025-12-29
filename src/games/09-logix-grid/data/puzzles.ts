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
// PUZZLES NIVEAU 2 SUPPLÉMENTAIRES
// ============================================================================

const PUZZLE_VEHICULES_ENFANTS: LogixPuzzle = {
  id: 'vehicules-enfants-2',
  name: 'Les véhicules préférés',
  description: 'Quel véhicule préfère chaque enfant et de quelle couleur ?',
  difficulty: 2,
  categories: [
    {
      id: 'enfant',
      name: 'Enfant',
      items: [
        { id: 'jules', name: 'Jules', emoji: '👦' },
        { id: 'sarah', name: 'Sarah', emoji: '👧' },
        { id: 'noah', name: 'Noah', emoji: '👦' },
      ],
    },
    {
      id: 'vehicule',
      name: 'Véhicule',
      items: [
        { id: 'velo', name: 'Vélo', emoji: '🚲' },
        { id: 'trottinette', name: 'Trottinette', emoji: '🛴' },
        { id: 'skateboard', name: 'Skateboard', emoji: '🛹' },
      ],
    },
    {
      id: 'couleur',
      name: 'Couleur',
      items: [
        { id: 'rouge', name: 'Rouge', emoji: '🔴' },
        { id: 'vert', name: 'Vert', emoji: '🟢' },
        { id: 'bleu', name: 'Bleu', emoji: '🔵' },
      ],
    },
  ],
  clues: [
    {
      id: 'clue1',
      text: 'Jules a un vélo.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'jules', category1: 'enfant', subject2: 'velo', category2: 'vehicule' },
    },
    {
      id: 'clue2',
      text: 'Le skateboard n\'est pas rouge.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'skateboard', category1: 'vehicule', subject2: 'rouge', category2: 'couleur', isNegative: true },
    },
    {
      id: 'clue3',
      text: 'Sarah adore le vert.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'sarah', category1: 'enfant', subject2: 'vert', category2: 'couleur' },
    },
    {
      id: 'clue4',
      text: 'Noah a une trottinette bleue.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'noah', category1: 'enfant', subject2: 'trottinette', category2: 'vehicule' },
    },
    {
      id: 'clue5',
      text: 'Le vélo est rouge.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'velo', category1: 'vehicule', subject2: 'rouge', category2: 'couleur' },
    },
  ],
  solution: {
    enfant: {
      jules: ['velo', 'rouge'],
      sarah: ['skateboard', 'vert'],
      noah: ['trottinette', 'bleu'],
    },
    vehicule: {
      velo: ['rouge'],
      skateboard: ['vert'],
      trottinette: ['bleu'],
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
// PUZZLES NIVEAU 3 SUPPLÉMENTAIRES
// ============================================================================

const PUZZLE_ECOLE_MATIERES: LogixPuzzle = {
  id: 'ecole-matieres-3',
  name: 'Les matières préférées',
  description: 'Trouve la matière préférée et l\'heure de cours de chaque élève !',
  difficulty: 3,
  categories: [
    {
      id: 'eleve',
      name: 'Élève',
      items: [
        { id: 'leo', name: 'Léo', emoji: '👦' },
        { id: 'mia', name: 'Mia', emoji: '👧' },
        { id: 'hugo', name: 'Hugo', emoji: '👦' },
        { id: 'jade', name: 'Jade', emoji: '👧' },
      ],
    },
    {
      id: 'matiere',
      name: 'Matière',
      items: [
        { id: 'maths', name: 'Maths', emoji: '🔢' },
        { id: 'francais', name: 'Français', emoji: '📖' },
        { id: 'sport', name: 'Sport', emoji: '⚽' },
        { id: 'dessin', name: 'Dessin', emoji: '🎨' },
      ],
    },
    {
      id: 'heure',
      name: 'Heure',
      items: [
        { id: 'h8', name: '8h', emoji: '🕗' },
        { id: 'h9', name: '9h', emoji: '🕘' },
        { id: 'h10', name: '10h', emoji: '🕙' },
        { id: 'h11', name: '11h', emoji: '🕚' },
      ],
    },
  ],
  clues: [
    {
      id: 'clue1',
      text: 'Léo adore les maths.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'leo', category1: 'eleve', subject2: 'maths', category2: 'matiere' },
    },
    {
      id: 'clue2',
      text: 'Le sport est à 10h.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'sport', category1: 'matiere', subject2: 'h10', category2: 'heure' },
    },
    {
      id: 'clue3',
      text: 'Mia n\'aime pas le dessin.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'mia', category1: 'eleve', subject2: 'dessin', category2: 'matiere', isNegative: true },
    },
    {
      id: 'clue4',
      text: 'Hugo a cours à 11h.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'hugo', category1: 'eleve', subject2: 'h11', category2: 'heure' },
    },
    {
      id: 'clue5',
      text: 'Jade préfère le dessin.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'jade', category1: 'eleve', subject2: 'dessin', category2: 'matiere' },
    },
    {
      id: 'clue6',
      text: 'Le français est à 8h.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'francais', category1: 'matiere', subject2: 'h8', category2: 'heure' },
    },
    {
      id: 'clue7',
      text: 'Mia a cours à 10h.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'mia', category1: 'eleve', subject2: 'h10', category2: 'heure' },
    },
  ],
  solution: {
    eleve: {
      leo: ['maths', 'h9'],
      mia: ['sport', 'h10'],
      hugo: ['francais', 'h11'],
      jade: ['dessin', 'h8'],
    },
    matiere: {
      maths: ['h9'],
      sport: ['h10'],
      francais: ['h8'],
      dessin: ['h11'],
    },
  },
  hintsAvailable: 4,
  idealTime: 180,
};

const PUZZLE_FETE_ANNIVERSAIRE: LogixPuzzle = {
  id: 'fete-anniversaire-3',
  name: 'La fête d\'anniversaire',
  description: 'Qui apporte quel cadeau et quel gâteau préfère-t-il ?',
  difficulty: 3,
  categories: [
    {
      id: 'invite',
      name: 'Invité',
      items: [
        { id: 'arthur', name: 'Arthur', emoji: '👦' },
        { id: 'chloe', name: 'Chloé', emoji: '👧' },
        { id: 'theo', name: 'Théo', emoji: '👦' },
        { id: 'lisa', name: 'Lisa', emoji: '👧' },
      ],
    },
    {
      id: 'cadeau',
      name: 'Cadeau',
      items: [
        { id: 'livre', name: 'Livre', emoji: '📚' },
        { id: 'jouet', name: 'Jouet', emoji: '🧸' },
        { id: 'puzzle', name: 'Puzzle', emoji: '🧩' },
        { id: 'ballon', name: 'Ballon', emoji: '⚽' },
      ],
    },
    {
      id: 'gateau',
      name: 'Gâteau',
      items: [
        { id: 'chocolat', name: 'Chocolat', emoji: '🍫' },
        { id: 'fraise', name: 'Fraise', emoji: '🍓' },
        { id: 'vanille', name: 'Vanille', emoji: '🍦' },
        { id: 'citron', name: 'Citron', emoji: '🍋' },
      ],
    },
  ],
  clues: [
    {
      id: 'clue1',
      text: 'Arthur apporte un livre.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'arthur', category1: 'invite', subject2: 'livre', category2: 'cadeau' },
    },
    {
      id: 'clue2',
      text: 'Celui qui apporte le puzzle aime le chocolat.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'puzzle', category1: 'cadeau', subject2: 'chocolat', category2: 'gateau' },
    },
    {
      id: 'clue3',
      text: 'Chloé n\'aime pas la vanille.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'chloe', category1: 'invite', subject2: 'vanille', category2: 'gateau', isNegative: true },
    },
    {
      id: 'clue4',
      text: 'Lisa apporte le puzzle.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'lisa', category1: 'invite', subject2: 'puzzle', category2: 'cadeau' },
    },
    {
      id: 'clue5',
      text: 'Théo préfère le gâteau au citron.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'theo', category1: 'invite', subject2: 'citron', category2: 'gateau' },
    },
    {
      id: 'clue6',
      text: 'Arthur aime la fraise.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'arthur', category1: 'invite', subject2: 'fraise', category2: 'gateau' },
    },
    {
      id: 'clue7',
      text: 'Chloé apporte un jouet.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'chloe', category1: 'invite', subject2: 'jouet', category2: 'cadeau' },
    },
  ],
  solution: {
    invite: {
      arthur: ['livre', 'fraise'],
      chloe: ['jouet', 'citron'],
      theo: ['ballon', 'vanille'],
      lisa: ['puzzle', 'chocolat'],
    },
    cadeau: {
      livre: ['fraise'],
      jouet: ['citron'],
      ballon: ['vanille'],
      puzzle: ['chocolat'],
    },
  },
  hintsAvailable: 4,
  idealTime: 200,
};

const PUZZLE_VACANCES: LogixPuzzle = {
  id: 'vacances-3',
  name: 'Les vacances',
  description: 'Où part chaque famille et quel moyen de transport utilise-t-elle ?',
  difficulty: 3,
  categories: [
    {
      id: 'famille',
      name: 'Famille',
      items: [
        { id: 'dupont', name: 'Dupont', emoji: '👨‍👩‍👧' },
        { id: 'martin', name: 'Martin', emoji: '👨‍👩‍👦' },
        { id: 'bernard', name: 'Bernard', emoji: '👨‍👩‍👧‍👦' },
        { id: 'petit', name: 'Petit', emoji: '👨‍👩‍👦‍👦' },
      ],
    },
    {
      id: 'destination',
      name: 'Destination',
      items: [
        { id: 'mer', name: 'Mer', emoji: '🏖️' },
        { id: 'montagne', name: 'Montagne', emoji: '⛰️' },
        { id: 'campagne', name: 'Campagne', emoji: '🌾' },
        { id: 'ville', name: 'Ville', emoji: '🏙️' },
      ],
    },
    {
      id: 'transport',
      name: 'Transport',
      items: [
        { id: 'voiture', name: 'Voiture', emoji: '🚗' },
        { id: 'train', name: 'Train', emoji: '🚂' },
        { id: 'avion', name: 'Avion', emoji: '✈️' },
        { id: 'bus', name: 'Bus', emoji: '🚌' },
      ],
    },
  ],
  clues: [
    {
      id: 'clue1',
      text: 'Les Dupont vont à la mer.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'dupont', category1: 'famille', subject2: 'mer', category2: 'destination' },
    },
    {
      id: 'clue2',
      text: 'On va à la montagne en voiture.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'montagne', category1: 'destination', subject2: 'voiture', category2: 'transport' },
    },
    {
      id: 'clue3',
      text: 'Les Martin ne prennent pas l\'avion.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'martin', category1: 'famille', subject2: 'avion', category2: 'transport', isNegative: true },
    },
    {
      id: 'clue4',
      text: 'Les Bernard vont à la montagne.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'bernard', category1: 'famille', subject2: 'montagne', category2: 'destination' },
    },
    {
      id: 'clue5',
      text: 'Les Petit prennent l\'avion.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'petit', category1: 'famille', subject2: 'avion', category2: 'transport' },
    },
    {
      id: 'clue6',
      text: 'On va en ville en bus.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'ville', category1: 'destination', subject2: 'bus', category2: 'transport' },
    },
    {
      id: 'clue7',
      text: 'Les Dupont prennent le train.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'dupont', category1: 'famille', subject2: 'train', category2: 'transport' },
    },
  ],
  solution: {
    famille: {
      dupont: ['mer', 'train'],
      martin: ['ville', 'bus'],
      bernard: ['montagne', 'voiture'],
      petit: ['campagne', 'avion'],
    },
    destination: {
      mer: ['train'],
      montagne: ['voiture'],
      ville: ['bus'],
      campagne: ['avion'],
    },
  },
  hintsAvailable: 4,
  idealTime: 200,
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
  PUZZLE_VEHICULES_ENFANTS,
  // Niveau 3
  PUZZLE_MAISON_COMPLETE,
  PUZZLE_ECOLE_MATIERES,
  PUZZLE_FETE_ANNIVERSAIRE,
  PUZZLE_VACANCES,
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
