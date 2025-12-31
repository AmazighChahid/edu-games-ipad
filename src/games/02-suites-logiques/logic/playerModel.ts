/**
 * Player Model - Modele du joueur avec tracking des competences
 *
 * Gere la persistance et la mise a jour du profil joueur.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PlayerModel,
  LogicFamily,
  ErrorType,
  AttemptResult,
  RollingStats,
  DEFAULT_ENGINE_CONFIG,
} from './types';

// ============================================
// CONSTANTS
// ============================================

const STORAGE_KEY_PREFIX = '@suites_player_';
const ALL_FAMILIES: LogicFamily[] = [
  'alternation',
  'numeric_linear',
  'numeric_mult',
  'numeric_power',
  'mirror',
  'transform',
  'nested',
];

const ROLLING_WINDOW_SIZE = DEFAULT_ENGINE_CONFIG.rollingWindowSize;

// ============================================
// CREATION
// ============================================

/**
 * Creer un nouveau modele joueur
 */
export function createPlayerModel(id: string = 'default', age?: number): PlayerModel {
  const now = new Date().toISOString();

  // Initialiser skills par famille a 0.5 (niveau moyen)
  const skillByFamily: Record<LogicFamily, number> = {} as Record<LogicFamily, number>;
  for (const family of ALL_FAMILIES) {
    skillByFamily[family] = 0.5;
  }

  return {
    id,
    age,
    skillByFamily,
    rollingStats: {
      accuracy: 0.5,
      avgTimeMs: 10000,
      hintsUsed: 0,
      streak: 0,
      maxStreak: 0,
    },
    errorProfile: {},
    recentHistory: {
      patternIds: [],
      families: [],
    },
    attemptHistory: [],
    createdAt: now,
    lastPlayedAt: now,
    totalPuzzles: 0,
  };
}

// ============================================
// PERSISTANCE
// ============================================

/**
 * Sauvegarder le modele joueur dans AsyncStorage
 */
export async function savePlayerModel(model: PlayerModel): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${model.id}`;
    const json = JSON.stringify(model);
    await AsyncStorage.setItem(key, json);
  } catch (error) {
    console.error('[PlayerModel] Failed to save:', error);
  }
}

/**
 * Charger le modele joueur depuis AsyncStorage
 */
export async function loadPlayerModel(id: string = 'default'): Promise<PlayerModel> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${id}`;
    const json = await AsyncStorage.getItem(key);

    if (json) {
      const parsed = JSON.parse(json) as PlayerModel;
      // Valider et migrer si necessaire
      return migratePlayerModel(parsed);
    }
  } catch (error) {
    console.error('[PlayerModel] Failed to load:', error);
  }

  // Retourner un nouveau modele par defaut
  return createPlayerModel(id);
}

/**
 * Supprimer le modele joueur
 */
export async function deletePlayerModel(id: string = 'default'): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${id}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('[PlayerModel] Failed to delete:', error);
  }
}

/**
 * Migrer un ancien modele vers le nouveau format
 */
function migratePlayerModel(model: PlayerModel): PlayerModel {
  // S'assurer que toutes les familles existent
  for (const family of ALL_FAMILIES) {
    if (model.skillByFamily[family] === undefined) {
      model.skillByFamily[family] = 0.5;
    }
  }

  // S'assurer que attemptHistory existe
  if (!model.attemptHistory) {
    model.attemptHistory = [];
  }

  // S'assurer que recentHistory existe
  if (!model.recentHistory) {
    model.recentHistory = {
      patternIds: [],
      families: [],
    };
  }

  return model;
}

// ============================================
// MISE A JOUR
// ============================================

/**
 * Mettre a jour le modele apres une tentative
 */
export function updateModelFromAttempt(
  model: PlayerModel,
  result: AttemptResult
): PlayerModel {
  const updated = { ...model };

  // 1. Ajouter a l'historique des tentatives
  updated.attemptHistory = [...model.attemptHistory, result].slice(-ROLLING_WINDOW_SIZE);

  // 2. Mettre a jour l'historique recent
  updated.recentHistory = {
    patternIds: [...model.recentHistory.patternIds, result.puzzleId].slice(-10),
    families: [...model.recentHistory.families, result.family].slice(-5),
  };

  // 3. Recalculer les stats glissantes
  updated.rollingStats = calculateRollingStats(updated.attemptHistory);

  // 4. Mettre a jour le skill de la famille
  updated.skillByFamily = updateFamilySkill(
    model.skillByFamily,
    result.family,
    result.isCorrect,
    result.hintsUsed
  );

  // 5. Mettre a jour le profil d'erreurs
  if (!result.isCorrect && result.errorType) {
    updated.errorProfile = {
      ...model.errorProfile,
      [result.errorType]: (model.errorProfile[result.errorType] || 0) + 1,
    };
  }

  // 6. Mettre a jour les metadonnees
  updated.lastPlayedAt = new Date().toISOString();
  updated.totalPuzzles = model.totalPuzzles + 1;

  return updated;
}

/**
 * Calculer les stats glissantes a partir de l'historique
 */
function calculateRollingStats(history: AttemptResult[]): RollingStats {
  if (history.length === 0) {
    return {
      accuracy: 0.5,
      avgTimeMs: 10000,
      hintsUsed: 0,
      streak: 0,
      maxStreak: 0,
    };
  }

  // Accuracy
  const correctCount = history.filter(r => r.isCorrect).length;
  const accuracy = correctCount / history.length;

  // Temps moyen
  const totalTime = history.reduce((sum, r) => sum + r.timeMs, 0);
  const avgTimeMs = totalTime / history.length;

  // Hints moyen
  const totalHints = history.reduce((sum, r) => sum + r.hintsUsed, 0);
  const hintsUsed = totalHints / history.length;

  // Streak actuel (compter depuis la fin)
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].isCorrect) {
      streak++;
    } else {
      break;
    }
  }

  // Max streak dans l'historique
  let maxStreak = 0;
  let currentStreak = 0;
  for (const result of history) {
    if (result.isCorrect) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return { accuracy, avgTimeMs, hintsUsed, streak, maxStreak };
}

/**
 * Mettre a jour le skill d'une famille
 */
function updateFamilySkill(
  skills: Record<LogicFamily, number>,
  family: LogicFamily,
  isCorrect: boolean,
  hintsUsed: number
): Record<LogicFamily, number> {
  const currentSkill = skills[family];

  // Facteur de mise a jour (plus petit si beaucoup de hints)
  const hintPenalty = Math.max(0, 1 - hintsUsed * 0.2);

  // Delta de skill
  let delta: number;
  if (isCorrect) {
    // Monter en skill (plus lentement si pres de 1.0)
    delta = 0.05 * hintPenalty * (1 - currentSkill);
  } else {
    // Descendre en skill (plus lentement si pres de 0.0)
    delta = -0.08 * currentSkill;
  }

  // Appliquer et clamp
  const newSkill = Math.max(0, Math.min(1, currentSkill + delta));

  return {
    ...skills,
    [family]: newSkill,
  };
}

// ============================================
// ACCESSEURS
// ============================================

/**
 * Obtenir le niveau de skill d'une famille
 */
export function getSkillLevel(model: PlayerModel, family: LogicFamily): number {
  return model.skillByFamily[family] || 0.5;
}

/**
 * Obtenir la famille la plus faible
 */
export function getWeakestFamily(model: PlayerModel): LogicFamily {
  let weakest: LogicFamily = 'alternation';
  let minSkill = 1;

  for (const family of ALL_FAMILIES) {
    const skill = model.skillByFamily[family];
    if (skill < minSkill) {
      minSkill = skill;
      weakest = family;
    }
  }

  return weakest;
}

/**
 * Obtenir la famille la plus forte
 */
export function getStrongestFamily(model: PlayerModel): LogicFamily {
  let strongest: LogicFamily = 'alternation';
  let maxSkill = 0;

  for (const family of ALL_FAMILIES) {
    const skill = model.skillByFamily[family];
    if (skill > maxSkill) {
      maxSkill = skill;
      strongest = family;
    }
  }

  return strongest;
}

/**
 * Obtenir le type d'erreur le plus frequent
 */
export function getMostCommonError(model: PlayerModel): ErrorType | null {
  const entries = Object.entries(model.errorProfile) as [ErrorType, number][];
  if (entries.length === 0) return null;

  let maxCount = 0;
  let mostCommon: ErrorType | null = null;

  for (const [errorType, count] of entries) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = errorType;
    }
  }

  return mostCommon;
}

/**
 * Calculer le niveau de difficulte suggere base sur les skills
 */
export function getSuggestedDifficulty(model: PlayerModel): number {
  // Moyenne ponderee des skills (plus de poids aux familles jouees recemment)
  const recentFamilies = new Set(model.recentHistory.families);

  let totalWeight = 0;
  let weightedSum = 0;

  for (const family of ALL_FAMILIES) {
    const skill = model.skillByFamily[family];
    const weight = recentFamilies.has(family) ? 2 : 1;
    weightedSum += skill * weight;
    totalWeight += weight;
  }

  const avgSkill = totalWeight > 0 ? weightedSum / totalWeight : 0.5;

  // Convertir skill (0-1) en difficulte (1-10)
  // skill 0.5 -> difficulte 5
  // skill 0.8 -> difficulte 8
  return Math.max(1, Math.min(10, Math.round(avgSkill * 10)));
}

/**
 * Verifier si une famille a ete jouee trop recemment
 */
export function isFamilyOverplayed(
  model: PlayerModel,
  family: LogicFamily,
  maxConsecutive: number = DEFAULT_ENGINE_CONFIG.maxConsecutiveSameFamily
): boolean {
  const recent = model.recentHistory.families;
  if (recent.length < maxConsecutive) return false;

  // Verifier les N dernieres families
  const lastN = recent.slice(-maxConsecutive);
  return lastN.every(f => f === family);
}

/**
 * Obtenir les familles disponibles (non surjouees)
 */
export function getAvailableFamilies(model: PlayerModel): LogicFamily[] {
  return ALL_FAMILIES.filter(
    family => !isFamilyOverplayed(model, family)
  );
}
