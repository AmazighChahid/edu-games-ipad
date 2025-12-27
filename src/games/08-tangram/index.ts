/**
 * Tangram Game Module
 *
 * Puzzle Formes - Jeu de Tangram pour enfants
 */

// Types
export * from './types';

// Logic
export * from './logic';

// Components
export * from './components';

// Hooks
export { useTangramGame } from './hooks/useTangramGame';

// Data
export { TANGRAM_PUZZLES, getPuzzleById, getPuzzlesByDifficulty } from './data/puzzles';
export { tangramAssistantScripts } from './data/assistantScripts';

// Utility: Get first level (returns a TangramLevel ready for use)
export function getFirstTangramLevel() {
  const { TANGRAM_PUZZLES, createLevelFromPuzzle } = require('./data/puzzles');
  const firstPuzzle = TANGRAM_PUZZLES[0];
  return createLevelFromPuzzle(firstPuzzle);
}

// Utility: Get all levels (returns TangramLevel[])
export function getAllTangramLevels() {
  const { TANGRAM_PUZZLES, createLevelFromPuzzle } = require('./data/puzzles');
  return TANGRAM_PUZZLES.map((puzzle: any) => createLevelFromPuzzle(puzzle));
}
