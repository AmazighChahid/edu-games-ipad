/**
 * Dragonfly component for Forest Background
 * Animated dragonfly darting from right to left
 */

import React, { memo, useEffect } from 'react';
import { Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
  interpolate,
} from 'react-native-reanimated';
import { ANIMATION_DURATIONS } from '@/types/home.types';

export const Dragonfly = memo(() => {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    progress.value = withDelay(
      6000,
      withRepeat(
        withTiming(1, {
          duration: ANIMATION_DURATIONS.dragonfly,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    // Darting movement from right to left
    const translateX = interpolate(
      progress.value,
      [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
      [0, -300, -250, -500, -450, -700, -1000]
    );

    // Erratic Y movement
    const translateY = interpolate(
      progress.value,
      [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
      [0, -20, 30, -10, 40, 0, -30]
    );

    // Fade in/out
    const opacity = interpolate(
      progress.value,
      [0, 0.05, 0.95, 1],
      [0, 1, 1, 0]
    );

    return {
      transform: [{ translateX }, { translateY }, { scaleX: -1 }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.dragonfly, { right: -40 }, animatedStyle]}>
      <Text style={styles.emoji}>🪻</Text>
    </Animated.View>
  );
});

Dragonfly.displayName = 'Dragonfly';

const styles = StyleSheet.create({
  dragonfly: {
    position: 'absolute',
    top: 160,
    zIndex: 10,
  },
  emoji: {
    fontSize: 24,
  },
});
