/**
 * Hills - Collines arrière et avant pour ForestBackground V10
 * Formes arrondies avec dégradés verts
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeV10Colors, HomeV10ZIndex } from '@/theme/home-v10-colors';

interface HillProps {
  left?: number;
  right?: number;
  width: number;
  height: number;
  colors: readonly [string, string];
  zIndex?: number;
}

const Hill = memo(({ left, right, width, height, colors, zIndex = 1 }: HillProps) => {
  const style = useMemo(
    () => ({
      position: 'absolute' as const,
      bottom: 0,
      ...(left !== undefined ? { left } : {}),
      ...(right !== undefined ? { right } : {}),
      width,
      height,
      borderTopLeftRadius: width / 2,
      borderTopRightRadius: width / 2,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      overflow: 'hidden' as const,
      zIndex,
    }),
    [left, right, width, height, zIndex]
  );

  return (
    <View style={style}>
      <LinearGradient
        colors={[...colors]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
});

Hill.displayName = 'Hill';

export const Hills = memo(() => {
  const { width } = useWindowDimensions();

  // Collines arrière (plus grandes, plus foncées)
  const hillsBack = useMemo(
    () => [
      { left: -150, width: 600, height: 200, colors: [HomeV10Colors.grassDark, '#4A9D5A'] as const, zIndex: 1 },
      { left: 350, width: 700, height: 170, colors: [HomeV10Colors.hillLight, HomeV10Colors.grassDark] as const, zIndex: 2 },
      { right: -200, width: 650, height: 190, colors: [HomeV10Colors.grassDark, '#4A9D5A'] as const, zIndex: 1 },
    ],
    []
  );

  // Collines avant (plus petites, plus claires)
  const hillsFront = useMemo(
    () => [
      { left: -100, width: 500, height: 130, colors: [HomeV10Colors.hillMid, HomeV10Colors.hillDark] as const, zIndex: 3 },
      { left: 300, width: 600, height: 100, colors: [HomeV10Colors.hillLight, HomeV10Colors.hillMid] as const, zIndex: 4 },
      { right: -150, width: 550, height: 120, colors: [HomeV10Colors.hillMid, HomeV10Colors.hillDark] as const, zIndex: 3 },
    ],
    []
  );

  return (
    <View style={styles.container}>
      {/* Collines arrière */}
      {hillsBack.map((hill, index) => (
        <Hill key={`back-${index}`} {...hill} />
      ))}
      {/* Collines avant */}
      {hillsFront.map((hill, index) => (
        <Hill key={`front-${index}`} {...hill} />
      ))}
    </View>
  );
});

Hills.displayName = 'Hills';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
    zIndex: HomeV10ZIndex.hills,
  },
});
