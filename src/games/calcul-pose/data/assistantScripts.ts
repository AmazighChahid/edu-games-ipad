/**
 * Assistant scripts for Calcul Posé
 */

import type { AssistantScript } from '@/types';

export const calculPoseScripts: AssistantScript[] = [
  {
    id: 'calcul_pose_intro',
    trigger: 'game_start',
    gameId: 'calcul-pose',
    priority: 100,
    messages: [
      {
        id: 'intro_1',
        text: 'Dessine le chiffre dans la case noire !',
        duration: 3000,
        mood: 'happy',
      },
    ],
  },
  {
    id: 'calcul_pose_hint_units',
    trigger: 'hint_requested',
    gameId: 'calcul-pose',
    priority: 80,
    messages: [
      {
        id: 'hint_1',
        text: 'Commence par les unités, à droite !',
        duration: 3000,
        mood: 'thinking',
      },
    ],
  },
  {
    id: 'calcul_pose_correct',
    trigger: 'good_progress',
    gameId: 'calcul-pose',
    priority: 90,
    messages: [
      {
        id: 'correct_1',
        text: 'Bravo ! C\'est le bon chiffre !',
        duration: 2000,
        mood: 'celebrating',
      },
    ],
  },
  {
    id: 'calcul_pose_incorrect',
    trigger: 'invalid_move',
    gameId: 'calcul-pose',
    priority: 85,
    messages: [
      {
        id: 'incorrect_1',
        text: 'Hmm, essaie encore une fois !',
        duration: 2000,
        mood: 'encouraging',
      },
    ],
  },
  {
    id: 'calcul_pose_victory',
    trigger: 'victory',
    gameId: 'calcul-pose',
    priority: 100,
    messages: [
      {
        id: 'victory_1',
        text: 'Super ! Tu as trouvé le bon résultat !',
        duration: 3000,
        mood: 'celebrating',
      },
    ],
  },
];
