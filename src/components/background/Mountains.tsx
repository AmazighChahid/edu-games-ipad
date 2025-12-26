/**
 * Mountains component for Forest Background
 * 4 mountains with triangular shapes and snow caps
 */

import React, { memo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { FOREST_COLORS } from '@/types/home.types';

interface MountainProps {
  position: 'left' | 'center-left' | 'center-right' | 'right';
  color: string;
  hasSnow?: boolean;
}

const Mountain = memo(({ position, color, hasSnow }: MountainProps) => {
  const { width } = useWindowDimensions();

  const getPositionStyle = () => {
    switch (position) {
      case 'left':
        return {
          left: -50,
          borderLeftWidth: 180,
          borderRightWidth: 180,
          borderBottomWidth: 160,
        };
      case 'center-left':
        return {
          left: width * 0.17,
          borderLeftWidth: 220,
          borderRightWidth: 220,
          borderBottomWidth: 200,
        };
      case 'center-right':
        return {
          right: width * 0.08,
          borderLeftWidth: 200,
          borderRightWidth: 200,
          borderBottomWidth: 180,
        };
      case 'right':
        return {
          right: -100,
          borderLeftWidth: 250,
          borderRightWidth: 250,
          borderBottomWidth: 220,
        };
    }
  };

  const posStyle = getPositionStyle();

  return (
    <View
      style={[
        styles.mountain,
        {
          left: posStyle.left,
          right: posStyle.right,
          borderLeftWidth: posStyle.borderLeftWidth,
          borderRightWidth: posStyle.borderRightWidth,
          borderBottomWidth: posStyle.borderBottomWidth,
          borderBottomColor: color,
        },
      ]}
    >
      {hasSnow && (
        <View
          style={[
            styles.snow,
            {
              bottom: posStyle.borderBottomWidth - 60,
              left: -60,
            },
          ]}
        />
      )}
    </View>
  );
});

Mountain.displayName = 'Mountain';

export const Mountains = memo(() => {
  return (
    <View style={styles.container}>
      <Mountain position="left" color={FOREST_COLORS.mountains.light} />
      <Mountain
        position="center-left"
        color={FOREST_COLORS.mountains.medium}
        hasSnow
      />
      <Mountain position="center-right" color={FOREST_COLORS.mountains.light} />
      <Mountain position="right" color={FOREST_COLORS.mountains.dark} />
    </View>
  );
});

Mountains.displayName = 'Mountains';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 1,
  },
  mountain: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopWidth: 0,
  },
  snow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 60,
    borderRightWidth: 60,
    borderBottomWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: FOREST_COLORS.mountains.snow,
  },
});
