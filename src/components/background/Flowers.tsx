/**
 * Flowers component for Forest Background
 * 5 animated flowers swaying in the breeze
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { ANIMATION_DURATIONS } from '../../types/home.types';

interface FlowerProps {
  emoji: string;
  left?: number;
  right?: number;
  bottom: number;
  delay?: number;
}

const Flower = memo(({ emoji, left, right, bottom, delay = 0 }: FlowerProps) => {
  const rotation = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const timeout = setTimeout(() => {
      rotation.value = withRepeat(
        withSequence(
          withTiming(-5, {
            duration: ANIMATION_DURATIONS.flowerSway / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(5, {
            duration: ANIMATION_DURATIONS.flowerSway / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        styles.flower,
        { left, right, bottom },
        animatedStyle,
      ]}
    >
      <Text style={styles.flowerEmoji}>{emoji}</Text>
    </Animated.View>
  );
});

Flower.displayName = 'Flower';

export const Flowers = memo(() => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Flower emoji="🌸" left={100} bottom={125} delay={0} />
      <Flower emoji="🌼" left={250} bottom={115} delay={500} />
      <Flower emoji="🌷" right={300} bottom={130} delay={1000} />
      <Flower emoji="🌻" right={150} bottom={120} delay={1500} />
      <Flower emoji="🌺" left={width * 0.35} bottom={110} delay={300} />
    </View>
  );
});

Flowers.displayName = 'Flowers';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 6,
    pointerEvents: 'none',
  },
  flower: {
    position: 'absolute',
    transformOrigin: 'bottom center',
  },
  flowerEmoji: {
    fontSize: 20,
  },
});
