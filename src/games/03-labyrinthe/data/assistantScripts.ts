/**
 * Assistant Scripts for Labyrinthe
 * Contains all mascot dialogues and guidance messages
 */

import type { AssistantScript } from '../../../types/assistant';

// =============================================================================
// INTRODUCTION SCRIPTS
// =============================================================================

export const labyrintheIntroScripts: AssistantScript[] = [
  {
    id: 'welcome',
    trigger: 'game_start',
    messages: [
      "Bienvenue dans le labyrinthe !",
      "Trouve ton chemin vers la sortie.",
      "Collecte les gemmes sur ton passage !",
    ],
    emotion: 'happy',
  },
  {
    id: 'level_easy',
    trigger: 'game_start',
    condition: { difficulty: 'easy' },
    messages: [
      "Un petit labyrinthe pour commencer !",
      "Le chemin est simple, suis-le bien.",
    ],
    emotion: 'encouraging',
  },
  {
    id: 'level_medium',
    trigger: 'game_start',
    condition: { difficulty: 'medium' },
    messages: [
      "Le labyrinthe grandit !",
      "Attention aux impasses...",
    ],
    emotion: 'thinking',
  },
  {
    id: 'level_hard',
    trigger: 'game_start',
    condition: { difficulty: 'hard' },
    messages: [
      "Un vrai défi t'attend !",
      "Réfléchis avant de te déplacer.",
    ],
    emotion: 'excited',
  },
];

// =============================================================================
// GAMEPLAY SCRIPTS
// =============================================================================

export const labyrintheGameplayScripts: AssistantScript[] = [
  {
    id: 'gem_collected',
    trigger: 'success',
    messages: [
      "Super ! Une gemme de plus !",
      "Bien joué ! Continue !",
      "Tu les trouves toutes !",
    ],
    emotion: 'excited',
  },
  {
    id: 'blocked',
    trigger: 'hint',
    messages: [
      "Oups ! C'est un mur.",
      "Essaie une autre direction !",
      "Ce passage est bloqué.",
    ],
    emotion: 'encouraging',
  },
  {
    id: 'door_unlocked',
    trigger: 'success',
    messages: [
      "La porte s'ouvre !",
      "Tu as trouvé la clé !",
    ],
    emotion: 'excited',
  },
  {
    id: 'stuck',
    trigger: 'idle',
    condition: { idleSeconds: 15 },
    messages: [
      "Tu cherches le chemin ?",
      "Essaie de revenir en arrière.",
      "Il y a peut-être un autre passage.",
    ],
    emotion: 'thinking',
  },
  {
    id: 'hint_given',
    trigger: 'hint',
    messages: [
      "Regarde par là...",
      "Le chemin continue dans cette direction.",
    ],
    emotion: 'thinking',
  },
];

// =============================================================================
// ENCOURAGEMENT SCRIPTS
// =============================================================================

export const labyrintheEncouragementScripts: AssistantScript[] = [
  {
    id: 'halfway',
    trigger: 'progress',
    condition: { progress: 50 },
    messages: [
      "Tu as fait la moitié du chemin !",
      "Continue, la sortie approche !",
    ],
    emotion: 'happy',
  },
  {
    id: 'almost_done',
    trigger: 'progress',
    condition: { progress: 80 },
    messages: [
      "Tu y es presque !",
      "La sortie est proche !",
    ],
    emotion: 'excited',
  },
  {
    id: 'all_gems',
    trigger: 'milestone',
    messages: [
      "Toutes les gemmes collectées !",
      "Tu es un vrai explorateur !",
    ],
    emotion: 'excited',
  },
];

// =============================================================================
// VICTORY SCRIPTS
// =============================================================================

export const labyrintheVictoryScripts: AssistantScript[] = [
  {
    id: 'victory_perfect',
    trigger: 'victory',
    condition: { perfectScore: true },
    messages: [
      "Parfait ! Toutes les gemmes et pas d'erreur !",
      "Tu es un maître du labyrinthe !",
    ],
    emotion: 'excited',
  },
  {
    id: 'victory_fast',
    trigger: 'victory',
    condition: { fastTime: true },
    messages: [
      "Quel record de vitesse !",
      "Tu connais le chemin par coeur !",
    ],
    emotion: 'excited',
  },
  {
    id: 'victory_normal',
    trigger: 'victory',
    messages: [
      "Bravo ! Tu as trouvé la sortie !",
      "Félicitations, explorateur !",
      "Le labyrinthe n'a plus de secrets pour toi !",
    ],
    emotion: 'happy',
  },
];

// =============================================================================
// TIPS SCRIPTS
// =============================================================================

export const labyrintheTipsScripts: AssistantScript[] = [
  {
    id: 'tip_walls',
    trigger: 'tip',
    messages: [
      "Astuce : longe les murs pour ne pas te perdre.",
    ],
    emotion: 'thinking',
  },
  {
    id: 'tip_backtrack',
    trigger: 'tip',
    messages: [
      "Si tu es bloqué, reviens sur tes pas.",
    ],
    emotion: 'thinking',
  },
  {
    id: 'tip_observe',
    trigger: 'tip',
    messages: [
      "Observe bien avant de te déplacer !",
    ],
    emotion: 'thinking',
  },
];

// =============================================================================
// EXPORT ALL SCRIPTS
// =============================================================================

export const labyrintheAssistantScripts = {
  intro: labyrintheIntroScripts,
  gameplay: labyrintheGameplayScripts,
  encouragement: labyrintheEncouragementScripts,
  victory: labyrintheVictoryScripts,
  tips: labyrintheTipsScripts,
};

export default labyrintheAssistantScripts;
