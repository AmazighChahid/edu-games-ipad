/**
 * Tangram Game Types
 *
 * Types pour le jeu Puzzle Formes (Tangram)
 */

// ============================================================================
// TYPES DE BASE
// ============================================================================

export type PieceType = 'large_triangle' | 'medium_triangle' | 'small_triangle' | 'square' | 'parallelogram';

export type PieceColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export type GamePhase = 'intro' | 'playing' | 'paused' | 'victory';

export type Difficulty = 'easy' | 'medium' | 'hard';

// ============================================================================
// GÉOMÉTRIE
// ============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Transform {
  /** Position X */
  x: number;
  /** Position Y */
  y: number;
  /** Rotation en degrés (0-360) */
  rotation: number;
  /** Échelle */
  scale: number;
  /** Retourné horizontalement */
  flipped: boolean;
}

// ============================================================================
// PIÈCE
// ============================================================================

export interface TangramPiece {
  /** Identifiant unique */
  id: string;
  /** Type de pièce */
  type: PieceType;
  /** Couleur */
  color: PieceColor;
  /** Points du polygone (forme) */
  points: Point[];
  /** Transform actuel */
  transform: Transform;
  /** Transform cible (solution) */
  targetTransform?: Transform;
  /** Est placée correctement */
  isPlaced: boolean;
  /** Est sélectionnée */
  isSelected: boolean;
  /** Z-index pour l'ordre d'affichage */
  zIndex: number;
}

// ============================================================================
// PUZZLE (SILHOUETTE)
// ============================================================================

export interface TangramPuzzle {
  /** Identifiant unique */
  id: string;
  /** Nom du puzzle */
  name: string;
  /** Description */
  description: string;
  /** Catégorie (animaux, objets, etc.) */
  category: PuzzleCategory;
  /** Difficulté */
  difficulty: Difficulty;
  /** Silhouette (contour) à afficher */
  silhouette: Point[];
  /** Positions cibles des pièces */
  solution: PieceSolution[];
  /** Aperçu (pour sélection) */
  thumbnailEmoji: string;
  /** Temps idéal en secondes */
  idealTime: number;
  /** Verrouillé */
  locked: boolean;
  /** Condition de déverrouillage */
  unlockCondition?: string;
}

export interface PieceSolution {
  /** ID de la pièce */
  pieceId: string;
  /** Type de pièce attendu */
  pieceType: PieceType;
  /** Transform cible */
  transform: Transform;
  /** Tolérance de position */
  positionTolerance: number;
  /** Tolérance de rotation */
  rotationTolerance: number;
}

export type PuzzleCategory = 'animals' | 'objects' | 'people' | 'vehicles' | 'nature' | 'letters';

// ============================================================================
// NIVEAU
// ============================================================================

export interface TangramLevel {
  /** Identifiant unique */
  id: string;
  /** Nom du niveau */
  name: string;
  /** Description */
  description: string;
  /** Puzzle à résoudre */
  puzzle: TangramPuzzle;
  /** Âge recommandé */
  ageRange: string;
  /** Indices visuels disponibles */
  hintsAvailable: number;
  /** Afficher le contour des pièces */
  showOutlines: boolean;
  /** Snap automatique */
  autoSnap: boolean;
  /** Seuil de snap (distance en pixels) */
  snapThreshold: number;
}

// ============================================================================
// ÉTAT DU JEU
// ============================================================================

export interface TangramGameState {
  /** Pièces du jeu */
  pieces: TangramPiece[];
  /** Puzzle actuel */
  puzzle: TangramPuzzle;
  /** Niveau actuel */
  level: TangramLevel;
  /** Phase du jeu */
  phase: GamePhase;
  /** Pièce sélectionnée */
  selectedPieceId: string | null;
  /** Nombre de pièces placées */
  placedCount: number;
  /** Total de pièces */
  totalPieces: number;
  /** Temps écoulé */
  timeElapsed: number;
  /** Nombre de rotations effectuées */
  rotationCount: number;
  /** Indices utilisés */
  hintsUsed: number;
  /** Animation en cours */
  isAnimating: boolean;
}

// ============================================================================
// RÉSULTAT
// ============================================================================

export interface TangramResult {
  /** Puzzle résolu */
  puzzleId: string;
  /** Victoire */
  isVictory: boolean;
  /** Temps total */
  timeSeconds: number;
  /** Nombre de rotations */
  rotations: number;
  /** Indices utilisés */
  hintsUsed: number;
  /** Score calculé */
  score: number;
  /** Étoiles (1-3) */
  stars: number;
  /** Nouveau record */
  isNewRecord: boolean;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface TangramConfig {
  /** Tolérance de position pour snap (pixels) */
  positionTolerance: number;
  /** Tolérance de rotation pour snap (degrés) */
  rotationTolerance: number;
  /** Incrément de rotation */
  rotationStep: number;
  /** Durée animation de snap (ms) */
  snapDuration: number;
  /** Durée animation de victoire (ms) */
  victoryAnimationDuration: number;
}

export const DEFAULT_TANGRAM_CONFIG: TangramConfig = {
  positionTolerance: 20,
  rotationTolerance: 15,
  rotationStep: 45,
  snapDuration: 200,
  victoryAnimationDuration: 1000,
};

// ============================================================================
// PIÈCES STANDARD DU TANGRAM
// ============================================================================

/**
 * Les 7 pièces standard du Tangram
 * Coordonnées normalisées (unité = 1)
 */
export const TANGRAM_PIECES_TEMPLATES: Record<PieceType, { points: Point[]; count: number }> = {
  large_triangle: {
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0.5, y: 0.5 },
    ],
    count: 2,
  },
  medium_triangle: {
    points: [
      { x: 0, y: 0 },
      { x: 0.5, y: 0 },
      { x: 0.25, y: 0.25 },
    ],
    count: 1,
  },
  small_triangle: {
    points: [
      { x: 0, y: 0 },
      { x: 0.35, y: 0 },
      { x: 0.175, y: 0.175 },
    ],
    count: 2,
  },
  square: {
    points: [
      { x: 0, y: 0 },
      { x: 0.35, y: 0 },
      { x: 0.35, y: 0.35 },
      { x: 0, y: 0.35 },
    ],
    count: 1,
  },
  parallelogram: {
    points: [
      { x: 0, y: 0 },
      { x: 0.35, y: 0 },
      { x: 0.5, y: 0.25 },
      { x: 0.15, y: 0.25 },
    ],
    count: 1,
  },
};

// ============================================================================
// COULEURS PAR DÉFAUT
// ============================================================================

export const PIECE_COLORS: PieceColor[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
];

export const PIECE_COLOR_HEX: Record<PieceColor, string> = {
  red: '#E74C3C',
  orange: '#F39C12',
  yellow: '#F1C40F',
  green: '#2ECC71',
  blue: '#3498DB',
  purple: '#9B59B6',
  pink: '#E91E63',
};

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  TangramPiece,
  TangramPuzzle,
  TangramLevel,
  TangramGameState,
  TangramResult,
  TangramConfig,
  PieceSolution,
  Point,
  Transform,
};
