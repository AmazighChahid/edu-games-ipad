/**
 * Assistant Scripts - Memory (Super Mémoire)
 *
 * Dialogues de Memo l'Éléphant pour le jeu Memory
 * Ton bienveillant et encourageant, accent sur la mémoire
 */

import type { AssistantScript } from '@/core/types/core.types';

// ============================================================================
// SCRIPTS D'ACCUEIL
// ============================================================================

const welcomeScripts: AssistantScript[] = [
  {
    trigger: 'level_start',
    message: 'Coucou ! Je suis Memo. Les éléphants ont une super mémoire, et toi aussi ! 🐘',
    animation: 'wave',
  },
  {
    trigger: 'level_start',
    message: 'Trouve les paires de cartes identiques ! Retourne deux cartes à la fois.',
    animation: 'explain',
  },
  {
    trigger: 'level_start',
    message: 'Mémorise bien l\'emplacement des cartes. C\'est le secret ! 🧠',
    animation: 'thinking',
  },
];

// ============================================================================
// SCRIPTS DE PREMIER COUP
// ============================================================================

const firstMoveScripts: AssistantScript[] = [
  {
    trigger: 'first_move',
    message: 'Bien joué ! Maintenant, cherche sa paire. 🔍',
    animation: 'encourage',
  },
  {
    trigger: 'first_move',
    message: 'Premier coup ! Souviens-toi de ce que tu vois.',
    animation: 'thinking',
  },
];

// ============================================================================
// SCRIPTS D'ERREUR (PAS DE MATCH)
// ============================================================================

const errorScripts: AssistantScript[] = [
  {
    trigger: 'error',
    message: 'Pas de match cette fois. Mais tu sais où sont ces cartes maintenant ! 🐘',
    animation: 'gentle',
  },
  {
    trigger: 'error',
    message: 'Ce n\'est pas la bonne paire. Mémorise leur position !',
    animation: 'thinking',
  },
  {
    trigger: 'error',
    message: 'Pas grave ! Chaque erreur t\'aide à mieux mémoriser.',
    animation: 'encourage',
  },
];

// ============================================================================
// SCRIPTS D'ERREURS RÉPÉTÉES
// ============================================================================

const repeatedErrorScripts: AssistantScript[] = [
  {
    trigger: 'repeated_error',
    message: 'Essaie de te rappeler : où as-tu vu cette carte avant ? 💡',
    animation: 'helpful',
    visualHint: 'pulseHint',
  },
  {
    trigger: 'repeated_error',
    message: 'Astuce : concentre-toi sur une zone de la grille à la fois.',
    animation: 'pointing',
    visualHint: 'highlightZone',
  },
  {
    trigger: 'repeated_error',
    message: 'Tu peux y arriver ! Prends ton temps pour observer. 🐘',
    animation: 'supportive',
  },
];

// ============================================================================
// SCRIPTS DE MATCH TROUVÉ
// ============================================================================

const matchScripts: AssistantScript[] = [
  {
    trigger: 'first_move', // Utilisé après un match réussi
    message: 'Super ! Tu as trouvé une paire ! 🎉',
    animation: 'celebrate',
    conditions: { isMatch: true },
  },
  {
    trigger: 'first_move',
    message: 'Bravo ! Ta mémoire fonctionne parfaitement ! 🧠',
    animation: 'proud',
    conditions: { isMatch: true },
  },
  {
    trigger: 'first_move',
    message: 'Excellent ! Continue comme ça !',
    animation: 'thumbsUp',
    conditions: { isMatch: true },
  },
];

// ============================================================================
// SCRIPTS D'INDICE
// ============================================================================

const hintScripts: AssistantScript[] = [
  {
    trigger: 'hint_requested',
    message: 'Un indice ? Regarde dans ce coin, je crois avoir vu quelque chose... 👀',
    animation: 'pointing',
    visualHint: 'highlightArea',
  },
  {
    trigger: 'hint_requested',
    message: 'Observe bien cette zone de la grille !',
    animation: 'detective',
    visualHint: 'focusZone',
  },
  {
    trigger: 'hint_requested',
    message: 'Je me souviens ! Cette carte a une jumelle par là... 🐘',
    animation: 'remember',
    visualHint: 'hintPair',
  },
];

// ============================================================================
// SCRIPTS DE BLOCAGE
// ============================================================================

const stuckScripts: AssistantScript[] = [
  {
    trigger: 'stuck',
    message: 'Tu réfléchis ? Un éléphant n\'oublie jamais, et toi non plus ! 🐘',
    animation: 'patient',
  },
  {
    trigger: 'stuck',
    message: 'Prends ton temps. La mémoire aime le calme.',
    animation: 'relaxed',
  },
  {
    trigger: 'stuck',
    message: 'Besoin d\'aide ? Je suis là !',
    animation: 'wave',
  },
];

// ============================================================================
// SCRIPTS DE QUASI-VICTOIRE
// ============================================================================

const nearVictoryScripts: AssistantScript[] = [
  {
    trigger: 'near_victory',
    message: 'Plus que quelques paires ! Tu y es presque ! 🌟',
    animation: 'excited',
  },
  {
    trigger: 'near_victory',
    message: 'La victoire est proche ! Concentre-toi ! 🐘',
    animation: 'encouraging',
  },
];

// ============================================================================
// SCRIPTS DE VICTOIRE
// ============================================================================

const victoryScripts: AssistantScript[] = [
  {
    trigger: 'victory',
    message: 'BRAVO ! 🎊 Tu as trouvé toutes les paires ! Ta mémoire est incroyable !',
    animation: 'celebrate',
  },
  {
    trigger: 'victory',
    message: 'Félicitations ! 🐘🏆 Un vrai champion de la mémoire !',
    animation: 'proud',
  },
  {
    trigger: 'victory',
    message: 'Victoire ! Même un éléphant serait impressionné ! 🌟',
    animation: 'jump',
  },
];

// ============================================================================
// SCRIPTS DE STREAK
// ============================================================================

const streakScripts: AssistantScript[] = [
  {
    trigger: 'streak',
    message: 'Waouh ! Tu enchaînes les paires ! 🔥',
    animation: 'fire',
  },
  {
    trigger: 'streak',
    message: 'Incroyable ! Ta mémoire est en feu ! 🧠⚡',
    animation: 'excited',
  },
];

// ============================================================================
// SCRIPTS SPÉCIFIQUES
// ============================================================================

const memorySpecificScripts: AssistantScript[] = [
  // Par nombre de paires
  {
    trigger: 'level_start',
    message: '4 paires seulement ! Parfait pour s\'échauffer. 🐘',
    animation: 'easy',
    conditions: { pairCount: 4 },
  },
  {
    trigger: 'level_start',
    message: '8 paires ! Le défi commence vraiment. 💪',
    animation: 'challenge',
    conditions: { pairCount: 8 },
  },
  {
    trigger: 'level_start',
    message: '12 paires ! Le niveau maximum ! Es-tu prêt ? 🐘🔥',
    animation: 'impressed',
    conditions: { pairCount: 12 },
  },

  // Avec limite de temps
  {
    trigger: 'level_start',
    message: 'Attention, le temps est compté ! Mais pas de panique. 🐘',
    animation: 'alert',
    conditions: { hasTimeLimit: true },
  },
];

// ============================================================================
// SCRIPTS DE RETOUR
// ============================================================================

const comebackScripts: AssistantScript[] = [
  {
    trigger: 'comeback',
    message: 'Re-bonjour ! Je n\'ai pas oublié que tu es super fort ! 🐘',
    animation: 'wave',
  },
  {
    trigger: 'comeback',
    message: 'Tu es de retour ! Prêt à entraîner ta mémoire ?',
    animation: 'happy',
  },
];

// ============================================================================
// EXPORT
// ============================================================================

export const memoryAssistantScripts: AssistantScript[] = [
  ...welcomeScripts,
  ...firstMoveScripts,
  ...errorScripts,
  ...repeatedErrorScripts,
  ...matchScripts,
  ...hintScripts,
  ...stuckScripts,
  ...nearVictoryScripts,
  ...victoryScripts,
  ...streakScripts,
  ...memorySpecificScripts,
  ...comebackScripts,
];

export {
  welcomeScripts as MEMORY_WELCOME_SCRIPTS,
  errorScripts as MEMORY_ERROR_SCRIPTS,
  hintScripts as MEMORY_HINT_SCRIPTS,
  victoryScripts as MEMORY_VICTORY_SCRIPTS,
  matchScripts as MEMORY_MATCH_SCRIPTS,
};

export default memoryAssistantScripts;
