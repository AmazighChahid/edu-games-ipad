/**
 * Grid Engine for MathBlocks
 * Manages the game grid, gravity, and block placement
 */

import type { MathBlock, GameGrid } from '../types';

/**
 * Mark blocks as matched (for explosion animation)
 */
export const markBlocksAsMatched = (
  grid: GameGrid,
  block1: MathBlock,
  block2: MathBlock
): GameGrid => {
  return grid.map(row =>
    row.map(block => {
      if (block && (block.id === block1.id || block.id === block2.id)) {
        return { ...block, isMatched: true, isSelected: false };
      }
      return block;
    })
  );
};

/**
 * Remove matched blocks from the grid
 */
export const removeMatchedBlocks = (
  grid: GameGrid,
  block1: MathBlock,
  block2: MathBlock
): GameGrid => {
  const newGrid = grid.map(row =>
    row.map(block => {
      if (block && (block.id === block1.id || block.id === block2.id)) {
        return null;
      }
      return block;
    })
  );
  return newGrid;
};

/**
 * Remove all blocks that are marked as matched
 */
export const removeAllMatchedBlocks = (grid: GameGrid): GameGrid => {
  return grid.map(row =>
    row.map(block => {
      if (block && block.isMatched) {
        return null;
      }
      return block;
    })
  );
};

/**
 * Apply gravity - blocks fall down to fill empty spaces
 */
export const applyGravity = (grid: GameGrid): GameGrid => {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  // Process each column
  const newGrid: GameGrid = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null));

  for (let col = 0; col < cols; col++) {
    // Collect non-null blocks from bottom to top
    const columnBlocks: MathBlock[] = [];
    for (let row = rows - 1; row >= 0; row--) {
      const block = grid[row][col];
      if (block) {
        columnBlocks.push(block);
      }
    }

    // Place blocks from bottom
    for (let i = 0; i < columnBlocks.length; i++) {
      const row = rows - 1 - i;
      newGrid[row][col] = {
        ...columnBlocks[i],
        row,
        col,
      };
    }
  }

  return newGrid;
};

/**
 * Count empty spaces in the grid
 */
export const countEmptySpaces = (grid: GameGrid): number => {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell === null) {
        count++;
      }
    }
  }
  return count;
};

/**
 * Fill empty spaces with new blocks (from top)
 */
export const fillEmptySpaces = (
  grid: GameGrid,
  newBlocks: MathBlock[]
): GameGrid => {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const newGrid = grid.map(row => [...row]);

  let blockIndex = 0;

  // Fill from top, left to right
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (newGrid[row][col] === null && blockIndex < newBlocks.length) {
        newGrid[row][col] = {
          ...newBlocks[blockIndex],
          row,
          col,
        };
        blockIndex++;
      }
    }
  }

  return newGrid;
};

/**
 * Update a block's selection state in the grid
 */
export const updateBlockSelection = (
  grid: GameGrid,
  blockId: string,
  isSelected: boolean
): GameGrid => {
  return grid.map(row =>
    row.map(block => {
      if (block && block.id === blockId) {
        return { ...block, isSelected };
      }
      return block;
    })
  );
};

/**
 * Clear all selections in the grid
 */
export const clearAllSelections = (grid: GameGrid): GameGrid => {
  return grid.map(row =>
    row.map(block => {
      if (block && block.isSelected) {
        return { ...block, isSelected: false };
      }
      return block;
    })
  );
};

/**
 * Get a block from the grid by ID
 */
export const getBlockById = (
  grid: GameGrid,
  blockId: string
): MathBlock | null => {
  for (const row of grid) {
    for (const block of row) {
      if (block && block.id === blockId) {
        return block;
      }
    }
  }
  return null;
};

/**
 * Get all non-null blocks from the grid
 */
export const getAllBlocks = (grid: GameGrid): MathBlock[] => {
  const blocks: MathBlock[] = [];
  for (const row of grid) {
    for (const block of row) {
      if (block) {
        blocks.push(block);
      }
    }
  }
  return blocks;
};

/**
 * Check if the grid is empty (all blocks matched)
 */
export const isGridEmpty = (grid: GameGrid): boolean => {
  for (const row of grid) {
    for (const block of row) {
      if (block !== null) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Check if any valid matches exist in the grid
 */
export const hasValidMatches = (grid: GameGrid): boolean => {
  const blocks = getAllBlocks(grid);

  // Group blocks by value
  const valueMap = new Map<number, MathBlock[]>();

  for (const block of blocks) {
    const existing = valueMap.get(block.value) || [];
    existing.push(block);
    valueMap.set(block.value, existing);
  }

  // Check if any value has both an operation and a result
  for (const [, blocksWithValue] of valueMap) {
    const hasOperation = blocksWithValue.some(b => b.type === 'operation');
    const hasResult = blocksWithValue.some(b => b.type === 'result');
    if (hasOperation && hasResult) {
      return true;
    }
  }

  return false;
};
