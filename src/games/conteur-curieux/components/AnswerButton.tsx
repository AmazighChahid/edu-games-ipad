/**
 * AnswerButton Component
 *
 * Bouton de réponse pour les questions du Conteur Curieux
 * États: default, selected, correct, encourage (orange - jamais rouge !)
 */

import React, { useCallback } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, borderRadius, shadows, fontFamily } from '@/theme';

type AnswerState = 'default' | 'selected' | 'correct' | 'encourage';

interface AnswerButtonProps {
  /** Texte de la réponse */
  text: string;
  /** Lettre de la réponse (A, B, C, D) */
  letter: string;
  /** État du bouton */
  state?: AnswerState;
  /** Callback au tap */
  onPress: () => void;
  /** Désactivé */
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Couleurs par état
const STATE_COLORS: Record<AnswerState, { bg: string; border: string; text: string; letter: string }> = {
  default: {
    bg: '#FFFFFF',
    border: '#E2E8F0',
    text: '#2D3748',
    letter: '#718096',
  },
  selected: {
    bg: 'rgba(155,89,182,0.08)',
    border: '#9B59B6',
    text: '#2D3748',
    letter: '#9B59B6',
  },
  correct: {
    bg: 'rgba(123,199,77,0.15)',
    border: '#7BC74D',
    text: '#2D3748',
    letter: '#7BC74D',
  },
  encourage: {
    bg: 'rgba(255,179,71,0.15)',
    border: '#FFB347',
    text: '#2D3748',
    letter: '#FFB347',
  },
};

export function AnswerButton({
  text,
  letter,
  state = 'default',
  onPress,
  disabled = false,
}: AnswerButtonProps) {
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);

  const colors = STATE_COLORS[state];

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  }, [disabled]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
  }, []);

  const handlePress = useCallback(() => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [disabled, onPress]);

  // Animation quand encourage (shake léger)
  React.useEffect(() => {
    if (state === 'encourage') {
      shake.value = withSequence(
        withTiming(-3, { duration: 50 }),
        withTiming(3, { duration: 50 }),
        withTiming(-2, { duration: 50 }),
        withTiming(2, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    } else if (state === 'correct') {
      // Petit rebond pour correct
      scale.value = withSequence(
        withSpring(1.05, { damping: 10 }),
        withSpring(1, { damping: 12 })
      );
    }
  }, [state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: shake.value },
    ],
  }));

  return (
    <AnimatedPressable
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        animatedStyle,
        disabled && styles.disabled,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: state === 'selected', disabled }}
      accessibilityLabel={`Réponse ${letter}: ${text}`}
    >
      {/* Letter badge */}
      <View style={[styles.letterBadge, { backgroundColor: colors.border }]}>
        <Text style={[styles.letterText, { color: state === 'default' ? '#FFFFFF' : colors.letter }]}>
          {letter}
        </Text>
      </View>

      {/* Answer text */}
      <Text style={[styles.text, { color: colors.text }]} numberOfLines={2}>
        {text}
      </Text>

      {/* State indicator */}
      {state === 'correct' && (
        <Text style={styles.stateIcon}>✓</Text>
      )}
      {state === 'encourage' && (
        <Text style={styles.stateIcon}>💡</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.xl,
    borderWidth: 3,
    gap: spacing[3],
    ...shadows.sm,
  },
  disabled: {
    opacity: 0.6,
  },

  // Letter badge
  letterBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },

  // Text
  text: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    lineHeight: 22,
  },

  // State icon
  stateIcon: {
    fontSize: 24,
  },
});

export default AnswerButton;
