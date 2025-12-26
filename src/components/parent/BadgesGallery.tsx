/**
 * Badges Gallery Component
 * Displays unlocked and locked badges/achievements
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store';
import { getAllBadges } from '@/utils/analytics';
import type { Badge } from '@/types';

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export function BadgesGallery() {
  const gameProgress = useStore((state) => state.gameProgress);
  const unlockedCards = useStore((state) => state.unlockedCards);

  const badges = useMemo(
    () => getAllBadges(gameProgress, unlockedCards),
    [gameProgress, unlockedCards]
  );

  const unlockedBadges = badges.filter((b: Badge) => !b.isLocked);
  const lockedBadges = badges.filter((b: Badge) => b.isLocked);

  return (
    <View style={styles.container}>
      {/* Unlocked badges */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {unlockedBadges.map((badge: Badge) => (
          <View key={badge.id} style={styles.badgeCard}>
            <View style={styles.badgeIconContainer}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
            </View>
            <Text style={styles.badgeName}>{badge.name}</Text>
            <Text style={styles.badgeDate}>
              {badge.unlockedAt ? formatDate(badge.unlockedAt) : ''}
            </Text>
          </View>
        ))}

        {/* Locked badges */}
        {lockedBadges.map((badge: Badge) => (
          <View key={badge.id} style={[styles.badgeCard, styles.badgeCardLocked]}>
            <View style={[styles.badgeIconContainer, styles.badgeIconLocked]}>
              <Text style={styles.badgeIconLocked}>{badge.icon}</Text>
            </View>
            <Text style={[styles.badgeName, styles.badgeNameLocked]}>
              {badge.name}
            </Text>
            <Text style={[styles.badgeDate, styles.badgeDateLocked]}>
              À débloquer
            </Text>
            {/* Progress indicator for locked badges */}
            {badge.progress !== undefined && badge.progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${badge.progress}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>{Math.round(badge.progress)}%</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Full section wrapper with header
export function BadgesSection() {
  return (
    <View style={styles.sectionContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.headerIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={styles.headerIcon}>🏆</Text>
          </View>
          <Text style={styles.sectionTitle}>Badges & Accomplissements</Text>
        </View>
        <Text style={styles.seeAllText}>Collection complète →</Text>
      </View>

      <BadgesGallery />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: colors.secondary.main,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  headerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.inverse,
    opacity: 0.9,
  },
  container: {},
  scrollContent: {
    gap: spacing[4],
    paddingVertical: spacing[2],
  },
  badgeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    alignItems: 'center',
    minWidth: 140,
  },
  badgeCardLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD93D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  badgeIconLocked: {
    backgroundColor: colors.ui.disabled,
    opacity: 0.5,
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeName: {
    fontFamily: 'Fredoka',
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
  badgeNameLocked: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  badgeDate: {
    fontSize: 10,
    color: colors.text.muted,
    textAlign: 'center',
  },
  badgeDateLocked: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
    width: '100%',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.text.inverse,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
