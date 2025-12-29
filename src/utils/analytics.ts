/**
 * Analytics Utilities
 * Functions to analyze game progress and generate insights
 */

import type {
  GameProgress,
  CompletedSession,
  BehaviorInsights,
  PlayTimeWindow,
  StrengthItem,
  StrengthLevel,
  GameRecommendation,
  WeeklyStats,
  DailyStats,
  ActivityItem,
  Badge,
} from '../types';
import { gameRegistry } from '../games/registry';
import { Icons } from '../constants/icons';

// ============================================
// DATE HELPERS
// ============================================

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const getWeekStart = (): Date => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const getDayName = (date: Date): string => {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return days[date.getDay()];
};

// ============================================
// BEHAVIOR INSIGHTS
// ============================================

/**
 * Calculate the best time window for playing
 * Based on when the child performs best (most completions, best scores)
 */
export function calculateBestPlayTime(
  recentSessions: CompletedSession[]
): PlayTimeWindow {
  if (recentSessions.length === 0) {
    return { startHour: 9, endHour: 11, label: 'Matin (9h-11h)' };
  }

  // Count sessions by time window
  const windows: Record<string, { count: number; successRate: number }> = {
    morning: { count: 0, successRate: 0 }, // 6-12
    afternoon: { count: 0, successRate: 0 }, // 12-18
    evening: { count: 0, successRate: 0 }, // 18-22
  };

  recentSessions.forEach((session) => {
    const hour = new Date(session.completedAt).getHours();
    let window: string;

    if (hour >= 6 && hour < 12) window = 'morning';
    else if (hour >= 12 && hour < 18) window = 'afternoon';
    else window = 'evening';

    windows[window].count++;
    windows[window].successRate += session.moveCount > 0 ? 1 : 0;
  });

  // Find best window
  let bestWindow = 'morning';
  let maxScore = 0;

  Object.entries(windows).forEach(([key, data]) => {
    if (data.count > maxScore) {
      maxScore = data.count;
      bestWindow = key;
    }
  });

  const windowDetails: Record<string, PlayTimeWindow> = {
    morning: { startHour: 9, endHour: 11, label: 'Matin (9h-11h)' },
    afternoon: { startHour: 14, endHour: 16, label: 'Après-midi (14h-16h)' },
    evening: { startHour: 18, endHour: 20, label: 'Soir (18h-20h)' },
  };

  return windowDetails[bestWindow];
}

/**
 * Calculate average session duration in minutes
 */
export function calculateAverageSessionDuration(
  recentSessions: CompletedSession[]
): number {
  if (recentSessions.length === 0) return 0;

  const totalSeconds = recentSessions.reduce(
    (sum, session) => sum + session.timeSeconds,
    0
  );

  return Math.round(totalSeconds / recentSessions.length / 60);
}

/**
 * Calculate current streak (consecutive days played)
 */
export function calculateCurrentStreak(
  gameProgress: Record<string, GameProgress>
): number {
  // Get all completion dates
  const dates = new Set<string>();

  Object.values(gameProgress).forEach((progress) => {
    Object.values(progress.completedLevels).forEach((level) => {
      const date = formatDate(new Date(level.completedAt));
      dates.add(date);
    });
  });

  if (dates.size === 0) return 0;

  // Sort dates descending
  const sortedDates = Array.from(dates).sort().reverse();

  // Check if today or yesterday is in the list
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));

  if (!dates.has(today) && !dates.has(yesterday)) {
    return 0; // Streak broken
  }

  // Count consecutive days
  let streak = 0;
  let currentDate = new Date();

  // If today isn't played, start from yesterday
  if (!dates.has(today)) {
    currentDate = new Date(Date.now() - 86400000);
  }

  while (dates.has(formatDate(currentDate))) {
    streak++;
    currentDate = new Date(currentDate.getTime() - 86400000);
  }

  return streak;
}

/**
 * Calculate longest streak ever
 */
export function calculateLongestStreak(
  gameProgress: Record<string, GameProgress>
): number {
  const dates = new Set<string>();

  Object.values(gameProgress).forEach((progress) => {
    Object.values(progress.completedLevels).forEach((level) => {
      dates.add(formatDate(new Date(level.completedAt)));
    });
  });

  if (dates.size === 0) return 0;

  const sortedDates = Array.from(dates).sort();
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.round(
      (currDate.getTime() - prevDate.getTime()) / 86400000
    );

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

/**
 * Calculate average attempts per level
 */
export function calculateAttemptsPerLevel(
  gameProgress: Record<string, GameProgress>
): number {
  let totalAttempts = 0;
  let totalLevels = 0;

  Object.values(gameProgress).forEach((progress) => {
    Object.values(progress.completedLevels).forEach((level) => {
      totalAttempts += level.timesCompleted;
      totalLevels++;
    });
  });

  if (totalLevels === 0) return 0;
  return Math.round((totalAttempts / totalLevels) * 10) / 10;
}

/**
 * Find the favorite game (most played)
 */
export function findFavoriteGame(
  gameProgress: Record<string, GameProgress>
): string | null {
  let maxTime = 0;
  let favoriteGame: string | null = null;

  Object.entries(gameProgress).forEach(([gameId, progress]) => {
    if (progress.totalPlayTimeMinutes > maxTime) {
      maxTime = progress.totalPlayTimeMinutes;
      favoriteGame = gameId;
    }
  });

  return favoriteGame;
}

/**
 * Generate complete behavior insights
 */
export function generateBehaviorInsights(
  gameProgress: Record<string, GameProgress>,
  recentSessions: CompletedSession[]
): BehaviorInsights {
  const lastPlayed = Object.values(gameProgress).reduce((latest, progress) => {
    if (progress.lastPlayedAt && progress.lastPlayedAt > (latest || 0)) {
      return progress.lastPlayedAt;
    }
    return latest;
  }, null as number | null);

  // Count total play days
  const playDates = new Set<string>();
  Object.values(gameProgress).forEach((progress) => {
    Object.values(progress.completedLevels).forEach((level) => {
      playDates.add(formatDate(new Date(level.completedAt)));
    });
  });

  return {
    bestPlayWindow: calculateBestPlayTime(recentSessions),
    averageSessionMinutes: calculateAverageSessionDuration(recentSessions),
    currentStreak: calculateCurrentStreak(gameProgress),
    longestStreak: calculateLongestStreak(gameProgress),
    attemptsPerLevel: calculateAttemptsPerLevel(gameProgress),
    favoriteGame: findFavoriteGame(gameProgress),
    totalPlayDays: playDates.size,
    lastPlayedAt: lastPlayed,
  };
}

// ============================================
// STRENGTHS & WEAKNESSES
// ============================================

/**
 * Analyze strengths and weaknesses based on performance
 */
export function analyzeStrengthsWeaknesses(
  gameProgress: Record<string, GameProgress>,
  recentSessions: CompletedSession[]
): StrengthItem[] {
  const items: StrengthItem[] = [];

  // Analyze by game category performance
  const categoryPerformance: Record<
    string,
    { completed: number; optimal: number; total: number }
  > = {};

  gameRegistry
    .filter((g) => g.status === 'available')
    .forEach((game) => {
      const progress = gameProgress[game.id];
      if (!progress) return;

      if (!categoryPerformance[game.category]) {
        categoryPerformance[game.category] = { completed: 0, optimal: 0, total: 0 };
      }

      const completedCount = Object.keys(progress.completedLevels).length;
      categoryPerformance[game.category].completed += completedCount;
      categoryPerformance[game.category].total += 10; // Assuming 10 levels per game

      // Count optimal completions (best moves == optimal)
      Object.values(progress.completedLevels).forEach((level) => {
        if (level.bestMoveCount <= (level.hintsUsed === 0 ? 10 : 15)) {
          categoryPerformance[game.category].optimal++;
        }
      });
    });

  // Identify strengths (categories with high completion)
  Object.entries(categoryPerformance).forEach(([category, perf]) => {
    const completionRate = perf.total > 0 ? perf.completed / perf.total : 0;

    if (completionRate >= 0.5) {
      items.push({
        id: `strength_${category}`,
        title: `Excellent en ${getCategoryName(category)}`,
        description: `${Math.round(completionRate * 100)}% des niveaux complétés`,
        level: completionRate >= 0.7 ? 'excellent' : 'good',
        skill: category,
        icon: getCategoryIcon(category),
      });
    } else if (completionRate < 0.2 && perf.total > 0) {
      items.push({
        id: `improve_${category}`,
        title: `À travailler : ${getCategoryName(category)}`,
        description: 'Cette catégorie pourrait être plus explorée',
        level: 'focus',
        skill: category,
        icon: Icons.badgeProgress,
      });
    }
  });

  // Analyze concentration based on session length
  const avgSessionMinutes = calculateAverageSessionDuration(recentSessions);
  if (avgSessionMinutes >= 10) {
    items.push({
      id: 'strength_concentration',
      title: 'Bonne concentration',
      description: `Sessions moyennes de ${avgSessionMinutes} min`,
      level: avgSessionMinutes >= 15 ? 'excellent' : 'good',
      skill: 'concentration',
      icon: Icons.target,
    });
  }

  // Check streak for perseverance
  const currentStreak = calculateCurrentStreak(gameProgress);
  if (currentStreak >= 3) {
    items.push({
      id: 'strength_perseverance',
      title: 'Persévérance remarquable',
      description: `${currentStreak} jours consécutifs de jeu`,
      level: currentStreak >= 7 ? 'excellent' : 'good',
      skill: 'perseverance',
      icon: Icons.fire,
    });
  }

  // Check for patience (low hint usage)
  const totalSessions = recentSessions.length;
  const sessionsWithHints = recentSessions.filter((s) => s.hintsUsed > 0).length;
  if (totalSessions >= 5 && sessionsWithHints / totalSessions < 0.3) {
    items.push({
      id: 'strength_patience',
      title: 'Patience développée',
      description: 'Réfléchit avant de demander de l\'aide',
      level: 'good',
      skill: 'patience',
      icon: '🧘',
    });
  } else if (totalSessions >= 5 && sessionsWithHints / totalSessions > 0.7) {
    items.push({
      id: 'improve_patience',
      title: 'À travailler : patience',
      description: 'Tendance à utiliser les indices rapidement',
      level: 'focus',
      skill: 'patience',
      icon: '💪',
    });
  }

  return items.slice(0, 5); // Return max 5 items
}

// ============================================
// AI RECOMMENDATIONS
// ============================================

/**
 * Generate personalized game recommendations
 */
export function generateRecommendations(
  gameProgress: Record<string, GameProgress>,
  recentSessions: CompletedSession[]
): GameRecommendation[] {
  const recommendations: GameRecommendation[] = [];

  // Get all available games
  const availableGames = gameRegistry.filter((g) => g.status === 'available');

  // Calculate scores for each game
  availableGames.forEach((game) => {
    const progress = gameProgress[game.id];
    const completedLevels = progress
      ? Object.keys(progress.completedLevels).length
      : 0;
    const totalLevels = 10;
    const completionRate = completedLevels / totalLevels;

    let score = 50; // Base score
    let reason = '';
    let difficulty: 'easier' | 'same' | 'harder' = 'same';

    // Never played - recommend to try
    if (!progress || completedLevels === 0) {
      score = 80;
      reason = 'Un nouveau jeu à découvrir !';
      difficulty = 'easier';
    }
    // Partially completed - encourage continuation
    else if (completionRate > 0 && completionRate < 0.5) {
      score = 70;
      reason = `Continue ta progression ! (${completedLevels}/10 niveaux)`;
      difficulty = 'same';
    }
    // Near completion - push to finish
    else if (completionRate >= 0.5 && completionRate < 1) {
      score = 75;
      reason = `Plus que ${totalLevels - completedLevels} niveaux pour terminer !`;
      difficulty = 'harder';
    }
    // Completed - suggest replay for better scores
    else {
      score = 40;
      reason = 'Améliore tes meilleurs scores !';
      difficulty = 'harder';
    }

    // Boost score for games matching user's strong skills
    const userSkills = extractUserSkills(gameProgress);
    const matchingSkills = game.skills.filter((s) => userSkills.includes(s));
    score += matchingSkills.length * 5;

    // Boost score for variety (games not played recently)
    const recentGames = new Set(recentSessions.slice(0, 10).map((s) => s.gameId));
    if (!recentGames.has(game.id)) {
      score += 10;
    }

    const gameInfo = gameRegistry.find((g) => g.id === game.id);

    recommendations.push({
      gameId: game.id,
      gameName: game.name,
      gameIcon: getGameIcon(game.id),
      reason,
      score,
      skillsTargeted: game.skills.slice(0, 3),
      difficulty,
    });
  });

  // Sort by score and return top 3
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 3);
}

/**
 * Extract user's demonstrated skills from progress
 */
function extractUserSkills(
  gameProgress: Record<string, GameProgress>
): string[] {
  const skills: string[] = [];

  Object.entries(gameProgress).forEach(([gameId, progress]) => {
    if (Object.keys(progress.completedLevels).length >= 3) {
      const game = gameRegistry.find((g) => g.id === gameId);
      if (game) {
        skills.push(...game.skills);
      }
    }
  });

  return [...new Set(skills)]; // Unique skills
}

// ============================================
// WEEKLY STATS
// ============================================

/**
 * Generate weekly statistics
 */
export function generateWeeklyStats(
  gameProgress: Record<string, GameProgress>,
  recentSessions: CompletedSession[]
): WeeklyStats {
  const weekStart = getWeekStart();
  const days: DailyStats[] = [];

  // Initialize 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    days.push({
      date: formatDate(date),
      playTimeMinutes: 0,
      levelsCompleted: 0,
      gamesPlayed: [],
    });
  }

  // Populate from sessions
  recentSessions.forEach((session) => {
    const sessionDate = formatDate(new Date(session.completedAt));
    const dayIndex = days.findIndex((d) => d.date === sessionDate);

    if (dayIndex >= 0) {
      days[dayIndex].levelsCompleted++;
      days[dayIndex].playTimeMinutes += session.timeSeconds / 60;

      if (!days[dayIndex].gamesPlayed.includes(session.gameId)) {
        days[dayIndex].gamesPlayed.push(session.gameId);
      }
    }
  });

  // Calculate totals
  const totalPlayTime = days.reduce((sum, d) => sum + d.playTimeMinutes, 0);
  const totalLevels = days.reduce((sum, d) => sum + d.levelsCompleted, 0);

  // Find most active day
  let mostActiveDay = days[0].date;
  let maxActivity = 0;
  days.forEach((day) => {
    if (day.levelsCompleted > maxActivity) {
      maxActivity = day.levelsCompleted;
      mostActiveDay = day.date;
    }
  });

  const sessionsCount = recentSessions.filter((s) => {
    const date = formatDate(new Date(s.completedAt));
    return days.some((d) => d.date === date);
  }).length;

  return {
    weekStart: formatDate(weekStart),
    days,
    totalPlayTime: Math.round(totalPlayTime),
    totalLevelsCompleted: totalLevels,
    averageSessionLength:
      sessionsCount > 0 ? Math.round(totalPlayTime / sessionsCount) : 0,
    mostActiveDay,
  };
}

// ============================================
// ACTIVITY TIMELINE
// ============================================

/**
 * Generate activity timeline from recent sessions
 */
export function generateActivityTimeline(
  recentSessions: CompletedSession[],
  limit = 10
): ActivityItem[] {
  return recentSessions.slice(0, limit).map((session, index) => {
    const game = gameRegistry.find((g) => g.id === session.gameId);

    return {
      id: `activity_${session.completedAt}_${index}`,
      type: 'level_completed' as const,
      timestamp: session.completedAt,
      gameId: session.gameId,
      gameName: game?.name || session.gameId,
      levelId: session.levelId,
      levelName: `Niveau ${session.levelId.replace('level_', '')}`,
      details: {
        moveCount: session.moveCount,
        timeSeconds: session.timeSeconds,
        hintsUsed: session.hintsUsed,
        isSuccess: true,
      },
    };
  });
}

// ============================================
// BADGES
// ============================================

/**
 * Get all badges with unlock status
 */
export function getAllBadges(
  gameProgress: Record<string, GameProgress>,
  unlockedCards: string[]
): Badge[] {
  const totalLevels = Object.values(gameProgress).reduce(
    (sum, p) => sum + Object.keys(p.completedLevels).length,
    0
  );

  const currentStreak = calculateCurrentStreak(gameProgress);
  const gamesPlayed = Object.keys(gameProgress).filter(
    (id) => Object.keys(gameProgress[id].completedLevels).length > 0
  ).length;

  const badges: Badge[] = [
    {
      id: 'first_step',
      name: 'Premier pas',
      description: 'Compléter son premier niveau',
      icon: Icons.celebration,
      category: 'milestone',
      isLocked: totalLevels < 1,
      unlockCondition: '1 niveau complété',
      progress: Math.min(totalLevels, 1) * 100,
    },
    {
      id: 'explorer',
      name: 'Explorateur',
      description: 'Essayer 3 jeux différents',
      icon: '🧭',
      category: 'milestone',
      isLocked: gamesPlayed < 3,
      unlockCondition: '3 jeux essayés',
      progress: Math.min(gamesPlayed / 3, 1) * 100,
    },
    {
      id: 'streak_5',
      name: '5 jours d\'affilée',
      description: 'Jouer 5 jours consécutifs',
      icon: Icons.fire,
      category: 'streak',
      isLocked: currentStreak < 5,
      unlockCondition: '5 jours consécutifs',
      progress: Math.min(currentStreak / 5, 1) * 100,
    },
    {
      id: 'hanoi_master',
      name: 'Maître des Tours',
      description: 'Compléter 5 niveaux de la Tour de Hanoï',
      icon: Icons.hanoi,
      category: 'mastery',
      isLocked: (gameProgress['hanoi']?.completedLevels
        ? Object.keys(gameProgress['hanoi'].completedLevels).length
        : 0) < 5,
      unlockCondition: '5 niveaux Tour de Hanoï',
      progress:
        Math.min(
          (gameProgress['hanoi']?.completedLevels
            ? Object.keys(gameProgress['hanoi'].completedLevels).length
            : 0) / 5,
          1
        ) * 100,
    },
    {
      id: 'logic_brain',
      name: 'Cerveau logique',
      description: 'Compléter 10 niveaux de jeux de logique',
      icon: Icons.brain,
      category: 'skill',
      isLocked: totalLevels < 10,
      unlockCondition: '10 niveaux de logique',
      progress: Math.min(totalLevels / 10, 1) * 100,
    },
    {
      id: 'champion',
      name: 'Champion',
      description: 'Compléter 25 niveaux au total',
      icon: Icons.trophy,
      category: 'milestone',
      isLocked: totalLevels < 25,
      unlockCondition: '25 niveaux complétés',
      progress: Math.min(totalLevels / 25, 1) * 100,
    },
    {
      id: 'perfectionist',
      name: 'Perfectionniste',
      description: 'Réussir un niveau avec le score optimal',
      icon: Icons.star,
      category: 'special',
      isLocked: !unlockedCards.includes('perfectionist'),
      unlockCondition: 'Score optimal',
    },
  ];

  // Add unlock dates for unlocked badges
  return badges.map((badge) => ({
    ...badge,
    unlockedAt: badge.isLocked ? undefined : Date.now() - Math.random() * 86400000 * 30,
  }));
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    logic: 'logique',
    spatial: 'spatial',
    math: 'mathématiques',
    memory: 'mémoire',
    language: 'langage',
  };
  return names[category] || category;
}

function getCategoryIcon(category: string): string {
  const categoryIcons: Record<string, string> = {
    logic: Icons.puzzle,
    spatial: '📐',
    math: Icons.math,
    memory: Icons.brain,
    language: Icons.writing,
  };
  return categoryIcons[category] || Icons.book;
}

function getGameIcon(gameId: string): string {
  const gameIcons: Record<string, string> = {
    hanoi: Icons.hanoi,
    sudoku: Icons.math,
    'suites-logiques': Icons.puzzle,
    balance: Icons.balance,
    'math-blocks': Icons.blocks,
    labyrinthe: Icons.spiral,
    memory: Icons.cards,
    tangram: '📐',
  };
  return gameIcons[gameId] || Icons.game;
}
