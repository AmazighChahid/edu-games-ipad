/**
 * Theme system export
 * Central export for all theme-related values
 */

export { colors } from './colors';
export type { Colors } from './colors';

export {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  textStyles
} from './typography';
export type { FontSize, TextStyle } from './typography';

export {
  spacing,
  semanticSpacing,
  borderRadius,
  shadows
} from './spacing';
export type { Spacing, BorderRadius, Shadow } from './spacing';

export {
  touchTargets,
  hitSlop,
  touchSpacing
} from './touchTargets';
export type { TouchTarget, HitSlop } from './touchTargets';

// Combined theme object for convenience
import { colors } from './colors';
import { fontFamily, fontSize, lineHeight, fontWeight, textStyles } from './typography';
import { spacing, semanticSpacing, borderRadius, shadows } from './spacing';
import { touchTargets, hitSlop, touchSpacing } from './touchTargets';

export const theme = {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  textStyles,
  spacing,
  semanticSpacing,
  borderRadius,
  shadows,
  touchTargets,
  hitSlop,
  touchSpacing,
} as const;

export type Theme = typeof theme;
