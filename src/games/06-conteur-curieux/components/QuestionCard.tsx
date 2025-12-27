/**
 * QuestionCard Component
 *
 * Affiche une question avec ses options de réponse
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows, fontFamily } from '@/theme';
import { useAccessibilityAnimations } from '@/hooks';
import type { StoryQuestion, AnswerOption } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface QuestionCardProps {
  /** Question */
  question: StoryQuestion;
  /** Index de la question */
  questionIndex: number;
  /** Total de questions */
  totalQuestions: number;
  /** Option sélectionnée */
  selectedOptionId: string | null;
  /** Indice affiché */
  showingHint: boolean;
  /** Callback sélection */
  onSelectOption: (optionId: string) => void;
  /** Callback validation */
  onValidate: () => void;
  /** Callback indice */
  onRequestHint: () => void;
  /** Indices restants */
  hintsRemaining: number;
  /** Callback pause */
  onPause: () => void;
}

// ============================================================================
// OPTION BUTTON COMPONENT
// ============================================================================

interface OptionButtonProps {
  option: AnswerOption;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

function OptionButton({ option, isSelected, onPress, index }: OptionButtonProps) {
  const { springConfig, getDuration, shouldAnimate } = useAccessibilityAnimations();
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, springConfig),
      withSpring(1, springConfig)
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <Animated.View
      entering={
        shouldAnimate
          ? FadeInUp.delay(index * 100).duration(getDuration(300))
          : undefined
      }
    >
      <Pressable onPress={handlePress}>
        <Animated.View
          style={[
            styles.optionButton,
            isSelected && styles.optionButtonSelected,
            animatedStyle,
          ]}
        >
          <View
            style={[
              styles.optionLetter,
              isSelected && styles.optionLetterSelected,
            ]}
          >
            <Text
              style={[
                styles.optionLetterText,
                isSelected && styles.optionLetterTextSelected,
              ]}
            >
              {letters[index]}
            </Text>
          </View>
          <Text
            style={[
              styles.optionText,
              isSelected && styles.optionTextSelected,
            ]}
          >
            {option.text}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// QUESTION CARD COMPONENT
// ============================================================================

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  showingHint,
  onSelectOption,
  onValidate,
  onRequestHint,
  hintsRemaining,
  onPause,
}: QuestionCardProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseButtonText}>⏸️</Text>
        </Pressable>

        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            Question {questionIndex + 1}/{totalQuestions}
          </Text>
        </View>

        <Pressable
          style={[
            styles.hintButton,
            hintsRemaining === 0 && styles.hintButtonDisabled,
          ]}
          onPress={onRequestHint}
          disabled={hintsRemaining === 0}
        >
          <Text style={styles.hintButtonText}>
            💡 {hintsRemaining}
          </Text>
        </Pressable>
      </View>

      {/* Question */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={shouldAnimate ? FadeIn.duration(getDuration(300)) : undefined}
          style={styles.questionCard}
        >
          {question.emoji && (
            <Text style={styles.questionEmoji}>{question.emoji}</Text>
          )}
          <Text style={styles.questionText}>{question.text}</Text>
        </Animated.View>

        {/* Indice */}
        {showingHint && question.hint && (
          <Animated.View
            entering={shouldAnimate ? FadeInUp.duration(getDuration(200)) : undefined}
            style={styles.hintCard}
          >
            <Text style={styles.hintTitle}>💡 Indice</Text>
            <Text style={styles.hintText}>{question.hint}</Text>
          </Animated.View>
        )}

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <OptionButton
              key={option.id}
              option={option}
              isSelected={selectedOptionId === option.id}
              onPress={() => onSelectOption(option.id)}
              index={index}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bouton valider */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.validateButton,
            !selectedOptionId && styles.validateButtonDisabled,
          ]}
          onPress={onValidate}
          disabled={!selectedOptionId}
        >
          <Text style={styles.validateButtonText}>Valider ma réponse</Text>
        </Pressable>
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
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  pauseButtonText: {
    fontSize: 20,
  },
  progressIndicator: {
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.round,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary.main,
  },
  hintButton: {
    backgroundColor: colors.secondary.main,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.round,
    ...shadows.sm,
  },
  hintButtonDisabled: {
    opacity: 0.4,
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing[4],
  },
  questionCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    alignItems: 'center',
    ...shadows.lg,
    marginBottom: spacing[4],
  },
  questionEmoji: {
    fontSize: 48,
    marginBottom: spacing[3],
  },
  questionText: {
    fontSize: 20,
    lineHeight: 28,
    color: colors.text.primary,
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    textAlign: 'center',
  },
  hintCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary.main,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  hintText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: spacing[3],
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  optionButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },
  optionLetter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  optionLetterSelected: {
    backgroundColor: colors.primary.main,
  },
  optionLetterText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  optionLetterTextSelected: {
    color: '#FFF',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: colors.primary.main,
  },
  footer: {
    padding: spacing[4],
  },
  validateButton: {
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  validateButtonDisabled: {
    opacity: 0.4,
  },
  validateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default QuestionCard;
