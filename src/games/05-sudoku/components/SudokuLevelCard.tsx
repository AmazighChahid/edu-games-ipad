/**
 * SudokuLevelCard Component
 * Carte de niveau personnalisée pour le Sudoku
 * Affiche la taille de grille, le thème et les étoiles
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily, touchTargets } from '@/theme';
import { useStore } from '@/store';
import { Icons } from '@/constants/icons';
import type { SudokuLevelConfig, SudokuSize, SudokuDifficulty } from '../types';
import { THEME_PREVIEW_EMOJIS } from '../data/levels';

// ============================================
// TYPES
// ============================================

interface SudokuLevelCardProps {
  level: SudokuLevelConfig;
  isSelected: boolean;
  onPress: () => void;
}

// ============================================
// CONSTANTS
// ============================================

/** Couleurs pour les difficultés */
const DIFFICULTY_COLORS: Record<SudokuDifficulty, string> = {
  1: colors.feedback.success,    // Vert - Découverte
  2: colors.secondary.main,      // Orange - Défi
  3: colors.primary.main,        // Bleu - Expert
};

/** Labels pour les difficultés */
const DIFFICULTY_LABELS: Record<SudokuDifficulty, string> = {
  1: 'Découverte',
  2: 'Défi',
  3: 'Expert',
};

/** Labels pour les tailles de grille */
const SIZE_LABELS: Record<SudokuSize, string> = {
  4: '4×4',
  6: '6×6',
  9: '9×9',
};

/** Couleurs pour les tailles de grille (spécifiques Sudoku) */
const SIZE_COLORS: Record<SudokuSize, string> = {
  4: '#A8E6CF', // Vert clair - Facile
  6: '#FFE082', // Jaune - Moyen
  9: '#FFAB91', // Orange clair - Difficile
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ============================================
// COMPONENT
// ============================================

export function SudokuLevelCard({
  level,
  isSelected,
  onPress,
}: SudokuLevelCardProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (!level.isUnlocked) return;
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const difficultyColor = DIFFICULTY_COLORS[level.difficulty];
  const themePreview = THEME_PREVIEW_EMOJIS[level.theme];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!level.isUnlocked}
      style={[
        styles.card,
        animatedStyle,
        level.isCompleted && styles.cardCompleted,
        isSelected && styles.cardSelected,
        !level.isUnlocked && styles.cardLocked,
        isSelected && { borderColor: difficultyColor },
      ]}
      accessible
      accessibilityLabel={`Niveau ${level.number}, grille ${SIZE_LABELS[level.size]}, ${
        level.isCompleted ? 'complété' : level.isUnlocked ? 'disponible' : 'verrouillé'
      }`}
      accessibilityRole="button"
    >
      {/* Étoiles (si niveau complété) */}
      {level.isCompleted && level.stars !== undefined && (
        <View style={styles.starsContainer}>
          {[1, 2, 3].map((star) => (
            <Text
              key={star}
              style={[
                styles.star,
                star <= (level.stars || 0) ? styles.starFilled : styles.starEmpty,
              ]}
            >
              {star <= (level.stars || 0) ? Icons.starFull : Icons.starEmpty}
            </Text>
          ))}
        </View>
      )}

      {/* Numéro du niveau */}
      <Text
        style={[
          styles.levelNumber,
          isSelected && { color: difficultyColor },
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? level.number : Icons.lock}
      </Text>

      {/* Taille de grille */}
      <View style={[styles.sizeBadge, { backgroundColor: SIZE_COLORS[level.size] }]}>
        <Text style={styles.sizeText}>{SIZE_LABELS[level.size]}</Text>
      </View>

      {/* Aperçu thème */}
      {level.isUnlocked && (
        <Text style={styles.themePreview}>{themePreview}</Text>
      )}

      {/* Badge de difficulté */}
      <View
        style={[
          styles.difficultyBadge,
          { backgroundColor: level.isUnlocked ? difficultyColor : colors.text.muted },
        ]}
      >
        <Text style={styles.difficultyText}>
          {level.isUnlocked ? DIFFICULTY_LABELS[level.difficulty] : 'Bloqué'}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 120,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[2],
    ...shadows.md,
    // Touch target minimum
    minWidth: touchTargets.minimum,
    minHeight: touchTargets.minimum,
  },
  cardCompleted: {
    backgroundColor: colors.feedback.successLight,
    borderColor: colors.feedback.success,
  },
  cardSelected: {
    borderWidth: 3,
    ...shadows.lg,
  },
  cardLocked: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.ui.border,
    opacity: 0.6,
  },

  // Étoiles
  starsContainer: {
    position: 'absolute',
    top: spacing[1],
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 14,
  },
  starFilled: {
    color: colors.feedback.warning,
  },
  starEmpty: {
    color: colors.ui.border,
    opacity: 0.4,
  },

  // Numéro
  levelNumber: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  levelNumberLocked: {
    opacity: 0.5,
  },

  // Taille grille
  sizeBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.sm,
    marginBottom: spacing[1],
  },
  sizeText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: colors.text.primary,
  },

  // Thème
  themePreview: {
    fontSize: 10,
    letterSpacing: -2,
    marginBottom: spacing[1],
  },

  // Difficulté
  difficultyBadge: {
    position: 'absolute',
    bottom: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.full,
  },
  difficultyText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    color: colors.text.inverse,
    textTransform: 'uppercase',
  },
});

export default SudokuLevelCard;
