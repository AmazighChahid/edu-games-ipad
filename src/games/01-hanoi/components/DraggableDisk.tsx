/**
 * DraggableDisk component
 * Clean flat design with subtle depth
 * Child-friendly colors for 6-10 year olds
 */

import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

import type { Disk as DiskType, TowerId } from '../types';

interface DraggableDiskProps {
  disk: DiskType;
  maxWidth: number;
  minWidth: number;
  height: number;
  isTopDisk: boolean;
  totalDisks: number;
  towerCenters: number[];
  towerWidth: number;
  onDragStart: () => void;
  onDragEnd: (targetTower: TowerId | null) => void;
}

// Vibrant flat colors - child-friendly palette
const DISK_COLORS: Record<number, { main: string; light: string; dark: string }> = {
  1: { main: '#FF6B6B', light: '#FF8A8A', dark: '#E85555' }, // Red (smallest)
  2: { main: '#FFA94D', light: '#FFB96A', dark: '#E89540' }, // Orange
  3: { main: '#FFE066', light: '#FFE88A', dark: '#E6CA5A' }, // Yellow
  4: { main: '#69DB7C', light: '#8AE69A', dark: '#55C266' }, // Green
  5: { main: '#4ECDC4', light: '#6ED7D0', dark: '#3DB8B0' }, // Teal
  6: { main: '#74C0FC', light: '#94CFFD', dark: '#5AABE6' }, // Blue
  7: { main: '#B197FC', light: '#C4ADFD', dark: '#9A80E6' }, // Purple (largest)
};

const getDiskColors = (size: number) => {
  return DISK_COLORS[size] || DISK_COLORS[1];
};

export function DraggableDisk({
  disk,
  maxWidth,
  minWidth,
  height,
  isTopDisk,
  totalDisks,
  towerCenters,
  towerWidth,
  onDragStart,
  onDragEnd,
}: DraggableDiskProps) {
  const widthRange = maxWidth - minWidth;
  const width = minWidth + (widthRange * disk.size) / totalDisks;
  const diskHeight = height;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);
  const lastAbsoluteX = useSharedValue(0);

  const colors = getDiskColors(disk.size);

  const handleDragEnd = (absoluteX: number) => {
    // Find the closest tower to where the disk was dropped
    console.log('Drop debug:', { absoluteX, towerCenters });

    if (towerCenters[0] === 0 && towerCenters[1] === 0 && towerCenters[2] === 0) {
      // Tower centers not initialized yet
      console.log('Tower centers not initialized');
      onDragEnd(null);
      return;
    }

    let closestTower: TowerId = 0;
    let closestDistance = Math.abs(absoluteX - towerCenters[0]);

    for (let i = 1; i < towerCenters.length; i++) {
      const distance = Math.abs(absoluteX - towerCenters[i]);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestTower = i as TowerId;
      }
    }

    console.log('Closest tower:', closestTower, 'distance:', closestDistance);
    onDragEnd(closestTower);
  };

  const panGesture = Gesture.Pan()
    .enabled(isTopDisk)
    .onStart(() => {
      'worklet';
      zIndex.value = 100;
      scale.value = withSpring(1.05, { damping: 15 });
      runOnJS(onDragStart)();
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      lastAbsoluteX.value = event.absoluteX;
    })
    .onEnd(() => {
      'worklet';
      const finalX = lastAbsoluteX.value;

      translateX.value = withSpring(0, { damping: 25, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 25, stiffness: 300 });
      scale.value = withSpring(1, { damping: 20 });
      zIndex.value = 0;

      runOnJS(handleDragEnd)(finalX);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={[styles.diskWrapper, { width, height: diskHeight }]}>
          {/* Main disk - flat design with subtle gradient */}
          <LinearGradient
            colors={[colors.light, colors.main]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
            style={[styles.disk, { borderRadius: diskHeight / 2 }]}
          />

          {/* Bottom edge for depth */}
          <View
            style={[
              styles.diskBottom,
              {
                width,
                height: 4,
                backgroundColor: colors.dark,
                borderBottomLeftRadius: diskHeight / 2,
                borderBottomRightRadius: diskHeight / 2,
              }
            ]}
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  diskWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  disk: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  diskBottom: {
    position: 'absolute',
    bottom: -2,
  },
});
