/**
 * Butterflies - Papillons animés autour du jardin
 * 3 papillons avec mouvement flottant aléatoire
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
import { HomeV10ZIndex, HomeV10Animations } from '@/theme/home-v10-colors';

interface ButterflyProps {
  delay: number;
  durationIndex: 0 | 1 | 2;
  startX: number;
  startY: number;
}

const Butterfly = memo(({ delay, durationIndex, startX, startY }: ButterflyProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(-5);
  const reducedMotion = useReducedMotion();

  const duration = HomeV10Animations.butterflyFly[durationIndex];

  useEffect(() => {
    if (reducedMotion) return;

    const timeout = setTimeout(() => {
      // Complex floating path
      translateX.value = withRepeat(
        withSequence(
          withTiming(30, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
          withTiming(-20, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
          withTiming(25, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      translateY.value = withRepeat(
        withSequence(
          withTiming(-25, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
          withTiming(-40, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
          withTiming(-15, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      rotate.value = withRepeat(
        withSequence(
          withTiming(8, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
          withTiming(-3, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
          withTiming(10, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
          withTiming(-5, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [reducedMotion, delay, duration, translateX, translateY, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.butterfly, { left: startX, bottom: startY }, animatedStyle]}>
      <Text style={styles.butterflyEmoji}>🦋</Text>
    </Animated.View>
  );
});

Butterfly.displayName = 'Butterfly';

export const Butterflies = memo(() => {
  const { width } = useWindowDimensions();
  const centerX = width / 2;

  return (
    <View style={styles.container} pointerEvents="none">
      <Butterfly delay={0} durationIndex={0} startX={centerX - 120} startY={140} />
      <Butterfly delay={3000} durationIndex={1} startX={centerX + 100} startY={160} />
      <Butterfly delay={6000} durationIndex={2} startX={centerX - 40} startY={180} />
    </View>
  );
});

Butterflies.displayName = 'Butterflies';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
    zIndex: HomeV10ZIndex.animals,
  },
  butterfly: {
    position: 'absolute',
  },
  butterflyEmoji: {
    fontSize: 26,
  },
});
