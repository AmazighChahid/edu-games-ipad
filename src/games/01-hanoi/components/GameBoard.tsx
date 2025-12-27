/**
 * GameBoard component
 * 3D isometric wooden platform with towers
 */

import { View, StyleSheet, useWindowDimensions } from 'react-native';

import { colors, spacing, borderRadius } from '../../../theme';
import type { HanoiGameState, TowerId } from '../types';
import { Tower } from './Tower';

interface GameBoardProps {
  gameState: HanoiGameState;
  totalDisks: number;
  onTowerPress: (towerId: TowerId) => void;
  canMoveTo: (towerId: TowerId) => boolean;
}

export function GameBoard({
  gameState,
  totalDisks,
  onTowerPress,
  canMoveTo,
}: GameBoardProps) {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const availableWidth = isLandscape ? width * 0.85 : width * 0.92;
  const availableHeight = isLandscape ? height * 0.5 : height * 0.45;

  const towerWidth = (availableWidth - spacing[8] * 2) / 3;
  const maxDiskWidth = Math.min(towerWidth - spacing[4], 180);
  const minDiskWidth = maxDiskWidth * 0.35;
  // Fixed dimensions based on 6 disks (max level) to prevent layout shifts
  const maxDisks = 6;
  const diskHeight = Math.min(40, (availableHeight - 80) / (maxDisks + 1));
  const towerHeight = diskHeight * (maxDisks + 1) + 50;

  const baseHeight = 35;
  const baseSideHeight = 20;

  const { selectedDisk, sourceTower } = gameState;

  return (
    <View style={styles.container}>
      {/* 3D Wooden Platform */}
      <View style={[styles.platformContainer, { width: availableWidth + 40 }]}>
        {/* Top surface of the platform */}
        <View
          style={[
            styles.platformTop,
            {
              width: availableWidth + 40,
              height: baseHeight,
            },
          ]}
        >
          {/* Wood grain effect - subtle lines */}
          <View style={styles.woodGrain} />
        </View>

        {/* Front face of the platform (3D effect) */}
        <View
          style={[
            styles.platformFront,
            {
              width: availableWidth + 40,
              height: baseSideHeight,
            },
          ]}
        />

        {/* Towers area sitting on platform */}
        <View
          style={[
            styles.towersArea,
            {
              width: availableWidth,
              height: towerHeight,
              bottom: baseHeight + baseSideHeight - 5,
            },
          ]}
        >
          <View style={styles.towersRow}>
            {([0, 1, 2] as TowerId[]).map((towerId) => (
              <Tower
                key={towerId}
                towerId={towerId}
                tower={gameState.towers[towerId]}
                selectedDiskId={selectedDisk?.id ?? null}
                isValidTarget={selectedDisk !== null && canMoveTo(towerId)}
                isSourceTower={sourceTower === towerId}
                onPress={() => onTowerPress(towerId)}
                maxDiskWidth={maxDiskWidth}
                minDiskWidth={minDiskWidth}
                diskHeight={diskHeight}
                totalDisks={totalDisks}
                towerHeight={towerHeight}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  platformTop: {
    backgroundColor: colors.game.towerBase,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    position: 'absolute',
    bottom: 20,
    overflow: 'hidden',
    // Subtle shadow on top
    boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
  },
  woodGrain: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
    // Simulated wood grain with border
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  platformFront: {
    backgroundColor: colors.game.towerBaseSide,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
    position: 'absolute',
    bottom: 0,
    // Darker edge for depth
    borderBottomWidth: 3,
    borderBottomColor: colors.game.towerBaseDark,
  },
  towersArea: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  towersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: spacing[4],
  },
});
