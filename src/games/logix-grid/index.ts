/**
 * Logix Grid Game Module
 *
 * Jeu de grilles logiques pour enfants
 */

// Types
export * from './types';

// Logic
export * from './logic';

// Components
export * from './components';

// Hooks
export { useLogixGridGame } from './hooks/useLogixGridGame';

// Data
export {
  LOGIX_PUZZLES,
  getPuzzleById,
  getPuzzlesByDifficulty,
  getFirstPuzzle,
  getAllPuzzles,
} from './data/puzzles';
export { logixAssistantScripts } from './data/assistantScripts';

// Utility: Get first puzzle (alias)
export function getFirstLogixPuzzle() {
  const { getFirstPuzzle } = require('./data/puzzles');
  return getFirstPuzzle();
}

// Utility: Get all puzzles (alias)
export function getAllLogixPuzzles() {
  const { getAllPuzzles } = require('./data/puzzles');
  return getAllPuzzles();
}
