/**
 * Parent Dashboard Types
 * Types for child profiles, goals, screen time, and analytics
 */

// ============================================
// CHILD PROFILE
// ============================================

export type AgeGroup = '3-5' | '6-7' | '8-10';

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string; // emoji
  ageGroup: AgeGroup; // tranche d'âge
  birthDate?: number; // timestamp (optional, kept for backwards compatibility)
  createdAt: number;
  isActive: boolean;
}

// ============================================
// PARENT GOALS
// ============================================

export type GoalType =
  | 'levels_week'      // Complete X levels this week
  | 'streak'           // Play X days in a row
  | 'new_game'         // Try a new game
  | 'time_total'       // Play X minutes total
  | 'skill_level'      // Reach level X in a skill
  | 'game_mastery'     // Complete X% of a specific game
  | 'perfect_level';   // Complete a level with optimal moves

export type GoalStatus = 'active' | 'completed' | 'expired' | 'paused';

export interface ParentGoal {
  id: string;
  profileId: string;
  title: string;
  description?: string;
  type: GoalType;
  target: number;
  current: number;
  gameId?: string; // For game-specific goals
  skillName?: string; // For skill-specific goals
  deadline?: number; // timestamp
  createdAt: number;
  completedAt?: number;
  status: GoalStatus;
}

export interface GoalTemplate {
  type: GoalType;
  title: string;
  description: string;
  icon: string;
  defaultTarget: number;
  unit: string;
}

// ============================================
// SCREEN TIME
// ============================================

export interface SessionRecord {
  startedAt: number;
  endedAt: number;
  gameId: string;
  levelId?: string;
}

export interface DailyScreenTime {
  date: string; // YYYY-MM-DD format
  totalMinutes: number;
  sessions: SessionRecord[];
  gamesPlayed: string[];
}

export interface ScreenTimeSettings {
  dailyLimitMinutes?: number; // null = no limit
  reminderEnabled: boolean;
  reminderAfterMinutes: number;
}

// ============================================
// BEHAVIOR INSIGHTS
// ============================================

export interface PlayTimeWindow {
  startHour: number; // 0-23
  endHour: number; // 0-23
  label: string; // "Matin", "Après-midi", etc.
}

export interface BehaviorInsights {
  bestPlayWindow: PlayTimeWindow;
  averageSessionMinutes: number;
  currentStreak: number;
  longestStreak: number;
  attemptsPerLevel: number;
  favoriteGame: string | null;
  totalPlayDays: number;
  lastPlayedAt: number | null;
}

// ============================================
// STRENGTHS & WEAKNESSES
// ============================================

export type StrengthLevel = 'excellent' | 'good' | 'developing' | 'focus';

export interface StrengthItem {
  id: string;
  title: string;
  description: string;
  level: StrengthLevel;
  skill?: string;
  gameId?: string;
  icon: string;
}

// ============================================
// AI RECOMMENDATIONS
// ============================================

export interface GameRecommendation {
  gameId: string;
  gameName: string;
  gameIcon: string;
  reason: string;
  score: number; // 0-100 matching score
  skillsTargeted: string[];
  difficulty: 'easier' | 'same' | 'harder';
}

// ============================================
// BADGES & ACHIEVEMENTS
// ============================================

export type BadgeCategory =
  | 'milestone'    // First steps, X levels completed
  | 'streak'       // X days in a row
  | 'mastery'      // Game mastery
  | 'skill'        // Skill development
  | 'special';     // Special achievements

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  unlockedAt?: number;
  isLocked: boolean;
  unlockCondition: string;
  progress?: number; // 0-100 for partial progress display
}

// ============================================
// ACTIVITY TIMELINE
// ============================================

export type ActivityType =
  | 'level_completed'
  | 'level_attempted'
  | 'badge_unlocked'
  | 'game_started'
  | 'streak_milestone'
  | 'goal_completed';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  timestamp: number;
  gameId?: string;
  gameName?: string;
  levelId?: string;
  levelName?: string;
  badgeId?: string;
  badgeName?: string;
  details: {
    moveCount?: number;
    optimalMoves?: number;
    timeSeconds?: number;
    hintsUsed?: number;
    isSuccess?: boolean;
  };
}

// ============================================
// WEEKLY STATS
// ============================================

export interface DailyStats {
  date: string;
  playTimeMinutes: number;
  levelsCompleted: number;
  gamesPlayed: string[];
}

export interface WeeklyStats {
  weekStart: string; // YYYY-MM-DD (Monday)
  days: DailyStats[];
  totalPlayTime: number;
  totalLevelsCompleted: number;
  averageSessionLength: number;
  mostActiveDay: string;
}

// ============================================
// PARENT DASHBOARD TAB
// ============================================

export type ParentTabId =
  | 'overview'
  | 'activities'
  | 'skills'
  | 'goals';

export interface ParentTab {
  id: ParentTabId;
  label: string;
  icon: string;
}
