/**
 * ClueList Component
 *
 * Liste des définitions/indices pour les mots croisés
 * Refactorisé pour respecter les guidelines UX (fontSize, icons, touch targets)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
  fontSize,
  touchTargets,
} from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import type { CrosswordWord } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface ClueListProps {
  /** Tous les mots */
  words: CrosswordWord[];
  /** IDs des mots complétés */
  completedWordIds: string[];
  /** ID du mot sélectionné */
  selectedWordId: string | null;
  /** Callback sélection d'un mot */
  onWordPress: (wordId: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ClueList({
  words,
  completedWordIds,
  selectedWordId,
  onWordPress,
}: ClueListProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  // Séparer les mots horizontaux et verticaux
  const horizontalWords = words.filter((w) => w.direction === 'horizontal');
  const verticalWords = words.filter((w) => w.direction === 'vertical');

  const renderClue = (word: CrosswordWord, index: number) => {
    const isCompleted = completedWordIds.includes(word.id);
    const isSelected = selectedWordId === word.id;

    return (
      <Animated.View
        key={word.id}
        entering={
          shouldAnimate
            ? FadeInLeft.delay(index * 50).duration(getDuration(200))
            : undefined
        }
      >
        <Pressable
          style={[
            styles.clueCard,
            isCompleted && styles.clueCardCompleted,
            isSelected && styles.clueCardSelected,
          ]}
          onPress={() => onWordPress(word.id)}
          accessibilityLabel={`${word.number}. ${word.clue}${isCompleted ? ', trouvé' : ''}`}
          accessibilityRole="button"
        >
          <View style={styles.clueNumber}>
            <Text style={styles.clueNumberText}>{word.number}</Text>
          </View>
          <View style={styles.clueContent}>
            <Text
              style={[styles.clueText, isCompleted && styles.clueTextCompleted]}
            >
              {word.emoji && `${word.emoji} `}
              {word.clue}
            </Text>
          </View>
          {isCompleted && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>{Icons.check}</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Horizontal */}
      {horizontalWords.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{Icons.arrowRight}</Text>
            <Text style={styles.sectionTitle}>Horizontal</Text>
          </View>
          {horizontalWords.map((word, index) => renderClue(word, index))}
        </View>
      )}

      {/* Vertical */}
      {verticalWords.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{Icons.arrowDown}</Text>
            <Text style={styles.sectionTitle}>Vertical</Text>
          </View>
          {verticalWords.map((word, index) =>
            renderClue(word, index + horizontalWords.length)
          )}
        </View>
      )}
    </ScrollView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    margin: spacing[2],
  },
  scrollContent: {
    padding: spacing[3],
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
    gap: spacing[2],
  },
  sectionIcon: {
    fontSize: fontSize.lg,
    color: colors.primary.main,
  },
  sectionTitle: {
    fontSize: fontSize.lg, // 18pt minimum
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  clueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    marginBottom: spacing[2],
    minHeight: touchTargets.small, // Au moins 44dp de hauteur
    ...shadows.sm,
  },
  clueCardCompleted: {
    backgroundColor: '#E8F5E9',
    opacity: 0.8,
  },
  clueCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  clueNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  clueNumberText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: '#FFF',
  },
  clueContent: {
    flex: 1,
  },
  clueText: {
    fontSize: fontSize.base, // 16pt
    color: colors.text.primary,
    lineHeight: 22,
  },
  clueTextCompleted: {
    color: colors.text.muted,
    textDecorationLine: 'line-through',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.feedback.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
  checkmarkText: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default ClueList;
