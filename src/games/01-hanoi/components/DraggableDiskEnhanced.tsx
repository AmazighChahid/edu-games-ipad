/**
 * DraggableDiskEnhanced component
 * Enhanced disk with shimmer, glow, pulsation and dynamic shadows
 * Child-friendly design for 6-10 year olds
 */

import { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useSound } from '../../../hooks/useSound';
import type { Disk as DiskType, TowerId } from '../types';

interface DraggableDiskEnhancedProps {
  disk: DiskType;
  maxWidth: number;
  minWidth: number;
  height: number;
  isTopDisk: boolean;
  isSelectable?: boolean;
  totalDisks: number;
  towerCenters: number[];
  towerWidth: number;
  onDragStart: () => void;
  onDragEnd: (targetTower: TowerId | null) => void;
  hasMovedOnce: boolean;
}

// Vibrant flat colors - child-friendly palette
const DISK_COLORS: Record<number, { main: string; light: string }> = {
  1: { main: '#FF6B6B', light: '#FF8A8A' },
  2: { main: '#FFA94D', light: '#FFB96A' },
  3: { main: '#FFE066', light: '#FFE88A' },
  4: { main: '#69DB7C', light: '#8AE69A' },
  5: { main: '#4ECDC4', light: '#6ED7D0' },
  6: { main: '#74C0FC', light: '#94CFFD' },
  7: { main: '#B197FC', light: '#C4ADFD' },
};

const getDiskColors = (size: number) => {
  return DISK_COLORS[size] || DISK_COLORS[1];
};

export function DraggableDiskEnhanced({
  disk,
  maxWidth,
  minWidth,
  height,
  isTopDisk,
  isSelectable = true,
  totalDisks,
  towerCenters,
  towerWidth,
  onDragStart,
  onDragEnd,
  hasMovedOnce,
}: DraggableDiskEnhancedProps) {
  const widthRange = maxWidth - minWidth;
  const width = minWidth + (widthRange * disk.size) / totalDisks;
  const diskHeight = height;

  // Core drag values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);
  const rotation = useSharedValue(0);
  const lastAbsoluteX = useSharedValue(0);
  const isDragAllowed = useSharedValue(false); // ✅ Track if drag is allowed

  // Enhanced effect values
  const shimmerX = useSharedValue(-width);
  const pulseScale = useSharedValue(1);
  const shadowIntensity = useSharedValue(0);

  const colors = getDiskColors(disk.size);
  const { playSound } = useSound();

  // Start shimmer animation for selectable disks (only if no move has been made yet)
  useEffect(() => {
    if (isTopDisk && isSelectable && !hasMovedOnce) {
      // Shimmer effect - slides across disk (faster, more visible)
      shimmerX.value = withRepeat(
        withTiming(width * 2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      );

      // More visible pulse for attention (5% instead of 2%)
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

    } else {
      shimmerX.value = -width;
      pulseScale.value = 1;
    }
  }, [isTopDisk, isSelectable, width, hasMovedOnce]);

  const triggerHaptic = (type: 'start' | 'end' | 'error') => {
    if (Platform.OS === 'web') return;

    switch (type) {
      case 'start':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'end':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
    }
  };

  // Shake animation for invalid moves
  const shakeAnimation = () => {
    translateX.value = withSequence(
      withTiming(-12, { duration: 50 }),
      withTiming(12, { duration: 50 }),
      withTiming(-12, { duration: 50 }),
      withTiming(12, { duration: 50 }),
      withSpring(0, { damping: 15 })
    );
  };

  // Play pickup sound
  const playPickupSound = () => {
    playSound('disk_move', 0.5);
  };

  const handleDragEnd = (absoluteX: number) => {
    // Debug log to help identify the issue
    console.log('handleDragEnd called:', { absoluteX, towerCenters, towerWidth });

    const halfWidth = towerWidth / 2;
    for (let i = 0; i < towerCenters.length; i++) {
      const center = towerCenters[i];
      if (absoluteX >= center - halfWidth && absoluteX <= center + halfWidth) {
        console.log('Found target tower:', i);
        triggerHaptic('end');
        onDragEnd(i as TowerId);
        return;
      }
    }
    console.log('No target tower found');
    triggerHaptic('error');
    shakeAnimation();
    onDragEnd(null);
  };

  const panGesture = Gesture.Pan()
    .enabled(true) // ✅ Always enabled - selection check is done in onStart
    .onStart(() => {
      'worklet';
      // Check if this disk can be dragged (must be top disk and selectable)
      isDragAllowed.value = isTopDisk && isSelectable;

      if (!isDragAllowed.value) {
        return; // Don't start drag if not allowed
      }

      zIndex.value = 100;
      scale.value = withSpring(1.08, { damping: 15 });
      shadowIntensity.value = withTiming(1, { duration: 150 });
      // Stop pulse while dragging
      pulseScale.value = 1;
      runOnJS(triggerHaptic)('start');
      runOnJS(playPickupSound)();
      runOnJS(onDragStart)();
    })
    .onUpdate((event) => {
      'worklet';
      // Only update position if drag is allowed
      if (!isDragAllowed.value) {
        return;
      }

      translateX.value = event.translationX;
      translateY.value = event.translationY;
      lastAbsoluteX.value = event.absoluteX;
      // Micro-rotation based on velocity
      rotation.value = interpolate(
        event.velocityX,
        [-1000, 0, 1000],
        [-5, 0, 5]
      );
    })
    .onEnd(() => {
      'worklet';
      // Only process drop if drag was allowed
      if (!isDragAllowed.value) {
        return;
      }

      const finalX = lastAbsoluteX.value;

      translateX.value = withSpring(0, { damping: 22, stiffness: 280 });
      translateY.value = withSpring(0, { damping: 22, stiffness: 280 });
      scale.value = withSpring(1, { damping: 18 });
      rotation.value = withSpring(0, { damping: 15 });
      shadowIntensity.value = withTiming(0, { duration: 200 });
      zIndex.value = 0;

      runOnJS(handleDragEnd)(finalX);
    });

  // Main disk animated style
  const animatedDiskStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value * pulseScale.value },
      { rotate: `${rotation.value}deg` },
    ],
    zIndex: zIndex.value,
  }));

  // Dynamic shadow style
  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(shadowIntensity.value, [0, 1], [0.15, 0.35]),
    shadowRadius: interpolate(shadowIntensity.value, [0, 1], [4, 12]),
    elevation: interpolate(shadowIntensity.value, [0, 1], [3, 8]),
  }));

  // Shimmer style - more visible (only before first move)
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
    opacity: isTopDisk && !hasMovedOnce ? 0.8 : 0,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedDiskStyle]}>
        <Animated.View
          style={[
            styles.diskWrapper,
            {
              width,
              height: diskHeight,
              borderRadius: diskHeight / 2,
              overflow: 'hidden',
            },
            shadowStyle
          ]}
        >
          {/* Main disk with gradient */}
          <LinearGradient
            colors={[colors.light, colors.main]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
            style={styles.disk}
          >
            {/* Static highlight */}
            <View style={[styles.highlight, { width: width * 0.5 }]} />

            {/* Shimmer effect */}
            <Animated.View style={[styles.shimmer, shimmerStyle]}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.shimmerGradient}
              />
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  diskWrapper: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  disk: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  highlight: {
    position: 'absolute',
    top: 4,
    left: '15%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    overflow: 'hidden',
  },
  shimmerGradient: {
    flex: 1,
  },
});
