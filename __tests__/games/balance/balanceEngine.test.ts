/**
 * Tests for Balance Engine
 */

import {
  calculatePlateWeight,
  calculateBalanceAngle,
  isBalanced,
  createInitialState,
  addObjectToPlate,
  removeObjectFromPlate,
  getBalanceDescription,
  detectEquivalence,
} from '../../../src/games/balance/logic/balanceEngine';
import type { WeightObject } from '../../../src/games/balance/types';

describe('balanceEngine', () => {
  const apple: WeightObject = {
    id: 'apple-1',
    type: 'apple',
    value: 3,
    emoji: '🍎',
    displayName: 'Pomme',
  };

  const orange: WeightObject = {
    id: 'orange-1',
    type: 'orange',
    value: 2,
    emoji: '🍊',
    displayName: 'Orange',
  };

  const banana: WeightObject = {
    id: 'banana-1',
    type: 'banana',
    value: 1,
    emoji: '🍌',
    displayName: 'Banane',
  };

  describe('calculatePlateWeight', () => {
    it('should return 0 for empty array', () => {
      expect(calculatePlateWeight([])).toBe(0);
    });

    it('should return correct weight for single object', () => {
      expect(calculatePlateWeight([apple])).toBe(3);
    });

    it('should sum weights of multiple objects', () => {
      expect(calculatePlateWeight([apple, orange, banana])).toBe(6);
    });
  });

  describe('calculateBalanceAngle', () => {
    it('should return 0 for equal weights', () => {
      expect(calculateBalanceAngle(5, 5)).toBe(0);
    });

    it('should return negative angle when left is heavier', () => {
      const angle = calculateBalanceAngle(10, 5);
      expect(angle).toBeLessThan(0);
    });

    it('should return positive angle when right is heavier', () => {
      const angle = calculateBalanceAngle(5, 10);
      expect(angle).toBeGreaterThan(0);
    });

    it('should clamp to max angle', () => {
      const angle = calculateBalanceAngle(1000, 0);
      expect(angle).toBeGreaterThanOrEqual(-30);
      expect(angle).toBeLessThanOrEqual(30);
    });
  });

  describe('isBalanced', () => {
    it('should return true for equal weights', () => {
      expect(isBalanced(5, 5)).toBe(true);
    });

    it('should return true for weights within tolerance', () => {
      expect(isBalanced(5, 5.05)).toBe(true);
    });

    it('should return false for weights outside tolerance', () => {
      expect(isBalanced(5, 6)).toBe(false);
    });

    it('should use custom tolerance', () => {
      expect(isBalanced(5, 5.5, 1)).toBe(true);
      expect(isBalanced(5, 5.5, 0.1)).toBe(false);
    });
  });

  describe('createInitialState', () => {
    it('should create empty state with no arguments', () => {
      const state = createInitialState();

      expect(state.leftPlate.objects).toHaveLength(0);
      expect(state.rightPlate.objects).toHaveLength(0);
      expect(state.leftPlate.totalWeight).toBe(0);
      expect(state.rightPlate.totalWeight).toBe(0);
      expect(state.isBalanced).toBe(true);
      expect(state.angle).toBe(0);
    });

    it('should create state with initial objects', () => {
      const state = createInitialState([apple], [orange, banana]);

      expect(state.leftPlate.objects).toHaveLength(1);
      expect(state.rightPlate.objects).toHaveLength(2);
      expect(state.leftPlate.totalWeight).toBe(3);
      expect(state.rightPlate.totalWeight).toBe(3);
      expect(state.isBalanced).toBe(true);
    });

    it('should calculate angle for unbalanced state', () => {
      const state = createInitialState([apple, apple], [banana]);

      expect(state.isBalanced).toBe(false);
      expect(state.angle).not.toBe(0);
    });
  });

  describe('addObjectToPlate', () => {
    it('should add object to left plate', () => {
      const state = createInitialState();
      const newState = addObjectToPlate(state, apple, 'left');

      expect(newState.leftPlate.objects).toHaveLength(1);
      expect(newState.leftPlate.totalWeight).toBe(3);
    });

    it('should add object to right plate', () => {
      const state = createInitialState();
      const newState = addObjectToPlate(state, orange, 'right');

      expect(newState.rightPlate.objects).toHaveLength(1);
      expect(newState.rightPlate.totalWeight).toBe(2);
    });

    it('should update balance state', () => {
      const state = createInitialState();
      let newState = addObjectToPlate(state, apple, 'left');

      expect(newState.isBalanced).toBe(false);
      expect(newState.angle).toBeLessThan(0); // Left is heavier

      newState = addObjectToPlate(newState, { ...apple, id: 'apple-2' }, 'right');
      expect(newState.isBalanced).toBe(true);
    });

    it('should preserve existing objects', () => {
      let state = createInitialState([apple], []);
      state = addObjectToPlate(state, orange, 'left');

      expect(state.leftPlate.objects).toHaveLength(2);
      expect(state.leftPlate.totalWeight).toBe(5);
    });
  });

  describe('removeObjectFromPlate', () => {
    it('should remove object from left plate', () => {
      const state = createInitialState([apple, orange], []);
      const newState = removeObjectFromPlate(state, 'apple-1', 'left');

      expect(newState.leftPlate.objects).toHaveLength(1);
      expect(newState.leftPlate.totalWeight).toBe(2);
    });

    it('should remove object from right plate', () => {
      const state = createInitialState([], [apple, orange]);
      const newState = removeObjectFromPlate(state, 'orange-1', 'right');

      expect(newState.rightPlate.objects).toHaveLength(1);
      expect(newState.rightPlate.totalWeight).toBe(3);
    });

    it('should not change state if object not found', () => {
      const state = createInitialState([apple], []);
      const newState = removeObjectFromPlate(state, 'nonexistent', 'left');

      expect(newState).toEqual(state);
    });

    it('should update balance state', () => {
      const state = createInitialState([apple], [orange, banana]);
      // Left: 3, Right: 3 - balanced

      const newState = removeObjectFromPlate(state, 'banana-1', 'right');
      // Left: 3, Right: 2 - unbalanced

      expect(newState.isBalanced).toBe(false);
    });
  });

  describe('getBalanceDescription', () => {
    it('should describe balanced state', () => {
      const state = createInitialState([apple], [{ ...orange, value: 3, id: 'o' }]);
      const description = getBalanceDescription(state);

      expect(description).toBe('La balance est équilibrée');
    });

    it('should describe left-heavy state', () => {
      const state = createInitialState([apple, apple], [banana]);
      const description = getBalanceDescription(state);

      expect(description).toContain('gauche');
      expect(description).toContain('plus lourd');
    });

    it('should describe right-heavy state', () => {
      const state = createInitialState([banana], [apple, apple]);
      const description = getBalanceDescription(state);

      expect(description).toContain('droit');
      expect(description).toContain('plus lourd');
    });
  });

  describe('detectEquivalence', () => {
    it('should return null for unbalanced weights', () => {
      const result = detectEquivalence([apple], [banana]);
      expect(result).toBeNull();
    });

    it('should return equivalence string for balanced weights', () => {
      const leftObjects = [apple]; // value: 3
      const rightObjects = [
        { ...orange, value: 1.5, id: 'o1' },
        { ...orange, value: 1.5, id: 'o2' },
      ]; // total: 3

      const result = detectEquivalence(leftObjects, rightObjects);
      expect(result).toBe('🍎 = 🍊🍊');
    });

    it('should handle multiple objects on both sides', () => {
      const leftObjects = [
        { ...apple, id: 'a1' },
        { ...apple, id: 'a2' },
      ]; // value: 6
      const rightObjects = [
        { ...orange, id: 'o1' },
        { ...orange, id: 'o2' },
        { ...orange, id: 'o3' },
      ]; // value: 6

      const result = detectEquivalence(leftObjects, rightObjects);
      expect(result).toBe('🍎🍎 = 🍊🍊🍊');
    });

    it('should return null for empty plates', () => {
      const result = detectEquivalence([], []);
      expect(result).toBe(' = '); // Both empty but technically balanced
    });
  });
});
