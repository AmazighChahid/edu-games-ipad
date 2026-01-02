/**
 * StoryReader Component
 *
 * Affiche l'histoire paragraphe par paragraphe
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, SlideInRight, SlideInLeft } from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows, fontFamily } from '../../../theme';
import { useAccessibilityAnimations } from '../../../hooks';

// ============================================================================
// TYPES
// ============================================================================

interface StoryReaderProps {
  /** Titre de l'histoire */
  title: string;
  /** Emoji de l'histoire */
  emoji: string;
  /** Paragraphe actuel */
  paragraphText: string;
  /** Index du paragraphe */
  currentIndex: number;
  /** Total de paragraphes */
  totalParagraphs: number;
  /** Progression (0-100) */
  progress: number;
  /** Callback suivant */
  onNext: () => void;
  /** Callback précédent */
  onPrevious: () => void;
  /** Callback terminer */
  onFinish: () => void;
  /** Callback pause */
  onPause: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function StoryReader({
  title,
  emoji,
  paragraphText,
  currentIndex,
  totalParagraphs,
  progress,
  onNext,
  onPrevious,
  onFinish,
  onPause,
}: StoryReaderProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  const isFirstParagraph = currentIndex === 0;
  const isLastParagraph = currentIndex === totalParagraphs - 1;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseButtonText}>⏸️</Text>
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            {currentIndex + 1}/{totalParagraphs}
          </Text>
        </View>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
      </View>

      {/* Contenu */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={currentIndex}
          entering={
            shouldAnimate
              ? SlideInRight.duration(getDuration(300))
              : undefined
          }
          style={styles.paragraphCard}
        >
          <Text style={styles.paragraphText}>{paragraphText}</Text>
        </Animated.View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <Pressable
          style={[
            styles.navButton,
            styles.prevButton,
            isFirstParagraph && styles.navButtonDisabled,
          ]}
          onPress={onPrevious}
          disabled={isFirstParagraph}
        >
          <Text style={styles.navButtonText}>← Précédent</Text>
        </Pressable>

        {isLastParagraph ? (
          <Pressable
            style={[styles.navButton, styles.finishButton]}
            onPress={onFinish}
          >
            <Text style={styles.finishButtonText}>C'est parti ! →</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.navButton, styles.nextButton]}
            onPress={onNext}
          >
            <Text style={styles.nextButtonText}>Suivant →</Text>
          </Pressable>
        )}
      </View>

      {/* Conseil */}
      <View style={styles.tipContainer}>
        <Text style={styles.tipText}>
          💡 Lis attentivement, des questions t'attendent !
        </Text>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  pauseButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  pauseButtonText: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  pageIndicator: {
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.round,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.main,
  },
  progressContainer: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary.main,
    borderRadius: borderRadius.round,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing[4],
  },
  paragraphCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    ...shadows.lg,
  },
  paragraphText: {
    fontSize: 20,
    lineHeight: 32,
    color: colors.text.primary,
    fontFamily: fontFamily.medium,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  navButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  prevButton: {
    backgroundColor: colors.background.card,
  },
  nextButton: {
    backgroundColor: colors.primary.main,
  },
  finishButton: {
    backgroundColor: colors.secondary.main,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '700',
  },
  finishButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '700',
  },
  tipContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
});

export default StoryReader;
