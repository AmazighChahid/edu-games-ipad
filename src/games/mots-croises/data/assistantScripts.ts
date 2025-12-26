/**
 * Mots Croisés Assistant Scripts
 *
 * Dialogues de l'assistant IA pour le jeu Mots Croisés
 * Mascotte: Lexie la Lettre 📝
 */

import type { AssistantScript } from '@/core/types';

// ============================================================================
// SCRIPTS
// ============================================================================

export const motsCroisesAssistantScripts: AssistantScript[] = [
  // ===== DÉMARRAGE =====
  {
    id: 'crossword-start-1',
    trigger: 'game_start',
    messages: [
      {
        text: 'Bonjour ! Je suis Lexie ! 📝',
        duration: 2000,
      },
      {
        text: 'On va jouer avec les mots aujourd\'hui !',
        duration: 2500,
      },
      {
        text: 'Lis les définitions et trouve le mot qui correspond. Touche une case pour commencer !',
        duration: 3500,
      },
    ],
    conditions: {
      maxTriggers: 1,
    },
    priority: 100,
  },
  {
    id: 'crossword-start-2',
    trigger: 'game_start',
    messages: [
      {
        text: 'C\'est parti pour les mots croisés ! ✨',
        duration: 2000,
      },
      {
        text: 'Chaque définition te donne un indice pour trouver le mot !',
        duration: 3000,
      },
    ],
    conditions: {
      maxTriggers: 1,
    },
    priority: 90,
  },

  // ===== PREMIER MOT TROUVÉ =====
  {
    id: 'crossword-first-word-1',
    trigger: 'first_word_found',
    messages: [
      {
        text: 'Super ! Tu as trouvé ton premier mot ! 🎉',
        duration: 2500,
      },
      {
        text: 'Continue comme ça, tu es sur la bonne voie !',
        duration: 2500,
      },
    ],
    conditions: {
      maxTriggers: 1,
    },
    priority: 85,
  },

  // ===== JOUEUR BLOQUÉ =====
  {
    id: 'crossword-stuck-1',
    trigger: 'stuck_too_long',
    messages: [
      {
        text: 'Hmm, ce mot est difficile ? 🤔',
        duration: 2000,
      },
      {
        text: 'Essaie de penser à l\'image ou à l\'emoji dans la définition !',
        duration: 3000,
      },
    ],
    conditions: {
      minTimeSeconds: 60,
    },
    priority: 70,
  },
  {
    id: 'crossword-stuck-2',
    trigger: 'stuck_too_long',
    messages: [
      {
        text: 'Prends ton temps ! 📖',
        duration: 2000,
      },
      {
        text: 'Parfois il faut lire la définition plusieurs fois pour trouver !',
        duration: 3000,
      },
    ],
    conditions: {
      minTimeSeconds: 90,
    },
    priority: 65,
  },
  {
    id: 'crossword-stuck-3',
    trigger: 'stuck_too_long',
    messages: [
      {
        text: 'Petit conseil de Lexie : 💡',
        duration: 2000,
      },
      {
        text: 'Compte les cases ! Ça te dit combien de lettres a le mot.',
        duration: 3000,
      },
    ],
    conditions: {
      minTimeSeconds: 120,
    },
    priority: 60,
  },

  // ===== MAUVAISE LETTRE =====
  {
    id: 'crossword-wrong-1',
    trigger: 'wrong_letter',
    messages: [
      {
        text: 'Oups, ce n\'est pas la bonne lettre ! 😊',
        duration: 2000,
      },
      {
        text: 'Essaie une autre, tu vas trouver !',
        duration: 2000,
      },
    ],
    conditions: {},
    priority: 50,
  },

  // ===== BONNE PROGRESSION =====
  {
    id: 'crossword-progress-1',
    trigger: 'good_progress',
    messages: [
      {
        text: 'Bravo ! Tu avances bien ! 🌟',
        duration: 2000,
      },
      {
        text: 'Les mots s\'assemblent comme un puzzle !',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 55,
  },
  {
    id: 'crossword-progress-2',
    trigger: 'good_progress',
    messages: [
      {
        text: 'Tu es vraiment fort en vocabulaire ! 📚',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 50,
  },

  // ===== PRESQUE FINI =====
  {
    id: 'crossword-almost-1',
    trigger: 'almost_done',
    messages: [
      {
        text: 'Tu y es presque ! Plus que quelques lettres ! 🎯',
        duration: 2500,
      },
      {
        text: 'La grille est presque complète, courage !',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 85,
  },

  // ===== VICTOIRE =====
  {
    id: 'crossword-victory-1',
    trigger: 'victory',
    messages: [
      {
        text: 'FÉLICITATIONS ! 🎉📝',
        duration: 2500,
      },
      {
        text: 'Tu as rempli toute la grille ! Tu es un champion des mots !',
        duration: 3000,
      },
    ],
    conditions: {},
    priority: 100,
  },
  {
    id: 'crossword-victory-fast',
    trigger: 'victory',
    messages: [
      {
        text: 'INCROYABLE ! 🏆',
        duration: 2000,
      },
      {
        text: 'Tu as terminé super vite ! Tu connais vraiment bien tes mots !',
        duration: 3000,
      },
    ],
    conditions: {
      maxTimeSeconds: 90,
    },
    priority: 110,
  },
  {
    id: 'crossword-victory-no-hints',
    trigger: 'victory',
    messages: [
      {
        text: 'PARFAIT ! 🌟🌟🌟',
        duration: 2000,
      },
      {
        text: 'Tout trouvé sans aucun indice ! Tu es un vrai expert des mots !',
        duration: 3000,
      },
    ],
    conditions: {
      maxHintsUsed: 0,
    },
    priority: 115,
  },

  // ===== DEMANDE D'INDICE =====
  {
    id: 'crossword-hint-1',
    trigger: 'hint_requested',
    messages: [
      {
        text: 'Je te révèle une lettre ! 💡',
        duration: 2000,
      },
      {
        text: 'Avec cette aide, tu vas trouver plus facilement !',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 80,
  },
  {
    id: 'crossword-hint-2',
    trigger: 'hint_requested',
    messages: [
      {
        text: 'Voilà un petit coup de pouce ! 🤝',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 75,
  },
];

export default motsCroisesAssistantScripts;
