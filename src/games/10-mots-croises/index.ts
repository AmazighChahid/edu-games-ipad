/**
 * Mots Croisés Game Module
 *
 * Jeu de mots croisés pour enfants
 * Refactorisé avec le pattern GameIntroTemplate
 */

// Import for utility functions
import { CROSSWORD_GRIDS as _CROSSWORD_GRIDS } from './data/grids';
import type { CrosswordLevel } from './types';

// Types - export only specific types to avoid conflicts
export type {
  WordDirection,
  CrosswordWord,
  LetterStatus,
  CrosswordCell as CrosswordCellType,
  CrosswordDifficulty,
  CrosswordLevel,
  CrosswordPhase,
  CrosswordGameState,
  CrosswordResult,
  CrosswordAssistantTrigger,
} from './types';
export { DEFAULT_CROSSWORD_CONFIG } from './types';

// Logic
export * from './logic';

// Components - export explicitly to avoid conflicts
export { GameBoard } from './components/GameBoard';
export { CrosswordGrid } from './components/CrosswordGrid';
export { CrosswordCell } from './components/CrosswordCell';
export { ClueList } from './components/ClueList';
export { Keyboard } from './components/Keyboard';
export { LexieMascot } from './components/LexieMascot';

// Screens
export { MotsCroisesIntroScreen } from './screens';

// Hooks
export { useMotsCroisesGame } from './hooks/useMotsCroisesGame';
export { useMotsCroisesSound } from './hooks/useMotsCroisesSound';
export { useMotsCroisesIntro } from './hooks/useMotsCroisesIntro';

// Data - Grids
export {
  CROSSWORD_GRIDS,
  getGridById,
  getGridsByDifficulty,
  getFirstGrid,
  getAllGrids,
} from './data/grids';

// Data - Levels
export {
  motsCroisesLevels,
  getLevel,
  getDefaultLevel,
  getLevelByOrder,
  getLevelsByDifficulty,
  getNextLevel,
  getLevelByGridId,
  getGridForLevel,
  type MotsCroisesLevel,
} from './data/levels';

// Note: Les scripts assistant sont gérés par LEXIE_MESSAGES dans useMotsCroisesIntro

// Utility: Get first level grid (pour l'ancien écran index.tsx)
export function getFirstCrosswordLevel(): CrosswordLevel {
  return _CROSSWORD_GRIDS[0];
}

// Utility: Get all level grids (alias)
export function getAllCrosswordLevels(): CrosswordLevel[] {
  return _CROSSWORD_GRIDS;
}
