/**
 * AttemptsDisplay - Shows remaining attempts as dots
 * Visual feedback for wrong answers (max 3 attempts)
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';

// ============================================================================
// TYPES
// ============================================================================

interface AttemptsDisplayProps {
  attempts: number;
  maxAttempts: number;
}

// ============================================================================
// ANIMATED ATTEMPT DOT
// ============================================================================

interface AttemptDotProps {
  isUsed: boolean;
  index: number;
  justUsed: boolean;
}

const AttemptDot = memo(({ isUsed, index, justUsed }: AttemptDotProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (justUsed) {
      // Pop and fade animation when attempt is used
      scale.value = withSequence(
        withSpring(1.5, { damping: 8 }),
        withTiming(0.8, { duration: 200 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [justUsed, isUsed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      entering={FadeIn.delay(100 * index).duration(200)}
      style={[
        styles.dot,
        isUsed ? styles.dotUsed : styles.dotRemaining,
        animatedStyle,
      ]}
    />
  );
});

// ============================================================================
// ATTEMPTS DISPLAY COMPONENT
// ============================================================================

function AttemptsDisplayComponent({
  attempts,
  maxAttempts,
}: AttemptsDisplayProps) {
  const remainingAttempts = maxAttempts - attempts;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Essais</Text>
      <View style={styles.dotsContainer}>
        {Array.from({ length: maxAttempts }).map((_, index) => (
          <AttemptDot
            key={index}
            isUsed={index < attempts}
            index={index}
            justUsed={index === attempts - 1}
          />
        ))}
      </View>
    </View>
  );
}

export const AttemptsDisplay = memo(AttemptsDisplayComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Nunito-Medium',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotRemaining: {
    backgroundColor: '#7BC74D', // Green for remaining
  },
  dotUsed: {
    backgroundColor: '#FFB347', // Orange for used (NOT red)
  },
});
