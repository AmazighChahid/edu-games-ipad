/**
 * Bee - Abeille animée qui vole à travers l'écran en zigzag
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { HomeV10ZIndex, HomeV10Animations } from '../../../theme/home-v10-colors';

export const Bee = memo(() => {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const duration = HomeV10Animations.beeFly;
  const segmentDuration = duration / 5;

  useEffect(() => {
    if (reducedMotion) return;

    const animate = () => {
      translateX.value = 0;
      translateY.value = 0;
      opacity.value = 0;

      // Fade in and out
      opacity.value = withSequence(
        withTiming(1, { duration: segmentDuration * 0.25 }),
        withTiming(1, { duration: duration * 0.9 }),
        withTiming(0, { duration: segmentDuration * 0.25 })
      );

      // Zigzag horizontal movement
      translateX.value = withSequence(
        withTiming(250, { duration: segmentDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(500, { duration: segmentDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(750, { duration: segmentDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(1000, { duration: segmentDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(width + 50, { duration: segmentDuration, easing: Easing.inOut(Easing.ease) })
      );

      // Vertical zigzag
      translateY.value = withSequence(
        withTiming(-40, { duration: segmentDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(30, { duration: segmentDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-50, { duration: segmentDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(20, { duration: segmentDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: segmentDuration, easing: Easing.inOut(Easing.ease) })
      );
    };

    animate();
    const interval = setInterval(animate, duration + 5000);
    return () => clearInterval(interval);
  }, [reducedMotion, width, duration, segmentDuration, translateX, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.bee, animatedStyle]}>
        <Text style={styles.beeEmoji}>🐝</Text>
      </Animated.View>
    </View>
  );
});

Bee.displayName = 'Bee';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: HomeV10ZIndex.animals,
  },
  bee: {
    position: 'absolute',
    top: 250,
    left: -35,
  },
  beeEmoji: {
    fontSize: 20,
  },
});
