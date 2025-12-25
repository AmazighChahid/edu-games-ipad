/**
 * Disk component
 * Visual representation of a Hanoi disk
 */

import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { colors, borderRadius, shadows } from '@/theme';
import type { Disk as DiskType } from '../types';

interface DiskProps {
  disk: DiskType;
  maxWidth: number;
  minWidth: number;
  height: number;
  isSelected: boolean;
  totalDisks: number;
}

export function Disk({
  disk,
  maxWidth,
  minWidth,
  height,
  isSelected,
  totalDisks,
}: DiskProps) {
  const widthRange = maxWidth - minWidth;
  const width = minWidth + (widthRange * disk.size) / totalDisks;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isSelected ? 1.05 : 1, { damping: 15 }) },
      { translateY: withSpring(isSelected ? -8 : 0, { damping: 15 }) },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.disk,
          {
            width,
            height,
            backgroundColor: disk.color,
          },
          isSelected && styles.diskSelected,
        ]}
      >
        <View style={styles.highlight} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  disk: {
    borderRadius: borderRadius.md,
    ...shadows.md,
    overflow: 'hidden',
  },
  diskSelected: {
    ...shadows.lg,
  },
  highlight: {
    position: 'absolute',
    top: 4,
    left: 8,
    right: 8,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.sm,
  },
});
