import { PatternDefinition } from '../types';
import { LogicFamily, getPatternFamily } from '../logic/types';

// ============================================
// DÉFINITIONS DES PATTERNS PAR NIVEAU
// ============================================
//
// PROGRESSION DE DIFFICULTÉ:
// - Niveaux 1-3: Patterns visuels simples (formes, couleurs)
// - Niveaux 4-6: Introduction des nombres + patterns visuels complexes
// - Niveaux 7-10: Patterns avancés (miroirs, rotations, suites mathématiques)
//
// IMPORTANT: Les patterns visuels sont présents à TOUS les niveaux
// pour varier les exercices et ne pas avoir que des nombres aux niveaux élevés.

export const PATTERNS: PatternDefinition[] = [
  // ============================================
  // NIVEAU 1 : Alternances simples (6-7 ans) - 10 patterns
  // Motifs très réguliers, 2 éléments max
  // ============================================
  { type: 'ABAB', cycle: [0, 1], transform: 'none', difficulty: 1 },
  { type: 'AABB', cycle: [0, 0, 1, 1], transform: 'none', difficulty: 1 },
  { type: 'AAB', cycle: [0, 0, 1], transform: 'none', difficulty: 1 },
  { type: 'custom', cycle: [0, 1, 1], transform: 'none', difficulty: 1 }, // ABB
  { type: 'custom', cycle: [0, 0, 0, 1], transform: 'none', difficulty: 1 }, // AAAB
  { type: 'custom', cycle: [0, 1, 0], transform: 'none', difficulty: 1 }, // ABA simple
  { type: 'custom', cycle: [1, 0, 1, 0], transform: 'none', difficulty: 1 }, // BABA
  { type: 'custom', cycle: [0, 1, 1, 0], transform: 'none', difficulty: 1 }, // ABBA
  { type: 'custom', cycle: [0, 0, 1, 0], transform: 'none', difficulty: 1 }, // AABA
  { type: 'custom', cycle: [0, 1, 0, 0], transform: 'none', difficulty: 1 }, // ABAA

  // ============================================
  // NIVEAU 2 : Motifs à 3 éléments (7-8 ans) - 10 patterns
  // Introduction d'un 3ème élément
  // ============================================
  { type: 'ABC', cycle: [0, 1, 2], transform: 'none', difficulty: 2 },
  { type: 'ABBC', cycle: [0, 1, 1, 2], transform: 'none', difficulty: 2 },
  { type: 'AABBCC', cycle: [0, 0, 1, 1, 2, 2], transform: 'none', difficulty: 2 },
  { type: 'custom', cycle: [0, 1, 2, 0, 1, 2], transform: 'none', difficulty: 2 }, // ABCABC
  { type: 'custom', cycle: [0, 0, 1, 2], transform: 'none', difficulty: 2 }, // AABC
  { type: 'custom', cycle: [0, 1, 2, 2], transform: 'none', difficulty: 2 }, // ABCC
  { type: 'custom', cycle: [0, 1, 0, 2], transform: 'none', difficulty: 2 }, // ABAC
  { type: 'custom', cycle: [2, 1, 0], transform: 'none', difficulty: 2 }, // CBA
  { type: 'custom', cycle: [0, 2, 1], transform: 'none', difficulty: 2 }, // ACB
  { type: 'custom', cycle: [1, 0, 2, 0], transform: 'none', difficulty: 2 }, // BACA

  // ============================================
  // NIVEAU 3 : Progressions visuelles (8 ans) - 10 patterns
  // Taille croissante, rotations simples
  // ============================================
  { type: 'increasing', cycle: [0], transform: 'size', step: 1, difficulty: 3 },
  { type: 'rotation', cycle: [0], transform: 'rotation', step: 90, difficulty: 3 },
  { type: 'AABBC', cycle: [0, 0, 1, 1, 2], transform: 'none', difficulty: 3 },
  { type: 'custom', cycle: [0, 1, 2, 0], transform: 'none', difficulty: 3 }, // ABCA
  { type: 'custom', cycle: [0, 0, 1, 1, 0, 0], transform: 'none', difficulty: 3 }, // AABBAA
  { type: 'custom', cycle: [0, 1, 1, 2, 2], transform: 'none', difficulty: 3 }, // ABBCC
  { type: 'rotation', cycle: [0], transform: 'rotation', step: 180, difficulty: 3 }, // Rotation 180°
  { type: 'custom', cycle: [0, 1, 2, 1], transform: 'none', difficulty: 3 }, // ABCB
  { type: 'custom', cycle: [0, 0, 0, 1, 1, 1], transform: 'none', difficulty: 3 }, // AAABBB
  { type: 'custom', cycle: [0, 1, 2, 1, 0], transform: 'none', difficulty: 3 }, // ABCBA miroir

  // ============================================
  // NIVEAU 4 : Suites numériques simples (8-9 ans) - 10 patterns
  // +1, +2 et patterns visuels plus longs
  // ============================================
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 1, difficulty: 4 },
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 2, difficulty: 4 },
  { type: 'custom', cycle: [0, 1, 0, 1, 1], transform: 'none', difficulty: 4 },
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 4, difficulty: 4 }, // +4
  { type: 'custom', cycle: [0, 1, 2, 0, 1, 2, 0], transform: 'none', difficulty: 4 }, // ABCABCA
  { type: 'custom', cycle: [0, 0, 1, 1, 0, 0, 2, 2], transform: 'none', difficulty: 4 }, // AABBACC
  { type: 'custom', cycle: [0, 1, 2, 3], transform: 'none', difficulty: 4 }, // ABCD
  { type: 'custom', cycle: [0, 1, 0, 2, 0, 3], transform: 'none', difficulty: 4 }, // ABACAD
  { type: 'rotation', cycle: [0, 1], transform: 'rotation', step: 90, difficulty: 4 }, // Rotation avec 2 formes
  { type: 'custom', cycle: [0, 1, 1, 0, 1, 1], transform: 'none', difficulty: 4 }, // ABBABB

  // ============================================
  // NIVEAU 5 : Suites +3, +5 et patterns visuels (9-10 ans) - 10 patterns
  // ============================================
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 3, difficulty: 5 },
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 5, difficulty: 5 },
  { type: 'custom', cycle: [0, 1, 0, 2, 0, 1, 0, 2], transform: 'none', difficulty: 5 },
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 6, difficulty: 5 }, // +6
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 4, difficulty: 5 }, // +4
  { type: 'custom', cycle: [0, 1, 2, 3, 0, 1, 2, 3], transform: 'none', difficulty: 5 }, // ABCDABCD
  { type: 'custom', cycle: [0, 0, 1, 1, 2, 2, 0, 0], transform: 'none', difficulty: 5 }, // AABBCCAA
  { type: 'rotation_45', cycle: [0], transform: 'rotation', step: 45, difficulty: 5 }, // Rotation 45°
  { type: 'custom', cycle: [0, 1, 2, 2, 1, 0], transform: 'none', difficulty: 5 }, // ABCCBA
  { type: 'custom', cycle: [0, 1, 1, 2, 2, 2], transform: 'none', difficulty: 5 }, // ABBCCC

  // ============================================
  // NIVEAU 6 : Motifs miroir simples (9-10 ans) - 10 patterns
  // ABA, ABCBA et rotations 45°
  // ============================================
  { type: 'mirror', cycle: [0, 1, 0], transform: 'none', difficulty: 6 },
  { type: 'ABCBA', cycle: [0, 1, 2, 1, 0], transform: 'none', difficulty: 6 },
  { type: 'rotation_45', cycle: [0], transform: 'rotation', step: 45, difficulty: 6 },
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 7, difficulty: 6 }, // +7
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 8, difficulty: 6 }, // +8
  { type: 'custom', cycle: [0, 1, 1, 0], transform: 'none', difficulty: 6 }, // ABBA miroir
  { type: 'custom', cycle: [0, 1, 2, 2, 1, 0], transform: 'none', difficulty: 6 }, // ABCCBA
  { type: 'custom', cycle: [0, 0, 1, 1, 0, 0], transform: 'none', difficulty: 6 }, // AABBAA
  { type: 'rotation_complex', cycle: [0], transform: 'rotation', step: 30, difficulty: 6 }, // Rotation 30°
  { type: 'custom', cycle: [0, 1, 2, 3, 2, 1], transform: 'none', difficulty: 6 }, // ABCDCB

  // ============================================
  // NIVEAU 7 : Suites ×2 et patterns imbriqués (10 ans) - 10 patterns
  // ============================================
  { type: 'numeric_mult', cycle: [0], transform: 'numeric', step: 2, difficulty: 7 },
  { type: 'nested', cycle: [0, 1, 2, 0, 1, 2, 0], transform: 'none', difficulty: 7 },
  { type: 'size_color', cycle: [0, 1], transform: 'size', step: 1, difficulty: 7 },
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 9, difficulty: 7 }, // +9
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 11, difficulty: 7 }, // +11
  { type: 'ABCDCBA', cycle: [0, 1, 2, 3, 2, 1, 0], transform: 'none', difficulty: 7 }, // Miroir 7 éléments
  { type: 'custom', cycle: [0, 1, 0, 1, 2, 0, 1, 2], transform: 'none', difficulty: 7 }, // Pattern croissant
  { type: 'rotation_complex', cycle: [0], transform: 'rotation', step: 60, difficulty: 7 }, // Rotation 60°
  { type: 'custom', cycle: [0, 1, 2, 0, 2, 1], transform: 'none', difficulty: 7 }, // ABCACB
  { type: 'custom', cycle: [0, 0, 1, 1, 2, 2, 3, 3], transform: 'none', difficulty: 7 }, // AABBCCDD

  // ============================================
  // NIVEAU 8 : Carrés parfaits et miroirs longs (10-11 ans) - 10 patterns
  // 1, 4, 9, 16, 25... et ABCDCBA
  // ============================================
  { type: 'numeric_square', cycle: [0], transform: 'numeric', step: 1, difficulty: 8 },
  { type: 'ABCDCBA', cycle: [0, 1, 2, 3, 2, 1, 0], transform: 'none', difficulty: 8 },
  { type: 'rotation_complex', cycle: [0], transform: 'rotation', step: 60, difficulty: 8 },
  { type: 'numeric_mult', cycle: [0], transform: 'numeric', step: 2, difficulty: 8 }, // ×2
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 12, difficulty: 8 }, // +12
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 15, difficulty: 8 }, // +15
  { type: 'custom', cycle: [0, 1, 2, 3, 4, 3, 2, 1], transform: 'none', difficulty: 8 }, // ABCDEDCB
  { type: 'custom', cycle: [0, 1, 2, 0, 1, 2, 0, 1, 2], transform: 'none', difficulty: 8 }, // ABCABCABC
  { type: 'nested', cycle: [0, 1, 0, 1, 0, 2, 0, 1, 0], transform: 'none', difficulty: 8 }, // Imbriqué
  { type: 'rotation_complex', cycle: [0], transform: 'rotation', step: 72, difficulty: 8 }, // Rotation pentagone

  // ============================================
  // NIVEAU 9 : Fibonacci et patterns très complexes (11 ans) - 10 patterns
  // ============================================
  { type: 'fibonacci', cycle: [0], transform: 'numeric', difficulty: 9 },
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 10, difficulty: 9 },
  { type: 'complex_pattern', cycle: [0, 1, 2, 3, 2, 1, 0, 1, 2], transform: 'none', difficulty: 9 }, // Oscillant
  { type: 'numeric_mult', cycle: [0], transform: 'numeric', step: 3, difficulty: 9 }, // ×3
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 13, difficulty: 9 }, // +13
  { type: 'prime', cycle: [0], transform: 'numeric', difficulty: 9 }, // Nombres premiers
  { type: 'ABCDEDCBA', cycle: [0, 1, 2, 3, 4, 3, 2, 1, 0], transform: 'none', difficulty: 9 }, // Miroir 9
  { type: 'custom', cycle: [0, 0, 0, 1, 1, 2, 2, 2], transform: 'none', difficulty: 9 }, // AAABBCCC - progression
  { type: 'complex_pattern', cycle: [0, 1, 2, 1, 0, 1, 2, 1], transform: 'none', difficulty: 9 }, // ABCBABCB oscillant
  { type: 'rotation_complex', cycle: [0], transform: 'rotation', step: 40, difficulty: 9 }, // Rotation 40°

  // ============================================
  // NIVEAU 10 : Expert (11-12 ans) - 10 patterns
  // Nombres premiers, ×3, ×4, patterns complexes variés
  // ============================================
  { type: 'prime', cycle: [0], transform: 'numeric', difficulty: 10 },
  { type: 'numeric_mult', cycle: [0], transform: 'numeric', step: 3, difficulty: 10 },
  { type: 'numeric_mult', cycle: [0], transform: 'numeric', step: 4, difficulty: 10 },
  { type: 'numeric_mult', cycle: [0], transform: 'numeric', step: 5, difficulty: 10 }, // ×5
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 7, difficulty: 10 },
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 11, difficulty: 10 },
  { type: 'complex_pattern', cycle: [0, 0, 1, 1, 1, 2, 2, 2, 2], transform: 'none', difficulty: 10 }, // AABBBCCCC - progression croissante
  { type: 'complex_pattern', cycle: [0, 1, 2, 3, 0, 1, 2, 3, 0], transform: 'none', difficulty: 10 },
  { type: 'ABCDEDCBA', cycle: [0, 1, 2, 3, 4, 3, 2, 1, 0], transform: 'none', difficulty: 10 },
  { type: 'numeric_square', cycle: [0], transform: 'numeric', step: 1, difficulty: 10 }, // Carrés parfaits
];

// Helper pour obtenir les patterns d'un niveau spécifique
export function getPatternsByDifficulty(difficulty: number): PatternDefinition[] {
  return PATTERNS.filter(p => p.difficulty === difficulty);
}

// Helper pour obtenir un pattern aléatoire d'un niveau
export function getRandomPattern(difficulty: number): PatternDefinition {
  const availablePatterns = getPatternsByDifficulty(difficulty);
  if (availablePatterns.length === 0) {
    // Fallback sur niveau 1 si aucun pattern trouvé
    return PATTERNS[0];
  }
  const randomIndex = Math.floor(Math.random() * availablePatterns.length);
  return availablePatterns[randomIndex];
}

// Helper pour déterminer la longueur de la séquence selon le pattern
// La longueur est basée sur le cycle du pattern, pas sur la difficulté
export function getSequenceLengthFromPattern(pattern: PatternDefinition): number {
  // Pour les patterns avec transformation (numeric, rotation, size),
  // on affiche au moins le cycle + quelques répétitions pour montrer le pattern
  if (pattern.transform === 'numeric') {
    // Suites numériques : 5-7 éléments selon difficulté
    return pattern.difficulty <= 5 ? 5 : pattern.difficulty <= 8 ? 6 : 7;
  }

  if (pattern.transform === 'rotation' || pattern.transform === 'size') {
    // Transformations visuelles : montrer au moins 4-5 étapes
    return pattern.difficulty <= 4 ? 4 : 5;
  }

  // Pour les patterns cycliques, montrer au moins 1.5 cycles pour que le pattern soit visible
  const cycleLength = pattern.cycle.length;

  // Minimum 4 éléments, maximum 9 éléments
  const minLength = Math.max(4, cycleLength);
  const targetLength = Math.ceil(cycleLength * 1.5);

  return Math.min(9, Math.max(minLength, targetLength));
}

// Legacy function pour compatibilité - utilise la nouvelle logique
export function getSequenceLength(difficulty: number): number {
  // Cette fonction est deprecated - utiliser getSequenceLengthFromPattern
  const defaultLengths: Record<number, number> = {
    1: 5, 2: 6, 3: 6, 4: 7, 5: 7, 6: 7, 7: 8, 8: 8, 9: 9, 10: 9,
  };
  return defaultLengths[difficulty] || 5;
}

// Helper pour obtenir la famille d'un pattern
export function getPatternFamilyFromDef(pattern: PatternDefinition): LogicFamily {
  return getPatternFamily(pattern.type);
}

// Helper pour obtenir les patterns d'une famille spécifique
export function getPatternsByFamily(family: LogicFamily): PatternDefinition[] {
  return PATTERNS.filter(p => getPatternFamily(p.type) === family);
}

// Helper pour obtenir les patterns d'une famille ET difficulté
export function getPatternsByFamilyAndDifficulty(
  family: LogicFamily,
  difficulty: number
): PatternDefinition[] {
  return PATTERNS.filter(
    p => getPatternFamily(p.type) === family && p.difficulty === difficulty
  );
}

// Helper pour obtenir toutes les familles disponibles à un niveau de difficulté
export function getAvailableFamiliesAtDifficulty(difficulty: number): LogicFamily[] {
  const patterns = getPatternsByDifficulty(difficulty);
  const families = new Set(patterns.map(p => getPatternFamily(p.type)));
  return Array.from(families);
}
