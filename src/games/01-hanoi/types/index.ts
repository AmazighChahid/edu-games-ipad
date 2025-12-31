/**
 * Tower of Hanoi types
 */

import type { LevelConfig } from '../../../types';

export type TowerId = 0 | 1 | 2;

export interface Disk {
  id: number;
  size: number;
  color: string;
}

export interface TowerState {
  disks: Disk[];
}

export interface HanoiGameState {
  towers: [TowerState, TowerState, TowerState];
  selectedDisk: Disk | null;
  sourceTower: TowerId | null;
}

export interface HanoiMove {
  diskId: number;
  from: TowerId;
  to: TowerId;
}

export interface HanoiLevelConfig extends LevelConfig {
  diskCount: number;
  sourceTower: TowerId;
  targetTower: TowerId;
}

export interface TowerPosition {
  towerId: TowerId;
  x: number;
  y: number;
  width: number;
  height: number;
}
