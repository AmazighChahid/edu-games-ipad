/**
 * Tower of Hanoi game engine
 * Pure logic - no React dependencies
 */

import { colors } from '@/theme';
import type { HanoiGameState, HanoiLevelConfig, TowerId, Disk, TowerState } from '../types';

const DISK_COLORS = [
  colors.game.disk1,
  colors.game.disk2,
  colors.game.disk3,
  colors.game.disk4,
  colors.game.disk5,
];

/**
 * Creates the initial game state for a level
 */
export function createInitialState(level: HanoiLevelConfig): HanoiGameState {
  const disks: Disk[] = [];

  for (let i = 0; i < level.diskCount; i++) {
    disks.push({
      id: i,
      size: level.diskCount - i,
      color: DISK_COLORS[i % DISK_COLORS.length],
    });
  }

  const towers: [TowerState, TowerState, TowerState] = [
    { disks: [] },
    { disks: [] },
    { disks: [] },
  ];

  towers[level.sourceTower].disks = disks;

  return {
    towers,
    selectedDisk: null,
    sourceTower: null,
  };
}

/**
 * Gets the top disk of a tower
 */
export function getTopDisk(state: HanoiGameState, towerId: TowerId): Disk | null {
  const tower = state.towers[towerId];
  return tower.disks.length > 0 ? tower.disks[tower.disks.length - 1] : null;
}

/**
 * Checks if a disk can be placed on a tower
 */
export function canPlaceDisk(
  state: HanoiGameState,
  disk: Disk,
  targetTower: TowerId
): boolean {
  const topDisk = getTopDisk(state, targetTower);
  if (!topDisk) return true;
  return disk.size < topDisk.size;
}

/**
 * Selects a disk from a tower
 */
export function selectDisk(
  state: HanoiGameState,
  towerId: TowerId
): HanoiGameState {
  const topDisk = getTopDisk(state, towerId);
  if (!topDisk) return state;

  return {
    ...state,
    selectedDisk: topDisk,
    sourceTower: towerId,
  };
}

/**
 * Clears the current selection
 */
export function clearSelection(state: HanoiGameState): HanoiGameState {
  return {
    ...state,
    selectedDisk: null,
    sourceTower: null,
  };
}

/**
 * Moves a disk from one tower to another
 */
export function moveDisk(
  state: HanoiGameState,
  from: TowerId,
  to: TowerId
): HanoiGameState {
  if (from === to) return state;

  const topDisk = getTopDisk(state, from);
  if (!topDisk) return state;

  if (!canPlaceDisk(state, topDisk, to)) return state;

  const newTowers: [TowerState, TowerState, TowerState] = [
    { disks: [...state.towers[0].disks] },
    { disks: [...state.towers[1].disks] },
    { disks: [...state.towers[2].disks] },
  ];

  newTowers[from].disks = newTowers[from].disks.slice(0, -1);
  newTowers[to].disks = [...newTowers[to].disks, topDisk];

  return {
    towers: newTowers,
    selectedDisk: null,
    sourceTower: null,
  };
}

/**
 * Checks if the victory condition is met
 */
export function checkVictory(
  state: HanoiGameState,
  level: HanoiLevelConfig
): boolean {
  const targetTower = state.towers[level.targetTower];
  return targetTower.disks.length === level.diskCount;
}

/**
 * Calculates the minimum number of moves for a level
 */
export function getOptimalMoves(level: HanoiLevelConfig): number {
  return Math.pow(2, level.diskCount) - 1;
}
