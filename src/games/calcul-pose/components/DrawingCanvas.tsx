/**
 * DrawingCanvas component
 * SVG-based drawing surface for handwriting digit input
 * Works on iOS, Android, and Web
 */

import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { spacing, borderRadius, shadows } from '@/theme/spacing';
import type { DrawingPath } from '../types';

interface DrawingCanvasProps {
  width: number;
  height: number;
  onDrawingComplete: (paths: DrawingPath[]) => void;
  onClear: () => void;
  disabled?: boolean;
  recognizedDigit?: number | null;
}

interface Point {
  x: number;
  y: number;
}

export function DrawingCanvas({
  width,
  height,
  onDrawingComplete,
  onClear,
  disabled = false,
  recognizedDigit,
}: DrawingCanvasProps) {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const pathIdRef = useRef(0);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const addPointToPath = useCallback((x: number, y: number) => {
    setCurrentPath(prev => [...prev, { x, y }]);
  }, []);

  const startNewPath = useCallback((x: number, y: number) => {
    setCurrentPath([{ x, y }]);
  }, []);

  const finishPath = useCallback(() => {
    if (currentPath.length > 1) {
      const newPath: DrawingPath = {
        id: `path-${pathIdRef.current++}`,
        points: currentPath,
        timestamp: Date.now(),
      };
      const newPaths = [...paths, newPath];
      setPaths(newPaths);
      onDrawingComplete(newPaths);
    }
    setCurrentPath([]);
  }, [currentPath, paths, onDrawingComplete]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart((e) => {
      runOnJS(startNewPath)(e.x, e.y);
    })
    .onUpdate((e) => {
      runOnJS(addPointToPath)(e.x, e.y);
    })
    .onEnd(() => {
      runOnJS(finishPath)();
    });

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onStart((e) => {
      // Single tap adds a dot
      runOnJS(startNewPath)(e.x, e.y);
      runOnJS(addPointToPath)(e.x + 1, e.y + 1);
      runOnJS(finishPath)();
    });

  const gesture = Gesture.Race(panGesture, tapGesture);

  const handleClear = useCallback(() => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    setPaths([]);
    setCurrentPath([]);
    pathIdRef.current = 0;
    onClear();
  }, [onClear, scale]);

  const pointsToSvgPath = (points: Point[]): string => {
    if (points.length < 2) return '';
    const [first, ...rest] = points;
    return `M ${first.x} ${first.y} ${rest.map(p => `L ${p.x} ${p.y}`).join(' ')}`;
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.canvasContainer, animatedStyle]}>
            <Svg width={width} height={height} style={styles.svg}>
              {/* Background */}
              <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={disabled ? colors.ui.disabled : '#FFFFFF'}
                rx={borderRadius.md}
              />

              {/* Grid lines for guidance */}
              <Path
                d={`M ${width / 2} 0 L ${width / 2} ${height}`}
                stroke={colors.ui.border}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <Path
                d={`M 0 ${height / 2} L ${width} ${height / 2}`}
                stroke={colors.ui.border}
                strokeWidth={1}
                strokeDasharray="4,4"
              />

              {/* Completed paths */}
              {paths.map(path => (
                <Path
                  key={path.id}
                  d={pointsToSvgPath(path.points)}
                  stroke={colors.text.primary}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}

              {/* Current path being drawn */}
              {currentPath.length > 0 && (
                <Path
                  d={pointsToSvgPath(currentPath)}
                  stroke={colors.primary.main}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
            </Svg>

            {/* Recognized digit overlay */}
            {recognizedDigit !== undefined && recognizedDigit !== null && recognizedDigit >= 0 && (
              <View style={styles.recognizedOverlay}>
                <Text style={styles.recognizedText}>{recognizedDigit}</Text>
              </View>
            )}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>

      {/* Clear button */}
      <Pressable
        style={({ pressed }) => [
          styles.clearButton,
          pressed && styles.clearButtonPressed,
        ]}
        onPress={handleClear}
        disabled={disabled}
      >
        <Text style={styles.clearButtonText}>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  gestureRoot: {
    overflow: 'hidden',
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  canvasContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    borderWidth: 3,
    borderColor: colors.text.primary,
    overflow: 'hidden',
  },
  svg: {
    backgroundColor: 'transparent',
  },
  recognizedOverlay: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    backgroundColor: colors.feedback.successLight,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  recognizedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.feedback.success,
  },
  clearButton: {
    position: 'absolute',
    top: -spacing[2],
    right: -spacing[2],
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
    borderWidth: 2,
    borderColor: colors.ui.border,
  },
  clearButtonPressed: {
    backgroundColor: colors.ui.border,
    transform: [{ scale: 0.95 }],
  },
  clearButtonText: {
    fontSize: 18,
  },
});
