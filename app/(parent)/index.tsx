/**
 * Parent Dashboard Screen
 * Complete redesign with tabs and advanced analytics
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing, borderRadius, shadows } from '@/theme';
import { ScreenHeader } from '@/components/common';
import { useStore, useActiveProfile } from '@/store';
import { gameRegistry } from '@/games/registry';
import type { ParentTabId } from '@/types';

// Import all parent dashboard components
import {
  ParentTabs,
  BehaviorInsights,
  WeeklyChart,
  SkillsRadarV2,
  RecommendationsCard,
  StrengthsCard,
  GoalsSection,
  ActivityTimeline,
  BadgesSection,
  ScreenTimeCard,
  ChildSelector,
  ProgressChart,
} from '@/components/parent';

export default function ParentDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ParentTabId>('overview');

  const gameProgress = useStore((state) => state.gameProgress);
  const profile = useActiveProfile();

  const handleBack = () => {
    router.back();
  };

  const handleSettings = () => {
    router.push('/(parent)/settings' as never);
  };

  // Calculate overall stats
  const stats = useMemo(() => {
    const totalLevels = Object.values(gameProgress).reduce(
      (sum, progress) => sum + Object.keys(progress.completedLevels).length,
      0
    );

    const totalPlayTime = Object.values(gameProgress).reduce(
      (sum, progress) => sum + progress.totalPlayTimeMinutes,
      0
    );

    const gamesPlayed = Object.keys(gameProgress).filter(
      (id) => Object.keys(gameProgress[id].completedLevels).length > 0
    ).length;

    // Calculate trends (mock for now, would need week-over-week data)
    const levelsTrend = totalLevels > 0 ? '+' + Math.min(totalLevels, 4) : '0';

    return {
      totalLevels,
      totalPlayTime: Math.floor(totalPlayTime),
      gamesPlayed,
      successRate: totalLevels > 0 ? Math.min(Math.round((totalLevels / (totalLevels + 2)) * 100), 95) : 0,
      levelsTrend,
    };
  }, [gameProgress]);

  // Prepare skills data
  const skillsData = useMemo(() => [
    {
      name: 'Logique',
      level: Math.min(Math.floor(stats.totalLevels / 5), 5),
      icon: '🎯',
      color: colors.primary.main,
    },
    {
      name: 'Résolution',
      level: Math.min(Math.floor(stats.totalLevels / 6), 5),
      icon: '🧩',
      color: colors.feedback.success,
    },
    {
      name: 'Concentration',
      level: Math.min(Math.floor(stats.totalPlayTime / 30), 5),
      icon: '🪷',
      color: colors.secondary.main,
    },
    {
      name: 'Persévérance',
      level: Math.min(Math.floor(stats.totalLevels / 8), 5),
      icon: '🌱',
      color: '#E056FD',
    },
  ], [stats]);

  // Prepare games progress data
  const gamesProgressData = useMemo(() =>
    gameRegistry
      .filter((game) => game.status === 'available')
      .map((game) => {
        const progress = gameProgress[game.id];
        const completedCount = progress ? Object.keys(progress.completedLevels).length : 0;
        return {
          label: game.name,
          value: completedCount,
          maxValue: 10,
          color: getCategoryColor(game.category),
        };
      }),
    [gameProgress]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary.main, colors.primary.dark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <Text style={styles.title}>👨‍👩‍👧 Espace Parents</Text>
              <Text style={styles.subtitle}>Tableau de bord & suivi de progression</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <ChildSelector />
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Navigation Tabs */}
      <ParentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && (
          <>
            {/* Hero Section: Stats + Chart */}
            <View style={styles.heroSection}>
              {/* Stats Overview */}
              <View style={styles.statsCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitle}>
                    <View style={[styles.sectionIcon, { backgroundColor: 'rgba(91, 141, 238, 0.15)' }]}>
                      <Text>📊</Text>
                    </View>
                    <Text style={styles.sectionTitleText}>Statistiques Globales</Text>
                  </View>
                  <View style={styles.periodSelector}>
                    <View style={styles.periodBtn}><Text style={styles.periodBtnText}>Jour</Text></View>
                    <View style={[styles.periodBtn, styles.periodBtnActive]}><Text style={styles.periodBtnActiveText}>Semaine</Text></View>
                    <View style={styles.periodBtn}><Text style={styles.periodBtnText}>Mois</Text></View>
                  </View>
                </View>

                <View style={styles.statsGrid}>
                  <StatCard
                    value={stats.totalLevels.toString()}
                    label="Niveaux réussis"
                    trend={`↑ ${stats.levelsTrend} cette semaine`}
                    color={colors.primary.main}
                  />
                  <StatCard
                    value={formatTime(stats.totalPlayTime)}
                    label="Temps de jeu"
                    trend="→ Stable"
                    trendType="neutral"
                    color={colors.feedback.success}
                  />
                  <StatCard
                    value={stats.gamesPlayed.toString()}
                    label="Jeux explorés"
                    trend={stats.gamesPlayed > 1 ? '↑ +1 nouveau' : ''}
                    color={colors.secondary.main}
                  />
                  <StatCard
                    value={`${stats.successRate}%`}
                    label="Taux de réussite"
                    trend="↑ +12%"
                    color="#E056FD"
                  />
                </View>
              </View>

              {/* Weekly Chart */}
              <WeeklyChart />
            </View>

            {/* Behavior Insights */}
            <BehaviorInsights />

            {/* Skills Section */}
            <SkillsRadarV2 skills={skillsData} />

            {/* Insights Row */}
            <View style={styles.insightsRow}>
              <View style={styles.insightsHalf}>
                <StrengthsCard />
              </View>
              <View style={styles.insightsHalf}>
                <RecommendationsCard />
              </View>
            </View>

            {/* Goals Section */}
            <GoalsSection />

            {/* Activity Timeline */}
            <ActivityTimeline limit={5} />

            {/* Badges Section */}
            <BadgesSection />

            {/* Screen Time Card */}
            <ScreenTimeCard />
          </>
        )}

        {activeTab === 'activities' && (
          <>
            <ProgressChart data={gamesProgressData} title="Progression par Jeu" />
            <View style={styles.spacer} />
            <ActivityTimeline limit={20} />
          </>
        )}

        {activeTab === 'skills' && (
          <>
            <SkillsRadarV2 skills={skillsData} />
            <View style={styles.spacer} />
            <StrengthsCard />
            <View style={styles.spacer} />
            <RecommendationsCard />
          </>
        )}

        {activeTab === 'goals' && (
          <>
            <GoalsSection />
            <View style={styles.spacer} />
            <BadgesSection />
          </>
        )}

        {/* Bottom padding */}
        <View style={{ height: insets.bottom + spacing[6] }} />
      </ScrollView>
    </View>
  );
}

// Stat Card Component
interface StatCardProps {
  value: string;
  label: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  color: string;
}

function StatCard({ value, label, trend, trendType = 'up', color }: StatCardProps) {
  const trendColors = {
    up: { bg: 'rgba(123, 199, 77, 0.15)', text: colors.feedback.success },
    down: { bg: 'rgba(229, 62, 62, 0.15)', text: colors.feedback.error },
    neutral: { bg: 'rgba(113, 128, 150, 0.15)', text: colors.text.muted },
  };

  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {trend && (
        <View style={[styles.statTrend, { backgroundColor: trendColors[trendType].bg }]}>
          <Text style={[styles.statTrendText, { color: trendColors[trendType].text }]}>
            {trend}
          </Text>
        </View>
      )}
    </View>
  );
}

// Helper functions
function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}` : `${hours}h`;
}

function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    logic: colors.home.categories.logic,
    spatial: colors.home.categories.spatial,
    math: colors.home.categories.numbers,
    memory: colors.home.categories.memory,
    language: colors.home.categories.language,
  };
  return categoryColors[category] || colors.primary.main;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[6],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: colors.text.inverse,
  },
  headerTitle: {},
  title: {
    fontFamily: 'Fredoka',
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
    gap: spacing[6],
  },
  heroSection: {
    flexDirection: 'row',
    gap: spacing[6],
  },
  statsCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    ...shadows.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleText: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing[1],
    backgroundColor: colors.background.secondary,
    padding: 4,
    borderRadius: borderRadius.md,
  },
  periodBtn: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.sm,
  },
  periodBtnActive: {
    backgroundColor: colors.primary.main,
  },
  periodBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.muted,
  },
  periodBtnActiveText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    borderTopWidth: 4,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Fredoka',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  statTrend: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  statTrendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  insightsRow: {
    flexDirection: 'row',
    gap: spacing[6],
  },
  insightsHalf: {
    flex: 1,
  },
  spacer: {
    height: spacing[4],
  },
});
