/**
 * Birds - Oiseaux animés volant à travers l'écran
 * 3 oiseaux avec différentes vitesses et hauteurs
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { HomeV10ZIndex, HomeV10Animations } from '../../../theme/home-v10-colors';

interface BirdProps {
  emoji: string;
  top: number;
  delay: number;
  durationIndex: 0 | 1 | 2;
}

const Bird = memo(({ emoji, top, delay, durationIndex }: BirdProps) => {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(-50);
  const opacity = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const duration = HomeV10Animations.birdFly[durationIndex];

  useEffect(() => {
    if (reducedMotion) return;

    const animate = () => {
      translateX.value = -50;
      opacity.value = 0;

      // Fade in, stay visible, fade out
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: duration * 0.03 }),
          withTiming(1, { duration: duration * 0.94 }),
          withTiming(0, { duration: duration * 0.03 })
        )
      );

      // Fly across screen
      translateX.value = withDelay(
        delay,
        withTiming(width + 100, {
          duration,
          easing: Easing.linear,
        })
      );
    };

    animate();
    const interval = setInterval(animate, duration + delay + 2000);
    return () => clearInterval(interval);
  }, [reducedMotion, width, delay, duration, translateX, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.bird, { top }, animatedStyle]}>
      <Text style={styles.birdEmoji}>{emoji}</Text>
    </Animated.View>
  );
});

Bird.displayName = 'Bird';

export const Birds = memo(() => {
  return (
    <View style={styles.container} pointerEvents="none">
      <Bird emoji="🐦" top={80} delay={0} durationIndex={0} />
      <Bird emoji="🐦‍" top={130} delay={5000} durationIndex={1} />
      <Bird emoji="🐦" top={60} delay={12000} durationIndex={2} />
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
    height: 200,
    zIndex: HomeV10ZIndex.animals,
  },
  bird: {
    position: 'absolute',
    left: -50,
  },
  birdEmoji: {
    fontSize: 22,
  },
});
