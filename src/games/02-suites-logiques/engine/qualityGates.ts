/**
 * Quality Gates - Validation anti-ambiguite des puzzles
 *
 * S'assure que les puzzles generes sont clairs et non ambigus.
 */

import { SequenceElement } from '../types';
import {
  SequencePuzzle,
  QualityReport,
  QualityIssue,
  DEFAULT_ENGINE_CONFIG,
} from './types';
import { calculateElementDistance } from './errorDiagnostic';

// ============================================
// CONFIGURATION
// ============================================

const MIN_DISTRACTOR_DISTANCE = 2; // Distance minimale entre distracteur et reponse
const MAX_DISTRACTOR_DISTANCE = 15; // Distance maximale (sinon trop facile)
const MIN_DISTRACTORS = 3;

// ============================================
// SCORING PRINCIPAL
// ============================================

/**
 * Evaluer la qualite d'un puzzle
 */
export function scorePuzzle(puzzle: SequencePuzzle): QualityReport {
  let score = 100;
  const issues: QualityIssue[] = [];
  let possibleRules: string[] | undefined;

  // 1. Verifier la distance des distracteurs
  const distanceReport = checkDistractorDistances(puzzle);
  score -= distanceReport.penalty;
  issues.push(...distanceReport.issues);

  // 2. Verifier l'ambiguite du pattern (pour patterns numeriques)
  if (puzzle.pattern.transform === 'numeric') {
    const ambiguityReport = checkNumericAmbiguity(puzzle);
    score -= ambiguityReport.penalty;
    issues.push(...ambiguityReport.issues);
    possibleRules = ambiguityReport.possibleRules;
  }

  // 3. Verifier le nombre de distracteurs
  const distractorCount = puzzle.choices.length - 1;
  if (distractorCount < MIN_DISTRACTORS) {
    score -= 15;
    issues.push('insufficient_distractors');
  }

  // 4. Verifier les valeurs uniques
  const uniqueReport = checkUniqueValues(puzzle);
  score -= uniqueReport.penalty;
  issues.push(...uniqueReport.issues);

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determiner la validite
  const isValid =
    score >= DEFAULT_ENGINE_CONFIG.minQualityScore &&
    !issues.includes('ambiguous_pattern');

  return {
    score,
    issues,
    isValid,
    possibleRules,
  };
}

// ============================================
// VERIFICATION DES DISTRACTEURS
// ============================================

/**
 * Verifier la distance des distracteurs par rapport a la bonne reponse
 */
function checkDistractorDistances(puzzle: SequencePuzzle): {
  penalty: number;
  issues: QualityIssue[];
} {
  const distractors = puzzle.choices.filter(
    c => c.id !== puzzle.correctAnswer.id
  );

  if (distractors.length === 0) {
    return { penalty: 50, issues: ['insufficient_distractors'] };
  }

  const distances = distractors.map(d =>
    calculateElementDistance(d, puzzle.correctAnswer, puzzle.pattern.type)
  );

  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);

  let penalty = 0;
  const issues: QualityIssue[] = [];

  // Distracteurs trop similaires (trop difficile a distinguer)
  if (minDistance < MIN_DISTRACTOR_DISTANCE) {
    penalty += 30;
    issues.push('distractors_too_similar');
  }

  // Distracteurs trop differents (trop facile)
  if (avgDistance > MAX_DISTRACTOR_DISTANCE) {
    penalty += 20;
    issues.push('distractors_too_easy');
  }

  return { penalty, issues };
}

// ============================================
// VERIFICATION AMBIGUITE NUMERIQUE
// ============================================

/**
 * Verifier si un pattern numerique est ambigu
 * Ex: 2, 4, 8 pourrait etre +2 (depuis 2) ou x2
 */
function checkNumericAmbiguity(puzzle: SequencePuzzle): {
  penalty: number;
  issues: QualityIssue[];
  possibleRules: string[];
} {
  const values = puzzle.sequence.map(e => e.value as number);

  // Besoin d'au moins 3 elements pour detecter une ambiguite
  if (values.length < 3) {
    return { penalty: 0, issues: [], possibleRules: [] };
  }

  const possibleRules: string[] = [];

  // Tester suite arithmetique (+N)
  const diffs = values.slice(1).map((v, i) => v - values[i]);
  const uniqueDiffs = new Set(diffs);
  if (uniqueDiffs.size === 1) {
    possibleRules.push(`+${diffs[0]}`);
  }

  // Tester suite geometrique (×N)
  const ratios = values.slice(1).map((v, i) => v / values[i]);
  const uniqueRatios = new Set(ratios);
  if (uniqueRatios.size === 1 && Number.isInteger(ratios[0]) && ratios[0] > 1) {
    possibleRules.push(`×${ratios[0]}`);
  }

  // Tester carres parfaits (1, 4, 9, 16, 25...)
  const isSquares = values.every((v, i) => v === Math.pow(i + 1, 2));
  if (isSquares && values.length >= 3) {
    possibleRules.push('squares');
  }

  // Tester Fibonacci
  if (isFibonacciSequence(values)) {
    possibleRules.push('fibonacci');
  }

  // Tester nombres premiers
  if (isPrimeSequence(values)) {
    possibleRules.push('primes');
  }

  // Si plusieurs regles sont possibles, c'est ambigu
  const penalty = possibleRules.length > 1 ? 40 : 0;
  const issues: QualityIssue[] =
    possibleRules.length > 1 ? ['ambiguous_pattern'] : [];

  return { penalty, issues, possibleRules };
}

/**
 * Verifier si la sequence suit Fibonacci
 */
function isFibonacciSequence(values: number[]): boolean {
  if (values.length < 3) return false;

  // Verifier si chaque element est la somme des deux precedents
  for (let i = 2; i < values.length; i++) {
    if (values[i] !== values[i - 1] + values[i - 2]) {
      return false;
    }
  }

  return true;
}

/**
 * Verifier si la sequence contient les premiers nombres premiers
 */
function isPrimeSequence(values: number[]): boolean {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

  // Verifier si les valeurs correspondent aux N premiers nombres premiers
  for (let i = 0; i < values.length; i++) {
    if (values[i] !== primes[i]) {
      return false;
    }
  }

  return true;
}

// ============================================
// VERIFICATION VALEURS UNIQUES
// ============================================

/**
 * Verifier que tous les choix ont des valeurs uniques
 */
function checkUniqueValues(puzzle: SequencePuzzle): {
  penalty: number;
  issues: QualityIssue[];
} {
  const values = puzzle.choices.map(c => c.value);
  const uniqueValues = new Set(values);

  if (uniqueValues.size !== values.length) {
    return { penalty: 25, issues: ['repeated_values'] };
  }

  return { penalty: 0, issues: [] };
}

// ============================================
// SAFE PATTERNS
// ============================================

/**
 * Liste des patterns "safe" pour fallback
 * Ces patterns sont garantis non-ambigus
 */
export const SAFE_PATTERNS = [
  // Alternances simples - jamais ambigues
  { type: 'ABAB', minDifficulty: 1, maxDifficulty: 3 },
  { type: 'ABC', minDifficulty: 2, maxDifficulty: 4 },

  // Suites numeriques non-ambigues
  { type: 'numeric_add', step: 1, minDifficulty: 4, maxDifficulty: 5 }, // +1 jamais confondu avec x
  { type: 'numeric_add', step: 10, minDifficulty: 8, maxDifficulty: 10 }, // +10 jamais confondu

  // Miroirs - jamais ambigus
  { type: 'ABCBA', minDifficulty: 6, maxDifficulty: 8 },
];

/**
 * Obtenir un pattern safe pour une difficulte donnee
 */
export function getSafePattern(difficulty: number): typeof SAFE_PATTERNS[0] | null {
  const candidates = SAFE_PATTERNS.filter(
    p => difficulty >= p.minDifficulty && difficulty <= p.maxDifficulty
  );

  if (candidates.length === 0) {
    return SAFE_PATTERNS[0]; // Fallback sur ABAB
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ============================================
// VALIDATION COMPLETE
// ============================================

/**
 * Valider un puzzle et determiner s'il doit etre regenere
 */
export function shouldRegeneratePuzzle(
  puzzle: SequencePuzzle,
  minScore: number = DEFAULT_ENGINE_CONFIG.minQualityScore
): boolean {
  const report = scorePuzzle(puzzle);
  return !report.isValid || report.score < minScore;
}

/**
 * Obtenir un rapport detaille pour debug
 */
export function getDetailedQualityReport(puzzle: SequencePuzzle): {
  report: QualityReport;
  details: {
    distractorDistances: number[];
    avgDistance: number;
    choiceValues: (string | number)[];
    sequenceValues: (string | number)[];
  };
} {
  const report = scorePuzzle(puzzle);

  const distractors = puzzle.choices.filter(
    c => c.id !== puzzle.correctAnswer.id
  );

  const distractorDistances = distractors.map(d =>
    calculateElementDistance(d, puzzle.correctAnswer, puzzle.pattern.type)
  );

  const avgDistance =
    distractorDistances.length > 0
      ? distractorDistances.reduce((a, b) => a + b, 0) / distractorDistances.length
      : 0;

  return {
    report,
    details: {
      distractorDistances,
      avgDistance,
      choiceValues: puzzle.choices.map(c => c.value),
      sequenceValues: puzzle.sequence.map(e => e.value),
    },
  };
}
