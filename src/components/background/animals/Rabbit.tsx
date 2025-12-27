/**
 * Rabbit component for Forest Background
 * Animated rabbit hopping back and forth
 */

import React, { memo, useEffect } from 'react';
import { Text, StyleSheet, useWindowDimensions } from 'react-native';
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
import { ANIMATION_DURATIONS } from '../../../types/home.types';

export const Rabbit = memo(() => {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    progress.value = withDelay(
      5000,
      withRepeat(
        withTiming(1, {
          duration: ANIMATION_DURATIONS.rabbit,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    // Hopping X movement (left direction then back)
    const translateX = interpolate(
      progress.value,
      [0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 1],
      [0, -80, -80, -160, -160, -240, -240, -240, -160, -160, -80, -80, 0, 0, 0]
    );

    // Hopping Y movement (jump up and down)
    const translateY = interpolate(
      progress.value,
      [0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 1],
      [0, -20, 0, -25, 0, -20, 0, 0, -25, 0, -20, 0, -25, 0, 0]
    );

    // Flip direction at halfway point
    const scaleX = progress.value < 0.5 ? -1 : 1;

    // Fade in/out
    const opacity = interpolate(
      progress.value,
      [0, 0.05, 0.8, 1],
      [0, 1, 1, 0]
    );

    return {
      transform: [{ translateX }, { translateY }, { scaleX }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.rabbit, { right: -40 }, animatedStyle]}>
      <Text style={styles.emoji}>🐰</Text>
    </Animated.View>
  );
});

Rabbit.displayName = 'Rabbit';

const styles = StyleSheet.create({
  rabbit: {
    position: 'absolute',
    bottom: 125,
    zIndex: 8,
  },
  emoji: {
    fontSize: 28,
  },
});
