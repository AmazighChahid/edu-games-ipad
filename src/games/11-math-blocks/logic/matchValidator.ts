/**
 * Match Validator for MathBlocks
 * Validates if two blocks form a valid pair
 */

import type { MathBlock } from '../types';

export interface MatchResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validate if two blocks form a valid match
 * A valid match requires:
 * 1. Different block types (one operation, one result)
 * 2. Same numeric value
 */
export const validateMatch = (
  block1: MathBlock,
  block2: MathBlock
): MatchResult => {
  // Can't match with itself
  if (block1.id === block2.id) {
    return { valid: false, reason: 'same_block' };
  }

  // Must be different types (operation + result)
  if (block1.type === block2.type) {
    return {
      valid: false,
      reason: block1.type === 'operation' ? 'both_operations' : 'both_results',
    };
  }

  // Values must match
  if (block1.value !== block2.value) {
    return { valid: false, reason: 'value_mismatch' };
  }

  return { valid: true };
};

/**
 * Check if a block can potentially be matched
 * (there exists another block with the same value and different type)
 */
export const canBlockBeMatched = (
  block: MathBlock,
  allBlocks: MathBlock[]
): boolean => {
  return allBlocks.some(
    other =>
      other.id !== block.id &&
      other.type !== block.type &&
      other.value === block.value &&
      !other.isMatched
  );
};

/**
 * Find all possible matches for a block
 */
export const findPossibleMatches = (
  block: MathBlock,
  allBlocks: MathBlock[]
): MathBlock[] => {
  return allBlocks.filter(
    other =>
      other.id !== block.id &&
      other.type !== block.type &&
      other.value === block.value &&
      !other.isMatched
  );
};

/**
 * Get match error message for display
 */
export const getMatchErrorMessage = (reason: string): string => {
  switch (reason) {
    case 'same_block':
      return 'Selectionne une autre brique';
    case 'both_operations':
      return 'Tu dois associer un calcul avec un resultat';
    case 'both_results':
      return 'Tu dois associer un resultat avec un calcul';
    case 'value_mismatch':
      return 'Ces deux briques ne correspondent pas';
    default:
      return 'Essaie encore !';
  }
};
