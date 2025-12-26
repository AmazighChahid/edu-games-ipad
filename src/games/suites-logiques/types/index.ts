// ============================================
// TYPES POUR SUITES LOGIQUES
// ============================================

// Types d'éléments possibles
export type ElementType = 'color' | 'shape' | 'number' | 'image' | 'size';

// Types de patterns
export type PatternType =
  | 'ABAB'          // Alternance simple
  | 'AABB'          // Doublons alternés
  | 'AAB'           // Asymétrique
  | 'ABC'           // Cycle de 3
  | 'ABBC'          // Cycle complexe
  | 'AABBCC'        // Doublons triples
  | 'increasing'    // Croissant (taille, quantité)
  | 'decreasing'    // Décroissant
  | 'rotation'      // Rotation progressive
  | 'numeric_add'   // Suite +n
  | 'numeric_mult'  // Suite ×n
  | 'fibonacci'     // Suite de Fibonacci
  | 'custom';       // Pattern personnalisé

// Types de thèmes
export type ThemeType =
  | 'farm'      // 🐄 Ferme
  | 'space'     // 🚀 Espace
  | 'shapes'    // 🔷 Formes
  | 'colors'    // 🎨 Couleurs
  | 'numbers'   // 🔢 Nombres
  | 'music';    // 🎵 Musique

// ============================================
// ÉLÉMENTS DE SÉQUENCE
// ============================================

export interface SequenceElement {
  id: string;
  type: ElementType;
  value: string | number;
  displayAsset: string;           // URI de l'image ou code couleur
  label?: string;                 // Pour accessibilité
  size?: 'small' | 'medium' | 'large';  // Pour patterns de taille
  rotation?: number;              // Pour patterns de rotation (degrés)
}

// ============================================
// PATTERNS
// ============================================

export interface PatternDefinition {
  type: PatternType;
  cycle: number[];                // Ex: [0, 1] pour ABAB, [0, 1, 2] pour ABC
  transform?: 'none' | 'size' | 'rotation' | 'numeric';
  step?: number;                  // Pour suites numériques (+2, ×2, etc.)
  difficulty: 1 | 2 | 3 | 4 | 5;
}

// ============================================
// SÉQUENCE COMPLÈTE
// ============================================

export interface Sequence {
  id: string;
  elements: SequenceElement[];    // Éléments visibles
  missingIndex: number;           // Index de l'élément manquant (généralement dernier)
  correctAnswer: SequenceElement;
  distractors: SequenceElement[]; // Mauvaises réponses
  patternDef: PatternDefinition;
  theme: ThemeType;
  difficulty: number;
}

// ============================================
// THÈMES
// ============================================

export interface UnlockCondition {
  type: 'default' | 'sequences' | 'level' | 'age';
  value?: number;
}

export interface Theme {
  id: ThemeType;
  name: string;
  icon: string;
  elements: SequenceElement[];
  unlockCondition: UnlockCondition;
  ageRange: [number, number];     // [min, max]
}

// ============================================
// ÉTAT DU JEU
// ============================================

export type GameStatus = 'idle' | 'selected' | 'checking' | 'success' | 'error' | 'hint';

export interface GameState {
  currentSequence: Sequence | null;
  selectedAnswer: SequenceElement | null;
  attempts: number;
  hintsUsed: number;
  currentHintLevel: 0 | 1 | 2 | 3 | 4;  // 0 = pas d'indice
  isComplete: boolean;
  status: GameStatus;
}

export interface SessionState {
  sequencesCompleted: number;
  sequencesCorrectFirstTry: number;
  totalAttempts: number;
  totalHints: number;
  currentStreak: number;
  maxStreak: number;
  currentLevel: number;
  startTime: Date;
  theme: ThemeType;
}

// ============================================
// PROGRESSION
// ============================================

export interface PlayerProgress {
  currentLevel: number;
  sequencesPerLevel: Record<number, number>;
  totalSequences: number;
  totalCorrectFirstTry: number;
  unlockedThemes: ThemeType[];
  badges: Badge[];
  lastPlayedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

// ============================================
// CONFIGURATION
// ============================================

export interface GameConfig {
  sequencesPerSession: number;    // 5-10
  maxAttempts: number;            // Avant révélation
  hintThresholds: number[];       // [2, 3, 4, 5] tentatives
  levelUpThreshold: {
    sequences: number;            // Min suites réussies
    successRate: number;          // Min % premier essai
    maxHintRate: number;          // Max indices/suite
  };
  elementSize: number;            // dp
  choiceSize: number;             // dp
  animationDurations: {
    elementAppear: number;
    success: number;
    error: number;
    hint: number;
  };
}

// ============================================
// STATISTIQUES DE SESSION
// ============================================

export interface SessionStats {
  completed: number;
  correctFirstTry: number;
  maxStreak: number;
  totalTime: number;
}
