/**
 * Behavior Insights Component
 * Displays 4 key behavioral metrics in card format
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { useStore } from '../../store';
import { generateBehaviorInsights } from '../../utils/analytics';

interface InsightCard {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
}

export function BehaviorInsights() {
  const gameProgress = useStore((state) => state.gameProgress);
  const recentSessions = useStore((state) => state.recentSessions);

  const insights = useMemo(
    () => generateBehaviorInsights(gameProgress, recentSessions),
    [gameProgress, recentSessions]
  );

  const cards: InsightCard[] = [
    {
      icon: '☀️',
      iconBg: 'rgba(255, 179, 71, 0.15)',
      label: 'Meilleur moment',
      value: insights.bestPlayWindow.label,
    },
    {
      icon: '⏱️',
      iconBg: 'rgba(91, 141, 238, 0.15)',
      label: 'Session moyenne',
      value: `${insights.averageSessionMinutes || 0} minutes`,
    },
    {
      icon: '🔥',
      iconBg: 'rgba(123, 199, 77, 0.15)',
      label: 'Série actuelle',
      value: `${insights.currentStreak} jour${insights.currentStreak !== 1 ? 's' : ''}`,
    },
    {
      icon: '💪',
      iconBg: 'rgba(224, 86, 253, 0.15)',
      label: 'Essais / niveau',
      value: `${insights.attemptsPerLevel || 0} en moyenne`,
    },
  ];

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <View key={index} style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: card.iconBg }]}>
            <Text style={styles.icon}>{card.icon}</Text>
          </View>
          <Text style={styles.label}>{card.label}</Text>
          <Text style={styles.value}>{card.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  card: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    alignItems: 'center',
    ...shadows.md,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  value: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
});
