/**
 * ConteurQuestionsScreen Component
 *
 * Écran des questions de compréhension pour Le Conteur Curieux
 * - Questions avec 4 réponses possibles
 * - Feedback positif (vert) ou encourageant (orange, jamais rouge)
 * - Plume qui guide et encourage
 * - Indices disponibles
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily } from '@/theme';
import { useAccessibilityAnimations } from '@/hooks';

import { PlumeMascot } from '../components/PlumeMascot';
import { AnswerButton } from '../components/AnswerButton';
import { FeedbackOverlay } from '../components/FeedbackOverlay';
import { getLevelById } from '../data/stories';
import type {
  ConteurLevel,
  StoryQuestion,
  AnswerOption,
  PlayerAnswer,
  PlumeExpression,
  QuestionCategory,
} from '../types';

// Messages de Plume pour les questions
const PLUME_MESSAGES = {
  start: ['Voyons ce que tu as retenu !', 'Prêt pour les questions ?'],
  thinking: ['Prends ton temps...', 'Réfléchis bien...'],
  correct: ['Bravo ! Tu as bien compris !', 'Excellent !'],
  encourage: ['Pas tout à fait, réessaie !', 'Tu peux y arriver !'],
  hint: ['Voici un indice...', 'Ça peut t\'aider...'],
};

// Configuration des catégories
const CATEGORY_CONFIG: Record<QuestionCategory, { emoji: string; label: string }> = {
  factual: { emoji: '🔍', label: 'Qui/Quoi/Où' },
  sequential: { emoji: '📋', label: 'Ordre' },
  causal: { emoji: '🔗', label: 'Pourquoi' },
  emotional: { emoji: '💭', label: 'Sentiments' },
  inferential: { emoji: '🔮', label: 'Entre les lignes' },
  opinion: { emoji: '💡', label: 'Ton avis' },
};

const LETTERS = ['A', 'B', 'C', 'D'];

interface ConteurQuestionsScreenProps {
  levelId?: string;
  readingTime?: number;
  onFinish?: (answers: PlayerAnswer[], hintsUsed: number) => void;
}

export function ConteurQuestionsScreen({
  levelId,
  readingTime,
  onFinish,
}: ConteurQuestionsScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{
    levelId: string;
    mode: string;
    readingTime: string;
  }>();
  const { width, height } = useWindowDimensions();
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  // Récupérer le niveau
  const resolvedLevelId = levelId || params.levelId;
  const resolvedReadingTime = readingTime || parseInt(params.readingTime || '0', 10);
  const level = useMemo(() => getLevelById(resolvedLevelId || ''), [resolvedLevelId]);

  // État
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<'selecting' | 'correct' | 'encourage'>('selecting');
  const [playerAnswers, setPlayerAnswers] = useState<PlayerAnswer[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Responsive
  const isTablet = width >= 768;
  const isLandscape = width > height;

  // Données dérivées
  const questions = level?.story.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const hintsRemaining = (level?.hintsAvailable || 3) - hintsUsed;

  // Message de Plume basé sur l'état
  const plumeData = useMemo((): { message: string; expression: PlumeExpression } => {
    if (showHint) {
      return {
        message: currentQuestion?.hint || 'Relis bien le texte !',
        expression: 'thinking',
      };
    }
    if (answerState === 'correct') {
      return {
        message: PLUME_MESSAGES.correct[Math.floor(Math.random() * PLUME_MESSAGES.correct.length)],
        expression: 'celebrating',
      };
    }
    if (answerState === 'encourage') {
      return {
        message: PLUME_MESSAGES.encourage[Math.floor(Math.random() * PLUME_MESSAGES.encourage.length)],
        expression: 'encouraging',
      };
    }
    if (currentQuestionIndex === 0) {
      return {
        message: PLUME_MESSAGES.start[Math.floor(Math.random() * PLUME_MESSAGES.start.length)],
        expression: 'happy',
      };
    }
    return {
      message: PLUME_MESSAGES.thinking[Math.floor(Math.random() * PLUME_MESSAGES.thinking.length)],
      expression: 'thinking',
    };
  }, [showHint, answerState, currentQuestionIndex, currentQuestion]);

  // Reset au changement de question
  useEffect(() => {
    setSelectedOptionId(null);
    setAnswerState('selecting');
    setShowHint(false);
    setCurrentAttempts(0);
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  // Handlers
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Quitter les questions ?',
      'Ta progression sera perdue.',
      [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Quitter', style: 'destructive', onPress: () => router.back() },
      ]
    );
  }, [router]);

  const handleSelectOption = useCallback((optionId: string) => {
    if (answerState !== 'selecting') return;
    Haptics.selectionAsync();
    setSelectedOptionId(optionId);
  }, [answerState]);

  const handleValidate = useCallback(() => {
    if (!selectedOptionId || !currentQuestion) return;

    const selectedOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
    if (!selectedOption) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const attempts = currentAttempts + 1;
    setCurrentAttempts(attempts);

    if (selectedOption.isCorrect) {
      // Bonne réponse
      setAnswerState('correct');
      setFeedbackMessage(currentQuestion.explanation || 'Bravo !');
      setShowFeedback(true);

      // Enregistrer la réponse
      const answer: PlayerAnswer = {
        questionId: currentQuestion.id,
        selectedOptionId,
        isCorrect: true,
        hintsUsed: showHint ? 1 : 0,
        timeSpent,
      };
      setPlayerAnswers((prev) => [...prev, answer]);
    } else {
      // Mauvaise réponse -> encourager (JAMAIS rouge)
      setAnswerState('encourage');
      setFeedbackMessage(selectedOption.feedback || 'Essaie encore, tu peux y arriver !');
      setShowFeedback(true);
    }
  }, [selectedOptionId, currentQuestion, questionStartTime, currentAttempts, showHint]);

  const handleFeedbackClose = useCallback(() => {
    setShowFeedback(false);

    if (answerState === 'correct') {
      // Passer à la question suivante ou terminer
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Terminer
        if (onFinish) {
          onFinish(playerAnswers, hintsUsed);
        } else {
          // Calculer le score
          const correctAnswers = playerAnswers.filter((a) => a.isCorrect).length + 1; // +1 pour la dernière
          const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
          const stars = scorePercent >= 80 ? (hintsUsed === 0 ? 5 : 4) : scorePercent >= 60 ? 3 : scorePercent >= 40 ? 2 : 1;

          router.push({
            pathname: '/(games)/conteur-curieux/victory',
            params: {
              levelId: resolvedLevelId,
              stars: stars.toString(),
              score: scorePercent.toString(),
              readingTime: resolvedReadingTime.toString(),
            },
          });
        }
      }
    } else {
      // Réessayer
      setAnswerState('selecting');
      setSelectedOptionId(null);
    }
  }, [
    answerState,
    currentQuestionIndex,
    totalQuestions,
    playerAnswers,
    hintsUsed,
    onFinish,
    router,
    resolvedLevelId,
    resolvedReadingTime,
  ]);

  const handleRequestHint = useCallback(() => {
    if (hintsRemaining <= 0 || showHint) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHintsUsed((prev) => prev + 1);
    setShowHint(true);
  }, [hintsRemaining, showHint]);

  if (!level || !currentQuestion) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorText}>Questions introuvables</Text>
          <Pressable style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const categoryConfig = currentQuestion.category
    ? CATEGORY_CONFIG[currentQuestion.category]
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={handleBack}>
          <Text style={styles.headerButtonText}>{'<'}</Text>
        </Pressable>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            {questions.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index < currentQuestionIndex && styles.progressDotCompleted,
                  index === currentQuestionIndex && styles.progressDotCurrent,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1}/{totalQuestions}
          </Text>
        </View>

        {/* Hints */}
        <Pressable
          style={[styles.hintButton, hintsRemaining <= 0 && styles.hintButtonDisabled]}
          onPress={handleRequestHint}
          disabled={hintsRemaining <= 0 || showHint}
        >
          <Text style={styles.hintButtonText}>💡 {hintsRemaining}</Text>
        </Pressable>
      </View>

      {/* Main content */}
      <View style={[styles.content, isTablet && isLandscape && styles.contentLandscape]}>
        {/* Story recap (tablet landscape) */}
        {isTablet && isLandscape && (
          <View style={styles.recapSection}>
            <View style={styles.recapCard}>
              <Text style={styles.recapEmoji}>{level.story.emoji}</Text>
              <Text style={styles.recapTitle}>{level.story.title}</Text>
              {level.story.summary && (
                <Text style={styles.recapSummary}>{level.story.summary}</Text>
              )}
            </View>
          </View>
        )}

        {/* Question section */}
        <ScrollView
          style={styles.questionSection}
          contentContainerStyle={styles.questionContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Category badge */}
          {categoryConfig && (
            <Animated.View
              style={styles.categoryBadge}
              entering={shouldAnimate ? FadeIn.duration(getDuration(200)) : undefined}
            >
              <Text style={styles.categoryEmoji}>{categoryConfig.emoji}</Text>
              <Text style={styles.categoryLabel}>{categoryConfig.label}</Text>
            </Animated.View>
          )}

          {/* Question text */}
          <Animated.View
            key={currentQuestionIndex}
            entering={shouldAnimate ? SlideInRight.duration(getDuration(300)) : undefined}
          >
            <Text style={styles.questionEmoji}>{currentQuestion.emoji || '❓'}</Text>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </Animated.View>

          {/* Hint bubble */}
          {showHint && currentQuestion.hint && (
            <Animated.View
              style={styles.hintBubble}
              entering={FadeInUp.duration(getDuration(200))}
            >
              <Text style={styles.hintText}>💡 {currentQuestion.hint}</Text>
            </Animated.View>
          )}

          {/* Answer options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              let state: 'default' | 'selected' | 'correct' | 'encourage' = 'default';

              if (selectedOptionId === option.id) {
                if (answerState === 'correct' && option.isCorrect) {
                  state = 'correct';
                } else if (answerState === 'encourage' && !option.isCorrect) {
                  state = 'encourage';
                } else {
                  state = 'selected';
                }
              } else if (answerState === 'correct' && option.isCorrect) {
                state = 'correct';
              }

              return (
                <Animated.View
                  key={option.id}
                  entering={
                    shouldAnimate
                      ? FadeInUp.delay(index * 50).duration(getDuration(200))
                      : undefined
                  }
                >
                  <AnswerButton
                    text={option.text}
                    letter={LETTERS[index]}
                    state={state}
                    onPress={() => handleSelectOption(option.id)}
                    disabled={answerState !== 'selecting'}
                  />
                </Animated.View>
              );
            })}
          </View>

          {/* Validate button */}
          {answerState === 'selecting' && (
            <Pressable
              style={[styles.validateButton, !selectedOptionId && styles.validateButtonDisabled]}
              onPress={handleValidate}
              disabled={!selectedOptionId}
            >
              <Text style={styles.validateButtonText}>Valider</Text>
            </Pressable>
          )}
        </ScrollView>

        {/* Plume section (tablet landscape) */}
        {isTablet && isLandscape && (
          <View style={styles.plumeSection}>
            <PlumeMascot
              expression={plumeData.expression}
              size="medium"
              message={plumeData.message}
              showBubble
              bubblePosition="top"
            />
          </View>
        )}
      </View>

      {/* Plume compact (mobile) */}
      {(!isTablet || !isLandscape) && (
        <View style={styles.plumeCompact}>
          <PlumeMascot
            expression={plumeData.expression}
            size="small"
          />
        </View>
      )}

      {/* Feedback overlay */}
      <FeedbackOverlay
        type={answerState === 'correct' ? 'correct' : 'encourage'}
        message={feedbackMessage}
        visible={showFeedback}
        onClose={handleFeedbackClose}
        autoCloseDelay={answerState === 'correct' ? 1500 : 2500}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  headerButtonText: {
    fontSize: 20,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8E8E8',
  },
  progressDotCompleted: {
    backgroundColor: '#7BC74D',
  },
  progressDotCurrent: {
    backgroundColor: '#9B59B6',
    transform: [{ scale: 1.2 }],
  },
  progressText: {
    fontSize: 12,
    color: '#718096',
  },
  hintButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
    backgroundColor: '#FFE4B5',
    ...shadows.sm,
  },
  hintButtonDisabled: {
    opacity: 0.5,
  },
  hintButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
  },

  // Content
  content: {
    flex: 1,
  },
  contentLandscape: {
    flexDirection: 'row',
  },

  // Recap section (tablet)
  recapSection: {
    width: '25%',
    padding: spacing[4],
    backgroundColor: 'rgba(155,89,182,0.05)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(155,89,182,0.1)',
  },
  recapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    alignItems: 'center',
    ...shadows.md,
  },
  recapEmoji: {
    fontSize: 48,
    marginBottom: spacing[2],
  },
  recapTitle: {
    fontSize: 16,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  recapSummary: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Question section
  questionSection: {
    flex: 1,
  },
  questionContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },

  // Category badge
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(155,89,182,0.1)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.round,
    gap: spacing[1],
    marginBottom: spacing[3],
  },
  categoryEmoji: {
    fontSize: 14,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: '#9B59B6',
  },

  // Question
  questionEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  questionText: {
    fontSize: 22,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: spacing[4],
    lineHeight: 32,
  },

  // Hint
  hintBubble: {
    backgroundColor: '#FFF9E6',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginBottom: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: '#FFB347',
  },
  hintText: {
    fontSize: 14,
    color: '#8B6914',
    fontStyle: 'italic',
  },

  // Options
  optionsContainer: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },

  // Validate button
  validateButton: {
    backgroundColor: '#9B59B6',
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.md,
    shadowColor: '#9B59B6',
  },
  validateButtonDisabled: {
    opacity: 0.5,
  },
  validateButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },

  // Plume section (tablet)
  plumeSection: {
    width: '25%',
    padding: spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Plume compact (mobile)
  plumeCompact: {
    position: 'absolute',
    bottom: spacing[4],
    right: spacing[4],
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  errorEmoji: {
    fontSize: 60,
    marginBottom: spacing[4],
  },
  errorText: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  errorButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
  },
  errorButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: fontFamily.medium,
  },
});

export default ConteurQuestionsScreen;
