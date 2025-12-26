/**
 * ForestBackgroundV10 - Main animated forest background component for Home V10
 * Assembles all background layers: sky, sun, clouds, mountains, hills, trees, bushes, garden, animals
 */

import React, { memo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import {
  Sky,
  Sun,
  Clouds,
  MountainsFar,
  MountainsNear,
  Hills,
  Trees,
  Bushes,
  Garden,
} from './layers';

import {
  Birds,
  Butterflies,
  Squirrel,
  Rabbit,
  Bee,
  Ladybug,
} from './animals';

interface ForestBackgroundV10Props {
  children?: React.ReactNode;
}

export const ForestBackgroundV10 = memo(({ children }: ForestBackgroundV10Props) => {
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();

  return (
    <View style={styles.container}>
      {/* Background layer - fixed position, covers entire screen */}
      <View style={[styles.backgroundLayer, { width, height }]} pointerEvents="none">
        {/* Sky gradient - base layer */}
        <Sky />

        {/* Sun with pulse animation */}
        <Sun />

        {/* Mountains - far layer (behind clouds) */}
        <MountainsFar />

        {/* Mountains - near layer */}
        <MountainsNear />

        {/* Animated clouds (if motion not reduced) */}
        {!reducedMotion && <Clouds />}

        {/* Hills - multiple layers for depth */}
        <Hills />

        {/* Trees - 3 depth layers */}
        <Trees />

        {/* Bushes */}
        <Bushes />

        {/* Garden with animated flowers */}
        <Garden />

        {/* Animated animals (if motion not reduced) */}
        {!reducedMotion && (
          <>
            <Birds />
            <Butterflies />
            <Squirrel />
            <Rabbit />
            <Bee />
            <Ladybug />
          </>
        )}
      </View>

      {/* Content layer - scrollable, above background */}
      {children && (
        <View style={styles.contentLayer} pointerEvents="box-none">
          {children}
        </View>
      )}
    </View>
  );
});

ForestBackgroundV10.displayName = 'ForestBackgroundV10';

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
    zIndex: 30,
  },
});
