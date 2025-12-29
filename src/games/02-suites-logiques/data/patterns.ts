import { PatternDefinition } from '../types';

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
  // NIVEAU 1 : Alternances simples (6-7 ans)
  // Motifs très réguliers, 2 éléments max
  // ============================================
  {
    type: 'ABAB',
    cycle: [0, 1],
    transform: 'none',
    difficulty: 1
  },
  {
    type: 'AABB',
    cycle: [0, 0, 1, 1],
    transform: 'none',
    difficulty: 1
  },
  {
    type: 'AAB',
    cycle: [0, 0, 1],
    transform: 'none',
    difficulty: 1
  },

  // ============================================
  // NIVEAU 2 : Motifs à 3 éléments (7-8 ans)
  // Introduction d'un 3ème élément
  // ============================================
  {
    type: 'ABC',
    cycle: [0, 1, 2],
    transform: 'none',
    difficulty: 2
  },
  {
    type: 'ABBC',
    cycle: [0, 1, 1, 2],
    transform: 'none',
    difficulty: 2
  },
  {
    type: 'AABBCC',
    cycle: [0, 0, 1, 1, 2, 2],
    transform: 'none',
    difficulty: 2
  },

  // ============================================
  // NIVEAU 3 : Progressions visuelles (8 ans)
  // Taille croissante, rotations simples
  // ============================================
  {
    type: 'increasing',
    cycle: [0],
    transform: 'size',
    step: 1,
    difficulty: 3
  },
  {
    type: 'rotation',
    cycle: [0],
    transform: 'rotation',
    step: 90,
    difficulty: 3
  },
  {
    type: 'AABBC',
    cycle: [0, 0, 1, 1, 2],
    transform: 'none',
    difficulty: 3
  },

  // ============================================
  // NIVEAU 4 : Suites numériques simples (8-9 ans)
  // +1, +2 et patterns visuels plus longs
  // ============================================
  {
    type: 'numeric_add',
    cycle: [0],
    transform: 'numeric',
    step: 1,
    difficulty: 4
  },
  {
    type: 'numeric_add',
    cycle: [0],
    transform: 'numeric',
    step: 2,
    difficulty: 4
  },
  // Pattern visuel niveau 4: alternance avec répétition
  {
    type: 'custom',
    cycle: [0, 1, 0, 1, 1],
    transform: 'none',
    difficulty: 4
  },

  // ============================================
  // NIVEAU 5 : Suites +3, +5 et patterns visuels (9-10 ans)
  // ============================================
  {
    type: 'numeric_add',
    cycle: [0],
    transform: 'numeric',
    step: 3,
    difficulty: 5
  },
  {
    type: 'numeric_add',
    cycle: [0],
    transform: 'numeric',
    step: 5,
    difficulty: 5
  },
  // Pattern visuel niveau 5: alternance complexe
  {
    type: 'custom',
    cycle: [0, 1, 0, 2, 0, 1, 0, 2],
    transform: 'none',
    difficulty: 5
  },

  // ============================================
  // NIVEAU 6 : Motifs miroir simples (9-10 ans)
  // ABA, ABCBA et rotations 45°
  // ============================================
  {
    type: 'mirror',
    cycle: [0, 1, 0],
    transform: 'none',
    difficulty: 6
  },
  {
    type: 'ABCBA',
    cycle: [0, 1, 2, 1, 0],
    transform: 'none',
    difficulty: 6
  },
  {
    type: 'rotation_45',
    cycle: [0],
    transform: 'rotation',
    step: 45,
    difficulty: 6
  },

  // ============================================
  // NIVEAU 7 : Suites ×2 et patterns imbriqués (10 ans)
  // ============================================
  {
    type: 'numeric_mult',
    cycle: [0],
    transform: 'numeric',
    step: 2,
    difficulty: 7
  },
  {
    type: 'nested',
    cycle: [0, 0, 1, 0, 0, 1, 2],
    transform: 'none',
    difficulty: 7
  },
  // Taille + alternance de formes
  {
    type: 'size_color',
    cycle: [0, 1],
    transform: 'size',
    step: 1,
    difficulty: 7
  },

  // ============================================
  // NIVEAU 8 : Carrés parfaits et miroirs longs (10-11 ans)
  // 1, 4, 9, 16, 25... et ABCDCBA
  // ============================================
  {
    type: 'numeric_square',
    cycle: [0],
    transform: 'numeric',
    step: 1,
    difficulty: 8
  },
  {
    type: 'ABCDCBA',
    cycle: [0, 1, 2, 3, 2, 1, 0],
    transform: 'none',
    difficulty: 8
  },
  // Rotation par 60° (hexagone)
  {
    type: 'rotation_complex',
    cycle: [0],
    transform: 'rotation',
    step: 60,
    difficulty: 8
  },

  // ============================================
  // NIVEAU 9 : Fibonacci et patterns très complexes (11 ans)
  // ============================================
  {
    type: 'fibonacci',
    cycle: [0],
    transform: 'numeric',
    difficulty: 9
  },
  {
    type: 'numeric_add',
    cycle: [0],
    transform: 'numeric',
    step: 10,
    difficulty: 9
  },
  // Pattern visuel très complexe
  {
    type: 'complex_pattern',
    cycle: [0, 1, 2, 0, 1, 2, 3],
    transform: 'none',
    difficulty: 9
  },

  // ============================================
  // NIVEAU 10 : Expert (11-12 ans)
  // Nombres premiers, ×3, patterns Fibonacci visuels
  // ============================================
  {
    type: 'prime',
    cycle: [0],
    transform: 'numeric',
    difficulty: 10
  },
  {
    type: 'numeric_mult',
    cycle: [0],
    transform: 'numeric',
    step: 3,
    difficulty: 10
  },
  // Pattern visuel Fibonacci (nombre d'éléments suit Fibonacci)
  {
    type: 'complex_pattern',
    cycle: [0, 1, 0, 1, 1, 0, 1, 1, 1],
    transform: 'none',
    difficulty: 10
  },
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

// Helper pour déterminer la longueur de la séquence selon la difficulté
export function getSequenceLength(difficulty: number): number {
  const lengths: Record<number, number> = {
    1: 5,   // 4 visibles + 1 manquant
    2: 6,   // 5 visibles + 1 manquant
    3: 6,   // 5 visibles + 1 manquant
    4: 7,   // 6 visibles + 1 manquant
    5: 7,   // 6 visibles + 1 manquant
    6: 7,   // 6 visibles + 1 manquant
    7: 8,   // 7 visibles + 1 manquant
    8: 8,   // 7 visibles + 1 manquant
    9: 9,   // 8 visibles + 1 manquant
    10: 9,  // 8 visibles + 1 manquant
  };
  return lengths[difficulty] || 5;
}
