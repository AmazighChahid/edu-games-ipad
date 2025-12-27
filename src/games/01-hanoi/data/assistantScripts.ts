/**
 * Assistant scripts for Tower of Hanoi
 * Specs: 04-feedback-ai.md
 * - Pas de punition, pas de "Perdu"
 * - Encouragement orienté effort
 * - Aide progressive: Question → Indice 1 coup → Micro-démo 2 coups
 */

import type { AssistantScript, AssistantContext } from '@/types';

export const hanoiScripts: AssistantScript[] = [
  // === INTRO ===
  {
    id: 'hanoi_welcome',
    trigger: 'game_start',
    gameId: 'hanoi',
    priority: 100,
    messages: [
      {
        id: 'welcome_1',
        text: 'But : mettre la pile sur C.',
        duration: 3000,
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'hanoi_rules',
    trigger: 'game_start',
    gameId: 'hanoi',
    priority: 90,
    messages: [
      {
        id: 'rules_1',
        text: 'Un disque à la fois. Grand sur petit : interdit.',
        duration: 4000,
        mood: 'neutral',
      },
    ],
  },

  // === FIRST MOVE ===
  {
    id: 'hanoi_first_move',
    trigger: 'first_move',
    gameId: 'hanoi',
    priority: 80,
    messages: [
      {
        id: 'first_move_1',
        text: 'Tu réfléchis bien !',
        duration: 2500,
        mood: 'encouraging',
      },
    ],
  },

  // === COUP VALIDE (feedback discret) ===
  {
    id: 'hanoi_valid_move',
    trigger: 'valid_move',
    gameId: 'hanoi',
    priority: 30,
    // Only show occasionally (random)
    condition: () => Math.random() > 0.7,
    messages: [
      {
        id: 'valid_1',
        text: 'Continue, tu y es presque.',
        duration: 2000,
        mood: 'happy',
      },
    ],
  },

  // === COUP INVALIDE (auto-correction, pas de punition) ===
  {
    id: 'hanoi_invalid_move',
    trigger: 'invalid_move',
    gameId: 'hanoi',
    priority: 70,
    messages: [
      {
        id: 'invalid_1',
        text: 'Grand sur petit : interdit.',
        duration: 2500,
        mood: 'thinking',
      },
    ],
  },
  {
    id: 'hanoi_invalid_top_only',
    trigger: 'invalid_move',
    gameId: 'hanoi',
    priority: 68,
    // Alternative message for variety
    messages: [
      {
        id: 'invalid_top_1',
        text: 'On prend le disque du haut.',
        duration: 2500,
        mood: 'thinking',
      },
    ],
  },

  // === BLOCAGE DÉTECTÉ (guidance douce) ===
  {
    id: 'hanoi_repeated_invalid',
    trigger: 'repeated_invalid',
    gameId: 'hanoi',
    condition: (ctx: AssistantContext) => ctx.consecutiveInvalidMoves >= 3,
    priority: 75,
    messages: [
      {
        id: 'hint_1',
        text: 'Essaie une autre tour.',
        duration: 3000,
        mood: 'encouraging',
      },
    ],
  },
  {
    id: 'hanoi_stuck',
    trigger: 'stuck',
    gameId: 'hanoi',
    condition: (ctx: AssistantContext) => ctx.idleTimeSeconds >= 25,
    priority: 60,
    messages: [
      {
        id: 'stuck_1',
        text: 'Où peux-tu poser le petit disque ?',
        duration: 3500,
        mood: 'encouraging',
      },
    ],
  },
  {
    id: 'hanoi_stuck_longer',
    trigger: 'stuck',
    gameId: 'hanoi',
    condition: (ctx: AssistantContext) => ctx.idleTimeSeconds >= 40,
    priority: 65,
    messages: [
      {
        id: 'stuck_2',
        text: 'Tu as essayé. Utilise l\'indice si tu veux.',
        duration: 4000,
        mood: 'encouraging',
      },
    ],
  },

  // === PROGRESSION ===
  {
    id: 'hanoi_good_progress',
    trigger: 'good_progress',
    gameId: 'hanoi',
    condition: (ctx: AssistantContext) => ctx.levelProgress >= 0.5,
    priority: 50,
    messages: [
      {
        id: 'progress_1',
        text: 'Tu avances bien !',
        duration: 2500,
        mood: 'happy',
      },
    ],
  },
  {
    id: 'hanoi_almost_there',
    trigger: 'near_victory',
    gameId: 'hanoi',
    condition: (ctx: AssistantContext) => ctx.levelProgress >= 0.8,
    priority: 85,
    messages: [
      {
        id: 'almost_1',
        text: 'Tu y es presque !',
        duration: 2000,
        mood: 'encouraging',
      },
    ],
  },

  // === VICTOIRE ===
  {
    id: 'hanoi_victory',
    trigger: 'victory',
    gameId: 'hanoi',
    priority: 100,
    messages: [
      {
        id: 'victory_1',
        text: 'Bravo ! Tu as réussi.',
        duration: 4000,
        mood: 'celebrating',
      },
    ],
  },
  {
    id: 'hanoi_victory_next',
    trigger: 'victory',
    gameId: 'hanoi',
    priority: 95,
    messages: [
      {
        id: 'victory_next_1',
        text: 'On passe au niveau suivant ?',
        duration: 3000,
        mood: 'happy',
      },
    ],
  },

  // === ENCOURAGEMENT EFFORT (pas compétition) ===
  {
    id: 'hanoi_effort_praise',
    trigger: 'effort',
    gameId: 'hanoi',
    condition: (ctx: AssistantContext) => ctx.hintsUsed === 0 && ctx.moveCount > 0,
    priority: 40,
    messages: [
      {
        id: 'effort_1',
        text: 'Tu réfléchis par toi-même, super !',
        duration: 3000,
        mood: 'happy',
      },
    ],
  },
  {
    id: 'hanoi_perseverance',
    trigger: 'effort',
    gameId: 'hanoi',
    condition: (ctx: AssistantContext) => ctx.hintsUsed >= 2,
    priority: 45,
    messages: [
      {
        id: 'perseverance_1',
        text: 'Tu persévères, c\'est bien !',
        duration: 3000,
        mood: 'encouraging',
      },
    ],
  },
];

export const getScriptsForTrigger = (
  trigger: AssistantScript['trigger'],
  gameId: string
): AssistantScript[] => {
  return hanoiScripts
    .filter((s) => s.trigger === trigger && (!s.gameId || s.gameId === gameId))
    .sort((a, b) => b.priority - a.priority);
};

// Helper to get random script for variety
export const getRandomScriptForTrigger = (
  trigger: AssistantScript['trigger'],
  gameId: string
): AssistantScript | undefined => {
  const scripts = getScriptsForTrigger(trigger, gameId);
  if (scripts.length === 0) return undefined;
  return scripts[Math.floor(Math.random() * Math.min(2, scripts.length))];
};
