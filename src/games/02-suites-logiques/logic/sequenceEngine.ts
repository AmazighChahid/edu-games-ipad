/**
 * Sequence Engine - API unifiee de generation de puzzles
 *
 * Point d'entree principal pour la generation et validation des puzzles.
 */

import { SequenceElement, PatternDefinition, ThemeType } from '../types';
import {
  SequencePuzzle,
  AttemptResult,
  LogicFamily,
  SeededRandom,
  defaultRandom,
  createSeededRandom,
  getPatternFamily,
  DEFAULT_ENGINE_CONFIG,
} from './types';
import { THEMES } from '../data/themes';
import {
  PATTERNS,
  getPatternsByDifficulty,
  getSequenceLength,
} from '../data/patterns';
import {
  selectBaseElements,
  applySizeTransform,
  applyRotationTransform,
  applyNumericTransform,
  generateDistractors,
  generateId,
} from '../utils/patternUtils';
import { diagnoseError } from './errorDiagnostic';
import { scorePuzzle, shouldRegeneratePuzzle, getSafePattern } from './qualityGates';

// ============================================
// TYPES
// ============================================

export interface GeneratePuzzleParams {
  targetDifficulty: number;
  family?: LogicFamily;
  theme: ThemeType;
  seed?: string;
  maxRetries?: number;
  excludePatternIds?: string[];
}

// ============================================
// GENERATION PRINCIPALE
// ============================================

/**
 * Generer un puzzle complet avec validation qualite
 */
export function generatePuzzle(params: GeneratePuzzleParams): SequencePuzzle {
  const {
    targetDifficulty,
    family,
    theme,
    seed,
    maxRetries = DEFAULT_ENGINE_CONFIG.maxGenerationRetries,
    excludePatternIds = [],
  } = params;

  const random = seed ? createSeededRandom(seed) : defaultRandom;

  // Essayer de generer un puzzle valide
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const puzzle = generatePuzzleAttempt({
      targetDifficulty,
      family,
      theme,
      random,
      excludePatternIds,
      attemptSeed: seed ? `${seed}_${attempt}` : undefined,
    });

    // Verifier la qualite
    if (!shouldRegeneratePuzzle(puzzle)) {
      return puzzle;
    }
  }

  // Fallback sur un pattern safe
  return generateSafePuzzle(targetDifficulty, theme, random);
}

/**
 * Une tentative de generation de puzzle
 */
function generatePuzzleAttempt(params: {
  targetDifficulty: number;
  family?: LogicFamily;
  theme: ThemeType;
  random: SeededRandom;
  excludePatternIds: string[];
  attemptSeed?: string;
}): SequencePuzzle {
  const { targetDifficulty, family, theme, random, excludePatternIds } = params;

  // 1. Selectionner le pattern
  const pattern = selectPattern(targetDifficulty, family, random, excludePatternIds);

  // 2. Obtenir les elements du theme
  const themeElements = THEMES[theme].elements;

  // 3. Generer la sequence
  const sequenceLength = getSequenceLength(pattern.difficulty);
  const { elements, baseElements } = generateSequenceElements(
    pattern,
    themeElements,
    sequenceLength,
    random
  );

  // 4. L'element manquant est le dernier
  const correctAnswer = elements.pop()!;
  const missingIndex = elements.length;

  // 5. Generer les distracteurs
  const distractors = generateDistractors(
    themeElements,
    correctAnswer,
    3,
    pattern,
    baseElements
  );

  // 6. Creer les choix (correct + distractors, melanges)
  const choices = random.shuffle([correctAnswer, ...distractors]);

  // 7. Calculer le score qualite
  const puzzleId = generateId();
  const puzzle: SequencePuzzle = {
    id: puzzleId,
    sequence: elements,
    missingIndex,
    correctAnswer,
    choices,
    pattern,
    family: getPatternFamily(pattern.type),
    difficulty: pattern.difficulty,
    qualityScore: 0, // Sera calcule ci-dessous
    theme,
    seed: params.attemptSeed,
    baseElements,
  };

  // Calculer le score
  const qualityReport = scorePuzzle(puzzle);
  puzzle.qualityScore = qualityReport.score;

  return puzzle;
}

/**
 * Generer un puzzle avec un pattern safe (fallback)
 */
function generateSafePuzzle(
  targetDifficulty: number,
  theme: ThemeType,
  random: SeededRandom
): SequencePuzzle {
  const safePatternDef = getSafePattern(targetDifficulty);

  // Trouver un pattern correspondant dans le catalogue
  const candidates = PATTERNS.filter(
    p =>
      p.type === safePatternDef?.type &&
      (safePatternDef.step === undefined || p.step === safePatternDef.step)
  );

  const pattern = candidates.length > 0 ? random.pick(candidates) : PATTERNS[0];

  const themeElements = THEMES[theme].elements;
  const sequenceLength = getSequenceLength(Math.round(targetDifficulty));

  const { elements, baseElements } = generateSequenceElements(
    pattern,
    themeElements,
    sequenceLength,
    random
  );

  const correctAnswer = elements.pop()!;
  const missingIndex = elements.length;

  const distractors = generateDistractors(
    themeElements,
    correctAnswer,
    3,
    pattern,
    baseElements
  );

  const choices = random.shuffle([correctAnswer, ...distractors]);

  const puzzle: SequencePuzzle = {
    id: generateId(),
    sequence: elements,
    missingIndex,
    correctAnswer,
    choices,
    pattern,
    family: getPatternFamily(pattern.type),
    difficulty: pattern.difficulty,
    qualityScore: 100, // Safe pattern = qualite maximale
    theme,
    baseElements,
  };

  return puzzle;
}

// ============================================
// SELECTION DE PATTERN
// ============================================

/**
 * Selectionner un pattern selon les criteres
 */
function selectPattern(
  targetDifficulty: number,
  family: LogicFamily | undefined,
  random: SeededRandom,
  excludePatternIds: string[]
): PatternDefinition {
  // Determiner les niveaux de difficulte a considerer
  const floorDiff = Math.floor(targetDifficulty);
  const ceilDiff = Math.ceil(targetDifficulty);
  const difficultyLevels = floorDiff === ceilDiff ? [floorDiff] : [floorDiff, ceilDiff];

  // Recuperer tous les patterns de ces niveaux
  let candidates: PatternDefinition[] = [];
  for (const level of difficultyLevels) {
    candidates.push(...getPatternsByDifficulty(level));
  }

  // Filtrer par famille si specifiee
  if (family) {
    const familyFiltered = candidates.filter(
      p => getPatternFamily(p.type) === family
    );
    if (familyFiltered.length > 0) {
      candidates = familyFiltered;
    }
    // Sinon on garde tous les candidats
  }

  // Exclure les patterns deja utilises recemment
  if (excludePatternIds.length > 0) {
    const filtered = candidates.filter(
      p => !excludePatternIds.includes(p.type)
    );
    if (filtered.length > 0) {
      candidates = filtered;
    }
  }

  // Si aucun candidat, fallback sur niveau 1
  if (candidates.length === 0) {
    candidates = getPatternsByDifficulty(1);
  }

  // Ponderer par proximite a la difficulte cible
  const weights = candidates.map(p => {
    const distance = Math.abs(p.difficulty - targetDifficulty);
    return 1 / (1 + distance);
  });

  return random.weightedPick(candidates, weights);
}

// ============================================
// GENERATION DE SEQUENCE
// ============================================

/**
 * Generer les elements de la sequence
 */
function generateSequenceElements(
  pattern: PatternDefinition,
  themeElements: SequenceElement[],
  length: number,
  random: SeededRandom
): { elements: SequenceElement[]; baseElements: SequenceElement[] } {
  // Selectionner les elements de base pour ce pattern
  const baseElements = selectBaseElementsWithRandom(
    themeElements,
    pattern.cycle.length,
    random
  );

  const elements: SequenceElement[] = [];

  for (let i = 0; i < length; i++) {
    const cycleIndex = pattern.cycle[i % pattern.cycle.length];
    let element = { ...baseElements[cycleIndex] };

    // Appliquer les transformations
    if (pattern.transform === 'size') {
      element = applySizeTransform(element, i, pattern.step || 1);
    } else if (pattern.transform === 'rotation') {
      element = applyRotationTransform(element, i, pattern.step || 90);
    } else if (pattern.transform === 'numeric') {
      element = applyNumericTransform(element, i, pattern.step || 1, pattern.type);
    }

    elements.push({
      ...element,
      id: generateId(),
    });
  }

  return { elements, baseElements };
}

/**
 * Selectionner des elements de base avec un generateur aleatoire specifique
 */
function selectBaseElementsWithRandom(
  elements: SequenceElement[],
  count: number,
  random: SeededRandom
): SequenceElement[] {
  const shuffled = random.shuffle(elements);
  return shuffled.slice(0, count);
}

// ============================================
// VALIDATION DE REPONSE
// ============================================

/**
 * Valider une reponse et generer un resultat
 */
export function validateAnswer(
  puzzle: SequencePuzzle,
  choice: SequenceElement,
  timeMs: number,
  hintsUsed: number,
  hintLevels: number[] = []
): AttemptResult {
  const isCorrect =
    choice.id === puzzle.correctAnswer.id ||
    choice.value === puzzle.correctAnswer.value;

  let errorType = undefined;
  if (!isCorrect) {
    errorType = diagnoseError(puzzle, choice, puzzle.correctAnswer);
  }

  return {
    puzzleId: puzzle.id,
    isCorrect,
    chosenAnswer: choice,
    correctAnswer: puzzle.correctAnswer,
    errorType,
    timeMs,
    hintsUsed,
    hintLevels,
    family: puzzle.family,
    difficulty: puzzle.difficulty,
  };
}

// ============================================
// COMPATIBILITE AVEC L'ANCIEN SYSTEME
// ============================================

import { Sequence } from '../types';

/**
 * Convertir un SequencePuzzle vers l'ancienne structure Sequence
 * Pour compatibilite avec les composants UI existants
 */
export function puzzleToSequence(puzzle: SequencePuzzle): Sequence {
  return {
    id: puzzle.id,
    elements: puzzle.sequence,
    missingIndex: puzzle.missingIndex,
    correctAnswer: puzzle.correctAnswer,
    distractors: puzzle.choices.filter(c => c.id !== puzzle.correctAnswer.id),
    patternDef: puzzle.pattern,
    theme: puzzle.theme,
    difficulty: puzzle.difficulty,
  };
}

/**
 * Convertir une Sequence vers SequencePuzzle
 */
export function sequenceToPuzzle(
  sequence: Sequence,
  qualityScore: number = 100
): SequencePuzzle {
  return {
    id: sequence.id,
    sequence: sequence.elements,
    missingIndex: sequence.missingIndex,
    correctAnswer: sequence.correctAnswer,
    choices: [sequence.correctAnswer, ...sequence.distractors],
    pattern: sequence.patternDef,
    family: getPatternFamily(sequence.patternDef.type),
    difficulty: sequence.difficulty,
    qualityScore,
    theme: sequence.theme,
  };
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Generer un puzzle pour un niveau specifique (API simplifiee)
 */
export function generatePuzzleForLevel(
  level: number,
  theme: ThemeType = 'shapes'
): SequencePuzzle {
  return generatePuzzle({
    targetDifficulty: level,
    theme,
  });
}

/**
 * Generer plusieurs puzzles d'un coup
 */
export function generatePuzzleBatch(
  count: number,
  params: Omit<GeneratePuzzleParams, 'seed'>
): SequencePuzzle[] {
  const puzzles: SequencePuzzle[] = [];
  const usedPatternIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const puzzle = generatePuzzle({
      ...params,
      excludePatternIds: usedPatternIds,
    });
    puzzles.push(puzzle);
    usedPatternIds.push(puzzle.pattern.type);

    // Garder seulement les 5 derniers pour eviter de bloquer
    if (usedPatternIds.length > 5) {
      usedPatternIds.shift();
    }
  }

  return puzzles;
}

/**
 * Obtenir des informations sur la sequence pour debug
 */
export function getPuzzleDebugInfo(puzzle: SequencePuzzle): {
  pattern: string;
  family: string;
  difficulty: number;
  qualityScore: number;
  sequenceValues: (string | number)[];
  correctValue: string | number;
  choiceValues: (string | number)[];
} {
  return {
    pattern: puzzle.pattern.type,
    family: puzzle.family,
    difficulty: puzzle.difficulty,
    qualityScore: puzzle.qualityScore,
    sequenceValues: puzzle.sequence.map(e => e.value),
    correctValue: puzzle.correctAnswer.value,
    choiceValues: puzzle.choices.map(c => c.value),
  };
}
