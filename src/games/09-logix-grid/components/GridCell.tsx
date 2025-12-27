/**
 * GridCell Component
 *
 * Une cellule interactive de la grille logique
 */

import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, borderRadius } from '@/theme';
import { useAccessibilityAnimations } from '@/hooks';
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
  empty: { text: '', color: 'transparent', bg: colors.background.card },
  yes: { text: '✓', color: '#4CAF50', bg: '#E8F5E9' },
  no: { text: '✗', color: '#F44336', bg: '#FFEBEE' },
};

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
  const { springConfig, getDuration } = useAccessibilityAnimations();

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
    ? colors.primary.main
    : isError
    ? '#F44336'
    : isHighlighted
    ? '#FFD700'
    : 'rgba(0,0,0,0.1)';
  const borderWidth = isSelected || isError || isHighlighted ? 3 : 1;

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View
        style={[
          styles.cell,
          {
            width: size,
            height: size,
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
              fontSize: size * 0.5,
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
    borderRadius: borderRadius.sm,
    margin: 1,
  },
  cellText: {
    fontWeight: '700',
  },
});

export default GridCell;
