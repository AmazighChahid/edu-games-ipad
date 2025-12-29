/**
 * GridCell Component
 *
 * Une cellule interactive de la grille logique
 * Refactorisé avec theme, Icons et touch targets
 */

import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';

import { theme } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import type { CellState } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface GridCellProps {
  /** État de la cellule */
  state: CellState;
  /** Est sélectionnée */
  isSelected: boolean;
  /** Est en erreur */
  isError: boolean;
  /** Est mise en évidence par un indice */
  isHighlighted: boolean;
  /** Callback au press */
  onPress: () => void;
  /** Taille de la cellule */
  size: number;
  /** Désactivé */
  disabled?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STATE_DISPLAY: Record<CellState, { text: string; color: string; bg: string }> = {
  empty: { text: '', color: 'transparent', bg: theme.colors.background.card },
  yes: { text: Icons.checkmark, color: '#4CAF50', bg: '#E8F5E9' },
  no: { text: Icons.crossMark, color: '#F44336', bg: '#FFEBEE' },
};

// Taille minimum pour les cellules (64dp touch target)
const MIN_CELL_SIZE = 64;

// ============================================================================
// COMPONENT
// ============================================================================

export function GridCell({
  state,
  isSelected,
  isError,
  isHighlighted,
  onPress,
  size,
  disabled = false,
}: GridCellProps) {
  const { springConfig } = useAccessibilityAnimations();

  // Garantir une taille minimum de 64dp pour les touch targets
  const cellSize = Math.max(size, MIN_CELL_SIZE);

  // Animation values
  const scale = useSharedValue(1);

  // Gérer le press
  const handlePress = () => {
    if (disabled) return;

    // Animation de feedback
    scale.value = withSequence(
      withSpring(0.9, springConfig),
      withSpring(1, springConfig)
    );

    onPress();
  };

  // Style animé
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Couleurs basées sur l'état
  const display = STATE_DISPLAY[state];
  const borderColor = isSelected
    ? theme.colors.primary.main
    : isError
    ? '#F44336'
    : isHighlighted
    ? '#FFD700'
    : 'rgba(0,0,0,0.1)';
  const borderWidth = isSelected || isError || isHighlighted ? 3 : 1;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={
        state === 'empty'
          ? 'Case vide'
          : state === 'yes'
          ? 'Case marquée oui'
          : 'Case marquée non'
      }
      accessibilityState={{ disabled, selected: isSelected }}
    >
      <Animated.View
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
            minWidth: MIN_CELL_SIZE,
            minHeight: MIN_CELL_SIZE,
            backgroundColor: isHighlighted ? '#FFFDE7' : display.bg,
            borderColor,
            borderWidth,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.cellText,
            {
              color: display.color,
              fontSize: Math.max(cellSize * 0.5, 20), // Min 20pt pour lisibilité
            },
          ]}
        >
          {display.text}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    margin: 1,
  },
  cellText: {
    fontWeight: '700',
    fontFamily: theme.fontFamily.bold,
  },
});

export default GridCell;
