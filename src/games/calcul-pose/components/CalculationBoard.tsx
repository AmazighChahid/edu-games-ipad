/**
 * CalculationBoard component
 * Displays the written calculation layout (like on paper)
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { spacing, borderRadius, shadows } from '@/theme/spacing';
import type { CalculPoseGameState, DigitCell, Operation } from '../types';
import { getOperationSymbol } from '../logic/calculEngine';

interface CalculationBoardProps {
  gameState: CalculPoseGameState;
  onCellPress: (cellId: string) => void;
  selectedCellId: string | null;
}

interface DigitCellProps {
  cell: DigitCell;
  isSelected: boolean;
  onPress: () => void;
}

function DigitCellView({ cell, isSelected, onPress }: DigitCellProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (cell.isEditable) {
      scale.value = withSpring(0.95);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getCellStyle = () => {
    if (!cell.isEditable) {
      return styles.cellGiven;
    }
    if (isSelected) {
      return styles.cellSelected;
    }
    if (cell.isCorrect === true) {
      return styles.cellCorrect;
    }
    if (cell.isCorrect === false) {
      return styles.cellIncorrect;
    }
    return styles.cellEditable;
  };

  const getTextStyle = () => {
    if (!cell.isEditable) {
      return styles.cellTextGiven;
    }
    if (cell.isCorrect === true) {
      return styles.cellTextCorrect;
    }
    if (cell.isCorrect === false) {
      return styles.cellTextIncorrect;
    }
    return styles.cellTextEditable;
  };

  const displayValue = cell.userValue !== null ? cell.userValue.toString() : '';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!cell.isEditable}
    >
      <Animated.View style={[styles.cell, getCellStyle(), animatedStyle]}>
        <Text style={[styles.cellText, getTextStyle()]}>{displayValue}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function CalculationBoard({
  gameState,
  onCellPress,
  selectedCellId,
}: CalculationBoardProps) {
  const { problem, cells } = gameState;
  const operation = problem.operation;

  // Group cells by row
  const operand1Cells = cells.filter(c => c.row === 0).sort((a, b) => b.column - a.column);
  const operand2Cells = cells.filter(c => c.row === 1).sort((a, b) => b.column - a.column);
  const resultCells = cells.filter(c => c.row === 2).sort((a, b) => b.column - a.column);

  const maxColumns = Math.max(
    operand1Cells.length,
    operand2Cells.length,
    resultCells.length
  );

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      {/* Background paper effect */}
      <View style={styles.paper}>
        {/* Operand 1 row */}
        <View style={styles.row}>
          <View style={styles.operatorPlaceholder} />
          {operand1Cells.map(cell => (
            <DigitCellView
              key={cell.id}
              cell={cell}
              isSelected={cell.id === selectedCellId}
              onPress={() => onCellPress(cell.id)}
            />
          ))}
        </View>

        {/* Operand 2 row with operation symbol */}
        <View style={styles.row}>
          <View style={styles.operatorContainer}>
            <Text style={styles.operatorText}>
              {getOperationSymbol(operation)}
            </Text>
          </View>
          {operand2Cells.map(cell => (
            <DigitCellView
              key={cell.id}
              cell={cell}
              isSelected={cell.id === selectedCellId}
              onPress={() => onCellPress(cell.id)}
            />
          ))}
        </View>

        {/* Divider line */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
        </View>

        {/* Result row */}
        <View style={styles.row}>
          <View style={styles.operatorPlaceholder} />
          {resultCells.map(cell => (
            <DigitCellView
              key={cell.id}
              cell={cell}
              isSelected={cell.id === selectedCellId}
              onPress={() => onCellPress(cell.id)}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const CELL_SIZE = 80;
const CELL_GAP = 8;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#FFFDE7', // Light yellow like paper
    padding: spacing[6],
    borderRadius: borderRadius.lg,
    ...shadows.lg,
    borderWidth: 2,
    borderColor: '#E0D8B0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: spacing[2],
  },
  operatorContainer: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: CELL_GAP,
  },
  operatorPlaceholder: {
    width: CELL_SIZE,
    marginRight: CELL_GAP,
  },
  operatorText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[2],
  },
  divider: {
    flex: 1,
    height: 4,
    backgroundColor: colors.text.primary,
    borderRadius: 2,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: CELL_GAP / 2,
    borderRadius: borderRadius.md,
    borderWidth: 3,
  },
  cellGiven: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  cellEditable: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.text.muted,
    borderStyle: 'dashed',
  },
  cellSelected: {
    backgroundColor: colors.primary.light + '30',
    borderColor: colors.primary.main,
    borderStyle: 'solid',
  },
  cellCorrect: {
    backgroundColor: colors.feedback.successLight,
    borderColor: colors.feedback.success,
    borderStyle: 'solid',
  },
  cellIncorrect: {
    backgroundColor: colors.feedback.errorLight,
    borderColor: colors.feedback.error,
    borderStyle: 'solid',
  },
  cellText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  cellTextGiven: {
    color: colors.text.primary,
  },
  cellTextEditable: {
    color: colors.text.secondary,
  },
  cellTextCorrect: {
    color: colors.feedback.success,
  },
  cellTextIncorrect: {
    color: colors.feedback.error,
  },
});
