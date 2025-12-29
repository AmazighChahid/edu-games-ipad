/**
 * CrosswordCell Component
 *
 * Une cellule de la grille de mots croisés avec système SUTOM
 * Les couleurs indiquent automatiquement le statut de chaque lettre :
 * - Vert : lettre correcte et bien placée
 * - Orange : lettre présente mais mal placée
 * - Rouge : lettre absente du mot
 *
 * Refactorisé pour utiliser les Icons centralisés et respecter les guidelines UX
 */

import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';

import { colors, borderRadius, fontFamily, fontSize } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import type { CrosswordCell as CellType, LetterStatus } from '../types';

// ============================================================================
// SUTOM COLORS
// ============================================================================

/**
 * Couleurs SUTOM selon le design system avec icons centralisés
 */
const SUTOM_COLORS: Record<LetterStatus, { background: string; border: string; icon: string }> = {
  correct: {
    background: '#E8F5E9', // Vert clair
    border: '#4CAF50', // Vert (success)
    icon: Icons.check,
  },
  misplaced: {
    background: '#FFF3E0', // Orange clair
    border: '#FF9800', // Orange
    icon: Icons.swap,
  },
  absent: {
    background: '#FFEBEE', // Rouge clair
    border: '#F44336', // Rouge
    icon: Icons.crossMark,
  },
  neutral: {
    background: colors.background.card,
    border: 'rgba(0,0,0,0.1)',
    icon: '',
  },
};

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

  // Style animé - doit être appelé AVANT tout return conditionnel
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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

  // Obtenir les couleurs SUTOM selon le statut
  const sutomStatus = cell.letterStatus || 'neutral';
  const sutomColors = SUTOM_COLORS[sutomStatus];

  // Déterminer la couleur de fond
  // PRIORITÉ : couleurs SUTOM > sélection (on garde toujours les couleurs SUTOM visibles)
  const backgroundColor = cell.isRevealed
    ? '#E8F5E9'
    : cell.userLetter && sutomStatus !== 'neutral'
    ? sutomColors.background // Couleur SUTOM prioritaire
    : isSelected
    ? colors.primary.light
    : isInSelectedWord
    ? '#E3F2FD'
    : colors.background.card;

  // Déterminer la couleur de bordure
  // La sélection est indiquée par une bordure bleue épaisse, mais la couleur SUTOM reste si présente
  const borderColor = isSelected
    ? colors.primary.main // Bordure bleue pour la sélection
    : cell.userLetter && sutomStatus !== 'neutral'
    ? sutomColors.border
    : isInSelectedWord
    ? colors.primary.light
    : 'rgba(0,0,0,0.1)';

  // Épaisseur de bordure : plus épaisse si sélectionné
  const borderWidth =
    isSelected ? 3 : cell.userLetter && sutomStatus !== 'neutral' ? 2 : 1;

  // Couleur du texte selon le statut
  const textColor = cell.isRevealed
    ? '#4CAF50'
    : sutomStatus === 'correct'
    ? '#2E7D32' // Vert foncé
    : sutomStatus === 'misplaced'
    ? '#E65100' // Orange foncé
    : sutomStatus === 'absent'
    ? '#C62828' // Rouge foncé
    : colors.text.primary;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={
        cell.userLetter
          ? `Lettre ${cell.userLetter}${
              sutomStatus === 'correct'
                ? ', correcte'
                : sutomStatus === 'misplaced'
                ? ', mal placée'
                : sutomStatus === 'absent'
                ? ', absente'
                : ''
            }`
          : 'Cellule vide'
      }
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.cell,
          {
            width: size,
            height: size,
            backgroundColor,
            borderColor,
            borderWidth,
          },
          animatedStyle,
        ]}
      >
        {/* Numéro de mot */}
        {cell.wordNumber && (
          <Text style={styles.wordNumber}>{cell.wordNumber}</Text>
        )}

        {/* Icône accessibilité (pour daltoniens) - en haut à droite */}
        {cell.userLetter && sutomStatus !== 'neutral' && sutomColors.icon && (
          <Text
            style={[
              styles.statusIcon,
              { color: sutomColors.border },
            ]}
            accessibilityLabel={
              sutomStatus === 'correct'
                ? 'Correct'
                : sutomStatus === 'misplaced'
                ? 'Mal placé'
                : 'Absent'
            }
          >
            {sutomColors.icon}
          </Text>
        )}

        {/* Lettre */}
        <Text
          style={[
            styles.letter,
            {
              fontSize: Math.max(fontSize.lg, size * 0.5), // Au moins 18pt
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
    fontSize: 11, // Min 10pt pour lisibilité (exception contrainte d'espace)
    fontWeight: '600',
    color: colors.text.muted,
  },
  statusIcon: {
    position: 'absolute',
    top: 2,
    right: 3,
    fontSize: 12, // Min 10pt pour lisibilité (exception contrainte d'espace)
    fontWeight: '700',
  },
  letter: {
    fontFamily: fontFamily.bold,
    textTransform: 'uppercase',
  },
});

export default CrosswordCell;
