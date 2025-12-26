/**
 * Balance Game Hook
 * Manages game state, moves, and puzzle progression
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { BalanceState, Puzzle, WeightObject, ObjectConfig, StockConfig } from '../types';
import {
  createInitialState,
  addObjectToPlate,
  removeObjectFromPlate,
  detectEquivalence,
} from '../logic/balanceEngine';
import { createObject, createUnknownObject } from '../data/objects';

interface UseBalanceGameProps {
  puzzle: Puzzle;
  onComplete?: (stats: GameStats) => void;
}

interface GameStats {
  puzzleId: string;
  completed: boolean;
  attempts: number;
  hintsUsed: number;
  timeSpent: number;
  equivalenciesDiscovered: string[];
}

/**
 * Convert ObjectConfig[] to WeightObject[]
 * Handles both regular objects and unknown objects with custom values
 */
function convertConfigToObjects(
  configs: ObjectConfig[],
  unknownValue?: number
): WeightObject[] {
  const objects: WeightObject[] = [];

  for (const config of configs) {
    for (let i = 0; i < config.count; i++) {
      if (config.objectId === 'unknown' && unknownValue !== undefined) {
        objects.push(createUnknownObject(unknownValue));
      } else {
        objects.push(createObject(config.objectId));
      }
    }
  }

  return objects;
}

/**
 * Convert StockConfig[] to WeightObject[]
 * Creates individual objects from stock configuration
 */
function convertStockToObjects(configs: StockConfig[]): WeightObject[] {
  const objects: WeightObject[] = [];

  for (const config of configs) {
    for (let i = 0; i < config.count; i++) {
      objects.push(createObject(config.objectId));
    }
  }

  return objects;
}

export function useBalanceGame({ puzzle, onComplete }: UseBalanceGameProps) {
  // Convert puzzle configs to actual WeightObject instances
  const initialLeftObjects = useMemo(
    () => convertConfigToObjects(puzzle.initialLeft, puzzle.unknownValue),
    [puzzle.initialLeft, puzzle.unknownValue]
  );

  const initialRightObjects = useMemo(
    () => convertConfigToObjects(puzzle.initialRight, puzzle.unknownValue),
    [puzzle.initialRight, puzzle.unknownValue]
  );

  const initialAvailableObjects = useMemo(
    () => convertStockToObjects(puzzle.availableObjects),
    [puzzle.availableObjects]
  );

  const [balanceState, setBalanceState] = useState<BalanceState>(() =>
    createInitialState(initialLeftObjects, initialRightObjects)
  );

  const [availableObjects, setAvailableObjects] = useState<WeightObject[]>(initialAvailableObjects);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [discoveredEquivalences, setDiscoveredEquivalences] = useState<string[]>([]);
  const [isVictory, setIsVictory] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const startTimeRef = useRef<number>(Date.now());

  // Reset state when puzzle changes
  useEffect(() => {
    const leftObjects = convertConfigToObjects(puzzle.initialLeft, puzzle.unknownValue);
    const rightObjects = convertConfigToObjects(puzzle.initialRight, puzzle.unknownValue);
    const stockObjects = convertStockToObjects(puzzle.availableObjects);

    setBalanceState(createInitialState(leftObjects, rightObjects));
    setAvailableObjects(stockObjects);
    setAttempts(0);
    setHintsUsed(0);
    setCurrentHintIndex(0);
    setDiscoveredEquivalences([]);
    setIsVictory(false);
    setShowHint(false);
    startTimeRef.current = Date.now();
  }, [puzzle.id]);

  // Check for victory
  useEffect(() => {
    if (balanceState.isBalanced && !isVictory) {
      setIsVictory(true);

      // Detect equivalence
      const equivalence = detectEquivalence(
        balanceState.leftPlate.objects,
        balanceState.rightPlate.objects
      );

      if (equivalence) {
        setDiscoveredEquivalences((prev) => [...new Set([...prev, equivalence])]);
      }

      // Call completion callback
      if (onComplete) {
        const timeSpent = Date.now() - startTimeRef.current;
        onComplete({
          puzzleId: puzzle.id,
          completed: true,
          attempts,
          hintsUsed,
          timeSpent,
          equivalenciesDiscovered: discoveredEquivalences,
        });
      }
    }
  }, [balanceState.isBalanced, isVictory, attempts, hintsUsed, discoveredEquivalences, onComplete, puzzle.id]);

  /**
   * Add object to balance plate
   */
  const placeObject = useCallback((object: WeightObject, side: 'left' | 'right') => {
    setBalanceState((prev) => addObjectToPlate(prev, object, side));
    setAvailableObjects((prev) => prev.filter((obj) => obj.id !== object.id));
    setAttempts((prev) => prev + 1);
  }, []);

  /**
   * Remove object from balance plate
   */
  const removeObject = useCallback((objectId: string, side: 'left' | 'right') => {
    const plate = side === 'left' ? balanceState.leftPlate : balanceState.rightPlate;
    const object = plate.objects.find((obj) => obj.id === objectId);

    if (object) {
      setBalanceState((prev) => removeObjectFromPlate(prev, objectId, side));
      setAvailableObjects((prev) => [...prev, object]);
    }
  }, [balanceState]);

  /**
   * Request hint
   */
  const requestHint = useCallback(() => {
    if (currentHintIndex < puzzle.hints.length) {
      setShowHint(true);
      setHintsUsed((prev) => prev + 1);

      // Auto-hide hint after 5 seconds
      setTimeout(() => {
        setShowHint(false);
        setCurrentHintIndex((prev) => Math.min(prev + 1, puzzle.hints.length - 1));
      }, 5000);
    }
  }, [currentHintIndex, puzzle.hints.length]);

  /**
   * Reset puzzle
   */
  const reset = useCallback(() => {
    const leftObjects = convertConfigToObjects(puzzle.initialLeft, puzzle.unknownValue);
    const rightObjects = convertConfigToObjects(puzzle.initialRight, puzzle.unknownValue);
    const stockObjects = convertStockToObjects(puzzle.availableObjects);

    setBalanceState(createInitialState(leftObjects, rightObjects));
    setAvailableObjects(stockObjects);
    setAttempts(0);
    setHintsUsed(0);
    setCurrentHintIndex(0);
    setDiscoveredEquivalences([]);
    setIsVictory(false);
    setShowHint(false);
    startTimeRef.current = Date.now();
  }, [puzzle]);

  const currentHint = showHint ? puzzle.hints[currentHintIndex] : null;

  return {
    balanceState,
    availableObjects,
    placeObject,
    removeObject,
    requestHint,
    currentHint,
    hintsUsed,
    attempts,
    isVictory,
    discoveredEquivalences,
    reset,
  };
}
