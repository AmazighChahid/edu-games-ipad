import { PatternDefinition } from '../types';

// ============================================
// DÉFINITIONS DES PATTERNS PAR NIVEAU
// ============================================

export const PATTERNS: PatternDefinition[] = [
  // ============================================
  // NIVEAU 1 : Alternances simples (6-7 ans)
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
    type: 'AAB',
    cycle: [0, 0, 1],
    transform: 'none',
    difficulty: 2
  },

  // ============================================
  // NIVEAU 3 : Progressions visuelles (8 ans)
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
    type: 'AABBCC',
    cycle: [0, 0, 1, 1, 2, 2],
    transform: 'none',
    difficulty: 3
  },

  // ============================================
  // NIVEAU 4 : Suites numériques simples (8-9 ans)
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
  {
    type: 'numeric_add',
    cycle: [0],
    transform: 'numeric',
    step: 3,
    difficulty: 4
  },

  // ============================================
  // NIVEAU 5 : Suites complexes (9-10 ans)
  // ============================================
  {
    type: 'numeric_mult',
    cycle: [0],
    transform: 'numeric',
    step: 2,
    difficulty: 5
  },
  {
    type: 'fibonacci',
    cycle: [0],
    transform: 'numeric',
    difficulty: 5
  },
  {
    type: 'custom',
    cycle: [0, 1, 0, 2, 0, 1, 0, 2],
    transform: 'none',
    difficulty: 5
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
    3: 7,   // 6 visibles + 1 manquant
    4: 7,   // 6 visibles + 1 manquant
    5: 8,   // 7 visibles + 1 manquant
  };
  return lengths[difficulty] || 5;
}
