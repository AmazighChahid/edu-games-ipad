/**
 * Daltonism Modes - Palettes de couleurs accessibles
 *
 * Fournit des palettes alternatives pour les différents types de daltonisme :
 * - Deutéranopie (rouge-vert, le plus courant ~6% hommes)
 * - Protanopie (rouge-vert, ~1% hommes)
 * - Tritanopie (bleu-jaune, rare ~0.01%)
 *
 * Principe : Toujours combiner COULEUR + FORME/ICÔNE pour l'information
 */

import { colors } from './colors';

// ============================================================================
// TYPES
// ============================================================================

export type DaltonismMode = 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia';

export interface DaltonismPalette {
  /** Couleurs de disques pour Hanoi */
  diskColors: string[];
  /** Couleurs de feedback */
  feedback: {
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    error: string;
    errorLight: string;
  };
  /** Couleurs Sudoku */
  sudoku: {
    cellConflict: string;
    symbolConflict: string;
    symbolSuccess: string;
  };
  /** Couleurs catégories de jeux */
  categories: {
    logic: string;
    spatial: string;
    numbers: string;
    memory: string;
    language: string;
  };
  /** Couleurs de streak */
  streak: {
    active: string;
    completed: string;
  };
}

// ============================================================================
// PALETTES ACCESSIBLES
// ============================================================================

/**
 * Palette normale (par défaut)
 */
const normalPalette: DaltonismPalette = {
  diskColors: [
    colors.game.disk1, // Rouge
    colors.game.disk2, // Orange
    colors.game.disk3, // Jaune
    colors.game.disk4, // Vert
    colors.game.disk5, // Cyan
    colors.game.disk6, // Violet
    colors.game.disk7, // Bleu
  ],
  feedback: {
    success: colors.feedback.success,
    successLight: colors.feedback.successLight,
    warning: colors.feedback.warning,
    warningLight: colors.feedback.warningLight,
    error: colors.feedback.error,
    errorLight: colors.feedback.errorLight,
  },
  sudoku: {
    cellConflict: colors.sudoku.cellConflict,
    symbolConflict: colors.sudoku.symbolConflict,
    symbolSuccess: colors.sudoku.symbolSuccess,
  },
  categories: {
    logic: colors.home.categories.logic,
    spatial: colors.home.categories.spatial,
    numbers: colors.home.categories.numbers,
    memory: colors.home.categories.memory,
    language: colors.home.categories.language,
  },
  streak: {
    active: colors.home.streak.orange,
    completed: '#FFFFFF',
  },
};

/**
 * Palette Deutéranopie (difficulté rouge-vert)
 * Utilise des contrastes bleu-jaune-orange
 */
const deuteranopiaPalette: DaltonismPalette = {
  diskColors: [
    '#0077BB', // Bleu foncé
    '#33BBEE', // Bleu clair
    '#EE7733', // Orange
    '#FFCC00', // Jaune
    '#CC3311', // Rouge brique (distinguable)
    '#AA3377', // Magenta
    '#009988', // Teal
  ],
  feedback: {
    success: '#0077BB', // Bleu au lieu de vert
    successLight: '#CCE5FF',
    warning: '#FFCC00', // Jaune vif
    warningLight: '#FFF5CC',
    error: '#CC3311', // Rouge brique
    errorLight: '#FFE5DD',
  },
  sudoku: {
    cellConflict: '#FFE5DD',
    symbolConflict: '#CC3311',
    symbolSuccess: '#0077BB',
  },
  categories: {
    logic: '#0077BB',
    spatial: '#AA3377',
    numbers: '#EE7733',
    memory: '#FFCC00',
    language: '#33BBEE',
  },
  streak: {
    active: '#EE7733',
    completed: '#FFFFFF',
  },
};

/**
 * Palette Protanopie (difficulté rouge-vert, variant)
 * Similaire à deutéranopie avec ajustements
 */
const protanopiaPalette: DaltonismPalette = {
  diskColors: [
    '#004488', // Bleu marine
    '#6699CC', // Bleu moyen
    '#EECC66', // Jaune doré
    '#FFAA00', // Orange
    '#994455', // Bordeaux
    '#882255', // Prune
    '#117733', // Vert forêt (distinguable)
  ],
  feedback: {
    success: '#004488', // Bleu marine
    successLight: '#CCE0FF',
    warning: '#FFAA00', // Orange
    warningLight: '#FFEEDD',
    error: '#994455', // Bordeaux
    errorLight: '#FFDDEE',
  },
  sudoku: {
    cellConflict: '#FFDDEE',
    symbolConflict: '#994455',
    symbolSuccess: '#004488',
  },
  categories: {
    logic: '#004488',
    spatial: '#882255',
    numbers: '#EECC66',
    memory: '#FFAA00',
    language: '#6699CC',
  },
  streak: {
    active: '#FFAA00',
    completed: '#FFFFFF',
  },
};

/**
 * Palette Tritanopie (difficulté bleu-jaune)
 * Utilise des contrastes rouge-vert-magenta
 */
const tritanopiaPalette: DaltonismPalette = {
  diskColors: [
    '#EE3377', // Magenta
    '#CC3311', // Rouge
    '#009988', // Teal
    '#33AA33', // Vert
    '#EE6677', // Rose
    '#661100', // Marron
    '#117733', // Vert foncé
  ],
  feedback: {
    success: '#009988', // Teal
    successLight: '#CCFFEE',
    warning: '#EE3377', // Magenta
    warningLight: '#FFE5F0',
    error: '#CC3311', // Rouge
    errorLight: '#FFE5DD',
  },
  sudoku: {
    cellConflict: '#FFE5DD',
    symbolConflict: '#CC3311',
    symbolSuccess: '#009988',
  },
  categories: {
    logic: '#009988',
    spatial: '#EE3377',
    numbers: '#33AA33',
    memory: '#CC3311',
    language: '#661100',
  },
  streak: {
    active: '#EE3377',
    completed: '#FFFFFF',
  },
};

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Map des palettes par mode
 */
export const daltonismPalettes: Record<DaltonismMode, DaltonismPalette> = {
  normal: normalPalette,
  deuteranopia: deuteranopiaPalette,
  protanopia: protanopiaPalette,
  tritanopia: tritanopiaPalette,
};

/**
 * Labels pour l'interface utilisateur
 */
export const daltonismModeLabels: Record<DaltonismMode, { fr: string; en: string }> = {
  normal: {
    fr: 'Vision normale',
    en: 'Normal vision',
  },
  deuteranopia: {
    fr: 'Deutéranopie (rouge-vert)',
    en: 'Deuteranopia (red-green)',
  },
  protanopia: {
    fr: 'Protanopie (rouge-vert)',
    en: 'Protanopia (red-green)',
  },
  tritanopia: {
    fr: 'Tritanopie (bleu-jaune)',
    en: 'Tritanopia (blue-yellow)',
  },
};

/**
 * Descriptions pour l'interface utilisateur
 */
export const daltonismModeDescriptions: Record<DaltonismMode, { fr: string; en: string }> = {
  normal: {
    fr: 'Palette de couleurs standard',
    en: 'Standard color palette',
  },
  deuteranopia: {
    fr: 'Optimisé pour la confusion rouge-vert (le plus courant)',
    en: 'Optimized for red-green confusion (most common)',
  },
  protanopia: {
    fr: 'Optimisé pour la confusion rouge-vert (variante)',
    en: 'Optimized for red-green confusion (variant)',
  },
  tritanopia: {
    fr: 'Optimisé pour la confusion bleu-jaune (rare)',
    en: 'Optimized for blue-yellow confusion (rare)',
  },
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Obtient la palette pour un mode donné
 */
export function getPalette(mode: DaltonismMode): DaltonismPalette {
  return daltonismPalettes[mode];
}

/**
 * Obtient une couleur de disque pour Hanoi
 */
export function getDiskColor(mode: DaltonismMode, diskIndex: number): string {
  const palette = daltonismPalettes[mode];
  const safeIndex = Math.min(diskIndex, palette.diskColors.length - 1);
  return palette.diskColors[safeIndex];
}

/**
 * Obtient les couleurs de feedback
 */
export function getFeedbackColors(mode: DaltonismMode): DaltonismPalette['feedback'] {
  return daltonismPalettes[mode].feedback;
}

/**
 * Obtient les couleurs Sudoku
 */
export function getSudokuColors(mode: DaltonismMode): DaltonismPalette['sudoku'] {
  return daltonismPalettes[mode].sudoku;
}

/**
 * Obtient une couleur de catégorie
 */
export function getCategoryColor(
  mode: DaltonismMode,
  category: keyof DaltonismPalette['categories']
): string {
  return daltonismPalettes[mode].categories[category];
}

/**
 * Vérifie si le mode est un mode daltonien
 */
export function isDaltonismMode(mode: DaltonismMode): boolean {
  return mode !== 'normal';
}

/**
 * Liste des modes disponibles
 */
export const availableDaltonismModes: DaltonismMode[] = [
  'normal',
  'deuteranopia',
  'protanopia',
  'tritanopia',
];

// ============================================================================
// EXPORTS
// ============================================================================

export {
  normalPalette,
  deuteranopiaPalette,
  protanopiaPalette,
  tritanopiaPalette,
  getPalette,
  getDiskColor,
  getFeedbackColors,
  getSudokuColors,
  getCategoryColor,
  isDaltonismMode,
};
