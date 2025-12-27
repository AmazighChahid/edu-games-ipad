/**
 * Assistant Scripts - Tangram (Puzzle Formes)
 *
 * Dialogues de Géo le Géomètre pour le jeu Tangram
 * Ton bienveillant et encourageant, accent sur les formes géométriques
 */

import type { AssistantScript } from '@/core/types/core.types';

// ============================================================================
// SCRIPTS D'ACCUEIL
// ============================================================================

const welcomeScripts: AssistantScript[] = [
  {
    trigger: 'level_start',
    message: 'Bonjour ! Je suis Géo. Ensemble, créons des formes incroyables ! 📐',
    animation: 'wave',
  },
  {
    trigger: 'level_start',
    message: 'Un nouveau puzzle ! Place les 7 pièces pour former la silhouette.',
    animation: 'explain',
  },
  {
    trigger: 'level_start',
    message: 'Le Tangram, c\'est comme un casse-tête magique. Prêt à jouer ? ✨',
    animation: 'excited',
  },
];

// ============================================================================
// SCRIPTS DE PREMIER COUP
// ============================================================================

const firstMoveScripts: AssistantScript[] = [
  {
    trigger: 'first_move',
    message: 'Bien joué ! Tu as placé ta première pièce. Continue ! 👍',
    animation: 'thumbsUp',
  },
  {
    trigger: 'first_move',
    message: 'Super début ! N\'oublie pas que tu peux tourner les pièces.',
    animation: 'helpful',
  },
];

// ============================================================================
// SCRIPTS D'ERREUR
// ============================================================================

const errorScripts: AssistantScript[] = [
  {
    trigger: 'error',
    message: 'Cette pièce ne rentre pas ici. Essaie ailleurs ou tourne-la ! 🔄',
    animation: 'thinking',
  },
  {
    trigger: 'error',
    message: 'Hmm, pas tout à fait. Observe bien la forme de la silhouette.',
    animation: 'gentle',
  },
  {
    trigger: 'error',
    message: 'Les triangles peuvent aller dans plusieurs sens. Explore !',
    animation: 'encourage',
  },
];

// ============================================================================
// SCRIPTS D'ERREURS RÉPÉTÉES
// ============================================================================

const repeatedErrorScripts: AssistantScript[] = [
  {
    trigger: 'repeated_error',
    message: 'Besoin d\'aide ? Regarde le contour, il te guide. 💡',
    animation: 'helpful',
    visualHint: 'showOutline',
  },
  {
    trigger: 'repeated_error',
    message: 'Astuce : commence par les grandes pièces, puis les petites.',
    animation: 'wise',
    visualHint: 'highlightLargePieces',
  },
  {
    trigger: 'repeated_error',
    message: 'N\'oublie pas : tu peux retourner le parallélogramme ! 📐',
    animation: 'pointing',
    visualHint: 'showFlipOption',
  },
];

// ============================================================================
// SCRIPTS D'INDICE
// ============================================================================

const hintScripts: AssistantScript[] = [
  {
    trigger: 'hint_requested',
    message: 'Regarde cette pièce... Elle devrait aller par là. 👀',
    animation: 'pointing',
    visualHint: 'showPieceTarget',
  },
  {
    trigger: 'hint_requested',
    message: 'Le grand triangle forme souvent une base ou un côté.',
    animation: 'teaching',
    visualHint: 'highlightTarget',
  },
  {
    trigger: 'hint_requested',
    message: 'Essaie de tourner cette pièce de 45 degrés. 🔄',
    animation: 'detective',
    visualHint: 'showRotation',
  },
];

// ============================================================================
// SCRIPTS DE BLOCAGE
// ============================================================================

const stuckScripts: AssistantScript[] = [
  {
    trigger: 'stuck',
    message: 'Tu réfléchis ? La géométrie demande de la patience. 📐',
    animation: 'patient',
  },
  {
    trigger: 'stuck',
    message: 'Parfois, il faut tout déplacer et recommencer. C\'est OK !',
    animation: 'relaxed',
  },
  {
    trigger: 'stuck',
    message: 'Besoin d\'un coup de pouce ? Clique sur moi !',
    animation: 'wave',
  },
];

// ============================================================================
// SCRIPTS DE PIÈCE PLACÉE
// ============================================================================

const placedScripts: AssistantScript[] = [
  {
    trigger: 'first_move',
    message: 'Parfait ! Cette pièce est bien placée ! ✨',
    animation: 'celebrate',
    conditions: { isPlaced: true },
  },
  {
    trigger: 'first_move',
    message: 'Clic ! Une pièce de moins à placer !',
    animation: 'happy',
    conditions: { isPlaced: true },
  },
];

// ============================================================================
// SCRIPTS DE QUASI-VICTOIRE
// ============================================================================

const nearVictoryScripts: AssistantScript[] = [
  {
    trigger: 'near_victory',
    message: 'Plus qu\'une ou deux pièces ! Tu y es presque ! 🌟',
    animation: 'excited',
  },
  {
    trigger: 'near_victory',
    message: 'La forme se dessine ! Continue !',
    animation: 'encouraging',
  },
];

// ============================================================================
// SCRIPTS DE VICTOIRE
// ============================================================================

const victoryScripts: AssistantScript[] = [
  {
    trigger: 'victory',
    message: 'BRAVO ! 🎊 Tu as créé une magnifique forme !',
    animation: 'celebrate',
  },
  {
    trigger: 'victory',
    message: 'Incroyable ! Tu maîtrises la géométrie ! 📐🏆',
    animation: 'proud',
  },
  {
    trigger: 'victory',
    message: 'La silhouette est complète ! Tu es un artiste géomètre ! ✨',
    animation: 'jump',
  },
];

// ============================================================================
// SCRIPTS DE STREAK
// ============================================================================

const streakScripts: AssistantScript[] = [
  {
    trigger: 'streak',
    message: 'Tu places les pièces à la vitesse de l\'éclair ! ⚡',
    animation: 'speed',
  },
  {
    trigger: 'streak',
    message: 'Quelle précision ! Tu es un pro du Tangram ! 🔥',
    animation: 'fire',
  },
];

// ============================================================================
// SCRIPTS SPÉCIFIQUES AU TANGRAM
// ============================================================================

const tangramSpecificScripts: AssistantScript[] = [
  // Par type de puzzle
  {
    trigger: 'level_start',
    message: 'Un animal ! Les oreilles sont souvent faites de petits triangles. 🐱',
    animation: 'hint',
    conditions: { category: 'animals' },
  },
  {
    trigger: 'level_start',
    message: 'Un objet à construire ! Regarde bien les angles droits. 🏠',
    animation: 'explain',
    conditions: { category: 'objects' },
  },

  // Conseils sur les pièces
  {
    trigger: 'hint_requested',
    message: 'Le carré est unique ! Il peut parfois se cacher au centre.',
    animation: 'wise',
    conditions: { pieceType: 'square' },
  },
  {
    trigger: 'hint_requested',
    message: 'Le parallélogramme peut se retourner. C\'est sa particularité !',
    animation: 'teaching',
    conditions: { pieceType: 'parallelogram' },
  },
];

// ============================================================================
// SCRIPTS DE RETOUR
// ============================================================================

const comebackScripts: AssistantScript[] = [
  {
    trigger: 'comeback',
    message: 'Re-bonjour ! Prêt à créer de nouvelles formes ? 📐',
    animation: 'wave',
  },
  {
    trigger: 'comeback',
    message: 'Tu es de retour ! Les puzzles t\'attendent. ✨',
    animation: 'happy',
  },
];

// ============================================================================
// EXPORT
// ============================================================================

export const tangramAssistantScripts: AssistantScript[] = [
  ...welcomeScripts,
  ...firstMoveScripts,
  ...errorScripts,
  ...repeatedErrorScripts,
  ...hintScripts,
  ...stuckScripts,
  ...placedScripts,
  ...nearVictoryScripts,
  ...victoryScripts,
  ...streakScripts,
  ...tangramSpecificScripts,
  ...comebackScripts,
];

export {
  welcomeScripts as TANGRAM_WELCOME_SCRIPTS,
  errorScripts as TANGRAM_ERROR_SCRIPTS,
  hintScripts as TANGRAM_HINT_SCRIPTS,
  victoryScripts as TANGRAM_VICTORY_SCRIPTS,
};

export default tangramAssistantScripts;
