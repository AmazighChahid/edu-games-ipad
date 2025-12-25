/**
 * Assistant scripts for Tower of Hanoi
 */

import type { AssistantScript, AssistantContext } from '@/types';

export const hanoiScripts: AssistantScript[] = [
  {
    id: 'hanoi_welcome',
    trigger: 'game_start',
    gameId: 'hanoi',
    priority: 100,
    messages: [
      {
        id: 'welcome_1',
        text: 'Bienvenue ! Prêt à jouer ?',
        duration: 3000,
        mood: 'happy',
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
        text: 'Déplace tous les disques vers la tour de droite. Un grand disque ne peut pas aller sur un plus petit !',
        duration: 5000,
        mood: 'neutral',
      },
    ],
  },
  {
    id: 'hanoi_first_move',
    trigger: 'first_move',
    gameId: 'hanoi',
    priority: 80,
    messages: [
      {
        id: 'first_move_1',
        text: 'Super ! Continue comme ça !',
        duration: 2500,
        mood: 'encouraging',
      },
    ],
  },
  {
    id: 'hanoi_invalid_move',
    trigger: 'invalid_move',
    gameId: 'hanoi',
    priority: 70,
    messages: [
      {
        id: 'invalid_1',
        text: 'Oups ! Ce disque est trop grand pour aller ici.',
        duration: 3000,
        mood: 'thinking',
      },
    ],
  },
  {
    id: 'hanoi_repeated_invalid',
    trigger: 'repeated_invalid',
    gameId: 'hanoi',
    condition: (ctx: AssistantContext) => ctx.consecutiveInvalidMoves >= 3,
    priority: 75,
    messages: [
      {
        id: 'hint_1',
        text: 'Essaie une autre tour ! Regarde quel disque tu peux bouger.',
        duration: 4000,
        mood: 'encouraging',
      },
    ],
  },
  {
    id: 'hanoi_stuck',
    trigger: 'stuck',
    gameId: 'hanoi',
    condition: (ctx: AssistantContext) => ctx.idleTimeSeconds >= 30,
    priority: 60,
    messages: [
      {
        id: 'stuck_1',
        text: 'Besoin d\'aide ? Essaie de déplacer le plus petit disque.',
        duration: 4000,
        mood: 'encouraging',
      },
    ],
  },
  {
    id: 'hanoi_good_progress',
    trigger: 'good_progress',
    gameId: 'hanoi',
    condition: (ctx: AssistantContext) => ctx.levelProgress >= 0.5,
    priority: 50,
    messages: [
      {
        id: 'progress_1',
        text: 'Tu te débrouilles très bien !',
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
  {
    id: 'hanoi_victory',
    trigger: 'victory',
    gameId: 'hanoi',
    priority: 100,
    messages: [
      {
        id: 'victory_1',
        text: 'Félicitations ! Tu as réussi !',
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
  return hanoiScripts
    .filter((s) => s.trigger === trigger && (!s.gameId || s.gameId === gameId))
    .sort((a, b) => b.priority - a.priority);
};
