/**
 * Typography system for EduGames
 * Child-friendly fonts with large, readable sizes
 */

export const fontFamily = {
  regular: 'System',      // Will use Nunito when loaded
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
} as const;

// Font sizes - larger than typical for children
export const fontSize = {
  xs: 14,
  sm: 16,
  base: 18,
  lg: 22,
  xl: 28,
  '2xl': 34,
  '3xl': 42,
  '4xl': 52,
} as const;

// Line heights for readability
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// Font weights
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

// Pre-defined text styles
export const textStyles = {
  // Headers
  h1: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['3xl'] * lineHeight.tight,
  },
  h2: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize['2xl'] * lineHeight.tight,
  },
  h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xl * lineHeight.normal,
  },

  // Body text
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.base * lineHeight.relaxed,
  },
  bodyLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.lg * lineHeight.relaxed,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  },

  // UI elements
  button: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.lg * lineHeight.tight,
  },
  buttonSmall: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.base * lineHeight.tight,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
  },

  // Game-specific
  gameTitle: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['4xl'] * lineHeight.tight,
  },
  moveCounter: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['2xl'] * lineHeight.tight,
  },

  // Assistant
  assistantMessage: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.lg * lineHeight.relaxed,
  },
} as const;

export type FontSize = keyof typeof fontSize;
export type TextStyle = keyof typeof textStyles;
