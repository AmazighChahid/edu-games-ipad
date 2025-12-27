/**
 * Bird component for Forest Background
 * 3 birds flying across the sky
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

interface BirdProps {
  index: 0 | 1 | 2;
}

const BirdItem = memo(({ index }: BirdProps) => {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const config = [
    { top: 80, startX: -40, emoji: '🐦', delay: 0 },
    { top: 120, startX: -60, emoji: '🐦', delay: 4000 },
    { top: 100, startX: -30, emoji: '🕊️', delay: 8000 },
  ];

  const { top, startX, emoji, delay } = config[index];
  const duration = ANIMATION_DURATIONS.bird[index];
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

    // Slight Y movement for natural flight
    const translateY = interpolate(
      progress.value,
      [0, 0.3, 0.6, 1],
      [0, -30, -10, 10]
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
    <Animated.View style={[styles.bird, { top }, animatedStyle]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </Animated.View>
  );
});

BirdItem.displayName = 'BirdItem';

export const Birds = memo(() => {
  return (
    <View style={styles.container}>
      <BirdItem index={0} />
      <BirdItem index={1} />
      <BirdItem index={2} />
    </View>
  );
});

Birds.displayName = 'Birds';

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
  bird: {
    position: 'absolute',
    left: 0,
  },
  emoji: {
    fontSize: 24,
  },
});
