/**
 * Logix Grid Puzzles
 *
 * Collection de puzzles de grilles logiques pour enfants
 */

import type { LogixPuzzle, Category, Clue } from '../types';

// ============================================================================
// PUZZLES NIVEAU 1 (Facile - 2 catégories, 3 éléments)
// ============================================================================

/**
 * PUZZLE 1 - Très Facile (6 ans)
 * Complexité cognitive : 2 indices directs + 1 déduction par élimination
 * L'enfant apprend le mécanisme de base : marquer ✓ et déduire les ✗
 */
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
      text: 'Le lapin préfère le vert.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'lapin', category1: 'animal', subject2: 'vert', category2: 'couleur' },
    },
    // Pas d'indice direct pour le chien → l'enfant doit déduire par élimination
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

/**
 * PUZZLE 2 - Très Facile (6 ans)
 * Complexité cognitive : 1 indice direct + 1 négatif + 1 déduction
 * L'enfant apprend à utiliser un indice négatif (✗) puis déduire
 */
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
      text: 'Léa n\'aime pas les oranges.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'léa', category1: 'enfant', subject2: 'orange', category2: 'fruit', isNegative: true },
    },
    // Déduction : Marie=Pomme (direct), Léa≠Orange donc Léa=Banane, Tom=Orange
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

/**
 * PUZZLE 3 - Facile (6 ans)
 * Complexité cognitive : 2 indices négatifs + déductions en chaîne
 * L'enfant apprend à combiner plusieurs ✗ pour trouver le ✓
 */
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
      text: 'Le pompier n\'utilise pas le stéthoscope.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'pompier', category1: 'metier', subject2: 'stethoscope', category2: 'outil', isNegative: true },
    },
    {
      id: 'clue2',
      text: 'Le pompier n\'a pas besoin de casserole.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'pompier', category1: 'metier', subject2: 'casserole', category2: 'outil', isNegative: true },
    },
    {
      id: 'clue3',
      text: 'Le cuisinier cuisine avec sa casserole.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'cuisinier', category1: 'metier', subject2: 'casserole', category2: 'outil' },
    },
    // Déduction : Pompier ≠ Stéthoscope ET ≠ Casserole → Pompier = Tuyau
    // Cuisinier = Casserole (direct) → Docteur = Stéthoscope (élimination)
  ],
  solution: {
    metier: {
      pompier: ['tuyau'],
      docteur: ['stethoscope'],
      cuisinier: ['casserole'],
    },
  },
  hintsAvailable: 3,
  idealTime: 75,
};

// ============================================================================
// PUZZLES NIVEAU 2 (Moyen - 3 catégories, 3 éléments)
// Complexité : Introduction aux indices TRANSITIFS (liant 2 catégories indirectement)
// ============================================================================

/**
 * PUZZLE 4 - Moyen (7 ans)
 * Complexité cognitive : Indice transitif + déductions en chaîne
 * "L'animal bleu vit dans la rivière" → lie couleur et habitat
 * L'enfant doit comprendre que si Poisson=Bleu ET Bleu=Rivière → Poisson=Rivière
 */
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
      text: 'L\'animal de la forêt est marron.',
      type: 'positive',
      isUsed: false,
      // Indice TRANSITIF : lie habitat et couleur → l'enfant doit déduire Ours=Marron
      data: { subject1: 'foret', category1: 'habitat', subject2: 'marron', category2: 'couleur' },
    },
    {
      id: 'clue3',
      text: 'Le poisson est bleu.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'poisson', category1: 'animal', subject2: 'bleu', category2: 'couleur' },
    },
    {
      id: 'clue4',
      text: 'L\'animal bleu vit dans la rivière.',
      type: 'positive',
      isUsed: false,
      // Indice TRANSITIF : lie couleur et habitat → Poisson=Bleu + Bleu=Rivière → Poisson=Rivière
      data: { subject1: 'bleu', category1: 'couleur', subject2: 'riviere', category2: 'habitat' },
    },
    // Déductions finales par élimination :
    // Hibou = Arbre (seul restant) et Hibou = Gris (seul restant)
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

/**
 * PUZZLE 5 - Moyen (7 ans)
 * Complexité cognitive : Combinaison d'indices négatifs + transitif
 * L'enfant doit : 1) utiliser les négatifs, 2) combiner sport↔jour, 3) déduire par élimination
 */
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
      text: 'Le football se joue le lundi.',
      type: 'positive',
      isUsed: false,
      // TRANSITIF : sport↔jour (pas enfant↔sport directement)
      data: { subject1: 'foot', category1: 'sport', subject2: 'lundi', category2: 'jour' },
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
      text: 'Emma ne fait pas de football.',
      type: 'negative',
      isUsed: false,
      // Avec les 2 négatifs → Emma = Natation (par élimination)
      data: { subject1: 'emma', category1: 'enfant', subject2: 'foot', category2: 'sport', isNegative: true },
    },
    {
      id: 'clue4',
      text: 'Lucas fait du sport le samedi.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'lucas', category1: 'enfant', subject2: 'samedi', category2: 'jour' },
    },
    // Déductions :
    // Emma ≠ Tennis ET ≠ Foot → Emma = Natation
    // Foot = Lundi (transitif), Lucas = Samedi → Lucas ≠ Foot → Lucas = Tennis ou Natation
    // Mais Emma = Natation → Lucas = Tennis
    // Paul = Foot (seul restant) → Paul = Lundi (via transitif)
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
  idealTime: 150,
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

/**
 * PUZZLE 7 - Difficile (8 ans)
 * Complexité cognitive : 4 éléments, indices transitifs obligatoires, déductions multi-étapes
 * Aucun indice ne donne directement personne↔animal
 * L'enfant doit combiner personne↔maison + animal↔maison pour déduire personne↔animal
 */
const PUZZLE_MAISON_COMPLETE: LogixPuzzle = {
  id: 'maison-complete-3',
  name: 'Le quartier mystère',
  description: 'Trouve qui habite où avec quel animal !',
  difficulty: 2, // Reclassé niveau 2 (transition)
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
      text: 'Le chien vit dans la maison rouge.',
      type: 'positive',
      isUsed: false,
      // TRANSITIF : Alice=Rouge + Rouge=Chien → Alice=Chien
      data: { subject1: 'chien', category1: 'animal', subject2: 'rouge', category2: 'maison' },
    },
    {
      id: 'clue3',
      text: 'Le chat vit dans la maison bleue.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'chat', category1: 'animal', subject2: 'bleue', category2: 'maison' },
    },
    {
      id: 'clue4',
      text: 'Clara n\'habite pas la maison bleue.',
      type: 'negative',
      isUsed: false,
      data: { subject1: 'clara', category1: 'personne', subject2: 'bleue', category2: 'maison', isNegative: true },
    },
    {
      id: 'clue5',
      text: 'Clara n\'habite pas la maison jaune.',
      type: 'negative',
      isUsed: false,
      // Clara ≠ Rouge (Alice=Rouge) ET ≠ Bleue ET ≠ Jaune → Clara = Verte
      data: { subject1: 'clara', category1: 'personne', subject2: 'jaune', category2: 'maison', isNegative: true },
    },
    {
      id: 'clue6',
      text: 'Le perroquet vit dans la maison verte.',
      type: 'positive',
      isUsed: false,
      // TRANSITIF : Clara=Verte + Verte=Perroquet → Clara=Perroquet
      data: { subject1: 'perroquet', category1: 'animal', subject2: 'verte', category2: 'maison' },
    },
    {
      id: 'clue7',
      text: 'David habite la maison jaune.',
      type: 'positive',
      isUsed: false,
      data: { subject1: 'david', category1: 'personne', subject2: 'jaune', category2: 'maison' },
    },
    // Déductions finales :
    // Bob = Bleue (seul restant) → Bob = Chat (via transitif)
    // David = Jaune → David = Hamster (seul animal restant)
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
// PUZZLES NIVEAU 11-15 (Moyen+ - 3 catégories, 3-4 éléments)
// Pour enfants 7-8 ans - Transition vers difficile
// ============================================================================

const PUZZLE_CINEMA: LogixPuzzle = {
  id: 'cinema-11',
  name: 'Soirée cinéma',
  description: 'Qui regarde quel film avec quel snack ?',
  difficulty: 2, // Transition progressive
  categories: [
    {
      id: 'enfant',
      name: 'Enfant',
      items: [
        { id: 'anna', name: 'Anna', emoji: '👧' },
        { id: 'max', name: 'Max', emoji: '👦' },
        { id: 'sofia', name: 'Sofia', emoji: '👧' },
      ],
    },
    {
      id: 'film',
      name: 'Film',
      items: [
        { id: 'aventure', name: 'Aventure', emoji: '🎬' },
        { id: 'comedie', name: 'Comédie', emoji: '😂' },
        { id: 'dessin', name: 'Dessin animé', emoji: '🎨' },
      ],
    },
    {
      id: 'snack',
      name: 'Snack',
      items: [
        { id: 'popcorn', name: 'Popcorn', emoji: '🍿' },
        { id: 'bonbons', name: 'Bonbons', emoji: '🍬' },
        { id: 'glace', name: 'Glace', emoji: '🍦' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Anna adore les films d\'aventure.', type: 'positive', isUsed: false, data: { subject1: 'anna', category1: 'enfant', subject2: 'aventure', category2: 'film' } },
    { id: 'clue2', text: 'Max mange toujours du popcorn.', type: 'positive', isUsed: false, data: { subject1: 'max', category1: 'enfant', subject2: 'popcorn', category2: 'snack' } },
    { id: 'clue3', text: 'Sofia n\'aime pas les dessins animés.', type: 'negative', isUsed: false, data: { subject1: 'sofia', category1: 'enfant', subject2: 'dessin', category2: 'film', isNegative: true } },
    { id: 'clue4', text: 'Les bonbons vont avec la comédie.', type: 'positive', isUsed: false, data: { subject1: 'bonbons', category1: 'snack', subject2: 'comedie', category2: 'film' } },
    { id: 'clue5', text: 'Anna prend une glace.', type: 'positive', isUsed: false, data: { subject1: 'anna', category1: 'enfant', subject2: 'glace', category2: 'snack' } },
  ],
  solution: {
    enfant: { anna: ['aventure', 'glace'], max: ['dessin', 'popcorn'], sofia: ['comedie', 'bonbons'] },
    film: { aventure: ['glace'], dessin: ['popcorn'], comedie: ['bonbons'] },
  },
  hintsAvailable: 3,
  idealTime: 150, // Temps ajusté pour progression cohérente
};

const PUZZLE_MUSIQUE: LogixPuzzle = {
  id: 'musique-12',
  name: 'École de musique',
  description: 'Quel instrument joue chaque enfant et quel jour ?',
  difficulty: 2,
  categories: [
    {
      id: 'enfant',
      name: 'Enfant',
      items: [
        { id: 'liam', name: 'Liam', emoji: '👦' },
        { id: 'eva', name: 'Eva', emoji: '👧' },
        { id: 'noah', name: 'Noah', emoji: '👦' },
      ],
    },
    {
      id: 'instrument',
      name: 'Instrument',
      items: [
        { id: 'piano', name: 'Piano', emoji: '🎹' },
        { id: 'guitare', name: 'Guitare', emoji: '🎸' },
        { id: 'violon', name: 'Violon', emoji: '🎻' },
      ],
    },
    {
      id: 'jour',
      name: 'Jour',
      items: [
        { id: 'mardi', name: 'Mardi', emoji: '📅' },
        { id: 'jeudi', name: 'Jeudi', emoji: '📅' },
        { id: 'vendredi', name: 'Vendredi', emoji: '📅' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Liam joue du piano.', type: 'positive', isUsed: false, data: { subject1: 'liam', category1: 'enfant', subject2: 'piano', category2: 'instrument' } },
    { id: 'clue2', text: 'Le cours de guitare est le vendredi.', type: 'positive', isUsed: false, data: { subject1: 'guitare', category1: 'instrument', subject2: 'vendredi', category2: 'jour' } },
    { id: 'clue3', text: 'Eva n\'a pas cours le mardi.', type: 'negative', isUsed: false, data: { subject1: 'eva', category1: 'enfant', subject2: 'mardi', category2: 'jour', isNegative: true } },
    { id: 'clue4', text: 'Noah joue de la guitare.', type: 'positive', isUsed: false, data: { subject1: 'noah', category1: 'enfant', subject2: 'guitare', category2: 'instrument' } },
    { id: 'clue5', text: 'Le piano est enseigné le mardi.', type: 'positive', isUsed: false, data: { subject1: 'piano', category1: 'instrument', subject2: 'mardi', category2: 'jour' } },
  ],
  solution: {
    enfant: { liam: ['piano', 'mardi'], eva: ['violon', 'jeudi'], noah: ['guitare', 'vendredi'] },
    instrument: { piano: ['mardi'], violon: ['jeudi'], guitare: ['vendredi'] },
  },
  hintsAvailable: 3,
  idealTime: 150, // Temps ajusté pour progression cohérente
};

const PUZZLE_JARDINAGE: LogixPuzzle = {
  id: 'jardinage-13',
  name: 'Le jardin fleuri',
  description: 'Quelle fleur a planté chaque enfant et de quelle couleur ?',
  difficulty: 2,
  categories: [
    {
      id: 'enfant',
      name: 'Enfant',
      items: [
        { id: 'camille', name: 'Camille', emoji: '👧' },
        { id: 'adam', name: 'Adam', emoji: '👦' },
        { id: 'lou', name: 'Lou', emoji: '👧' },
      ],
    },
    {
      id: 'fleur',
      name: 'Fleur',
      items: [
        { id: 'rose', name: 'Rose', emoji: '🌹' },
        { id: 'tulipe', name: 'Tulipe', emoji: '🌷' },
        { id: 'tournesol', name: 'Tournesol', emoji: '🌻' },
      ],
    },
    {
      id: 'couleur',
      name: 'Couleur',
      items: [
        { id: 'rouge', name: 'Rouge', emoji: '🔴' },
        { id: 'jaune', name: 'Jaune', emoji: '🟡' },
        { id: 'rose_c', name: 'Rose', emoji: '🩷' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Camille a planté une rose.', type: 'positive', isUsed: false, data: { subject1: 'camille', category1: 'enfant', subject2: 'rose', category2: 'fleur' } },
    { id: 'clue2', text: 'Le tournesol est jaune.', type: 'positive', isUsed: false, data: { subject1: 'tournesol', category1: 'fleur', subject2: 'jaune', category2: 'couleur' } },
    { id: 'clue3', text: 'Adam n\'a pas de fleur rouge.', type: 'negative', isUsed: false, data: { subject1: 'adam', category1: 'enfant', subject2: 'rouge', category2: 'couleur', isNegative: true } },
    { id: 'clue4', text: 'Lou a planté un tournesol.', type: 'positive', isUsed: false, data: { subject1: 'lou', category1: 'enfant', subject2: 'tournesol', category2: 'fleur' } },
    { id: 'clue5', text: 'La rose de Camille est rouge.', type: 'positive', isUsed: false, data: { subject1: 'camille', category1: 'enfant', subject2: 'rouge', category2: 'couleur' } },
  ],
  solution: {
    enfant: { camille: ['rose', 'rouge'], adam: ['tulipe', 'rose_c'], lou: ['tournesol', 'jaune'] },
    fleur: { rose: ['rouge'], tulipe: ['rose_c'], tournesol: ['jaune'] },
  },
  hintsAvailable: 3,
  idealTime: 150, // Temps ajusté pour progression cohérente
};

const PUZZLE_PIQUENIQUE: LogixPuzzle = {
  id: 'piquenique-14',
  name: 'Le pique-nique',
  description: 'Qui a apporté quoi et s\'est assis où ?',
  difficulty: 2,
  categories: [
    {
      id: 'enfant',
      name: 'Enfant',
      items: [
        { id: 'robin', name: 'Robin', emoji: '👦' },
        { id: 'luna', name: 'Luna', emoji: '👧' },
        { id: 'oscar', name: 'Oscar', emoji: '👦' },
        { id: 'ines', name: 'Inès', emoji: '👧' },
      ],
    },
    {
      id: 'nourriture',
      name: 'Nourriture',
      items: [
        { id: 'sandwich', name: 'Sandwich', emoji: '🥪' },
        { id: 'salade', name: 'Salade', emoji: '🥗' },
        { id: 'fruits', name: 'Fruits', emoji: '🍇' },
        { id: 'gateau', name: 'Gâteau', emoji: '🍰' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Robin a apporté le gâteau.', type: 'positive', isUsed: false, data: { subject1: 'robin', category1: 'enfant', subject2: 'gateau', category2: 'nourriture' } },
    { id: 'clue2', text: 'Luna n\'aime pas la salade.', type: 'negative', isUsed: false, data: { subject1: 'luna', category1: 'enfant', subject2: 'salade', category2: 'nourriture', isNegative: true } },
    { id: 'clue3', text: 'Oscar a apporté la salade.', type: 'positive', isUsed: false, data: { subject1: 'oscar', category1: 'enfant', subject2: 'salade', category2: 'nourriture' } },
    { id: 'clue4', text: 'Inès adore les fruits.', type: 'positive', isUsed: false, data: { subject1: 'ines', category1: 'enfant', subject2: 'fruits', category2: 'nourriture' } },
  ],
  solution: {
    enfant: { robin: ['gateau'], luna: ['sandwich'], oscar: ['salade'], ines: ['fruits'] },
  },
  hintsAvailable: 3,
  idealTime: 140, // Temps ajusté pour progression cohérente
};

const PUZZLE_AQUARIUM: LogixPuzzle = {
  id: 'aquarium-15',
  name: 'L\'aquarium',
  description: 'Quel poisson vit dans quel aquarium avec quelle décoration ?',
  difficulty: 2,
  categories: [
    {
      id: 'poisson',
      name: 'Poisson',
      items: [
        { id: 'nemo', name: 'Némo', emoji: '🐠' },
        { id: 'dory', name: 'Dory', emoji: '🐟' },
        { id: 'bulle', name: 'Bulle', emoji: '🐡' },
      ],
    },
    {
      id: 'aquarium',
      name: 'Aquarium',
      items: [
        { id: 'petit', name: 'Petit', emoji: '🔹' },
        { id: 'moyen', name: 'Moyen', emoji: '🔷' },
        { id: 'grand', name: 'Grand', emoji: '💎' },
      ],
    },
    {
      id: 'decor',
      name: 'Décor',
      items: [
        { id: 'corail', name: 'Corail', emoji: '🪸' },
        { id: 'chateau', name: 'Château', emoji: '🏰' },
        { id: 'plantes', name: 'Plantes', emoji: '🌿' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Némo vit dans le grand aquarium.', type: 'positive', isUsed: false, data: { subject1: 'nemo', category1: 'poisson', subject2: 'grand', category2: 'aquarium' } },
    { id: 'clue2', text: 'Le corail est dans le petit aquarium.', type: 'positive', isUsed: false, data: { subject1: 'corail', category1: 'decor', subject2: 'petit', category2: 'aquarium' } },
    { id: 'clue3', text: 'Dory n\'a pas de château.', type: 'negative', isUsed: false, data: { subject1: 'dory', category1: 'poisson', subject2: 'chateau', category2: 'decor', isNegative: true } },
    { id: 'clue4', text: 'Bulle vit dans le petit aquarium.', type: 'positive', isUsed: false, data: { subject1: 'bulle', category1: 'poisson', subject2: 'petit', category2: 'aquarium' } },
    { id: 'clue5', text: 'Le grand aquarium a un château.', type: 'positive', isUsed: false, data: { subject1: 'grand', category1: 'aquarium', subject2: 'chateau', category2: 'decor' } },
  ],
  solution: {
    poisson: { nemo: ['grand', 'chateau'], dory: ['moyen', 'plantes'], bulle: ['petit', 'corail'] },
    aquarium: { grand: ['chateau'], moyen: ['plantes'], petit: ['corail'] },
  },
  hintsAvailable: 3,
  idealTime: 150, // Temps ajusté pour progression cohérente
};

// ============================================================================
// PUZZLES NIVEAU 16-20 (Difficile - 3 catégories, 4 éléments)
// Pour enfants 8-9 ans
// ============================================================================

const PUZZLE_SUPERHEROS: LogixPuzzle = {
  id: 'superheros-16',
  name: 'L\'école des super-héros',
  description: 'Quel super-pouvoir a chaque héros et quelle est sa couleur ?',
  difficulty: 3,
  categories: [
    {
      id: 'heros',
      name: 'Héros',
      items: [
        { id: 'flash', name: 'Flash', emoji: '⚡' },
        { id: 'titan', name: 'Titan', emoji: '💪' },
        { id: 'aqua', name: 'Aqua', emoji: '💧' },
        { id: 'phoenix', name: 'Phoenix', emoji: '🔥' },
      ],
    },
    {
      id: 'pouvoir',
      name: 'Pouvoir',
      items: [
        { id: 'vitesse', name: 'Vitesse', emoji: '💨' },
        { id: 'force', name: 'Force', emoji: '🦾' },
        { id: 'vol', name: 'Vol', emoji: '🦅' },
        { id: 'invisibilite', name: 'Invisibilité', emoji: '👻' },
      ],
    },
    {
      id: 'couleur',
      name: 'Couleur',
      items: [
        { id: 'rouge', name: 'Rouge', emoji: '🔴' },
        { id: 'bleu', name: 'Bleu', emoji: '🔵' },
        { id: 'vert', name: 'Vert', emoji: '🟢' },
        { id: 'jaune', name: 'Jaune', emoji: '🟡' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Flash a le pouvoir de vitesse.', type: 'positive', isUsed: false, data: { subject1: 'flash', category1: 'heros', subject2: 'vitesse', category2: 'pouvoir' } },
    { id: 'clue2', text: 'Le héros bleu peut voler.', type: 'positive', isUsed: false, data: { subject1: 'bleu', category1: 'couleur', subject2: 'vol', category2: 'pouvoir' } },
    { id: 'clue3', text: 'Titan n\'est pas rouge.', type: 'negative', isUsed: false, data: { subject1: 'titan', category1: 'heros', subject2: 'rouge', category2: 'couleur', isNegative: true } },
    { id: 'clue4', text: 'Aqua est bleu.', type: 'positive', isUsed: false, data: { subject1: 'aqua', category1: 'heros', subject2: 'bleu', category2: 'couleur' } },
    { id: 'clue5', text: 'Phoenix porte du rouge.', type: 'positive', isUsed: false, data: { subject1: 'phoenix', category1: 'heros', subject2: 'rouge', category2: 'couleur' } },
    { id: 'clue6', text: 'Flash est jaune.', type: 'positive', isUsed: false, data: { subject1: 'flash', category1: 'heros', subject2: 'jaune', category2: 'couleur' } },
    { id: 'clue7', text: 'Titan a une force incroyable.', type: 'positive', isUsed: false, data: { subject1: 'titan', category1: 'heros', subject2: 'force', category2: 'pouvoir' } },
  ],
  solution: {
    heros: { flash: ['vitesse', 'jaune'], titan: ['force', 'vert'], aqua: ['vol', 'bleu'], phoenix: ['invisibilite', 'rouge'] },
    pouvoir: { vitesse: ['jaune'], force: ['vert'], vol: ['bleu'], invisibilite: ['rouge'] },
  },
  hintsAvailable: 4,
  idealTime: 180,
};

const PUZZLE_RESTAURANT: LogixPuzzle = {
  id: 'restaurant-17',
  name: 'Au restaurant',
  description: 'Qui a commandé quel plat avec quelle boisson ?',
  difficulty: 3,
  categories: [
    {
      id: 'client',
      name: 'Client',
      items: [
        { id: 'pierre', name: 'Pierre', emoji: '👨' },
        { id: 'marie', name: 'Marie', emoji: '👩' },
        { id: 'lucas', name: 'Lucas', emoji: '👦' },
        { id: 'chloe', name: 'Chloé', emoji: '👧' },
      ],
    },
    {
      id: 'plat',
      name: 'Plat',
      items: [
        { id: 'pizza', name: 'Pizza', emoji: '🍕' },
        { id: 'pates', name: 'Pâtes', emoji: '🍝' },
        { id: 'burger', name: 'Burger', emoji: '🍔' },
        { id: 'sushi', name: 'Sushi', emoji: '🍣' },
      ],
    },
    {
      id: 'boisson',
      name: 'Boisson',
      items: [
        { id: 'eau', name: 'Eau', emoji: '💧' },
        { id: 'jus', name: 'Jus', emoji: '🧃' },
        { id: 'soda', name: 'Soda', emoji: '🥤' },
        { id: 'lait', name: 'Lait', emoji: '🥛' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Pierre a commandé une pizza.', type: 'positive', isUsed: false, data: { subject1: 'pierre', category1: 'client', subject2: 'pizza', category2: 'plat' } },
    { id: 'clue2', text: 'Marie boit du jus.', type: 'positive', isUsed: false, data: { subject1: 'marie', category1: 'client', subject2: 'jus', category2: 'boisson' } },
    { id: 'clue3', text: 'Lucas n\'aime pas le soda.', type: 'negative', isUsed: false, data: { subject1: 'lucas', category1: 'client', subject2: 'soda', category2: 'boisson', isNegative: true } },
    { id: 'clue4', text: 'Chloé mange des sushis.', type: 'positive', isUsed: false, data: { subject1: 'chloe', category1: 'client', subject2: 'sushi', category2: 'plat' } },
    { id: 'clue5', text: 'Le burger va avec le soda.', type: 'positive', isUsed: false, data: { subject1: 'burger', category1: 'plat', subject2: 'soda', category2: 'boisson' } },
    { id: 'clue6', text: 'Pierre boit de l\'eau.', type: 'positive', isUsed: false, data: { subject1: 'pierre', category1: 'client', subject2: 'eau', category2: 'boisson' } },
    { id: 'clue7', text: 'Marie mange des pâtes.', type: 'positive', isUsed: false, data: { subject1: 'marie', category1: 'client', subject2: 'pates', category2: 'plat' } },
  ],
  solution: {
    client: { pierre: ['pizza', 'eau'], marie: ['pates', 'jus'], lucas: ['burger', 'lait'], chloe: ['sushi', 'soda'] },
    plat: { pizza: ['eau'], pates: ['jus'], burger: ['soda'], sushi: ['lait'] },
  },
  hintsAvailable: 4,
  idealTime: 180,
};

const PUZZLE_CAMPING: LogixPuzzle = {
  id: 'camping-18',
  name: 'Le camping',
  description: 'Quelle tente, quel sac de couchage pour chaque campeur ?',
  difficulty: 3,
  categories: [
    {
      id: 'campeur',
      name: 'Campeur',
      items: [
        { id: 'jules', name: 'Jules', emoji: '👦' },
        { id: 'emma', name: 'Emma', emoji: '👧' },
        { id: 'theo', name: 'Théo', emoji: '👦' },
        { id: 'lea', name: 'Léa', emoji: '👧' },
      ],
    },
    {
      id: 'tente',
      name: 'Tente',
      items: [
        { id: 'rouge', name: 'Rouge', emoji: '⛺' },
        { id: 'bleue', name: 'Bleue', emoji: '🏕️' },
        { id: 'verte', name: 'Verte', emoji: '🎪' },
        { id: 'jaune', name: 'Jaune', emoji: '🏠' },
      ],
    },
    {
      id: 'activite',
      name: 'Activité',
      items: [
        { id: 'peche', name: 'Pêche', emoji: '🎣' },
        { id: 'rando', name: 'Randonnée', emoji: '🥾' },
        { id: 'kayak', name: 'Kayak', emoji: '🛶' },
        { id: 'escalade', name: 'Escalade', emoji: '🧗' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Jules dort dans la tente rouge.', type: 'positive', isUsed: false, data: { subject1: 'jules', category1: 'campeur', subject2: 'rouge', category2: 'tente' } },
    { id: 'clue2', text: 'Emma fait du kayak.', type: 'positive', isUsed: false, data: { subject1: 'emma', category1: 'campeur', subject2: 'kayak', category2: 'activite' } },
    { id: 'clue3', text: 'Théo n\'est pas dans la tente verte.', type: 'negative', isUsed: false, data: { subject1: 'theo', category1: 'campeur', subject2: 'verte', category2: 'tente', isNegative: true } },
    { id: 'clue4', text: 'La tente bleue est pour celui qui pêche.', type: 'positive', isUsed: false, data: { subject1: 'bleue', category1: 'tente', subject2: 'peche', category2: 'activite' } },
    { id: 'clue5', text: 'Léa dort dans la tente verte.', type: 'positive', isUsed: false, data: { subject1: 'lea', category1: 'campeur', subject2: 'verte', category2: 'tente' } },
    { id: 'clue6', text: 'Jules fait de l\'escalade.', type: 'positive', isUsed: false, data: { subject1: 'jules', category1: 'campeur', subject2: 'escalade', category2: 'activite' } },
    { id: 'clue7', text: 'Théo pêche.', type: 'positive', isUsed: false, data: { subject1: 'theo', category1: 'campeur', subject2: 'peche', category2: 'activite' } },
  ],
  solution: {
    campeur: { jules: ['rouge', 'escalade'], emma: ['jaune', 'kayak'], theo: ['bleue', 'peche'], lea: ['verte', 'rando'] },
    tente: { rouge: ['escalade'], jaune: ['kayak'], bleue: ['peche'], verte: ['rando'] },
  },
  hintsAvailable: 4,
  idealTime: 180,
};

const PUZZLE_ZOO: LogixPuzzle = {
  id: 'zoo-19',
  name: 'Visite au zoo',
  description: 'Quel animal préféré et quelle heure de visite ?',
  difficulty: 3,
  categories: [
    {
      id: 'visiteur',
      name: 'Visiteur',
      items: [
        { id: 'paul', name: 'Paul', emoji: '👦' },
        { id: 'julie', name: 'Julie', emoji: '👧' },
        { id: 'marc', name: 'Marc', emoji: '👦' },
        { id: 'lola', name: 'Lola', emoji: '👧' },
      ],
    },
    {
      id: 'animal',
      name: 'Animal',
      items: [
        { id: 'lion', name: 'Lion', emoji: '🦁' },
        { id: 'elephant', name: 'Éléphant', emoji: '🐘' },
        { id: 'girafe', name: 'Girafe', emoji: '🦒' },
        { id: 'singe', name: 'Singe', emoji: '🐒' },
      ],
    },
    {
      id: 'heure',
      name: 'Heure',
      items: [
        { id: 'h10', name: '10h', emoji: '🕙' },
        { id: 'h11', name: '11h', emoji: '🕚' },
        { id: 'h14', name: '14h', emoji: '🕑' },
        { id: 'h15', name: '15h', emoji: '🕒' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Paul adore les lions.', type: 'positive', isUsed: false, data: { subject1: 'paul', category1: 'visiteur', subject2: 'lion', category2: 'animal' } },
    { id: 'clue2', text: 'Julie visite à 11h.', type: 'positive', isUsed: false, data: { subject1: 'julie', category1: 'visiteur', subject2: 'h11', category2: 'heure' } },
    { id: 'clue3', text: 'Marc ne visite pas à 10h.', type: 'negative', isUsed: false, data: { subject1: 'marc', category1: 'visiteur', subject2: 'h10', category2: 'heure', isNegative: true } },
    { id: 'clue4', text: 'Les singes sont visités à 14h.', type: 'positive', isUsed: false, data: { subject1: 'singe', category1: 'animal', subject2: 'h14', category2: 'heure' } },
    { id: 'clue5', text: 'Lola préfère les girafes.', type: 'positive', isUsed: false, data: { subject1: 'lola', category1: 'visiteur', subject2: 'girafe', category2: 'animal' } },
    { id: 'clue6', text: 'Paul visite à 10h.', type: 'positive', isUsed: false, data: { subject1: 'paul', category1: 'visiteur', subject2: 'h10', category2: 'heure' } },
    { id: 'clue7', text: 'Marc adore les singes.', type: 'positive', isUsed: false, data: { subject1: 'marc', category1: 'visiteur', subject2: 'singe', category2: 'animal' } },
  ],
  solution: {
    visiteur: { paul: ['lion', 'h10'], julie: ['elephant', 'h11'], marc: ['singe', 'h14'], lola: ['girafe', 'h15'] },
    animal: { lion: ['h10'], elephant: ['h11'], singe: ['h14'], girafe: ['h15'] },
  },
  hintsAvailable: 4,
  idealTime: 180,
};

const PUZZLE_BIBLIOTHEQUE: LogixPuzzle = {
  id: 'bibliotheque-20',
  name: 'À la bibliothèque',
  description: 'Quel livre emprunte chaque enfant et où s\'assoit-il ?',
  difficulty: 3,
  categories: [
    {
      id: 'lecteur',
      name: 'Lecteur',
      items: [
        { id: 'alice', name: 'Alice', emoji: '👧' },
        { id: 'bob', name: 'Bob', emoji: '👦' },
        { id: 'clara', name: 'Clara', emoji: '👧' },
        { id: 'david', name: 'David', emoji: '👦' },
      ],
    },
    {
      id: 'livre',
      name: 'Livre',
      items: [
        { id: 'conte', name: 'Conte', emoji: '📖' },
        { id: 'bd', name: 'BD', emoji: '📚' },
        { id: 'science', name: 'Sciences', emoji: '🔬' },
        { id: 'histoire', name: 'Histoire', emoji: '📜' },
      ],
    },
    {
      id: 'place',
      name: 'Place',
      items: [
        { id: 'fenetre', name: 'Fenêtre', emoji: '🪟' },
        { id: 'coussin', name: 'Coussin', emoji: '🛋️' },
        { id: 'table', name: 'Table', emoji: '🪑' },
        { id: 'pouf', name: 'Pouf', emoji: '🟤' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Alice lit un conte.', type: 'positive', isUsed: false, data: { subject1: 'alice', category1: 'lecteur', subject2: 'conte', category2: 'livre' } },
    { id: 'clue2', text: 'Bob s\'assoit près de la fenêtre.', type: 'positive', isUsed: false, data: { subject1: 'bob', category1: 'lecteur', subject2: 'fenetre', category2: 'place' } },
    { id: 'clue3', text: 'Clara ne lit pas de BD.', type: 'negative', isUsed: false, data: { subject1: 'clara', category1: 'lecteur', subject2: 'bd', category2: 'livre', isNegative: true } },
    { id: 'clue4', text: 'David lit un livre de sciences.', type: 'positive', isUsed: false, data: { subject1: 'david', category1: 'lecteur', subject2: 'science', category2: 'livre' } },
    { id: 'clue5', text: 'Le conte se lit sur le coussin.', type: 'positive', isUsed: false, data: { subject1: 'conte', category1: 'livre', subject2: 'coussin', category2: 'place' } },
    { id: 'clue6', text: 'Bob lit une BD.', type: 'positive', isUsed: false, data: { subject1: 'bob', category1: 'lecteur', subject2: 'bd', category2: 'livre' } },
    { id: 'clue7', text: 'David s\'assoit à la table.', type: 'positive', isUsed: false, data: { subject1: 'david', category1: 'lecteur', subject2: 'table', category2: 'place' } },
  ],
  solution: {
    lecteur: { alice: ['conte', 'coussin'], bob: ['bd', 'fenetre'], clara: ['histoire', 'pouf'], david: ['science', 'table'] },
    livre: { conte: ['coussin'], bd: ['fenetre'], histoire: ['pouf'], science: ['table'] },
  },
  hintsAvailable: 4,
  idealTime: 180,
};

// ============================================================================
// PUZZLES NIVEAU 21-25 (Expert - 3-4 catégories, 4-5 éléments)
// Pour enfants 9-10 ans
// ============================================================================

const PUZZLE_SPACE: LogixPuzzle = {
  id: 'space-21',
  name: 'Mission spatiale',
  description: 'Quel astronaute, quelle planète, quel vaisseau ?',
  difficulty: 3,
  categories: [
    {
      id: 'astronaute',
      name: 'Astronaute',
      items: [
        { id: 'nova', name: 'Nova', emoji: '👩‍🚀' },
        { id: 'orion', name: 'Orion', emoji: '👨‍🚀' },
        { id: 'stella', name: 'Stella', emoji: '👩‍🚀' },
        { id: 'cosmos', name: 'Cosmos', emoji: '👨‍🚀' },
      ],
    },
    {
      id: 'planete',
      name: 'Planète',
      items: [
        { id: 'mars', name: 'Mars', emoji: '🔴' },
        { id: 'jupiter', name: 'Jupiter', emoji: '🟠' },
        { id: 'saturne', name: 'Saturne', emoji: '🪐' },
        { id: 'neptune', name: 'Neptune', emoji: '🔵' },
      ],
    },
    {
      id: 'vaisseau',
      name: 'Vaisseau',
      items: [
        { id: 'fusee', name: 'Fusée', emoji: '🚀' },
        { id: 'navette', name: 'Navette', emoji: '🛸' },
        { id: 'station', name: 'Station', emoji: '🛰️' },
        { id: 'module', name: 'Module', emoji: '📡' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Nova voyage vers Mars.', type: 'positive', isUsed: false, data: { subject1: 'nova', category1: 'astronaute', subject2: 'mars', category2: 'planete' } },
    { id: 'clue2', text: 'Orion pilote la navette.', type: 'positive', isUsed: false, data: { subject1: 'orion', category1: 'astronaute', subject2: 'navette', category2: 'vaisseau' } },
    { id: 'clue3', text: 'Stella n\'utilise pas la fusée.', type: 'negative', isUsed: false, data: { subject1: 'stella', category1: 'astronaute', subject2: 'fusee', category2: 'vaisseau', isNegative: true } },
    { id: 'clue4', text: 'La fusée va vers Jupiter.', type: 'positive', isUsed: false, data: { subject1: 'fusee', category1: 'vaisseau', subject2: 'jupiter', category2: 'planete' } },
    { id: 'clue5', text: 'Cosmos explore Saturne.', type: 'positive', isUsed: false, data: { subject1: 'cosmos', category1: 'astronaute', subject2: 'saturne', category2: 'planete' } },
    { id: 'clue6', text: 'Nova pilote une fusée.', type: 'positive', isUsed: false, data: { subject1: 'nova', category1: 'astronaute', subject2: 'fusee', category2: 'vaisseau' } },
    { id: 'clue7', text: 'Orion va vers Neptune.', type: 'positive', isUsed: false, data: { subject1: 'orion', category1: 'astronaute', subject2: 'neptune', category2: 'planete' } },
  ],
  solution: {
    astronaute: { nova: ['mars', 'fusee'], orion: ['neptune', 'navette'], stella: ['jupiter', 'module'], cosmos: ['saturne', 'station'] },
    planete: { mars: ['fusee'], neptune: ['navette'], jupiter: ['module'], saturne: ['station'] },
  },
  hintsAvailable: 4,
  idealTime: 200,
};

/**
 * PUZZLE 22 - Expert (9-10 ans)
 * Complexité cognitive : Chaînes transitives multiples, aucun indice suspect↔objet direct
 * L'enfant doit : combiner suspect↔lieu + objet↔lieu pour déduire suspect↔objet
 * Indices négatifs stratégiques pour forcer le raisonnement par élimination
 */
const PUZZLE_DETECTIVE: LogixPuzzle = {
  id: 'detective-22',
  name: 'Enquête au manoir',
  description: 'Qui était où avec quel objet ?',
  difficulty: 3,
  categories: [
    {
      id: 'suspect',
      name: 'Suspect',
      items: [
        { id: 'colonel', name: 'Colonel', emoji: '🎖️' },
        { id: 'professeur', name: 'Professeur', emoji: '👨‍🏫' },
        { id: 'duchesse', name: 'Duchesse', emoji: '👸' },
        { id: 'majordome', name: 'Majordome', emoji: '🤵' },
      ],
    },
    {
      id: 'lieu',
      name: 'Lieu',
      items: [
        { id: 'salon', name: 'Salon', emoji: '🛋️' },
        { id: 'cuisine', name: 'Cuisine', emoji: '🍳' },
        { id: 'jardin', name: 'Jardin', emoji: '🌳' },
        { id: 'bibliotheque', name: 'Bibliothèque', emoji: '📚' },
      ],
    },
    {
      id: 'objet',
      name: 'Objet',
      items: [
        { id: 'cle', name: 'Clé', emoji: '🔑' },
        { id: 'chandelier', name: 'Chandelier', emoji: '🕯️' },
        { id: 'livre', name: 'Livre', emoji: '📖' },
        { id: 'vase', name: 'Vase', emoji: '🏺' },
      ],
    },
  ],
  clues: [
    // AUCUN indice suspect↔objet direct ! Tout par transitivité via le lieu
    { id: 'clue1', text: 'Le Colonel était au salon.', type: 'positive', isUsed: false, data: { subject1: 'colonel', category1: 'suspect', subject2: 'salon', category2: 'lieu' } },
    { id: 'clue2', text: 'Le chandelier était au salon.', type: 'positive', isUsed: false, data: { subject1: 'chandelier', category1: 'objet', subject2: 'salon', category2: 'lieu' } },
    // TRANSITIF : Colonel=Salon + Salon=Chandelier → Colonel=Chandelier
    { id: 'clue3', text: 'Le livre était dans la bibliothèque.', type: 'positive', isUsed: false, data: { subject1: 'livre', category1: 'objet', subject2: 'bibliotheque', category2: 'lieu' } },
    { id: 'clue4', text: 'Le vase était au jardin.', type: 'positive', isUsed: false, data: { subject1: 'vase', category1: 'objet', subject2: 'jardin', category2: 'lieu' } },
    { id: 'clue5', text: 'La Duchesse n\'était pas au jardin.', type: 'negative', isUsed: false, data: { subject1: 'duchesse', category1: 'suspect', subject2: 'jardin', category2: 'lieu', isNegative: true } },
    { id: 'clue6', text: 'La Duchesse n\'était pas en cuisine.', type: 'negative', isUsed: false, data: { subject1: 'duchesse', category1: 'suspect', subject2: 'cuisine', category2: 'lieu', isNegative: true } },
    // Duchesse ≠ Jardin, ≠ Cuisine, ≠ Salon (Colonel) → Duchesse = Bibliothèque → Duchesse = Livre
    { id: 'clue7', text: 'Le Majordome était au jardin.', type: 'positive', isUsed: false, data: { subject1: 'majordome', category1: 'suspect', subject2: 'jardin', category2: 'lieu' } },
    // Majordome=Jardin + Jardin=Vase → Majordome=Vase
    // Professeur = Cuisine (seul lieu restant) → Professeur = Clé (seul objet restant)
  ],
  solution: {
    suspect: { colonel: ['salon', 'chandelier'], professeur: ['cuisine', 'cle'], duchesse: ['bibliotheque', 'livre'], majordome: ['jardin', 'vase'] },
    lieu: { salon: ['chandelier'], cuisine: ['cle'], bibliotheque: ['livre'], jardin: ['vase'] },
  },
  hintsAvailable: 4,
  idealTime: 240, // Temps augmenté car complexité cognitive plus élevée
};

const PUZZLE_OLYMPIADES: LogixPuzzle = {
  id: 'olympiades-23',
  name: 'Les olympiades',
  description: 'Quel sport, quelle médaille, quel pays ?',
  difficulty: 3,
  categories: [
    {
      id: 'athlete',
      name: 'Athlète',
      items: [
        { id: 'alex', name: 'Alex', emoji: '🏃' },
        { id: 'bella', name: 'Bella', emoji: '🏃‍♀️' },
        { id: 'carlos', name: 'Carlos', emoji: '🏋️' },
        { id: 'diana', name: 'Diana', emoji: '🤸' },
      ],
    },
    {
      id: 'sport',
      name: 'Sport',
      items: [
        { id: 'course', name: 'Course', emoji: '🏃' },
        { id: 'natation', name: 'Natation', emoji: '🏊' },
        { id: 'gym', name: 'Gymnastique', emoji: '🤸' },
        { id: 'tennis', name: 'Tennis', emoji: '🎾' },
      ],
    },
    {
      id: 'medaille',
      name: 'Médaille',
      items: [
        { id: 'or', name: 'Or', emoji: '🥇' },
        { id: 'argent', name: 'Argent', emoji: '🥈' },
        { id: 'bronze', name: 'Bronze', emoji: '🥉' },
        { id: 'aucune', name: 'Aucune', emoji: '4️⃣' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Alex fait de la course.', type: 'positive', isUsed: false, data: { subject1: 'alex', category1: 'athlete', subject2: 'course', category2: 'sport' } },
    { id: 'clue2', text: 'Bella a gagné l\'or.', type: 'positive', isUsed: false, data: { subject1: 'bella', category1: 'athlete', subject2: 'or', category2: 'medaille' } },
    { id: 'clue3', text: 'Carlos ne fait pas de natation.', type: 'negative', isUsed: false, data: { subject1: 'carlos', category1: 'athlete', subject2: 'natation', category2: 'sport', isNegative: true } },
    { id: 'clue4', text: 'La gymnastique rapporte l\'argent.', type: 'positive', isUsed: false, data: { subject1: 'gym', category1: 'sport', subject2: 'argent', category2: 'medaille' } },
    { id: 'clue5', text: 'Diana fait de la gymnastique.', type: 'positive', isUsed: false, data: { subject1: 'diana', category1: 'athlete', subject2: 'gym', category2: 'sport' } },
    { id: 'clue6', text: 'Alex a le bronze.', type: 'positive', isUsed: false, data: { subject1: 'alex', category1: 'athlete', subject2: 'bronze', category2: 'medaille' } },
    { id: 'clue7', text: 'Bella fait de la natation.', type: 'positive', isUsed: false, data: { subject1: 'bella', category1: 'athlete', subject2: 'natation', category2: 'sport' } },
  ],
  solution: {
    athlete: { alex: ['course', 'bronze'], bella: ['natation', 'or'], carlos: ['tennis', 'aucune'], diana: ['gym', 'argent'] },
    sport: { course: ['bronze'], natation: ['or'], tennis: ['aucune'], gym: ['argent'] },
  },
  hintsAvailable: 4,
  idealTime: 200,
};

const PUZZLE_MAGIE: LogixPuzzle = {
  id: 'magie-24',
  name: 'L\'école de magie',
  description: 'Quel sort, quelle baguette, quelle maison ?',
  difficulty: 3,
  categories: [
    {
      id: 'eleve',
      name: 'Élève',
      items: [
        { id: 'merlin', name: 'Merlin', emoji: '🧙' },
        { id: 'morgane', name: 'Morgane', emoji: '🧙‍♀️' },
        { id: 'gandalf', name: 'Gandalf', emoji: '🧙‍♂️' },
        { id: 'fiona', name: 'Fiona', emoji: '🧚' },
      ],
    },
    {
      id: 'sort',
      name: 'Sort',
      items: [
        { id: 'feu', name: 'Feu', emoji: '🔥' },
        { id: 'glace', name: 'Glace', emoji: '❄️' },
        { id: 'lumiere', name: 'Lumière', emoji: '✨' },
        { id: 'vent', name: 'Vent', emoji: '💨' },
      ],
    },
    {
      id: 'baguette',
      name: 'Baguette',
      items: [
        { id: 'chene', name: 'Chêne', emoji: '🌳' },
        { id: 'saule', name: 'Saule', emoji: '🌿' },
        { id: 'houx', name: 'Houx', emoji: '🍀' },
        { id: 'orme', name: 'Orme', emoji: '🌲' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Merlin maîtrise le feu.', type: 'positive', isUsed: false, data: { subject1: 'merlin', category1: 'eleve', subject2: 'feu', category2: 'sort' } },
    { id: 'clue2', text: 'Morgane a une baguette en saule.', type: 'positive', isUsed: false, data: { subject1: 'morgane', category1: 'eleve', subject2: 'saule', category2: 'baguette' } },
    { id: 'clue3', text: 'Gandalf ne fait pas de magie de glace.', type: 'negative', isUsed: false, data: { subject1: 'gandalf', category1: 'eleve', subject2: 'glace', category2: 'sort', isNegative: true } },
    { id: 'clue4', text: 'La baguette en chêne canalise le feu.', type: 'positive', isUsed: false, data: { subject1: 'chene', category1: 'baguette', subject2: 'feu', category2: 'sort' } },
    { id: 'clue5', text: 'Fiona maîtrise la lumière.', type: 'positive', isUsed: false, data: { subject1: 'fiona', category1: 'eleve', subject2: 'lumiere', category2: 'sort' } },
    { id: 'clue6', text: 'Gandalf utilise le vent.', type: 'positive', isUsed: false, data: { subject1: 'gandalf', category1: 'eleve', subject2: 'vent', category2: 'sort' } },
    { id: 'clue7', text: 'La baguette en houx est pour la lumière.', type: 'positive', isUsed: false, data: { subject1: 'houx', category1: 'baguette', subject2: 'lumiere', category2: 'sort' } },
  ],
  solution: {
    eleve: { merlin: ['feu', 'chene'], morgane: ['glace', 'saule'], gandalf: ['vent', 'orme'], fiona: ['lumiere', 'houx'] },
    sort: { feu: ['chene'], glace: ['saule'], vent: ['orme'], lumiere: ['houx'] },
  },
  hintsAvailable: 4,
  idealTime: 200,
};

const PUZZLE_TRESOR: LogixPuzzle = {
  id: 'tresor-25',
  name: 'La chasse au trésor',
  description: 'Quel indice, quel lieu, quel trésor ?',
  difficulty: 3,
  categories: [
    {
      id: 'chercheur',
      name: 'Chercheur',
      items: [
        { id: 'jack', name: 'Jack', emoji: '🏴‍☠️' },
        { id: 'rose', name: 'Rose', emoji: '🌹' },
        { id: 'sam', name: 'Sam', emoji: '🗺️' },
        { id: 'lily', name: 'Lily', emoji: '🔍' },
      ],
    },
    {
      id: 'lieu',
      name: 'Lieu',
      items: [
        { id: 'grotte', name: 'Grotte', emoji: '🕳️' },
        { id: 'ile', name: 'Île', emoji: '🏝️' },
        { id: 'foret', name: 'Forêt', emoji: '🌲' },
        { id: 'chateau', name: 'Château', emoji: '🏰' },
      ],
    },
    {
      id: 'tresor',
      name: 'Trésor',
      items: [
        { id: 'or', name: 'Or', emoji: '💰' },
        { id: 'diamants', name: 'Diamants', emoji: '💎' },
        { id: 'couronne', name: 'Couronne', emoji: '👑' },
        { id: 'carte', name: 'Carte', emoji: '🗺️' },
      ],
    },
  ],
  clues: [
    { id: 'clue1', text: 'Jack cherche dans la grotte.', type: 'positive', isUsed: false, data: { subject1: 'jack', category1: 'chercheur', subject2: 'grotte', category2: 'lieu' } },
    { id: 'clue2', text: 'Rose trouve des diamants.', type: 'positive', isUsed: false, data: { subject1: 'rose', category1: 'chercheur', subject2: 'diamants', category2: 'tresor' } },
    { id: 'clue3', text: 'Sam n\'est pas dans la forêt.', type: 'negative', isUsed: false, data: { subject1: 'sam', category1: 'chercheur', subject2: 'foret', category2: 'lieu', isNegative: true } },
    { id: 'clue4', text: 'L\'or est dans la grotte.', type: 'positive', isUsed: false, data: { subject1: 'or', category1: 'tresor', subject2: 'grotte', category2: 'lieu' } },
    { id: 'clue5', text: 'Lily explore le château.', type: 'positive', isUsed: false, data: { subject1: 'lily', category1: 'chercheur', subject2: 'chateau', category2: 'lieu' } },
    { id: 'clue6', text: 'Sam cherche sur l\'île.', type: 'positive', isUsed: false, data: { subject1: 'sam', category1: 'chercheur', subject2: 'ile', category2: 'lieu' } },
    { id: 'clue7', text: 'La couronne est au château.', type: 'positive', isUsed: false, data: { subject1: 'couronne', category1: 'tresor', subject2: 'chateau', category2: 'lieu' } },
  ],
  solution: {
    chercheur: { jack: ['grotte', 'or'], rose: ['foret', 'diamants'], sam: ['ile', 'carte'], lily: ['chateau', 'couronne'] },
    lieu: { grotte: ['or'], foret: ['diamants'], ile: ['carte'], chateau: ['couronne'] },
  },
  hintsAvailable: 4,
  idealTime: 200,
};

// ============================================================================
// EXPORTS
// ============================================================================

export const LOGIX_PUZZLES: LogixPuzzle[] = [
  // Niveau 1-3 (Facile - 6-7 ans)
  PUZZLE_ANIMAUX_COULEURS,   // 1
  PUZZLE_ENFANTS_FRUITS,     // 2
  PUZZLE_METIERS_OUTILS,     // 3
  // Niveau 4-6 (Facile+ - 6-7 ans)
  PUZZLE_ANIMAUX_MAISONS,    // 4
  PUZZLE_SPORTS_ENFANTS,     // 5
  PUZZLE_VEHICULES_ENFANTS,  // 6
  // Niveau 7-10 (Moyen - 7-8 ans)
  PUZZLE_MAISON_COMPLETE,    // 7
  PUZZLE_ECOLE_MATIERES,     // 8
  PUZZLE_FETE_ANNIVERSAIRE,  // 9
  PUZZLE_VACANCES,           // 10
  // Niveau 11-15 (Moyen+ - 7-8 ans)
  PUZZLE_CINEMA,             // 11
  PUZZLE_MUSIQUE,            // 12
  PUZZLE_JARDINAGE,          // 13
  PUZZLE_PIQUENIQUE,         // 14
  PUZZLE_AQUARIUM,           // 15
  // Niveau 16-20 (Difficile - 8-9 ans)
  PUZZLE_SUPERHEROS,         // 16
  PUZZLE_RESTAURANT,         // 17
  PUZZLE_CAMPING,            // 18
  PUZZLE_ZOO,                // 19
  PUZZLE_BIBLIOTHEQUE,       // 20
  // Niveau 21-25 (Expert - 9-10 ans)
  PUZZLE_SPACE,              // 21
  PUZZLE_DETECTIVE,          // 22
  PUZZLE_OLYMPIADES,         // 23
  PUZZLE_MAGIE,              // 24
  PUZZLE_TRESOR,             // 25
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
