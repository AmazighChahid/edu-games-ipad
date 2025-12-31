/**
 * Adaptation de Difficulté
 *
 * Système d'adaptation automatique basé sur :
 * - Zone de développement proximal (Vygotsky)
 * - Ni trop facile, ni trop difficile
 * - Aide visuelle décroissante avec la maîtrise
 */

import type {
  HelpLevel,
  DifficultyAdaptationConfig,
  DifficultyRecommendation,
  PerformanceHistory,
  SessionSummary,
  VisualHintsConfig,
} from '../types/core.types';

// ============================================================================
// CONFIGURATION PAR DÉFAUT
// ============================================================================

/**
 * Configuration par défaut pour l'adaptation de difficulté
 */
export const DEFAULT_ADAPTATION_CONFIG: DifficultyAdaptationConfig = {
  upgradeThreshold: {
    minCompletions: 3,
    maxErrorRate: 0.2, // 20% d'erreurs max
    maxHintsPerLevel: 1,
  },
  downgradeThreshold: {
    minErrors: 5,
    maxCompletionRate: 0.3, // Moins de 30% de réussite
  },
  helpLevelProgression: {
    full: { maxErrors: Infinity, maxCompletions: 0 },
    medium: { maxErrors: 5, maxCompletions: 2 },
    low: { maxErrors: 3, maxCompletions: 4 },
    none: { minCompletions: 6 },
  },
};

// ============================================================================
// ADAPTATION DE DIFFICULTÉ
// ============================================================================

/**
 * Analyse la performance et recommande une adaptation
 *
 * @param history - Historique de performance
 * @param config - Configuration d'adaptation
 * @returns Recommandation d'adaptation
 */
export function adaptDifficulty(
  history: PerformanceHistory,
  config: DifficultyAdaptationConfig = DEFAULT_ADAPTATION_CONFIG
): DifficultyRecommendation {
  const { sessions } = history;

  if (sessions.length < 3) {
    return {
      action: 'maintain',
      currentHelpLevel: 'full',
      suggestedHelpLevel: 'full',
      reason: 'Pas assez de données pour adapter',
      confidence: 0.3,
    };
  }

  // Analyser les 5 dernières sessions
  const recentSessions = sessions.slice(-5);
  const completedCount = recentSessions.filter(s => s.completed).length;
  const totalErrors = recentSessions.reduce((sum, s) => sum + s.errorCount, 0);
  const totalHints = recentSessions.reduce((sum, s) => sum + s.hintsUsed, 0);
  const errorRate = totalErrors / recentSessions.length;
  const completionRate = completedCount / recentSessions.length;

  // Déterminer le niveau d'aide actuel
  const currentHelpLevel = determineCurrentHelpLevel(sessions, config);

  // Vérifier si on peut augmenter la difficulté (moins d'aide)
  if (
    completedCount >= config.upgradeThreshold.minCompletions &&
    errorRate <= config.upgradeThreshold.maxErrorRate &&
    totalHints <= config.upgradeThreshold.maxHintsPerLevel * recentSessions.length
  ) {
    const nextLevel = getNextHelpLevel(currentHelpLevel, 'decrease');
    if (nextLevel !== currentHelpLevel) {
      return {
        action: 'upgrade',
        currentHelpLevel,
        suggestedHelpLevel: nextLevel,
        reason: `Excellente performance : ${completedCount}/${recentSessions.length} réussites avec peu d'erreurs`,
        confidence: calculateConfidence(completionRate, errorRate),
      };
    }
  }

  // Vérifier si on doit diminuer la difficulté (plus d'aide)
  if (
    totalErrors >= config.downgradeThreshold.minErrors ||
    completionRate <= config.downgradeThreshold.maxCompletionRate
  ) {
    const nextLevel = getNextHelpLevel(currentHelpLevel, 'increase');
    if (nextLevel !== currentHelpLevel) {
      return {
        action: 'downgrade',
        currentHelpLevel,
        suggestedHelpLevel: nextLevel,
        reason: `Difficulté détectée : ${totalErrors} erreurs, ${Math.round(completionRate * 100)}% de réussite`,
        confidence: calculateConfidence(1 - completionRate, errorRate / 10),
      };
    }
  }

  // Maintenir le niveau actuel
  return {
    action: 'maintain',
    currentHelpLevel,
    suggestedHelpLevel: currentHelpLevel,
    reason: 'Performance dans la zone optimale',
    confidence: 0.7,
  };
}

/**
 * Détermine le niveau d'aide actuel basé sur l'historique
 */
function determineCurrentHelpLevel(
  sessions: SessionSummary[],
  config: DifficultyAdaptationConfig
): HelpLevel {
  const completedCount = sessions.filter(s => s.completed).length;
  const recentErrors = sessions.slice(-3).reduce((sum, s) => sum + s.errorCount, 0);

  const { helpLevelProgression } = config;

  if (completedCount >= helpLevelProgression.none.minCompletions && recentErrors < 3) {
    return 'none';
  }
  if (completedCount >= helpLevelProgression.low.maxCompletions && recentErrors <= helpLevelProgression.low.maxErrors) {
    return 'low';
  }
  if (completedCount >= helpLevelProgression.medium.maxCompletions && recentErrors <= helpLevelProgression.medium.maxErrors) {
    return 'medium';
  }

  return 'full';
}

/**
 * Retourne le niveau d'aide suivant
 */
function getNextHelpLevel(current: HelpLevel, direction: 'increase' | 'decrease'): HelpLevel {
  const levels: HelpLevel[] = ['none', 'low', 'medium', 'full'];
  const currentIndex = levels.indexOf(current);

  if (direction === 'decrease') {
    return currentIndex > 0 ? levels[currentIndex - 1] : current;
  } else {
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : current;
  }
}

/**
 * Calcule un score de confiance pour la recommandation
 */
function calculateConfidence(primaryFactor: number, secondaryFactor: number): number {
  return Math.min(0.95, Math.max(0.3, (primaryFactor + secondaryFactor) / 2));
}

// ============================================================================
// INDICES VISUELS
// ============================================================================

/**
 * Retourne la configuration des indices visuels selon le niveau d'aide
 *
 * Selon CLAUDE.md :
 * - FULL : Zones cibles illuminées, guidance décroissante
 * - MEDIUM : Indices subtils
 * - LOW : Encouragements seuls
 * - NONE : Autonomie totale
 */
export function getVisualHints(helpLevel: HelpLevel): VisualHintsConfig {
  switch (helpLevel) {
    case 'full':
      return {
        helpLevel: 'full',
        showTargetZones: true,
        highlightNextMove: true,
        showMovePath: true,
        pulseValidTargets: true,
        dimInvalidOptions: true,
        showMoveCounter: true,
        showOptimalMoves: true,
      };

    case 'medium':
      return {
        helpLevel: 'medium',
        showTargetZones: false,
        highlightNextMove: false,
        showMovePath: false,
        pulseValidTargets: true,
        dimInvalidOptions: true,
        showMoveCounter: true,
        showOptimalMoves: false,
      };

    case 'low':
      return {
        helpLevel: 'low',
        showTargetZones: false,
        highlightNextMove: false,
        showMovePath: false,
        pulseValidTargets: false,
        dimInvalidOptions: false,
        showMoveCounter: true,
        showOptimalMoves: false,
      };

    case 'none':
    default:
      return {
        helpLevel: 'none',
        showTargetZones: false,
        highlightNextMove: false,
        showMovePath: false,
        pulseValidTargets: false,
        dimInvalidOptions: false,
        showMoveCounter: false,
        showOptimalMoves: false,
      };
  }
}

/**
 * Détermine si un indice spécifique doit être montré
 */
export function shouldShowHint(
  helpLevel: HelpLevel,
  hintType: keyof VisualHintsConfig
): boolean {
  const config = getVisualHints(helpLevel);
  const value = config[hintType];
  return typeof value === 'boolean' ? value : false;
}

// ============================================================================
// AJUSTEMENT TEMPS RÉEL
// ============================================================================

/**
 * Ajuste le niveau d'aide en temps réel pendant une session
 *
 * @param currentHelpLevel - Niveau d'aide actuel
 * @param consecutiveErrors - Erreurs consécutives
 * @param consecutiveSuccess - Succès consécutifs
 * @returns Nouveau niveau d'aide
 */
export function adjustHelpRealtime(
  currentHelpLevel: HelpLevel,
  consecutiveErrors: number,
  consecutiveSuccess: number
): HelpLevel {
  // Augmenter l'aide si trop d'erreurs consécutives
  if (consecutiveErrors >= 3) {
    return getNextHelpLevel(currentHelpLevel, 'increase');
  }

  // Diminuer l'aide si plusieurs succès consécutifs
  if (consecutiveSuccess >= 5) {
    return getNextHelpLevel(currentHelpLevel, 'decrease');
  }

  return currentHelpLevel;
}

/**
 * Calcule un score de difficulté pour un niveau (0-100)
 * Utilisé pour afficher la progression à l'enfant
 */
export function calculateDifficultyScore(
  levelDifficulty: 'easy' | 'medium' | 'hard' | 'expert',
  helpLevel: HelpLevel
): number {
  const baseDifficulty = {
    easy: 20,
    medium: 40,
    hard: 60,
    expert: 80,
  };

  const helpModifier = {
    full: -10,
    medium: 0,
    low: 10,
    none: 20,
  };

  return Math.min(100, Math.max(0, baseDifficulty[levelDifficulty] + helpModifier[helpLevel]));
}

