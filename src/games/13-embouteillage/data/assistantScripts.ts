/**
 * Assistant Scripts - Embouteillage
 *
 * Dialogues de Caro le Castor pour le jeu Embouteillage (Rush Hour)
 * Ton amical et encourageant, accent sur la planification et la stratégie
 */

import type { AssistantScript } from '../../../core/types/core.types';

// ============================================================================
// SCRIPTS D'ACCUEIL
// ============================================================================

const welcomeScripts: AssistantScript[] = [
  {
    trigger: 'level_start',
    message: 'Salut ! Je suis Caro le Castor. Libérons la voiture rouge ensemble !',
    animation: 'wave',
  },
  {
    trigger: 'level_start',
    message: 'Un nouvel embouteillage à résoudre ! Observe bien le parking...',
    animation: 'scan',
  },
  {
    trigger: 'level_start',
    message: 'La voiture rouge doit sortir ! Quels véhicules bloquent le chemin ?',
    animation: 'thinking',
  },
];

// ============================================================================
// SCRIPTS DE PREMIER COUP
// ============================================================================

const firstMoveScripts: AssistantScript[] = [
  {
    trigger: 'first_move',
    message: 'Bien joué ! Continue à déplacer les véhicules.',
    animation: 'happy',
  },
  {
    trigger: 'first_move',
    message: 'Premier mouvement ! Voyons où ça nous mène.',
    animation: 'curious',
  },
];

// ============================================================================
// SCRIPTS D'ERREUR (mouvement bloqué)
// ============================================================================

const errorScripts: AssistantScript[] = [
  {
    trigger: 'error',
    message: 'Oups ! Ce véhicule ne peut pas bouger par là. Il y a un obstacle !',
    animation: 'error',
  },
  {
    trigger: 'error',
    message: 'Bloqué ! Essaie de déplacer un autre véhicule d\'abord.',
    animation: 'thinking',
  },
  {
    trigger: 'error',
    message: 'Ce mouvement est impossible. Cherche un autre chemin !',
    animation: 'encourage',
  },
];

// ============================================================================
// SCRIPTS D'AIDE PROGRESSIVE
// ============================================================================

const hintScripts: AssistantScript[] = [
  {
    trigger: 'hint_requested',
    message: 'Indice : Regarde quel véhicule bloque directement la voiture rouge.',
    animation: 'pointing',
    visualHint: 'highlightBlocker',
  },
  {
    trigger: 'hint_requested',
    message: 'Astuce : Parfois il faut reculer pour mieux avancer !',
    animation: 'thinking',
    visualHint: 'showPath',
  },
  {
    trigger: 'hint_requested',
    message: 'Conseil : Déplace le véhicule surligné pour débloquer le passage.',
    animation: 'helpful',
    visualHint: 'highlightNextMove',
  },
];

// ============================================================================
// SCRIPTS DE BLOCAGE
// ============================================================================

const stuckScripts: AssistantScript[] = [
  {
    trigger: 'stuck',
    message: 'Tu réfléchis ? Prends ton temps, c\'est un vrai casse-tête !',
    animation: 'idle',
  },
  {
    trigger: 'stuck',
    message: 'Besoin d\'aide ? Clique sur l\'ampoule pour un indice !',
    animation: 'wave',
  },
  {
    trigger: 'stuck',
    message: 'Regarde le chemin vers la sortie. Que faut-il libérer ?',
    animation: 'thinking',
  },
];

// ============================================================================
// SCRIPTS DE PROGRESSION
// ============================================================================

const progressScripts: AssistantScript[] = [
  {
    trigger: 'good_move',
    message: 'Excellent mouvement ! Tu te rapproches de la solution.',
    animation: 'happy',
  },
  {
    trigger: 'good_move',
    message: 'Bien vu ! Le chemin se dégage.',
    animation: 'encouraging',
  },
  {
    trigger: 'near_victory',
    message: 'La voiture rouge peut presque sortir ! Encore un effort !',
    animation: 'excited',
  },
];

// ============================================================================
// SCRIPTS DE VICTOIRE
// ============================================================================

const victoryScripts: AssistantScript[] = [
  {
    trigger: 'victory',
    message: 'BRAVO ! La voiture rouge est libre ! Tu es un as du parking !',
    animation: 'celebrate',
  },
  {
    trigger: 'victory',
    message: 'Victoire ! Tu as résolu l\'embouteillage comme un pro !',
    animation: 'victory',
  },
  {
    trigger: 'victory',
    message: 'Fantastique ! Ton cerveau est aussi agile qu\'un castor !',
    animation: 'proud',
  },
];

// ============================================================================
// SCRIPTS DE PERFORMANCE
// ============================================================================

const performanceScripts: AssistantScript[] = [
  {
    trigger: 'optimal_solution',
    message: 'WOW ! Solution optimale ! Tu as trouvé le chemin le plus court !',
    animation: 'amazed',
  },
  {
    trigger: 'streak',
    message: 'Quelle série ! Tu enchaînes les victoires !',
    animation: 'fire',
  },
  {
    trigger: 'fast_solve',
    message: 'Super rapide ! Tu as un don pour la stratégie !',
    animation: 'speed',
  },
];

// ============================================================================
// SCRIPTS SPÉCIFIQUES AUX NIVEAUX
// ============================================================================

const levelSpecificScripts: AssistantScript[] = [
  {
    trigger: 'level_start',
    message: 'Niveau facile ! Parfait pour s\'échauffer.',
    animation: 'easy',
    conditions: { difficulty: 'easy' },
  },
  {
    trigger: 'level_start',
    message: 'Niveau moyen ! Ça demande un peu plus de réflexion.',
    animation: 'medium',
    conditions: { difficulty: 'medium' },
  },
  {
    trigger: 'level_start',
    message: 'Niveau difficile ! Prêt pour le défi ?',
    animation: 'challenge',
    conditions: { difficulty: 'hard' },
  },
  {
    trigger: 'level_start',
    message: 'Niveau expert ! Seuls les vrais stratèges réussissent !',
    animation: 'expert',
    conditions: { difficulty: 'expert' },
  },
];

// ============================================================================
// SCRIPTS DE RETOUR
// ============================================================================

const comebackScripts: AssistantScript[] = [
  {
    trigger: 'comeback',
    message: 'Te revoilà ! Prêt à débloquer de nouveaux parkings ?',
    animation: 'wave',
  },
  {
    trigger: 'comeback',
    message: 'Content de te revoir ! Les voitures t\'attendaient.',
    animation: 'happy',
  },
];

// ============================================================================
// MESSAGES POUR L'INTERFACE
// ============================================================================

export const TRAFFIC_MESSAGES = {
  start: [
    'Libère la voiture rouge !',
    'Trouve le chemin vers la sortie !',
    'Déplace les véhicules pour créer un passage.',
  ],
  success: [
    'Parfait ! La voiture est libre !',
    'Bravo ! Embouteillage résolu !',
    'Excellent ! Tu as réussi !',
  ],
  error: [
    'Ce véhicule est bloqué !',
    'Impossible de bouger par là.',
    'Essaie un autre mouvement.',
  ],
  hint1: 'Regarde quel véhicule bloque la voiture rouge...',
  hint2: 'Essaie de déplacer le véhicule surligné.',
  hint3: 'Voici le prochain mouvement optimal.',
};

// ============================================================================
// EXPORT
// ============================================================================

export const embouteillageAssistantScripts: AssistantScript[] = [
  ...welcomeScripts,
  ...firstMoveScripts,
  ...errorScripts,
  ...hintScripts,
  ...stuckScripts,
  ...progressScripts,
  ...victoryScripts,
  ...performanceScripts,
  ...levelSpecificScripts,
  ...comebackScripts,
];

export {
  welcomeScripts as EMBOUTEILLAGE_WELCOME_SCRIPTS,
  errorScripts as EMBOUTEILLAGE_ERROR_SCRIPTS,
  hintScripts as EMBOUTEILLAGE_HINT_SCRIPTS,
  victoryScripts as EMBOUTEILLAGE_VICTORY_SCRIPTS,
};

export default embouteillageAssistantScripts;
