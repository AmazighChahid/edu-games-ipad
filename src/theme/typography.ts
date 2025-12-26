/**
 * Typography system for EduGames
 * Child-friendly fonts with large, readable sizes
 */

export const fontFamily = {
  regular: 'Nunito_400Regular',      // Main font for body text
  medium: 'Nunito_600SemiBold',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  display: 'Fredoka_600SemiBold',    // For titles, buttons, and playful elements
  displayBold: 'Fredoka_700Bold',
} as const;

// Font sizes - larger than typical for children (based on home-redesign.html)
export const fontSize = {
  xxs: 11,       // Small badges (11px HTML)
  xs: 12,        // Captions (12px HTML)
  sm: 14,        // Small labels (14px HTML)
  base: 16,      // Body text (16px HTML)
  lg: 18,        // Large text (18px HTML)
  xl: 24,        // Section titles (24px HTML)
  '2xl': 32,     // Large headers (32px HTML - greeting)
  '3xl': 40,     // Extra large titles
  '4xl': 50,     // Game titles
  huge: 28,      // Icons and emojis (28px HTML)
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
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['3xl'] * lineHeight.tight,
  },
  h2: {
    fontFamily: fontFamily.display,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize['2xl'] * lineHeight.tight,
  },
  h3: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xl * lineHeight.normal,
  },

  // Body text
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.base * lineHeight.relaxed,
  },
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.lg * lineHeight.relaxed,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  },

  // UI elements
  button: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.lg * lineHeight.tight,
  },
  buttonSmall: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.base * lineHeight.tight,
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xs * lineHeight.normal,
  },

  // Game-specific
  gameTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['4xl'] * lineHeight.tight,
  },
  moveCounter: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['2xl'] * lineHeight.tight,
  },

  // Assistant
  assistantMessage: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.lg * lineHeight.relaxed,
  },

  // Home screen specific (from home-redesign.html)
  homeTitle: {
    fontFamily: fontFamily.display,  // Fredoka
    fontSize: fontSize['2xl'],       // 32px
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['2xl'] * lineHeight.tight,
  },
  sectionTitle: {
    fontFamily: fontFamily.display,  // Fredoka
    fontSize: fontSize.xl,           // 28px (was 24 in HTML)
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xl * lineHeight.tight,
  },
  gameName: {
    fontFamily: fontFamily.display,  // Fredoka
    fontSize: fontSize.sm,           // 16px
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  badge: {
    fontSize: fontSize.xxs,          // 11px
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxs * lineHeight.tight,
  },
  statValue: {
    fontFamily: fontFamily.display,  // Fredoka
    fontSize: fontSize.xl,           // 24px
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xl * lineHeight.tight,
  },
  statLabel: {
    fontSize: fontSize.xs,           // 12-14px
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
  },
} as const;

export type FontSize = keyof typeof fontSize;
export type TextStyle = keyof typeof textStyles;
