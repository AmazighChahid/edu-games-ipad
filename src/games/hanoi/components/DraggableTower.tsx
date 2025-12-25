/**
 * DraggableTower component
 * A tower that supports drag and drop of disks
 */

import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius } from '@/theme';
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
  const animatedPoleStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(
      isValidTarget && isDragging ? colors.feedback.success : colors.game.tower,
      { damping: 15 }
    ),
  }));

  const animatedBaseStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(
      isValidTarget && isDragging ? colors.feedback.success : colors.game.towerBase,
      { damping: 15 }
    ),
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
      <View style={[styles.towerArea, { height: towerHeight }]}>
        <Animated.View
          style={[
            styles.pole,
            { height: towerHeight - 20 },
            animatedPoleStyle,
          ]}
        />

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

      <Animated.View style={[styles.base, animatedBaseStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  towerArea: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pole: {
    position: 'absolute',
    bottom: 0,
    width: 16,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  disksContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'column-reverse',
    gap: 4,
  },
  diskWrapper: {
    alignItems: 'center',
  },
  base: {
    width: '100%',
    height: 20,
    borderRadius: borderRadius.md,
  },
});
