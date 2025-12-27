/**
 * GameBackground component
 * Immersive animated nature background reusing home page animations
 * Child-friendly design for "La Tour Magique" theme
 */

import { memo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useReducedMotion } from 'react-native-reanimated';

// Import animated components from home background
import { AnimatedClouds } from '../../../components/background/AnimatedCloud';
import { Trees } from '../../../components/background/Trees';
import { Flowers } from '../../../components/background/Flowers';
import {
  Butterflies,
  Birds,
  Bee,
  Ladybug,
} from '../../../components/background/animals';

interface GameBackgroundProps {
  children: React.ReactNode;
}

// Color palette - same as ForestBackground
const COLORS = {
  sky: ['#87CEEB', '#B0E0E6', '#98D9A8', '#7BC74D'] as const,
  grass: ['#7BC74D', '#5BAE6B'] as const,
};

export const GameBackground = memo(({ children }: GameBackgroundProps) => {
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const grassHeight = Math.max(60, height * 0.08);

  return (
    <View style={styles.container}>
      {/* Sky gradient background */}
      <LinearGradient
        colors={COLORS.sky as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.25, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Background elements layer */}
      <View style={[styles.backgroundLayer, { width, height }]} pointerEvents="none">
        {/* Trees from home background */}
        <Trees />

        {/* Flowers from home background */}
        <Flowers />

        {/* Animated elements - only if motion not reduced */}
        {!reducedMotion && (
          <>
            <AnimatedClouds />
            <Butterflies />
            <Birds />
            <Bee />
            <Ladybug />
          </>
        )}
      </View>

      {/* Grass at the bottom */}
      <LinearGradient
        colors={COLORS.grass as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.grass, { height: grassHeight }]}
        pointerEvents="none"
      />

      {/* Content - children rendered on top */}
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
});

GameBackground.displayName = 'GameBackground';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  content: {
    flex: 1,
    zIndex: 20,
  },
  grass: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
});
