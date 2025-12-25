/**
 * MathBlocks game module
 * A math matching game where players pair calculations with results
 */

// Types
export * from './types';

// Logic
export { createInitialState, generatePairs } from './logic/mathEngine';
export {
  markBlocksAsMatched,
  removeMatchedBlocks,
  removeAllMatchedBlocks,
  applyGravity,
  fillEmptySpaces,
  updateBlockSelection,
  clearAllSelections,
  getAllBlocks,
  isGridEmpty,
  hasValidMatches,
} from './logic/gridEngine';
export {
  validateMatch,
  canBlockBeMatched,
  findPossibleMatches,
  getMatchErrorMessage,
} from './logic/matchValidator';

// Hooks
export { useMathGame } from './hooks/useMathGame';

// Components
export { MathBlock, GameGrid, TimerBar, ScoreDisplay } from './components';

// Screens
export { MathIntroScreen, MathPlayScreen, MathVictoryScreen } from './screens';

// Data
export { mathLevels, getLevel, getDefaultLevel, getLevelsByDifficulty } from './data/levels';
export { mathBlocksScripts, getScriptsForTrigger } from './data/assistantScripts';
