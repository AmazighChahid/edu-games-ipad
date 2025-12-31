/**
 * Memory Game Module
 *
 * Super Mémoire - Jeu de mémoire pour enfants
 */

// Types (renamed type to avoid conflict with component)
export type {
  MemoryCard as MemoryCardType,
  MemoryLevel,
  MemoryGameState,
  MemoryResult,
  MemoryConfig,
  MemoryAction,
  ThemeConfig,
  CardTheme,
  CardState,
  GamePhase,
  Difficulty,
} from './types';
export { DEFAULT_MEMORY_CONFIG } from './types';

// Logic
export * from './logic';

// Components
export { MemoryCard, MemoryGrid, GameBoard } from './components';

// Screens
export { MemoryIntroScreen } from './screens';

// Hooks
export { useMemoryGame, useMemorySound, useMemoryIntro } from './hooks';
export type { UseMemoryGameReturn, UseMemorySoundReturn, UseMemoryIntroReturn } from './hooks';

// Mascot
export { MemoMascot, type MemoEmotionType } from './components/mascot';

// Data
export { MEMORY_THEMES, getTheme, getThemeSymbols } from './data/themes';
export {
  getAllLevels as getMemoryLevels,
  getLevelById as getMemoryLevelById,
  getLevelByNumber as getMemoryLevelByNumber,
  getFirstLevel as getFirstMemoryLevel,
  getTotalLevels as getMemoryTotalLevels,
  getTrainingLevel as getMemoryTrainingLevel,
  createTrainingLevel as createMemoryTrainingLevel,
} from './data/levels';
export { memoryAssistantScripts } from './data/assistantScripts';
