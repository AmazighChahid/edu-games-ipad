/**
 * Tangram Engine
 *
 * Logique centrale du jeu Tangram
 * Gère les collisions, rotations, snap et validation
 */

import type {
  TangramPiece,
  TangramPuzzle,
  TangramGameState,
  TangramLevel,
  TangramResult,
  Transform,
  Point,
  PieceType,
  PieceColor,
  TangramConfig,
} from '../types';
import {
  TANGRAM_PIECES_TEMPLATES,
  PIECE_COLORS,
  DEFAULT_TANGRAM_CONFIG,
} from '../types';

// ============================================================================
// CRÉATION DU JEU
// ============================================================================

/**
 * Crée un état de jeu initial
 */
export function createGame(level: TangramLevel): TangramGameState {
  const pieces = createPieces(level);

  return {
    pieces,
    puzzle: level.puzzle,
    level,
    phase: 'playing',
    selectedPieceId: null,
    placedCount: 0,
    totalPieces: pieces.length,
    timeElapsed: 0,
    rotationCount: 0,
    hintsUsed: 0,
    isAnimating: false,
  };
}

/**
 * Crée les 7 pièces du Tangram
 */
export function createPieces(level: TangramLevel): TangramPiece[] {
  const pieces: TangramPiece[] = [];
  let colorIndex = 0;

  // Créer chaque type de pièce
  Object.entries(TANGRAM_PIECES_TEMPLATES).forEach(([type, template]) => {
    for (let i = 0; i < template.count; i++) {
      const piece: TangramPiece = {
        id: `${type}-${i}`,
        type: type as PieceType,
        color: PIECE_COLORS[colorIndex % PIECE_COLORS.length],
        points: template.points.map(p => ({ ...p })),
        transform: getInitialTransform(pieces.length),
        isPlaced: false,
        isSelected: false,
        zIndex: pieces.length,
      };

      // Trouver la solution correspondante
      const solution = level.puzzle.solution.find(
        s => s.pieceType === type && !pieces.some(p => p.id === s.pieceId)
      );

      if (solution) {
        piece.targetTransform = { ...solution.transform };
      }

      pieces.push(piece);
      colorIndex++;
    }
  });

  return pieces;
}

/**
 * Obtient une position initiale pour une pièce
 */
function getInitialTransform(index: number): Transform {
  // Disposer les pièces en bas de l'écran
  const col = index % 4;
  const row = Math.floor(index / 4);

  return {
    x: 50 + col * 80,
    y: 500 + row * 80,
    rotation: 0,
    scale: 1,
    flipped: false,
  };
}

// ============================================================================
// MANIPULATION DES PIÈCES
// ============================================================================

/**
 * Déplace une pièce
 */
export function movePiece(
  state: TangramGameState,
  pieceId: string,
  deltaX: number,
  deltaY: number
): TangramGameState {
  const pieces = state.pieces.map(piece => {
    if (piece.id !== pieceId) return piece;

    return {
      ...piece,
      transform: {
        ...piece.transform,
        x: piece.transform.x + deltaX,
        y: piece.transform.y + deltaY,
      },
      isPlaced: false, // Réinitialiser si on déplace
    };
  });

  return {
    ...state,
    pieces,
    placedCount: pieces.filter(p => p.isPlaced).length,
  };
}

/**
 * Définit la position d'une pièce
 */
export function setPiecePosition(
  state: TangramGameState,
  pieceId: string,
  x: number,
  y: number
): TangramGameState {
  const pieces = state.pieces.map(piece => {
    if (piece.id !== pieceId) return piece;

    return {
      ...piece,
      transform: {
        ...piece.transform,
        x,
        y,
      },
    };
  });

  return { ...state, pieces };
}

/**
 * Tourne une pièce
 */
export function rotatePiece(
  state: TangramGameState,
  pieceId: string,
  degrees: number
): TangramGameState {
  const pieces = state.pieces.map(piece => {
    if (piece.id !== pieceId) return piece;

    let newRotation = (piece.transform.rotation + degrees) % 360;
    if (newRotation < 0) newRotation += 360;

    return {
      ...piece,
      transform: {
        ...piece.transform,
        rotation: newRotation,
      },
      isPlaced: false,
    };
  });

  return {
    ...state,
    pieces,
    rotationCount: state.rotationCount + 1,
    placedCount: pieces.filter(p => p.isPlaced).length,
  };
}

/**
 * Retourne une pièce horizontalement
 */
export function flipPiece(
  state: TangramGameState,
  pieceId: string
): TangramGameState {
  const pieces = state.pieces.map(piece => {
    if (piece.id !== pieceId) return piece;

    return {
      ...piece,
      transform: {
        ...piece.transform,
        flipped: !piece.transform.flipped,
      },
      isPlaced: false,
    };
  });

  return {
    ...state,
    pieces,
    placedCount: pieces.filter(p => p.isPlaced).length,
  };
}

/**
 * Sélectionne une pièce
 */
export function selectPiece(
  state: TangramGameState,
  pieceId: string | null
): TangramGameState {
  const pieces = state.pieces.map(piece => ({
    ...piece,
    isSelected: piece.id === pieceId,
    zIndex: piece.id === pieceId ? 100 : piece.zIndex,
  }));

  return {
    ...state,
    pieces,
    selectedPieceId: pieceId,
  };
}

// ============================================================================
// SNAP & VALIDATION
// ============================================================================

/**
 * Vérifie si une pièce est proche de sa position cible et la snap
 */
export function trySnapPiece(
  state: TangramGameState,
  pieceId: string,
  config: TangramConfig = DEFAULT_TANGRAM_CONFIG
): TangramGameState {
  const piece = state.pieces.find(p => p.id === pieceId);
  if (!piece || !piece.targetTransform) return state;

  const isNearTarget = isPieceNearTarget(
    piece.transform,
    piece.targetTransform,
    config.positionTolerance,
    config.rotationTolerance
  );

  if (!isNearTarget) return state;

  // Snap vers la cible
  const pieces = state.pieces.map(p => {
    if (p.id !== pieceId) return p;

    return {
      ...p,
      transform: { ...p.targetTransform! },
      isPlaced: true,
      isSelected: false,
    };
  });

  const newPlacedCount = pieces.filter(p => p.isPlaced).length;
  const isVictory = newPlacedCount === pieces.length;

  return {
    ...state,
    pieces,
    placedCount: newPlacedCount,
    selectedPieceId: null,
    phase: isVictory ? 'victory' : state.phase,
  };
}

/**
 * Vérifie si une pièce est proche de sa cible
 */
export function isPieceNearTarget(
  current: Transform,
  target: Transform,
  positionTolerance: number,
  rotationTolerance: number
): boolean {
  const dx = Math.abs(current.x - target.x);
  const dy = Math.abs(current.y - target.y);
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > positionTolerance) return false;

  // Vérifier la rotation (gérer le wrap-around)
  let rotationDiff = Math.abs(current.rotation - target.rotation);
  if (rotationDiff > 180) rotationDiff = 360 - rotationDiff;

  if (rotationDiff > rotationTolerance) return false;

  // Vérifier le flip
  if (current.flipped !== target.flipped) return false;

  return true;
}

/**
 * Vérifie si le puzzle est complété
 */
export function isPuzzleComplete(state: TangramGameState): boolean {
  return state.pieces.every(p => p.isPlaced);
}

// ============================================================================
// SCORE & RÉSULTATS
// ============================================================================

/**
 * Calcule le résultat final
 */
export function calculateResult(state: TangramGameState): TangramResult {
  const { puzzle, timeElapsed, rotationCount, hintsUsed, placedCount, totalPieces } = state;
  const isVictory = placedCount >= totalPieces;

  // Score basé sur temps, rotations et indices
  const timeScore = Math.max(0, 100 - Math.floor(timeElapsed / 10));
  const rotationPenalty = Math.min(30, rotationCount * 2);
  const hintPenalty = hintsUsed * 10;
  const score = Math.max(0, timeScore - rotationPenalty - hintPenalty);

  // Étoiles
  const stars = calculateStars(puzzle, timeElapsed, hintsUsed);

  return {
    puzzleId: puzzle.id,
    isVictory,
    timeSeconds: timeElapsed,
    rotations: rotationCount,
    hintsUsed,
    score,
    stars,
    isNewRecord: false,
  };
}

/**
 * Calcule le nombre d'étoiles
 */
export function calculateStars(
  puzzle: TangramPuzzle,
  timeElapsed: number,
  hintsUsed: number
): number {
  const { idealTime } = puzzle;

  // 3 étoiles : temps <= idéal ET 0 indice
  if (timeElapsed <= idealTime && hintsUsed === 0) {
    return 3;
  }

  // 2 étoiles : temps <= 1.5x idéal ET <= 1 indice
  if (timeElapsed <= idealTime * 1.5 && hintsUsed <= 1) {
    return 2;
  }

  // 1 étoile : puzzle complété
  return 1;
}

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Incrémente le temps
 */
export function tickTime(state: TangramGameState): TangramGameState {
  if (state.phase !== 'playing') return state;

  return {
    ...state,
    timeElapsed: state.timeElapsed + 1,
  };
}

/**
 * Obtient un indice (révèle la position d'une pièce)
 */
export function getHint(state: TangramGameState): TangramGameState {
  // Trouver une pièce non placée
  const unplacedPiece = state.pieces.find(p => !p.isPlaced);
  if (!unplacedPiece || !unplacedPiece.targetTransform) return state;

  // Marquer la pièce comme "hintée" (animation)
  const pieces = state.pieces.map(p => {
    if (p.id !== unplacedPiece.id) return p;
    return { ...p, isSelected: true };
  });

  return {
    ...state,
    pieces,
    hintsUsed: state.hintsUsed + 1,
    selectedPieceId: unplacedPiece.id,
  };
}

/**
 * Transforme les points d'une pièce selon son transform
 */
export function transformPoints(points: Point[], transform: Transform): Point[] {
  const { x, y, rotation, scale, flipped } = transform;
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return points.map(point => {
    let px = point.x * scale;
    let py = point.y * scale;

    if (flipped) {
      px = -px;
    }

    // Rotation
    const rx = px * cos - py * sin;
    const ry = px * sin + py * cos;

    return {
      x: rx + x,
      y: ry + y,
    };
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  createGame,
  createPieces,
  movePiece,
  setPiecePosition,
  rotatePiece,
  flipPiece,
  selectPiece,
  trySnapPiece,
  isPieceNearTarget,
  isPuzzleComplete,
  calculateResult,
  calculateStars,
  tickTime,
  getHint,
  transformPoints,
};
