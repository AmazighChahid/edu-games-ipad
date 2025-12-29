/**
 * Memory Game Themes
 *
 * Thèmes visuels pour le jeu Memory
 * Chaque thème a ses propres symboles et couleurs
 * Utilise les couleurs du Design System
 */

import { colors } from '../../../theme';
import type { ThemeConfig, CardTheme } from '../types';

// ============================================================================
// THÈMES DISPONIBLES
// ============================================================================

export const MEMORY_THEMES: Record<CardTheme, ThemeConfig> = {
  animals: {
    id: 'animals',
    name: 'Animaux',
    description: 'Des animaux mignons à retrouver',
    symbols: [
      '🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🐨', '🦁',
      '🐯', '🐮', '🐷', '🐸', '🐵', '🦄', '🐝', '🦋',
    ],
    backgroundColor: colors.feedback.successLight,
    accentColor: colors.feedback.success,
  },

  fruits: {
    id: 'fruits',
    name: 'Fruits',
    description: 'Des fruits délicieux à associer',
    symbols: [
      '🍎', '🍐', '🍊', '🍋', '🍌', '🍇', '🍓', '🍒',
      '🍑', '🥝', '🍍', '🥭', '🍈', '🍉', '🫐', '🥥',
    ],
    backgroundColor: colors.home.categoryBackgrounds.memory,
    accentColor: colors.home.categories.memory,
  },

  vehicles: {
    id: 'vehicles',
    name: 'Véhicules',
    description: 'Des moyens de transport variés',
    symbols: [
      '🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒',
      '✈️', '🚀', '🚁', '⛵', '🚂', '🚲', '🛴', '🛵',
    ],
    backgroundColor: colors.home.categoryBackgrounds.logic,
    accentColor: colors.home.categories.logic,
  },

  nature: {
    id: 'nature',
    name: 'Nature',
    description: 'La beauté de la nature',
    symbols: [
      '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌵', '🌴',
      '🍀', '🍁', '🍂', '🌲', '🌳', '🌾', '🌿', '☘️',
    ],
    backgroundColor: colors.home.categoryBackgrounds.numbers,
    accentColor: colors.home.categories.numbers,
  },

  space: {
    id: 'space',
    name: 'Espace',
    description: 'L\'univers et ses merveilles',
    symbols: [
      '🌙', '⭐', '🌟', '✨', '☀️', '🌍', '🪐', '🌌',
      '🚀', '👽', '🛸', '☄️', '🌑', '🌕', '🔭', '🛰️',
    ],
    backgroundColor: colors.home.categoryBackgrounds.spatial,
    accentColor: colors.home.categories.spatial,
  },

  emojis: {
    id: 'emojis',
    name: 'Émojis',
    description: 'Plein d\'émojis rigolos',
    symbols: [
      '😀', '😍', '🤩', '😎', '🥳', '🤗', '😇', '🤪',
      '😴', '🤓', '🥰', '😋', '🤭', '😏', '🙃', '🤔',
    ],
    backgroundColor: colors.feedback.warningLight,
    accentColor: colors.feedback.warning,
  },
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Obtient un thème par son ID
 */
export function getTheme(themeId: CardTheme): ThemeConfig {
  return MEMORY_THEMES[themeId];
}

/**
 * Obtient les symboles d'un thème
 */
export function getThemeSymbols(themeId: CardTheme): string[] {
  return MEMORY_THEMES[themeId].symbols;
}

/**
 * Obtient tous les thèmes disponibles
 */
export function getAllThemes(): ThemeConfig[] {
  return Object.values(MEMORY_THEMES);
}

/**
 * Obtient un thème aléatoire
 */
export function getRandomTheme(): ThemeConfig {
  const themes = getAllThemes();
  return themes[Math.floor(Math.random() * themes.length)];
}

