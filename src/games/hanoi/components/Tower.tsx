/**
 * Tower component
 * Wood-style pole with flat design
 */

import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius } from '@/theme';
import type { TowerState, TowerId } from '../types';
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
  const poleWidth = 18;
  const poleHeight = towerHeight - 10;

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isValidTarget ? 1 : 0, { damping: 15 }),
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
        {/* Pole with wood texture effect */}
        <View style={[styles.poleContainer, { height: poleHeight }]}>
          {/* Main pole body */}
          <View style={[styles.pole, { width: poleWidth }]}>
            {/* Highlight on left side */}
            <View style={styles.poleHighlight} />
          </View>

          {/* Rounded top cap */}
          <View style={[styles.poleCap, { width: poleWidth + 4, height: (poleWidth + 4) / 2 }]} />

          {/* Green glow when valid target */}
          <Animated.View
            style={[
              styles.poleGlow,
              { width: poleWidth + 8 },
              animatedGlowStyle,
            ]}
          />
        </View>

        {/* Disks stacked on pole */}
        <View style={styles.disksContainer}>
          {tower.disks.map((disk) => (
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
  poleContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  pole: {
    flex: 1,
    backgroundColor: colors.game.tower,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  poleHighlight: {
    position: 'absolute',
    left: 2,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.game.towerHighlight,
    opacity: 0.6,
  },
  poleCap: {
    position: 'absolute',
    top: 0,
    backgroundColor: colors.game.tower,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  poleGlow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: colors.feedback.success,
    borderRadius: 10,
    opacity: 0.3,
  },
  disksContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'column-reverse',
    gap: 3,
  },
  diskWrapper: {
    alignItems: 'center',
  },
});
