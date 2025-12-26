/**
 * Screen Time Card Component
 * Displays daily screen time stats and trends
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store/useStore';

export function ScreenTimeCard() {
  const dailyRecords = useStore((state) => state.dailyRecords);
  const settings = useStore((state) => state.settings);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = dailyRecords[today];

  // Calculate week average
  const weekStats = useMemo(() => {
    const last7Days: number[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const record = dailyRecords[dateStr];
      if (record) {
        last7Days.push(record.totalMinutes);
      }
    }

    if (last7Days.length === 0) {
      return { average: 0, total: 0, days: 0 };
    }

    return {
      average: Math.round(last7Days.reduce((a, b) => a + b, 0) / last7Days.length),
      total: Math.round(last7Days.reduce((a, b) => a + b, 0)),
      days: last7Days.length,
    };
  }, [dailyRecords]);

  const todayMinutes = Math.round(todayRecord?.totalMinutes || 0);
  const todayGames = todayRecord?.gamesPlayed?.length || 0;
  const todaySessions = todayRecord?.sessions?.length || 0;

  // Calculate limit progress
  const limitMinutes = settings.dailyLimitMinutes;
  const limitProgress = limitMinutes
    ? Math.min((todayMinutes / limitMinutes) * 100, 100)
    : null;

  const formatMinutes = (mins: number): string => {
    if (mins < 60) {
      return `${mins} min`;
    }
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 179, 71, 0.15)' }]}>
          <Text style={styles.headerIcon}>⏰</Text>
        </View>
        <Text style={styles.title}>Temps d'écran</Text>
      </View>

      {/* Today's stats */}
      <View style={styles.todaySection}>
        <Text style={styles.todayLabel}>Aujourd'hui</Text>
        <Text style={styles.todayValue}>{formatMinutes(todayMinutes)}</Text>

        {/* Limit progress bar (if limit is set) */}
        {limitProgress !== null && (
          <View style={styles.limitContainer}>
            <View style={styles.limitBar}>
              <View
                style={[
                  styles.limitFill,
                  {
                    width: `${limitProgress}%`,
                    backgroundColor:
                      limitProgress >= 100
                        ? colors.feedback.error
                        : limitProgress >= 80
                        ? colors.feedback.warning
                        : colors.feedback.success,
                  },
                ]}
              />
            </View>
            <Text style={styles.limitText}>
              {todayMinutes}/{limitMinutes} min
            </Text>
          </View>
        )}
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{todaySessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{todayGames}</Text>
          <Text style={styles.statLabel}>Jeux joués</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatMinutes(weekStats.average)}</Text>
          <Text style={styles.statLabel}>Moy. / jour</Text>
        </View>
      </View>

      {/* Week summary */}
      <View style={styles.weekSummary}>
        <Text style={styles.weekText}>
          Cette semaine : {formatMinutes(weekStats.total)} sur {weekStats.days} jour
          {weekStats.days > 1 ? 's' : ''}
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 18,
  },
  title: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  todaySection: {
    alignItems: 'center',
    paddingVertical: spacing[4],
    marginBottom: spacing[4],
  },
  todayLabel: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: spacing[1],
  },
  todayValue: {
    fontFamily: 'Fredoka',
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary.main,
  },
  limitContainer: {
    width: '100%',
    marginTop: spacing[4],
  },
  limitBar: {
    height: 8,
    backgroundColor: colors.ui.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },
  limitFill: {
    height: '100%',
    borderRadius: 4,
  },
  limitText: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: 'Fredoka',
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.muted,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.ui.border,
  },
  weekSummary: {
    paddingTop: spacing[4],
    alignItems: 'center',
  },
  weekText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
});
