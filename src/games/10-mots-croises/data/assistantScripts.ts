/**
 * Assistant Scripts for Mots Croisés
 * Contains all mascot dialogues and guidance messages
 */

import type { AssistantScript } from '../../../types/assistant';

// =============================================================================
// INTRODUCTION SCRIPTS
// =============================================================================

export const motsCroisesIntroScripts: AssistantScript[] = [
  {
    id: 'welcome',
    trigger: 'level_start',
    messages: [
      "Bienvenue aux mots croisés !",
      "Trouve les mots cachés dans la grille.",
      "Lis bien les définitions !",
    ],
    emotion: 'happy',
  },
  {
    id: 'level_easy',
    trigger: 'level_start',
    condition: { difficulty: 'easy' },
    messages: [
      "On commence doucement !",
      "Ces mots sont faciles à trouver.",
    ],
    emotion: 'encouraging',
  },
  {
    id: 'level_medium',
    trigger: 'level_start',
    condition: { difficulty: 'medium' },
    messages: [
      "Un peu plus difficile cette fois !",
      "Utilise les lettres communes pour t'aider.",
    ],
    emotion: 'thinking',
  },
  {
    id: 'level_hard',
    trigger: 'level_start',
    condition: { difficulty: 'hard' },
    messages: [
      "Niveau expert !",
      "Prends ton temps, chaque mot compte.",
    ],
    emotion: 'excited',
  },
];

// =============================================================================
// GAMEPLAY SCRIPTS
// =============================================================================

export const motsCroisesGameplayScripts: AssistantScript[] = [
  {
    id: 'word_found',
    trigger: 'success',
    messages: [
      "Bravo ! Mot trouvé !",
      "Excellent ! Continue comme ça !",
      "Super ! Tu maîtrises !",
    ],
    emotion: 'excited',
  },
  {
    id: 'wrong_letter',
    trigger: 'error',
    messages: [
      "Hmm, cette lettre n'est pas la bonne.",
      "Essaie une autre lettre !",
      "Pas tout à fait, réessaie !",
    ],
    emotion: 'encouraging',
  },
  {
    id: 'hint_requested',
    trigger: 'hint',
    messages: [
      "Je te donne un indice...",
      "Regarde bien cette lettre !",
    ],
    emotion: 'thinking',
  },
  {
    id: 'stuck',
    trigger: 'idle',
    condition: { idleSeconds: 30 },
    messages: [
      "Tu cherches un mot ?",
      "Lis la définition à voix haute, ça aide !",
      "Regarde les lettres que tu as déjà.",
    ],
    emotion: 'thinking',
  },
];

// =============================================================================
// ENCOURAGEMENT SCRIPTS
// =============================================================================

export const motsCroisesEncouragementScripts: AssistantScript[] = [
  {
    id: 'halfway',
    trigger: 'progress',
    condition: { progress: 50 },
    messages: [
      "Tu as trouvé la moitié des mots !",
      "Continue, tu y es presque !",
    ],
    emotion: 'happy',
  },
  {
    id: 'almost_done',
    trigger: 'progress',
    condition: { progress: 80 },
    messages: [
      "Plus que quelques mots !",
      "Tu vas y arriver !",
    ],
    emotion: 'excited',
  },
  {
    id: 'first_word',
    trigger: 'milestone',
    condition: { wordsFound: 1 },
    messages: [
      "Premier mot trouvé !",
      "C'est un bon début !",
    ],
    emotion: 'happy',
  },
];

// =============================================================================
// VICTORY SCRIPTS
// =============================================================================

export const motsCroisesVictoryScripts: AssistantScript[] = [
  {
    id: 'victory_perfect',
    trigger: 'victory',
    condition: { hintsUsed: 0 },
    messages: [
      "Parfait ! Sans aucun indice !",
      "Tu es un vrai champion des mots !",
    ],
    emotion: 'excited',
  },
  {
    id: 'victory_normal',
    trigger: 'victory',
    messages: [
      "Félicitations ! Grille complète !",
      "Tu as trouvé tous les mots !",
      "Bravo pour ta persévérance !",
    ],
    emotion: 'happy',
  },
];

// =============================================================================
// TIPS SCRIPTS
// =============================================================================

export const motsCroisesTipsScripts: AssistantScript[] = [
  {
    id: 'tip_cross',
    trigger: 'tip',
    messages: [
      "Astuce : les lettres croisées t'aident à deviner les mots !",
    ],
    emotion: 'thinking',
  },
  {
    id: 'tip_count',
    trigger: 'tip',
    messages: [
      "Compte les cases pour savoir combien de lettres il faut.",
    ],
    emotion: 'thinking',
  },
  {
    id: 'tip_definition',
    trigger: 'tip',
    messages: [
      "Si tu ne comprends pas une définition, demande à un adulte !",
    ],
    emotion: 'encouraging',
  },
];

// =============================================================================
// EXPORT ALL SCRIPTS
// =============================================================================

export const motsCroisesAssistantScripts = {
  intro: motsCroisesIntroScripts,
  gameplay: motsCroisesGameplayScripts,
  encouragement: motsCroisesEncouragementScripts,
  victory: motsCroisesVictoryScripts,
  tips: motsCroisesTipsScripts,
};

export default motsCroisesAssistantScripts;
