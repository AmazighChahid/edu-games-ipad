/**
 * Tower of Hanoi game engine
 * Pure logic - no React dependencies
 */

import { colors } from '../../../theme';
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

/**
 * Represents a single move in the solution
 */
export interface HanoiMove {
  from: TowerId;
  to: TowerId;
  diskSize: number;
}

/**
 * Recursive solver for Tower of Hanoi
 * Returns the optimal sequence of moves
 */
export function solveHanoi(
  numDisks: number,
  source: TowerId,
  auxiliary: TowerId,
  target: TowerId,
  moves: HanoiMove[] = []
): HanoiMove[] {
  if (numDisks === 0) return moves;

  // Move n-1 disks from source to auxiliary
  solveHanoi(numDisks - 1, source, target, auxiliary, moves);

  // Move the largest disk from source to target
  moves.push({ from: source, to: target, diskSize: numDisks });

  // Move n-1 disks from auxiliary to target
  solveHanoi(numDisks - 1, auxiliary, source, target, moves);

  return moves;
}

/**
 * Gets the optimal solution for a level
 */
export function getSolution(level: HanoiLevelConfig): HanoiMove[] {
  const auxiliary: TowerId = ([0, 1, 2] as TowerId[]).find(
    (t) => t !== level.sourceTower && t !== level.targetTower
  ) as TowerId;

  return solveHanoi(
    level.diskCount,
    level.sourceTower,
    auxiliary,
    level.targetTower
  );
}

/**
 * Gets the next optimal move from current state
 * Compares current state against the optimal solution to find where we are
 */
export function getNextOptimalMove(
  state: HanoiGameState,
  level: HanoiLevelConfig
): HanoiMove | null {
  const solution = getSolution(level);

  // Simulate moves to find current position in solution
  let simulatedState = createInitialState(level);
  let moveIndex = 0;

  // Find how far along the solution we are by comparing states
  for (let i = 0; i < solution.length; i++) {
    const move = solution[i];
    const nextState = moveDisk(simulatedState, move.from, move.to);

    // Check if simulated state matches current state
    if (statesEqual(nextState, state)) {
      moveIndex = i + 1;
      break;
    }

    // Check if we've diverged from optimal path
    if (statesEqual(simulatedState, state)) {
      // We're at this point in the solution
      return solution[i];
    }

    simulatedState = nextState;
  }

  // If we're at the start and haven't moved
  if (statesEqual(simulatedState, state) && moveIndex === 0) {
    return solution[0];
  }

  // Return next move if available
  if (moveIndex < solution.length) {
    return solution[moveIndex];
  }

  return null;
}

/**
 * Compares two game states for equality
 */
function statesEqual(a: HanoiGameState, b: HanoiGameState): boolean {
  for (let i = 0; i < 3; i++) {
    const towerA = a.towers[i as TowerId];
    const towerB = b.towers[i as TowerId];

    if (towerA.disks.length !== towerB.disks.length) return false;

    for (let j = 0; j < towerA.disks.length; j++) {
      if (towerA.disks[j].size !== towerB.disks[j].size) return false;
    }
  }

  return true;
}
