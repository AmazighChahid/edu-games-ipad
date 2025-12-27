/**
 * Trees - Arbres multicouches pour ForestBackground V10
 * 3 couches: loin (petits, foncés), milieu, proche (grands, clairs)
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeV10Colors, HomeV10ZIndex } from '../../../theme/home-v10-colors';

interface TreeProps {
  left?: number;
  right?: number;
  bottom: number;
  size: 'far' | 'mid' | 'near';
}

const treeSizes = {
  far: {
    trunkWidth: 8,
    trunkHeight: 25,
    crownWidth: 35,
    crownHeight: 50,
    crownColors: [HomeV10Colors.treeFar, '#1D4A2F'] as const,
  },
  mid: {
    trunkWidth: 12,
    trunkHeight: 35,
    crownWidth: 55,
    crownHeight: 70,
    crownColors: [HomeV10Colors.treeMid, HomeV10Colors.treeDark] as const,
  },
  near: {
    trunkWidth: 18,
    trunkHeight: 50,
    crownWidth: 80,
    crownHeight: 100,
    crownColors: [HomeV10Colors.treeLight, HomeV10Colors.treeMid] as const,
  },
};

const Tree = memo(({ left, right, bottom, size }: TreeProps) => {
  const s = treeSizes[size];

  const containerStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      bottom,
      ...(left !== undefined ? { left } : {}),
      ...(right !== undefined ? { right } : {}),
      alignItems: 'center' as const,
    }),
    [left, right, bottom]
  );

  const crownStyle = useMemo(
    () => ({
      width: s.crownWidth,
      height: s.crownHeight,
      borderRadius: s.crownWidth / 2,
      overflow: 'hidden' as const,
      marginBottom: -s.trunkHeight * 0.3,
    }),
    [s]
  );

  const trunkStyle = useMemo(
    () => ({
      width: s.trunkWidth,
      height: s.trunkHeight,
      backgroundColor: HomeV10Colors.trunkMid,
      borderRadius: s.trunkWidth / 4,
    }),
    [s]
  );

  return (
    <View style={containerStyle}>
      {/* Crown */}
      <View style={crownStyle}>
        <LinearGradient
          colors={[...s.crownColors]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {/* Trunk */}
      <View style={trunkStyle} />
    </View>
  );
});

Tree.displayName = 'Tree';

export const Trees = memo(() => {
  // Arbres loin (petits, plus foncés)
  const treesFar = useMemo(
    () => [
      { left: 80, bottom: 160 },
      { left: 160, bottom: 155 },
      { left: 220, bottom: 165 },
      { right: 250, bottom: 160 },
      { right: 180, bottom: 158 },
      { right: 100, bottom: 162 },
    ],
    []
  );

  // Arbres milieu
  const treesMid = useMemo(
    () => [
      { left: 40, bottom: 120 },
      { left: 130, bottom: 115 },
      { right: 300, bottom: 118 },
      { right: 140, bottom: 120 },
      { right: 60, bottom: 125 },
    ],
    []
  );

  // Arbres proches (grands)
  const treesNear = useMemo(
    () => [
      { left: 20, bottom: 80 },
      { left: 120, bottom: 75 },
      { right: 350, bottom: 85 },
      { right: 80, bottom: 80 },
      { right: 180, bottom: 78 },
    ],
    []
  );

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Arbres loin */}
      {treesFar.map((tree, index) => (
        <Tree key={`far-${index}`} size="far" {...tree} />
      ))}
      {/* Arbres milieu */}
      {treesMid.map((tree, index) => (
        <Tree key={`mid-${index}`} size="mid" {...tree} />
      ))}
      {/* Arbres proches */}
      {treesNear.map((tree, index) => (
        <Tree key={`near-${index}`} size="near" {...tree} />
      ))}
    </View>
  );
});

Trees.displayName = 'Trees';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: HomeV10ZIndex.trees,
  },
});
