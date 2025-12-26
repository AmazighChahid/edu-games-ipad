/**
 * Tests for Tower of Hanoi Engine
 */

import {
  createInitialState,
  getTopDisk,
  canPlaceDisk,
  selectDisk,
  clearSelection,
  moveDisk,
  checkVictory,
  getOptimalMoves,
  solveHanoi,
  getSolution,
  getNextOptimalMove,
} from '../../../src/games/hanoi/logic/hanoiEngine';
import type { HanoiLevelConfig, TowerId } from '../../../src/games/hanoi/types';

// Mock colors module
jest.mock('../../../src/theme', () => ({
  colors: {
    game: {
      disk1: '#FF6B6B',
      disk2: '#4ECDC4',
      disk3: '#45B7D1',
      disk4: '#96CEB4',
      disk5: '#FFEAA7',
    },
  },
}));

describe('hanoiEngine', () => {
  const level3Disks: HanoiLevelConfig = {
    id: 'test-3',
    name: 'Test Level 3',
    diskCount: 3,
    sourceTower: 0 as TowerId,
    targetTower: 2 as TowerId,
    starThresholds: {
      moves3Star: 7,
      moves2Star: 10,
      time3Star: 30,
      time2Star: 60,
    },
    unlockCondition: null,
  };

  const level2Disks: HanoiLevelConfig = {
    id: 'test-2',
    name: 'Test Level 2',
    diskCount: 2,
    sourceTower: 0 as TowerId,
    targetTower: 2 as TowerId,
    starThresholds: {
      moves3Star: 3,
      moves2Star: 5,
      time3Star: 20,
      time2Star: 40,
    },
    unlockCondition: null,
  };

  describe('createInitialState', () => {
    it('should create state with correct number of disks', () => {
      const state = createInitialState(level3Disks);
      expect(state.towers[0].disks).toHaveLength(3);
      expect(state.towers[1].disks).toHaveLength(0);
      expect(state.towers[2].disks).toHaveLength(0);
    });

    it('should place disks on source tower', () => {
      const state = createInitialState(level3Disks);
      expect(state.towers[level3Disks.sourceTower].disks).toHaveLength(3);
    });

    it('should order disks by size (largest at bottom)', () => {
      const state = createInitialState(level3Disks);
      const disks = state.towers[0].disks;
      // Disk at index 0 (bottom) should be the largest
      expect(disks[0].size).toBe(3);
      expect(disks[1].size).toBe(2);
      expect(disks[2].size).toBe(1);
    });

    it('should initialize with no selection', () => {
      const state = createInitialState(level3Disks);
      expect(state.selectedDisk).toBeNull();
      expect(state.sourceTower).toBeNull();
    });

    it('should assign unique IDs to disks', () => {
      const state = createInitialState(level3Disks);
      const diskIds = state.towers[0].disks.map((d) => d.id);
      const uniqueIds = new Set(diskIds);
      expect(uniqueIds.size).toBe(diskIds.length);
    });
  });

  describe('getTopDisk', () => {
    it('should return top disk from non-empty tower', () => {
      const state = createInitialState(level3Disks);
      const topDisk = getTopDisk(state, 0 as TowerId);
      expect(topDisk).not.toBeNull();
      expect(topDisk?.size).toBe(1); // Smallest disk is on top
    });

    it('should return null for empty tower', () => {
      const state = createInitialState(level3Disks);
      const topDisk = getTopDisk(state, 1 as TowerId);
      expect(topDisk).toBeNull();
    });
  });

  describe('canPlaceDisk', () => {
    it('should allow placing disk on empty tower', () => {
      const state = createInitialState(level3Disks);
      const disk = state.towers[0].disks[2]; // Top disk (size 1)
      expect(canPlaceDisk(state, disk, 1 as TowerId)).toBe(true);
    });

    it('should allow placing smaller disk on larger disk', () => {
      let state = createInitialState(level3Disks);
      // Move size 1 disk to tower 1
      state = moveDisk(state, 0 as TowerId, 1 as TowerId);
      // Move size 2 disk to tower 2
      state = moveDisk(state, 0 as TowerId, 2 as TowerId);

      // Now try to place size 1 on size 2 (tower 2)
      const disk = state.towers[1].disks[0]; // Size 1
      expect(canPlaceDisk(state, disk, 2 as TowerId)).toBe(true);
    });

    it('should prevent placing larger disk on smaller disk', () => {
      let state = createInitialState(level3Disks);
      // Move size 1 disk to tower 1
      state = moveDisk(state, 0 as TowerId, 1 as TowerId);

      // Now try to place size 2 on size 1 (tower 1)
      const disk = state.towers[0].disks[1]; // Size 2
      expect(canPlaceDisk(state, disk, 1 as TowerId)).toBe(false);
    });
  });

  describe('selectDisk', () => {
    it('should select top disk from tower', () => {
      const state = createInitialState(level3Disks);
      const newState = selectDisk(state, 0 as TowerId);

      expect(newState.selectedDisk).not.toBeNull();
      expect(newState.selectedDisk?.size).toBe(1);
      expect(newState.sourceTower).toBe(0);
    });

    it('should not change state when selecting from empty tower', () => {
      const state = createInitialState(level3Disks);
      const newState = selectDisk(state, 1 as TowerId);

      expect(newState.selectedDisk).toBeNull();
      expect(newState.sourceTower).toBeNull();
    });
  });

  describe('clearSelection', () => {
    it('should clear selection', () => {
      const state = createInitialState(level3Disks);
      const selectedState = selectDisk(state, 0 as TowerId);
      const clearedState = clearSelection(selectedState);

      expect(clearedState.selectedDisk).toBeNull();
      expect(clearedState.sourceTower).toBeNull();
    });
  });

  describe('moveDisk', () => {
    it('should move disk from one tower to another', () => {
      const state = createInitialState(level3Disks);
      const newState = moveDisk(state, 0 as TowerId, 1 as TowerId);

      expect(newState.towers[0].disks).toHaveLength(2);
      expect(newState.towers[1].disks).toHaveLength(1);
      expect(newState.towers[1].disks[0].size).toBe(1);
    });

    it('should not move to same tower', () => {
      const state = createInitialState(level3Disks);
      const newState = moveDisk(state, 0 as TowerId, 0 as TowerId);

      expect(newState.towers[0].disks).toHaveLength(3);
    });

    it('should not move from empty tower', () => {
      const state = createInitialState(level3Disks);
      const newState = moveDisk(state, 1 as TowerId, 2 as TowerId);

      expect(newState).toEqual(state);
    });

    it('should not allow invalid move (larger on smaller)', () => {
      let state = createInitialState(level3Disks);
      state = moveDisk(state, 0 as TowerId, 1 as TowerId);

      // Try to move size 2 on size 1
      const newState = moveDisk(state, 0 as TowerId, 1 as TowerId);

      // Should not have changed
      expect(newState.towers[0].disks).toHaveLength(2);
      expect(newState.towers[1].disks).toHaveLength(1);
    });

    it('should clear selection after move', () => {
      let state = createInitialState(level3Disks);
      state = selectDisk(state, 0 as TowerId);
      state = moveDisk(state, 0 as TowerId, 1 as TowerId);

      expect(state.selectedDisk).toBeNull();
      expect(state.sourceTower).toBeNull();
    });
  });

  describe('checkVictory', () => {
    it('should return false for initial state', () => {
      const state = createInitialState(level3Disks);
      expect(checkVictory(state, level3Disks)).toBe(false);
    });

    it('should return true when all disks on target tower', () => {
      // Manually create winning state
      const state = createInitialState(level3Disks);

      // Move all disks to target tower using optimal solution
      const solution = getSolution(level3Disks);
      let currentState = state;

      for (const move of solution) {
        currentState = moveDisk(currentState, move.from, move.to);
      }

      expect(checkVictory(currentState, level3Disks)).toBe(true);
    });
  });

  describe('getOptimalMoves', () => {
    it('should return 2^n - 1 for n disks', () => {
      expect(getOptimalMoves(level2Disks)).toBe(3);  // 2^2 - 1 = 3
      expect(getOptimalMoves(level3Disks)).toBe(7);  // 2^3 - 1 = 7

      const level4Disks = { ...level3Disks, diskCount: 4 };
      expect(getOptimalMoves(level4Disks)).toBe(15); // 2^4 - 1 = 15

      const level5Disks = { ...level3Disks, diskCount: 5 };
      expect(getOptimalMoves(level5Disks)).toBe(31); // 2^5 - 1 = 31
    });
  });

  describe('solveHanoi', () => {
    it('should return correct number of moves', () => {
      const moves = solveHanoi(3, 0 as TowerId, 1 as TowerId, 2 as TowerId);
      expect(moves).toHaveLength(7);
    });

    it('should return empty array for 0 disks', () => {
      const moves = solveHanoi(0, 0 as TowerId, 1 as TowerId, 2 as TowerId);
      expect(moves).toHaveLength(0);
    });

    it('should produce valid solution', () => {
      const state = createInitialState(level3Disks);
      const moves = getSolution(level3Disks);

      let currentState = state;
      for (const move of moves) {
        currentState = moveDisk(currentState, move.from, move.to);
      }

      expect(checkVictory(currentState, level3Disks)).toBe(true);
    });
  });

  describe('getSolution', () => {
    it('should solve 2 disk puzzle correctly', () => {
      const solution = getSolution(level2Disks);
      expect(solution).toHaveLength(3);

      // Verify first move is from source
      expect(solution[0].from).toBe(0);
    });

    it('should solve 3 disk puzzle correctly', () => {
      const solution = getSolution(level3Disks);
      expect(solution).toHaveLength(7);
    });
  });

  describe('getNextOptimalMove', () => {
    it('should return first move for initial state', () => {
      const state = createInitialState(level3Disks);
      const nextMove = getNextOptimalMove(state, level3Disks);

      expect(nextMove).not.toBeNull();
      expect(nextMove?.from).toBe(0);
    });

    it('should return correct next move after one move', () => {
      let state = createInitialState(level3Disks);
      const solution = getSolution(level3Disks);

      // Make first move
      state = moveDisk(state, solution[0].from, solution[0].to);

      const nextMove = getNextOptimalMove(state, level3Disks);
      expect(nextMove).toEqual(solution[1]);
    });

    it('should return null when puzzle is solved', () => {
      let state = createInitialState(level3Disks);
      const solution = getSolution(level3Disks);

      // Execute all moves
      for (const move of solution) {
        state = moveDisk(state, move.from, move.to);
      }

      const nextMove = getNextOptimalMove(state, level3Disks);
      expect(nextMove).toBeNull();
    });
  });
});
