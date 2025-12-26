/**
 * Sun component for Forest Background
 * Animated sun with pulse and glow effect
 */

import React, { memo, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { FOREST_COLORS, ANIMATION_DURATIONS } from '@/types/home.types';

export const Sun = memo(() => {
  const { width } = useWindowDimensions();
  const scale = useSharedValue(1);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Sun pulse animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: ANIMATION_DURATIONS.sunPulse / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: ANIMATION_DURATIONS.sunPulse / 2,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    // Glow animation
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.2, {
          duration: ANIMATION_DURATIONS.sunGlow,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: ANIMATION_DURATIONS.sunGlow,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: ANIMATION_DURATIONS.sunGlow,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.5, {
          duration: ANIMATION_DURATIONS.sunGlow,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, [reducedMotion]);

  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.container, { right: width * 0.08 }]}>
      {/* Outer glow */}
      <Animated.View style={[styles.glow, glowStyle]} />
      {/* Sun body */}
      <Animated.View style={[styles.sun, sunStyle]}>
        <View style={styles.sunCore} />
      </Animated.View>
    </View>
  );
});

Sun.displayName = 'Sun';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  sun: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: FOREST_COLORS.sun.core,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: FOREST_COLORS.sun.core,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },
  sunCore: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: FOREST_COLORS.sun.outer,
    opacity: 0.6,
  },
  glow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: FOREST_COLORS.sun.glow,
  },
});
