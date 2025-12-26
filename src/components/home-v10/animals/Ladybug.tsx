/**
 * Ladybug - Coccinelle animée qui marche sur le sol
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { HomeV10ZIndex } from '@/theme/home-v10-colors';

export const Ladybug = memo(() => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const duration = 30000; // 30 seconds for full cycle

  useEffect(() => {
    if (reducedMotion) return;

    // Wandering pattern
    translateX.value = withRepeat(
      withSequence(
        withTiming(80, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
        withTiming(40, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
        withTiming(100, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [reducedMotion, duration, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.ladybug, animatedStyle]}>
        <Text style={styles.ladybugEmoji}>🐞</Text>
      </Animated.View>
    </View>
  );
});

Ladybug.displayName = 'Ladybug';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: HomeV10ZIndex.animals,
  },
  ladybug: {
    position: 'absolute',
    bottom: 100,
    left: 350,
  },
  ladybugEmoji: {
    fontSize: 16,
  },
});
