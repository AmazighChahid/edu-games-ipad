/**
 * Tests for Move Validator
 */

import { validateMove, getInvalidMoveMessage } from '../../../src/games/hanoi/logic/moveValidator';
import { createInitialState, moveDisk } from '../../../src/games/hanoi/logic/hanoiEngine';
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

describe('moveValidator', () => {
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

  describe('validateMove', () => {
    it('should return valid for legal move', () => {
      const state = createInitialState(level3Disks);
      const result = validateMove(state, { from: 0 as TowerId, to: 1 as TowerId });

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should return invalid for same position', () => {
      const state = createInitialState(level3Disks);
      const result = validateMove(state, { from: 0 as TowerId, to: 0 as TowerId });

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('same_position');
    });

    it('should return invalid when source tower is empty', () => {
      const state = createInitialState(level3Disks);
      const result = validateMove(state, { from: 1 as TowerId, to: 2 as TowerId });

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('invalid_target');
    });

    it('should return invalid when placing larger disk on smaller', () => {
      let state = createInitialState(level3Disks);
      // Move smallest disk to tower 1
      state = moveDisk(state, 0 as TowerId, 1 as TowerId);

      // Try to move size 2 disk onto size 1 disk
      const result = validateMove(state, { from: 0 as TowerId, to: 1 as TowerId });

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('disk_too_large');
    });

    it('should allow placing smaller disk on larger', () => {
      let state = createInitialState(level3Disks);
      // Move smallest disk to tower 1
      state = moveDisk(state, 0 as TowerId, 1 as TowerId);
      // Move medium disk to tower 2
      state = moveDisk(state, 0 as TowerId, 2 as TowerId);

      // Try to move small disk onto medium disk
      const result = validateMove(state, { from: 1 as TowerId, to: 2 as TowerId });

      expect(result.valid).toBe(true);
    });

    it('should allow placing disk on empty tower', () => {
      const state = createInitialState(level3Disks);
      const result = validateMove(state, { from: 0 as TowerId, to: 2 as TowerId });

      expect(result.valid).toBe(true);
    });
  });

  describe('getInvalidMoveMessage', () => {
    it('should return French message for disk_too_large', () => {
      const message = getInvalidMoveMessage('disk_too_large', 'fr');
      expect(message).toBe('Ce disque est trop grand pour aller ici !');
    });

    it('should return English message for disk_too_large', () => {
      const message = getInvalidMoveMessage('disk_too_large', 'en');
      expect(message).toBe('This disk is too big to go here!');
    });

    it('should return French message for same_position', () => {
      const message = getInvalidMoveMessage('same_position', 'fr');
      expect(message).toBe('Tu dois choisir une autre tour.');
    });

    it('should return French message for invalid_target', () => {
      const message = getInvalidMoveMessage('invalid_target', 'fr');
      expect(message).toBe("Il n'y a pas de disque à déplacer.");
    });

    it('should default to French when language not specified', () => {
      const message = getInvalidMoveMessage('blocked');
      expect(message).toBe('Ce disque ne peut pas être déplacé.');
    });

    it('should return empty string for undefined reason', () => {
      const message = getInvalidMoveMessage(undefined, 'fr');
      expect(message).toBe('');
    });
  });
});
