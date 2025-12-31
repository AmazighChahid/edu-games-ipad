/**
 * Assistant Scripts - Memory (Super Mémoire)
 *
 * Dialogues de Memo l'Éléphant pour le jeu Memory
 * Ton bienveillant et encourageant, accent sur la mémoire
 *
 * Conforme au système AssistantScript de core.types
 */

import type { AssistantScript, AssistantTrigger } from '../../../core/types/core.types';

// ============================================================================
// HELPERS
// ============================================================================

let scriptIdCounter = 0;
const createScript = (
  trigger: AssistantTrigger,
  messages: string[],
  priority: number = 1,
  conditions?: AssistantScript['conditions'],
  mood: 'happy' | 'encouraging' | 'neutral' | 'thinking' | 'excited' = 'happy'
): AssistantScript => ({
  id: `memory-script-${++scriptIdCounter}`,
  gameId: '07-memory',
  trigger,
  priority,
  messages: messages.map((text, index) => ({
    id: `msg-${scriptIdCounter}-${index}`,
    text,
    mood,
    duration: 3000,
  })),
  conditions,
});

// ============================================================================
// SCRIPTS D'ACCUEIL (game_start)
// ============================================================================

const welcomeScripts: AssistantScript[] = [
  createScript('game_start', [
    'Coucou ! Je suis Memo. Les éléphants ont une super mémoire, et toi aussi !',
  ], 10),
  createScript('game_start', [
    'Trouve les paires de cartes identiques ! Retourne deux cartes à la fois.',
  ], 9),
  createScript('game_start', [
    'Mémorise bien l\'emplacement des cartes. C\'est le secret !',
  ], 8),
];

// ============================================================================
// SCRIPTS DE PREMIER COUP
// ============================================================================

const firstMoveScripts: AssistantScript[] = [
  createScript('first_move', [
    'Bien joué ! Maintenant, cherche sa paire.',
  ], 5),
  createScript('first_move', [
    'Premier coup ! Souviens-toi de ce que tu vois.',
  ], 4),
];

// ============================================================================
// SCRIPTS D'ERREUR (invalid_move)
// ============================================================================

const errorScripts: AssistantScript[] = [
  createScript('invalid_move', [
    'Pas de match cette fois. Mais tu sais où sont ces cartes maintenant !',
  ], 3),
  createScript('invalid_move', [
    'Ce n\'est pas la bonne paire. Mémorise leur position !',
  ], 2),
  createScript('invalid_move', [
    'Pas grave ! Chaque erreur t\'aide à mieux mémoriser.',
  ], 2),
];

// ============================================================================
// SCRIPTS D'ERREURS RÉPÉTÉES
// ============================================================================

const repeatedErrorScripts: AssistantScript[] = [
  createScript('repeated_error', [
    'Essaie de te rappeler : où as-tu vu cette carte avant ?',
  ], 6),
  createScript('repeated_error', [
    'Astuce : concentre-toi sur une zone de la grille à la fois.',
  ], 5),
  createScript('repeated_error', [
    'Tu peux y arriver ! Prends ton temps pour observer.',
  ], 4),
];

// ============================================================================
// SCRIPTS DE MATCH TROUVÉ (valid_move)
// ============================================================================

const matchScripts: AssistantScript[] = [
  createScript('valid_move', [
    'Super ! Tu as trouvé une paire !',
  ], 7),
  createScript('valid_move', [
    'Bravo ! Ta mémoire fonctionne parfaitement !',
  ], 6),
  createScript('valid_move', [
    'Excellent ! Continue comme ça !',
  ], 5),
];

// ============================================================================
// SCRIPTS D'INDICE
// ============================================================================

const hintScripts: AssistantScript[] = [
  createScript('hint_requested', [
    'Un indice ? Regarde dans ce coin, je crois avoir vu quelque chose...',
  ], 8),
  createScript('hint_requested', [
    'Observe bien cette zone de la grille !',
  ], 7),
  createScript('hint_requested', [
    'Je me souviens ! Cette carte a une jumelle par là...',
  ], 6),
];

// ============================================================================
// SCRIPTS DE BLOCAGE
// ============================================================================

const stuckScripts: AssistantScript[] = [
  createScript('stuck', [
    'Tu réfléchis ? Un éléphant n\'oublie jamais, et toi non plus !',
  ], 4),
  createScript('stuck', [
    'Prends ton temps. La mémoire aime le calme.',
  ], 3),
  createScript('stuck', [
    'Besoin d\'aide ? Je suis là !',
  ], 2),
];

// ============================================================================
// SCRIPTS DE QUASI-VICTOIRE
// ============================================================================

const nearVictoryScripts: AssistantScript[] = [
  createScript('near_victory', [
    'Plus que quelques paires ! Tu y es presque !',
  ], 9),
  createScript('near_victory', [
    'La victoire est proche ! Concentre-toi !',
  ], 8),
];

// ============================================================================
// SCRIPTS DE VICTOIRE
// ============================================================================

const victoryScripts: AssistantScript[] = [
  createScript('victory', [
    'BRAVO ! Tu as trouvé toutes les paires ! Ta mémoire est incroyable !',
  ], 10),
  createScript('victory', [
    'Félicitations ! Un vrai champion de la mémoire !',
  ], 10),
  createScript('victory', [
    'Victoire ! Même un éléphant serait impressionné !',
  ], 10),
];

// ============================================================================
// SCRIPTS DE STREAK
// ============================================================================

const streakScripts: AssistantScript[] = [
  createScript('streak', [
    'Waouh ! Tu enchaînes les paires !',
  ], 8),
  createScript('streak', [
    'Incroyable ! Ta mémoire est en feu !',
  ], 7),
];

// ============================================================================
// SCRIPTS DE RETOUR
// ============================================================================

const comebackScripts: AssistantScript[] = [
  createScript('comeback', [
    'Re-bonjour ! Je n\'ai pas oublié que tu es super fort !',
  ], 10),
  createScript('comeback', [
    'Tu es de retour ! Prêt à entraîner ta mémoire ?',
  ], 9),
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
