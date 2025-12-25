/**
 * DraggableDisk component
 * A disk that can be dragged between towers
 */

import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { borderRadius, shadows } from '@/theme';
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

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);
  const lastAbsoluteX = useSharedValue(0);

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
      scale.value = withSpring(1.1);
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

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
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
        <Animated.View
          style={[
            styles.disk,
            {
              width,
              height,
              backgroundColor: disk.color,
              opacity: isTopDisk ? 1 : 0.9,
            },
          ]}
        >
          <Animated.View style={styles.highlight} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
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
