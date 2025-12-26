/**
 * Feedback Pédagogique Bienveillant
 *
 * Système de feedback centralisé respectant les principes de CLAUDE.md :
 * - Erreur constructive : "Les erreurs sont des opportunités d'apprentissage"
 * - Pas de feedback punitif : "Jamais 'mauvaise réponse', mais 'essais à améliorer'"
 * - Encouragement positif : Messages bienveillants et valorisants
 */

import type {
  FeedbackType,
  FeedbackContext,
  FeedbackMessage,
  FeedbackAnimationConfig,
} from '../types/core.types';

// ============================================================================
// MESSAGES DE FEEDBACK PAR TYPE
// ============================================================================

/**
 * Messages de succès (réussite d'une action)
 */
const SUCCESS_MESSAGES: FeedbackMessage[] = [
  { id: 'success_1', text: 'Super !', mood: 'happy', duration: 1500, animation: 'stars', haptic: 'success' },
  { id: 'success_2', text: 'Bien joué !', mood: 'happy', duration: 1500, animation: 'stars', haptic: 'success' },
  { id: 'success_3', text: 'Bravo !', mood: 'happy', duration: 1500, animation: 'stars', haptic: 'success' },
  { id: 'success_4', text: 'Excellent !', mood: 'happy', duration: 1500, animation: 'stars', haptic: 'success' },
  { id: 'success_5', text: 'Parfait !', mood: 'happy', duration: 1500, animation: 'stars', haptic: 'success' },
  { id: 'success_6', text: 'Tu as compris !', mood: 'happy', duration: 1500, animation: 'stars', haptic: 'success' },
];

/**
 * Messages de victoire (niveau terminé)
 */
const VICTORY_MESSAGES: FeedbackMessage[] = [
  { id: 'victory_1', text: 'Félicitations ! Tu as réussi !', mood: 'happy', duration: 2500, animation: 'confetti', haptic: 'success' },
  { id: 'victory_2', text: 'Bravo ! Tu as trouvé la solution !', mood: 'happy', duration: 2500, animation: 'confetti', haptic: 'success' },
  { id: 'victory_3', text: 'Incroyable ! Tu es un champion !', mood: 'happy', duration: 2500, animation: 'confetti', haptic: 'success' },
  { id: 'victory_4', text: 'Magnifique ! Tu as bien réfléchi !', mood: 'happy', duration: 2500, animation: 'confetti', haptic: 'success' },
  { id: 'victory_5', text: 'Super travail ! Mission accomplie !', mood: 'happy', duration: 2500, animation: 'confetti', haptic: 'success' },
];

/**
 * Messages d'erreur (JAMAIS punitifs, toujours encourageants)
 */
const ERROR_MESSAGES: FeedbackMessage[] = [
  { id: 'error_1', text: 'Essaie encore !', mood: 'encouraging', duration: 1500, animation: 'shake', haptic: 'light' },
  { id: 'error_2', text: 'Presque !', mood: 'encouraging', duration: 1500, animation: 'shake', haptic: 'light' },
  { id: 'error_3', text: 'Tu y es presque !', mood: 'encouraging', duration: 1500, animation: 'shake', haptic: 'light' },
  { id: 'error_4', text: 'Continue, tu vas y arriver !', mood: 'encouraging', duration: 1500, animation: 'shake', haptic: 'light' },
  { id: 'error_5', text: 'Réfléchis bien...', mood: 'thinking', duration: 1500, animation: 'shake', haptic: 'light' },
  { id: 'error_6', text: 'Pas tout à fait, réessaie !', mood: 'encouraging', duration: 1500, animation: 'shake', haptic: 'light' },
];

/**
 * Messages d'encouragement (après inactivité ou difficulté)
 */
const ENCOURAGEMENT_MESSAGES: FeedbackMessage[] = [
  { id: 'encourage_1', text: 'Tu réfléchis bien !', mood: 'encouraging', duration: 2000, animation: 'pulse', haptic: 'none' },
  { id: 'encourage_2', text: 'Prends ton temps.', mood: 'neutral', duration: 2000, animation: 'none', haptic: 'none' },
  { id: 'encourage_3', text: 'Tu peux le faire !', mood: 'encouraging', duration: 2000, animation: 'pulse', haptic: 'none' },
  { id: 'encourage_4', text: 'Continue comme ça !', mood: 'happy', duration: 2000, animation: 'none', haptic: 'none' },
  { id: 'encourage_5', text: 'C\'est bien de réfléchir.', mood: 'neutral', duration: 2000, animation: 'none', haptic: 'none' },
];

/**
 * Messages d'indice
 */
const HINT_MESSAGES: FeedbackMessage[] = [
  { id: 'hint_1', text: 'Voici un petit indice...', mood: 'thinking', duration: 2000, animation: 'glow', haptic: 'light' },
  { id: 'hint_2', text: 'Regarde bien ici...', mood: 'thinking', duration: 2000, animation: 'glow', haptic: 'light' },
  { id: 'hint_3', text: 'Que vois-tu ?', mood: 'thinking', duration: 2000, animation: 'none', haptic: 'none' },
];

/**
 * Messages de streak (série de réussites)
 */
const STREAK_MESSAGES: FeedbackMessage[] = [
  { id: 'streak_3', text: '3 de suite ! Continue !', mood: 'happy', duration: 2000, animation: 'stars', haptic: 'medium' },
  { id: 'streak_5', text: '5 victoires ! Tu es en feu !', mood: 'excited', duration: 2500, animation: 'confetti', haptic: 'success' },
  { id: 'streak_10', text: '10 de suite ! Incroyable !', mood: 'excited', duration: 3000, animation: 'confetti', haptic: 'success' },
];

/**
 * Messages de milestone (accomplissement majeur)
 */
const MILESTONE_MESSAGES: FeedbackMessage[] = [
  { id: 'milestone_first_level', text: 'Premier niveau terminé !', mood: 'excited', duration: 3000, animation: 'confetti', haptic: 'success' },
  { id: 'milestone_no_errors', text: 'Sans aucune erreur ! Parfait !', mood: 'excited', duration: 3000, animation: 'confetti', haptic: 'success' },
  { id: 'milestone_fast', text: 'Super rapide ! Record battu !', mood: 'excited', duration: 3000, animation: 'confetti', haptic: 'success' },
];

// ============================================================================
// SÉLECTION DE MESSAGES
// ============================================================================

/**
 * Retourne un message de feedback approprié selon le contexte
 *
 * @param context - Contexte du feedback
 * @returns Message de feedback sélectionné
 */
export function getFeedbackMessage(context: FeedbackContext): FeedbackMessage {
  const messages = getMessagePool(context.type);

  // Sélection contextuelle pour les erreurs
  if (context.type === 'error' && context.errorCount !== undefined) {
    // Après 3+ erreurs, messages plus encourageants
    if (context.errorCount >= 3) {
      return selectRandomMessage([
        ERROR_MESSAGES[3], // "Continue, tu vas y arriver !"
        ERROR_MESSAGES[4], // "Réfléchis bien..."
      ]);
    }
  }

  // Sélection contextuelle pour les streaks
  if (context.type === 'streak' && context.streakCount !== undefined) {
    if (context.streakCount >= 10) {
      return STREAK_MESSAGES[2];
    }
    if (context.streakCount >= 5) {
      return STREAK_MESSAGES[1];
    }
    if (context.streakCount >= 3) {
      return STREAK_MESSAGES[0];
    }
  }

  // Sélection contextuelle pour la victoire
  if (context.type === 'victory') {
    // Victoire rapide
    if (context.moveCount !== undefined && context.moveCount <= 10) {
      return VICTORY_MESSAGES[3]; // "Magnifique ! Tu as bien réfléchi !"
    }
    // Première tentative réussie
    if (context.isFirstAttempt) {
      return VICTORY_MESSAGES[2]; // "Incroyable !"
    }
  }

  // Sélection aléatoire par défaut
  return selectRandomMessage(messages);
}

/**
 * Retourne le pool de messages pour un type donné
 */
function getMessagePool(type: FeedbackType): FeedbackMessage[] {
  switch (type) {
    case 'success':
      return SUCCESS_MESSAGES;
    case 'victory':
      return VICTORY_MESSAGES;
    case 'error':
      return ERROR_MESSAGES;
    case 'encouragement':
      return ENCOURAGEMENT_MESSAGES;
    case 'hint':
      return HINT_MESSAGES;
    case 'streak':
      return STREAK_MESSAGES;
    case 'milestone':
      return MILESTONE_MESSAGES;
    default:
      return ENCOURAGEMENT_MESSAGES;
  }
}

/**
 * Sélectionne un message aléatoire dans une liste
 */
function selectRandomMessage(messages: FeedbackMessage[]): FeedbackMessage {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}

// ============================================================================
// CONFIGURATION DES ANIMATIONS
// ============================================================================

/**
 * Configuration des animations de feedback
 */
export const FEEDBACK_ANIMATIONS: Record<string, FeedbackAnimationConfig> = {
  confetti: {
    type: 'confetti',
    duration: 2000,
    intensity: 'medium',
  },
  stars: {
    type: 'stars',
    duration: 1000,
    intensity: 'light',
  },
  shake: {
    type: 'shake',
    duration: 400,
    intensity: 'light',
  },
  pulse: {
    type: 'pulse',
    duration: 800,
    intensity: 'light',
  },
  glow: {
    type: 'glow',
    duration: 1500,
    intensity: 'medium',
    color: '#F39C12', // Jaune attention
  },
  bounce: {
    type: 'bounce',
    duration: 600,
    intensity: 'light',
  },
};

/**
 * Retourne la configuration d'animation pour un type de feedback
 */
export function getAnimationConfig(
  animationType: FeedbackMessage['animation']
): FeedbackAnimationConfig | null {
  if (!animationType || animationType === 'none') return null;
  return FEEDBACK_ANIMATIONS[animationType] || null;
}

// ============================================================================
// MESSAGES SPÉCIFIQUES PAR JEU
// ============================================================================

/**
 * Messages spécifiques pour Tour de Hanoï
 */
export const HANOI_MESSAGES = {
  invalid_big_on_small: {
    id: 'hanoi_invalid_1',
    text: 'Ce disque est un peu trop grand pour aller ici.',
    mood: 'thinking' as const,
    duration: 2500,
    animation: 'shake' as const,
    haptic: 'light' as const,
  },
  invalid_tower: {
    id: 'hanoi_invalid_2',
    text: 'Ce disque ne peut pas aller ici. Essaie un autre pilier.',
    mood: 'thinking' as const,
    duration: 2500,
    animation: 'shake' as const,
    haptic: 'light' as const,
  },
  hint_free_big: {
    id: 'hanoi_hint_1',
    text: 'Regarde le plus gros disque. Comment le libérer ?',
    mood: 'thinking' as const,
    duration: 3000,
    animation: 'glow' as const,
    haptic: 'none' as const,
  },
  method_learned: {
    id: 'hanoi_victory_1',
    text: 'Tu as trouvé la méthode ! Étape par étape.',
    mood: 'excited' as const,
    duration: 3000,
    animation: 'confetti' as const,
    haptic: 'success' as const,
  },
};

/**
 * Messages spécifiques pour Sudoku
 */
export const SUDOKU_MESSAGES = {
  conflict_row: {
    id: 'sudoku_invalid_1',
    text: 'Regarde cette ligne... il y a déjà ce symbole.',
    mood: 'thinking' as const,
    duration: 2500,
    animation: 'shake' as const,
    haptic: 'light' as const,
  },
  conflict_column: {
    id: 'sudoku_invalid_2',
    text: 'Ce symbole existe déjà dans cette colonne.',
    mood: 'thinking' as const,
    duration: 2500,
    animation: 'shake' as const,
    haptic: 'light' as const,
  },
  conflict_region: {
    id: 'sudoku_invalid_3',
    text: 'Il y en a déjà un dans ce carré.',
    mood: 'thinking' as const,
    duration: 2500,
    animation: 'shake' as const,
    haptic: 'light' as const,
  },
  hint_elimination: {
    id: 'sudoku_hint_1',
    text: 'Cherche une case où il ne manque qu\'un symbole...',
    mood: 'thinking' as const,
    duration: 3000,
    animation: 'glow' as const,
    haptic: 'none' as const,
  },
};

/**
 * Messages spécifiques pour Balance
 */
export const BALANCE_MESSAGES = {
  too_heavy_left: {
    id: 'balance_invalid_1',
    text: 'Le côté gauche est trop lourd !',
    mood: 'thinking' as const,
    duration: 2000,
    animation: 'shake' as const,
    haptic: 'light' as const,
  },
  too_heavy_right: {
    id: 'balance_invalid_2',
    text: 'Le côté droit est trop lourd maintenant !',
    mood: 'thinking' as const,
    duration: 2000,
    animation: 'shake' as const,
    haptic: 'light' as const,
  },
  almost_balanced: {
    id: 'balance_hint_1',
    text: 'Tu y es presque ! La balance hésite...',
    mood: 'encouraging' as const,
    duration: 2000,
    animation: 'pulse' as const,
    haptic: 'light' as const,
  },
  discovery: {
    id: 'balance_discovery',
    text: 'Tu as fait une découverte ! Note-la dans ton journal.',
    mood: 'excited' as const,
    duration: 3000,
    animation: 'stars' as const,
    haptic: 'success' as const,
  },
};

/**
 * Messages spécifiques pour Suites Logiques
 */
export const SUITES_MESSAGES = {
  wrong_pattern: {
    id: 'suites_invalid_1',
    text: 'Pas tout à fait... Regarde encore le motif.',
    mood: 'thinking' as const,
    duration: 2000,
    animation: 'shake' as const,
    haptic: 'light' as const,
  },
  hint_observe: {
    id: 'suites_hint_1',
    text: 'Observe bien : qu\'est-ce qui se répète ?',
    mood: 'thinking' as const,
    duration: 2500,
    animation: 'glow' as const,
    haptic: 'none' as const,
  },
  pattern_found: {
    id: 'suites_success_1',
    text: 'Tu as trouvé le motif ! Super observation !',
    mood: 'excited' as const,
    duration: 2500,
    animation: 'stars' as const,
    haptic: 'success' as const,
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  getFeedbackMessage,
  getAnimationConfig,
  SUCCESS_MESSAGES,
  VICTORY_MESSAGES,
  ERROR_MESSAGES,
  ENCOURAGEMENT_MESSAGES,
  HINT_MESSAGES,
  STREAK_MESSAGES,
  MILESTONE_MESSAGES,
  HANOI_MESSAGES,
  SUDOKU_MESSAGES,
  BALANCE_MESSAGES,
  SUITES_MESSAGES,
};
