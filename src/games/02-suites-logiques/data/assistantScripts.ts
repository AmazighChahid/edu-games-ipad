/**
 * Assistant Scripts - Suites Logiques
 *
 * Dialogues de Pixel le Robot pour le jeu des suites logiques
 * Ton amical et encourageant, accent sur la découverte de patterns
 */

import type { AssistantScript } from '@/core/types/core.types';

// ============================================================================
// SCRIPTS D'ACCUEIL
// ============================================================================

const welcomeScripts: AssistantScript[] = [
  {
    trigger: 'level_start',
    message: 'Bip bip ! Je suis Pixel. Trouvons le motif ensemble ! 🤖',
    animation: 'wave',
  },
  {
    trigger: 'level_start',
    message: 'Une nouvelle suite à décoder ! Observe bien la séquence...',
    animation: 'scan',
  },
  {
    trigger: 'level_start',
    message: 'Cherche la logique cachée ! Qu\'est-ce qui se répète ? 🔍',
    animation: 'thinking',
  },
];

// ============================================================================
// SCRIPTS DE PREMIER COUP
// ============================================================================

const firstMoveScripts: AssistantScript[] = [
  {
    trigger: 'first_move',
    message: 'Bip ! Tu as fait un choix. Voyons si c\'est correct !',
    animation: 'processing',
  },
  {
    trigger: 'first_move',
    message: 'Premier essai enregistré ! 🤖',
    animation: 'beep',
  },
];

// ============================================================================
// SCRIPTS D'ERREUR
// ============================================================================

const errorScripts: AssistantScript[] = [
  {
    trigger: 'error',
    message: 'Bzzzt ! Pas celui-là. Regarde encore la suite ! 🔄',
    animation: 'error',
  },
  {
    trigger: 'error',
    message: 'Hmm, ce n\'est pas le bon. Observe le motif qui se répète.',
    animation: 'thinking',
  },
  {
    trigger: 'error',
    message: 'Erreur détectée ! Mais chaque erreur nous rapproche de la solution. 🤖',
    animation: 'encourage',
  },
];

// ============================================================================
// SCRIPTS D'ERREURS RÉPÉTÉES
// ============================================================================

const repeatedErrorScripts: AssistantScript[] = [
  {
    trigger: 'repeated_error',
    message: 'Je vais t\'aider ! Regarde les 2-3 premiers éléments... 💡',
    animation: 'helpful',
    visualHint: 'highlightPattern',
  },
  {
    trigger: 'repeated_error',
    message: 'Indice : cherche ce qui revient TOUJOURS dans le même ordre.',
    animation: 'pointing',
    visualHint: 'showRepetition',
  },
  {
    trigger: 'repeated_error',
    message: 'Analyse en cours... Le motif se répète tous les X éléments ! 🔍',
    animation: 'scan',
    visualHint: 'showPatternLength',
  },
];

// ============================================================================
// SCRIPTS D'INDICE
// ============================================================================

const hintScripts: AssistantScript[] = [
  {
    trigger: 'hint_requested',
    message: 'Indice : compare le début et le milieu de la suite. Tu vois la répétition ?',
    animation: 'detective',
    visualHint: 'highlightComparison',
  },
  {
    trigger: 'hint_requested',
    message: 'Scanne avec moi : 1er élément... 2ème... Quel est le suivant logique ?',
    animation: 'scan',
    visualHint: 'stepByStep',
  },
  {
    trigger: 'hint_requested',
    message: 'Pense à la suite comme une chanson qui se répète ! 🎵',
    animation: 'musical',
    visualHint: 'rhythmHighlight',
  },
];

// ============================================================================
// SCRIPTS DE BLOCAGE
// ============================================================================

const stuckScripts: AssistantScript[] = [
  {
    trigger: 'stuck',
    message: 'Processeur en pause ? Prends ton temps pour analyser ! 🤖',
    animation: 'idle',
  },
  {
    trigger: 'stuck',
    message: 'Besoin d\'un scan approfondi ? Clique sur moi !',
    animation: 'wave',
  },
  {
    trigger: 'stuck',
    message: 'Même les robots ont besoin de réfléchir. C\'est normal ! 💭',
    animation: 'thinking',
  },
];

// ============================================================================
// SCRIPTS DE QUASI-VICTOIRE
// ============================================================================

const nearVictoryScripts: AssistantScript[] = [
  {
    trigger: 'near_victory',
    message: 'Bip bip ! Tu as presque trouvé le motif ! 🎯',
    animation: 'excited',
  },
  {
    trigger: 'near_victory',
    message: 'Excellent travail ! Plus qu\'un élément à identifier !',
    animation: 'encouraging',
  },
];

// ============================================================================
// SCRIPTS DE VICTOIRE
// ============================================================================

const victoryScripts: AssistantScript[] = [
  {
    trigger: 'victory',
    message: 'BINGO ! Pattern décodé avec succès ! 🎉🤖',
    animation: 'celebrate',
  },
  {
    trigger: 'victory',
    message: 'Mission accomplie ! Tu penses comme un vrai programmeur ! 🌟',
    animation: 'victory',
  },
  {
    trigger: 'victory',
    message: 'Félicitations ! Ta logique est impeccable ! 🏆',
    animation: 'proud',
  },
];

// ============================================================================
// SCRIPTS DE STREAK
// ============================================================================

const streakScripts: AssistantScript[] = [
  {
    trigger: 'streak',
    message: 'Waouh ! Tu décodes tout à la vitesse de la lumière ! ⚡',
    animation: 'speed',
  },
  {
    trigger: 'streak',
    message: 'Processeur en surchauffe ! Tu es incroyable ! 🔥',
    animation: 'fire',
  },
];

// ============================================================================
// SCRIPTS SPÉCIFIQUES AUX SUITES
// ============================================================================

const suitesSpecificScripts: AssistantScript[] = [
  // Par type de pattern
  {
    trigger: 'level_start',
    message: 'Suite de couleurs ! Quelles couleurs se répètent ? 🎨',
    animation: 'colorful',
    conditions: { patternType: 'colors' },
  },
  {
    trigger: 'level_start',
    message: 'Suite de formes ! Cercle, carré... Quelle forme vient après ? ⭐',
    animation: 'shapes',
    conditions: { patternType: 'shapes' },
  },
  {
    trigger: 'level_start',
    message: 'Suite de nombres ! Cherche la logique mathématique. 🔢',
    animation: 'calculate',
    conditions: { patternType: 'numbers' },
  },
  {
    trigger: 'level_start',
    message: 'Suite mixte ! Attention, plusieurs critères peuvent changer ! 🧩',
    animation: 'complex',
    conditions: { patternType: 'mixed' },
  },

  // Par difficulté
  {
    trigger: 'level_start',
    message: 'Motif simple de 2 éléments. Tu vas vite trouver !',
    animation: 'easy',
    conditions: { patternLength: 2 },
  },
  {
    trigger: 'level_start',
    message: 'Motif de 3 éléments. Un peu plus complexe, mais tu gères !',
    animation: 'medium',
    conditions: { patternLength: 3 },
  },
];

// ============================================================================
// SCRIPTS DE RETOUR
// ============================================================================

const comebackScripts: AssistantScript[] = [
  {
    trigger: 'comeback',
    message: 'Bip bip ! Content de te revoir ! Mes circuits t\'attendaient. 🤖',
    animation: 'wave',
  },
  {
    trigger: 'comeback',
    message: 'Redémarrage... Prêt pour de nouvelles suites logiques ?',
    animation: 'bootup',
  },
];

// ============================================================================
// EXPORT
// ============================================================================

export const suitesAssistantScripts: AssistantScript[] = [
  ...welcomeScripts,
  ...firstMoveScripts,
  ...errorScripts,
  ...repeatedErrorScripts,
  ...hintScripts,
  ...stuckScripts,
  ...nearVictoryScripts,
  ...victoryScripts,
  ...streakScripts,
  ...suitesSpecificScripts,
  ...comebackScripts,
];

export {
  welcomeScripts as SUITES_WELCOME_SCRIPTS,
  errorScripts as SUITES_ERROR_SCRIPTS,
  hintScripts as SUITES_HINT_SCRIPTS,
  victoryScripts as SUITES_VICTORY_SCRIPTS,
};

export default suitesAssistantScripts;
