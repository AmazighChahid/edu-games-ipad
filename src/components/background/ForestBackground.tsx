/**
 * ForestBackground - Main animated forest background component
 * Assembles all background elements: sky, mountains, hills, trees, flowers, sun, clouds, and animals
 */

import React, { memo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useReducedMotion } from 'react-native-reanimated';

import { FOREST_COLORS } from '@/types/home.types';
import { Mountains } from './Mountains';
import { Hills } from './Hills';
import { Trees } from './Trees';
import { Flowers } from './Flowers';
import { Sun } from './Sun';
import { AnimatedClouds } from './AnimatedCloud';
import {
  Butterflies,
  Birds,
  Squirrel,
  Rabbit,
  Bee,
  Ladybug,
  Dragonfly,
} from './animals';

interface ForestBackgroundProps {
  children?: React.ReactNode;
}

export const ForestBackground = memo(({ children }: ForestBackgroundProps) => {
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();

  return (
    <View style={styles.container}>
      {/* Sky gradient - always visible */}
      <LinearGradient
        colors={['#87CEEB', '#B0E0E6', '#98D9A8', '#7BC74D']}
        locations={[0, 0.25, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Background layer - fixed position */}
      <View style={[styles.backgroundLayer, { width, height }]} pointerEvents="none">
        {/* Static elements */}
        <Mountains />
        <Hills />
        <Trees />
        <Flowers />

        {/* Animated elements - only if motion not reduced */}
        <Sun />
        {!reducedMotion && (
          <>
            <AnimatedClouds />
            <Butterflies />
            <Birds />
            <Squirrel />
            <Rabbit />
            <Bee />
            <Ladybug />
            <Dragonfly />
          </>
        )}
      </View>

      {/* Content layer - scrollable */}
      {children && (
        <View style={styles.contentLayer} pointerEvents="box-none">
          {children}
        </View>
      )}
    </View>
  );
});

ForestBackground.displayName = 'ForestBackground';

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
  },
  contentLayer: {
    flex: 1,
    position: 'relative',
    zIndex: 20,
  },
});
