/**
 * Bee component for Forest Background
 * Animated bee with zigzag flight pattern
 */

import React, { memo, useEffect } from 'react';
import { Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
  interpolate,
} from 'react-native-reanimated';
import { ANIMATION_DURATIONS } from '@/types/home.types';

export const Bee = memo(() => {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    progress.value = withRepeat(
      withTiming(1, {
        duration: ANIMATION_DURATIONS.bee,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 0.2, 0.4, 0.6, 0.8, 1],
      [-30, 200, 400, 600, 800, 1000]
    );

    // Zigzag Y movement
    const translateY = interpolate(
      progress.value,
      [0, 0.2, 0.4, 0.6, 0.8, 1],
      [0, -30, 20, -40, 10, -20]
    );

    // Fade in/out
    const opacity = interpolate(
      progress.value,
      [0, 0.05, 0.95, 1],
      [0, 1, 1, 0]
    );

    return {
      transform: [{ translateX }, { translateY }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.bee, animatedStyle]}>
      <Text style={styles.emoji}>🐝</Text>
    </Animated.View>
  );
});

Bee.displayName = 'Bee';

const styles = StyleSheet.create({
  bee: {
    position: 'absolute',
    top: 200,
    left: -30,
    zIndex: 10,
  },
  emoji: {
    fontSize: 22,
  },
});
