/**
 * AI Recommendations Card
 * Personalized game suggestions based on scoring algorithm
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store';
import { generateRecommendations } from '@/utils/analytics';
import { gameRegistry } from '@/games/registry';
import type { GameRecommendation } from '@/types';

export function RecommendationsCard() {
  const router = useRouter();
  const gameProgress = useStore((state) => state.gameProgress);
  const recentSessions = useStore((state) => state.recentSessions);

  const recommendations = useMemo(
    () => generateRecommendations(gameProgress, recentSessions),
    [gameProgress, recentSessions]
  );

  const handleGamePress = (gameId: string) => {
    const game = gameRegistry.find((g) => g.id === gameId);
    if (game?.route) {
      router.push(game.route as never);
    }
  };

  const getDifficultyColor = (difficulty: 'easier' | 'same' | 'harder') => {
    switch (difficulty) {
      case 'easier':
        return colors.feedback.success;
      case 'same':
        return colors.primary.main;
      case 'harder':
        return colors.secondary.main;
    }
  };

  return (
    <View style={styles.container}>
      {/* AI Badge */}
      <View style={styles.aiBadge}>
        <Text style={styles.aiBadgeIcon}>✨</Text>
        <Text style={styles.aiBadgeText}>Recommandations personnalisées</Text>
      </View>

      {/* Recommendations List */}
      <View style={styles.list}>
        {recommendations.map((rec: GameRecommendation) => (
          <TouchableOpacity
            key={rec.gameId}
            style={styles.item}
            onPress={() => handleGamePress(rec.gameId)}
            activeOpacity={0.7}
          >
            {/* Game Icon */}
            <View
              style={[
                styles.gameIcon,
                { backgroundColor: getDifficultyColor(rec.difficulty) },
              ]}
            >
              <Text style={styles.gameIconEmoji}>{rec.gameIcon}</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.gameTitle}>{rec.gameName}</Text>
              <Text style={styles.reason}>{rec.reason}</Text>
            </View>

            {/* Arrow */}
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(224, 86, 253, 0.08)',
    borderWidth: 2,
    borderColor: 'rgba(224, 86, 253, 0.2)',
    borderRadius: borderRadius.xl,
    padding: spacing[6],
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing[2],
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    marginBottom: spacing[4],
  },
  aiBadgeIcon: {
    fontSize: 14,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  list: {
    gap: spacing[3],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    ...shadows.sm,
  },
  gameIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIconEmoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  reason: {
    fontSize: 12,
    color: colors.text.muted,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 18,
    color: colors.text.muted,
  },
});
