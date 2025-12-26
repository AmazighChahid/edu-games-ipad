/**
 * Squirrel component for Forest Background
 * Animated squirrel running back and forth
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
  interpolate,
} from 'react-native-reanimated';
import { ANIMATION_DURATIONS } from '@/types/home.types';

export const Squirrel = memo(() => {
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    progress.value = withRepeat(
      withSequence(
        // Run right
        withTiming(0.45, {
          duration: ANIMATION_DURATIONS.squirrel * 0.45,
          easing: Easing.inOut(Easing.ease),
        }),
        // Pause and turn
        withTiming(0.5, {
          duration: ANIMATION_DURATIONS.squirrel * 0.05,
          easing: Easing.linear,
        }),
        // Run left (back)
        withTiming(0.95, {
          duration: ANIMATION_DURATIONS.squirrel * 0.45,
          easing: Easing.inOut(Easing.ease),
        }),
        // Pause before restart
        withTiming(1, {
          duration: ANIMATION_DURATIONS.squirrel * 0.05,
          easing: Easing.linear,
        })
      ),
      -1,
      false
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    // Move right then back left
    const translateX = interpolate(
      progress.value,
      [0, 0.45, 0.5, 0.95, 1],
      [0, 550, 550, 0, 0]
    );

    // Flip direction at halfway point
    const scaleX = progress.value > 0.45 && progress.value < 0.95 ? -1 : 1;

    // Fade in/out at the edges
    const opacity = interpolate(
      progress.value,
      [0, 0.05, 0.95, 1],
      [0, 1, 1, 0]
    );

    return {
      transform: [{ translateX }, { scaleX }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.squirrel, animatedStyle]}>
      <Text style={styles.emoji}>🐿️</Text>
    </Animated.View>
  );
});

Squirrel.displayName = 'Squirrel';

const styles = StyleSheet.create({
  squirrel: {
    position: 'absolute',
    bottom: 135,
    left: -40,
    zIndex: 8,
  },
  emoji: {
    fontSize: 30,
  },
});
