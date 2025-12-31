/**
 * ConteurParentScreen Component
 *
 * Espace Parent pour Le Conteur Curieux
 * - Dashboard avec métriques (histoires, réussite, temps)
 * - Radar des compétences
 * - Liste des enregistrements audio
 * - Paramètres
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily, touchTargets } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import { PageContainer } from '../../../components/common/PageContainer';
import { ScreenHeader } from '../../../components/common/ScreenHeader';

import { RadarChart } from '../components/RadarChart';
import { RecordingsList } from '../components/RecordingsList';
import type {
  ParentDashboardData,
  ParentSettings,
  CompetencyScores,
  ChildRecording,
  ConteurDifficulty,
  ReadingMode,
} from '../types';
import {
  getParentDashboardData,
  updateParentSettings,
  deleteRecording,
  clearAllData,
} from '../utils/parentStorage';

// Difficulty labels
const DIFFICULTY_LABELS: Record<ConteurDifficulty, string> = {
  1: 'Facile',
  2: 'Normal',
  3: 'Difficile',
};

// Reading mode labels
const MODE_LABELS: Record<ReadingMode, { label: string; emoji: string }> = {
  listen: { label: 'Écouter', emoji: Icons.audio },
  read: { label: 'Lire', emoji: Icons.book },
  mixed: { label: 'Mixte', emoji: Icons.book },
};

export function ConteurParentScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  // État
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ParentDashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'recordings' | 'settings'>('stats');

  // Responsive
  const isTablet = width >= 768;
  const isLandscape = width > height;

  // Charger les données
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getParentDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading parent data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const handleTabChange = useCallback((tab: 'stats' | 'recordings' | 'settings') => {
    Haptics.selectionAsync();
    setActiveTab(tab);
  }, []);

  const handleDeleteRecording = useCallback(async (recordingId: string) => {
    try {
      await deleteRecording(recordingId);
      await loadData();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error deleting recording:', error);
      Alert.alert('Erreur', 'Impossible de supprimer l\'enregistrement');
    }
  }, [loadData]);

  const handleUpdateDifficulty = useCallback(async (difficulty: ConteurDifficulty) => {
    try {
      await updateParentSettings({ preferredDifficulty: difficulty });
      await loadData();
      Haptics.selectionAsync();
    } catch (error) {
      console.error('Error updating difficulty:', error);
    }
  }, [loadData]);

  const handleUpdateReadingMode = useCallback(async (mode: ReadingMode) => {
    try {
      await updateParentSettings({ defaultReadingMode: mode });
      await loadData();
      Haptics.selectionAsync();
    } catch (error) {
      console.error('Error updating reading mode:', error);
    }
  }, [loadData]);

  const handleResetData = useCallback(() => {
    Alert.alert(
      'Réinitialiser les données ?',
      'Cela effacera tout l\'historique et les enregistrements. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await loadData();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Erreur', 'Impossible de réinitialiser les données');
            }
          },
        },
      ]
    );
  }, [loadData]);

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} min`;
  };

  if (loading) {
    return (
      <PageContainer variant="neutral" safeAreaEdges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9B59B6" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="neutral" scrollable={false} safeAreaEdges={['top']}>
      {/* Header */}
      <ScreenHeader
        variant="parent"
        title="Espace Parent"
        onBack={handleBack}
      />

      {/* Tabs */}
      <Animated.View
        style={styles.tabsContainer}
        entering={shouldAnimate ? FadeInUp.delay(100).duration(getDuration(300)) : undefined}
      >
        {(['stats', 'recordings', 'settings'] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => handleTabChange(tab)}
            accessibilityLabel={
              tab === 'stats' ? 'Statistiques' :
              tab === 'recordings' ? 'Enregistrements' : 'Paramètres'
            }
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'stats' && `${Icons.chart} Statistiques`}
              {tab === 'recordings' && `${Icons.microphone} Enregistrements`}
              {tab === 'settings' && `${Icons.settings} Paramètres`}
            </Text>
          </Pressable>
        ))}
      </Animated.View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Tab */}
        {activeTab === 'stats' && dashboardData && (
          <Animated.View
            entering={shouldAnimate ? FadeInUp.duration(getDuration(300)) : undefined}
          >
            {/* Metrics Cards */}
            <View style={[styles.metricsRow, isTablet && styles.metricsRowTablet]}>
              <View style={[styles.metricCard, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.metricEmoji}>{Icons.book}</Text>
                <Text style={styles.metricValue}>{dashboardData.totalStoriesCompleted}</Text>
                <Text style={styles.metricLabel}>Histoires</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.metricEmoji}>{Icons.target}</Text>
                <Text style={styles.metricValue}>{dashboardData.averageScore}%</Text>
                <Text style={styles.metricLabel}>Réussite</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.metricEmoji}>{Icons.timer}</Text>
                <Text style={styles.metricValue}>{formatTime(dashboardData.totalReadingTime)}</Text>
                <Text style={styles.metricLabel}>Lecture</Text>
              </View>
            </View>

            {/* Radar Chart */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{Icons.chart} Compétences</Text>
              <View style={styles.radarContainer}>
                <RadarChart
                  data={dashboardData.competencyScores}
                  size={isTablet ? 280 : 220}
                  animated={shouldAnimate}
                />
              </View>
              <Text style={styles.radarHint}>
                Les compétences sont calculées selon les types de questions répondues
              </Text>
            </View>

            {/* Recent Sessions */}
            {dashboardData.recentSessions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{Icons.calendar} Dernières sessions</Text>
                {dashboardData.recentSessions.slice(0, 5).map((session, index) => (
                  <View key={session.id} style={styles.sessionCard}>
                    <Text style={styles.sessionEmoji}>{session.storyEmoji}</Text>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionTitle} numberOfLines={1}>
                        {session.storyTitle}
                      </Text>
                      <Text style={styles.sessionMeta}>
                        {new Date(session.date).toLocaleDateString('fr-FR')} • {session.scorePercent}%
                      </Text>
                    </View>
                    <View style={styles.sessionStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text
                          key={star}
                          style={[styles.sessionStar, star > session.stars && styles.sessionStarEmpty]}
                        >
                          {Icons.star}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Empty state */}
            {dashboardData.totalStoriesCompleted === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>{Icons.book}</Text>
                <Text style={styles.emptyTitle}>Aucune donnée</Text>
                <Text style={styles.emptyText}>
                  Les statistiques apparaîtront après que votre enfant aura complété des histoires
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Recordings Tab */}
        {activeTab === 'recordings' && dashboardData && (
          <Animated.View
            entering={shouldAnimate ? FadeInUp.duration(getDuration(300)) : undefined}
            style={styles.recordingsSection}
          >
            <Text style={styles.sectionTitle}>{Icons.microphone} Productions orales</Text>
            <Text style={styles.sectionSubtitle}>
              Écoutez les reformulations de votre enfant après chaque histoire
            </Text>
            <RecordingsList
              recordings={dashboardData.recordings}
              onDelete={handleDeleteRecording}
            />
          </Animated.View>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && dashboardData && (
          <Animated.View
            entering={shouldAnimate ? FadeInUp.duration(getDuration(300)) : undefined}
          >
            {/* Difficulty Setting */}
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>{Icons.settings} Niveau de difficulté</Text>
              <Text style={styles.settingDescription}>
                Ajuste la complexité des histoires et des questions
              </Text>
              <View style={styles.settingOptions}>
                {([1, 2, 3] as ConteurDifficulty[]).map((difficulty) => (
                  <Pressable
                    key={difficulty}
                    style={[
                      styles.settingOption,
                      dashboardData.settings.preferredDifficulty === difficulty &&
                        styles.settingOptionActive,
                    ]}
                    onPress={() => handleUpdateDifficulty(difficulty)}
                    accessibilityLabel={`Difficulté ${DIFFICULTY_LABELS[difficulty]}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: dashboardData.settings.preferredDifficulty === difficulty }}
                  >
                    <Text
                      style={[
                        styles.settingOptionText,
                        dashboardData.settings.preferredDifficulty === difficulty &&
                          styles.settingOptionTextActive,
                      ]}
                    >
                      {DIFFICULTY_LABELS[difficulty]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Reading Mode Setting */}
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>{Icons.book} Mode de lecture par défaut</Text>
              <Text style={styles.settingDescription}>
                Le mode suggéré lors du choix d'une histoire
              </Text>
              <View style={styles.settingOptions}>
                {(['listen', 'read', 'mixed'] as ReadingMode[]).map((mode) => (
                  <Pressable
                    key={mode}
                    style={[
                      styles.settingOption,
                      dashboardData.settings.defaultReadingMode === mode &&
                        styles.settingOptionActive,
                    ]}
                    onPress={() => handleUpdateReadingMode(mode)}
                    accessibilityLabel={`Mode ${MODE_LABELS[mode].label}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: dashboardData.settings.defaultReadingMode === mode }}
                  >
                    <Text style={styles.settingOptionEmoji}>
                      {MODE_LABELS[mode].emoji}
                    </Text>
                    <Text
                      style={[
                        styles.settingOptionText,
                        dashboardData.settings.defaultReadingMode === mode &&
                          styles.settingOptionTextActive,
                      ]}
                    >
                      {MODE_LABELS[mode].label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Reset Data */}
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>{Icons.trash} Réinitialiser</Text>
              <Text style={styles.settingDescription}>
                Efface tout l'historique et les enregistrements
              </Text>
              <Pressable
                style={styles.resetButton}
                onPress={handleResetData}
                accessibilityLabel="Réinitialiser toutes les données"
                accessibilityRole="button"
              >
                <Text style={styles.resetButtonText}>Réinitialiser les données</Text>
              </Pressable>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>À propos de l'Espace Parent</Text>
              <Text style={styles.infoText}>
                Cet espace vous permet de suivre les progrès de votre enfant en lecture et
                compréhension. Les compétences sont évaluées à travers 6 catégories : factuel,
                séquentiel, causal, émotionnel, inférentiel et opinion.
              </Text>
              <Text style={styles.infoText}>
                Vous pouvez écouter les productions orales de votre enfant après chaque histoire,
                ce qui vous permet de mesurer ses progrès dans la reformulation.
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing[3],
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: '#718096',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[2],
  },
  tab: {
    flex: 1,
    minHeight: touchTargets.minimum,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  tabActive: {
    backgroundColor: '#9B59B6',
  },
  tabText: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: '#718096',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },

  // Metrics
  metricsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  metricsRowTablet: {
    gap: spacing[4],
  },
  metricCard: {
    flex: 1,
    minHeight: touchTargets.minimum,
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  metricEmoji: {
    fontSize: 28,
    marginBottom: spacing[2],
  },
  metricValue: {
    fontSize: 24,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
  },
  metricLabel: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: '#718096',
    marginTop: spacing[1],
  },

  // Section
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    marginBottom: spacing[3],
  },
  sectionSubtitle: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: '#718096',
    marginBottom: spacing[4],
  },

  // Radar
  radarContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    ...shadows.md,
  },
  radarHint: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: '#718096',
    textAlign: 'center',
    marginTop: spacing[3],
    fontStyle: 'italic',
  },

  // Sessions
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginBottom: spacing[2],
    minHeight: touchTargets.minimum,
    ...shadows.sm,
  },
  sessionEmoji: {
    fontSize: 32,
    marginRight: spacing[3],
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#2D3748',
  },
  sessionMeta: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: '#718096',
    marginTop: spacing[1],
  },
  sessionStars: {
    flexDirection: 'row',
  },
  sessionStar: {
    fontSize: 18,
  },
  sessionStarEmpty: {
    opacity: 0.3,
  },

  // Recordings section
  recordingsSection: {
    flex: 1,
  },

  // Settings
  settingSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    marginBottom: spacing[4],
    ...shadows.sm,
  },
  settingTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#2D3748',
    marginBottom: spacing[1],
  },
  settingDescription: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: '#718096',
    marginBottom: spacing[3],
  },
  settingOptions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  settingOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTargets.minimum,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.lg,
    backgroundColor: '#F5F5F5',
    gap: spacing[1],
  },
  settingOptionActive: {
    backgroundColor: '#9B59B6',
  },
  settingOptionEmoji: {
    fontSize: 18,
  },
  settingOptionText: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: '#4A5568',
  },
  settingOptionTextActive: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
  },
  resetButton: {
    minHeight: touchTargets.minimum,
    backgroundColor: '#FFEBEE',
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  resetButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: '#E74C3C',
  },

  // Info
  infoSection: {
    backgroundColor: 'rgba(155,89,182,0.05)',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    marginTop: spacing[4],
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#9B59B6',
    marginBottom: spacing[2],
  },
  infoText: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: '#718096',
    lineHeight: 26,
    marginBottom: spacing[2],
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing[3],
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#2D3748',
    marginBottom: spacing[2],
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: '#718096',
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
});

export default ConteurParentScreen;
