/**
 * Assistant scripts for MathBlocks
 */

import type { AssistantScript, AssistantContext } from '@/types';

export const mathBlocksScripts: AssistantScript[] = [
  {
    id: 'math_welcome',
    trigger: 'game_start',
    gameId: 'math-blocks',
    priority: 100,
    messages: [
      {
        id: 'welcome_1',
        text: 'Bienvenue dans MathBlocks !',
        duration: 3000,
        mood: 'happy',
      },
    ],
  },
  {
    id: 'math_rules',
    trigger: 'game_start',
    gameId: 'math-blocks',
    priority: 90,
    messages: [
      {
        id: 'rules_1',
        text: 'Associe chaque calcul avec son résultat. Par exemple, 4+1 va avec 5 !',
        duration: 5000,
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'math_first_match',
    trigger: 'first_move',
    gameId: 'math-blocks',
    priority: 80,
    messages: [
      {
        id: 'first_match_1',
        text: 'Bravo ! Continue comme ça !',
        duration: 2500,
        mood: 'encouraging',
      },
    ],
  },
  {
    id: 'math_wrong_match',
    trigger: 'invalid_move',
    gameId: 'math-blocks',
    priority: 70,
    messages: [
      {
        id: 'wrong_1',
        text: 'Oups ! Ces deux briques ne correspondent pas.',
        duration: 3000,
        mood: 'thinking',
      },
    ],
  },
  {
    id: 'math_repeated_wrong',
    trigger: 'repeated_invalid',
    gameId: 'math-blocks',
    condition: (ctx: AssistantContext) => ctx.consecutiveInvalidMoves >= 3,
    priority: 75,
    messages: [
      {
        id: 'hint_1',
        text: 'Prends ton temps ! Calcule d\'abord le résultat de l\'opération.',
        duration: 4000,
        mood: 'encouraging',
      },
    ],
  },
  {
    id: 'math_stuck',
    trigger: 'stuck',
    gameId: 'math-blocks',
    condition: (ctx: AssistantContext) => ctx.idleTimeSeconds >= 20,
    priority: 60,
    messages: [
      {
        id: 'stuck_1',
        text: 'Besoin d\'aide ? Cherche un calcul simple et trouve son résultat.',
        duration: 4000,
        mood: 'encouraging',
      },
    ],
  },
  {
    id: 'math_halfway',
    trigger: 'good_progress',
    gameId: 'math-blocks',
    condition: (ctx: AssistantContext) => ctx.levelProgress >= 0.5,
    priority: 50,
    messages: [
      {
        id: 'progress_1',
        text: 'Tu es à mi-chemin ! Continue !',
        duration: 2500,
        mood: 'happy',
      },
    ],
  },
  {
    id: 'math_almost_there',
    trigger: 'near_victory',
    gameId: 'math-blocks',
    condition: (ctx: AssistantContext) => ctx.levelProgress >= 0.8,
    priority: 85,
    messages: [
      {
        id: 'almost_1',
        text: 'Plus que quelques paires !',
        duration: 2000,
        mood: 'encouraging',
      },
    ],
  },
  {
    id: 'math_victory',
    trigger: 'victory',
    gameId: 'math-blocks',
    priority: 100,
    messages: [
      {
        id: 'victory_1',
        text: 'Félicitations ! Tu es un champion du calcul mental !',
        duration: 4000,
        mood: 'celebrating',
      },
    ],
  },
];

export const getScriptsForTrigger = (
  trigger: AssistantScript['trigger'],
  gameId: string
): AssistantScript[] => {
  return mathBlocksScripts
    .filter((s) => s.trigger === trigger && (!s.gameId || s.gameId === gameId))
    .sort((a, b) => b.priority - a.priority);
};
