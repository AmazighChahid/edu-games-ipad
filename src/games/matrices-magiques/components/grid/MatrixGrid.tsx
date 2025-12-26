/**
 * MatrixGrid - Container for the puzzle matrix
 * Displays 2x2 or 3x3 grid of cells with animations
 */

import React, { memo, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import {
  GridSize,
  MatrixCell as MatrixCellType,
  Position,
  WorldTheme,
} from '../../types';
import { WORLDS } from '../../data';
import { MatrixCell } from './MatrixCell';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// CONSTANTS
// ============================================================================

const GRID_PADDING = 16;
const CELL_GAP = 12;
const MAX_GRID_WIDTH = Math.min(SCREEN_WIDTH - 48, 360);

// ============================================================================
// TYPES
// ============================================================================

interface MatrixGridProps {
  cells: MatrixCellType[][];
  gridSize: GridSize;
  theme: WorldTheme;
  onCellPress?: (position: Position) => void;
  highlightedCells?: Position[];
  showPatternHints?: boolean;
  animated?: boolean;
}

// ============================================================================
// MATRIX GRID COMPONENT
// ============================================================================

function MatrixGridComponent({
  cells,
  gridSize,
  theme,
  onCellPress,
  highlightedCells = [],
  showPatternHints = false,
  animated = true,
}: MatrixGridProps) {
  const world = WORLDS[theme];
  const gridDimension = gridSize === '2x2' ? 2 : 3;

  // Calculate cell size based on grid dimensions
  const availableWidth = MAX_GRID_WIDTH - GRID_PADDING * 2 - CELL_GAP * (gridDimension - 1);
  const cellSize = Math.floor(availableWidth / gridDimension);

  // Animation values
  const containerScale = useSharedValue(animated ? 0.95 : 1);

  useEffect(() => {
    if (animated) {
      containerScale.value = withSpring(1, {
        damping: 12,
        stiffness: 100,
      });
    }
  }, [animated]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  // Check if a cell is highlighted
  const isCellHighlighted = (row: number, col: number): boolean => {
    return highlightedCells.some(
      (pos) => pos.row === row && pos.col === col
    );
  };

  // Handle cell press
  const handleCellPress = (row: number, col: number) => {
    if (onCellPress) {
      onCellPress({ row, col });
    }
  };

  return (
    <Animated.View
      style={styles.container}
      entering={animated ? FadeIn.duration(300) : undefined}
    >
      <Animated.View style={containerAnimatedStyle}>
      {/* Outer frame with gradient */}
      <LinearGradient
        colors={[world.gradientColors[0] + '40', world.gradientColors[1] + '30']}
        style={styles.outerFrame}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Inner container */}
        <View
          style={[
            styles.gridContainer,
            {
              width: MAX_GRID_WIDTH,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            },
          ]}
        >
          {/* Grid rows */}
          {cells.map((row, rowIndex) => (
            <Animated.View
              key={`row-${rowIndex}`}
              entering={animated ? FadeInUp.delay(100 * rowIndex).duration(300) : undefined}
              style={styles.row}
            >
              {row.map((cell, colIndex) => (
                <Animated.View
                  key={`cell-${rowIndex}-${colIndex}`}
                  entering={
                    animated
                      ? FadeIn.delay(50 * (rowIndex * gridDimension + colIndex)).duration(200)
                      : undefined
                  }
                  style={[
                    styles.cellWrapper,
                    colIndex < row.length - 1 && { marginRight: CELL_GAP },
                  ]}
                >
                  <MatrixCell
                    cell={cell}
                    size={cellSize}
                    onPress={
                      cell.isTarget ? () => handleCellPress(rowIndex, colIndex) : undefined
                    }
                    isHighlighted={isCellHighlighted(rowIndex, colIndex)}
                    showPattern={showPatternHints}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          ))}

          {/* Grid lines (decorative) */}
          <View style={styles.gridLinesContainer} pointerEvents="none">
            {/* Horizontal lines */}
            {Array.from({ length: gridDimension - 1 }).map((_, i) => (
              <View
                key={`h-line-${i}`}
                style={[
                  styles.gridLineHorizontal,
                  {
                    top: (i + 1) * (cellSize + CELL_GAP) + GRID_PADDING - CELL_GAP / 2,
                    width: gridDimension * cellSize + (gridDimension - 1) * CELL_GAP,
                    backgroundColor: world.primaryColor + '15',
                  },
                ]}
              />
            ))}
            {/* Vertical lines */}
            {Array.from({ length: gridDimension - 1 }).map((_, i) => (
              <View
                key={`v-line-${i}`}
                style={[
                  styles.gridLineVertical,
                  {
                    left: (i + 1) * (cellSize + CELL_GAP) + GRID_PADDING - CELL_GAP / 2,
                    height: gridDimension * cellSize + (gridDimension - 1) * CELL_GAP,
                    backgroundColor: world.primaryColor + '15',
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Decorative corner accents */}
      <CornerAccent position="topLeft" color={world.primaryColor} />
      <CornerAccent position="topRight" color={world.primaryColor} />
      <CornerAccent position="bottomLeft" color={world.primaryColor} />
      <CornerAccent position="bottomRight" color={world.primaryColor} />
      </Animated.View>
    </Animated.View>
  );
}

// ============================================================================
// CORNER ACCENT COMPONENT
// ============================================================================

interface CornerAccentProps {
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  color: string;
}

const CornerAccent = memo(({ position, color }: CornerAccentProps) => {
  const positionStyles = {
    topLeft: { top: -2, left: -2 },
    topRight: { top: -2, right: -2 },
    bottomLeft: { bottom: -2, left: -2 },
    bottomRight: { bottom: -2, right: -2 },
  };

  const rotations = {
    topLeft: '0deg',
    topRight: '90deg',
    bottomLeft: '-90deg',
    bottomRight: '180deg',
  };

  return (
    <View
      style={[
        styles.cornerAccent,
        positionStyles[position],
        { transform: [{ rotate: rotations[position] }] },
      ]}
    >
      <View style={[styles.cornerLine, { backgroundColor: color }]} />
      <View style={[styles.cornerLine, styles.cornerLineVertical, { backgroundColor: color }]} />
    </View>
  );
});

export const MatrixGrid = memo(MatrixGridComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerFrame: {
    padding: 4,
    borderRadius: 24,
  },
  gridContainer: {
    padding: GRID_PADDING,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: CELL_GAP,
  },
  cellWrapper: {
    // Individual cell wrapper for spacing
  },
  gridLinesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: GRID_PADDING,
    height: 2,
    borderRadius: 1,
  },
  gridLineVertical: {
    position: 'absolute',
    top: GRID_PADDING,
    width: 2,
    borderRadius: 1,
  },
  cornerAccent: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  cornerLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 16,
    height: 3,
    borderRadius: 2,
  },
  cornerLineVertical: {
    width: 3,
    height: 16,
  },
});
