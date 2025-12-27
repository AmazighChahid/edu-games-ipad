/**
 * Assistant Scripts - Balance (La Balance Magique)
 *
 * Dialogues de Dr. Hibou pour le jeu de la balance
 * Ton bienveillant et pédagogique sur les concepts d'équilibre et d'égalité
 */

import type { AssistantScript } from '../../../core/types/core.types';

// ============================================================================
// SCRIPTS D'ACCUEIL
// ============================================================================

const welcomeScripts: AssistantScript[] = [
  {
    trigger: 'level_start',
    message: 'Bienvenue dans mon laboratoire ! Trouvons ensemble l\'équilibre. ⚖️',
    animation: 'wave',
  },
  {
    trigger: 'level_start',
    message: 'Une balance équilibrée, c\'est quand les deux côtés pèsent pareil. Prêt ? 🦉',
    animation: 'explain',
  },
  {
    trigger: 'level_start',
    message: 'Observe bien les objets... Lequel va équilibrer la balance ?',
    animation: 'thinking',
  },
];

// ============================================================================
// SCRIPTS DE PREMIER COUP
// ============================================================================

const firstMoveScripts: AssistantScript[] = [
  {
    trigger: 'first_move',
    message: 'Bonne initiative ! Voyons ce que ça donne...',
    animation: 'curious',
  },
  {
    trigger: 'first_move',
    message: 'Tu essaies, c\'est le plus important ! 👍',
    animation: 'thumbsUp',
  },
];

// ============================================================================
// SCRIPTS D'ERREUR
// ============================================================================

const errorScripts: AssistantScript[] = [
  {
    trigger: 'error',
    message: 'Hmm, la balance penche... Essaie un autre objet ! ⚖️',
    animation: 'thinking',
  },
  {
    trigger: 'error',
    message: 'Pas encore équilibré. Regarde bien les poids !',
    animation: 'gentle',
  },
  {
    trigger: 'error',
    message: 'C\'est trop lourd ou trop léger. Continue d\'explorer !',
    animation: 'encourage',
  },
];

// ============================================================================
// SCRIPTS D'ERREURS RÉPÉTÉES
// ============================================================================

const repeatedErrorScripts: AssistantScript[] = [
  {
    trigger: 'repeated_error',
    message: 'Je vais t\'aider ! Regarde le poids de chaque côté. 💡',
    animation: 'helpful',
    visualHint: 'showWeights',
  },
  {
    trigger: 'repeated_error',
    message: 'Compte les petits carrés sur chaque objet, ils indiquent le poids.',
    animation: 'pointing',
    visualHint: 'highlightWeightIndicators',
  },
  {
    trigger: 'repeated_error',
    message: 'N\'oublie pas : équilibré = même poids des deux côtés ! 🦉',
    animation: 'wise',
    visualHint: 'showEquation',
  },
];

// ============================================================================
// SCRIPTS D'INDICE
// ============================================================================

const hintScripts: AssistantScript[] = [
  {
    trigger: 'hint_requested',
    message: 'Indice : additionne les poids d\'un côté, puis cherche l\'objet qui correspond.',
    animation: 'detective',
    visualHint: 'showSum',
  },
  {
    trigger: 'hint_requested',
    message: 'Regarde : ce côté pèse X. Quel objet pèse aussi X ? 🔍',
    animation: 'pointing',
    visualHint: 'highlightTarget',
  },
  {
    trigger: 'hint_requested',
    message: 'Parfois il faut combiner plusieurs objets pour trouver le bon poids.',
    animation: 'thinking',
    visualHint: 'showCombinations',
  },
];

// ============================================================================
// SCRIPTS DE BLOCAGE
// ============================================================================

const stuckScripts: AssistantScript[] = [
  {
    trigger: 'stuck',
    message: 'Tu réfléchis ? C\'est bien ! L\'équilibre demande de la patience. 🦉',
    animation: 'patient',
  },
  {
    trigger: 'stuck',
    message: 'Besoin d\'un coup de pouce ? Clique sur moi !',
    animation: 'wave',
  },
  {
    trigger: 'stuck',
    message: 'Les maths, c\'est comme une balance : il faut trouver l\'égalité.',
    animation: 'wise',
  },
];

// ============================================================================
// SCRIPTS DE QUASI-VICTOIRE
// ============================================================================

const nearVictoryScripts: AssistantScript[] = [
  {
    trigger: 'near_victory',
    message: 'Presque ! La balance est proche de l\'équilibre ! ⚖️',
    animation: 'excited',
  },
  {
    trigger: 'near_victory',
    message: 'Tu y es presque ! Un petit ajustement et c\'est bon !',
    animation: 'encouraging',
  },
];

// ============================================================================
// SCRIPTS DE VICTOIRE
// ============================================================================

const victoryScripts: AssistantScript[] = [
  {
    trigger: 'victory',
    message: 'PARFAIT ! La balance est en équilibre ! 🎉⚖️',
    animation: 'celebrate',
  },
  {
    trigger: 'victory',
    message: 'Bravo ! Tu as trouvé l\'égalité ! 🦉🏆',
    animation: 'proud',
  },
  {
    trigger: 'victory',
    message: 'Équilibre atteint ! Tu maîtrises les poids et mesures ! 🌟',
    animation: 'jump',
  },
];

// ============================================================================
// SCRIPTS DE STREAK
// ============================================================================

const streakScripts: AssistantScript[] = [
  {
    trigger: 'streak',
    message: 'Incroyable ! Tu enchaînes les équilibres ! 🔥',
    animation: 'fire',
  },
  {
    trigger: 'streak',
    message: 'Tu as l\'œil pour les balances ! Continue ! 🌟',
    animation: 'impressed',
  },
];

// ============================================================================
// SCRIPTS SPÉCIFIQUES À LA BALANCE
// ============================================================================

const balanceSpecificScripts: AssistantScript[] = [
  // Concepts pédagogiques
  {
    trigger: 'level_start',
    message: 'Savais-tu ? Une balance, c\'est comme une équation : les deux côtés doivent être égaux !',
    animation: 'teaching',
    conditions: { levelNumber: 3 },
  },
  {
    trigger: 'victory',
    message: 'Tu viens de découvrir le concept d\'équivalence ! C\'est important en maths. 🎓',
    animation: 'proud',
    conditions: { firstCompletion: true },
  },

  // Niveaux spéciaux
  {
    trigger: 'level_start',
    message: 'Mode Bac à Sable ! Expérimente librement avec la balance. 🧪',
    animation: 'excited',
    conditions: { mode: 'sandbox' },
  },
  {
    trigger: 'level_start',
    message: 'Niveau addition ! Il faudra peut-être combiner des objets... 🤔',
    animation: 'challenge',
    conditions: { requiresAddition: true },
  },
];

// ============================================================================
// SCRIPTS DE RETOUR
// ============================================================================

const comebackScripts: AssistantScript[] = [
  {
    trigger: 'comeback',
    message: 'Rebonjour jeune scientifique ! Prêt pour de nouvelles expériences ? 🦉',
    animation: 'wave',
  },
  {
    trigger: 'comeback',
    message: 'Ah, tu es de retour ! Ma balance t\'attendait. ⚖️',
    animation: 'happy',
  },
];

// ============================================================================
// EXPORT
// ============================================================================

export const balanceAssistantScripts: AssistantScript[] = [
  ...welcomeScripts,
  ...firstMoveScripts,
  ...errorScripts,
  ...repeatedErrorScripts,
  ...hintScripts,
  ...stuckScripts,
  ...nearVictoryScripts,
  ...victoryScripts,
  ...streakScripts,
  ...balanceSpecificScripts,
  ...comebackScripts,
];

export {
  welcomeScripts as BALANCE_WELCOME_SCRIPTS,
  errorScripts as BALANCE_ERROR_SCRIPTS,
  hintScripts as BALANCE_HINT_SCRIPTS,
  victoryScripts as BALANCE_VICTORY_SCRIPTS,
};

export default balanceAssistantScripts;
