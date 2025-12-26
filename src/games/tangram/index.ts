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

// Utility: Get first level
export function getFirstTangramLevel() {
  const { TANGRAM_PUZZLES } = require('./data/puzzles');
  return TANGRAM_PUZZLES[0];
}

// Utility: Get all levels
export function getAllTangramLevels() {
  const { TANGRAM_PUZZLES } = require('./data/puzzles');
  return TANGRAM_PUZZLES;
}
