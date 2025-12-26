/**
 * DraggableTower component
 * Clean wooden pole design with twinkling stars for target tower
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing } from '@/theme';
import type { TowerState, TowerId, Disk as DiskType } from '../types';
import { DraggableDiskEnhanced } from './DraggableDiskEnhanced';

interface DraggableTowerProps {
  towerId: TowerId;
  tower: TowerState;
  isValidTarget: boolean;
  isDragging: boolean;
  onDiskDragStart: (disk: DiskType, towerId: TowerId) => void;
  onDiskDragEnd: (targetTower: TowerId | null) => void;
  maxDiskWidth: number;
  minDiskWidth: number;
  diskHeight: number;
  totalDisks: number;
  towerHeight: number;
  towerCenters: number[];
  towerWidth: number;
  hasMovedOnce: boolean;
  isHintHighlighted?: boolean;
  isHintTarget?: boolean;
}

// Warm wood tones for pole
const POLE_COLORS = {
  light: '#C9A66B',
  main: '#A67C52',
  dark: '#8B5E3C',
};

// Twinkling star component for target tower
function TwinklingStar({ delay, style }: { delay: number; style: object }) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text style={[styles.star, style, animatedStyle]}>
      ⭐
    </Animated.Text>
  );
}

export function DraggableTower({
  towerId,
  tower,
  isValidTarget,
  isDragging,
  onDiskDragStart,
  onDiskDragEnd,
  maxDiskWidth,
  minDiskWidth,
  diskHeight,
  totalDisks,
  towerHeight,
  towerCenters,
  towerWidth,
  hasMovedOnce,
  isHintHighlighted = false,
  isHintTarget = false,
}: DraggableTowerProps) {
  const poleWidth = 14;

  // Hint highlight animation values
  const hintPulse = useSharedValue(1);
  const hintOpacity = useSharedValue(0);

  // Animate hint highlight when active
  useEffect(() => {
    if (isHintHighlighted) {
      hintOpacity.value = withTiming(1, { duration: 200 });
      hintPulse.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      hintOpacity.value = withTiming(0, { duration: 200 });
      hintPulse.value = withTiming(1, { duration: 200 });
    }
  }, [isHintHighlighted]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isValidTarget && isDragging ? 0.15 : 0, { damping: 15 }),
    transform: [{ scale: withSpring(isValidTarget && isDragging ? 1.01 : 1, { damping: 15 }) }],
  }));

  // Hint highlight glow style (orange for source, green for target)
  const hintGlowStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value * 0.25,
    transform: [{ scale: hintPulse.value }],
  }));

  const topDiskIndex = tower.disks.length - 1;

  const isTargetTower = towerId === 2;

  return (
    <View
      style={[
        styles.container,
        { width: maxDiskWidth + spacing[4] },
      ]}
    >
      {/* Glow effect when valid target */}
      <Animated.View style={[styles.glowOverlay, animatedGlowStyle]} />

      {/* Hint highlight glow (orange for source, green for target) */}
      <Animated.View
        style={[
          styles.hintGlowOverlay,
          { backgroundColor: isHintTarget ? '#4ADE80' : '#FFB347' },
          hintGlowStyle
        ]}
      />

      {/* Twinkling stars for target tower (Arrivée) */}
      {isTargetTower && (
        <View style={styles.starsContainer} pointerEvents="none">
          <TwinklingStar delay={0} style={{ top: 20, left: -20 }} />
          <TwinklingStar delay={500} style={{ top: 60, right: -25 }} />
          <TwinklingStar delay={1000} style={{ top: 10, right: -10 }} />
        </View>
      )}

      <View style={[styles.towerArea, { height: towerHeight }]}>
        {/* Simple wooden pole */}
        <View style={[styles.poleContainer, { height: towerHeight - 20 }]}>
          <LinearGradient
            colors={[POLE_COLORS.light, POLE_COLORS.main, POLE_COLORS.dark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.pole, { width: poleWidth }]}
          >
            {/* Subtle highlight */}
            <View style={styles.poleHighlight} />
          </LinearGradient>

          {/* Rounded pole top */}
          <View style={[styles.poleTop, { width: poleWidth + 4 }]}>
            <LinearGradient
              colors={[POLE_COLORS.light, POLE_COLORS.main]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.poleTopGradient}
            />
          </View>
        </View>

        {/* Disks container - disks handle their own gestures */}
        <View style={styles.disksContainer} pointerEvents="box-none">
          {tower.disks.map((disk, index) => (
            <View key={disk.id} style={styles.diskWrapper}>
              <DraggableDiskEnhanced
                disk={disk}
                maxWidth={maxDiskWidth}
                minWidth={minDiskWidth}
                height={diskHeight}
                isTopDisk={index === topDiskIndex}
                isSelectable={index === topDiskIndex}
                totalDisks={totalDisks}
                towerCenters={towerCenters}
                towerWidth={towerWidth}
                onDragStart={() => onDiskDragStart(disk, towerId)}
                onDragEnd={onDiskDragEnd}
                hasMovedOnce={hasMovedOnce}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
  },
  star: {
    position: 'absolute',
    fontSize: 20,
  },
  glowOverlay: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    backgroundColor: '#4ADE80',
    borderRadius: 16,
    zIndex: -1,
  },
  hintGlowOverlay: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 20,
    zIndex: -1,
  },
  towerArea: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  poleContainer: {
    position: 'absolute',
    bottom: -15,
    alignItems: 'center',
  },
  pole: {
    flex: 1,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    overflow: 'hidden',
  },
  poleHighlight: {
    position: 'absolute',
    left: 2,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  poleTop: {
    position: 'absolute',
    top: -4,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  poleTopGradient: {
    flex: 1,
    borderRadius: 4,
  },
  disksContainer: {
    position: 'absolute',
    bottom: -10,
    alignItems: 'center',
    flexDirection: 'column-reverse',
  },
  diskWrapper: {
    alignItems: 'center',
    marginTop: -2,
  },
});
