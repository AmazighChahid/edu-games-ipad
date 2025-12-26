/**
 * Mots Croisés Game Module
 *
 * Jeu de mots croisés pour enfants
 */

// Types
export * from './types';

// Logic
export * from './logic';

// Components
export * from './components';

// Hooks
export { useMotsCroisesGame } from './hooks/useMotsCroisesGame';

// Data
export {
  CROSSWORD_GRIDS,
  getGridById,
  getGridsByDifficulty,
  getFirstGrid,
  getAllGrids,
} from './data/grids';
export { motsCroisesAssistantScripts } from './data/assistantScripts';

// Utility: Get first level (alias)
export function getFirstCrosswordLevel() {
  const { getFirstGrid } = require('./data/grids');
  return getFirstGrid();
}

// Utility: Get all levels (alias)
export function getAllCrosswordLevels() {
  const { getAllGrids } = require('./data/grids');
  return getAllGrids();
}
