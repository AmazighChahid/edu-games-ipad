/**
 * Définitions des 10 niveaux de La Fabrique de Réactions
 * ======================================================
 * Progression pédagogique : du simple au complexe
 *
 * Niveaux 1-3 : Découverte (mode 'complete')
 * Niveaux 4-6 : Apprentissage (mode 'complete' + nouveaux éléments)
 * Niveaux 7-8 : Maîtrise (modes variés)
 * Niveaux 9-10 : Expert (puzzles complexes)
 */

import type { LevelConfig, PlacedElement, GridPosition } from '../types';

// ============================================
// HELPER: Créer un élément placé
// ============================================

function createPlacedElement(
  id: string,
  elementId: string,
  row: number,
  col: number,
  isFixed: boolean = true
): PlacedElement {
  return {
    id,
    elementId,
    position: { row, col },
    rotation: 0,
    state: 'idle',
    isFixed,
  };
}

// ============================================
// NIVEAU 1 : Premier Contact
// ============================================

const level1: LevelConfig = {
  id: 'fabrique-1',
  number: 1,
  title: 'Premier Contact',
  mode: 'complete',
  difficulty: 'easy',

  gridSize: { rows: 3, cols: 4 },

  fixedElements: [
    createPlacedElement('source-1', 'hamster_wheel', 1, 0, true),
    createPlacedElement('goal-1', 'bell', 1, 3, true),
  ],

  emptySlots: [{ row: 1, col: 1 }, { row: 1, col: 2 }],

  availableElements: ['dominos', 'ball'],

  optimalSolution: [
    createPlacedElement('placed-1', 'dominos', 1, 1, false),
    createPlacedElement('placed-2', 'ball', 1, 2, false),
  ],
  optimalMoves: 2,

  stars3Threshold: 2,
  stars2Threshold: 4,

  introDialogue: "Salut, petit inventeur ! Je suis Gédéon. Place les éléments pour que l'énergie atteigne la cloche !",
  hintDialogues: [
    "Regarde bien la direction de l'énergie...",
    "Les dominos transmettent l'impact de gauche à droite !",
    "Place les dominos au milieu, puis la balle.",
  ],
  victoryDialogue: "BRAVO ! Tu as compris le principe ! L'énergie voyage de pièce en pièce !",

  unlocksElement: 'gear',
};

// ============================================
// NIVEAU 2 : Rotation Magique
// ============================================

const level2: LevelConfig = {
  id: 'fabrique-2',
  number: 2,
  title: 'Rotation Magique',
  mode: 'complete',
  difficulty: 'easy',

  gridSize: { rows: 3, cols: 5 },

  fixedElements: [
    createPlacedElement('source-1', 'hamster_wheel', 1, 0, true),
    createPlacedElement('goal-1', 'light', 1, 4, true),
  ],

  emptySlots: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }],

  availableElements: ['gear', 'gear', 'gear'],

  optimalSolution: [
    createPlacedElement('placed-1', 'gear', 1, 1, false),
    createPlacedElement('placed-2', 'gear', 1, 2, false),
    createPlacedElement('placed-3', 'gear', 1, 3, false),
  ],
  optimalMoves: 3,

  stars3Threshold: 3,
  stars2Threshold: 5,

  introDialogue: "Nouveau défi ! Utilise les engrenages pour transmettre la rotation jusqu'à la lumière !",
  hintDialogues: [
    "Les engrenages doivent se toucher pour transmettre l'énergie...",
    "Place un engrenage après l'autre, de gauche à droite !",
    "Trois engrenages en ligne feront l'affaire !",
  ],
  victoryDialogue: "PAR MES MOUSTACHES ! Tu maîtrises déjà les engrenages !",
};

// ============================================
// NIVEAU 3 : La Rampe Glissante
// ============================================

const level3: LevelConfig = {
  id: 'fabrique-3',
  number: 3,
  title: 'La Rampe Glissante',
  mode: 'complete',
  difficulty: 'easy',

  gridSize: { rows: 4, cols: 4 },

  fixedElements: [
    createPlacedElement('source-1', 'spring', 0, 0, true),
    createPlacedElement('ball-1', 'ball', 0, 1, true),
    createPlacedElement('goal-1', 'bell', 3, 3, true),
  ],

  emptySlots: [
    { row: 1, col: 1 },
    { row: 2, col: 2 },
  ],

  availableElements: ['ramp', 'ramp', 'marble'],

  optimalSolution: [
    createPlacedElement('placed-1', 'ramp', 1, 1, false),
    createPlacedElement('placed-2', 'ramp', 2, 2, false),
  ],
  optimalMoves: 2,

  stars3Threshold: 2,
  stars2Threshold: 4,

  introDialogue: "Le ressort va pousser la balle ! Place les rampes pour qu'elle atteigne la cloche en bas.",
  hintDialogues: [
    "La balle doit descendre... utilise les rampes !",
    "Les rampes font rouler les objets vers le bas.",
    "Place une rampe, puis une autre plus bas.",
  ],
  victoryDialogue: "Quelle glissade ! Tu comprends comment l'énergie circule !",

  unlocksElement: 'marble',
};

// ============================================
// NIVEAU 4 : Double Chemin
// ============================================

const level4: LevelConfig = {
  id: 'fabrique-4',
  number: 4,
  title: 'Double Chemin',
  mode: 'complete',
  difficulty: 'medium',

  gridSize: { rows: 4, cols: 5 },

  fixedElements: [
    createPlacedElement('source-1', 'hamster_wheel', 0, 0, true),
    createPlacedElement('gear-fixed', 'gear', 0, 1, true),
    createPlacedElement('goal-1', 'fan', 0, 4, true),
    createPlacedElement('goal-2', 'light', 3, 4, true),
  ],

  emptySlots: [
    { row: 0, col: 2 },
    { row: 0, col: 3 },
    { row: 1, col: 4 },
    { row: 2, col: 4 },
  ],

  availableElements: ['gear', 'gear', 'gear', 'gear'],

  optimalSolution: [
    createPlacedElement('placed-1', 'gear', 0, 2, false),
    createPlacedElement('placed-2', 'gear', 0, 3, false),
  ],
  optimalMoves: 2,

  stars3Threshold: 2,
  stars2Threshold: 4,

  introDialogue: "Cette machine a DEUX objectifs ! Mais un seul chemin suffit. Trouve lequel !",
  hintDialogues: [
    "Tu n'as pas besoin d'activer les DEUX objectifs...",
    "Le ventilateur est plus proche, non ?",
    "Relie les engrenages en ligne jusqu'au ventilateur !",
  ],
  victoryDialogue: "Tu as choisi le bon chemin ! Parfois, la solution la plus simple est la meilleure.",

  unlocksElement: 'spring',
};

// ============================================
// NIVEAU 5 : Le Levier Magique
// ============================================

const level5: LevelConfig = {
  id: 'fabrique-5',
  number: 5,
  title: 'Le Levier Magique',
  mode: 'complete',
  difficulty: 'medium',

  gridSize: { rows: 4, cols: 5 },

  fixedElements: [
    createPlacedElement('source-1', 'spring', 0, 0, true),
    createPlacedElement('ball-1', 'ball', 0, 1, true),
    createPlacedElement('goal-1', 'flag', 3, 4, true),
  ],

  emptySlots: [
    { row: 1, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 3 },
  ],

  availableElements: ['ramp', 'lever', 'marble'],

  optimalSolution: [
    createPlacedElement('placed-1', 'ramp', 1, 1, false),
    createPlacedElement('placed-2', 'lever', 2, 2, false),
    createPlacedElement('placed-3', 'marble', 3, 3, false),
  ],
  optimalMoves: 3,

  stars3Threshold: 3,
  stars2Threshold: 5,

  introDialogue: "Nouveau venu : le LEVIER ! Il bascule quand on appuie et transmet l'énergie.",
  hintDialogues: [
    "La balle roule sur la rampe, puis...",
    "Le levier transforme l'impact en poussée !",
    "Rampe → Levier → Bille vers le drapeau !",
  ],
  victoryDialogue: "Le levier a basculé pile comme il faut ! Tu deviens un vrai ingénieur !",

  unlocksElement: 'lever',
};

// ============================================
// NIVEAU 6 : Circuit Électrique
// ============================================

const level6: LevelConfig = {
  id: 'fabrique-6',
  number: 6,
  title: 'Circuit Électrique',
  mode: 'complete',
  difficulty: 'medium',

  gridSize: { rows: 4, cols: 5 },

  fixedElements: [
    createPlacedElement('source-1', 'spring', 0, 0, true),
    createPlacedElement('ball-1', 'ball', 0, 1, true),
    createPlacedElement('goal-1', 'light', 3, 4, true),
  ],

  emptySlots: [
    { row: 1, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 3 },
  ],

  availableElements: ['ramp', 'button', 'dominos'],

  optimalSolution: [
    createPlacedElement('placed-1', 'ramp', 1, 1, false),
    createPlacedElement('placed-2', 'button', 2, 2, false),
  ],
  optimalMoves: 2,

  stars3Threshold: 2,
  stars2Threshold: 4,

  introDialogue: "Le BOUTON transforme un impact en électricité ! Parfait pour allumer des lumières.",
  hintDialogues: [
    "La balle doit appuyer sur le bouton...",
    "Le bouton envoie de l'électricité à la lumière !",
    "Rampe pour faire tomber la balle sur le bouton.",
  ],
  victoryDialogue: "L'électricité circule ! Tu comprends maintenant les transformations d'énergie !",

  unlocksElement: 'button',
};

// ============================================
// NIVEAU 7 : La Grande Poulie
// ============================================

const level7: LevelConfig = {
  id: 'fabrique-7',
  number: 7,
  title: 'La Grande Poulie',
  mode: 'complete',
  difficulty: 'hard',

  gridSize: { rows: 5, cols: 5 },

  fixedElements: [
    createPlacedElement('source-1', 'hamster_wheel', 4, 0, true),
    createPlacedElement('gear-1', 'gear', 4, 1, true),
    createPlacedElement('goal-1', 'light', 0, 4, true),
  ],

  emptySlots: [
    { row: 4, col: 2 },
    { row: 3, col: 2 },
    { row: 2, col: 2 },
    { row: 1, col: 3 },
    { row: 0, col: 3 },
  ],

  availableElements: ['gear', 'pulley', 'lever', 'gear', 'dominos'],

  optimalSolution: [
    createPlacedElement('placed-1', 'gear', 4, 2, false),
    createPlacedElement('placed-2', 'pulley', 2, 2, false),
    createPlacedElement('placed-3', 'gear', 0, 3, false),
  ],
  optimalMoves: 3,

  stars3Threshold: 3,
  stars2Threshold: 6,

  introDialogue: "La POULIE change la direction de la force ! Elle monte ce qui descend.",
  hintDialogues: [
    "L'énergie doit monter... la poulie peut aider !",
    "Engrenage → Poulie → Engrenage vers la lumière.",
    "La poulie est au milieu pour changer de direction.",
  ],
  victoryDialogue: "Tu maîtrises les poulies ! L'énergie peut maintenant voyager dans toutes les directions !",

  unlocksElement: 'pulley',
};

// ============================================
// NIVEAU 8 : Rebond Trampoline
// ============================================

const level8: LevelConfig = {
  id: 'fabrique-8',
  number: 8,
  title: 'Rebond Trampoline',
  mode: 'complete',
  difficulty: 'hard',

  gridSize: { rows: 5, cols: 5 },

  fixedElements: [
    createPlacedElement('source-1', 'spring', 0, 0, true),
    createPlacedElement('ball-1', 'ball', 0, 1, true),
    createPlacedElement('goal-1', 'bell', 0, 4, true),
  ],

  emptySlots: [
    { row: 1, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 2 },
    { row: 2, col: 3 },
    { row: 1, col: 3 },
  ],

  availableElements: ['ramp', 'trampoline', 'ramp', 'dominos', 'marble'],

  optimalSolution: [
    createPlacedElement('placed-1', 'ramp', 1, 1, false),
    createPlacedElement('placed-2', 'ramp', 2, 2, false),
    createPlacedElement('placed-3', 'trampoline', 3, 2, false),
    createPlacedElement('placed-4', 'ramp', 2, 3, false),
  ],
  optimalMoves: 4,

  stars3Threshold: 4,
  stars2Threshold: 7,

  introDialogue: "Le TRAMPOLINE fait rebondir ! La balle descend puis remonte. Quel parcours !",
  hintDialogues: [
    "La balle doit descendre, rebondir, puis remonter...",
    "Le trampoline est en bas pour faire rebondir.",
    "Rampes pour descendre, trampoline, puis rampe pour remonter.",
  ],
  victoryDialogue: "BOING ! Le trampoline a fait son effet ! Quelle trajectoire spectaculaire !",

  unlocksElement: 'trampoline',
};

// ============================================
// NIVEAU 9 : La Cible Précise
// ============================================

const level9: LevelConfig = {
  id: 'fabrique-9',
  number: 9,
  title: 'La Cible Précise',
  mode: 'complete',
  difficulty: 'hard',

  gridSize: { rows: 5, cols: 6 },

  fixedElements: [
    createPlacedElement('source-1', 'spring', 0, 0, true),
    createPlacedElement('marble-1', 'marble', 0, 1, true),
    createPlacedElement('goal-1', 'light', 4, 5, true),
  ],

  emptySlots: [
    { row: 1, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 3 },
    { row: 4, col: 4 },
  ],

  availableElements: ['ramp', 'ramp', 'target', 'dominos', 'lever'],

  optimalSolution: [
    createPlacedElement('placed-1', 'ramp', 1, 1, false),
    createPlacedElement('placed-2', 'ramp', 2, 2, false),
    createPlacedElement('placed-3', 'target', 3, 3, false),
  ],
  optimalMoves: 3,

  stars3Threshold: 3,
  stars2Threshold: 6,

  introDialogue: "La CIBLE se déclenche quand on la touche ! Elle envoie de l'électricité.",
  hintDialogues: [
    "La bille doit toucher la cible...",
    "La cible transforme l'impact en électricité !",
    "Rampes vers la cible, puis électricité vers la lumière.",
  ],
  victoryDialogue: "En plein dans le mille ! La cible a parfaitement fonctionné !",

  unlocksElement: 'target',
};

// ============================================
// NIVEAU 10 : La Grande Finale
// ============================================

const level10: LevelConfig = {
  id: 'fabrique-10',
  number: 10,
  title: 'La Grande Finale',
  mode: 'complete',
  difficulty: 'expert',

  gridSize: { rows: 6, cols: 6 },

  fixedElements: [
    createPlacedElement('source-1', 'hamster_wheel', 0, 0, true),
    createPlacedElement('goal-1', 'confetti', 5, 5, true),
  ],

  emptySlots: [
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 1, col: 2 },
    { row: 2, col: 3 },
    { row: 3, col: 3 },
    { row: 4, col: 4 },
    { row: 5, col: 4 },
  ],

  availableElements: [
    'gear',
    'gear',
    'lever',
    'ball',
    'ramp',
    'ramp',
    'button',
    'dominos',
  ],

  optimalSolution: [
    createPlacedElement('placed-1', 'gear', 0, 1, false),
    createPlacedElement('placed-2', 'gear', 0, 2, false),
    createPlacedElement('placed-3', 'lever', 1, 2, false),
    createPlacedElement('placed-4', 'ball', 2, 3, false),
    createPlacedElement('placed-5', 'ramp', 3, 3, false),
    createPlacedElement('placed-6', 'button', 4, 4, false),
  ],
  optimalMoves: 6,

  stars3Threshold: 6,
  stars2Threshold: 9,

  introDialogue: "La Grande Finale ! Utilise TOUS tes talents pour créer la réaction en chaîne ultime !",
  hintDialogues: [
    "C'est un long chemin... commence par les engrenages.",
    "Rotation → Levier → Balle → Rampe → Bouton !",
    "Chaque transformation compte. Suis le chemin pas à pas.",
    "Engrenages, puis levier qui pousse une balle, rampe, bouton, confettis !",
  ],
  victoryDialogue:
    "PAR MES MOUSTACHES ! Tu es un GÉNIE de l'ingénierie ! 🎉 Félicitations, tu as terminé tous les niveaux !",

  unlocksBadge: 'master_engineer',
  unlocksElement: 'confetti',
};

// ============================================
// EXPORT
// ============================================

export const LEVELS: LevelConfig[] = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
];

export function getLevelById(id: string): LevelConfig | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getLevelByNumber(number: number): LevelConfig | undefined {
  return LEVELS.find((l) => l.number === number);
}

export default LEVELS;
