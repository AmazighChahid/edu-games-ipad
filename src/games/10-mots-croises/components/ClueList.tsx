/**
 * ClueList Component
 *
 * Liste des définitions/indices pour les mots croisés
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows, fontFamily } from '../../../theme';
import { useAccessibilityAnimations } from '../../../hooks';
import type { CrosswordWord } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface ClueListProps {
  /** Mots horizontaux */
  horizontalWords: CrosswordWord[];
  /** Mots verticaux */
  verticalWords: CrosswordWord[];
  /** IDs des mots complétés */
  completedWordIds: string[];
  /** ID du mot sélectionné */
  selectedWordId: string | null;
  /** Callback sélection d'un mot */
  onWordSelect: (wordId: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ClueList({
  horizontalWords,
  verticalWords,
  completedWordIds,
  selectedWordId,
  onWordSelect,
}: ClueListProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

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
          onPress={() => onWordSelect(word.id)}
        >
          <View style={styles.clueNumber}>
            <Text style={styles.clueNumberText}>{word.number}</Text>
          </View>
          <View style={styles.clueContent}>
            <Text
              style={[
                styles.clueText,
                isCompleted && styles.clueTextCompleted,
              ]}
            >
              {word.emoji && `${word.emoji} `}{word.clue}
            </Text>
          </View>
          {isCompleted && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
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
            <Text style={styles.sectionTitle}>→ Horizontal</Text>
          </View>
          {horizontalWords.map((word, index) => renderClue(word, index))}
        </View>
      )}

      {/* Vertical */}
      {verticalWords.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>↓ Vertical</Text>
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
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  clueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing[2],
    marginBottom: spacing[2],
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[2],
  },
  clueNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  clueContent: {
    flex: 1,
  },
  clueText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  clueTextCompleted: {
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default ClueList;
