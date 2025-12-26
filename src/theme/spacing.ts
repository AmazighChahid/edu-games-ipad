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

// Home screen specific layout (from home-redesign.html)
export const homeLayout = {
  // Header & content spacing
  headerPadding: 28,
  contentPadding: 40,

  // Sidebar dimensions
  sidebarWidth: 320,
  sidebarGap: 20,

  // Game grid
  gameCardGap: 20,

  // Component sizes
  avatarSize: 90,
  avatarBorder: 4,
  avatarBadgePadding: 4,

  gameIconSize: 80,
  gameIconBorderRadius: 20,

  owlSmallWidth: 60,
  owlSmallHeight: 70,
  owlEyeSize: 18,
  owlBeakSize: 8,

  plantFlowerSize: 28,
  plantStemWidth: 4,

  // Navigation
  navHeight: 70,
  navBottom: 30,
  navButtonPadding: 10,

  // Stat badges
  statBadgePadding: 8,
  statBadgePaddingHorizontal: 14,

  // Progress bar
  progressBarHeight: 8,
  progressBarRadius: 4,

  // Streak days
  streakDaySize: 36,
  streakDayGap: 8,

  // Garden
  gardenHeight: 140,
  gardenGroundHeight: 40,

  // Mascot bubble
  bubblePadding: 14,
  bubblePaddingHorizontal: 18,
  bubbleTailSize: 10,
} as const;

// Touch target sizes (child-friendly, accessibility compliant)
export const touchTargets = {
  minimum: 64,     // Minimum interactive element size (WCAG)
  large: 80,       // Large touch target
  huge: 90,        // Extra large (e.g., avatar)
  spacing: 16,     // Minimum spacing between touch targets
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  round: 9999,     // Fully rounded (was 'full')
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
