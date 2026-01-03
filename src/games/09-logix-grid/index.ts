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

// Screens
export * from './screens';

// Hooks
export { useLogixGridGame } from './hooks/useLogixGridGame';
export { useLogixGridSound } from './hooks/useLogixGridSound';
export { useLogixGridIntro } from './hooks/useLogixGridIntro';

// Data
export {
  LOGIX_PUZZLES,
  getPuzzleById,
  getPuzzlesByDifficulty,
  getFirstPuzzle,
  getAllPuzzles,
} from './data/puzzles';
// TODO: Fix AssistantScript type compatibility
// export { logixAssistantScripts } from './data/assistantScripts';

// Utility: Get first puzzle (alias) - using ES6 re-export
export { getFirstPuzzle as getFirstLogixPuzzle } from './data/puzzles';

// Utility: Get all puzzles (alias) - using ES6 re-export
export { getAllPuzzles as getAllLogixPuzzles } from './data/puzzles';
