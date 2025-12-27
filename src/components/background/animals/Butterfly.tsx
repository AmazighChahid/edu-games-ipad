/**
 * Butterfly component for Forest Background
 * 3 butterflies with wavy flight animation
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
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
import { ANIMATION_DURATIONS } from '../../../types/home.types';

interface ButterflyProps {
  index: 0 | 1 | 2;
}

const ButterflyItem = memo(({ index }: ButterflyProps) => {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const config = [
    { top: 150, startX: -50, delay: 0 },
    { top: 250, startX: -80, delay: 3000 },
    { top: 180, startX: -60, delay: 7000 },
  ];

  const { top, startX, delay } = config[index];
  const duration = ANIMATION_DURATIONS.butterfly[index];
  const endX = width + 100;

  useEffect(() => {
    if (reducedMotion) return;

    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [startX, endX]);

    // Wavy Y motion
    const translateY = interpolate(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, -50, 30, -40, 20]
    );

    // Slight rotation for natural look
    const rotate = interpolate(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, 10, -5, 8, 0]
    );

    // Fade in/out at edges
    const opacity = interpolate(
      progress.value,
      [0, 0.05, 0.95, 1],
      [0, 1, 1, 0]
    );

    return {
      transform: [
        { translateX },
        { translateY },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.butterfly, { top }, animatedStyle]}>
      <Text style={styles.emoji}>🦋</Text>
    </Animated.View>
  );
});

ButterflyItem.displayName = 'ButterflyItem';

export const Butterflies = memo(() => {
  return (
    <View style={styles.container}>
      <ButterflyItem index={0} />
      <ButterflyItem index={1} />
      <ButterflyItem index={2} />
    </View>
  );
});

Butterflies.displayName = 'Butterflies';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'none',
  },
  butterfly: {
    position: 'absolute',
    left: 0,
  },
  emoji: {
    fontSize: 28,
  },
});
