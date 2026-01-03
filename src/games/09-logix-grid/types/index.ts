/**
 * Logix Grid Types
 *
 * Types pour le jeu de grilles logiques
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

/**
 * Un élément dans une catégorie (ex: "Rouge", "Marie", "Chat")
 */
export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
}

/**
 * Une catégorie (ex: "Couleur", "Personne", "Animal")
 */
export interface Category {
  id: string;
  name: string;
  items: CategoryItem[];
}

/**
 * Types d'indices
 */
export type ClueType =
  | 'positive'      // "Marie a le chat"
  | 'negative'      // "Marie n'a pas le chat"
  | 'either_or'     // "Marie a le chat ou le chien"
  | 'if_then'       // "Si Marie a le chat, alors elle aime le rouge"
  | 'position'      // "Le chat est à gauche du chien"
  | 'between';      // "Le chat est entre Marie et Paul"

/**
 * Un indice
 */
export interface Clue {
  id: string;
  text: string;
  type: ClueType;
  /** L'indice a été utilisé par le joueur */
  isUsed: boolean;
  /** Données structurées de l'indice */
  data: ClueData;
}

/**
 * Données structurées d'un indice
 */
export interface ClueData {
  /** Premier sujet */
  subject1: string;
  /** Catégorie du premier sujet */
  category1: string;
  /** Second sujet (pour relations) */
  subject2?: string;
  /** Catégorie du second sujet */
  category2?: string;
  /** Troisième sujet (pour between) */
  subject3?: string;
  /** Catégorie du troisième sujet */
  category3?: string;
  /** Relation négative */
  isNegative?: boolean;
}

/**
 * État d'une cellule de la grille
 */
export type CellState = 'empty' | 'yes' | 'no';

/**
 * Une cellule dans la grille (données)
 */
export interface GridCellData {
  /** ID de l'élément de la ligne */
  rowItemId: string;
  /** ID de l'élément de la colonne */
  colItemId: string;
  /** État de la cellule */
  state: CellState;
  /** Marqué par le joueur */
  isPlayerMarked: boolean;
}

// Alias pour compatibilité (type uniquement)
export type GridCellType = GridCellData;

// ============================================================================
// LEVEL TYPES
// ============================================================================

/**
 * Difficulté du niveau
 */
export type LogixDifficulty = 1 | 2 | 3;

/**
 * Configuration d'un puzzle Logix
 */
export interface LogixPuzzle {
  id: string;
  name: string;
  description: string;
  difficulty: LogixDifficulty;
  /** Les catégories du puzzle */
  categories: Category[];
  /** Les indices */
  clues: Clue[];
  /** La solution (mapping catégorie -> item -> items associés) */
  solution: Record<string, Record<string, string[]>>;
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
export type LogixPhase = 'intro' | 'playing' | 'paused' | 'victory';

/**
 * État du jeu Logix Grid
 */
export interface LogixGameState {
  /** Phase actuelle */
  phase: LogixPhase;
  /** Puzzle actuel */
  puzzle: LogixPuzzle;
  /** État de la grille */
  grid: GridCellData[];
  /** Indices marqués comme utilisés */
  usedClueIds: string[];
  /** Nombre d'indices demandés */
  hintsUsed: number;
  /** Temps écoulé en secondes */
  timeElapsed: number;
  /** Nombre d'actions (placements) */
  actionCount: number;
  /** Cellule sélectionnée */
  selectedCell: { rowItemId: string; colItemId: string } | null;
  /** Indice actif */
  activeHint: ClueHint | null;
}

/**
 * Indice visuel
 */
export interface ClueHint {
  clueId: string;
  highlightedCells: Array<{ rowItemId: string; colItemId: string }>;
}

// ============================================================================
// RESULT
// ============================================================================

/**
 * Résultat d'une partie
 */
export interface LogixResult {
  /** Puzzle résolu */
  puzzleId: string;
  /** Temps en secondes */
  timeSeconds: number;
  /** Nombre d'actions */
  actionCount: number;
  /** Indices utilisés */
  hintsUsed: number;
  /** Étoiles obtenues (1-3) */
  stars: number;
  /** Score */
  score: number;
  /** Parfait (aucune erreur) */
  isPerfect: boolean;
}

// ============================================================================
// CONFIG
// ============================================================================

/**
 * Configuration par défaut
 */
export const DEFAULT_LOGIX_CONFIG = {
  /** Délai pour marquer un indice comme utilisé */
  clueUsageDelay: 1000,
  /** Temps bonus par étoile */
  timeBonus: {
    3: 1.0,  // Temps <= idéal
    2: 1.5,  // Temps <= 1.5x idéal
    1: 2.0,  // Temps > 1.5x idéal
  },
  /** Points par étoile */
  scorePerStar: 100,
  /** Pénalité par indice utilisé */
  hintPenalty: 50,
};

// ============================================================================
// ASSISTANT
// ============================================================================

/**
 * Déclencheurs pour l'assistant
 */
export type LogixAssistantTrigger =
  | 'game_start'
  | 'first_clue_used'
  | 'stuck_too_long'
  | 'wrong_deduction'
  | 'good_progress'
  | 'almost_done'
  | 'victory'
  | 'hint_requested';
