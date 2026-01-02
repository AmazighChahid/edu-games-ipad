/**
 * Difficulty Controller - Controleur adaptatif de difficulte
 *
 * Selectionne le prochain puzzle en fonction du profil joueur.
 */

import {
  PlayerModel,
  LogicFamily,
  DifficultySelection,
  AttemptResult,
  EngineConfig,
  DEFAULT_ENGINE_CONFIG,
  defaultRandom,
  SeededRandom,
} from './types';
import {
  updateModelFromAttempt,
  getWeakestFamily,
  getAvailableFamilies,
  getSuggestedDifficulty,
  isFamilyOverplayed,
} from './playerModel';
import {
  PATTERNS,
  getPatternsByDifficulty,
  getAvailableFamiliesAtDifficulty,
} from '../data/patterns';
import { getPatternFamily } from './types';

// ============================================
// CONTROLLER CLASS
// ============================================

/**
 * Controleur de difficulte adaptatif
 */
export class DifficultyController {
  private config: EngineConfig;
  private random: SeededRandom;

  constructor(config?: Partial<EngineConfig>, random?: SeededRandom) {
    this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };
    this.random = random || defaultRandom;
  }

  /**
   * Selectionner le prochain puzzle a presenter
   */
  selectNextPuzzle(model: PlayerModel): DifficultySelection {
    // 1. Calculer la difficulte cible
    const targetDifficulty = this.calculateTargetDifficulty(model);

    // 2. Selectionner la famille
    const { family, reason } = this.selectFamily(model, targetDifficulty);

    // 3. Optionnellement, selectionner un pattern specifique
    const patternId = this.selectPatternId(model, targetDifficulty, family);

    return {
      targetDifficulty,
      family,
      patternId,
      reason,
    };
  }

  /**
   * Mettre a jour le modele apres une tentative
   */
  updateModel(model: PlayerModel, result: AttemptResult): PlayerModel {
    return updateModelFromAttempt(model, result);
  }

  // ============================================
  // CALCUL DE DIFFICULTE
  // ============================================

  /**
   * Calculer la difficulte cible basee sur les performances
   */
  private calculateTargetDifficulty(model: PlayerModel): number {
    // Base: difficulte suggeree par les skills
    let target = getSuggestedDifficulty(model);

    const { accuracy, hintsUsed, streak } = model.rollingStats;
    const {
      excellentAccuracy,
      poorAccuracy,
      excellentHintRate,
      poorHintRate,
      difficultyIncrement,
      difficultyDecrement,
    } = this.config;

    // Ajustements selon les performances recentes
    if (accuracy >= excellentAccuracy && hintsUsed < excellentHintRate && streak >= 3) {
      // Excellente performance -> monter
      target += difficultyIncrement;
    } else if (accuracy < poorAccuracy || hintsUsed > poorHintRate) {
      // Performance faible -> descendre
      target -= difficultyDecrement;
    }

    // Bonus/malus de streak
    if (streak >= 5) {
      target += 0.2;
    } else if (streak === 0 && model.attemptHistory.length >= 3) {
      // Pas de streak et au moins 3 tentatives -> probablement en difficulte
      target -= 0.2;
    }

    // Clamp entre 1 et 10
    return Math.max(1, Math.min(10, target));
  }

  // ============================================
  // SELECTION DE FAMILLE
  // ============================================

  /**
   * Selectionner la famille pour le prochain puzzle
   */
  private selectFamily(
    model: PlayerModel,
    targetDifficulty: number
  ): { family: LogicFamily; reason: DifficultySelection['reason'] } {
    // Obtenir les familles disponibles a ce niveau de difficulte
    const level = Math.round(targetDifficulty);
    const familiesAtLevel = getAvailableFamiliesAtDifficulty(level);

    // Filtrer les familles surjouees
    const availableFamilies = familiesAtLevel.filter(
      f => !isFamilyOverplayed(model, f, this.config.maxConsecutiveSameFamily)
    );

    // Si aucune famille disponible, prendre n'importe laquelle
    if (availableFamilies.length === 0) {
      return {
        family: familiesAtLevel[0] || 'alternation',
        reason: 'rotation',
      };
    }

    // Decision: renforcement (famille faible) ou variete (aleatoire)
    const shouldReinforce =
      this.random.next() < this.config.reinforcementProbability;

    if (shouldReinforce) {
      // Trouver la famille la plus faible parmi celles disponibles
      const weakestFamily = this.findWeakestAvailableFamily(
        model,
        availableFamilies
      );
      return {
        family: weakestFamily,
        reason: 'reinforcement',
      };
    }

    // Variete: choisir une famille aleatoire
    return {
      family: this.random.pick(availableFamilies),
      reason: 'rotation',
    };
  }

  /**
   * Trouver la famille la plus faible parmi les disponibles
   */
  private findWeakestAvailableFamily(
    model: PlayerModel,
    availableFamilies: LogicFamily[]
  ): LogicFamily {
    let weakest = availableFamilies[0];
    let minSkill = model.skillByFamily[weakest] ?? 0.5;

    for (const family of availableFamilies) {
      const skill = model.skillByFamily[family] ?? 0.5;
      if (skill < minSkill) {
        minSkill = skill;
        weakest = family;
      }
    }

    return weakest;
  }

  // ============================================
  // SELECTION DE PATTERN
  // ============================================

  /**
   * Selectionner un pattern specifique (optionnel)
   */
  private selectPatternId(
    model: PlayerModel,
    targetDifficulty: number,
    family: LogicFamily
  ): string | undefined {
    const level = Math.round(targetDifficulty);

    // Obtenir les patterns de ce niveau et cette famille
    const candidates = getPatternsByDifficulty(level).filter(
      p => getPatternFamily(p.type) === family
    );

    if (candidates.length === 0) {
      return undefined;
    }

    // Exclure les patterns joues recemment
    const recentPatterns = new Set(model.recentHistory.patternIds);
    const notRecentCandidates = candidates.filter(
      p => !recentPatterns.has(p.type)
    );

    // Si tous ont ete joues recemment, on les reprend quand meme
    const finalCandidates =
      notRecentCandidates.length > 0 ? notRecentCandidates : candidates;

    // Ponderer par proximite a la difficulte cible
    const weights = finalCandidates.map(p => {
      const distance = Math.abs(p.difficulty - targetDifficulty);
      return 1 / (1 + distance);
    });

    const selected = this.random.weightedPick(finalCandidates, weights);
    return selected.type;
  }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Creer un controleur avec la configuration par defaut
 */
export function createDifficultyController(
  config?: Partial<EngineConfig>
): DifficultyController {
  return new DifficultyController(config);
}

/**
 * Selection simple sans etat (pour usage ponctuel)
 */
export function selectNextPuzzleSimple(
  model: PlayerModel,
  config?: Partial<EngineConfig>
): DifficultySelection {
  const controller = new DifficultyController(config);
  return controller.selectNextPuzzle(model);
}

// ============================================
// ANALYSE ET DEBUG
// ============================================

/**
 * Obtenir une analyse detaillee de la selection
 */
export function analyzeSelection(
  model: PlayerModel,
  config?: Partial<EngineConfig>
): {
  selection: DifficultySelection;
  analysis: {
    rollingStats: typeof model.rollingStats;
    suggestedDifficulty: number;
    weakestFamily: LogicFamily;
    overplayedFamilies: LogicFamily[];
    skillBreakdown: Record<LogicFamily, number>;
  };
} {
  const controller = new DifficultyController(config);
  const selection = controller.selectNextPuzzle(model);

  const allFamilies: LogicFamily[] = [
    'alternation',
    'numeric_linear',
    'numeric_mult',
    'numeric_power',
    'mirror',
    'transform',
    'nested',
  ];

  const overplayedFamilies = allFamilies.filter(f =>
    isFamilyOverplayed(model, f)
  );

  return {
    selection,
    analysis: {
      rollingStats: model.rollingStats,
      suggestedDifficulty: getSuggestedDifficulty(model),
      weakestFamily: getWeakestFamily(model),
      overplayedFamilies,
      skillBreakdown: { ...model.skillByFamily },
    },
  };
}

/**
 * Simuler N selections pour analyser la distribution
 */
export function simulateSelections(
  model: PlayerModel,
  count: number,
  config?: Partial<EngineConfig>
): {
  familyDistribution: Record<LogicFamily, number>;
  difficultyDistribution: Record<number, number>;
  reasonDistribution: Record<string, number>;
} {
  const controller = new DifficultyController(config);

  const familyDistribution: Record<string, number> = {};
  const difficultyDistribution: Record<number, number> = {};
  const reasonDistribution: Record<string, number> = {};

  for (let i = 0; i < count; i++) {
    const selection = controller.selectNextPuzzle(model);

    familyDistribution[selection.family] =
      (familyDistribution[selection.family] || 0) + 1;

    const roundedDiff = Math.round(selection.targetDifficulty);
    difficultyDistribution[roundedDiff] =
      (difficultyDistribution[roundedDiff] || 0) + 1;

    reasonDistribution[selection.reason] =
      (reasonDistribution[selection.reason] || 0) + 1;
  }

  return {
    familyDistribution: familyDistribution as Record<LogicFamily, number>,
    difficultyDistribution,
    reasonDistribution,
  };
}
