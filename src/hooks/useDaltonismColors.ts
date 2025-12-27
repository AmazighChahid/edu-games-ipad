/**
 * Hook pour les couleurs accessibles (daltonisme)
 *
 * Fournit des couleurs adaptées selon le mode daltonien configuré
 * Lit le paramètre depuis le store Zustand
 *
 * Usage:
 * ```typescript
 * const { getDiskColor, feedbackColors, categoryColors } = useDaltonismColors();
 *
 * // Pour un disque Hanoi
 * const color = getDiskColor(diskIndex);
 *
 * // Pour un feedback
 * const successColor = feedbackColors.success;
 * ```
 */

import { useMemo, useCallback } from 'react';
import { useAppStore } from '../store';
import {
  type DaltonismMode,
  type DaltonismPalette,
  daltonismPalettes,
  getPalette,
  getDiskColor as getRawDiskColor,
  getFeedbackColors,
  getSudokuColors,
  getCategoryColor as getRawCategoryColor,
} from '../theme/daltonismModes';

// ============================================================================
// TYPES
// ============================================================================

export interface DaltonismColorsHook {
  /** Mode daltonien actuel */
  mode: DaltonismMode;
  /** Palette complète */
  palette: DaltonismPalette;
  /** Si le mode daltonien est activé */
  isDaltonismActive: boolean;
  /** Obtient la couleur d'un disque */
  getDiskColor: (diskIndex: number) => string;
  /** Couleurs de feedback */
  feedbackColors: DaltonismPalette['feedback'];
  /** Couleurs Sudoku */
  sudokuColors: DaltonismPalette['sudoku'];
  /** Couleurs des catégories */
  categoryColors: DaltonismPalette['categories'];
  /** Obtient une couleur de catégorie spécifique */
  getCategoryColor: (category: keyof DaltonismPalette['categories']) => string;
  /** Couleurs de streak */
  streakColors: DaltonismPalette['streak'];
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook pour accéder aux couleurs adaptées au daltonisme
 */
export function useDaltonismColors(): DaltonismColorsHook {
  // Récupérer le mode depuis le store (avec fallback à 'normal')
  const mode = useAppStore((state) => state.daltonismMode ?? 'normal');

  // Mémoriser la palette pour éviter les recalculs
  const palette = useMemo(() => getPalette(mode), [mode]);

  // Mémoriser les couleurs de feedback
  const feedbackColors = useMemo(() => getFeedbackColors(mode), [mode]);

  // Mémoriser les couleurs Sudoku
  const sudokuColors = useMemo(() => getSudokuColors(mode), [mode]);

  // Callback pour obtenir une couleur de disque
  const getDiskColor = useCallback(
    (diskIndex: number): string => {
      return getRawDiskColor(mode, diskIndex);
    },
    [mode]
  );

  // Callback pour obtenir une couleur de catégorie
  const getCategoryColor = useCallback(
    (category: keyof DaltonismPalette['categories']): string => {
      return getRawCategoryColor(mode, category);
    },
    [mode]
  );

  return {
    mode,
    palette,
    isDaltonismActive: mode !== 'normal',
    getDiskColor,
    feedbackColors,
    sudokuColors,
    categoryColors: palette.categories,
    getCategoryColor,
    streakColors: palette.streak,
  };
}

// ============================================================================
// HOOKS SPÉCIALISÉS
// ============================================================================

/**
 * Hook pour les couleurs de feedback uniquement
 */
export function useFeedbackColors(): DaltonismPalette['feedback'] {
  const mode = useAppStore((state) => state.daltonismMode ?? 'normal');
  return useMemo(() => getFeedbackColors(mode), [mode]);
}

/**
 * Hook pour les couleurs Sudoku uniquement
 */
export function useSudokuColors(): DaltonismPalette['sudoku'] {
  const mode = useAppStore((state) => state.daltonismMode ?? 'normal');
  return useMemo(() => getSudokuColors(mode), [mode]);
}

/**
 * Hook pour les couleurs de disques Hanoi
 */
export function useHanoiDiskColors(): (diskIndex: number) => string {
  const mode = useAppStore((state) => state.daltonismMode ?? 'normal');

  return useCallback(
    (diskIndex: number): string => {
      return getRawDiskColor(mode, diskIndex);
    },
    [mode]
  );
}

/**
 * Hook pour les couleurs de catégories de jeux
 */
export function useCategoryColors(): DaltonismPalette['categories'] {
  const mode = useAppStore((state) => state.daltonismMode ?? 'normal');
  return useMemo(() => daltonismPalettes[mode].categories, [mode]);
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  useDaltonismColors,
  useFeedbackColors,
  useSudokuColors,
  useHanoiDiskColors,
  useCategoryColors,
};
