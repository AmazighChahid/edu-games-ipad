/**
 * Trees component for Forest Background
 * 4 stylized trees with trunk and crown
 */

import React, { memo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FOREST_COLORS } from '../../types/home.types';

interface TreeProps {
  position: 'far-left' | 'left' | 'right' | 'far-right';
}

const Tree = memo(({ position }: TreeProps) => {
  const { width } = useWindowDimensions();

  const getStyle = () => {
    switch (position) {
      case 'far-left':
        return {
          left: 50,
          bottom: 120,
          crownWidth: 80,
          crownHeight: 100,
          trunkWidth: 18,
          trunkHeight: 50,
        };
      case 'left':
        return {
          left: 150,
          bottom: 100,
          crownWidth: 60,
          crownHeight: 75,
          trunkWidth: 14,
          trunkHeight: 40,
        };
      case 'right':
        return {
          right: 200,
          bottom: 110,
          crownWidth: 55,
          crownHeight: 70,
          trunkWidth: 12,
          trunkHeight: 35,
        };
      case 'far-right':
        return {
          right: 80,
          bottom: 130,
          crownWidth: 90,
          crownHeight: 110,
          trunkWidth: 20,
          trunkHeight: 55,
        };
    }
  };

  const style = getStyle();

  return (
    <View
      style={[
        styles.tree,
        {
          left: style.left,
          right: style.right,
          bottom: style.bottom,
        },
      ]}
    >
      {/* Crown */}
      <LinearGradient
        colors={FOREST_COLORS.trees.crown}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.crown,
          {
            width: style.crownWidth,
            height: style.crownHeight,
            marginBottom: style.trunkHeight - 5,
          },
        ]}
      />
      {/* Trunk */}
      <LinearGradient
        colors={FOREST_COLORS.trees.trunk}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.trunk,
          {
            width: style.trunkWidth,
            height: style.trunkHeight,
          },
        ]}
      />
    </View>
  );
});

Tree.displayName = 'Tree';

export const Trees = memo(() => {
  return (
    <View style={styles.container}>
      <Tree position="far-left" />
      <Tree position="left" />
      <Tree position="right" />
      <Tree position="far-right" />
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
    zIndex: 5,
    pointerEvents: 'none',
  },
  tree: {
    position: 'absolute',
    alignItems: 'center',
  },
  crown: {
    borderTopLeftRadius: 1000,
    borderTopRightRadius: 1000,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  trunk: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 3,
  },
});
