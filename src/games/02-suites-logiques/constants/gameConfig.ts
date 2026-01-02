import { GameConfig } from '../types';

// ============================================
// CONFIGURATION DU JEU
// ============================================

export const GAME_CONFIG: GameConfig = {
  // Nombre de suites par session
  sequencesPerSession: 8,

  // Nombre maximum de tentatives avant révélation
  maxAttempts: 5,

  // Seuils pour déclencher les indices automatiques
  // Indices après 2, 3, 4, 5 tentatives échouées
  hintThresholds: [2, 3, 4, 5],

  // Critères pour passer au niveau supérieur
  levelUpThreshold: {
    sequences: 5,        // Minimum 5 suites réussies
    successRate: 0.6,    // Minimum 60% de réussite au premier essai
    maxHintRate: 1,      // Maximum 1 indice par suite en moyenne
  },

  // Tailles des éléments (en dp)
  elementSize: 80,
  choiceSize: 96,

  // Durées des animations (en ms)
  animationDurations: {
    elementAppear: 100,   // Apparition séquentielle des éléments
    success: 500,         // Animation de succès
    error: 300,           // Animation d'erreur
    hint: 400,            // Animation d'indice
  },
};

// ============================================
// CONFIGURATION DES INDICES
// ============================================

export const HINT_CONFIG = {
  // Niveau 0 : Aucun indice
  none: {
    level: 0,
    message: '',
    visualEffect: 'none',
  },

  // Niveau 1 : Message verbal uniquement
  verbal: {
    level: 1,
    message: 'Regarde bien les premiers éléments...',
    visualEffect: 'none',
  },

  // Niveau 2 : Pulsation des éléments similaires
  visual: {
    level: 2,
    message: 'Les éléments qui brillent sont pareils...',
    visualEffect: 'pulse',
  },

  // Niveau 3 : Réduction des choix à 2 options
  reduced: {
    level: 3,
    message: 'C\'est forcément l\'un de ces deux !',
    visualEffect: 'filter',
  },

  // Niveau 4 : Révélation de la bonne réponse
  revealed: {
    level: 4,
    message: 'Regarde, c\'était celui-là !',
    visualEffect: 'highlight',
  },
} as const;

// ============================================
// MESSAGES DE LA MASCOTTE PIXEL
// ============================================

export const PIXEL_MESSAGES = {
  // Introduction
  intro: [
    'Bip bip ! Salut, je suis Pixel ! 🤖',
    'Tu vois cette suite ? Il manque un élément...',
    'Regarde bien et trouve ce qui vient après !',
  ],

  // Démarrage d'une suite
  start: [
    'Regarde bien cette suite...',
    'Bip ! Nouvelle suite !',
    'Qu\'est-ce qui se répète ? 🔍',
  ],

  // Réussite
  success: [
    'Bip bip ! Bien trouvé ! ✨',
    'Données confirmées : CORRECT ! 🎉',
    'Tu as trouvé le motif !',
  ],

  // Réussite premier essai
  successFirstTry: [
    'Wahou ! Du premier coup ! 🌟',
    'Bip bip bip ! Parfait !',
    'Analyse parfaite ! Tu es super fort !',
  ],

  // Erreur (jamais négatif)
  error: [
    'Hmm, pas celui-là... Regarde encore !',
    'Bip... essaie encore !',
    'Pas tout à fait... Continue de chercher !',
  ],

  // Indices progressifs
  hint1: 'Regarde les premiers éléments. Tu vois quelque chose qui se répète ?',
  hint2: 'Les éléments qui brillent sont pareils. Tu vois le rythme maintenant ?',
  hint3: 'Je t\'aide un peu plus... C\'est l\'un de ces deux !',
  hint4: 'Regarde, c\'était celui-là ! Tu vois pourquoi ?',

  // Encouragement
  thinking: [
    'Prends ton temps... 🤔',
    'Bip... j\'attends ta réponse !',
  ],
};

// ============================================
// COULEURS DES ÉLÉMENTS
// ============================================

export const ELEMENT_COLORS = {
  // Couleurs primaires (thème colors)
  red: '#E74C3C',
  blue: '#3498DB',
  green: '#27AE60',
  yellow: '#F1C40F',
  purple: '#9B59B6',

  // Couleurs des formes (thème shapes)
  shape1: '#5B8DEE',   // Bleu
  shape2: '#FFB347',   // Orange
  shape3: '#7BC74D',   // Vert
  shape4: '#E056FD',   // Violet

  // Couleurs UI
  background: '#FFF9F0',
  white: '#FFFFFF',
  text: '#2C3E50',
  border: '#E0E0E0',
  highlight: '#F39C12',
  success: '#7BC74D',
  error: '#E74C3C',
};

// ============================================
// DIMENSIONS ET ESPACEMENTS
// ============================================

export const DIMENSIONS = {
  // Éléments de la suite
  sequenceElement: {
    size: 80,
    borderRadius: 12,
    spacing: 16,
  },

  // Choix de réponse
  choice: {
    size: 96,
    borderRadius: 16,
    spacing: 24,
  },

  // Slot manquant
  missingSlot: {
    size: 80,
    borderRadius: 12,
    borderWidth: 3,
    borderStyle: 'dashed',
  },

  // Espacement général
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
