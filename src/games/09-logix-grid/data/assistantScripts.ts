/**
 * Logix Grid Assistant Scripts
 *
 * Dialogues de l'assistant IA pour le jeu Logix Grid
 * Mascotte: Sherlock le Détective 🔍
 */

import type { AssistantScript } from '@/core/types';

// ============================================================================
// SCRIPTS
// ============================================================================

export const logixAssistantScripts: AssistantScript[] = [
  // ===== DÉMARRAGE =====
  {
    id: 'logix-start-1',
    trigger: 'game_start',
    messages: [
      {
        text: 'Bienvenue détective ! 🔍',
        duration: 2000,
      },
      {
        text: 'Je suis Sherlock, et j\'ai besoin de ton aide pour résoudre ce mystère !',
        duration: 3000,
      },
      {
        text: 'Lis bien les indices à gauche. Ils te diront qui va avec quoi !',
        duration: 3000,
      },
    ],
    conditions: {
      maxTriggers: 1,
    },
    priority: 100,
  },
  {
    id: 'logix-start-2',
    trigger: 'game_start',
    messages: [
      {
        text: 'Une nouvelle enquête commence ! 🕵️',
        duration: 2000,
      },
      {
        text: 'Touche une case pour mettre ✓ (oui) ou ✗ (non).',
        duration: 3000,
      },
    ],
    conditions: {
      maxTriggers: 1,
    },
    priority: 90,
  },

  // ===== PREMIER INDICE =====
  {
    id: 'logix-first-clue-1',
    trigger: 'first_clue_used',
    messages: [
      {
        text: 'Bien joué ! Tu as utilisé ton premier indice ! 🎯',
        duration: 2500,
      },
      {
        text: 'Continue comme ça, chaque indice te rapproche de la solution !',
        duration: 2500,
      },
    ],
    conditions: {
      maxTriggers: 1,
    },
    priority: 80,
  },

  // ===== JOUEUR BLOQUÉ =====
  {
    id: 'logix-stuck-1',
    trigger: 'stuck_too_long',
    messages: [
      {
        text: 'Hmm, tu sembles réfléchir... 🤔',
        duration: 2000,
      },
      {
        text: 'Relis les indices un par un. Parfois la réponse est juste devant nous !',
        duration: 3000,
      },
    ],
    conditions: {
      minTimeSeconds: 60,
    },
    priority: 70,
  },
  {
    id: 'logix-stuck-2',
    trigger: 'stuck_too_long',
    messages: [
      {
        text: 'Un bon détective prend son temps ! ⏰',
        duration: 2000,
      },
      {
        text: 'Si tu es bloqué, commence par les indices les plus simples.',
        duration: 3000,
      },
    ],
    conditions: {
      minTimeSeconds: 90,
    },
    priority: 65,
  },
  {
    id: 'logix-stuck-3',
    trigger: 'stuck_too_long',
    messages: [
      {
        text: 'Petit conseil de détective : 🔍',
        duration: 2000,
      },
      {
        text: 'Quand tu trouves un ✓, marque ✗ dans toute la ligne et la colonne !',
        duration: 3500,
      },
    ],
    conditions: {
      minTimeSeconds: 120,
    },
    priority: 60,
  },

  // ===== MAUVAISE DÉDUCTION =====
  {
    id: 'logix-wrong-1',
    trigger: 'wrong_deduction',
    messages: [
      {
        text: 'Oups ! Cette association ne semble pas correcte. 🤨',
        duration: 2500,
      },
      {
        text: 'Revérifie les indices liés à ces éléments.',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 75,
  },
  {
    id: 'logix-wrong-2',
    trigger: 'wrong_deduction',
    messages: [
      {
        text: 'Hmm, je ne suis pas sûr de cette déduction... 🧐',
        duration: 2500,
      },
      {
        text: 'Même les grands détectives font des erreurs. Essaie encore !',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 70,
  },

  // ===== BONNE PROGRESSION =====
  {
    id: 'logix-progress-1',
    trigger: 'good_progress',
    messages: [
      {
        text: 'Excellent travail de détective ! 🌟',
        duration: 2000,
      },
      {
        text: 'Tu avances bien dans l\'enquête !',
        duration: 2000,
      },
    ],
    conditions: {},
    priority: 50,
  },
  {
    id: 'logix-progress-2',
    trigger: 'good_progress',
    messages: [
      {
        text: 'Tu es sur la bonne piste ! 🔎',
        duration: 2000,
      },
    ],
    conditions: {},
    priority: 45,
  },

  // ===== PRESQUE FINI =====
  {
    id: 'logix-almost-1',
    trigger: 'almost_done',
    messages: [
      {
        text: 'Tu y es presque ! L\'enquête touche à sa fin ! 🎯',
        duration: 2500,
      },
      {
        text: 'Plus que quelques déductions et le mystère sera résolu !',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 85,
  },

  // ===== VICTOIRE =====
  {
    id: 'logix-victory-1',
    trigger: 'victory',
    messages: [
      {
        text: 'BRAVO, DÉTECTIVE ! 🎉🔍',
        duration: 2500,
      },
      {
        text: 'Tu as résolu le mystère ! Ton esprit logique est impressionnant !',
        duration: 3000,
      },
    ],
    conditions: {},
    priority: 100,
  },
  {
    id: 'logix-victory-fast',
    trigger: 'victory',
    messages: [
      {
        text: 'INCROYABLE ! 🏆',
        duration: 2000,
      },
      {
        text: 'Tu as résolu cette enquête super vite ! Tu es un vrai génie !',
        duration: 3000,
      },
    ],
    conditions: {
      maxTimeSeconds: 60,
    },
    priority: 110,
  },
  {
    id: 'logix-victory-no-hints',
    trigger: 'victory',
    messages: [
      {
        text: 'PARFAIT ! 🌟🌟🌟',
        duration: 2000,
      },
      {
        text: 'Tu as tout trouvé sans aucun indice ! Tu es un super détective !',
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
    id: 'logix-hint-1',
    trigger: 'hint_requested',
    messages: [
      {
        text: 'Voici un indice pour t\'aider ! 💡',
        duration: 2000,
      },
      {
        text: 'Regarde bien les cases qui s\'allument.',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 80,
  },
  {
    id: 'logix-hint-2',
    trigger: 'hint_requested',
    messages: [
      {
        text: 'Un bon détective sait demander de l\'aide ! 🤝',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 75,
  },
];

export default logixAssistantScripts;
