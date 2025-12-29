/**
 * Mots Croisés Types
 *
 * Types pour le jeu de mots croisés pour enfants
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

/**
 * Direction d'un mot
 */
export type WordDirection = 'horizontal' | 'vertical';

/**
 * Un mot dans la grille
 */
export interface CrosswordWord {
  id: string;
  /** Le mot à trouver */
  word: string;
  /** L'indice/définition */
  clue: string;
  /** Position de départ (ligne) */
  row: number;
  /** Position de départ (colonne) */
  col: number;
  /** Direction */
  direction: WordDirection;
  /** Numéro affiché */
  number: number;
  /** Emoji d'aide (optionnel) */
  emoji?: string;
}

/**
 * Statut couleur SUTOM pour une lettre
 * - 'correct': Lettre correcte ET bien placée (vert)
 * - 'misplaced': Lettre présente dans le mot mais mal placée (orange)
 * - 'absent': Lettre absente du mot (rouge)
 * - 'neutral': Pas encore de statut (par défaut)
 */
export type LetterStatus = 'correct' | 'misplaced' | 'absent' | 'neutral';

/**
 * Une cellule de la grille
 */
export interface CrosswordCell {
  /** Ligne */
  row: number;
  /** Colonne */
  col: number;
  /** La lettre correcte */
  letter: string;
  /** La lettre entrée par le joueur */
  userLetter: string;
  /** Est une case noire (bloquée) */
  isBlocked: boolean;
  /** Numéro de début de mot (si applicable) */
  wordNumber?: number;
  /** IDs des mots passant par cette cellule */
  wordIds: string[];
  /** Est révélée par un indice */
  isRevealed: boolean;
  /** Statut couleur SUTOM de la lettre */
  letterStatus: LetterStatus;
}

// ============================================================================
// LEVEL TYPES
// ============================================================================

/**
 * Difficulté du niveau
 */
export type CrosswordDifficulty = 1 | 2 | 3;

/**
 * Configuration d'une grille de mots croisés
 */
export interface CrosswordLevel {
  id: string;
  name: string;
  description: string;
  difficulty: CrosswordDifficulty;
  /** Thème de la grille */
  theme: string;
  /** Emoji du thème */
  themeEmoji: string;
  /** Taille de la grille */
  gridSize: { rows: number; cols: number };
  /** Les mots de la grille */
  words: CrosswordWord[];
  /** Indices disponibles */
  hintsAvailable: number;
  /** Temps idéal en secondes */
  idealTime: number;
}

// ============================================================================
// GAME STATE
// ============================================================================

/**
 * Phase du jeu
 */
export type CrosswordPhase = 'intro' | 'playing' | 'paused' | 'victory';

/**
 * État du jeu Mots Croisés
 */
export interface CrosswordGameState {
  /** Phase actuelle */
  phase: CrosswordPhase;
  /** Niveau actuel */
  level: CrosswordLevel;
  /** Grille */
  grid: CrosswordCell[][];
  /** Mots */
  words: CrosswordWord[];
  /** Mot actuellement sélectionné */
  selectedWordId: string | null;
  /** Cellule actuellement sélectionnée */
  selectedCell: { row: number; col: number } | null;
  /** Direction actuelle d'entrée */
  inputDirection: WordDirection;
  /** Nombre d'indices utilisés */
  hintsUsed: number;
  /** Temps écoulé en secondes */
  timeElapsed: number;
  /** Nombre de lettres correctes */
  correctLetters: number;
  /** Nombre total de lettres à trouver */
  totalLetters: number;
  /** Mots complétés */
  completedWordIds: string[];
}

// ============================================================================
// RESULT
// ============================================================================

/**
 * Résultat d'une partie
 */
export interface CrosswordResult {
  /** ID du niveau */
  levelId: string;
  /** Temps en secondes */
  timeSeconds: number;
  /** Mots trouvés */
  wordsFound: number;
  /** Total de mots */
  totalWords: number;
  /** Indices utilisés */
  hintsUsed: number;
  /** Étoiles obtenues (1-3) */
  stars: number;
  /** Score */
  score: number;
  /** Tous les mots trouvés sans indice */
  isPerfect: boolean;
}

// ============================================================================
// CONFIG
// ============================================================================

/**
 * Configuration par défaut
 */
export const DEFAULT_CROSSWORD_CONFIG = {
  /** Temps bonus par étoile */
  timeBonus: {
    3: 1.0,  // Temps <= idéal
    2: 1.5,  // Temps <= 1.5x idéal
    1: 2.0,  // Temps > 1.5x idéal
  },
  /** Points par mot trouvé */
  scorePerWord: 50,
  /** Points bonus par étoile */
  scorePerStar: 100,
  /** Pénalité par indice utilisé */
  hintPenalty: 25,
};

// ============================================================================
// ASSISTANT
// ============================================================================

/**
 * Déclencheurs pour l'assistant
 */
export type CrosswordAssistantTrigger =
  | 'game_start'
  | 'first_word_found'
  | 'stuck_too_long'
  | 'wrong_letter'
  | 'good_progress'
  | 'almost_done'
  | 'victory'
  | 'hint_requested';
