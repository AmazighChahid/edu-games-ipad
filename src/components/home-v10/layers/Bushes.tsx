/**
 * Bushes - Buissons pour ForestBackground V10
 * Petites formes arrondies vertes
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeV10Colors, HomeV10ZIndex } from '../../../theme/home-v10-colors';

interface BushProps {
  left?: number;
  right?: number;
  bottom: number;
  width: number;
  height: number;
}

const Bush = memo(({ left, right, bottom, width, height }: BushProps) => {
  const style = useMemo(
    () => ({
      position: 'absolute' as const,
      bottom,
      ...(left !== undefined ? { left } : {}),
      ...(right !== undefined ? { right } : {}),
      width,
      height,
      borderRadius: width / 2,
      overflow: 'hidden' as const,
    }),
    [left, right, bottom, width, height]
  );

  return (
    <View style={style}>
      <LinearGradient
        colors={[HomeV10Colors.grassDark, '#4A9D5A']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
});

Bush.displayName = 'Bush';

export const Bushes = memo(() => {
  const bushes = useMemo(
    () => [
      { left: 60, bottom: 60, width: 40, height: 30 },
      { left: 180, bottom: 55, width: 50, height: 35 },
      { left: 400, bottom: 60, width: 35, height: 25 },
      { right: 400, bottom: 60, width: 45, height: 32 },
      { right: 220, bottom: 58, width: 38, height: 28 },
      { right: 100, bottom: 60, width: 48, height: 34 },
    ],
    []
  );

  return (
    <View style={styles.container} pointerEvents="none">
      {bushes.map((bush, index) => (
        <Bush key={index} {...bush} />
      ))}
    </View>
  );
});

Bushes.displayName = 'Bushes';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: HomeV10ZIndex.bushes,
  },
});
