/**
 * Balance Logic Engine
 * Pure functions for balance calculation and physics
 */

import type { BalancePlate, BalanceState, WeightObject } from '../types';

const BALANCE_TOLERANCE = 0.1; // Weight difference tolerance for "balanced"
const MAX_ANGLE = 30; // Maximum tilt angle in degrees
const WEIGHT_PER_DEGREE = 0.15; // Sensitivity

/**
 * Calculate total weight of objects on a plate
 */
export function calculatePlateWeight(objects: WeightObject[]): number {
  return objects.reduce((total, obj) => total + obj.value, 0);
}

/**
 * Calculate balance angle based on weight difference
 * Negative = tilted left, Positive = tilted right, 0 = balanced
 */
export function calculateBalanceAngle(leftWeight: number, rightWeight: number): number {
  const diff = leftWeight - rightWeight;
  const rawAngle = -diff / WEIGHT_PER_DEGREE;

  // Clamp to max angle
  return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, rawAngle));
}

/**
 * Check if balance is in equilibrium
 */
export function isBalanced(leftWeight: number, rightWeight: number, tolerance = BALANCE_TOLERANCE): boolean {
  return Math.abs(leftWeight - rightWeight) <= tolerance;
}

/**
 * Create initial balance state
 */
export function createInitialState(
  leftObjects: WeightObject[] = [],
  rightObjects: WeightObject[] = []
): BalanceState {
  const leftWeight = calculatePlateWeight(leftObjects);
  const rightWeight = calculatePlateWeight(rightObjects);

  return {
    leftPlate: {
      side: 'left',
      objects: leftObjects,
      totalWeight: leftWeight,
    },
    rightPlate: {
      side: 'right',
      objects: rightObjects,
      totalWeight: rightWeight,
    },
    angle: calculateBalanceAngle(leftWeight, rightWeight),
    isBalanced: isBalanced(leftWeight, rightWeight),
    isAnimating: false,
    tolerance: BALANCE_TOLERANCE,
  };
}

/**
 * Add object to a plate
 */
export function addObjectToPlate(
  state: BalanceState,
  object: WeightObject,
  side: 'left' | 'right'
): BalanceState {
  const plate = side === 'left' ? state.leftPlate : state.rightPlate;
  const updatedPlate: BalancePlate = {
    ...plate,
    objects: [...plate.objects, object],
    totalWeight: plate.totalWeight + object.value,
  };

  const newState = {
    ...state,
    [side === 'left' ? 'leftPlate' : 'rightPlate']: updatedPlate,
  };

  const leftWeight = newState.leftPlate.totalWeight;
  const rightWeight = newState.rightPlate.totalWeight;

  return {
    ...newState,
    angle: calculateBalanceAngle(leftWeight, rightWeight),
    isBalanced: isBalanced(leftWeight, rightWeight),
  };
}

/**
 * Remove object from a plate
 */
export function removeObjectFromPlate(
  state: BalanceState,
  objectId: string,
  side: 'left' | 'right'
): BalanceState {
  const plate = side === 'left' ? state.leftPlate : state.rightPlate;
  const objectToRemove = plate.objects.find(obj => obj.id === objectId);

  if (!objectToRemove) {
    return state;
  }

  const updatedPlate: BalancePlate = {
    ...plate,
    objects: plate.objects.filter(obj => obj.id !== objectId),
    totalWeight: plate.totalWeight - objectToRemove.value,
  };

  const newState = {
    ...state,
    [side === 'left' ? 'leftPlate' : 'rightPlate']: updatedPlate,
  };

  const leftWeight = newState.leftPlate.totalWeight;
  const rightWeight = newState.rightPlate.totalWeight;

  return {
    ...newState,
    angle: calculateBalanceAngle(leftWeight, rightWeight),
    isBalanced: isBalanced(leftWeight, rightWeight),
  };
}

/**
 * Get balance state description for accessibility
 */
export function getBalanceDescription(state: BalanceState): string {
  if (state.isBalanced) {
    return 'La balance est équilibrée';
  }

  const diff = state.leftPlate.totalWeight - state.rightPlate.totalWeight;
  if (diff > 0) {
    return `Le côté gauche est plus lourd de ${Math.abs(diff).toFixed(1)} unités`;
  } else {
    return `Le côté droit est plus lourd de ${Math.abs(diff).toFixed(1)} unités`;
  }
}

/**
 * Calculate equivalence discovery
 * Returns discovered equivalence string if puzzle is solved
 */
export function detectEquivalence(
  leftObjects: WeightObject[],
  rightObjects: WeightObject[]
): string | null {
  const leftWeight = calculatePlateWeight(leftObjects);
  const rightWeight = calculatePlateWeight(rightObjects);

  if (!isBalanced(leftWeight, rightWeight)) {
    return null;
  }

  // Generate equivalence string
  const leftStr = leftObjects.map(o => o.emoji).join('');
  const rightStr = rightObjects.map(o => o.emoji).join('');

  return `${leftStr} = ${rightStr}`;
}
