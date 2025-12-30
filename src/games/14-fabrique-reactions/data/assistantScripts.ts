/**
 * Assistant Scripts - La Fabrique de Réactions
 * =============================================
 * Dialogues de Gédéon le Hamster Ingénieur
 * Ton enthousiaste et encourageant, vocabulaire d'atelier
 *
 * Expressions favorites :
 * - "Voyons voir..." (réflexion)
 * - "Tic-tac-tic-tac !" (quand il réfléchit)
 * - "Par mes moustaches !" (surprise)
 * - "Quelle invention !" (admiration)
 */

import type { AssistantScript } from '../types';

// ============================================
// MESSAGES PAR CONTEXTE
// ============================================

/** Messages d'accueil */
export const GEDEON_WELCOME: string[] = [
  "Salut, petit inventeur ! Je suis Gédéon. Prêt à construire des machines ?",
  "Bienvenue dans mon atelier ! Aujourd'hui, on fabrique des réactions en chaîne !",
  "Tic-tac-tic-tac ! Mon engrenage me dit que tu vas être génial !",
];

/** Messages au démarrage d'un niveau */
export const GEDEON_LEVEL_START: string[] = [
  "Voyons voir... Nouveau défi ! Place les éléments pour compléter la machine.",
  "Par mes moustaches ! Cette machine a besoin de toi !",
  "Observe bien le départ et l'arrivée. Par où l'énergie doit-elle passer ?",
];

/** Messages de succès */
export const GEDEON_SUCCESS: string[] = [
  "PAR MES MOUSTACHES ! C'est PARFAIT !",
  "BRAVO ! Tu penses comme un vrai ingénieur !",
  "Quelle invention ! L'énergie a voyagé jusqu'au bout !",
  "Tic-tac-tic-tac... DING ! Mission accomplie !",
  "Tu m'impressionnes, petit inventeur !",
];

/** Messages d'erreur (encourageants) */
export const GEDEON_ERROR: string[] = [
  "Oups ! L'énergie s'est arrêtée. Regarde où ça bloque...",
  "Pas tout à fait... Mais chaque essai nous rapproche de la solution !",
  "Hmm, voyons voir ce qui ne va pas. Observe le chemin de l'énergie.",
  "Ne t'inquiète pas ! Même les meilleurs ingénieurs font des essais.",
];

/** Messages après erreurs répétées */
export const GEDEON_STRUGGLING: string[] = [
  "Je vais t'aider ! Regarde cette zone...",
  "Par mes moustaches, c'est un puzzle coriace ! Utilise un indice.",
  "Savais-tu que Thomas Edison a fait 1000 essais ? Continue !",
  "Prends ton temps. Les meilleures inventions demandent de la patience.",
];

/** Messages d'indice */
export const GEDEON_HINT: string[] = [
  "Mon petit engrenage me dit de regarder par ici...",
  "Et si tu essayais quelque chose qui TOURNE ?",
  "Regarde bien la direction de l'énergie. Où doit-elle aller ?",
  "Un indice : cet élément peut aider à changer de direction !",
];

/** Messages quand l'enfant hésite */
export const GEDEON_IDLE: string[] = [
  "Tu réfléchis bien, je le vois !",
  "Prends ton temps pour observer...",
  "Parfois, c'est bien de tester même si on n'est pas sûr !",
  "Besoin d'un coup de patte ? Clique sur l'ampoule !",
];

/** Messages de placement (feedback immédiat) */
export const GEDEON_PLACEMENT_OK: string[] = [
  "Bien vu !",
  "Bonne idée !",
  "Ça peut marcher !",
  "Intéressant...",
];

export const GEDEON_PLACEMENT_UNSURE: string[] = [
  "Hmm, voyons ce que ça donne...",
  "Essayons ça !",
  "Lance la machine pour voir !",
];

/** Messages pendant la simulation */
export const GEDEON_SIMULATING: string[] = [
  "Voyons voir ce que ça donne... 3... 2... 1... GO !",
  "L'énergie commence son voyage !",
  "Tic-tac-tic-tac... Ça tourne !",
];

/** Messages de fin de session */
export const GEDEON_SESSION_END: string[] = [
  "Super session d'aujourd'hui ! Tu as fait des progrès incroyables !",
  "Par mes moustaches, tu es un vrai constructeur maintenant !",
  "À demain pour de nouvelles inventions, petit génie !",
];

/** Messages de streak (série de réussites) */
export const GEDEON_STREAK: string[] = [
  "Tu es EN FEU aujourd'hui ! Continue !",
  "Waouh ! Plusieurs niveaux d'affilée réussis !",
  "Processeur en surchauffe ! Tu es incroyable !",
];

// ============================================
// SCRIPTS STRUCTURÉS
// ============================================

const welcomeScripts: AssistantScript[] = GEDEON_WELCOME.map((message) => ({
  trigger: 'level_start',
  message,
  animation: 'wave',
}));

const errorScripts: AssistantScript[] = GEDEON_ERROR.map((message) => ({
  trigger: 'error',
  message,
  animation: 'encourage',
}));

const successScripts: AssistantScript[] = GEDEON_SUCCESS.map((message) => ({
  trigger: 'victory',
  message,
  animation: 'celebrate',
}));

const hintScripts: AssistantScript[] = GEDEON_HINT.map((message) => ({
  trigger: 'hint_requested',
  message,
  animation: 'thinking',
}));

const struggleScripts: AssistantScript[] = GEDEON_STRUGGLING.map((message) => ({
  trigger: 'repeated_error',
  message,
  animation: 'helpful',
}));

const idleScripts: AssistantScript[] = GEDEON_IDLE.map((message) => ({
  trigger: 'stuck',
  message,
  animation: 'idle',
}));

// ============================================
// EXPORT
// ============================================

export const fabriqueAssistantScripts: AssistantScript[] = [
  ...welcomeScripts,
  ...errorScripts,
  ...successScripts,
  ...hintScripts,
  ...struggleScripts,
  ...idleScripts,
];

export const GEDEON_MESSAGES = {
  welcome: GEDEON_WELCOME,
  levelStart: GEDEON_LEVEL_START,
  success: GEDEON_SUCCESS,
  error: GEDEON_ERROR,
  struggling: GEDEON_STRUGGLING,
  hint: GEDEON_HINT,
  idle: GEDEON_IDLE,
  placementOk: GEDEON_PLACEMENT_OK,
  placementUnsure: GEDEON_PLACEMENT_UNSURE,
  simulating: GEDEON_SIMULATING,
  sessionEnd: GEDEON_SESSION_END,
  streak: GEDEON_STREAK,
};

/**
 * Récupère un message aléatoire d'une catégorie
 */
export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export default fabriqueAssistantScripts;
