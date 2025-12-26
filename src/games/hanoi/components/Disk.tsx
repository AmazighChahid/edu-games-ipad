/**
 * Disk component
 * Flat design with subtle highlight/reflection
 */

import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { colors, borderRadius } from '@/theme';
import type { Disk as DiskType } from '../types';

interface DiskProps {
  disk: DiskType;
  maxWidth: number;
  minWidth: number;
  height: number;
  isSelected: boolean;
  totalDisks: number;
}

// Get disk color based on size (1 = smallest)
const getDiskColor = (size: number): string => {
  const diskColors: Record<number, string> = {
    1: colors.game.disk1, // Red (smallest)
    2: colors.game.disk2, // Orange
    3: colors.game.disk3, // Yellow
    4: colors.game.disk4, // Green
    5: colors.game.disk5, // Cyan
    6: colors.game.disk6, // Purple
    7: colors.game.disk7, // Blue (largest)
  };
  return diskColors[size] || colors.game.disk1;
};

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
  const diskColor = getDiskColor(disk.size);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isSelected ? 1.05 : 1, { damping: 15 }) },
      { translateY: withSpring(isSelected ? -10 : 0, { damping: 15 }) },
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
            backgroundColor: diskColor,
          },
          isSelected && styles.diskSelected,
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  disk: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  diskSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
