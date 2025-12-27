/**
 * Math Engine for MathBlocks
 * Generates math operations and manages calculations
 */

import type { MathOperation, MathBlock, MathLevelConfig } from '../types';
import { OPERATION_SYMBOLS } from '../types';

// Generate a unique ID
let idCounter = 0;
const generateId = (): string => `block_${++idCounter}`;

// Reset ID counter (call when starting new game)
export const resetIdCounter = (): void => {
  idCounter = 0;
};

/**
 * Generate a random integer in range [min, max]
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a random operation
 */
const generateRandomOperation = (
  operation: MathOperation,
  range: [number, number]
): { operands: [number, number]; result: number; display: string } => {
  const [min, max] = range;
  let a: number, b: number, result: number;

  switch (operation) {
    case 'add':
      // Ensure sum stays reasonable
      a = randomInt(min, Math.min(max, Math.floor(max / 2) + min));
      b = randomInt(min, Math.min(max - a, max));
      result = a + b;
      break;

    case 'subtract':
      // Ensure positive result
      a = randomInt(min + 1, max);
      b = randomInt(min, a - 1);
      result = a - b;
      break;

    case 'multiply':
      // Keep multiplications manageable for kids
      const maxMultiplier = Math.min(10, max);
      a = randomInt(1, maxMultiplier);
      b = randomInt(1, Math.min(maxMultiplier, Math.floor(max / a)));
      result = a * b;
      break;

    case 'divide':
      // Ensure clean division (no decimals)
      b = randomInt(1, Math.min(10, max));
      const quotient = randomInt(1, Math.floor(max / b));
      a = b * quotient;
      result = quotient;
      break;

    default:
      a = randomInt(min, max);
      b = randomInt(min, max);
      result = a + b;
  }

  const symbol = OPERATION_SYMBOLS[operation];
  const display = `${a} ${symbol} ${b}`;

  return { operands: [a, b], result, display };
};

/**
 * Generate pairs of blocks (operation + result)
 */
export const generatePairs = (
  count: number,
  operations: MathOperation[],
  range: [number, number]
): MathBlock[] => {
  const blocks: MathBlock[] = [];
  const usedResults = new Set<number>();

  for (let i = 0; i < count; i++) {
    // Pick random operation
    const operation = operations[randomInt(0, operations.length - 1)];

    // Generate operation, ensuring unique results
    let opData;
    let attempts = 0;
    do {
      opData = generateRandomOperation(operation, range);
      attempts++;
    } while (usedResults.has(opData.result) && attempts < 50);

    usedResults.add(opData.result);

    // Create operation block
    const operationBlock: MathBlock = {
      id: generateId(),
      type: 'operation',
      value: opData.result,
      display: opData.display,
      operation,
      operands: opData.operands,
      row: 0,
      col: 0,
      isSelected: false,
      isMatched: false,
    };

    // Create result block
    const resultBlock: MathBlock = {
      id: generateId(),
      type: 'result',
      value: opData.result,
      display: String(opData.result),
      row: 0,
      col: 0,
      isSelected: false,
      isMatched: false,
    };

    blocks.push(operationBlock, resultBlock);
  }

  return blocks;
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Place blocks on a grid
 */
export const placeBlocksOnGrid = (
  blocks: MathBlock[],
  rows: number,
  cols: number
): (MathBlock | null)[][] => {
  const shuffled = shuffleArray(blocks);
  const grid: (MathBlock | null)[][] = [];

  let blockIndex = 0;

  for (let row = 0; row < rows; row++) {
    const gridRow: (MathBlock | null)[] = [];
    for (let col = 0; col < cols; col++) {
      if (blockIndex < shuffled.length) {
        const block = { ...shuffled[blockIndex], row, col };
        gridRow.push(block);
        blockIndex++;
      } else {
        gridRow.push(null);
      }
    }
    grid.push(gridRow);
  }

  return grid;
};

/**
 * Create initial game state for a level
 */
export const createInitialState = (level: MathLevelConfig) => {
  resetIdCounter();

  const pairs = generatePairs(
    level.targetPairs,
    level.operations,
    level.numberRange
  );

  const grid = placeBlocksOnGrid(pairs, level.gridRows, level.gridCols);

  return {
    grid,
    selectedBlock: null,
    score: 0,
    combo: 0,
    matchesFound: 0,
    totalPairs: level.targetPairs,
    timeRemaining: level.timeLimit,
    isPlaying: true,
  };
};

/**
 * Generate additional pairs to fill empty spaces
 */
export const generateAdditionalPairs = (
  count: number,
  operations: MathOperation[],
  range: [number, number]
): MathBlock[] => {
  return generatePairs(count, operations, range);
};
