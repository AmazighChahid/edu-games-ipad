/**
 * Clouds - Nuages animés pour ForestBackground V10
 * 4 nuages qui traversent l'écran de gauche à droite
 */

import React, { memo, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { HomeV10ZIndex, HomeV10Animations } from '../../../theme/home-v10-colors';

interface CloudProps {
  size: 'small' | 'medium' | 'large';
  top: number;
  delay?: number;
  durationIndex?: 0 | 1 | 2 | 3;
}

interface CloudDimension {
  width: number;
  height: number;
  beforeWidth: number;
  beforeHeight: number;
  afterWidth?: number;
  afterHeight?: number;
}

const cloudDimensions: Record<'small' | 'medium' | 'large', CloudDimension> = {
  small: { width: 70, height: 28, beforeWidth: 44, beforeHeight: 28 },
  medium: { width: 100, height: 40, beforeWidth: 60, beforeHeight: 40, afterWidth: 40, afterHeight: 30 },
  large: { width: 120, height: 48, beforeWidth: 70, beforeHeight: 48, afterWidth: 50, afterHeight: 35 },
};

const Cloud = memo(({ size, top, delay = 0, durationIndex = 0 }: CloudProps) => {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(-150);
  const reducedMotion = useReducedMotion();

  const d = cloudDimensions[size];
  const duration = HomeV10Animations.cloudMove[durationIndex];

  useEffect(() => {
    if (reducedMotion) return;

    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(width + 200, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [reducedMotion, width, delay, duration, translateX]);

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
      {/* Main bump */}
      <View
        style={[
          styles.cloudBump,
          {
            width: d.beforeWidth,
            height: d.beforeHeight,
            top: -d.beforeHeight / 2,
            left: d.width * 0.25,
          },
        ]}
      />
      {/* Secondary bump for medium/large clouds */}
      {(size === 'large' || size === 'medium') && d.afterWidth && (
        <View
          style={[
            styles.cloudBump,
            {
              width: d.afterWidth,
              height: d.afterHeight!,
              top: -d.afterHeight! / 2.5,
              left: d.width * 0.6,
            },
          ]}
        />
      )}
    </Animated.View>
  );
});

Cloud.displayName = 'Cloud';

export const Clouds = memo(() => {
  return (
    <View style={styles.container} pointerEvents="none">
      <Cloud size="medium" top={50} delay={0} durationIndex={0} />
      <Cloud size="small" top={100} delay={8000} durationIndex={1} />
      <Cloud size="large" top={30} delay={15000} durationIndex={2} />
      <Cloud size="medium" top={140} delay={22000} durationIndex={3} />
    </View>
  );
});

Clouds.displayName = 'Clouds';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: HomeV10ZIndex.clouds,
    overflow: 'hidden',
  },
  cloud: {
    position: 'absolute',
    left: -150,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
  },
  cloudBump: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
  },
});
