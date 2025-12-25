/**
 * Porte Parentale
 * Empêche les enfants d'accéder à l'espace parent
 * Conforme aux guidelines Apple pour apps enfants
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Button } from '../core';
import { Colors, Layout, Typography } from '../../constants';

interface ParentalGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface MathProblem {
  question: string;
  answer: number;
  options: number[];
}

// Générer un problème mathématique aléatoire
const generateMathProblem = (): MathProblem => {
  const operations = ['+', '-', '×'];
  const op = operations[Math.floor(Math.random() * operations.length)];

  let a: number, b: number, answer: number;

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * 20) + 10;
      b = Math.floor(Math.random() * 20) + 10;
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * 30) + 20;
      b = Math.floor(Math.random() * 15) + 5;
      answer = a - b;
      break;
    case '×':
      a = Math.floor(Math.random() * 8) + 3;
      b = Math.floor(Math.random() * 8) + 3;
      answer = a * b;
      break;
    default:
      a = 10;
      b = 5;
      answer = 15;
  }

  // Générer des réponses incorrectes
  const wrongAnswers: number[] = [];
  while (wrongAnswers.length < 3) {
    const wrong = answer + Math.floor(Math.random() * 20) - 10;
    if (wrong !== answer && wrong > 0 && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }

  // Mélanger les options
  const options = [...wrongAnswers, answer].sort(() => Math.random() - 0.5);

  return {
    question: `${a} ${op} ${b} = ?`,
    answer,
    options,
  };
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ParentalGate: React.FC<ParentalGateProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [problem, setProblem] = useState<MathProblem>(generateMathProblem);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const shakeX = useSharedValue(0);

  const shakeAnimation = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleAnswerSelect = useCallback((answer: number) => {
    setSelectedAnswer(answer);

    if (answer === problem.answer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(onSuccess, 500);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsWrong(true);
      setAttempts((prev) => prev + 1);

      // Animation de secousse
      shakeX.value = withSpring(-10, { damping: 5 }, () => {
        shakeX.value = withSpring(10, { damping: 5 }, () => {
          shakeX.value = withSpring(0, { damping: 5 });
        });
      });

      // Nouveau problème après un délai
      setTimeout(() => {
        setProblem(generateMathProblem());
        setSelectedAnswer(null);
        setIsWrong(false);
      }, 1500);
    }
  }, [problem.answer, onSuccess]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icône */}
        <Text style={styles.icon}>🔒</Text>

        {/* Titre */}
        <Text style={styles.title}>Espace Parent</Text>
        <Text style={styles.subtitle}>
          Résous ce calcul pour continuer
        </Text>

        {/* Problème */}
        <Animated.View style={[styles.problemContainer, shakeAnimation]}>
          <Text style={styles.problem}>{problem.question}</Text>
        </Animated.View>

        {/* Options */}
        <View style={styles.optionsGrid}>
          {problem.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === problem.answer;
            const showResult = isSelected && selectedAnswer !== null;

            return (
              <Pressable
                key={index}
                style={[
                  styles.optionButton,
                  showResult && isCorrect && styles.optionCorrect,
                  showResult && !isCorrect && styles.optionWrong,
                ]}
                onPress={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                <Text
                  style={[
                    styles.optionText,
                    showResult && (isCorrect ? styles.optionTextCorrect : styles.optionTextWrong),
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Message d'erreur */}
        {isWrong && (
          <Text style={styles.errorMessage}>
            Essaie encore !
          </Text>
        )}

        {/* Nombre de tentatives */}
        {attempts > 0 && (
          <Text style={styles.attemptsText}>
            Tentatives : {attempts}
          </Text>
        )}
      </View>

      {/* Bouton retour */}
      <View style={styles.footer}>
        <Button
          label="Retour"
          onPress={onCancel}
          variant="outline"
          size="medium"
          accessibilityLabel="Retourner au menu enfant"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.background,
    justifyContent: 'space-between',
    padding: Layout.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 60,
    marginBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral.text,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral.textLight,
    marginBottom: Layout.spacing.xl,
    textAlign: 'center',
  },
  problemContainer: {
    backgroundColor: Colors.neutral.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.xl,
    marginBottom: Layout.spacing.xl,
    ...Layout.shadow.medium,
  },
  problem: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.dark,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Layout.spacing.md,
    maxWidth: 300,
  },
  optionButton: {
    width: 120,
    height: 60,
    backgroundColor: Colors.neutral.surface,
    borderRadius: Layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Layout.shadow.small,
  },
  optionCorrect: {
    backgroundColor: Colors.feedback.success,
  },
  optionWrong: {
    backgroundColor: Colors.feedback.error,
  },
  optionText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.neutral.text,
  },
  optionTextCorrect: {
    color: Colors.neutral.surface,
  },
  optionTextWrong: {
    color: Colors.neutral.surface,
  },
  errorMessage: {
    marginTop: Layout.spacing.lg,
    fontSize: Typography.sizes.sm,
    color: Colors.feedback.error,
    fontWeight: Typography.weights.medium,
  },
  attemptsText: {
    marginTop: Layout.spacing.sm,
    fontSize: Typography.sizes.xs,
    color: Colors.neutral.textLight,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Layout.spacing.lg,
  },
});
