/**
 * Assistant Scripts - Chasseur de Papillons
 *
 * Dialogues de Flutty le Papillon pour le jeu
 * Ton doux et encourageant, accent sur l'attention et la concentration
 */

import type { AssistantScript } from '../../../core/types/core.types';

// ============================================================================
// SCRIPTS D'ACCUEIL
// ============================================================================

const welcomeScripts: AssistantScript[] = [
  {
    trigger: 'level_start',
    message: 'Coucou ! Je suis Flutty. Prêt à chasser des papillons ? 🦋',
    animation: 'wave',
  },
  {
    trigger: 'level_start',
    message: 'Les papillons arrivent ! Regarde bien leurs couleurs ! 🌈',
    animation: 'excited',
  },
  {
    trigger: 'level_start',
    message: 'Attention, attrape seulement les bons papillons ! 👀',
    animation: 'thinking',
  },
];

// ============================================================================
// SCRIPTS DE RÈGLE
// ============================================================================

const ruleScripts: AssistantScript[] = [
  {
    trigger: 'rule_shown',
    message: 'Voilà la consigne ! Lis-la bien avant de commencer. 📋',
    animation: 'pointing',
  },
  {
    trigger: 'rule_shown',
    message: 'Concentre-toi sur ce que tu dois attraper ! 🎯',
    animation: 'focus',
  },
];

// ============================================================================
// SCRIPTS DE BONNE PRISE
// ============================================================================

const catchScripts: AssistantScript[] = [
  {
    trigger: 'correct_catch',
    message: 'Bravo ! Tu as attrapé le bon ! 🎉',
    animation: 'celebrate',
  },
  {
    trigger: 'correct_catch',
    message: 'Super ! Continue comme ça ! ⭐',
    animation: 'happy',
  },
  {
    trigger: 'correct_catch',
    message: 'Bien joué ! Tes yeux sont rapides ! 👁️',
    animation: 'impressed',
  },
];

// ============================================================================
// SCRIPTS DE SÉRIE (STREAK)
// ============================================================================

const streakScripts: AssistantScript[] = [
  {
    trigger: 'streak_3',
    message: 'Waouh ! 3 d\'affilée ! Tu es concentré ! 🔥',
    animation: 'fire',
  },
  {
    trigger: 'streak_5',
    message: 'Incroyable ! 5 sans erreur ! 🌟',
    animation: 'amazed',
  },
  {
    trigger: 'streak_10',
    message: 'LÉGENDAIRE ! 10 papillons parfaits ! 🏆',
    animation: 'victory',
  },
];

// ============================================================================
// SCRIPTS D'ERREUR
// ============================================================================

const errorScripts: AssistantScript[] = [
  {
    trigger: 'wrong_catch',
    message: 'Oups ! Celui-là n\'était pas le bon. Relis la consigne ! 🤔',
    animation: 'encouraging',
  },
  {
    trigger: 'wrong_catch',
    message: 'Pas grave ! Regarde bien les couleurs avant d\'attraper.',
    animation: 'gentle',
  },
  {
    trigger: 'wrong_catch',
    message: 'Ce n\'était pas celui-là. Prends ton temps pour observer ! 👀',
    animation: 'thinking',
  },
];

// ============================================================================
// SCRIPTS DE PAPILLON MANQUÉ
// ============================================================================

const missScripts: AssistantScript[] = [
  {
    trigger: 'target_missed',
    message: 'Oh non, il s\'est envolé ! Le prochain sera pour toi ! 🦋',
    animation: 'sad',
  },
  {
    trigger: 'target_missed',
    message: 'Il était trop rapide ! Sois prêt pour le suivant !',
    animation: 'encouraging',
  },
];

// ============================================================================
// SCRIPTS D'ERREURS RÉPÉTÉES
// ============================================================================

const repeatedErrorScripts: AssistantScript[] = [
  {
    trigger: 'repeated_error',
    message: 'Je vais t\'aider ! Regarde bien la consigne en haut. 💡',
    animation: 'helpful',
    visualHint: 'highlightRule',
  },
  {
    trigger: 'repeated_error',
    message: 'Indice : observe d\'abord, attrape ensuite ! 🔍',
    animation: 'pointing',
  },
  {
    trigger: 'repeated_error',
    message: 'Prends ton temps ! La vitesse viendra après.',
    animation: 'gentle',
  },
];

// ============================================================================
// SCRIPTS D'INDICE
// ============================================================================

const hintScripts: AssistantScript[] = [
  {
    trigger: 'hint_requested',
    message: 'Indice : les bons papillons brillent un peu ! ✨',
    animation: 'helpful',
    visualHint: 'glowTargets',
  },
  {
    trigger: 'hint_requested',
    message: 'Regarde ! Je te montre lesquels attraper ! 👆',
    animation: 'pointing',
    visualHint: 'highlightTargets',
  },
  {
    trigger: 'hint_requested',
    message: 'Les papillons cibles ont une petite étoile ! ⭐',
    animation: 'wink',
    visualHint: 'starTargets',
  },
];

// ============================================================================
// SCRIPTS DE FIN DE VAGUE
// ============================================================================

const waveCompleteScripts: AssistantScript[] = [
  {
    trigger: 'wave_complete',
    message: 'Vague terminée ! Prêt pour la suivante ? 🌊',
    animation: 'happy',
  },
  {
    trigger: 'wave_complete',
    message: 'Bien joué ! Une nouvelle règle arrive... 🎲',
    animation: 'excited',
  },
];

// ============================================================================
// SCRIPTS DE VICTOIRE
// ============================================================================

const victoryScripts: AssistantScript[] = [
  {
    trigger: 'victory',
    message: 'BRAVO ! Tu es un vrai chasseur de papillons ! 🦋🎉',
    animation: 'celebrate',
  },
  {
    trigger: 'victory',
    message: 'Fantastique ! Ta concentration est incroyable ! 🏆',
    animation: 'victory',
  },
  {
    trigger: 'victory',
    message: 'Champion ! Les papillons n\'ont aucun secret pour toi ! ⭐',
    animation: 'proud',
  },
];

// ============================================================================
// SCRIPTS SPÉCIFIQUES AUX RÈGLES
// ============================================================================

const ruleSpecificScripts: AssistantScript[] = [
  // Règles de couleur
  {
    trigger: 'level_start',
    message: 'Aujourd\'hui, on cherche une couleur précise ! 🎨',
    animation: 'colorful',
    conditions: { ruleType: 'color' },
  },
  // Règles de taille
  {
    trigger: 'level_start',
    message: 'Attention à la taille des papillons ! 📏',
    animation: 'measuring',
    conditions: { ruleType: 'size' },
  },
  // Règles négatives
  {
    trigger: 'level_start',
    message: 'Attention ! Cette fois, il y a des papillons à ÉVITER ! 🚫',
    animation: 'warning',
    conditions: { ruleType: 'not_color' },
  },
  // Deux couleurs
  {
    trigger: 'level_start',
    message: 'Deux couleurs à attraper ! Ouvre bien les yeux ! 👀',
    animation: 'focused',
    conditions: { ruleType: 'two_colors' },
  },
];

// ============================================================================
// SCRIPTS DE RETOUR
// ============================================================================

const comebackScripts: AssistantScript[] = [
  {
    trigger: 'comeback',
    message: 'Te revoilà ! Les papillons t\'attendaient ! 🦋',
    animation: 'wave',
  },
  {
    trigger: 'comeback',
    message: 'Content de te revoir ! Prêt à chasser ? 🌸',
    animation: 'happy',
  },
];

// ============================================================================
// SCRIPTS DE PAUSE/BLOCAGE
// ============================================================================

const stuckScripts: AssistantScript[] = [
  {
    trigger: 'stuck',
    message: 'Prends ton temps ! Les papillons ne partent pas tout de suite. 🦋',
    animation: 'idle',
  },
  {
    trigger: 'stuck',
    message: 'Besoin d\'aide ? Clique sur le bouton indice ! 💡',
    animation: 'wave',
  },
];

// ============================================================================
// EXPORT
// ============================================================================

export const chasseurAssistantScripts: AssistantScript[] = [
  ...welcomeScripts,
  ...ruleScripts,
  ...catchScripts,
  ...streakScripts,
  ...errorScripts,
  ...missScripts,
  ...repeatedErrorScripts,
  ...hintScripts,
  ...waveCompleteScripts,
  ...victoryScripts,
  ...ruleSpecificScripts,
  ...comebackScripts,
  ...stuckScripts,
];

export {
  welcomeScripts as CHASSEUR_WELCOME_SCRIPTS,
  catchScripts as CHASSEUR_CATCH_SCRIPTS,
  errorScripts as CHASSEUR_ERROR_SCRIPTS,
  hintScripts as CHASSEUR_HINT_SCRIPTS,
  victoryScripts as CHASSEUR_VICTORY_SCRIPTS,
  streakScripts as CHASSEUR_STREAK_SCRIPTS,
};

export default chasseurAssistantScripts;
