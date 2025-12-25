/**
 * GameBoard component
 * The main game area with all three towers
 */

import { View, StyleSheet, useWindowDimensions } from 'react-native';

import { colors, spacing, borderRadius, shadows } from '@/theme';
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
  const availableWidth = isLandscape ? width * 0.9 : width * 0.95;
  const availableHeight = isLandscape ? height * 0.55 : height * 0.5;

  const towerWidth = (availableWidth - spacing[8] * 2) / 3;
  const maxDiskWidth = Math.min(towerWidth - spacing[4], 200);
  const minDiskWidth = maxDiskWidth * 0.35;
  const diskHeight = Math.min(45, (availableHeight - 60) / (totalDisks + 1));
  const towerHeight = diskHeight * (totalDisks + 1) + 40;

  const { selectedDisk, sourceTower } = gameState;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.board,
          {
            width: availableWidth,
            height: towerHeight + 60,
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    ...shadows.lg,
  },
  towersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    gap: spacing[6],
  },
});
