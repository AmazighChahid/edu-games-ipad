/**
 * LevelCard Component
 *
 * Carte de niveau unifiée pour tous les jeux éducatifs.
 * Affiche : barres de difficulté, numéro, pétales/étoiles, badge de complétion.
 *
 * @example
 * <LevelCard level={level} isSelected={isSelected} />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../../theme';
import { PetalsIndicator } from './PetalsIndicator';
import type { LevelConfig } from './GameIntroTemplate.types';

// ============================================
// TYPES
// ============================================

export interface LevelCardProps {
  /** Configuration du niveau */
  level: LevelConfig;
  /** Le niveau est-il sélectionné ? */
  isSelected: boolean;
}

// ============================================
// CONSTANTS
// ============================================

// Mapping difficulté → nombre de barres (1-3)
const getDifficultyLevel = (difficulty: LevelConfig['difficulty']): 1 | 2 | 3 => {
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
};

// Couleurs des barres de difficulté
const DIFFICULTY_BAR_COLORS = {
  easy: '#7BC74D',    // Vert
  medium: '#FFB347',  // Orange
  hard: '#FF6B6B',    // Rouge
  empty: '#E0E0E0',   // Gris
};

// Couleurs du gradient pour carte sélectionnée
const SELECTED_GRADIENT_COLORS = ['#5B8DEE', '#4A7BD9'] as const;

// ============================================
// COMPONENT
// ============================================

export const LevelCard: React.FC<LevelCardProps> = ({ level, isSelected }) => {
  const difficultyLevel = getDifficultyLevel(level.difficulty);

  // Rendu des barres de difficulté
  const renderDifficultyBars = () => {
    const bars = [
      { height: 14, filled: difficultyLevel >= 1, color: DIFFICULTY_BAR_COLORS.easy },
      { height: 21, filled: difficultyLevel >= 2, color: DIFFICULTY_BAR_COLORS.medium },
      { height: 28, filled: difficultyLevel >= 3, color: DIFFICULTY_BAR_COLORS.hard },
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
                : { backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : DIFFICULTY_BAR_COLORS.empty },
            ]}
          />
        ))}
      </View>
    );
  };

  // Rendu des pétales (score)
  const renderPetals = () => (
    <PetalsIndicator
      filledCount={(level.stars || 0) as 0 | 1 | 2 | 3}
      size="small"
      isSelected={isSelected}
    />
  );

  // Contenu de la carte
  const cardContent = (
    <>
      {renderDifficultyBars()}
      <Text
        style={[
          styles.levelNumber,
          isSelected && styles.levelNumberSelected,
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? level.number : '🔒'}
      </Text>
      {level.isUnlocked && renderPetals()}
      {level.isCompleted && !isSelected && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkBadgeText}>✓</Text>
        </View>
      )}
    </>
  );

  // Style de base de la carte
  const containerStyle = [
    styles.levelCard,
    level.isCompleted && styles.levelCardCompleted,
    !level.isUnlocked && styles.levelCardLocked,
  ];

  // Rendu avec gradient si sélectionné, sinon View normale
  if (isSelected) {
    return (
      <LinearGradient
        colors={SELECTED_GRADIENT_COLORS as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[containerStyle, styles.levelCardSelected]}
      >
        {cardContent}
      </LinearGradient>
    );
  }

  return <View style={containerStyle}>{cardContent}</View>;
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  levelCard: {
    width: 72,
    height: 100,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[2],
    borderWidth: 2,
    borderColor: theme.colors.feedback.success,
    ...theme.shadows.sm,
  },
  levelCardCompleted: {
    borderColor: theme.colors.feedback.success,
  },
  levelCardSelected: {
    borderColor: 'transparent',
    ...theme.shadows.md,
  },
  levelCardLocked: {
    opacity: 0.5,
    borderColor: theme.colors.text.muted,
  },
  difficultyBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    marginBottom: theme.spacing[1],
    height: 28,
  },
  difficultyBar: {
    width: 8,
    borderRadius: 2,
  },
  levelNumber: {
    fontSize: 28,
    fontFamily: theme.fontFamily.displayBold,
    color: theme.colors.text.primary,
    lineHeight: 32,
  },
  levelNumberSelected: {
    color: '#FFFFFF',
  },
  levelNumberLocked: {
    fontSize: 24,
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.feedback.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: theme.fontFamily.bold,
  },
});

export default LevelCard;
