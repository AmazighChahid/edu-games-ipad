/**
 * MemoryCard Component
 *
 * Carte retournable pour le jeu Memory
 * Animations fluides avec React Native Reanimated
 */

import React, { useEffect } from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';

import { colors, borderRadius, shadows } from '../../../theme';
import { useAccessibilityAnimations } from '../../../hooks/useAccessibilityAnimations';
import type { MemoryCard as MemoryCardType } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface MemoryCardProps {
  card: MemoryCardType;
  onPress: (cardId: string) => void;
  size: number;
  disabled?: boolean;
  cardBackColor?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MemoryCard({
  card,
  onPress,
  size,
  disabled = false,
  cardBackColor = colors.primary.main,
}: MemoryCardProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  // Animation de retournement
  const flipProgress = useSharedValue(0);

  // Animation de match
  const matchScale = useSharedValue(1);
  const matchOpacity = useSharedValue(1);

  // Mettre à jour l'animation selon l'état
  useEffect(() => {
    const isFlipped = card.state === 'revealed' || card.state === 'matched';
    const targetValue = isFlipped ? 1 : 0;

    if (shouldAnimate) {
      flipProgress.value = withTiming(targetValue, {
        duration: getDuration(300),
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      flipProgress.value = targetValue;
    }
  }, [card.state, flipProgress, shouldAnimate, getDuration]);

  // Animation de match
  useEffect(() => {
    if (card.state === 'matched' && shouldAnimate) {
      matchScale.value = withSpring(1.1, { damping: 10 }, () => {
        matchScale.value = withSpring(1);
      });
    }
  }, [card.state, matchScale, shouldAnimate]);

  // Style animé - Face arrière
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
      ],
      opacity: flipProgress.value < 0.5 ? 1 : 0,
    };
  });

  // Style animé - Face avant
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360]);

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { scale: matchScale.value },
      ],
      opacity: flipProgress.value >= 0.5 ? 1 : 0,
    };
  });

  // Handler de press
  const handlePress = () => {
    if (disabled || card.state !== 'hidden') return;
    onPress(card.id);
  };

  // Styles dynamiques
  const cardStyle = {
    width: size,
    height: size,
  };

  const isMatched = card.state === 'matched';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || card.state !== 'hidden'}
      style={[styles.container, cardStyle]}
    >
      {/* Face arrière (cachée) */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          { backgroundColor: cardBackColor },
          backAnimatedStyle,
        ]}
      >
        <Text style={styles.cardBackIcon}>?</Text>
      </Animated.View>

      {/* Face avant (symbole) */}
      <Animated.View
        style={[
          styles.card,
          styles.cardFront,
          isMatched && styles.cardMatched,
          frontAnimatedStyle,
        ]}
      >
        <Text style={[styles.symbol, { fontSize: size * 0.5 }]}>
          {card.symbol}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    margin: 4,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    ...shadows.md,
  },
  cardBack: {
    backgroundColor: colors.primary.main,
  },
  cardFront: {
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.ui.border,
  },
  cardMatched: {
    backgroundColor: colors.feedback.successLight,
    borderColor: colors.feedback.success,
  },
  cardBackIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  symbol: {
    textAlign: 'center',
  },
});

export default MemoryCard;
