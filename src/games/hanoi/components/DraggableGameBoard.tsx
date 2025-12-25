/**
 * DraggableGameBoard component
 * Clean wooden platform design
 */

import { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, LayoutChangeEvent } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing, borderRadius } from '@/theme';
import type { HanoiGameState, TowerId, Disk } from '../types';
import { DraggableTower } from './DraggableTower';

interface DraggableGameBoardProps {
  gameState: HanoiGameState;
  totalDisks: number;
  onMove: (from: TowerId, to: TowerId) => void;
  onTowerPress: (towerId: TowerId) => void;
  canMoveTo: (towerId: TowerId) => boolean;
}

// Warm wood colors for platform
const WOOD_COLORS = {
  light: '#DEB887',
  main: '#C4A574',
  dark: '#A08060',
  darker: '#8B7355',
};

export function DraggableGameBoard({
  gameState,
  totalDisks,
  onMove,
  onTowerPress,
  canMoveTo,
}: DraggableGameBoardProps) {
  const { width, height } = useWindowDimensions();
  const [towerCenters, setTowerCenters] = useState<number[]>([0, 0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSource, setDragSource] = useState<TowerId | null>(null);
  const boardXRef = useRef(0);

  const isLandscape = width > height;
  const availableWidth = isLandscape ? width * 0.85 : width * 0.92;
  const availableHeight = isLandscape ? height * 0.55 : height * 0.45;

  const towerWidth = (availableWidth - spacing[8] * 2) / 3;
  const maxDiskWidth = Math.min(towerWidth - spacing[4], 180);
  const minDiskWidth = maxDiskWidth * 0.35;
  const diskHeight = Math.min(32, (availableHeight - 80) / (totalDisks + 1));
  const towerHeight = diskHeight * (totalDisks + 2) + 50;

  const handleBoardLayout = useCallback((event: LayoutChangeEvent) => {
    event.target.measureInWindow((x, y, w, h) => {
      boardXRef.current = x;
      const towerSpacing = w / 3;
      const centers = [
        x + towerSpacing * 0.5,
        x + towerSpacing * 1.5,
        x + towerSpacing * 2.5,
      ];
      setTowerCenters(centers);
    });
  }, []);

  const handleDiskDragStart = useCallback((disk: Disk, towerId: TowerId) => {
    setIsDragging(true);
    setDragSource(towerId);
  }, []);

  const handleDiskDragEnd = useCallback((targetTower: TowerId | null) => {
    if (targetTower !== null && dragSource !== null && targetTower !== dragSource) {
      onMove(dragSource, targetTower);
    }
    setIsDragging(false);
    setDragSource(null);
  }, [dragSource, onMove]);

  const isValidTarget = useCallback((towerId: TowerId): boolean => {
    if (!isDragging || dragSource === null) return false;
    if (towerId === dragSource) return false;

    const sourceTower = gameState.towers[dragSource];
    const targetTower = gameState.towers[towerId];
    const movingDisk = sourceTower.disks[sourceTower.disks.length - 1];

    if (!movingDisk) return false;
    if (targetTower.disks.length === 0) return true;

    const topTargetDisk = targetTower.disks[targetTower.disks.length - 1];
    return movingDisk.size < topTargetDisk.size;
  }, [isDragging, dragSource, gameState.towers]);

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <View style={styles.container}>
        {/* Towers area */}
        <View
          onLayout={handleBoardLayout}
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
              <DraggableTower
                key={towerId}
                towerId={towerId}
                tower={gameState.towers[towerId]}
                isValidTarget={isValidTarget(towerId)}
                isDragging={isDragging}
                onPress={() => onTowerPress(towerId)}
                onDiskDragStart={handleDiskDragStart}
                onDiskDragEnd={handleDiskDragEnd}
                maxDiskWidth={maxDiskWidth}
                minDiskWidth={minDiskWidth}
                diskHeight={diskHeight}
                totalDisks={totalDisks}
                towerHeight={towerHeight}
                towerCenters={towerCenters}
                towerWidth={towerWidth}
              />
            ))}
          </View>
        </View>

        {/* Wooden Platform Base */}
        <View style={[styles.platformContainer, { width: availableWidth }]}>
          {/* Top surface */}
          <LinearGradient
            colors={[WOOD_COLORS.light, WOOD_COLORS.main]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.platformTop}
          >
            {/* Wood grain effect */}
            <View style={styles.woodGrain} />
          </LinearGradient>

          {/* Front face (depth) */}
          <LinearGradient
            colors={[WOOD_COLORS.dark, WOOD_COLORS.darker]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.platformFront}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  board: {
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    paddingBottom: 20,
  },
  towersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
    gap: spacing[2],
  },
  platformContainer: {
    alignItems: 'center',
    marginTop: -10,
  },
  platformTop: {
    width: '100%',
    height: 24,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  woodGrain: {
    position: 'absolute',
    top: 4,
    left: 30,
    right: 30,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
  },
  platformFront: {
    width: '100%',
    height: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
