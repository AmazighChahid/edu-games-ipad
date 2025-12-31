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
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily, touchTargets } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import { PageContainer } from '../../../components/common/PageContainer';
import { ScreenHeader } from '../../../components/common/ScreenHeader';

import { PlumeMascot } from '../components/PlumeMascot';
import { AnswerButton } from '../components/AnswerButton';
import { FeedbackOverlay } from '../components/FeedbackOverlay';
import { getLevelById } from '../data/stories';
import { saveSessionResult } from '../utils/parentStorage';
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
  factual: { emoji: Icons.search, label: 'Qui/Quoi/Où' },
  sequential: { emoji: Icons.list, label: 'Ordre' },
  causal: { emoji: Icons.link, label: 'Pourquoi' },
  emotional: { emoji: Icons.thinking, label: 'Sentiments' },
  inferential: { emoji: Icons.sparkles, label: 'Entre les lignes' },
  opinion: { emoji: Icons.lightbulb, label: 'Ton avis' },
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
  const [showTextHint, setShowTextHint] = useState(false);
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

  // Mélanger les options de réponse aléatoirement
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion?.options) return [];
    // Fonction de mélange Fisher-Yates
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    return shuffleArray(currentQuestion.options);
  }, [currentQuestionIndex, currentQuestion?.options]);

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
    setShowTextHint(false);
    setCurrentAttempts(0);
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  // Handler pour afficher/masquer le texte de l'histoire correspondant
  const handleToggleTextHint = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowTextHint((prev) => !prev);
  }, []);

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

  const handleFeedbackClose = useCallback(async () => {
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
          const allAnswers = [...playerAnswers, {
            questionId: currentQuestion?.id || '',
            selectedOptionId: selectedOptionId || '',
            isCorrect: true,
            hintsUsed: showHint ? 1 : 0,
            timeSpent: Math.floor((Date.now() - questionStartTime) / 1000),
          }];
          const correctAnswers = allAnswers.filter((a) => a.isCorrect).length;
          const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
          const stars = scorePercent >= 80 ? (hintsUsed === 0 ? 5 : 4) : scorePercent >= 60 ? 3 : scorePercent >= 40 ? 2 : 1;

          // Calculer les scores par catégorie
          const categoryScores: Record<QuestionCategory, { correct: number; total: number }> = {
            factual: { correct: 0, total: 0 },
            sequential: { correct: 0, total: 0 },
            causal: { correct: 0, total: 0 },
            emotional: { correct: 0, total: 0 },
            inferential: { correct: 0, total: 0 },
            opinion: { correct: 0, total: 0 },
          };

          // Compter par catégorie
          questions.forEach((q, idx) => {
            if (q.category) {
              categoryScores[q.category].total++;
              const answer = allAnswers.find(a => a.questionId === q.id);
              if (answer?.isCorrect) {
                categoryScores[q.category].correct++;
              }
            }
          });

          // Convertir categoryScores en Partial<CompetencyScores> (pourcentages)
          const competencyScores: Partial<Record<QuestionCategory, number>> = {};
          Object.entries(categoryScores).forEach(([cat, data]) => {
            if (data.total > 0) {
              competencyScores[cat as QuestionCategory] = Math.round((data.correct / data.total) * 100);
            }
          });

          // Sauvegarder la session dans le storage
          try {
            await saveSessionResult({
              id: `session_${Date.now()}`,
              levelId: resolvedLevelId || '',
              storyTitle: level?.story.title || '',
              storyEmoji: level?.story.emoji || '',
              date: new Date().toISOString(),
              scorePercent,
              stars: stars as 1 | 2 | 3 | 4 | 5,
              readingTimeSeconds: 0, // TODO: passer le temps de lecture depuis la page précédente
              questionsTimeSeconds: Math.floor((Date.now() - questionStartTime) / 1000),
              hintsUsed,
              categoryScores: competencyScores,
              questionsByCategory: categoryScores,
            });
          } catch (error) {
            console.error('Error saving session result:', error);
          }

          // Aller vers l'écran d'enregistrement au lieu de la victoire
          router.push({
            pathname: '/(games)/06-conteur-curieux/recording',
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
    currentQuestion,
    selectedOptionId,
    showHint,
    questionStartTime,
    questions,
    level,
  ]);

  const handleRequestHint = useCallback(() => {
    if (hintsRemaining <= 0 || showHint) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHintsUsed((prev) => prev + 1);
    setShowHint(true);
  }, [hintsRemaining, showHint]);

  if (!level || !currentQuestion) {
    return (
      <PageContainer variant="neutral" safeAreaEdges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>{Icons.thinking}</Text>
          <Text style={styles.errorText}>Questions introuvables</Text>
          <Pressable style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </Pressable>
        </View>
      </PageContainer>
    );
  }

  const categoryConfig = currentQuestion.category
    ? CATEGORY_CONFIG[currentQuestion.category]
    : null;

  return (
    <PageContainer variant="neutral" scrollable={false} safeAreaEdges={['top']}>
      {/* Header */}
      <ScreenHeader
        variant="game"
        title="Questions"
        emoji={Icons.question}
        onBack={handleBack}
      />

      {/* Progress & Hints */}
      <View style={styles.progressHeader}>
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
          accessibilityLabel={`Demander un indice, ${hintsRemaining} restants`}
          accessibilityRole="button"
        >
          <Text style={styles.hintButtonText}>{Icons.lightbulb} {hintsRemaining}</Text>
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
            style={styles.questionContainer}
          >
            <Text style={styles.questionText}>{currentQuestion.text}</Text>

            {/* Bouton indice texte (style Tour d'Hanoi) */}
            {currentQuestion.textReference && (
              <Pressable
                style={[styles.textHintButton, showTextHint && styles.textHintButtonActive]}
                onPress={handleToggleTextHint}
                accessibilityLabel={showTextHint ? 'Masquer le texte' : 'Voir le texte de l\'histoire'}
                accessibilityRole="button"
              >
                <Text style={styles.textHintIcon}>{Icons.book}</Text>
                <Text style={styles.textHintLabel}>
                  {showTextHint ? 'Masquer le texte' : 'Voir le texte'}
                </Text>
              </Pressable>
            )}
          </Animated.View>

          {/* Texte de référence de l'histoire */}
          {showTextHint && currentQuestion.textReference && (
            <Animated.View
              style={styles.textReferenceBubble}
              entering={FadeInUp.duration(getDuration(200))}
            >
              <Text style={styles.textReferenceLabel}>{Icons.book} Extrait de l'histoire</Text>
              <Text style={styles.textReferenceText}>« {currentQuestion.textReference} »</Text>
            </Animated.View>
          )}

          {/* Hint bubble */}
          {showHint && currentQuestion.hint && (
            <Animated.View
              style={styles.hintBubble}
              entering={FadeInUp.duration(getDuration(200))}
            >
              <Text style={styles.hintText}>{Icons.lightbulb} {currentQuestion.hint}</Text>
            </Animated.View>
          )}

          {/* Answer options (mélangées aléatoirement) */}
          <View style={styles.optionsContainer}>
            {shuffledOptions.map((option, index) => {
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
              accessibilityLabel="Valider ma réponse"
              accessibilityRole="button"
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
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  // Progress header (below ScreenHeader)
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
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
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: '#718096',
  },
  hintButton: {
    minHeight: touchTargets.minimum,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: '#FFE4B5',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  hintButtonDisabled: {
    opacity: 0.5,
  },
  hintButtonText: {
    fontSize: 18,
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
    fontSize: 18,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  recapSummary: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
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
    paddingVertical: spacing[2],
    borderRadius: borderRadius.round,
    gap: spacing[1],
    marginBottom: spacing[3],
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryLabel: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: '#9B59B6',
  },

  // Question
  questionContainer: {
    marginBottom: spacing[4],
  },
  questionText: {
    fontSize: 22,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: spacing[3],
    lineHeight: 32,
  },

  // Bouton indice texte (style Tour d'Hanoi)
  textHintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minHeight: touchTargets.minimum,
    backgroundColor: '#FFB347',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.round,
    gap: spacing[2],
    boxShadow: '0px 2px 4px rgba(255, 179, 71, 0.25)',
    elevation: 3,
  },
  textHintButtonActive: {
    backgroundColor: '#9B59B6',
    boxShadow: '0px 2px 4px rgba(155, 89, 182, 0.25)',
  },
  textHintIcon: {
    fontSize: 18,
  },
  textHintLabel: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: '#FFFFFF',
  },

  // Texte de référence de l'histoire
  textReferenceBubble: {
    backgroundColor: '#F0E6F5',
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: '#9B59B6',
  },
  textReferenceLabel: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#9B59B6',
    marginBottom: spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textReferenceText: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: '#2D3748',
    lineHeight: 28,
    fontStyle: 'italic',
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
    fontSize: 18,
    fontFamily: fontFamily.regular,
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
    minHeight: touchTargets.minimum,
    backgroundColor: '#9B59B6',
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(155, 89, 182, 0.25)',
    elevation: 3,
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
    fontFamily: fontFamily.medium,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  errorButton: {
    backgroundColor: colors.primary.main,
    minHeight: touchTargets.minimum,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: fontFamily.medium,
  },
});

export default ConteurQuestionsScreen;
