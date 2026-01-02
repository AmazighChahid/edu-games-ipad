/**
 * DraggableGameBoard component
 * Clean wooden platform design
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, LayoutChangeEvent, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { spacing, borderRadius } from '../../../theme';
import type { HanoiGameState, TowerId, Disk } from '../types';
import { DraggableTower } from './DraggableTower';
import { WoodenBase } from './WoodenBase';

interface DraggableGameBoardProps {
  gameState: HanoiGameState;
  totalDisks: number;
  onMove: (from: TowerId, to: TowerId) => void;
  hasMovedOnce: boolean;
  highlightedTowers?: { source: TowerId; target: TowerId } | null;
}

export function DraggableGameBoard({
  gameState,
  totalDisks,
  onMove,
  hasMovedOnce,
  highlightedTowers,
}: DraggableGameBoardProps) {
  const { width, height } = useWindowDimensions();
  const [towerCenters, setTowerCenters] = useState<number[]>([0, 0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSource, setDragSource] = useState<TowerId | null>(null);
  const boardXRef = useRef(0);

  const boardRef = useRef<View>(null);

  const isLandscape = width > height;
  const availableWidth = isLandscape ? width * 0.85 : width * 0.92;
  const availableHeight = isLandscape ? height * 0.55 : height * 0.45;

  const towerWidth = (availableWidth - spacing[8] * 2) / 3;
  const maxDiskWidth = Math.min(towerWidth - spacing[4], 180);
  const minDiskWidth = maxDiskWidth * 0.35;
  // Fixed dimensions based on 6 disks (max level) to prevent layout shifts
  const maxDisks = 6;
  const diskHeight = Math.min(42, (availableHeight - 80) / (maxDisks + 1));
  const towerHeight = diskHeight * (maxDisks + 2) + 50;

  // Function to recalculate tower centers (called on layout and before drop on web)
  const recalculateTowerCenters = useCallback((element: unknown): number[] => {
    if (Platform.OS === 'web' && element) {
      const htmlElement = element as unknown as HTMLElement;
      if (htmlElement.getBoundingClientRect) {
        const rect = htmlElement.getBoundingClientRect();
        // On web, absoluteX from gesture handler is relative to the page (includes scroll)
        // getBoundingClientRect gives viewport-relative coords
        // Add scroll offset to match absoluteX behavior
        const scrollX = window.scrollX || 0;
        const boardX = rect.x + scrollX;
        boardXRef.current = boardX;
        const towerSpacing = rect.width / 3;
        const centers = [
          boardX + towerSpacing * 0.5,
          boardX + towerSpacing * 1.5,
          boardX + towerSpacing * 2.5,
        ];
        return centers;
      }
    }
    return towerCenters;
  }, [towerCenters]);

  const handleBoardLayout = useCallback((event: LayoutChangeEvent) => {
    if (Platform.OS === 'web') {
      // On web, use getBoundingClientRect for accurate viewport coordinates
      const centers = recalculateTowerCenters(event.target);
      setTowerCenters(centers);
    } else {
      // On native, use measureInWindow (type assertion needed as RN event.target is typed as number)
      const target = event.target as unknown as { measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => void };
      target.measureInWindow((mx: number, _my: number, mw: number, _mh: number) => {
        boardXRef.current = mx;
        const towerSpacing = mw / 3;
        const centers = [
          mx + towerSpacing * 0.5,
          mx + towerSpacing * 1.5,
          mx + towerSpacing * 2.5,
        ];
        setTowerCenters(centers);
      });
    }
  }, [recalculateTowerCenters]);

  // Recalculate tower centers on window resize (web only)
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleResize = () => {
      if (boardRef.current) {
        const centers = recalculateTowerCenters(boardRef.current);
        setTowerCenters(centers);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [recalculateTowerCenters]);

  // Force recalculate on mount for web (layout may not fire immediately)
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (boardRef.current) {
        const centers = recalculateTowerCenters(boardRef.current);
        if (centers.some(c => c > 0)) {
          setTowerCenters(centers);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [recalculateTowerCenters]);

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
          ref={boardRef}
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
                onDiskDragStart={handleDiskDragStart}
                onDiskDragEnd={handleDiskDragEnd}
                maxDiskWidth={maxDiskWidth}
                minDiskWidth={minDiskWidth}
                diskHeight={diskHeight}
                totalDisks={totalDisks}
                towerHeight={towerHeight}
                towerCenters={towerCenters}
                towerWidth={towerWidth}
                hasMovedOnce={hasMovedOnce}
                isHintHighlighted={highlightedTowers?.source === towerId || highlightedTowers?.target === towerId}
                isHintTarget={highlightedTowers?.target === towerId}
              />
            ))}
          </View>
        </View>

        {/* Enhanced Wooden Platform Base */}
        <WoodenBase
          width={availableWidth}
          pegCount={0}
          platformHeight={60}
        />
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
});
