/**
 * ChasseurLevelCard component
 * Carte de niveau personnalisée pour le Chasseur de Papillons
 * Affiche la difficulté avec des barres et les étoiles obtenues
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { type LevelConfig, PetalsIndicator } from '../../../components/common';
import { colors, spacing, borderRadius, shadows, fontFamily } from '../../../theme';

// ============================================
// TYPES
// ============================================

interface ChasseurLevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const DIFFICULTY_COLORS = {
  easy: colors.feedback.success,    // Vert
  medium: colors.feedback.warning,  // Orange
  hard: colors.feedback.error,      // Rouge
  empty: colors.background.tertiary,
};

const THEME_COLORS = {
  primary: '#9B59B6',      // Violet papillon
  primaryDark: '#8E44AD',
  primaryLight: '#F3E5F5',
  primaryBorder: '#CE93D8',
  selectedBorder: '#7B1FA2',
};

// ============================================
// HELPERS
// ============================================

function getDifficultyLevel(difficulty: LevelConfig['difficulty']): 1 | 2 | 3 {
  switch (difficulty) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    case 'hard':
    case 'expert':
      return 3;
    default:
      return 1;
  }
}

// ============================================
// COMPONENT
// ============================================

function ChasseurLevelCardPure({ level, isSelected }: ChasseurLevelCardProps) {
  const difficultyLevel = getDifficultyLevel(level.difficulty);

  // Memoize les barres de difficulté
  const difficultyBars = useMemo(() => {
    const bars = [
      { height: 14, filled: difficultyLevel >= 1, color: DIFFICULTY_COLORS.easy },
      { height: 21, filled: difficultyLevel >= 2, color: DIFFICULTY_COLORS.medium },
      { height: 28, filled: difficultyLevel >= 3, color: DIFFICULTY_COLORS.hard },
    ];

    return (
      <View style={styles.difficultyBarsContainer}>
        {bars.map((bar, index) => (
          <View
            key={index}
            style={[
              styles.difficultyBar,
              { height: bar.height },
              bar.filled
                ? { backgroundColor: isSelected ? '#FFFFFF' : bar.color }
                : { backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : DIFFICULTY_COLORS.empty },
            ]}
          />
        ))}
      </View>
    );
  }, [difficultyLevel, isSelected]);

  // Contenu de la carte
  const cardContent = (
    <>
      {difficultyBars}
      <Text
        style={[
          styles.levelNumber,
          isSelected && styles.levelNumberSelected,
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? level.number : '🔒'}
      </Text>
      {level.isUnlocked && (
        <PetalsIndicator
          filledCount={(level.stars || 0) as 0 | 1 | 2 | 3}
          size="small"
          isSelected={isSelected}
        />
      )}
      {level.isCompleted && !isSelected && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkBadgeText}>✓</Text>
        </View>
      )}
    </>
  );

  // Style du container
  const containerStyle = [
    styles.levelCard,
    level.isCompleted && styles.levelCardCompleted,
    !level.isUnlocked && styles.levelCardLocked,
  ];

  // Rendu avec gradient si sélectionné
  if (isSelected) {
    return (
      <LinearGradient
        colors={[THEME_COLORS.primary, THEME_COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[containerStyle, styles.levelCardSelected]}
      >
        {cardContent}
      </LinearGradient>
    );
  }

  return <View style={containerStyle}>{cardContent}</View>;
}

// ============================================
// MEMOIZATION
// ============================================

export const ChasseurLevelCard = React.memo(ChasseurLevelCardPure);

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  levelCard: {
    width: 80,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    borderColor: THEME_COLORS.primaryLight,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
    ...shadows.md,
    overflow: 'visible',
  },
  levelCardCompleted: {
    borderColor: THEME_COLORS.primaryBorder,
  },
  levelCardSelected: {
    borderColor: THEME_COLORS.selectedBorder,
    shadowColor: THEME_COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  levelCardLocked: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.background.tertiary,
    opacity: 0.6,
  },

  // Barres de difficulté
  difficultyBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 24,
    marginBottom: 6,
  },
  difficultyBar: {
    width: 8,
    borderRadius: 4,
  },

  // Numéro de niveau
  levelNumber: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.secondary,
    lineHeight: 28,
  },
  levelNumberSelected: {
    color: '#FFFFFF',
  },
  levelNumberLocked: {
    fontSize: 28,
  },

  // Badge de complétion
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...shadows.sm,
  },
  checkBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default ChasseurLevelCard;
