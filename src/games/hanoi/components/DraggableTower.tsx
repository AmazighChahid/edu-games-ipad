/**
 * DraggableTower component
 * Clean wooden pole design
 */

import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing } from '@/theme';
import type { TowerState, TowerId, Disk as DiskType } from '../types';
import { DraggableDisk } from './DraggableDisk';

interface DraggableTowerProps {
  towerId: TowerId;
  tower: TowerState;
  isValidTarget: boolean;
  isDragging: boolean;
  onPress: () => void;
  onDiskDragStart: (disk: DiskType, towerId: TowerId) => void;
  onDiskDragEnd: (targetTower: TowerId | null) => void;
  maxDiskWidth: number;
  minDiskWidth: number;
  diskHeight: number;
  totalDisks: number;
  towerHeight: number;
  towerCenters: number[];
  towerWidth: number;
}

// Warm wood tones for pole
const POLE_COLORS = {
  light: '#C9A66B',
  main: '#A67C52',
  dark: '#8B5E3C',
};

export function DraggableTower({
  towerId,
  tower,
  isValidTarget,
  isDragging,
  onPress,
  onDiskDragStart,
  onDiskDragEnd,
  maxDiskWidth,
  minDiskWidth,
  diskHeight,
  totalDisks,
  towerHeight,
  towerCenters,
  towerWidth,
}: DraggableTowerProps) {
  const poleWidth = 14;

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isValidTarget && isDragging ? 0.5 : 0, { damping: 15 }),
    transform: [{ scale: withSpring(isValidTarget && isDragging ? 1.02 : 1, { damping: 15 }) }],
  }));

  const topDiskIndex = tower.disks.length - 1;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        { width: maxDiskWidth + spacing[4] },
      ]}
    >
      {/* Glow effect when valid target */}
      <Animated.View style={[styles.glowOverlay, animatedGlowStyle]} />

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

        {/* Disks container */}
        <View style={styles.disksContainer}>
          {tower.disks.map((disk, index) => (
            <View key={disk.id} style={styles.diskWrapper}>
              <DraggableDisk
                disk={disk}
                maxWidth={maxDiskWidth}
                minWidth={minDiskWidth}
                height={diskHeight}
                isTopDisk={index === topDiskIndex}
                totalDisks={totalDisks}
                towerCenters={towerCenters}
                towerWidth={towerWidth}
                onDragStart={() => onDiskDragStart(disk, towerId)}
                onDragEnd={onDiskDragEnd}
              />
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  glowOverlay: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: '#4ADE80',
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
    bottom: 0,
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
    bottom: 4,
    alignItems: 'center',
    flexDirection: 'column-reverse',
    gap: 3,
  },
  diskWrapper: {
    alignItems: 'center',
  },
});
