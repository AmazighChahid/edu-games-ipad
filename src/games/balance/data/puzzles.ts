/**
 * Balance Logic - Puzzle Definitions
 * 30 levels across 4 phases following Montessori progression
 */

import type { Puzzle, Equivalence, Phase } from '../types';

// ============================================
// PHASE 1: IDENTICAL OBJECTS (Levels 1-5)
// Age: 6-7 years - Understand balance concept
// ============================================

const phase1Puzzles: Puzzle[] = [
  {
    id: 'balance_1',
    level: 1,
    phase: 1,
    difficulty: 1,
    ageGroup: '6-7',
    name: 'Première balance',
    description: 'Mets la même chose à droite',
    initialLeft: [{ objectId: 'apple', count: 1 }],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 5 }],
    targetBalance: true,
    hints: [
      'La balance penche à gauche...',
      'Mets une pomme à droite !',
    ],
    maxHintsForThreeStars: 0,
    maxAttemptsForThreeStars: 1,
    possibleEquivalences: [{
      id: 'eq_1_1',
      leftSide: [{ objectId: 'apple', count: 1 }],
      rightSide: [{ objectId: 'apple', count: 1 }],
      displayString: '🍎 = 🍎',
    }],
  },
  {
    id: 'balance_2',
    level: 2,
    phase: 1,
    difficulty: 1,
    ageGroup: '6-7',
    name: 'Deux pommes',
    description: 'Équilibre avec 2 pommes',
    initialLeft: [{ objectId: 'apple', count: 2 }],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 5 }],
    targetBalance: true,
    hints: [
      'Compte les pommes à gauche : 1, 2...',
      'Il faut 2 pommes à droite aussi !',
    ],
    maxHintsForThreeStars: 0,
    maxAttemptsForThreeStars: 2,
    possibleEquivalences: [{
      id: 'eq_1_2',
      leftSide: [{ objectId: 'apple', count: 2 }],
      rightSide: [{ objectId: 'apple', count: 2 }],
      displayString: '🍎🍎 = 🍎🍎',
    }],
  },
  {
    id: 'balance_3',
    level: 3,
    phase: 1,
    difficulty: 1,
    ageGroup: '6-7',
    name: 'Trois pommes',
    description: 'Équilibre avec 3 pommes',
    initialLeft: [{ objectId: 'apple', count: 3 }],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 6 }],
    targetBalance: true,
    hints: [
      'Il y a 3 pommes à gauche',
      'Combien en faut-il à droite ?',
    ],
    maxHintsForThreeStars: 0,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_1_3',
      leftSide: [{ objectId: 'apple', count: 3 }],
      rightSide: [{ objectId: 'apple', count: 3 }],
      displayString: '🍎🍎🍎 = 🍎🍎🍎',
    }],
  },
  {
    id: 'balance_4',
    level: 4,
    phase: 1,
    difficulty: 1,
    ageGroup: '6-7',
    name: 'Des bananes',
    description: 'Cette fois avec des bananes !',
    initialLeft: [{ objectId: 'banana', count: 2 }],
    initialRight: [],
    availableObjects: [{ objectId: 'banana', count: 5 }],
    targetBalance: true,
    hints: [
      'Il y a 2 bananes à gauche',
      'Mets 2 bananes à droite 🍌🍌',
    ],
    maxHintsForThreeStars: 0,
    maxAttemptsForThreeStars: 2,
    possibleEquivalences: [{
      id: 'eq_1_4',
      leftSide: [{ objectId: 'banana', count: 2 }],
      rightSide: [{ objectId: 'banana', count: 2 }],
      displayString: '🍌🍌 = 🍌🍌',
    }],
  },
  {
    id: 'balance_5',
    level: 5,
    phase: 1,
    difficulty: 1,
    ageGroup: '6-7',
    name: 'Quatre fruits',
    description: 'Un défi avec 4 pommes',
    initialLeft: [{ objectId: 'apple', count: 4 }],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 6 }],
    targetBalance: true,
    hints: [
      'Compte bien : 1, 2, 3, 4 pommes !',
      'Il faut 4 pommes à droite',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 4,
    possibleEquivalences: [{
      id: 'eq_1_5',
      leftSide: [{ objectId: 'apple', count: 4 }],
      rightSide: [{ objectId: 'apple', count: 4 }],
      displayString: '🍎🍎🍎🍎 = 🍎🍎🍎🍎',
    }],
  },
];

// ============================================
// PHASE 2: EQUIVALENCES (Levels 6-12)
// Age: 7-8 years - Different objects can have same weight
// ============================================

const phase2Puzzles: Puzzle[] = [
  {
    id: 'balance_6',
    level: 6,
    phase: 2,
    difficulty: 2,
    ageGroup: '7-8',
    name: 'La pastèque mystérieuse',
    description: 'Découvre le poids de la pastèque',
    initialLeft: [{ objectId: 'watermelon', count: 1 }],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 6 }],
    targetBalance: true,
    hints: [
      'La pastèque est lourde... Combien de pommes ?',
      'Essaie d\'ajouter des pommes une par une.',
      'La pastèque = 3 pommes !',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 4,
    possibleEquivalences: [{
      id: 'eq_2_6',
      leftSide: [{ objectId: 'watermelon', count: 1 }],
      rightSide: [{ objectId: 'apple', count: 3 }],
      displayString: '🍉 = 🍎🍎🍎',
    }],
  },
  {
    id: 'balance_7',
    level: 7,
    phase: 2,
    difficulty: 2,
    ageGroup: '7-8',
    name: 'La banane',
    description: 'Combien de pommes pour une banane ?',
    initialLeft: [{ objectId: 'banana', count: 1 }],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 5 }],
    targetBalance: true,
    hints: [
      'Une banane est plus lourde qu\'une pomme',
      '1 banane = 2 pommes 🍌 = 🍎🍎',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_2_7',
      leftSide: [{ objectId: 'banana', count: 1 }],
      rightSide: [{ objectId: 'apple', count: 2 }],
      displayString: '🍌 = 🍎🍎',
    }],
  },
  {
    id: 'balance_8',
    level: 8,
    phase: 2,
    difficulty: 2,
    ageGroup: '7-8',
    name: 'Deux bananes',
    description: 'Si 1 banane = 2 pommes...',
    initialLeft: [{ objectId: 'banana', count: 2 }],
    initialRight: [],
    availableObjects: [
      { objectId: 'apple', count: 6 },
      { objectId: 'banana', count: 2 },
    ],
    targetBalance: true,
    hints: [
      'Tu sais que 1 banane = 2 pommes',
      'Alors 2 bananes = ?',
      '2 bananes = 4 pommes !',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_2_8',
      leftSide: [{ objectId: 'banana', count: 2 }],
      rightSide: [{ objectId: 'apple', count: 4 }],
      displayString: '🍌🍌 = 🍎🍎🍎🍎',
    }],
  },
  {
    id: 'balance_9',
    level: 9,
    phase: 2,
    difficulty: 2,
    ageGroup: '7-8',
    name: 'L\'ananas',
    description: 'L\'ananas est encore plus lourd !',
    initialLeft: [{ objectId: 'pineapple', count: 1 }],
    initialRight: [],
    availableObjects: [
      { objectId: 'apple', count: 6 },
      { objectId: 'banana', count: 4 },
    ],
    targetBalance: true,
    hints: [
      'Un ananas est très lourd...',
      'Essaie 4 pommes ou 2 bananes',
      '1 ananas = 4 pommes = 2 bananes',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 4,
    possibleEquivalences: [
      {
        id: 'eq_2_9a',
        leftSide: [{ objectId: 'pineapple', count: 1 }],
        rightSide: [{ objectId: 'apple', count: 4 }],
        displayString: '🍍 = 🍎🍎🍎🍎',
      },
      {
        id: 'eq_2_9b',
        leftSide: [{ objectId: 'pineapple', count: 1 }],
        rightSide: [{ objectId: 'banana', count: 2 }],
        displayString: '🍍 = 🍌🍌',
      },
    ],
  },
  {
    id: 'balance_10',
    level: 10,
    phase: 2,
    difficulty: 2,
    ageGroup: '7-8',
    name: 'L\'éléphant',
    description: 'Un éléphant, c\'est lourd !',
    initialLeft: [{ objectId: 'elephant', count: 1 }],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 8 }],
    targetBalance: true,
    hints: [
      'L\'éléphant est le plus lourd animal',
      'Il faut beaucoup de pommes...',
      '1 éléphant = 5 pommes !',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 5,
    possibleEquivalences: [{
      id: 'eq_2_10',
      leftSide: [{ objectId: 'elephant', count: 1 }],
      rightSide: [{ objectId: 'apple', count: 5 }],
      displayString: '🐘 = 🍎🍎🍎🍎🍎',
    }],
  },
  {
    id: 'balance_11',
    level: 11,
    phase: 2,
    difficulty: 3,
    ageGroup: '7-8',
    name: 'Pastèque + banane',
    description: 'Combine des fruits différents',
    initialLeft: [
      { objectId: 'watermelon', count: 1 },
      { objectId: 'banana', count: 1 },
    ],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 8 }],
    targetBalance: true,
    hints: [
      '🍉 = 3🍎 et 🍌 = 2🍎',
      'Combien de pommes en tout ?',
      '3 + 2 = 5 pommes !',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 4,
    possibleEquivalences: [{
      id: 'eq_2_11',
      leftSide: [
        { objectId: 'watermelon', count: 1 },
        { objectId: 'banana', count: 1 },
      ],
      rightSide: [{ objectId: 'apple', count: 5 }],
      displayString: '🍉 + 🍌 = 🍎🍎🍎🍎🍎',
    }],
  },
  {
    id: 'balance_12',
    level: 12,
    phase: 2,
    difficulty: 3,
    ageGroup: '7-8',
    name: 'Deux pastèques',
    description: 'Double défi !',
    initialLeft: [{ objectId: 'watermelon', count: 2 }],
    initialRight: [],
    availableObjects: [
      { objectId: 'apple', count: 8 },
      { objectId: 'banana', count: 4 },
    ],
    targetBalance: true,
    hints: [
      '1 pastèque = 3 pommes',
      'Donc 2 pastèques = ?',
      '6 pommes ou 3 bananes !',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 4,
    possibleEquivalences: [{
      id: 'eq_2_12',
      leftSide: [{ objectId: 'watermelon', count: 2 }],
      rightSide: [{ objectId: 'apple', count: 6 }],
      displayString: '🍉🍉 = 🍎🍎🍎🍎🍎🍎',
    }],
  },
];

// ============================================
// PHASE 3: NUMERIC WEIGHTS (Levels 13-20)
// Age: 8-9 years - Work with numbers and addition
// ============================================

const phase3Puzzles: Puzzle[] = [
  {
    id: 'balance_13',
    level: 13,
    phase: 3,
    difficulty: 3,
    ageGroup: '8-9',
    name: 'Premier calcul',
    description: 'Fais 5 avec les poids',
    initialLeft: [{ objectId: 'weight_5', count: 1 }],
    initialRight: [],
    availableObjects: [
      { objectId: 'weight_1', count: 2 },
      { objectId: 'weight_2', count: 2 },
      { objectId: 'weight_3', count: 2 },
      { objectId: 'weight_4', count: 2 },
    ],
    targetBalance: true,
    hints: [
      'Il faut faire 5 à droite.',
      'Quels nombres font 5 ensemble ?',
      '2 + 3 = 5 ou 1 + 4 = 5 !',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_3_13',
      leftSide: [{ objectId: 'weight_5', count: 1 }],
      rightSide: [
        { objectId: 'weight_2', count: 1 },
        { objectId: 'weight_3', count: 1 },
      ],
      displayString: '5 = 2 + 3',
    }],
  },
  {
    id: 'balance_14',
    level: 14,
    phase: 3,
    difficulty: 3,
    ageGroup: '8-9',
    name: 'Faire 7',
    description: 'Trouve comment faire 7',
    initialLeft: [{ objectId: 'weight_7', count: 1 }],
    initialRight: [],
    availableObjects: [
      { objectId: 'weight_1', count: 2 },
      { objectId: 'weight_2', count: 2 },
      { objectId: 'weight_3', count: 2 },
      { objectId: 'weight_4', count: 2 },
      { objectId: 'weight_5', count: 1 },
    ],
    targetBalance: true,
    hints: [
      'Quels nombres font 7 ?',
      '3 + 4 = 7 ou 2 + 5 = 7',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_3_14',
      leftSide: [{ objectId: 'weight_7', count: 1 }],
      rightSide: [
        { objectId: 'weight_3', count: 1 },
        { objectId: 'weight_4', count: 1 },
      ],
      displayString: '7 = 3 + 4',
    }],
  },
  {
    id: 'balance_15',
    level: 15,
    phase: 3,
    difficulty: 3,
    ageGroup: '8-9',
    name: 'Faire 10',
    description: 'Le nombre 10 !',
    initialLeft: [{ objectId: 'weight_10', count: 1 }],
    initialRight: [],
    availableObjects: [
      { objectId: 'weight_2', count: 2 },
      { objectId: 'weight_3', count: 2 },
      { objectId: 'weight_4', count: 2 },
      { objectId: 'weight_5', count: 2 },
      { objectId: 'weight_6', count: 1 },
    ],
    targetBalance: true,
    hints: [
      'Quels nombres font 10 ?',
      '4 + 6 = 10 ou 5 + 5 = 10',
      'Ou même 2 + 3 + 5 = 10 !',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 4,
    possibleEquivalences: [{
      id: 'eq_3_15',
      leftSide: [{ objectId: 'weight_10', count: 1 }],
      rightSide: [
        { objectId: 'weight_4', count: 1 },
        { objectId: 'weight_6', count: 1 },
      ],
      displayString: '10 = 4 + 6',
    }],
  },
  {
    id: 'balance_16',
    level: 16,
    phase: 3,
    difficulty: 3,
    ageGroup: '8-9',
    name: 'Somme à gauche',
    description: '3 + 2 égale quoi ?',
    initialLeft: [
      { objectId: 'weight_3', count: 1 },
      { objectId: 'weight_2', count: 1 },
    ],
    initialRight: [],
    availableObjects: [
      { objectId: 'weight_1', count: 2 },
      { objectId: 'weight_2', count: 1 },
      { objectId: 'weight_3', count: 1 },
      { objectId: 'weight_4', count: 1 },
      { objectId: 'weight_5', count: 1 },
    ],
    targetBalance: true,
    hints: [
      'Gauche = 3 + 2 = ?',
      'Il faut 5 à droite !',
    ],
    maxHintsForThreeStars: 0,
    maxAttemptsForThreeStars: 2,
    possibleEquivalences: [{
      id: 'eq_3_16',
      leftSide: [
        { objectId: 'weight_3', count: 1 },
        { objectId: 'weight_2', count: 1 },
      ],
      rightSide: [{ objectId: 'weight_5', count: 1 }],
      displayString: '3 + 2 = 5',
    }],
  },
  {
    id: 'balance_17',
    level: 17,
    phase: 3,
    difficulty: 4,
    ageGroup: '8-9',
    name: 'Grand total',
    description: '6 + 3 = ?',
    initialLeft: [
      { objectId: 'weight_6', count: 1 },
      { objectId: 'weight_3', count: 1 },
    ],
    initialRight: [],
    availableObjects: [
      { objectId: 'weight_2', count: 2 },
      { objectId: 'weight_4', count: 1 },
      { objectId: 'weight_5', count: 1 },
      { objectId: 'weight_7', count: 1 },
      { objectId: 'weight_9', count: 1 },
    ],
    targetBalance: true,
    hints: [
      '6 + 3 = 9',
      'Mets le poids 9 ou 4 + 5 !',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_3_17',
      leftSide: [
        { objectId: 'weight_6', count: 1 },
        { objectId: 'weight_3', count: 1 },
      ],
      rightSide: [{ objectId: 'weight_9', count: 1 }],
      displayString: '6 + 3 = 9',
    }],
  },
  {
    id: 'balance_18',
    level: 18,
    phase: 3,
    difficulty: 4,
    ageGroup: '8-9',
    name: 'Double',
    description: '4 + 4 = ?',
    initialLeft: [{ objectId: 'weight_4', count: 2 }],
    initialRight: [],
    availableObjects: [
      { objectId: 'weight_2', count: 2 },
      { objectId: 'weight_3', count: 2 },
      { objectId: 'weight_5', count: 1 },
      { objectId: 'weight_6', count: 1 },
      { objectId: 'weight_8', count: 1 },
    ],
    targetBalance: true,
    hints: [
      '4 + 4 = 8',
      'Mets le 8 ou combine 2 + 6 ou 3 + 5 !',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_3_18',
      leftSide: [{ objectId: 'weight_4', count: 2 }],
      rightSide: [{ objectId: 'weight_8', count: 1 }],
      displayString: '4 + 4 = 8',
    }],
  },
  {
    id: 'balance_19',
    level: 19,
    phase: 3,
    difficulty: 4,
    ageGroup: '8-9',
    name: 'Triple addition',
    description: '2 + 3 + 4 = ?',
    initialLeft: [
      { objectId: 'weight_2', count: 1 },
      { objectId: 'weight_3', count: 1 },
      { objectId: 'weight_4', count: 1 },
    ],
    initialRight: [],
    availableObjects: [
      { objectId: 'weight_1', count: 1 },
      { objectId: 'weight_4', count: 1 },
      { objectId: 'weight_5', count: 1 },
      { objectId: 'weight_7', count: 1 },
      { objectId: 'weight_9', count: 1 },
    ],
    targetBalance: true,
    hints: [
      '2 + 3 + 4 = 9',
      'Mets le 9 ou 4 + 5 !',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_3_19',
      leftSide: [
        { objectId: 'weight_2', count: 1 },
        { objectId: 'weight_3', count: 1 },
        { objectId: 'weight_4', count: 1 },
      ],
      rightSide: [{ objectId: 'weight_9', count: 1 }],
      displayString: '2 + 3 + 4 = 9',
    }],
  },
  {
    id: 'balance_20',
    level: 20,
    phase: 3,
    difficulty: 4,
    ageGroup: '8-9',
    name: 'Défi équilibre',
    description: 'Les deux côtés ont déjà des poids !',
    initialLeft: [
      { objectId: 'weight_3', count: 1 },
      { objectId: 'weight_4', count: 1 },
    ],
    initialRight: [{ objectId: 'weight_2', count: 1 }],
    availableObjects: [
      { objectId: 'weight_1', count: 1 },
      { objectId: 'weight_2', count: 1 },
      { objectId: 'weight_3', count: 1 },
      { objectId: 'weight_4', count: 1 },
      { objectId: 'weight_5', count: 1 },
    ],
    targetBalance: true,
    hints: [
      'Gauche = 3 + 4 = 7, Droite = 2',
      'Il manque combien à droite ?',
      'Il faut ajouter 5 ! (7 - 2 = 5)',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_3_20',
      leftSide: [
        { objectId: 'weight_3', count: 1 },
        { objectId: 'weight_4', count: 1 },
      ],
      rightSide: [
        { objectId: 'weight_2', count: 1 },
        { objectId: 'weight_5', count: 1 },
      ],
      displayString: '3 + 4 = 2 + 5',
    }],
  },
];

// ============================================
// PHASE 4: PRE-ALGEBRA / EQUATIONS (Levels 21-30)
// Age: 9-10 years - Solve for unknown
// ============================================

const phase4Puzzles: Puzzle[] = [
  {
    id: 'balance_21',
    level: 21,
    phase: 4,
    difficulty: 4,
    ageGroup: '9-10',
    name: 'L\'inconnue',
    description: 'Trouve la valeur du ?',
    initialLeft: [{ objectId: 'weight_5', count: 1 }],
    initialRight: [
      { objectId: 'unknown', count: 1 },
      { objectId: 'weight_2', count: 1 },
    ],
    availableObjects: [
      { objectId: 'weight_1', count: 1 },
      { objectId: 'weight_2', count: 1 },
      { objectId: 'weight_3', count: 1 },
      { objectId: 'weight_4', count: 1 },
    ],
    targetBalance: true,
    unknownValue: 3,
    hints: [
      '5 = ? + 2. Que vaut ? ?',
      'Si tu enlèves 2 des deux côtés...',
      '? = 3 car 5 - 2 = 3',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_4_21',
      leftSide: [{ objectId: 'weight_5', count: 1 }],
      rightSide: [
        { objectId: 'weight_3', count: 1 },
        { objectId: 'weight_2', count: 1 },
      ],
      displayString: '5 = ? + 2 → ? = 3',
    }],
  },
  {
    id: 'balance_22',
    level: 22,
    phase: 4,
    difficulty: 4,
    ageGroup: '9-10',
    name: 'Mystère à 8',
    description: '8 = ? + 3',
    initialLeft: [{ objectId: 'weight_8', count: 1 }],
    initialRight: [
      { objectId: 'unknown', count: 1 },
      { objectId: 'weight_3', count: 1 },
    ],
    availableObjects: [
      { objectId: 'weight_2', count: 1 },
      { objectId: 'weight_3', count: 1 },
      { objectId: 'weight_4', count: 1 },
      { objectId: 'weight_5', count: 1 },
      { objectId: 'weight_6', count: 1 },
    ],
    targetBalance: true,
    unknownValue: 5,
    hints: [
      '8 = ? + 3',
      '8 - 3 = ?',
      '? = 5',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_4_22',
      leftSide: [{ objectId: 'weight_8', count: 1 }],
      rightSide: [
        { objectId: 'weight_5', count: 1 },
        { objectId: 'weight_3', count: 1 },
      ],
      displayString: '8 = ? + 3 → ? = 5',
    }],
  },
  {
    id: 'balance_23',
    level: 23,
    phase: 4,
    difficulty: 4,
    ageGroup: '9-10',
    name: 'L\'autre côté',
    description: '3 + ? = 7',
    initialLeft: [
      { objectId: 'weight_3', count: 1 },
      { objectId: 'unknown', count: 1 },
    ],
    initialRight: [{ objectId: 'weight_7', count: 1 }],
    availableObjects: [
      { objectId: 'weight_2', count: 1 },
      { objectId: 'weight_3', count: 1 },
      { objectId: 'weight_4', count: 1 },
      { objectId: 'weight_5', count: 1 },
    ],
    targetBalance: true,
    unknownValue: 4,
    hints: [
      '3 + ? = 7',
      '? = 7 - 3',
      '? = 4',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_4_23',
      leftSide: [
        { objectId: 'weight_3', count: 1 },
        { objectId: 'weight_4', count: 1 },
      ],
      rightSide: [{ objectId: 'weight_7', count: 1 }],
      displayString: '3 + ? = 7 → ? = 4',
    }],
  },
  {
    id: 'balance_24',
    level: 24,
    phase: 4,
    difficulty: 5,
    ageGroup: '9-10',
    name: 'Double mystère',
    description: '10 = ? + ? (même valeur)',
    initialLeft: [{ objectId: 'weight_10', count: 1 }],
    initialRight: [{ objectId: 'unknown', count: 2 }],
    availableObjects: [
      { objectId: 'weight_3', count: 2 },
      { objectId: 'weight_4', count: 2 },
      { objectId: 'weight_5', count: 2 },
      { objectId: 'weight_6', count: 2 },
    ],
    targetBalance: true,
    unknownValue: 5,
    hints: [
      '10 = ? + ? où les deux ? sont pareils',
      'Quel nombre doublé fait 10 ?',
      '? = 5 car 5 + 5 = 10',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_4_24',
      leftSide: [{ objectId: 'weight_10', count: 1 }],
      rightSide: [{ objectId: 'weight_5', count: 2 }],
      displayString: '10 = ? + ? → ? = 5',
    }],
  },
  {
    id: 'balance_25',
    level: 25,
    phase: 4,
    difficulty: 5,
    ageGroup: '9-10',
    name: 'Équation mixte',
    description: '? + 4 = 9',
    initialLeft: [
      { objectId: 'unknown', count: 1 },
      { objectId: 'weight_4', count: 1 },
    ],
    initialRight: [{ objectId: 'weight_9', count: 1 }],
    availableObjects: [
      { objectId: 'weight_3', count: 1 },
      { objectId: 'weight_4', count: 1 },
      { objectId: 'weight_5', count: 1 },
      { objectId: 'weight_6', count: 1 },
    ],
    targetBalance: true,
    unknownValue: 5,
    hints: [
      '? + 4 = 9',
      '? = 9 - 4',
      '? = 5',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_4_25',
      leftSide: [
        { objectId: 'weight_5', count: 1 },
        { objectId: 'weight_4', count: 1 },
      ],
      rightSide: [{ objectId: 'weight_9', count: 1 }],
      displayString: '? + 4 = 9 → ? = 5',
    }],
  },
  {
    id: 'balance_26',
    level: 26,
    phase: 4,
    difficulty: 5,
    ageGroup: '9-10',
    name: 'Réflexion',
    description: '6 + ? = 2 + ? + 3',
    initialLeft: [
      { objectId: 'weight_6', count: 1 },
      { objectId: 'unknown', count: 1 },
    ],
    initialRight: [
      { objectId: 'weight_2', count: 1 },
      { objectId: 'unknown', count: 1 },
      { objectId: 'weight_3', count: 1 },
    ],
    availableObjects: [
      { objectId: 'weight_1', count: 2 },
      { objectId: 'weight_2', count: 2 },
      { objectId: 'weight_3', count: 2 },
    ],
    targetBalance: true,
    unknownValue: 1,
    hints: [
      'Les ? sont pareils des deux côtés',
      '6 = 2 + 3 = 5, pas équilibré...',
      'Ajoute 1 des deux côtés : 6 + 1 = 2 + 1 + 3 + 1 → Non ! Le ? est le même !',
    ],
    maxHintsForThreeStars: 2,
    maxAttemptsForThreeStars: 4,
    possibleEquivalences: [{
      id: 'eq_4_26',
      leftSide: [
        { objectId: 'weight_6', count: 1 },
        { objectId: 'weight_1', count: 1 },
      ],
      rightSide: [
        { objectId: 'weight_2', count: 1 },
        { objectId: 'weight_1', count: 1 },
        { objectId: 'weight_3', count: 1 },
      ],
      displayString: '6 + 1 = 2 + 1 + 3',
    }],
  },
  {
    id: 'balance_27',
    level: 27,
    phase: 4,
    difficulty: 5,
    ageGroup: '9-10',
    name: 'Triple inconnue',
    description: '? + ? + 2 = 8',
    initialLeft: [
      { objectId: 'unknown', count: 2 },
      { objectId: 'weight_2', count: 1 },
    ],
    initialRight: [{ objectId: 'weight_8', count: 1 }],
    availableObjects: [
      { objectId: 'weight_2', count: 2 },
      { objectId: 'weight_3', count: 2 },
      { objectId: 'weight_4', count: 2 },
    ],
    targetBalance: true,
    unknownValue: 3,
    hints: [
      '? + ? + 2 = 8',
      '? + ? = 8 - 2 = 6',
      'Si ? + ? = 6, alors ? = 3',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_4_27',
      leftSide: [
        { objectId: 'weight_3', count: 2 },
        { objectId: 'weight_2', count: 1 },
      ],
      rightSide: [{ objectId: 'weight_8', count: 1 }],
      displayString: '? + ? + 2 = 8 → ? = 3',
    }],
  },
  {
    id: 'balance_28',
    level: 28,
    phase: 4,
    difficulty: 5,
    ageGroup: '9-10',
    name: 'Triple égal',
    description: '15 = ? + ? + ?',
    initialLeft: [{ objectId: 'weight_10', count: 1 }, { objectId: 'weight_5', count: 1 }],
    initialRight: [{ objectId: 'unknown', count: 3 }],
    availableObjects: [
      { objectId: 'weight_3', count: 3 },
      { objectId: 'weight_4', count: 3 },
      { objectId: 'weight_5', count: 3 },
      { objectId: 'weight_6', count: 3 },
    ],
    targetBalance: true,
    unknownValue: 5,
    hints: [
      '15 = ? + ? + ? (tous pareils)',
      '15 ÷ 3 = ?',
      '? = 5 car 5 + 5 + 5 = 15',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_4_28',
      leftSide: [
        { objectId: 'weight_10', count: 1 },
        { objectId: 'weight_5', count: 1 },
      ],
      rightSide: [{ objectId: 'weight_5', count: 3 }],
      displayString: '15 = ? + ? + ? → ? = 5',
    }],
  },
  {
    id: 'balance_29',
    level: 29,
    phase: 4,
    difficulty: 5,
    ageGroup: '9-10',
    name: 'Multiplication',
    description: '? × 2 = 8',
    initialLeft: [{ objectId: 'unknown', count: 2 }],
    initialRight: [{ objectId: 'weight_8', count: 1 }],
    availableObjects: [
      { objectId: 'weight_2', count: 2 },
      { objectId: 'weight_3', count: 2 },
      { objectId: 'weight_4', count: 2 },
      { objectId: 'weight_5', count: 2 },
    ],
    targetBalance: true,
    unknownValue: 4,
    hints: [
      '? + ? = 8 (c\'est comme ? × 2)',
      'Quel nombre doublé fait 8 ?',
      '? = 4 car 4 × 2 = 8',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_4_29',
      leftSide: [{ objectId: 'weight_4', count: 2 }],
      rightSide: [{ objectId: 'weight_8', count: 1 }],
      displayString: '? × 2 = 8 → ? = 4',
    }],
  },
  {
    id: 'balance_30',
    level: 30,
    phase: 4,
    difficulty: 5,
    ageGroup: '9-10',
    name: 'Défi final',
    description: 'Le grand défi !',
    initialLeft: [
      { objectId: 'weight_6', count: 1 },
      { objectId: 'unknown', count: 1 },
    ],
    initialRight: [
      { objectId: 'weight_3', count: 1 },
      { objectId: 'weight_7', count: 1 },
    ],
    availableObjects: [
      { objectId: 'weight_1', count: 2 },
      { objectId: 'weight_2', count: 2 },
      { objectId: 'weight_3', count: 2 },
      { objectId: 'weight_4', count: 2 },
      { objectId: 'weight_5', count: 2 },
    ],
    targetBalance: true,
    unknownValue: 4,
    hints: [
      '6 + ? = 3 + 7 = 10',
      '? = 10 - 6',
      '? = 4',
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
    possibleEquivalences: [{
      id: 'eq_4_30',
      leftSide: [
        { objectId: 'weight_6', count: 1 },
        { objectId: 'weight_4', count: 1 },
      ],
      rightSide: [
        { objectId: 'weight_3', count: 1 },
        { objectId: 'weight_7', count: 1 },
      ],
      displayString: '6 + 4 = 3 + 7 = 10',
    }],
  },
];

// ============================================
// COMBINED PUZZLES
// ============================================

export const balancePuzzles: Puzzle[] = [
  ...phase1Puzzles,
  ...phase2Puzzles,
  ...phase3Puzzles,
  ...phase4Puzzles,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getAllPuzzles(): Puzzle[] {
  return balancePuzzles;
}

export function getPuzzleById(id: string): Puzzle | undefined {
  return balancePuzzles.find((p) => p.id === id);
}

export function getPuzzleByLevel(level: number): Puzzle | undefined {
  return balancePuzzles.find((p) => p.level === level);
}

export function getPuzzlesByPhase(phase: Phase): Puzzle[] {
  return balancePuzzles.filter((p) => p.phase === phase);
}

export function getPuzzlesByDifficulty(difficulty: number): Puzzle[] {
  return balancePuzzles.filter((p) => p.difficulty === difficulty);
}

export function getPuzzlesByAgeGroup(ageGroup: string): Puzzle[] {
  return balancePuzzles.filter((p) => p.ageGroup === ageGroup);
}

export function getNextPuzzle(currentLevel: number): Puzzle | undefined {
  return balancePuzzles.find((p) => p.level === currentLevel + 1);
}

export function isPhaseUnlocked(phase: Phase, completedLevels: number): boolean {
  const requirements: Record<Phase, number> = {
    1: 0,
    2: 5,
    3: 12,
    4: 20,
  };
  return completedLevels >= requirements[phase];
}

export function getPhaseProgress(phase: Phase, completedPuzzleIds: string[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const phasePuzzles = getPuzzlesByPhase(phase);
  const completed = phasePuzzles.filter((p) => completedPuzzleIds.includes(p.id)).length;
  return {
    completed,
    total: phasePuzzles.length,
    percentage: Math.round((completed / phasePuzzles.length) * 100),
  };
}
