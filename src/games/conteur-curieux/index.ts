/**
 * Conteur Curieux Game Module
 *
 * Jeu de compréhension de lecture pour enfants
 */

// Types
export * from './types';

// Logic
export * from './logic';

// Components
export * from './components';

// Hooks
export { useConteurGame } from './hooks/useConteurGame';

// Data
export {
  CONTEUR_LEVELS,
  getLevelById,
  getLevelsByDifficulty,
  getFirstLevel,
  getAllLevels,
  getLevelsByTheme,
  getAvailableThemes,
} from './data/stories';
export { conteurAssistantScripts } from './data/assistantScripts';

// Screens
export * from './screens';

// Utility: Get first level (alias)
export function getFirstConteurLevel() {
  const { getFirstLevel } = require('./data/stories');
  return getFirstLevel();
}

// Utility: Get all levels (alias)
export function getAllConteurLevels() {
  const { getAllLevels } = require('./data/stories');
  return getAllLevels();
}
