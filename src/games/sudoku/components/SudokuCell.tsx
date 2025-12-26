/**
 * SudokuCell Component
 * Individual cell in the Sudoku grid
 */

import { Pressable, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { useStore } from '@/store/useStore';
import type { SudokuCell as CellType, SudokuValue } from '../types';

interface SudokuCellProps {
  cell: CellType;
  isSelected: boolean;
  onPress: () => void;
  cellSize: number;
  showConflict: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SudokuCell({
  cell,
  isSelected,
  onPress,
  cellSize,
  showConflict,
}: SudokuCellProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);
  const scale = useSharedValue(1);

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
    transform: [{ scale: scale.value }],
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
