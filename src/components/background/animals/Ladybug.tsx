/**
 * Ladybug component for Forest Background
 * Animated ladybug walking slowly
 */

import React, { memo, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
  interpolate,
} from 'react-native-reanimated';
import { ANIMATION_DURATIONS } from '../../../types/home.types';

export const Ladybug = memo(() => {
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    progress.value = withRepeat(
      withTiming(1, {
        duration: ANIMATION_DURATIONS.ladybug,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    // Slow wandering X movement
    const translateX = interpolate(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, 100, 50, 120, 0]
    );

    // Slight Y movement
    const translateY = interpolate(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, -10, 5, -5, 0]
    );

    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  return (
    <Animated.View style={[styles.ladybug, animatedStyle]}>
      <Text style={styles.emoji}>🐞</Text>
    </Animated.View>
  );
});

Ladybug.displayName = 'Ladybug';

const styles = StyleSheet.create({
  ladybug: {
    position: 'absolute',
    bottom: 140,
    left: 280,
    zIndex: 7,
  },
  emoji: {
    fontSize: 18,
  },
});
