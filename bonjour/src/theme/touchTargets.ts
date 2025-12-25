/**
 * Touch target sizes for EduGames
 * Designed for children's fingers - larger than Apple's 44pt minimum
 */

export const touchTargets = {
  // Minimum touch area (for non-critical UI)
  minimum: 44,

  // Standard touch targets
  small: 48,
  medium: 56,      // Default for most interactive elements
  large: 64,       // Primary actions, game controls

  // Extra large for game elements
  xlarge: 80,
  xxlarge: 100,

  // Game-specific
  disk: {
    minHeight: 36,
    maxHeight: 60,
  },
  tower: {
    width: 24,
    height: 200,
  },
  gameControl: 64,
  homeCard: 140,
} as const;

// Hit slop for extending touch area beyond visual bounds
export const hitSlop = {
  none: { top: 0, bottom: 0, left: 0, right: 0 },
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  medium: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
} as const;

// Spacing for touch targets (prevent accidental taps on adjacent elements)
export const touchSpacing = {
  minimum: 8,     // Minimum space between targets
  recommended: 12,
  comfortable: 16,
} as const;

export type TouchTarget = keyof typeof touchTargets;
export type HitSlop = keyof typeof hitSlop;
