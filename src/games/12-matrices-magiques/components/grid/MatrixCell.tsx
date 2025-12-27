/**
 * MatrixCell - Individual cell in the matrix grid
 * Renders a shape or target placeholder with proper styling
 */

import React, { memo, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Defs, Pattern, Line } from 'react-native-svg';

import { MatrixCell as MatrixCellType, MatrixCellProps } from '../../types';
import { ShapeRenderer } from '../shapes';

const AnimatedView = Animated.createAnimatedComponent(View);

// ============================================================================
// TARGET CELL COMPONENT (the missing piece)
// ============================================================================

interface TargetCellProps {
  size: number;
  isHighlighted?: boolean;
  showPattern?: boolean;
}

const TargetCell = memo(({ size, isHighlighted, showPattern }: TargetCellProps) => {
  const pulseOpacity = useSharedValue(0.6);
  const borderScale = useSharedValue(1);

  useEffect(() => {
    // Pulsing animation for target cell
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    borderScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: borderScale.value }],
  }));

  return (
    <AnimatedView style={[styles.targetCell, { width: size, height: size }, animatedStyle]}>
      <LinearGradient
        colors={['rgba(91, 141, 238, 0.2)', 'rgba(91, 141, 238, 0.1)']}
        style={styles.targetGradient}
      >
        {/* Dashed border pattern */}
        <Svg width={size - 8} height={size - 8} style={styles.dashedBorder}>
          <Defs>
            <Pattern
              id="dashedPattern"
              patternUnits="userSpaceOnUse"
              width="10"
              height="10"
            >
              <Line
                x1="0"
                y1="5"
                x2="6"
                y2="5"
                stroke="#5B8DEE"
                strokeWidth="2"
              />
            </Pattern>
          </Defs>
          <Rect
            x="2"
            y="2"
            width={size - 12}
            height={size - 12}
            rx="12"
            ry="12"
            fill="none"
            stroke="#5B8DEE"
            strokeWidth="3"
            strokeDasharray="8 6"
          />
        </Svg>

        {/* Question mark indicator */}
        <View style={styles.questionContainer}>
          <Animated.Text style={styles.questionMark}>?</Animated.Text>
        </View>
      </LinearGradient>
    </AnimatedView>
  );
});

// ============================================================================
// MATRIX CELL COMPONENT
// ============================================================================

function MatrixCellComponent({
  cell,
  size,
  onPress,
  isHighlighted = false,
  showPattern = false,
}: MatrixCellProps) {
  const highlightScale = useSharedValue(1);
  const highlightOpacity = useSharedValue(0);

  useEffect(() => {
    if (isHighlighted) {
      highlightOpacity.value = withTiming(1, { duration: 200 });
      highlightScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    } else {
      highlightOpacity.value = withTiming(0, { duration: 200 });
      highlightScale.value = withSpring(1);
    }
  }, [isHighlighted]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: highlightScale.value }],
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    opacity: highlightOpacity.value,
  }));

  // Render target cell (missing piece)
  if (cell.isTarget) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.cellContainer, { width: size, height: size }]}
        accessibilityRole="button"
        accessibilityLabel="Case cible - trouve la forme manquante"
        accessibilityHint="Cette case attend la bonne réponse"
      >
        <TargetCell size={size} isHighlighted={isHighlighted} showPattern={showPattern} />
      </Pressable>
    );
  }

  // Render empty cell (shouldn't happen in normal gameplay)
  if (!cell.shape) {
    return (
      <View style={[styles.cellContainer, styles.emptyCell, { width: size, height: size }]} />
    );
  }

  // Render shape cell
  const content = (
    <AnimatedView
      style={[
        styles.cellContainer,
        styles.shapeCell,
        { width: size, height: size },
        containerAnimatedStyle,
      ]}
    >
      {/* Background */}
      <View style={styles.cellBackground}>
        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Highlight overlay */}
      <AnimatedView style={[styles.highlightOverlay, highlightStyle]} />

      {/* Shape */}
      <ShapeRenderer
        config={cell.shape}
        size={size - 16}
        animated={false}
      />

      {/* Pattern indicator for hints */}
      {showPattern && (
        <View style={styles.patternIndicator}>
          <View style={styles.patternDot} />
        </View>
      )}
    </AnimatedView>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
        accessibilityRole="button"
        accessibilityLabel={`Forme ${cell.shape.type} de couleur ${cell.shape.color}`}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

export const MatrixCell = memo(MatrixCellComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  cellContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeCell: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  emptyCell: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  cellBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  highlightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(91, 141, 238, 0.15)',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#5B8DEE',
  },
  targetCell: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  targetGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  dashedBorder: {
    position: 'absolute',
    alignSelf: 'center',
  },
  questionContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(91, 141, 238, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionMark: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  patternIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  patternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFB347',
  },
  pressed: {
    opacity: 0.8,
  },
});
