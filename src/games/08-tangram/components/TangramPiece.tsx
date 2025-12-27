/**
 * TangramPiece Component
 *
 * Pièce de Tangram draggable et rotatable
 */

import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Polygon } from 'react-native-svg';

import type { TangramPiece as TangramPieceType, Point } from '../types';
import { PIECE_COLORS } from '../types';
import { useAccessibilityAnimations } from '../../../hooks';

// ============================================================================
// TYPES
// ============================================================================

interface TangramPieceProps {
  /** Données de la pièce */
  piece: TangramPieceType;
  /** Échelle de rendu */
  scale: number;
  /** Est sélectionnée */
  isSelected: boolean;
  /** Callback déplacement */
  onMove: (pieceId: string, deltaX: number, deltaY: number) => void;
  /** Callback fin de déplacement */
  onMoveEnd: (pieceId: string) => void;
  /** Callback rotation */
  onRotate: (pieceId: string, clockwise: boolean) => void;
  /** Callback sélection */
  onSelect: (pieceId: string | null) => void;
  /** Désactivé */
  disabled?: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convertit les points en chaîne SVG
 */
function pointsToSvgString(points: Point[], scale: number): string {
  return points.map(p => `${p.x * scale},${p.y * scale}`).join(' ');
}

/**
 * Calcule le centre d'une pièce
 */
function calculateCenter(points: Point[]): Point {
  const sumX = points.reduce((acc, p) => acc + p.x, 0);
  const sumY = points.reduce((acc, p) => acc + p.y, 0);
  return {
    x: sumX / points.length,
    y: sumY / points.length,
  };
}

/**
 * Calcule les bounds d'une pièce
 */
function calculateBounds(points: Point[]): { width: number; height: number } {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function TangramPiece({
  piece,
  scale,
  isSelected,
  onMove,
  onMoveEnd,
  onRotate,
  onSelect,
  disabled = false,
}: TangramPieceProps) {
  const { springConfig } = useAccessibilityAnimations();

  // Animation values
  const scaleValue = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // Calculs
  const center = calculateCenter(piece.points);
  const bounds = calculateBounds(piece.points);
  const color = PIECE_COLORS[piece.color];

  // Pan gesture pour déplacer
  const panGesture = Gesture.Pan()
    .enabled(!disabled && !piece.isPlaced)
    .onStart(() => {
      scaleValue.value = withSpring(1.1, springConfig);
      runOnJS(onSelect)(piece.id);
    })
    .onUpdate((event) => {
      offsetX.value = event.translationX;
      offsetY.value = event.translationY;
      runOnJS(onMove)(piece.id, event.translationX / scale, event.translationY / scale);
    })
    .onEnd(() => {
      scaleValue.value = withSpring(1, springConfig);
      offsetX.value = withSpring(0, springConfig);
      offsetY.value = withSpring(0, springConfig);
      runOnJS(onMoveEnd)(piece.id);
    });

  // Tap gesture pour sélectionner
  const tapGesture = Gesture.Tap()
    .enabled(!disabled && !piece.isPlaced)
    .onEnd(() => {
      runOnJS(onSelect)(isSelected ? null : piece.id);
    });

  // Double tap pour rotation
  const doubleTapGesture = Gesture.Tap()
    .enabled(!disabled && !piece.isPlaced)
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(onRotate)(piece.id, true);
    });

  // Long press pour rotation inverse
  const longPressGesture = Gesture.LongPress()
    .enabled(!disabled && !piece.isPlaced)
    .minDuration(500)
    .onEnd(() => {
      runOnJS(onRotate)(piece.id, false);
    });

  // Combiner les gestes
  const composedGesture = Gesture.Race(
    panGesture,
    Gesture.Exclusive(doubleTapGesture, tapGesture),
    longPressGesture
  );

  // Style animé
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: piece.transform.x * scale + offsetX.value },
        { translateY: piece.transform.y * scale + offsetY.value },
        { rotate: `${piece.transform.rotation}deg` },
        { scaleX: piece.transform.flipped ? -1 : 1 },
        { scale: scaleValue.value },
      ],
    };
  });

  // Taille du SVG
  const svgWidth = bounds.width * scale + 20;
  const svgHeight = bounds.height * scale + 20;

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.container,
          {
            width: svgWidth,
            height: svgHeight,
          },
          animatedStyle,
        ]}
      >
        <Svg width={svgWidth} height={svgHeight}>
          {/* Ombre */}
          <Polygon
            points={pointsToSvgString(piece.points, scale)}
            fill="rgba(0,0,0,0.15)"
            transform={`translate(${10 + 3}, ${10 + 3})`}
          />
          {/* Pièce principale */}
          <Polygon
            points={pointsToSvgString(piece.points, scale)}
            fill={color}
            stroke={isSelected ? '#FFD700' : 'rgba(0,0,0,0.3)'}
            strokeWidth={isSelected ? 3 : 1.5}
            transform={`translate(10, 10)`}
          />
          {/* Reflet */}
          <Polygon
            points={pointsToSvgString(piece.points, scale)}
            fill="url(#shine)"
            opacity={0.2}
            transform={`translate(10, 10)`}
          />
        </Svg>

        {/* Indicateur de sélection */}
        {isSelected && !piece.isPlaced && (
          <Animated.View style={styles.selectionIndicator} />
        )}

        {/* Indicateur de placement */}
        {piece.isPlaced && (
          <Animated.View style={styles.placedIndicator} />
        )}
      </Animated.View>
    </GestureDetector>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  selectionIndicator: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  placedIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 4,
  },
});

export default TangramPiece;
