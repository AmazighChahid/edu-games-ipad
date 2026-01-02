/**
 * Assistant Scripts for Matrices Magiques
 * Contains all mascot dialogues and guidance messages
 */

import type { AssistantScript } from '../../../types/assistant';

// =============================================================================
// INTRODUCTION SCRIPTS
// =============================================================================

export const matricesIntroScripts: AssistantScript[] = [
  {
    id: 'welcome',
    trigger: 'level_start',
    messages: [
      "Bienvenue dans les Matrices Magiques !",
      "Trouve le morceau qui manque dans la grille.",
      "Observe bien les patterns !",
    ],
    emotion: 'happy',
  },
  {
    id: 'world_forest',
    trigger: 'level_start',
    condition: { worldId: 'forest' },
    messages: [
      "Bienvenue dans la Forêt Enchantée !",
      "Les arbres cachent des mystères...",
    ],
    emotion: 'excited',
  },
  {
    id: 'world_ocean',
    trigger: 'level_start',
    condition: { worldId: 'ocean' },
    messages: [
      "Plongeons dans l'Océan Profond !",
      "Les poissons vont nous aider...",
    ],
    emotion: 'happy',
  },
  {
    id: 'world_mountain',
    trigger: 'level_start',
    condition: { worldId: 'mountain' },
    messages: [
      "Escaladons la Montagne Mystique !",
      "Le sommet nous attend !",
    ],
    emotion: 'encouraging',
  },
  {
    id: 'world_space',
    trigger: 'level_start',
    condition: { worldId: 'space' },
    messages: [
      "Direction l'Espace Cosmique !",
      "Les étoiles brillent pour toi !",
    ],
    emotion: 'excited',
  },
];

// =============================================================================
// GAMEPLAY SCRIPTS
// =============================================================================

export const matricesGameplayScripts: AssistantScript[] = [
  {
    id: 'correct_answer',
    trigger: 'success',
    messages: [
      "Bravo ! C'est la bonne réponse !",
      "Excellent ! Tu as trouvé le pattern !",
      "Super ! Continue comme ça !",
    ],
    emotion: 'excited',
  },
  {
    id: 'wrong_answer',
    trigger: 'error',
    messages: [
      "Pas tout à fait... Essaie encore !",
      "Hmm, regarde mieux les transformations.",
      "Presque ! Observe bien chaque ligne.",
    ],
    emotion: 'encouraging',
  },
  {
    id: 'hint_level_1',
    trigger: 'hint',
    condition: { hintLevel: 1 },
    messages: [
      "Regarde bien cette ligne...",
      "Il y a un pattern ici !",
    ],
    emotion: 'thinking',
  },
  {
    id: 'hint_level_2',
    trigger: 'hint',
    condition: { hintLevel: 2 },
    messages: [
      "Observe cette transformation...",
      "Qu'est-ce qui change ?",
    ],
    emotion: 'thinking',
  },
  {
    id: 'hint_level_3',
    trigger: 'hint',
    condition: { hintLevel: 3 },
    messages: [
      "Je t'élimine une mauvaise réponse !",
      "Ça réduit les possibilités !",
    ],
    emotion: 'happy',
  },
  {
    id: 'stuck',
    trigger: 'idle',
    condition: { idleSeconds: 20 },
    messages: [
      "Tu veux un indice ?",
      "Prends ton temps pour observer...",
      "Regarde ligne par ligne !",
    ],
    emotion: 'thinking',
  },
];

// =============================================================================
// ENCOURAGEMENT SCRIPTS
// =============================================================================

export const matricesEncouragementScripts: AssistantScript[] = [
  {
    id: 'streak_3',
    trigger: 'streak',
    condition: { streak: 3 },
    messages: [
      "3 bonnes réponses d'affilée !",
      "Tu es en feu !",
    ],
    emotion: 'excited',
  },
  {
    id: 'streak_5',
    trigger: 'streak',
    condition: { streak: 5 },
    messages: [
      "5 de suite ! Incroyable !",
      "Tu es un vrai génie !",
    ],
    emotion: 'excited',
  },
  {
    id: 'puzzle_halfway',
    trigger: 'progress',
    condition: { progress: 50 },
    messages: [
      "Tu as fait la moitié !",
      "Continue, tu y es presque !",
    ],
    emotion: 'happy',
  },
  {
    id: 'first_try',
    trigger: 'first_try',
    messages: [
      "Du premier coup ! Impressionnant !",
      "Tu as tout compris !",
    ],
    emotion: 'excited',
  },
];

// =============================================================================
// VICTORY SCRIPTS
// =============================================================================

export const matricesVictoryScripts: AssistantScript[] = [
  {
    id: 'victory_perfect',
    trigger: 'victory',
    condition: { perfectScore: true },
    messages: [
      "Score parfait ! Tu es un génie !",
      "Aucune erreur ! Extraordinaire !",
    ],
    emotion: 'excited',
  },
  {
    id: 'victory_no_hints',
    trigger: 'victory',
    condition: { hintsUsed: 0 },
    messages: [
      "Sans aucun indice ! Bravo !",
      "Tu n'as eu besoin d'aucune aide !",
    ],
    emotion: 'excited',
  },
  {
    id: 'victory_normal',
    trigger: 'victory',
    messages: [
      "Félicitations ! Niveau terminé !",
      "Tu as réussi tous les puzzles !",
      "Super travail !",
    ],
    emotion: 'happy',
  },
];

// =============================================================================
// TIPS SCRIPTS
// =============================================================================

export const matricesTipsScripts: AssistantScript[] = [
  {
    id: 'tip_lines',
    trigger: 'tip',
    messages: [
      "Astuce : regarde chaque ligne séparément.",
    ],
    emotion: 'thinking',
  },
  {
    id: 'tip_columns',
    trigger: 'tip',
    messages: [
      "Et si tu observais les colonnes aussi ?",
    ],
    emotion: 'thinking',
  },
  {
    id: 'tip_transform',
    trigger: 'tip',
    messages: [
      "Cherche ce qui CHANGE entre les cases.",
    ],
    emotion: 'thinking',
  },
];

// =============================================================================
// EXPORT ALL SCRIPTS
// =============================================================================

export const matricesAssistantScripts = {
  intro: matricesIntroScripts,
  gameplay: matricesGameplayScripts,
  encouragement: matricesEncouragementScripts,
  victory: matricesVictoryScripts,
  tips: matricesTipsScripts,
};

export default matricesAssistantScripts;
