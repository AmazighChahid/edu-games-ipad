/**
 * Squirrel - Écureuil animé qui court de gauche à droite et revient
 * Animation aller-retour avec flip horizontal
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
  useReducedMotion,
  runOnJS,
} from 'react-native-reanimated';
import { HomeV10ZIndex, HomeV10Animations } from '../../../theme/home-v10-colors';

export const Squirrel = memo(() => {
  const translateX = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const opacity = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const duration = HomeV10Animations.squirrelRun;
  const runDuration = duration * 0.47; // Time to run one direction
  const pauseDuration = duration * 0.03; // Pause at each end

  useEffect(() => {
    if (reducedMotion) return;

    const animate = () => {
      // Reset
      translateX.value = 0;
      scaleX.value = 1;
      opacity.value = 0;

      // Fade in
      opacity.value = withSequence(
        withTiming(1, { duration: pauseDuration }),
        withTiming(1, { duration: duration - pauseDuration * 2 }),
        withTiming(0, { duration: pauseDuration })
      );

      // Run right, pause, flip, run left, pause, flip
      translateX.value = withSequence(
        withTiming(520, { duration: runDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(520, { duration: pauseDuration }),
        withTiming(0, { duration: runDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: pauseDuration })
      );

      // Flip direction at midpoint
      scaleX.value = withSequence(
        withTiming(1, { duration: runDuration }),
        withTiming(-1, { duration: 100 }),
        withTiming(-1, { duration: runDuration - 100 }),
        withTiming(1, { duration: 100 })
      );
    };

    animate();
    const interval = setInterval(animate, duration + 2000);
    return () => clearInterval(interval);
  }, [reducedMotion, duration, runDuration, pauseDuration, translateX, scaleX, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scaleX: scaleX.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.squirrel, animatedStyle]}>
        <Text style={styles.squirrelEmoji}>🐿️</Text>
      </Animated.View>
    </View>
  );
});

Squirrel.displayName = 'Squirrel';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: HomeV10ZIndex.animals,
  },
  squirrel: {
    position: 'absolute',
    bottom: 95,
    left: -40,
  },
  squirrelEmoji: {
    fontSize: 28,
  },
});
