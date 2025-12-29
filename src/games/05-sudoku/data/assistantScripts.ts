/**
 * Assistant Scripts - Sudoku
 *
 * Dialogues de Félix le Renard pour le jeu Sudoku
 * Ton bienveillant et encourageant, jamais punitif
 *
 * Note: La mascotte Félix remplace Prof. Hibou pour ce jeu
 */

import type { AssistantScript } from '@/core/types/core.types';

// ============================================================================
// SCRIPTS D'ACCUEIL
// ============================================================================

const welcomeScripts: AssistantScript[] = [
  {
    trigger: 'level_start',
    message: 'Coucou ! Je suis Félix. On va remplir cette grille ensemble ? 🦊',
    animation: 'wave',
  },
  {
    trigger: 'level_start',
    message: 'Prêt pour un nouveau défi ? Chaque symbole ne peut apparaître qu\'une seule fois par ligne et colonne !',
    animation: 'bounce',
  },
  {
    trigger: 'level_start',
    message: 'Une nouvelle grille ! Observe bien avant de commencer, tu vas trouver la solution. 🔍',
    animation: 'thinking',
  },
];

// ============================================================================
// SCRIPTS DE PREMIER COUP
// ============================================================================

const firstMoveScripts: AssistantScript[] = [
  {
    trigger: 'first_move',
    message: 'Super début ! Continue comme ça. 👍',
    animation: 'thumbsUp',
  },
  {
    trigger: 'first_move',
    message: 'C\'est parti ! Tu as fait le premier pas, c\'est le plus important.',
    animation: 'celebrate',
  },
];

// ============================================================================
// SCRIPTS D'ERREUR
// ============================================================================

const errorScripts: AssistantScript[] = [
  {
    trigger: 'error',
    message: 'Hmm, ce symbole est déjà présent ici. Cherche un autre endroit ! 🤔',
    animation: 'thinking',
  },
  {
    trigger: 'error',
    message: 'Pas tout à fait... Regarde bien la ligne et la colonne.',
    animation: 'gentle',
  },
  {
    trigger: 'error',
    message: 'Essaie encore ! Vérifie qu\'il n\'y a pas de doublon.',
    animation: 'encourage',
  },
];

// ============================================================================
// SCRIPTS D'ERREURS RÉPÉTÉES
// ============================================================================

const repeatedErrorScripts: AssistantScript[] = [
  {
    trigger: 'repeated_error',
    message: 'Je vois que c\'est difficile. Veux-tu un indice ? 💡',
    animation: 'helpful',
    visualHint: 'highlightRow',
  },
  {
    trigger: 'repeated_error',
    message: 'N\'abandonne pas ! Regarde cette case, je vais t\'aider. 🦊',
    animation: 'pointing',
    visualHint: 'highlightCell',
  },
  {
    trigger: 'repeated_error',
    message: 'C\'est normal de se tromper. On apprend en essayant ! Voici un coup de pouce.',
    animation: 'supportive',
    visualHint: 'showPossibilities',
  },
];

// ============================================================================
// SCRIPTS D'INDICE
// ============================================================================

const hintScripts: AssistantScript[] = [
  {
    trigger: 'hint_requested',
    message: 'Regarde cette case... Quels symboles sont déjà dans sa ligne ? 🔍',
    animation: 'pointing',
    visualHint: 'highlightRow',
  },
  {
    trigger: 'hint_requested',
    message: 'Observe la colonne. Un seul symbole peut aller ici !',
    animation: 'detective',
    visualHint: 'highlightColumn',
  },
  {
    trigger: 'hint_requested',
    message: 'Procède par élimination : si ce n\'est pas ceux-là, c\'est forcément...',
    animation: 'thinking',
    visualHint: 'eliminatePossibilities',
  },
  {
    trigger: 'hint_requested',
    message: 'Parfois, il faut chercher où un symbole DOIT aller, pas où il PEUT aller.',
    animation: 'wise',
    visualHint: 'highlightRequired',
  },
];

// ============================================================================
// SCRIPTS DE BLOCAGE
// ============================================================================

const stuckScripts: AssistantScript[] = [
  {
    trigger: 'stuck',
    message: 'Tu réfléchis ? Prends ton temps. Besoin d\'un coup de pouce ? 🤗',
    animation: 'patient',
  },
  {
    trigger: 'stuck',
    message: 'Je suis là si tu as besoin d\'aide. Clique sur moi pour un indice !',
    animation: 'wave',
  },
  {
    trigger: 'stuck',
    message: 'Parfois faire une pause aide à voir les choses autrement. 🦊',
    animation: 'relaxed',
  },
];

// ============================================================================
// SCRIPTS DE QUASI-VICTOIRE
// ============================================================================

const nearVictoryScripts: AssistantScript[] = [
  {
    trigger: 'near_victory',
    message: 'Tu y es presque ! Plus que quelques cases ! 🌟',
    animation: 'excited',
  },
  {
    trigger: 'near_victory',
    message: 'La grille est presque complète ! Tu vas y arriver !',
    animation: 'celebrate',
  },
  {
    trigger: 'near_victory',
    message: 'Encore un petit effort, la victoire est proche ! 🎉',
    animation: 'cheerful',
  },
];

// ============================================================================
// SCRIPTS DE VICTOIRE
// ============================================================================

const victoryScripts: AssistantScript[] = [
  {
    trigger: 'victory',
    message: 'BRAVO ! 🎊 Tu as complété la grille parfaitement !',
    animation: 'celebrate',
  },
  {
    trigger: 'victory',
    message: 'Incroyable ! Tu as résolu le Sudoku ! 🦊🏆',
    animation: 'jump',
  },
  {
    trigger: 'victory',
    message: 'Félicitations ! Ta logique est impressionnante ! 🌟',
    animation: 'proud',
  },
];

// ============================================================================
// SCRIPTS DE STREAK
// ============================================================================

const streakScripts: AssistantScript[] = [
  {
    trigger: 'streak',
    message: 'Quelle série ! Tu enchaînes les bonnes réponses ! 🔥',
    animation: 'fire',
  },
  {
    trigger: 'streak',
    message: 'Tu es en feu ! Continue comme ça ! 🌟',
    animation: 'excited',
  },
];

// ============================================================================
// SCRIPTS SPÉCIFIQUES AU SUDOKU
// ============================================================================

const sudokuSpecificScripts: AssistantScript[] = [
  // Conseils spécifiques par taille de grille
  {
    trigger: 'level_start',
    message: 'Une grille 4×4 ! Parfait pour commencer. Chaque ligne, colonne et carré a 4 symboles différents.',
    animation: 'explain',
    conditions: { gridSize: '4x4' },
  },
  {
    trigger: 'level_start',
    message: 'Grille 6×6 ! Un peu plus de réflexion nécessaire. Tu es prêt ? 🦊',
    animation: 'challenge',
    conditions: { gridSize: '6x6' },
  },
  {
    trigger: 'level_start',
    message: 'Wow, une grille 9×9 ! Le vrai défi du Sudoku. Je crois en toi ! 💪',
    animation: 'impressed',
    conditions: { gridSize: '9x9' },
  },

  // Conseils sur les techniques
  {
    trigger: 'hint_requested',
    message: 'Astuce : commence par les lignes ou colonnes qui ont le plus de cases remplies.',
    animation: 'wise',
  },
  {
    trigger: 'hint_requested',
    message: 'Cherche les "singletons" : les cases où un seul symbole est possible.',
    animation: 'detective',
  },
];

// ============================================================================
// SCRIPTS DE RETOUR
// ============================================================================

const comebackScripts: AssistantScript[] = [
  {
    trigger: 'comeback',
    message: 'Re-bonjour ! Content de te revoir. On reprend où tu t\'étais arrêté ? 🦊',
    animation: 'wave',
  },
  {
    trigger: 'comeback',
    message: 'Tu es de retour ! Tes neurones se sont bien reposés ? 🧠',
    animation: 'happy',
  },
];

// ============================================================================
// EXPORT
// ============================================================================

export const sudokuAssistantScripts: AssistantScript[] = [
  ...welcomeScripts,
  ...firstMoveScripts,
  ...errorScripts,
  ...repeatedErrorScripts,
  ...hintScripts,
  ...stuckScripts,
  ...nearVictoryScripts,
  ...victoryScripts,
  ...streakScripts,
  ...sudokuSpecificScripts,
  ...comebackScripts,
];

export {
  welcomeScripts as SUDOKU_WELCOME_SCRIPTS,
  errorScripts as SUDOKU_ERROR_SCRIPTS,
  hintScripts as SUDOKU_HINT_SCRIPTS,
  victoryScripts as SUDOKU_VICTORY_SCRIPTS,
};

export default sudokuAssistantScripts;
