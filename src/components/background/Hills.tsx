/**
 * Hills component for Forest Background
 * 3 rolling green hills at the bottom
 */

import React, { memo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FOREST_COLORS } from '@/types/home.types';

interface HillProps {
  position: 'left' | 'center' | 'right';
}

const Hill = memo(({ position }: HillProps) => {
  const { width } = useWindowDimensions();

  const getStyle = () => {
    switch (position) {
      case 'left':
        return {
          left: -100,
          width: Math.min(500, width * 0.42),
          height: 150,
          colors: [FOREST_COLORS.hills.medium, FOREST_COLORS.hills.dark] as const,
        };
      case 'center':
        return {
          left: width * 0.25,
          width: Math.min(600, width * 0.5),
          height: 120,
          colors: [FOREST_COLORS.hills.light, FOREST_COLORS.hills.medium] as const,
        };
      case 'right':
        return {
          right: -150,
          width: Math.min(550, width * 0.46),
          height: 140,
          colors: [FOREST_COLORS.hills.medium, FOREST_COLORS.hills.dark] as const,
        };
    }
  };

  const style = getStyle();

  return (
    <LinearGradient
      colors={style.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        styles.hill,
        {
          left: style.left,
          right: style.right,
          width: style.width,
          height: style.height,
        },
      ]}
    />
  );
});

Hill.displayName = 'Hill';

export const Hills = memo(() => {
  return (
    <View style={styles.container}>
      <Hill position="left" />
      <Hill position="center" />
      <Hill position="right" />
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
    height: 150,
    zIndex: 4,
  },
  hill: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 1000,
    borderTopRightRadius: 1000,
  },
});
