/**
 * SudokuCell Component
 * Individual cell in the Sudoku grid with animations
 */

import { Pressable, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';

import { colors, spacing, textStyles, borderRadius } from '../../../theme';
import { useStore } from '../../../store';
import type { SudokuCell as CellType, SudokuValue } from '../types';

interface SudokuCellProps {
  cell: CellType;
  isSelected: boolean;
  onPress: () => void;
  cellSize: number;
  showConflict: boolean;
  triggerSuccess?: boolean; // Trigger success animation
  triggerError?: boolean; // Trigger error shake animation
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SudokuCell({
  cell,
  isSelected,
  onPress,
  cellSize,
  showConflict,
  triggerSuccess = false,
  triggerError = false,
}: SudokuCellProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  // Success animation (pop effect)
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

  // Error animation (shake effect)
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

  const handlePress = () => {
    if (cell.isFixed) return; // Cannot select fixed cells

    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    scale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));

  const hasConflict = showConflict && cell.hasConflict && cell.value !== null;

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
        },
        cell.isFixed && styles.fixedCell,
        isSelected && !cell.isFixed && styles.selectedCell,
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
            // Scale text size based on cell size
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
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  fixedCell: {
    backgroundColor: colors.sudoku.cellFixed, // Cream background for fixed cells
  },
  selectedCell: {
    backgroundColor: colors.sudoku.cellSelected,
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  conflictCell: {
    backgroundColor: colors.sudoku.cellConflict, // Orange doux, not aggressive red
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
    color: colors.sudoku.symbolConflict, // Orange/yellow, not aggressive red
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
