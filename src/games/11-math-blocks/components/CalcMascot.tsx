/**
 * CalcMascot Component
 * Mascotte Calc pour le jeu MathBlocks
 * Utilise MascotBubble du système commun pour la bulle de dialogue
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { MascotBubble, bubbleTextStyles } from '../../../components/common';
import { Icons } from '../../../constants/icons';
import { theme } from '../../../theme';

// ============================================
// TYPES
// ============================================

export type CalcEmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

export interface CalcMascotProps {
  /** Message à afficher dans la bulle */
  message: string;
  /** Émotion de la mascotte */
  emotion?: CalcEmotionType;
  /** Afficher le bouton CTA */
  buttonText?: string;
  /** Callback du bouton CTA */
  onPress?: () => void;
  /** Mots à mettre en surbrillance */
  highlights?: string[];
  /** Position de la queue de la bulle */
  tailPosition?: 'left' | 'right' | 'bottom' | 'top';
  /** Masquer la bulle (afficher seulement la mascotte) */
  hideBubble?: boolean;
  /** Activer l'effet typewriter */
  typing?: boolean;
  /** Callback quand le typewriter est terminé */
  onTypingComplete?: () => void;
}

// ============================================
// CONSTANTS
// ============================================

const CALC_EMOTIONS: Record<CalcEmotionType, string> = {
  neutral: Icons.abacus,      // 🧮
  happy: Icons.target,        // 🎯
  thinking: Icons.thinking,   // 🤔
  excited: Icons.celebration, // 🎉
  encouraging: Icons.muscle,  // 💪
};

const CALC_COLORS = {
  primary: theme.colors.secondary.main,    // Orange
  secondary: theme.colors.primary.main,    // Bleu
  badge: theme.colors.secondary.main,
};

// ============================================
// COMPONENT
// ============================================

export function CalcMascot({
  message,
  emotion = 'neutral',
  buttonText,
  onPress,
  highlights = [],
  tailPosition = 'left',
  hideBubble = false,
  typing = false,
  onTypingComplete,
}: CalcMascotProps) {
  // Animation pour la mascotte
  const bounceY = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Animation de rebond idle
  useEffect(() => {
    bounceY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 800 }),
        withTiming(0, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  // Animation quand l'émotion change
  useEffect(() => {
    if (emotion === 'excited' || emotion === 'happy') {
      rotation.value = withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(5, { duration: 100 }),
        withTiming(-3, { duration: 100 }),
        withTiming(3, { duration: 100 }),
        withSpring(0)
      );
    }
  }, [emotion]);

  const mascotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounceY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  // Construire le message avec highlights
  const renderMessage = () => {
    if (highlights.length === 0) {
      return message;
    }

    let result: React.ReactNode = message;
    highlights.forEach((word) => {
      if (typeof result === 'string' && result.includes(word)) {
        const parts = result.split(word);
        result = (
          <>
            {parts[0]}
            <Text style={bubbleTextStyles.highlightOrange}>{word}</Text>
            {parts.slice(1).join(word)}
          </>
        );
      }
    });

    return result;
  };

  return (
    <View style={styles.container}>
      {/* Mascotte Calc */}
      <View style={styles.mascotContainer}>
        <Animated.View style={[styles.mascotWrapper, mascotAnimatedStyle]}>
          <Text style={styles.mascotEmoji}>{CALC_EMOTIONS[emotion]}</Text>
        </Animated.View>
        <View style={styles.nameTag}>
          <Text style={styles.nameText}>Calc</Text>
        </View>
      </View>

      {/* Bulle de dialogue */}
      {!hideBubble && (
        <View style={styles.bubbleContainer}>
          <MascotBubble
            message={typing ? message : renderMessage()}
            buttonText={buttonText}
            onPress={onPress}
            buttonVariant="orange"
            tailPosition={tailPosition}
            showDecorations={false}
            showSparkles={emotion === 'excited'}
            maxWidth={320}
            typing={typing}
            typingSpeed={25}
            onTypingComplete={onTypingComplete}
          />
        </View>
      )}
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  mascotContainer: {
    alignItems: 'center',
  },
  mascotWrapper: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  mascotEmoji: {
    fontSize: 40,
  },
  nameTag: {
    backgroundColor: CALC_COLORS.badge,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing[1],
  },
  nameText: {
    fontSize: 11,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bubbleContainer: {
    flex: 1,
  },
});

export default CalcMascot;
