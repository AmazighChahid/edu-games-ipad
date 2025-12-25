/**
 * Tower component
 * A single tower with its disks
 */

import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius } from '@/theme';
import type { TowerState, TowerId, Disk as DiskType } from '../types';
import { Disk } from './Disk';

interface TowerProps {
  towerId: TowerId;
  tower: TowerState;
  selectedDiskId: number | null;
  isValidTarget: boolean;
  isSourceTower: boolean;
  onPress: () => void;
  maxDiskWidth: number;
  minDiskWidth: number;
  diskHeight: number;
  totalDisks: number;
  towerHeight: number;
}

export function Tower({
  towerId,
  tower,
  selectedDiskId,
  isValidTarget,
  isSourceTower,
  onPress,
  maxDiskWidth,
  minDiskWidth,
  diskHeight,
  totalDisks,
  towerHeight,
}: TowerProps) {
  const animatedPoleStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(
      isValidTarget ? colors.feedback.success : colors.game.tower,
      { damping: 15 }
    ),
  }));

  const animatedBaseStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(
      isValidTarget ? colors.feedback.success : colors.game.towerBase,
      { damping: 15 }
    ),
  }));

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
              <Disk
                disk={disk}
                maxWidth={maxDiskWidth}
                minWidth={minDiskWidth}
                height={diskHeight}
                isSelected={disk.id === selectedDiskId}
                totalDisks={totalDisks}
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
