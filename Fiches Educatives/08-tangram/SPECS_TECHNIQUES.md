# ⚙️ SPECS TECHNIQUES : Puzzle Formes (Tangram)

## Architecture des Composants

### Structure des Fichiers

```
/src/games/08-tangram/
├── index.ts                      # Exports
├── types.ts                      # Types TypeScript
├── components/
│   ├── TangramGame.tsx           # Composant principal
│   ├── TangramBoard.tsx          # Zone de jeu
│   ├── TangramPiece.tsx          # Pièce individuelle (draggable)
│   ├── Silhouette.tsx            # Forme cible à reproduire
│   ├── PiecesTray.tsx            # Plateau des pièces disponibles
│   ├── RotateControls.tsx        # Boutons rotation
│   ├── LevelSelector.tsx         # Sélection du niveau
│   └── HintOverlay.tsx           # Affichage des indices
├── hooks/
│   ├── useTangramGame.ts         # Logique de jeu principale
│   ├── usePieceDrag.ts           # Gestion du drag & drop
│   ├── usePieceRotation.ts       # Gestion des rotations
│   └── useSnapToGrid.ts          # Alignement automatique
├── data/
│   ├── pieces.ts                 # Définition des 7 pièces
│   ├── puzzles.ts                # Catalogue des silhouettes
│   └── levels.ts                 # Configuration des niveaux
├── screens/
│   ├── TangramIntroScreen.tsx    # Écran d'introduction
│   ├── TangramGameScreen.tsx     # Écran de jeu
│   └── TangramVictoryScreen.tsx  # Écran de victoire
├── utils/
│   ├── geometry.ts               # Calculs géométriques
│   ├── collision.ts              # Détection de collision
│   └── validation.ts             # Validation de solution
└── assets/
    └── silhouettes/              # SVG des silhouettes
```

---

## Types TypeScript

```typescript
// types.ts

// ============================================
// PIÈCES
// ============================================

export type PieceType =
  | 'large_triangle_1'
  | 'large_triangle_2'
  | 'medium_triangle'
  | 'small_triangle_1'
  | 'small_triangle_2'
  | 'square'
  | 'parallelogram';

export interface Piece {
  id: PieceType;
  name: string;
  color: string;
  points: Point[];              // Coordonnées des sommets
  area: number;                 // Aire relative
  canFlip: boolean;             // Peut être retourné (parallélogramme)
}

export interface PieceState {
  piece: Piece;
  position: Point;              // Position actuelle
  rotation: number;             // Angle en degrés (0, 45, 90, ...)
  isFlipped: boolean;           // État retourné
  isPlaced: boolean;            // Posé sur le board
  isCorrect: boolean;           // Position correcte
}

export interface Point {
  x: number;
  y: number;
}

// ============================================
// PUZZLES / SILHOUETTES
// ============================================

export interface Puzzle {
  id: string;
  name: string;
  category: PuzzleCategory;
  difficulty: 1 | 2 | 3;
  silhouette: PuzzleSilhouette;
  solution: PiecePlacement[];   // Solution de référence
  alternativeSolutions?: PiecePlacement[][];
}

export type PuzzleCategory =
  | 'shapes'      // Formes géométriques
  | 'animals'     // Animaux
  | 'objects'     // Objets
  | 'characters'  // Personnages
  | 'creative';   // Créatifs

export interface PuzzleSilhouette {
  svgPath: string;              // Chemin SVG de la silhouette
  bounds: { width: number; height: number };
  showOutlines: boolean;        // Afficher les contours des pièces
}

export interface PiecePlacement {
  pieceId: PieceType;
  position: Point;
  rotation: number;
  isFlipped: boolean;
}

// ============================================
// ÉTAT DU JEU
// ============================================

export interface GameState {
  pieces: PieceState[];
  currentPuzzle: Puzzle;
  selectedPieceId: PieceType | null;
  correctPieces: number;
  totalMoves: number;
  rotations: number;
  hintsUsed: number;
  status: 'playing' | 'checking' | 'complete';
}

export interface SessionState {
  puzzlesSolved: number;
  totalTime: number;
  hintsUsed: number;
  stars: 1 | 2 | 3;
}

// ============================================
// CONFIGURATION
// ============================================

export interface GameConfig {
  snapDistance: number;         // Distance de snap en pixels
  rotationStep: number;         // Pas de rotation (45°)
  pieceScale: number;           // Échelle des pièces
  animationDuration: number;    // Durée animations en ms
}
```

---

## Définition des Pièces

```typescript
// data/pieces.ts

import { Piece, PieceType } from '../types';

// Taille de base (unité = 1)
const UNIT = 50;

export const TANGRAM_PIECES: Record<PieceType, Piece> = {
  large_triangle_1: {
    id: 'large_triangle_1',
    name: 'Grand triangle 1',
    color: '#E74C3C',  // Rouge
    area: 4,
    canFlip: false,
    points: [
      { x: 0, y: 0 },
      { x: 4 * UNIT, y: 0 },
      { x: 2 * UNIT, y: 2 * UNIT },
    ],
  },

  large_triangle_2: {
    id: 'large_triangle_2',
    name: 'Grand triangle 2',
    color: '#3498DB',  // Bleu
    area: 4,
    canFlip: false,
    points: [
      { x: 0, y: 0 },
      { x: 4 * UNIT, y: 0 },
      { x: 2 * UNIT, y: 2 * UNIT },
    ],
  },

  medium_triangle: {
    id: 'medium_triangle',
    name: 'Triangle moyen',
    color: '#2ECC71',  // Vert
    area: 2,
    canFlip: false,
    points: [
      { x: 0, y: 0 },
      { x: 2 * UNIT, y: 0 },
      { x: UNIT, y: UNIT },
    ],
  },

  small_triangle_1: {
    id: 'small_triangle_1',
    name: 'Petit triangle 1',
    color: '#F39C12',  // Orange
    area: 1,
    canFlip: false,
    points: [
      { x: 0, y: 0 },
      { x: 2 * UNIT, y: 0 },
      { x: UNIT, y: UNIT },
    ],
  },

  small_triangle_2: {
    id: 'small_triangle_2',
    name: 'Petit triangle 2',
    color: '#9B59B6',  // Violet
    area: 1,
    canFlip: false,
    points: [
      { x: 0, y: 0 },
      { x: 2 * UNIT, y: 0 },
      { x: UNIT, y: UNIT },
    ],
  },

  square: {
    id: 'square',
    name: 'Carré',
    color: '#1ABC9C',  // Turquoise
    area: 2,
    canFlip: false,
    points: [
      { x: 0, y: 0 },
      { x: UNIT * Math.SQRT2, y: 0 },
      { x: UNIT * Math.SQRT2, y: UNIT * Math.SQRT2 },
      { x: 0, y: UNIT * Math.SQRT2 },
    ],
  },

  parallelogram: {
    id: 'parallelogram',
    name: 'Parallélogramme',
    color: '#E056FD',  // Rose
    area: 2,
    canFlip: true,     // Peut être retourné !
    points: [
      { x: 0, y: 0 },
      { x: 2 * UNIT, y: 0 },
      { x: 3 * UNIT, y: UNIT },
      { x: UNIT, y: UNIT },
    ],
  },
};

export const ALL_PIECES = Object.values(TANGRAM_PIECES);
```

---

## Composant Pièce Draggable

```typescript
// components/TangramPiece.tsx

import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';

import { PieceState, Point } from '../types';
import { SPRING_CONFIG } from '../utils/animations';

interface Props {
  pieceState: PieceState;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (position: Point) => void;
  onDoubleTap: () => void;  // Rotation
  disabled: boolean;
}

export const TangramPiece: React.FC<Props> = ({
  pieceState,
  isSelected,
  onSelect,
  onDragEnd,
  onDoubleTap,
  disabled,
}) => {
  const { piece, position, rotation, isFlipped, isCorrect } = pieceState;

  // Shared values pour le drag
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);

  // Calculer les points du polygone
  const pointsString = useMemo(() => {
    return piece.points
      .map(p => `${p.x},${p.y}`)
      .join(' ');
  }, [piece.points]);

  // Gesture de drag
  const panGesture = Gesture.Pan()
    .enabled(!disabled && !isCorrect)
    .onStart(() => {
      scale.value = withSpring(1.1, SPRING_CONFIG);
      zIndex.value = 100;
      runOnJS(onSelect)();
    })
    .onUpdate((event) => {
      translateX.value = position.x + event.translationX;
      translateY.value = position.y + event.translationY;
    })
    .onEnd(() => {
      scale.value = withSpring(1, SPRING_CONFIG);
      zIndex.value = 0;
      runOnJS(onDragEnd)({
        x: translateX.value,
        y: translateY.value,
      });
    });

  // Gesture double-tap pour rotation
  const doubleTapGesture = Gesture.Tap()
    .enabled(!disabled && !isCorrect)
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(onDoubleTap)();
    });

  // Combiner les gestures
  const composedGesture = Gesture.Simultaneous(panGesture, doubleTapGesture);

  // Style animé
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation}deg` },
      { scaleX: isFlipped ? -1 : 1 },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
  }));

  // Calculer la taille du SVG
  const svgSize = useMemo(() => {
    const xs = piece.points.map(p => p.x);
    const ys = piece.points.map(p => p.y);
    return {
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys),
    };
  }, [piece.points]);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.piece,
          animatedStyle,
          isSelected && styles.selected,
          isCorrect && styles.correct,
        ]}
        accessibilityLabel={piece.name}
        accessibilityHint="Double-tap pour tourner, glisser pour déplacer"
      >
        <Svg
          width={svgSize.width}
          height={svgSize.height}
          viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        >
          <Polygon
            points={pointsString}
            fill={piece.color}
            stroke={isSelected ? '#FFFFFF' : '#00000020'}
            strokeWidth={isSelected ? 3 : 1}
          />
        </Svg>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  selected: {
    shadowColor: '#5B8DEE',
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  correct: {
    opacity: 0.8,
  },
});
```

---

## Hook Principal

```typescript
// hooks/useTangramGame.ts

import { useState, useCallback, useMemo } from 'react';
import {
  GameState,
  PieceState,
  Puzzle,
  Point,
  PieceType,
  PiecePlacement,
} from '../types';
import { TANGRAM_PIECES, ALL_PIECES } from '../data/pieces';
import { validatePlacement, isInsideSilhouette } from '../utils/validation';
import { snapToGrid } from '../utils/geometry';

interface UseTangramGameProps {
  puzzle: Puzzle;
}

const ROTATION_STEP = 45;
const SNAP_DISTANCE = 20;

export function useTangramGame({ puzzle }: UseTangramGameProps) {
  // Initialiser les pièces
  const [gameState, setGameState] = useState<GameState>(() => ({
    pieces: initializePieces(),
    currentPuzzle: puzzle,
    selectedPieceId: null,
    correctPieces: 0,
    totalMoves: 0,
    rotations: 0,
    hintsUsed: 0,
    status: 'playing',
  }));

  // Sélectionner une pièce
  const selectPiece = useCallback((pieceId: PieceType) => {
    setGameState(prev => ({
      ...prev,
      selectedPieceId: pieceId,
    }));
  }, []);

  // Déplacer une pièce
  const movePiece = useCallback((pieceId: PieceType, newPosition: Point) => {
    setGameState(prev => {
      // Snap to grid
      const snappedPosition = snapToGrid(newPosition, SNAP_DISTANCE);

      // Vérifier si dans la silhouette
      const piece = TANGRAM_PIECES[pieceId];
      const isInside = isInsideSilhouette(
        snappedPosition,
        piece,
        prev.currentPuzzle.silhouette
      );

      const newPieces = prev.pieces.map(p =>
        p.piece.id === pieceId
          ? {
              ...p,
              position: snappedPosition,
              isPlaced: isInside,
            }
          : p
      );

      return {
        ...prev,
        pieces: newPieces,
        totalMoves: prev.totalMoves + 1,
      };
    });

    // Vérifier si solution complète
    checkSolution();
  }, []);

  // Tourner une pièce
  const rotatePiece = useCallback((pieceId: PieceType) => {
    setGameState(prev => {
      const newPieces = prev.pieces.map(p =>
        p.piece.id === pieceId
          ? {
              ...p,
              rotation: (p.rotation + ROTATION_STEP) % 360,
            }
          : p
      );

      return {
        ...prev,
        pieces: newPieces,
        rotations: prev.rotations + 1,
      };
    });
  }, []);

  // Retourner le parallélogramme
  const flipPiece = useCallback((pieceId: PieceType) => {
    const piece = TANGRAM_PIECES[pieceId];
    if (!piece.canFlip) return;

    setGameState(prev => {
      const newPieces = prev.pieces.map(p =>
        p.piece.id === pieceId
          ? { ...p, isFlipped: !p.isFlipped }
          : p
      );

      return {
        ...prev,
        pieces: newPieces,
      };
    });
  }, []);

  // Vérifier la solution
  const checkSolution = useCallback(() => {
    setGameState(prev => {
      const correctPieces = validatePlacement(
        prev.pieces,
        prev.currentPuzzle.solution
      );

      const isComplete = correctPieces === 7;

      return {
        ...prev,
        correctPieces,
        status: isComplete ? 'complete' : 'playing',
      };
    });
  }, []);

  // Demander un indice
  const requestHint = useCallback(() => {
    setGameState(prev => {
      if (prev.hintsUsed >= 3) return prev;

      // Trouver une pièce mal placée et montrer sa position correcte
      const incorrectPiece = prev.pieces.find(p => !p.isCorrect);
      if (!incorrectPiece) return prev;

      const solution = prev.currentPuzzle.solution.find(
        s => s.pieceId === incorrectPiece.piece.id
      );

      if (!solution) return prev;

      // Animer vers la bonne position (TODO: animation)
      const newPieces = prev.pieces.map(p =>
        p.piece.id === incorrectPiece.piece.id
          ? {
              ...p,
              position: solution.position,
              rotation: solution.rotation,
              isFlipped: solution.isFlipped,
              isCorrect: true,
            }
          : p
      );

      return {
        ...prev,
        pieces: newPieces,
        hintsUsed: prev.hintsUsed + 1,
        correctPieces: prev.correctPieces + 1,
      };
    });
  }, []);

  // Reset du puzzle
  const resetPuzzle = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      pieces: initializePieces(),
      selectedPieceId: null,
      correctPieces: 0,
      totalMoves: 0,
      rotations: 0,
      status: 'playing',
    }));
  }, []);

  return {
    gameState,
    selectPiece,
    movePiece,
    rotatePiece,
    flipPiece,
    requestHint,
    resetPuzzle,
    isComplete: gameState.status === 'complete',
  };
}

// Initialiser les pièces dans le bac
function initializePieces(): PieceState[] {
  const trayX = 50;
  let trayY = 100;

  return ALL_PIECES.map((piece, index) => ({
    piece,
    position: { x: trayX, y: trayY + index * 80 },
    rotation: 0,
    isFlipped: false,
    isPlaced: false,
    isCorrect: false,
  }));
}
```

---

## Utilitaires Géométriques

```typescript
// utils/geometry.ts

import { Point, Piece } from '../types';

/**
 * Snap une position à une grille
 */
export function snapToGrid(position: Point, gridSize: number): Point {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

/**
 * Calculer le centre d'une pièce
 */
export function getPieceCenter(piece: Piece): Point {
  const sumX = piece.points.reduce((sum, p) => sum + p.x, 0);
  const sumY = piece.points.reduce((sum, p) => sum + p.y, 0);
  return {
    x: sumX / piece.points.length,
    y: sumY / piece.points.length,
  };
}

/**
 * Appliquer une rotation à des points
 */
export function rotatePoints(
  points: Point[],
  angle: number,
  center: Point
): Point[] {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return points.map(p => ({
    x: center.x + (p.x - center.x) * cos - (p.y - center.y) * sin,
    y: center.y + (p.x - center.x) * sin + (p.y - center.y) * cos,
  }));
}

/**
 * Appliquer une translation à des points
 */
export function translatePoints(points: Point[], offset: Point): Point[] {
  return points.map(p => ({
    x: p.x + offset.x,
    y: p.y + offset.y,
  }));
}

/**
 * Vérifier si un point est dans un polygone (ray casting)
 */
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    if (
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Distance entre deux points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Vérifier si deux pièces se chevauchent
 */
export function doPiecesOverlap(
  piece1Points: Point[],
  piece2Points: Point[]
): boolean {
  // Vérifier si un point de piece1 est dans piece2
  for (const p of piece1Points) {
    if (isPointInPolygon(p, piece2Points)) {
      return true;
    }
  }
  // Vérifier si un point de piece2 est dans piece1
  for (const p of piece2Points) {
    if (isPointInPolygon(p, piece1Points)) {
      return true;
    }
  }
  return false;
}
```

---

## Validation de Solution

```typescript
// utils/validation.ts

import { PieceState, PiecePlacement, PuzzleSilhouette, Piece, Point } from '../types';
import { rotatePoints, translatePoints, isPointInPolygon, distance } from './geometry';

const TOLERANCE = 15; // Tolérance en pixels

/**
 * Vérifier combien de pièces sont correctement placées
 */
export function validatePlacement(
  pieces: PieceState[],
  solution: PiecePlacement[]
): number {
  let correctCount = 0;

  for (const placement of solution) {
    const pieceState = pieces.find(p => p.piece.id === placement.pieceId);
    if (!pieceState) continue;

    if (isPieceCorrect(pieceState, placement)) {
      correctCount++;
    }
  }

  return correctCount;
}

/**
 * Vérifier si une pièce est à la bonne position
 */
function isPieceCorrect(
  pieceState: PieceState,
  expected: PiecePlacement
): boolean {
  // Vérifier la position
  const positionOk =
    distance(pieceState.position, expected.position) < TOLERANCE;

  // Vérifier la rotation (modulo 360)
  const rotationOk =
    Math.abs((pieceState.rotation % 360) - (expected.rotation % 360)) < 5;

  // Vérifier le flip
  const flipOk = pieceState.isFlipped === expected.isFlipped;

  return positionOk && rotationOk && flipOk;
}

/**
 * Vérifier si une pièce est dans la silhouette
 */
export function isInsideSilhouette(
  position: Point,
  piece: Piece,
  silhouette: PuzzleSilhouette
): boolean {
  // Transformer les points de la pièce
  const transformedPoints = translatePoints(piece.points, position);

  // TODO: Parser le SVG path de la silhouette
  // Pour l'instant, on vérifie juste si le centre est dans les bounds
  const center = {
    x: position.x + piece.points.reduce((s, p) => s + p.x, 0) / piece.points.length,
    y: position.y + piece.points.reduce((s, p) => s + p.y, 0) / piece.points.length,
  };

  return (
    center.x >= 0 &&
    center.x <= silhouette.bounds.width &&
    center.y >= 0 &&
    center.y <= silhouette.bounds.height
  );
}
```

---

## Animations

```typescript
// utils/animations.ts

import {
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

// Animation de sélection
export function animateSelect(scale: SharedValue<number>) {
  'worklet';
  scale.value = withSpring(1.1, SPRING_CONFIG);
}

// Animation de drop
export function animateDrop(scale: SharedValue<number>) {
  'worklet';
  scale.value = withSpring(1.0, SPRING_CONFIG);
}

// Animation de rotation
export function animateRotation(
  rotation: SharedValue<number>,
  targetAngle: number
) {
  'worklet';
  rotation.value = withSpring(targetAngle, {
    ...SPRING_CONFIG,
    stiffness: 200,
  });
}

// Animation de pièce correcte
export function animateCorrect(
  scale: SharedValue<number>,
  opacity: SharedValue<number>
) {
  'worklet';
  scale.value = withSequence(
    withSpring(1.15, SPRING_CONFIG),
    withSpring(1.0, SPRING_CONFIG)
  );
  opacity.value = withTiming(0.8, { duration: 300 });
}

// Animation de victoire
export function animateVictory(pieces: PieceState[]) {
  // Confettis et celebration
}
```

---

## Accessibilité

```typescript
// utils/accessibility.ts

export function getPieceAccessibilityLabel(piece: Piece): string {
  return piece.name;
}

export function getPieceAccessibilityHint(
  isPlaced: boolean,
  isCorrect: boolean
): string {
  if (isCorrect) {
    return "Cette pièce est correctement placée";
  }
  if (isPlaced) {
    return "Pièce sur le plateau. Double-tap pour tourner, glisser pour déplacer";
  }
  return "Double-tap pour tourner, glisser pour déplacer vers le puzzle";
}

export function announceRotation(pieceName: string, angle: number): string {
  return `${pieceName} tourné à ${angle} degrés`;
}

export function announceCorrect(pieceName: string): string {
  return `${pieceName} correctement placé !`;
}
```

---

*Spécifications Techniques Puzzle Formes | Application Éducative Montessori iPad*
