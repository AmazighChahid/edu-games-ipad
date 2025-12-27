/**
 * Hook pour les polices adaptées à la dyslexie
 *
 * Retourne la famille de polices appropriée selon le paramètre utilisateur
 *
 * Usage:
 * ```typescript
 * const { fontFamily, isDyslexicMode } = useDyslexicFont();
 *
 * const style = {
 *   fontFamily: fontFamily.regular,
 * };
 * ```
 */

import { useMemo } from 'react';
import { useAppStore } from '../store';
import {
  fontFamily as standardFontFamily,
  fontFamilyDyslexic,
  textStyles,
} from '../theme/typography';

// ============================================================================
// TYPES
// ============================================================================

export type FontFamilyType = typeof standardFontFamily;

export interface DyslexicFontHook {
  /** Famille de polices active (standard ou dyslexie) */
  fontFamily: FontFamilyType;
  /** Si le mode dyslexie est activé */
  isDyslexicMode: boolean;
  /** Obtient le style de texte adapté */
  getTextStyle: (styleName: keyof typeof textStyles) => typeof textStyles[keyof typeof textStyles];
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook pour accéder aux polices adaptées à la dyslexie
 */
export function useDyslexicFont(): DyslexicFontHook {
  const isDyslexicMode = useAppStore((state) => state.dyslexicFontEnabled);

  const fontFamily = useMemo<FontFamilyType>(() => {
    return isDyslexicMode ? fontFamilyDyslexic : standardFontFamily;
  }, [isDyslexicMode]);

  const getTextStyle = useMemo(() => {
    return (styleName: keyof typeof textStyles) => {
      const baseStyle = textStyles[styleName];

      if (!isDyslexicMode) {
        return baseStyle;
      }

      // Remplacer la fontFamily dans le style
      const fontFamilyKey = getFontFamilyKey(baseStyle.fontFamily);
      if (fontFamilyKey) {
        return {
          ...baseStyle,
          fontFamily: fontFamilyDyslexic[fontFamilyKey],
        };
      }

      return baseStyle;
    };
  }, [isDyslexicMode]);

  return {
    fontFamily,
    isDyslexicMode,
    getTextStyle,
  };
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Trouve la clé correspondante dans fontFamily
 */
function getFontFamilyKey(fontFamilyValue: string): keyof FontFamilyType | null {
  const entries = Object.entries(standardFontFamily) as [keyof FontFamilyType, string][];

  for (const [key, value] of entries) {
    if (value === fontFamilyValue) {
      return key;
    }
  }

  return null;
}

/**
 * Hook simplifié pour juste obtenir la fontFamily
 */
export function useFontFamily(): FontFamilyType {
  const isDyslexicMode = useAppStore((state) => state.dyslexicFontEnabled);
  return isDyslexicMode ? fontFamilyDyslexic : standardFontFamily;
}

/**
 * Crée un style de texte adapté à la dyslexie
 */
export function createDyslexicTextStyle(
  baseStyle: Record<string, unknown>,
  isDyslexicMode: boolean
): Record<string, unknown> {
  if (!isDyslexicMode) {
    return baseStyle;
  }

  const fontFamilyValue = baseStyle.fontFamily as string | undefined;
  if (!fontFamilyValue) {
    return baseStyle;
  }

  const fontFamilyKey = getFontFamilyKey(fontFamilyValue);
  if (fontFamilyKey) {
    return {
      ...baseStyle,
      fontFamily: fontFamilyDyslexic[fontFamilyKey],
    };
  }

  return baseStyle;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { useDyslexicFont, useFontFamily, createDyslexicTextStyle };
