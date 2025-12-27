/**
 * AnimatedCloud component for Forest Background
 * 3 clouds floating across the sky
 */

import React, { memo, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { FOREST_COLORS, ANIMATION_DURATIONS } from '../../types/home.types';

interface CloudProps {
  size: 'small' | 'medium' | 'large';
  top: number;
  delay?: number;
  durationIndex?: 0 | 1 | 2;
}

const Cloud = memo(({ size, top, delay = 0, durationIndex = 0 }: CloudProps) => {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(-150);
  const reducedMotion = useReducedMotion();

  const dimensions = {
    small: { width: 80, height: 32, beforeWidth: 50, beforeHeight: 32 },
    medium: { width: 100, height: 40, beforeWidth: 60, beforeHeight: 40 },
    large: { width: 120, height: 45, beforeWidth: 70, beforeHeight: 45 },
  };

  const d = dimensions[size];
  const duration = ANIMATION_DURATIONS.cloudMove[durationIndex];

  useEffect(() => {
    if (reducedMotion) return;

    const timeout = setTimeout(() => {
      translateX.value = withRepeat(
        withTiming(width + 200, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [reducedMotion, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.cloud,
        { top, width: d.width, height: d.height },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.cloudBefore,
          {
            width: d.beforeWidth,
            height: d.beforeHeight,
            top: -d.beforeHeight / 2,
            left: d.width * 0.25,
          },
        ]}
      />
      {size === 'large' && (
        <View
          style={[
            styles.cloudAfter,
            {
              width: d.beforeWidth * 0.7,
              height: d.beforeHeight * 0.75,
              top: -d.beforeHeight / 3,
              left: d.width * 0.55,
            },
          ]}
        />
      )}
    </Animated.View>
  );
});

Cloud.displayName = 'Cloud';

export const AnimatedClouds = memo(() => {
  return (
    <View style={styles.container}>
      <Cloud size="large" top={50} delay={0} durationIndex={0} />
      <Cloud size="medium" top={90} delay={5000} durationIndex={1} />
      <Cloud size="large" top={40} delay={10000} durationIndex={2} />
    </View>
  );
});

AnimatedClouds.displayName = 'AnimatedClouds';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 3,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  cloud: {
    position: 'absolute',
    left: -150,
    backgroundColor: FOREST_COLORS.cloud,
    borderRadius: 50,
    opacity: 0.9,
  },
  cloudBefore: {
    position: 'absolute',
    backgroundColor: FOREST_COLORS.cloud,
    borderRadius: 50,
  },
  cloudAfter: {
    position: 'absolute',
    backgroundColor: FOREST_COLORS.cloud,
    borderRadius: 30,
  },
});
