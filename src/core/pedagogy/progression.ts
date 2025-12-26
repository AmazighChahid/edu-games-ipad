/**
 * Progression Montessori
 *
 * Système de progression adapté aux principes Montessori :
 * - Autonomie et auto-correction
 * - Progression libre au rythme de l'enfant
 * - Zone de développement proximal (Vygotsky)
 *
 * Règle clé : Un niveau doit être réussi 2 fois pour débloquer le suivant
 */

import type {
  LevelConfig,
  LevelProgress,
  PerformanceHistory,
  SessionSummary,
  HelpLevel,
} from '../types/core.types';

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * Nombre de réussites requises pour débloquer le niveau suivant
 * Selon CLAUDE.md : "Niveau 2 débloqué si Niveau 1 réussi 2x"
 */
export const DEFAULT_REQUIRED_COMPLETIONS = 2;

/**
 * Seuils pour déterminer le niveau d'aide
 */
export const HELP_LEVEL_THRESHOLDS = {
  full: { maxCompletions: 0, maxErrors: Infinity },
  medium: { maxCompletions: 2, maxErrors: 5 },
  low: { maxCompletions: 4, maxErrors: 3 },
  none: { minCompletions: 6 },
};

// ============================================================================
// FONCTIONS DE DÉVERROUILLAGE
// ============================================================================

/**
 * Vérifie si un niveau est débloqué selon la progression Montessori
 *
 * @param levelId - ID du niveau à vérifier
 * @param levelProgresses - Historique de progression de tous les niveaux
 * @param levelConfigs - Configuration de tous les niveaux
 * @returns true si le niveau est débloqué
 */
export function checkLevelUnlock(
  levelId: string,
  levelProgresses: Record<string, LevelProgress>,
  levelConfigs: LevelConfig[]
): boolean {
  // Trouver la config du niveau
  const levelConfig = levelConfigs.find((l) => l.id === levelId);
  if (!levelConfig) return false;

  // Le premier niveau est toujours débloqué
  const levelIndex = levelConfigs.findIndex((l) => l.id === levelId);
  if (levelIndex === 0) return true;

  // Vérifier que le niveau précédent a été complété suffisamment de fois
  const previousLevel = levelConfigs[levelIndex - 1];
  if (!previousLevel) return true;

  const previousProgress = levelProgresses[previousLevel.id];
  if (!previousProgress) return false;

  const requiredCompletions = previousLevel.requiredCompletions || DEFAULT_REQUIRED_COMPLETIONS;
  return previousProgress.completions >= requiredCompletions;
}

/**
 * Vérifie si un niveau spécifique peut être débloqué
 * basé sur le nombre de complétions du niveau précédent
 *
 * @param previousLevelCompletions - Nombre de fois que le niveau précédent a été complété
 * @param requiredCompletions - Nombre requis (défaut: 2)
 * @returns true si le niveau suivant peut être débloqué
 */
export function canUnlockNextLevel(
  previousLevelCompletions: number,
  requiredCompletions: number = DEFAULT_REQUIRED_COMPLETIONS
): boolean {
  return previousLevelCompletions >= requiredCompletions;
}

/**
 * Retourne tous les niveaux débloqués pour un jeu
 *
 * @param gameId - ID du jeu
 * @param levelProgresses - Historique de progression
 * @param levelConfigs - Configuration des niveaux
 * @returns Liste des IDs de niveaux débloqués
 */
export function getUnlockedLevels(
  gameId: string,
  levelProgresses: Record<string, LevelProgress>,
  levelConfigs: LevelConfig[]
): string[] {
  const gameLevels = levelConfigs.filter((l) => l.gameId === gameId);
  const unlockedLevels: string[] = [];

  for (const level of gameLevels) {
    if (checkLevelUnlock(level.id, levelProgresses, gameLevels)) {
      unlockedLevels.push(level.id);
    }
  }

  return unlockedLevels;
}

// ============================================================================
// AIDE ADAPTATIVE
// ============================================================================

/**
 * Détermine le niveau d'aide visuelle basé sur la performance
 *
 * Progression Montessori :
 * - FULL : Début, aide visuelle forte (zones cibles illuminées)
 * - MEDIUM : Indices subtils après quelques réussites
 * - LOW : Encouragements seuls
 * - NONE : Autonomie totale
 *
 * @param completions - Nombre de fois le niveau complété
 * @param errorCount - Nombre d'erreurs dans la session actuelle
 * @returns Niveau d'aide approprié
 */
export function getAdaptiveHelpLevel(
  completions: number,
  errorCount: number
): HelpLevel {
  // Si beaucoup d'erreurs, augmenter l'aide temporairement
  if (errorCount >= 5) {
    return 'full';
  }
  if (errorCount >= 3) {
    return 'medium';
  }

  // Sinon, baser sur le nombre de complétions
  if (completions >= HELP_LEVEL_THRESHOLDS.none.minCompletions) {
    return 'none';
  }
  if (completions >= HELP_LEVEL_THRESHOLDS.low.maxCompletions) {
    return 'low';
  }
  if (completions >= HELP_LEVEL_THRESHOLDS.medium.maxCompletions) {
    return 'medium';
  }

  return 'full';
}

/**
 * Détermine si un indice doit être proposé
 * Selon CLAUDE.md : "Proposer indice après 2 erreurs"
 *
 * @param consecutiveErrors - Nombre d'erreurs consécutives
 * @param threshold - Seuil (défaut: 2)
 * @returns true si un indice doit être proposé
 */
export function shouldOfferHint(
  consecutiveErrors: number,
  threshold: number = 2
): boolean {
  return consecutiveErrors >= threshold;
}

// ============================================================================
// CALCUL DE PROGRESSION
// ============================================================================

/**
 * Calcule la progression globale Montessori
 *
 * @param sessions - Historique des sessions
 * @returns Score de progression (0-100)
 */
export function calculateMontessoriProgress(
  sessions: SessionSummary[]
): number {
  if (sessions.length === 0) return 0;

  // Facteurs de pondération
  const weights = {
    completionRate: 0.4,
    errorReduction: 0.3,
    autonomy: 0.3,
  };

  // Taux de complétion
  const completedSessions = sessions.filter((s) => s.completed).length;
  const completionRate = completedSessions / sessions.length;

  // Réduction des erreurs (comparer première et dernière moitié)
  const midPoint = Math.floor(sessions.length / 2);
  const firstHalf = sessions.slice(0, midPoint);
  const secondHalf = sessions.slice(midPoint);

  const firstHalfErrors = firstHalf.reduce((sum, s) => sum + s.errorCount, 0) / (firstHalf.length || 1);
  const secondHalfErrors = secondHalf.reduce((sum, s) => sum + s.errorCount, 0) / (secondHalf.length || 1);
  const errorReduction = firstHalfErrors > 0
    ? Math.max(0, (firstHalfErrors - secondHalfErrors) / firstHalfErrors)
    : 0.5;

  // Autonomie (moins d'indices utilisés)
  const firstHalfHints = firstHalf.reduce((sum, s) => sum + s.hintsUsed, 0) / (firstHalf.length || 1);
  const secondHalfHints = secondHalf.reduce((sum, s) => sum + s.hintsUsed, 0) / (secondHalf.length || 1);
  const autonomy = firstHalfHints > 0
    ? Math.max(0, (firstHalfHints - secondHalfHints) / firstHalfHints)
    : 0.5;

  // Score final
  const score =
    weights.completionRate * completionRate +
    weights.errorReduction * errorReduction +
    weights.autonomy * autonomy;

  return Math.round(score * 100);
}

/**
 * Calcule les statistiques de performance pour un jeu
 *
 * @param sessions - Sessions du jeu
 * @returns Statistiques agrégées
 */
export function calculatePerformanceStats(
  sessions: SessionSummary[]
): {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  averageErrors: number;
  averageHints: number;
  averageTime: number;
  bestTime: number | null;
  currentStreak: number;
} {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      completedSessions: 0,
      completionRate: 0,
      averageErrors: 0,
      averageHints: 0,
      averageTime: 0,
      bestTime: null,
      currentStreak: 0,
    };
  }

  const completedSessions = sessions.filter((s) => s.completed);
  const totalErrors = sessions.reduce((sum, s) => sum + s.errorCount, 0);
  const totalHints = sessions.reduce((sum, s) => sum + s.hintsUsed, 0);
  const totalTime = sessions.reduce((sum, s) => sum + (s.endedAt - s.startedAt), 0);

  // Calculer le streak actuel (séries de victoires consécutives)
  let currentStreak = 0;
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].completed) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Meilleur temps
  const completedTimes = completedSessions.map((s) => s.endedAt - s.startedAt);
  const bestTime = completedTimes.length > 0 ? Math.min(...completedTimes) : null;

  return {
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    completionRate: completedSessions.length / sessions.length,
    averageErrors: totalErrors / sessions.length,
    averageHints: totalHints / sessions.length,
    averageTime: totalTime / sessions.length,
    bestTime,
    currentStreak,
  };
}

/**
 * Détermine le nombre d'étoiles gagnées pour une session
 *
 * @param session - Session terminée
 * @param optimalMoves - Nombre de mouvements optimaux
 * @param optimalTime - Temps optimal en secondes
 * @returns Nombre d'étoiles (1-3)
 */
export function calculateStars(
  session: SessionSummary,
  optimalMoves?: number,
  optimalTime?: number
): 1 | 2 | 3 {
  if (!session.completed) return 1;

  let stars: 1 | 2 | 3 = 1;

  // Performance des mouvements
  if (optimalMoves && session.moveCount <= optimalMoves * 1.5) {
    stars = 2;
    if (session.moveCount <= optimalMoves * 1.1) {
      stars = 3;
    }
  }

  // Performance du temps
  const sessionTime = (session.endedAt - session.startedAt) / 1000;
  if (optimalTime && sessionTime <= optimalTime * 2) {
    stars = Math.max(stars, 2) as 1 | 2 | 3;
    if (sessionTime <= optimalTime * 1.5) {
      stars = 3;
    }
  }

  // Bonus si aucune erreur et pas d'indices
  if (session.errorCount === 0 && session.hintsUsed === 0) {
    stars = 3;
  }

  return stars;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  checkLevelUnlock,
  canUnlockNextLevel,
  getUnlockedLevels,
  getAdaptiveHelpLevel,
  shouldOfferHint,
  calculateMontessoriProgress,
  calculatePerformanceStats,
  calculateStars,
  DEFAULT_REQUIRED_COMPLETIONS,
  HELP_LEVEL_THRESHOLDS,
};
