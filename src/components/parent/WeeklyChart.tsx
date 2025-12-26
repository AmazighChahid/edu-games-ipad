/**
 * Weekly Activity Chart
 * Bar chart showing activity over the past 7 days
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store';
import { generateWeeklyStats } from '@/utils/analytics';
import type { DailyStats } from '@/types';

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MAX_BAR_HEIGHT = 120;

export function WeeklyChart() {
  const gameProgress = useStore((state) => state.gameProgress);
  const recentSessions = useStore((state) => state.recentSessions);

  const weeklyStats = useMemo(
    () => generateWeeklyStats(gameProgress, recentSessions),
    [gameProgress, recentSessions]
  );

  // Find max value for scaling
  const maxPlayTime = Math.max(
    ...weeklyStats.days.map((d) => d.playTimeMinutes),
    1 // Avoid division by zero
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(123, 199, 77, 0.15)' }]}>
            <Text style={styles.icon}>📈</Text>
          </View>
          <Text style={styles.title}>Activité de la semaine</Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {weeklyStats.days.map((day: DailyStats, index: number) => {
          const barHeight = (day.playTimeMinutes / maxPlayTime) * MAX_BAR_HEIGHT;
          const isToday = index === weeklyStats.days.length - 1;

          return (
            <View key={day.date} style={styles.barGroup}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(barHeight, 4),
                      backgroundColor: isToday
                        ? colors.primary.main
                        : colors.primary.light,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                {DAY_LABELS[index]}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary.main }]} />
          <Text style={styles.legendText}>Temps de jeu (min)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.feedback.success }]} />
          <Text style={styles.legendText}>Niveaux complétés</Text>
        </View>
      </View>

      {/* Summary stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(weeklyStats.totalPlayTime)}</Text>
          <Text style={styles.statLabel}>min totales</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{weeklyStats.totalLevelsCompleted}</Text>
          <Text style={styles.statLabel}>niveaux</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{weeklyStats.averageSessionLength}</Text>
          <Text style={styles.statLabel}>min/session</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    ...shadows.md,
  },
  header: {
    marginBottom: spacing[5],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  title: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: MAX_BAR_HEIGHT + 30,
    paddingTop: spacing[5],
    gap: spacing[3],
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[2],
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    maxWidth: 40,
  },
  bar: {
    width: '100%',
    borderRadius: borderRadius.md,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.muted,
  },
  dayLabelToday: {
    color: colors.primary.main,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[6],
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Fredoka',
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary.main,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: spacing[1],
  },
});
