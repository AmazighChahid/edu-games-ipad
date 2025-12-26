/**
 * Memory Game Themes
 *
 * Thèmes visuels pour le jeu Memory
 * Chaque thème a ses propres symboles et couleurs
 */

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
    backgroundColor: '#E8F5E9',
    accentColor: '#4CAF50',
  },

  fruits: {
    id: 'fruits',
    name: 'Fruits',
    description: 'Des fruits délicieux à associer',
    symbols: [
      '🍎', '🍐', '🍊', '🍋', '🍌', '🍇', '🍓', '🍒',
      '🍑', '🥝', '🍍', '🥭', '🍈', '🍉', '🫐', '🥥',
    ],
    backgroundColor: '#FFF3E0',
    accentColor: '#FF9800',
  },

  vehicles: {
    id: 'vehicles',
    name: 'Véhicules',
    description: 'Des moyens de transport variés',
    symbols: [
      '🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒',
      '✈️', '🚀', '🚁', '⛵', '🚂', '🚲', '🛴', '🛵',
    ],
    backgroundColor: '#E3F2FD',
    accentColor: '#2196F3',
  },

  nature: {
    id: 'nature',
    name: 'Nature',
    description: 'La beauté de la nature',
    symbols: [
      '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌵', '🌴',
      '🍀', '🍁', '🍂', '🌲', '🌳', '🌾', '🌿', '☘️',
    ],
    backgroundColor: '#F1F8E9',
    accentColor: '#8BC34A',
  },

  space: {
    id: 'space',
    name: 'Espace',
    description: 'L\'univers et ses merveilles',
    symbols: [
      '🌙', '⭐', '🌟', '✨', '☀️', '🌍', '🪐', '🌌',
      '🚀', '👽', '🛸', '☄️', '🌑', '🌕', '🔭', '🛰️',
    ],
    backgroundColor: '#1A237E',
    accentColor: '#7C4DFF',
  },

  emojis: {
    id: 'emojis',
    name: 'Émojis',
    description: 'Plein d\'émojis rigolos',
    symbols: [
      '😀', '😍', '🤩', '😎', '🥳', '🤗', '😇', '🤪',
      '😴', '🤓', '🥰', '😋', '🤭', '😏', '🙃', '🤔',
    ],
    backgroundColor: '#FFF8E1',
    accentColor: '#FFC107',
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

