/**
 * CrosswordCell Component
 *
 * Une cellule de la grille de mots croisés
 */

import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';

import { colors, borderRadius, fontFamily } from '../../../theme';
import { useAccessibilityAnimations } from '../../../hooks';
import type { CrosswordCell as CellType } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface CrosswordCellProps {
  /** Données de la cellule */
  cell: CellType;
  /** Taille de la cellule */
  size: number;
  /** Est sélectionnée */
  isSelected: boolean;
  /** Est dans le mot sélectionné */
  isInSelectedWord: boolean;
  /** Callback au press */
  onPress: () => void;
  /** Désactivé */
  disabled?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CrosswordCell({
  cell,
  size,
  isSelected,
  isInSelectedWord,
  onPress,
  disabled = false,
}: CrosswordCellProps) {
  const { springConfig } = useAccessibilityAnimations();
  const scale = useSharedValue(1);

  // Ne pas afficher les cellules bloquées
  if (cell.isBlocked) {
    return (
      <View
        style={[
          styles.cell,
          styles.blockedCell,
          { width: size, height: size },
        ]}
      />
    );
  }

  // Gérer le press
  const handlePress = () => {
    if (disabled) return;

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

  // Déterminer la couleur de fond
  const backgroundColor = isSelected
    ? colors.primary.light
    : isInSelectedWord
    ? '#E3F2FD'
    : cell.isRevealed
    ? '#E8F5E9'
    : colors.background.card;

  // Vérifier si la lettre est correcte
  const isCorrect = cell.userLetter === cell.letter;
  const textColor = cell.isRevealed
    ? '#4CAF50'
    : cell.userLetter && !isCorrect
    ? colors.text.primary
    : colors.text.primary;

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View
        style={[
          styles.cell,
          {
            width: size,
            height: size,
            backgroundColor,
            borderColor: isSelected
              ? colors.primary.main
              : isInSelectedWord
              ? colors.primary.light
              : 'rgba(0,0,0,0.1)',
            borderWidth: isSelected ? 2 : 1,
          },
          animatedStyle,
        ]}
      >
        {/* Numéro de mot */}
        {cell.wordNumber && (
          <Text style={styles.wordNumber}>{cell.wordNumber}</Text>
        )}

        {/* Lettre */}
        <Text
          style={[
            styles.letter,
            {
              fontSize: size * 0.5,
              color: textColor,
            },
          ]}
        >
          {cell.userLetter}
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
    borderRadius: borderRadius.xs,
    margin: 1,
    position: 'relative',
  },
  blockedCell: {
    backgroundColor: '#2C3E50',
  },
  wordNumber: {
    position: 'absolute',
    top: 2,
    left: 3,
    fontSize: 8,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  letter: {
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export default CrosswordCell;
