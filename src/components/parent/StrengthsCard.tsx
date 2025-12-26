/**
 * Strengths & Weaknesses Card
 * Automatic analysis of child's performance
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store';
import { analyzeStrengthsWeaknesses } from '@/utils/analytics';
import type { StrengthLevel, StrengthItem } from '@/types';

const LEVEL_CONFIG: Record<StrengthLevel, { bg: string; text: string; label: string }> = {
  excellent: {
    bg: colors.feedback.success,
    text: colors.text.inverse,
    label: 'Excellent',
  },
  good: {
    bg: 'rgba(123, 199, 77, 0.2)',
    text: colors.feedback.success,
    label: 'Très bien',
  },
  developing: {
    bg: 'rgba(91, 141, 238, 0.2)',
    text: colors.primary.main,
    label: 'En progrès',
  },
  focus: {
    bg: colors.secondary.main,
    text: colors.text.inverse,
    label: 'Focus',
  },
};

export function StrengthsCard() {
  const gameProgress = useStore((state) => state.gameProgress);
  const recentSessions = useStore((state) => state.recentSessions);

  const strengths = useMemo(
    () => analyzeStrengthsWeaknesses(gameProgress, recentSessions),
    [gameProgress, recentSessions]
  );

  if (strengths.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(123, 199, 77, 0.15)' }]}>
            <Text style={styles.headerIcon}>💡</Text>
          </View>
          <Text style={styles.title}>Points forts & Axes de progrès</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Pas encore assez de données pour analyser les points forts.
            {'\n'}Continue à jouer pour débloquer cette section !
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(123, 199, 77, 0.15)' }]}>
          <Text style={styles.headerIcon}>💡</Text>
        </View>
        <Text style={styles.title}>Points forts & Axes de progrès</Text>
      </View>

      {/* Items List */}
      <View style={styles.list}>
        {strengths.map((item: StrengthItem) => {
          const isPositive = item.level === 'excellent' || item.level === 'good';
          const config = LEVEL_CONFIG[item.level];

          return (
            <View key={item.id} style={styles.item}>
              {/* Badge */}
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isPositive ? 'rgba(123, 199, 77, 0.15)' : 'rgba(255, 179, 71, 0.15)' },
                ]}
              >
                <Text style={styles.badgeIcon}>{item.icon}</Text>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>

              {/* Level Tag */}
              <View style={[styles.levelTag, { backgroundColor: config.bg }]}>
                <Text style={[styles.levelTagText, { color: config.text }]}>
                  {config.label}
                </Text>
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
    flex: 1,
  },
  list: {
    gap: spacing[1],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  itemDescription: {
    fontSize: 12,
    color: colors.text.muted,
    lineHeight: 16,
  },
  levelTag: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  levelTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    padding: spacing[4],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
