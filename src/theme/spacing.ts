/**
 * Spacing system for EduGames
 * Consistent spacing scale based on 4pt grid
 */

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// Semantic spacing
export const semanticSpacing = {
  // Component internal padding
  componentPaddingXs: spacing[2],
  componentPaddingSm: spacing[3],
  componentPaddingMd: spacing[4],
  componentPaddingLg: spacing[6],

  // Gaps between elements
  gapXs: spacing[1],
  gapSm: spacing[2],
  gapMd: spacing[4],
  gapLg: spacing[6],
  gapXl: spacing[8],

  // Screen margins
  screenMarginSm: spacing[4],
  screenMarginMd: spacing[6],
  screenMarginLg: spacing[8],

  // Card spacing
  cardPadding: spacing[5],
  cardGap: spacing[4],

  // Game board
  gameBoardPadding: spacing[6],
  towerGap: spacing[10],
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Shadows
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
