/**
 * Memory Game Module
 *
 * Super Mémoire - Jeu de mémoire pour enfants
 */

// Types
export * from './types';

// Logic
export * from './logic';

// Components
export * from './components';

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
} from './data/levels';
export { memoryAssistantScripts } from './data/assistantScripts';
