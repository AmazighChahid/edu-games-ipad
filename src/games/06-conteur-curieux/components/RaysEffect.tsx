/**
 * RaysEffect Component
 *
 * Effet de rayons lumineux rotatifs
 * Utilisé sur l'écran de victoire derrière le titre
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface RaysEffectProps {
  size?: number;
  color?: string;
  rayCount?: number;
  duration?: number;
}

export function RaysEffect({
  size = 300,
  color = 'rgba(255, 255, 255, 0.3)',
  rayCount = 12,
  duration = 15000,
}: RaysEffectProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration, easing: Easing.linear }),
      -1, // Infinite
      false
    );
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Generate rays
  const rays = [];
  const angleStep = 360 / rayCount;

  for (let i = 0; i < rayCount; i++) {
    const angle = i * angleStep;
    rays.push(
      <View
        key={i}
        style={[
          styles.ray,
          {
            backgroundColor: color,
            height: size / 2,
            transform: [{ rotate: `${angle}deg` }],
          },
        ]}
      />
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size },
        animatedStyle,
      ]}
    >
      {rays}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ray: {
    position: 'absolute',
    width: 4,
    borderRadius: 2,
    transformOrigin: 'center bottom',
    bottom: '50%',
  },
});

export default RaysEffect;
