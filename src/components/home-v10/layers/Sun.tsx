/**
 * Sun - Soleil animé avec effet pulse pour ForestBackground V10
 * Animation de pulsation douce + glow
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
import {
  HomeV10Colors,
  HomeV10ZIndex,
  HomeV10Animations,
} from '@/theme/home-v10-colors';

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
        withTiming(1.08, {
          duration: HomeV10Animations.sunPulse / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: HomeV10Animations.sunPulse / 2,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    // Glow animation
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.3, {
          duration: HomeV10Animations.sunGlow,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: HomeV10Animations.sunGlow,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: HomeV10Animations.sunGlow,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.5, {
          duration: HomeV10Animations.sunGlow,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, [reducedMotion, scale, glowScale, glowOpacity]);

  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.container, { right: width * 0.1 }]}>
      {/* Outer glow */}
      <Animated.View style={[styles.glow, glowStyle]} />
      {/* Sun body with radial gradient effect */}
      <Animated.View style={[styles.sun, sunStyle]}>
        <View style={styles.sunInner} />
      </Animated.View>
    </View>
  );
});

Sun.displayName = 'Sun';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: HomeV10ZIndex.sun,
  },
  glow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: HomeV10Colors.sunGlow,
  },
  sun: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: HomeV10Colors.sunCore,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: HomeV10Colors.sunCore,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },
  sunInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: HomeV10Colors.sunMid,
    opacity: 0.7,
  },
});
