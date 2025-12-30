/**
 * Chasseur de Papillons - Main exports
 * Selective attention and working memory game for children 5-8 years old
 *
 * Compétences travaillées:
 * - Attention sélective
 * - Mémoire de travail
 * - Inhibition
 * - Reconnaissance de patterns
 */

// Types
export * from './types';

// Data
export { chasseurLevels, getLevel, getLevelByOrder, getNextLevel, matchesRule } from './data/levels';
export { chasseurAssistantScripts } from './data/assistantScripts';

// Hooks
export { useChasseurGame } from './hooks/useChasseurGame';
export { useChasseurSound } from './hooks/useChasseurSound';
export { useChasseurIntro } from './hooks/useChasseurIntro';
export { useChasseurAnimations } from './hooks/useChasseurAnimations';
export { useChasseurFeedback } from './hooks/useChasseurFeedback';

// Components
export { MascotFlutty, ButterflySprite, RuleBadge, ChasseurLevelCard } from './components';

// Screens
export { default as ChasseurIntroScreen } from './screens/ChasseurIntroScreen';
