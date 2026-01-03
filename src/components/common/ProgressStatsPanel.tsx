/**
 * ProgressStatsPanel component
 * Unified progress stats display for all games
 * Replaces duplicated renderProgress() implementations
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { colors, spacing, fontFamily, fontSize, borderRadius, shadows } from '../../theme';
import type {
  StatConfig,
  ProgressBarConfig,
  ProgressStatsPanelProps,
} from './ProgressStatsPanel.types';

// Re-export types for convenience
export type { StatConfig, ProgressBarConfig, ProgressStatsPanelProps } from './ProgressStatsPanel.types';

// ============================================
// HELPER FUNCTIONS FOR CREATING STAT CONFIGS
// ============================================

/**
 * Create a "COUPS" (moves) stat config
 */
export function createMovesStatConfig(
  moves: number,
  options?: Partial<StatConfig>
): StatConfig {
  return {
    id: 'moves',
    label: 'COUPS',
    value: moves,
    color: colors.primary.main,
    ...options,
  };
}

/**
 * Create an "OBJECTIF" (optimal/target) stat config
 */
export function createObjectiveStatConfig(
  optimal: number,
  options?: Partial<StatConfig>
): StatConfig {
  return {
    id: 'objective',
    label: 'OBJECTIF',
    value: optimal,
    color: colors.text.secondary,
    ...options,
  };
}

/**
 * Create an "ERREURS" (errors) stat config
 */
export function createErrorsStatConfig(
  errors: number,
  options?: Partial<StatConfig>
): StatConfig {
  return {
    id: 'errors',
    label: 'ERREURS',
    value: errors,
    color: colors.feedback.error,
    ...options,
  };
}

/**
 * Create a "RECORD" (streak) stat config
 */
export function createStreakStatConfig(
  streak: number,
  options?: Partial<StatConfig>
): StatConfig {
  return {
    id: 'streak',
    label: 'RECORD',
    value: streak,
    icon: '🔥',
    color: '#E056FD', // Purple
    visible: streak > 0,
    ...options,
  };
}

/**
 * Create a "TEMPS" (timer) stat config
 */
export function createTimerStatConfig(
  seconds: number,
  options?: Partial<StatConfig>
): StatConfig {
  const formatTime = (s: number): string => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    id: 'timer',
    label: 'TEMPS',
    value: formatTime(seconds),
    color: colors.text.secondary,
    ...options,
  };
}

/**
 * Create an "INDICES" (hints) stat config
 */
export function createHintsStatConfig(
  remaining: number,
  max: number,
  options?: Partial<StatConfig>
): StatConfig {
  return {
    id: 'hints',
    label: 'INDICES',
    value: `${remaining}/${max}`,
    icon: '💡',
    color: colors.secondary.main,
    ...options,
  };
}

/**
 * Create a "RÉUSSIES" (success count) stat config
 */
export function createSuccessStatConfig(
  current: number,
  total: number,
  options?: Partial<StatConfig>
): StatConfig {
  return {
    id: 'success',
    label: 'RÉUSSIES',
    value: `${current}/${total}`,
    color: colors.feedback.success,
    ...options,
  };
}

/**
 * Create a "NIVEAU" (level) stat config
 */
export function createLevelStatConfig(
  current: number,
  total: number,
  options?: Partial<StatConfig>
): StatConfig {
  return {
    id: 'level',
    label: 'NIVEAU',
    value: `${current}/${total}`,
    color: colors.primary.main,
    ...options,
  };
}

/**
 * Generate encouragement message based on progress
 */
export function getEncouragementMessage(progress: number): string {
  if (progress >= 1) return 'Bravo ! 🎉';
  if (progress >= 0.7) return 'Tu y es presque ! 💪';
  if (progress >= 0.4) return 'Continue ! 🌟';
  return "C'est parti ! 🚀";
}

// ============================================
// COMPONENT
// ============================================

export function ProgressStatsPanel({
  stats,
  progressBar,
  visible = true,
  useGlassEffect = true,
  style,
  enterDelay = 0,
}: ProgressStatsPanelProps) {
  // Filter visible stats
  const visibleStats = useMemo(
    () => stats.filter((stat) => stat.visible !== false),
    [stats]
  );

  // Get progress bar message
  const progressMessage = useMemo(() => {
    if (!progressBar) return null;
    return progressBar.message || getEncouragementMessage(progressBar.progress);
  }, [progressBar]);

  if (!visible) return null;

  const containerStyle: ViewStyle = {
    ...styles.container,
    ...(useGlassEffect ? styles.glassEffect : styles.solidBackground),
    ...style,
  };

  return (
    <Animated.View
      entering={FadeIn.delay(enterDelay).duration(300)}
      exiting={FadeOut.duration(200)}
      style={containerStyle}
    >
      <View style={styles.statsRow}>
        {visibleStats.map((stat, index) => (
          <React.Fragment key={stat.id}>
            {/* Divider before each stat except the first */}
            {index > 0 && <View style={styles.divider} />}

            {/* Stat item */}
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, stat.color ? { color: stat.color } : undefined]}>
                {stat.icon ? `${stat.icon} ` : ''}
                {stat.value}
              </Text>
            </View>
          </React.Fragment>
        ))}

        {/* Progress bar section */}
        {progressBar && progressBar.visible !== false && (
          <>
            <View style={styles.divider} />
            <View style={styles.progressSection}>
              <View style={[styles.progressBar, { width: progressBar.width || 80 }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(progressBar.progress * 100, 100)}%`,
                      backgroundColor: progressBar.color || colors.feedback.success,
                    },
                  ]}
                />
              </View>
              {progressMessage && (
                <Text
                  style={[
                    styles.progressMessage,
                    { color: progressBar.color || colors.feedback.success },
                  ]}
                >
                  {progressMessage}
                </Text>
              )}
            </View>
          </>
        )}
      </View>
    </Animated.View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    zIndex: 100,
    marginVertical: spacing[2],
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    ...shadows.lg,
  },
  solidBackground: {
    backgroundColor: colors.background.card,
    ...shadows.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.muted,
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },
  statValue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    fontWeight: '700',
    lineHeight: 28,
    color: colors.text.primary,
  },
  divider: {
    width: 2,
    height: 36,
    backgroundColor: colors.ui.divider,
    borderRadius: 1,
  },
  progressSection: {
    alignItems: 'center',
    gap: spacing[2],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.ui.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressMessage: {
    fontSize: 11,
    fontWeight: '700',
  },
});
