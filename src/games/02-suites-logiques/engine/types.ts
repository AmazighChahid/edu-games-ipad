/**
 * Engine Types - Moteur Pedagogique Adaptatif
 *
 * Types centraux pour le systeme de generation de suites logiques.
 */

import { SequenceElement, PatternDefinition, ThemeType } from '../types';

// ============================================
// FAMILLES LOGIQUES
// ============================================

/**
 * Familles de patterns pour le tracking des competences
 */
export type LogicFamily =
  | 'alternation' // ABAB, AABB, ABC, AAB, ABBC, AABBCC...
  | 'numeric_linear' // +1, +2, +3, +5, +10...
  | 'numeric_mult' // x2, x3...
  | 'numeric_power' // carres, Fibonacci, premiers
  | 'mirror' // ABA, ABCBA, ABCDCBA
  | 'transform' // size, rotation
  | 'nested'; // patterns imbriques

/**
 * Mapping PatternType -> LogicFamily
 */
export const PATTERN_TO_FAMILY: Record<string, LogicFamily> = {
  // Alternation
  ABAB: 'alternation',
  AABB: 'alternation',
  AAB: 'alternation',
  ABC: 'alternation',
  ABBC: 'alternation',
  AABBCC: 'alternation',
  AABBC: 'alternation',
  custom: 'alternation',

  // Numeric linear
  numeric_add: 'numeric_linear',

  // Numeric multiplication
  numeric_mult: 'numeric_mult',

  // Numeric power (carres, fibo, premiers)
  numeric_square: 'numeric_power',
  fibonacci: 'numeric_power',
  prime: 'numeric_power',

  // Mirror patterns
  mirror: 'mirror',
  ABCBA: 'mirror',
  ABCDCBA: 'mirror',

  // Transform patterns
  increasing: 'transform',
  rotation: 'transform',
  rotation_45: 'transform',
  rotation_complex: 'transform',
  size_color: 'transform',

  // Nested patterns
  nested: 'nested',
  complex_pattern: 'nested',
};

/**
 * Obtenir la famille d'un pattern
 */
export function getPatternFamily(patternType: string): LogicFamily {
  return PATTERN_TO_FAMILY[patternType] || 'alternation';
}

// ============================================
// TYPES D'ERREURS
// ============================================

/**
 * Types d'erreurs pour le diagnostic pedagogique
 */
export type ErrorType =
  // Erreurs numeriques
  | 'off_by_one' // +/- 1 de la bonne reponse
  | 'wrong_step' // Mauvais pas (+2 au lieu de +3)
  | 'used_previous' // A choisi l'element precedent de la suite
  | 'used_next_next' // A saute un element
  | 'confusion_add_mult' // Confusion entre + et x
  | 'wrong_operation' // Mauvaise operation (division au lieu de mult)

  // Erreurs visuelles
  | 'wrong_color' // Bonne forme, mauvaise couleur
  | 'wrong_shape' // Bonne couleur, mauvaise forme
  | 'wrong_size' // Bon element, mauvaise taille
  | 'wrong_rotation' // Bon element, mauvaise rotation
  | 'mirror_confusion' // Confusion dans pattern miroir
  | 'cycle_shift' // Decalage dans le cycle

  // Erreurs generiques
  | 'random_guess' // Aucun pattern detecte dans le choix
  | 'unknown'; // Non categorisable

// ============================================
// PUZZLE & RESULTAT
// ============================================

/**
 * Puzzle de sequence genere par le moteur
 */
export interface SequencePuzzle {
  id: string;
  sequence: SequenceElement[];
  missingIndex: number;
  correctAnswer: SequenceElement;
  choices: SequenceElement[]; // correct + distractors (4 total)
  pattern: PatternDefinition;
  family: LogicFamily;
  difficulty: number;
  qualityScore: number;
  theme: ThemeType;
  seed?: string; // Pour reproductibilite
  baseElements?: SequenceElement[]; // Elements utilises pour construire la sequence
}

/**
 * Resultat d'une tentative de reponse
 */
export interface AttemptResult {
  puzzleId: string;
  isCorrect: boolean;
  chosenAnswer: SequenceElement;
  correctAnswer: SequenceElement;
  errorType?: ErrorType;
  timeMs: number;
  hintsUsed: number;
  hintLevels: number[]; // Quels niveaux de hints ont ete utilises
  family: LogicFamily;
  difficulty: number;
}

// ============================================
// HINTS
// ============================================

/**
 * Type de hint pedagogique
 */
export type HintType = 'question' | 'highlight' | 'rule';

/**
 * Cle a mettre en surbrillance
 */
export type HighlightKey = 'color' | 'shape' | 'size' | 'rotation' | 'number';

/**
 * Payload d'un hint a afficher
 */
export interface HintPayload {
  level: 1 | 2 | 3;
  type: HintType;
  message: string;
  highlightKey?: HighlightKey;
  highlightIndices?: number[];
  ruleDemo?: {
    before: SequenceElement;
    after: SequenceElement;
  };
}

/**
 * Template de hint pour une famille
 */
export interface HintTemplate {
  level: 1 | 2 | 3;
  type?: HintType;
  message: string;
  highlightKey?: HighlightKey;
  ruleDemo?: boolean;
}

// ============================================
// PLAYER MODEL
// ============================================

/**
 * Statistiques glissantes du joueur
 */
export interface RollingStats {
  accuracy: number; // 0.0 - 1.0
  avgTimeMs: number; // Temps moyen en ms
  hintsUsed: number; // Moyenne hints par puzzle
  streak: number; // Serie actuelle
  maxStreak: number; // Meilleure serie
}

/**
 * Modele du joueur avec tracking des competences
 */
export interface PlayerModel {
  id: string;
  age?: number;

  // Competences par famille (0.0 - 1.0)
  skillByFamily: Record<LogicFamily, number>;

  // Stats glissantes (derniers N essais)
  rollingStats: RollingStats;

  // Profil d'erreurs (pour hints cibles)
  errorProfile: Partial<Record<ErrorType, number>>;

  // Historique recent (eviter repetitions)
  recentHistory: {
    patternIds: string[]; // 10 derniers
    families: LogicFamily[]; // 5 dernieres
  };

  // Historique des tentatives pour calcul rolling
  attemptHistory: AttemptResult[];

  // Metadonnees
  createdAt: string; // ISO date
  lastPlayedAt: string; // ISO date
  totalPuzzles: number;
}

// ============================================
// DIFFICULTY CONTROLLER
// ============================================

/**
 * Selection de difficulte par le controleur
 */
export interface DifficultySelection {
  targetDifficulty: number; // Flottant ex: 4.3
  family: LogicFamily;
  patternId?: string; // Optionnel si pattern specifique
  reason: 'skill_gap' | 'rotation' | 'reinforcement' | 'initial';
}

// ============================================
// QUALITY GATES
// ============================================

/**
 * Types de problemes de qualite
 */
export type QualityIssue =
  | 'distractors_too_easy' // Distance > seuil
  | 'distractors_too_similar' // Distance < seuil
  | 'ambiguous_pattern' // Plusieurs regles plausibles
  | 'insufficient_distractors' // < 3 distractors
  | 'repeated_values'; // Valeurs dupliquees dans les choix

/**
 * Rapport de qualite d'un puzzle
 */
export interface QualityReport {
  score: number; // 0-100
  issues: QualityIssue[];
  isValid: boolean;
  possibleRules?: string[]; // Pour debug ambiguite
}

// ============================================
// CONFIGURATION
// ============================================

/**
 * Configuration du moteur adaptatif
 */
export interface EngineConfig {
  // Rolling stats window
  rollingWindowSize: number; // Nombre de tentatives pour stats glissantes

  // Difficulty adjustment
  difficultyIncrement: number; // Increment quand performance excellente
  difficultyDecrement: number; // Decrement quand difficulte

  // Family rotation
  maxConsecutiveSameFamily: number; // Max puzzles consecutifs meme famille
  reinforcementProbability: number; // Probabilite de choisir famille faible

  // Quality gates
  minQualityScore: number; // Score minimum pour accepter un puzzle
  maxGenerationRetries: number; // Tentatives avant fallback

  // Hints
  maxHintLevel: 3;

  // Thresholds
  excellentAccuracy: number; // Seuil pour monter en difficulte
  poorAccuracy: number; // Seuil pour descendre
  excellentHintRate: number; // Peu de hints
  poorHintRate: number; // Trop de hints
}

/**
 * Configuration par defaut
 */
export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  rollingWindowSize: 10,
  difficultyIncrement: 0.3,
  difficultyDecrement: 0.5,
  maxConsecutiveSameFamily: 2,
  reinforcementProbability: 0.7,
  minQualityScore: 60,
  maxGenerationRetries: 5,
  maxHintLevel: 3,
  excellentAccuracy: 0.8,
  poorAccuracy: 0.5,
  excellentHintRate: 0.5,
  poorHintRate: 1.5,
};

// ============================================
// SEEDED RANDOM
// ============================================

/**
 * Interface pour un generateur aleatoire seedable
 */
export interface SeededRandom {
  next(): number; // 0-1
  nextInt(min: number, max: number): number;
  shuffle<T>(array: T[]): T[];
  pick<T>(array: T[]): T;
  weightedPick<T>(items: T[], weights: number[]): T;
}

/**
 * Creer un generateur pseudo-aleatoire avec seed
 * Utilise l'algorithme mulberry32
 */
export function createSeededRandom(seed: string): SeededRandom {
  // Hash la seed string en nombre
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  // mulberry32 PRNG
  let state = hash >>> 0;
  const next = (): number => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    nextInt: (min: number, max: number) =>
      Math.floor(next() * (max - min + 1)) + min,
    shuffle: <T>(array: T[]): T[] => {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
    pick: <T>(array: T[]): T => array[Math.floor(next() * array.length)],
    weightedPick: <T>(items: T[], weights: number[]): T => {
      const total = weights.reduce((a, b) => a + b, 0);
      let random = next() * total;
      for (let i = 0; i < items.length; i++) {
        random -= weights[i];
        if (random <= 0) return items[i];
      }
      return items[items.length - 1];
    },
  };
}

/**
 * Generateur aleatoire par defaut (non-seeded)
 */
export const defaultRandom: SeededRandom = {
  next: () => Math.random(),
  nextInt: (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min,
  shuffle: <T>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },
  pick: <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)],
  weightedPick: <T>(items: T[], weights: number[]): T => {
    const total = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) return items[i];
    }
    return items[items.length - 1];
  },
};
