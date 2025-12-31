/**
 * DraggableSymbol Component
 * A symbol that can be dragged from the selector to the grid
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { colors, borderRadius, shadows } from '@/theme';
import { useDragDrop, DragSourceType } from '../context/DragDropContext';
import type { SudokuValue } from '../types';

// ============================================
// TYPES
// ============================================

interface DraggableSymbolProps {
  symbol: SudokuValue;
  sourceType: DragSourceType;
  sourceCell?: { row: number; col: number };
  isDisabled?: boolean;
  theme: string;
  size?: number;
  children: React.ReactNode;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function DraggableSymbol({
  symbol,
  sourceType,
  sourceCell,
  isDisabled = false,
  theme,
  size = 64,
  children,
  onDragStart,
  onDragEnd,
}: DraggableSymbolProps) {
  const { startDrag, updateDragPosition, endDrag, dragState } = useDragDrop();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .enabled(!isDisabled && symbol !== null)
    .onStart((event) => {
      scale.value = withSpring(1.15);
      opacity.value = withSpring(0.8);

      if (onDragStart) {
        runOnJS(onDragStart)();
      }

      runOnJS(startDrag)(
        symbol,
        sourceType,
        sourceCell || null,
        { x: event.absoluteX, y: event.absoluteY }
      );
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      runOnJS(updateDragPosition)({
        x: event.absoluteX,
        y: event.absoluteY,
      });
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      opacity.value = withSpring(1);

      if (onDragEnd) {
        runOnJS(onDragEnd)();
      }

      runOnJS(endDrag)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    zIndex: translateX.value !== 0 || translateY.value !== 0 ? 1000 : 1,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

// ============================================
// FLOATING DRAG PREVIEW
// ============================================

interface FloatingDragPreviewProps {
  theme: string;
}

export function FloatingDragPreview({ theme }: FloatingDragPreviewProps) {
  const { dragState } = useDragDrop();

  const animatedStyle = useAnimatedStyle(() => ({
    left: dragState.position.x - 32,
    top: dragState.position.y - 32,
    opacity: dragState.isDragging ? 1 : 0,
  }));

  if (!dragState.isDragging || dragState.symbol === null) {
    return null;
  }

  const isNumberTheme = theme === 'numbers';

  return (
    <Animated.View style={[styles.floatingPreview, animatedStyle]} pointerEvents="none">
      <Text style={[styles.previewText, isNumberTheme && styles.previewNumberText]}>
        {dragState.symbol}
      </Text>
    </Animated.View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingPreview: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.light + 'E0',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    zIndex: 9999,
    elevation: 20,
  },
  previewText: {
    fontSize: 36,
    textAlign: 'center',
  },
  previewNumberText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
  },
});
