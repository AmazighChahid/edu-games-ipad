/**
 * Rabbit - Lapin animé qui sautille de droite à gauche et revient
 * Animation de saut avec flip horizontal
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { HomeV10ZIndex, HomeV10Animations } from '../../../theme/home-v10-colors';

export const Rabbit = memo(() => {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(-1); // Start facing left
  const opacity = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const duration = HomeV10Animations.rabbitHop;
  const hopDuration = duration * 0.12; // Single hop duration
  const pauseDuration = duration * 0.03;

  useEffect(() => {
    if (reducedMotion) return;

    const animate = () => {
      // Reset
      translateX.value = 0;
      translateY.value = 0;
      scaleX.value = -1;
      opacity.value = 0;

      // Fade in and out
      opacity.value = withDelay(
        5000, // Start delay
        withSequence(
          withTiming(1, { duration: pauseDuration * 2 }),
          withTiming(1, { duration: duration * 0.85 }),
          withTiming(0, { duration: pauseDuration * 2 })
        )
      );

      // Hop pattern: 3 hops left, pause, flip, 3 hops right
      translateX.value = withDelay(
        5000,
        withSequence(
          // First hop left
          withTiming(-100, { duration: hopDuration, easing: Easing.out(Easing.ease) }),
          withTiming(-100, { duration: pauseDuration }),
          // Second hop left
          withTiming(-200, { duration: hopDuration, easing: Easing.out(Easing.ease) }),
          withTiming(-200, { duration: pauseDuration }),
          // Pause and turn around
          withTiming(-200, { duration: duration * 0.2 }),
          // First hop right
          withTiming(-100, { duration: hopDuration, easing: Easing.out(Easing.ease) }),
          withTiming(-100, { duration: pauseDuration }),
          // Second hop right
          withTiming(0, { duration: hopDuration, easing: Easing.out(Easing.ease) })
        )
      );

      // Jump up and down during hops
      translateY.value = withDelay(
        5000,
        withSequence(
          // First hop
          withTiming(-20, { duration: hopDuration / 2 }),
          withTiming(0, { duration: hopDuration / 2 }),
          withTiming(0, { duration: pauseDuration }),
          // Second hop
          withTiming(-25, { duration: hopDuration / 2 }),
          withTiming(0, { duration: hopDuration / 2 }),
          withTiming(0, { duration: pauseDuration }),
          // Pause
          withTiming(0, { duration: duration * 0.2 }),
          // First hop back
          withTiming(-20, { duration: hopDuration / 2 }),
          withTiming(0, { duration: hopDuration / 2 }),
          withTiming(0, { duration: pauseDuration }),
          // Second hop back
          withTiming(-25, { duration: hopDuration / 2 }),
          withTiming(0, { duration: hopDuration / 2 })
        )
      );

      // Flip direction at midpoint
      scaleX.value = withDelay(
        5000,
        withSequence(
          withTiming(-1, { duration: duration * 0.45 }),
          withTiming(1, { duration: 100 }),
          withTiming(1, { duration: duration * 0.45 })
        )
      );
    };

    animate();
    const interval = setInterval(animate, duration + 7000);
    return () => clearInterval(interval);
  }, [reducedMotion, duration, hopDuration, pauseDuration, translateX, translateY, scaleX, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scaleX: scaleX.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.rabbit, { right: -35 }, animatedStyle]}>
        <Text style={styles.rabbitEmoji}>🐰</Text>
      </Animated.View>
    </View>
  );
});

Rabbit.displayName = 'Rabbit';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: HomeV10ZIndex.animals,
  },
  rabbit: {
    position: 'absolute',
    bottom: 88,
  },
  rabbitEmoji: {
    fontSize: 26,
  },
});
