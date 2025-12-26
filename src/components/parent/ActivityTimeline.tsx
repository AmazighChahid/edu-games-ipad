/**
 * Activity Timeline Component
 * Shows recent game sessions in a timeline format
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store/useStore';
import { generateActivityTimeline } from '@/utils/analytics';
import type { ActivityItem } from '@/types';

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  const timeStr = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (diffDays === 0) {
    return `Aujourd'hui, ${timeStr}`;
  } else if (diffDays === 1) {
    return `Hier, ${timeStr}`;
  } else if (diffDays < 7) {
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${timeStr}`;
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  }
};

const getGameIcon = (gameId: string): string => {
  const icons: Record<string, string> = {
    hanoi: '🗼',
    sudoku: '🔢',
    'suites-logiques': '🧩',
    balance: '⚖️',
    'math-blocks': '🧱',
    labyrinthe: '🌀',
  };
  return icons[gameId] || '🎮';
};

interface ActivityTimelineProps {
  limit?: number;
}

export function ActivityTimeline({ limit = 5 }: ActivityTimelineProps) {
  const recentSessions = useStore((state) => state.recentSessions);

  const activities = useMemo(
    () => generateActivityTimeline(recentSessions, limit),
    [recentSessions, limit]
  );

  if (activities.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(123, 199, 77, 0.15)' }]}>
            <Text style={styles.headerIcon}>📋</Text>
          </View>
          <Text style={styles.title}>Activité Récente</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Aucune activité récente. Commencez à jouer pour voir l'historique !
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(123, 199, 77, 0.15)' }]}>
            <Text style={styles.headerIcon}>📋</Text>
          </View>
          <Text style={styles.title}>Activité Récente</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Voir historique complet →</Text>
        </TouchableOpacity>
      </View>

      {/* Timeline */}
      <View style={styles.timeline}>
        {activities.map((activity: ActivityItem, index: number) => {
          const isSuccess = activity.details.isSuccess;
          const isLast = index === activities.length - 1;

          return (
            <View key={activity.id} style={styles.activityItem}>
              {/* Timeline dot and line */}
              <View style={styles.timelineIndicator}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: isSuccess ? colors.feedback.success : colors.primary.main },
                  ]}
                />
                {!isLast && <View style={styles.line} />}
              </View>

              {/* Activity content */}
              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <View style={styles.activityTitle}>
                    <Text style={styles.gameIcon}>
                      {getGameIcon(activity.gameId || '')}
                    </Text>
                    <Text style={styles.titleText}>
                      {activity.gameName} - {activity.levelName}
                      {isSuccess ? ' complété !' : ' tenté'}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>
                    {formatTime(activity.timestamp)}
                  </Text>
                </View>

                {/* Details */}
                {activity.details && (
                  <Text style={styles.detailsText}>
                    {activity.details.moveCount && (
                      <>Résolu en {activity.details.moveCount} coups</>
                    )}
                    {activity.details.optimalMoves && (
                      <> (optimal: {activity.details.optimalMoves})</>
                    )}
                  </Text>
                )}

                {/* Badges */}
                <View style={styles.badges}>
                  {isSuccess && (
                    <View style={styles.badgeSuccess}>
                      <Text style={styles.badgeIcon}>✓</Text>
                      <Text style={styles.badgeText}>Réussi</Text>
                    </View>
                  )}
                  {activity.details.timeSeconds && (
                    <View style={styles.badgeTime}>
                      <Text style={styles.badgeIcon}>⏱️</Text>
                      <Text style={styles.badgeText}>
                        {Math.floor(activity.details.timeSeconds / 60)}m{' '}
                        {activity.details.timeSeconds % 60}s
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerIcon: {
    fontSize: 18,
  },
  title: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary.main,
  },
  timeline: {
    paddingLeft: spacing[4],
  },
  activityItem: {
    flexDirection: 'row',
    position: 'relative',
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: spacing[4],
    width: 20,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: colors.background.primary,
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    top: 14,
    width: 2,
    height: '100%',
    backgroundColor: colors.ui.border,
    left: 6,
  },
  activityContent: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  activityTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  gameIcon: {
    fontSize: 16,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: colors.text.muted,
  },
  detailsText: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: spacing[2],
  },
  badges: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  badgeTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'rgba(91, 141, 238, 0.15)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  badgeIcon: {
    fontSize: 11,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  emptyState: {
    padding: spacing[4],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
  },
});
