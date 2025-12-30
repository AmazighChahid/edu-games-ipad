/**
 * La Fabrique de Réactions - Main exports
 * ========================================
 * Jeu de puzzle logique de réactions en chaîne
 * Mascotte : Gédéon le Hamster Ingénieur
 * Âge cible : 7-10 ans
 *
 * @see docs/TRAME_REFERENTIEL.md - Activité 14
 */

// ============================================
// TYPES
// ============================================

export * from './types';

// ============================================
// DATA
// ============================================

export { ELEMENTS, getElementDefinition, getUnlockedElements } from './data/elements';
export { LEVELS, getLevelById, getLevelByNumber } from './data/levels';
export {
  fabriqueAssistantScripts,
  GEDEON_MESSAGES,
  getRandomMessage,
} from './data/assistantScripts';

// ============================================
// HOOKS
// ============================================

export { useFabriqueGame } from './hooks/useFabriqueGame';
export { useFabriqueSound } from './hooks/useFabriqueSound';
export { useFabriqueIntro } from './hooks/useFabriqueIntro';

// ============================================
// COMPONENTS
// ============================================

export { GedeonMascot } from './components/GedeonMascot';

// ============================================
// SCREENS
// ============================================

export { FabriqueIntroScreen } from './screens';
