/**
 * SudokuCell Component
 * Individual cell in the Sudoku grid with animations
 * Supports tap, drag source (for non-fixed cells), and drop target
 */

import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, View, LayoutRectangle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import { colors, borderRadius } from '@/theme';
import { useStore } from '@/store';
import { useDragDrop } from '../context/DragDropContext';
import type { SudokuCell as CellType } from '../types';

// ============================================
// COULEURS SPÉCIFIQUES SUDOKU
// ============================================

const SUDOKU_COLORS = {
  // Zone highlighting (row/col/box)
  zoneBackground: '#E8EEF4',
  zoneBorder: '#B8C5D4',
  zoneFixedBackground: '#E0E8D8',
  // Same value highlighting
  highlightBackground: '#BBDEFB',
  highlightBorder: '#64B5F6',
  // Drop target
  dropTargetBackground: '#C8E6C9',
  dropTargetBorder: '#4CAF50',
};

// ============================================
// TYPES
// ============================================

interface SudokuCellProps {
  cell: CellType;
  isSelected: boolean;
  isHighlighted?: boolean;
  isInSelectedZone?: boolean;
  onPress: () => void;
  cellSize: number;
  showConflict: boolean;
  triggerSuccess?: boolean;
  triggerError?: boolean;
  onLayout?: (layout: LayoutRectangle) => void;
}

// ============================================
// COMPONENT
// ============================================

export function SudokuCell({
  cell,
  isSelected,
  isHighlighted = false,
  isInSelectedZone = false,
  onPress,
  cellSize,
  showConflict,
  triggerSuccess = false,
  triggerError = false,
  onLayout,
}: SudokuCellProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);
  const { dragState, startDrag, updateDragPosition, endDrag, dropTarget, setDropTarget } = useDragDrop();

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const zIndex = useSharedValue(1);

  const cellRef = useRef<View>(null);
  const layoutRef = useRef<LayoutRectangle | null>(null);

  // Check if this cell is a drop target
  const isDropTarget = dropTarget?.row === cell.row && dropTarget?.col === cell.col;

  // Check if drag is over this cell
  useEffect(() => {
    if (dragState.isDragging && layoutRef.current) {
      const { x, y, width, height } = layoutRef.current;
      const dragX = dragState.position.x;
      const dragY = dragState.position.y;

      // Check if drag position is within cell bounds
      if (
        dragX >= x &&
        dragX <= x + width &&
        dragY >= y &&
        dragY <= y + height
      ) {
        // Only set as drop target if cell is empty or different from source
        if (!cell.isFixed && (cell.value === null ||
          (dragState.sourceType === 'cell' &&
           (dragState.sourceCell?.row !== cell.row || dragState.sourceCell?.col !== cell.col)))) {
          setDropTarget({ row: cell.row, col: cell.col });
        }
      }
    }
  }, [dragState.isDragging, dragState.position, cell, setDropTarget]);

  // Success animation
  useEffect(() => {
    if (triggerSuccess && cell.value !== null && !cell.isFixed) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );

      if (hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [triggerSuccess]);

  // Error animation
  useEffect(() => {
    if (triggerError) {
      translateX.value = withSequence(
        withTiming(-5, { duration: 50, easing: Easing.linear }),
        withTiming(5, { duration: 100, easing: Easing.linear }),
        withTiming(-5, { duration: 100, easing: Easing.linear }),
        withTiming(5, { duration: 100, easing: Easing.linear }),
        withTiming(0, { duration: 50, easing: Easing.linear })
      );

      if (hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [triggerError]);

  const handleLayout = () => {
    if (cellRef.current) {
      cellRef.current.measureInWindow((x, y, width, height) => {
        layoutRef.current = { x, y, width, height };
        if (onLayout) {
          onLayout({ x, y, width, height });
        }
      });
    }
  };

  // Tap gesture for selection
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      scale.value = withSequence(
        withSpring(0.95, { duration: 100 }),
        withSpring(1, { duration: 100 })
      );
    })
    .onEnd(() => {
      if (hapticEnabled) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
      runOnJS(onPress)();
    });

  // Pan gesture for drag (only for non-fixed cells with values)
  const canDrag = !cell.isFixed && cell.value !== null;

  const panGesture = Gesture.Pan()
    .enabled(canDrag)
    .activateAfterLongPress(200)
    .onStart((event) => {
      scale.value = withSpring(1.15);
      zIndex.value = 1000;

      if (hapticEnabled) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }

      runOnJS(startDrag)(
        cell.value,
        'cell',
        { row: cell.row, col: cell.col },
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
      zIndex.value = 1;

      runOnJS(endDrag)();
    });

  const composedGesture = canDrag
    ? Gesture.Race(panGesture, tapGesture)
    : tapGesture;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    zIndex: zIndex.value,
  }));

  const hasConflict = showConflict && cell.hasConflict && cell.value !== null;

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        ref={cellRef}
        onLayout={handleLayout}
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
          },
          // Fixed cells base styling
          cell.isFixed && styles.fixedCell,
          // Zone highlighting (row/col/box) - applies on top of fixed
          isInSelectedZone && !isSelected && (cell.isFixed ? styles.zoneCellFixed : styles.zoneCell),
          // Same value highlighting - highest visual priority for identification
          isHighlighted && !isSelected && styles.highlightedCell,
          // Selected cell (current selection)
          isSelected && styles.selectedCell,
          // Drop target highlighting
          isDropTarget && styles.dropTargetCell,
          // Conflict highlighting
          hasConflict && styles.conflictCell,
          animatedStyle,
        ]}
      >
        {cell.value !== null ? (
          <Text
            style={[
              styles.value,
              cell.isFixed ? styles.fixedValue : styles.userValue,
              hasConflict && styles.conflictValue,
              { fontSize: cellSize * 0.5 },
            ]}
          >
            {cell.value}
          </Text>
        ) : (
          cell.annotations.length > 0 && (
            <View style={styles.annotationsContainer}>
              {cell.annotations.map((annotation, index) => (
                <Text
                  key={index}
                  style={[
                    styles.annotation,
                    { fontSize: cellSize * 0.2 },
                  ]}
                >
                  {annotation}
                </Text>
              ))}
            </View>
          )
        )}
      </Animated.View>
    </GestureDetector>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  cell: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  zoneCell: {
    backgroundColor: SUDOKU_COLORS.zoneBackground,
    borderColor: SUDOKU_COLORS.zoneBorder,
  },
  zoneCellFixed: {
    backgroundColor: SUDOKU_COLORS.zoneFixedBackground,
  },
  highlightedCell: {
    backgroundColor: SUDOKU_COLORS.highlightBackground,
    borderColor: SUDOKU_COLORS.highlightBorder,
    borderWidth: 2,
  },
  fixedCell: {
    backgroundColor: colors.sudoku.cellFixed,
  },
  selectedCell: {
    backgroundColor: colors.sudoku.cellSelected,
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  dropTargetCell: {
    backgroundColor: SUDOKU_COLORS.dropTargetBackground,
    borderColor: SUDOKU_COLORS.dropTargetBorder,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  conflictCell: {
    backgroundColor: colors.sudoku.cellConflict,
    borderColor: colors.sudoku.symbolConflict,
    borderWidth: 2,
  },
  value: {
    textAlign: 'center',
    fontWeight: '600',
  },
  fixedValue: {
    color: colors.sudoku.symbolFixed,
    fontWeight: '700',
  },
  userValue: {
    color: colors.sudoku.symbolPrimary,
    fontWeight: '600',
  },
  conflictValue: {
    color: colors.sudoku.symbolConflict,
  },
  annotationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    gap: 2,
  },
  annotation: {
    color: colors.text.muted,
    fontSize: 10,
  },
});
