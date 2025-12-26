/**
 * Types for Home Screen V9 - "Forêt Magique"
 */

// ============ USER PROFILE ============

export interface UserProfileV9 {
  name: string;
  avatarEmoji: string;
  level: number;
  gems: number;
  totalMedals: number;
}

// ============ WIDGETS ============

export type FlowerType = '🌸' | '🌻' | '🌷' | '🌺' | '🌼' | '🹹' | '🌿';

export interface PiouAdvice {
  message: string;
  highlightedPart: string;
  actionLabel: string;
  targetGameId?: string;
}

export interface GardenStats {
  flowers: FlowerType[];
  totalGames: number;
  totalTime: string;
}

export interface WeekDay {
  day: 'L' | 'M' | 'M' | 'J' | 'V' | 'S' | 'D';
  label: string;
  completed: boolean;
  isToday: boolean;
}

export interface StreakData {
  currentStreak: number;
  weekDays: WeekDay[];
}

export interface CollectionDataV9 {
  unlockedCards: string[];
  totalCards: number;
  newCardIds: string[];
}

// ============ GAMES ============

export type MedalType = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';
export type BadgeType = 'new' | 'hot' | 'soon';
export type GameColor = 'blue' | 'purple' | 'green' | 'orange' | 'teal' | 'pink' | 'indigo' | 'red' | 'amber' | 'cyan';

export interface GameV9 {
  id: string;
  name: string;
  icon: string;
  color: GameColor;
  medal: MedalType;
  badge?: BadgeType;
  isLocked: boolean;
}

export interface GameCategoryV9 {
  id: string;
  icon: string;
  title: string;
  games: GameV9[];
}

// ============ MEDAL CONFIG ============

export interface MedalConfig {
  colors: readonly [string, string];
  label: string;
  icon: string;
  textColor: string;
}

export const MEDAL_CONFIGS: Record<MedalType, MedalConfig> = {
  none: {
    colors: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'],
    label: '',
    icon: '',
    textColor: 'rgba(255,255,255,0.8)',
  },
  bronze: {
    colors: ['#CD7F32', '#8B5A2B'],
    label: 'Bronze',
    icon: '🥉',
    textColor: '#FFFFFF',
  },
  silver: {
    colors: ['#C0C0C0', '#909090'],
    label: 'Argent',
    icon: '🥈',
    textColor: '#FFFFFF',
  },
  gold: {
    colors: ['#FFD700', '#FFA500'],
    label: 'Or',
    icon: '🥇',
    textColor: '#FFFFFF',
  },
  diamond: {
    colors: ['#B9F2FF', '#00CED1'],
    label: 'Diamant',
    icon: '💎',
    textColor: '#006666',
  },
};

// ============ GAME COLOR CONFIG ============

export interface GameColorConfig {
  colors: readonly [string, string];
}

export const GAME_COLOR_CONFIGS: Record<GameColor, GameColorConfig> = {
  blue: { colors: ['#5B8DEE', '#3B6FCE'] },
  purple: { colors: ['#9B59B6', '#8E44AD'] },
  green: { colors: ['#27AE60', '#1E8449'] },
  orange: { colors: ['#F39C12', '#D68910'] },
  teal: { colors: ['#00B894', '#00876A'] },
  pink: { colors: ['#FD79A8', '#E84393'] },
  indigo: { colors: ['#6C5CE7', '#5541D7'] },
  red: { colors: ['#E74C3C', '#C0392B'] },
};

// ============ WIDGET COLORS ============

export const WIDGET_COLORS = {
  piou: {
    gradient: ['rgba(91,141,238,0.95)', 'rgba(59,111,206,0.95)'] as const,
    bgIcon: '🦉',
  },
  garden: {
    gradient: ['rgba(39,174,96,0.95)', 'rgba(30,132,73,0.95)'] as const,
    bgIcon: '🌻',
  },
  streak: {
    gradient: ['rgba(243,156,18,0.95)', 'rgba(214,137,16,0.95)'] as const,
    bgIcon: '🔥',
  },
  collection: {
    gradient: ['rgba(155,89,182,0.95)', 'rgba(142,68,173,0.95)'] as const,
    bgIcon: '🏆',
  },
} as const;

// ============ BACKGROUND COLORS ============

export const FOREST_COLORS = {
  sky: {
    gradient: ['#87CEEB', '#B0E0E6', '#98D9A8', '#7BC74D'] as const,
    locations: [0, 0.25, 0.6, 1] as const,
  },
  sun: {
    core: '#FFD93D',
    outer: '#F5C800',
    glow: 'rgba(255,217,61,0.3)',
  },
  mountains: {
    light: '#6B8E7B',
    medium: '#5A7D6A',
    dark: '#4A6D5A',
    snow: 'rgba(255,255,255,0.7)',
  },
  hills: {
    light: '#6BC77B',
    medium: '#5BAE6B',
    dark: '#4A9D5A',
  },
  trees: {
    trunk: ['#8B5A2B', '#6B4423'] as const,
    crown: ['#3D8B4F', '#2D6B3F'] as const,
  },
  cloud: '#FFFFFF',
} as const;

// ============ ANIMATION DURATIONS ============

export const ANIMATION_DURATIONS = {
  // Background elements
  sunPulse: 4000,
  sunGlow: 3000,
  cloudMove: [25000, 30000, 35000] as const,
  flowerSway: 3000,

  // Animals
  butterfly: [15000, 18000, 20000] as const,
  bird: [10000, 12000, 14000] as const,
  squirrel: 20000,
  rabbit: 15000,
  bee: 18000,
  ladybug: 25000,
  dragonfly: 12000,

  // UI interactions
  buttonPress: 200,
  cardHover: 300,
  widgetHover: 300,
} as const;
