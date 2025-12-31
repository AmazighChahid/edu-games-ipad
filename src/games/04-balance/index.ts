/**
 * Balance Logic Game - Main Exports
 * Complete balance scale game with 4 phases, journal, and sandbox mode
 */

// Screens
export { BalanceGameScreen } from './screens/BalanceGameScreen';
export { BalanceIntroScreen } from './screens';
export { BalanceHanoiIntroScreen } from './screens';

// Components
export { BalanceScale } from './components/BalanceScale';
export { WeightObject } from './components/WeightObject';
export { DrHibou } from './components/DrHibou';
export { EquivalenceJournal } from './components/EquivalenceJournal';
export { LevelSelector } from './components/LevelSelector';
export { SandboxMode } from './components/SandboxMode';

// Hooks
export { useBalanceGame } from './hooks/useBalanceGame';
export { useBalancePhysics, usePlateHoverAnimation, useObjectPlacementAnimation, useVictoryCelebration } from './hooks/useBalancePhysics';

// Logic
export * from './logic/balanceEngine';

// Data
export {
  getAllPuzzles,
  getPuzzleById,
  getPuzzlesByPhase,
  getPhaseProgress
} from './data/puzzles';
export {
  OBJECTS_LIBRARY,
  createObject,
  createMultipleObjects,
  createUnknownObject,
  getObjectsByCategory,
  SANDBOX_OBJECTS
} from './data/objects';

// Types
export * from './types';
