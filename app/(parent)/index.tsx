import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, textStyles, borderRadius, shadows } from '@/theme';
import { ScreenHeader, PageContainer } from '@/components/common';
import { useStore } from '@/store/useStore';
import { gameRegistry } from '@/games/registry';
import { ProgressChart } from '@/components/parent/ProgressChart';
import { SkillsRadar } from '@/components/parent/SkillsRadar';

export default function ParentDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const gameProgress = useStore((state) => state.gameProgress);

  const handleBack = () => {
    router.back();
  };

  // Calculate overall stats
  const totalGamesPlayed = Object.values(gameProgress).reduce(
    (sum, progress) => sum + Object.keys(progress.completedLevels).length,
    0
  );

  const totalPlayTime = Object.values(gameProgress).reduce(
    (sum, progress) => sum + progress.totalPlayTimeMinutes,
    0
  );

  // Prepare data for ProgressChart
  const gamesProgressData = gameRegistry
    .filter((game) => game.status === 'available')
    .map((game) => {
      const progress = gameProgress[game.id];
      const completedCount = progress ? Object.keys(progress.completedLevels).length : 0;
      return {
        label: game.name,
        value: completedCount,
        maxValue: 10, // Assuming 10 levels per game
        color: getCategoryColor(game.category),
      };
    });

  // Prepare skills data
  const skillsData = [
    { name: 'Logique', level: Math.min(Math.floor(totalGamesPlayed / 5), 5), color: colors.primary.main },
    { name: 'Résolution', level: Math.min(Math.floor(totalGamesPlayed / 6), 5), color: colors.secondary.main },
    { name: 'Concentration', level: Math.min(Math.floor(totalPlayTime / 30), 5), color: colors.feedback.success },
    { name: 'Persévérance', level: Math.min(Math.floor(totalGamesPlayed / 8), 5), color: colors.game.disk3 },
  ];

  return (
    <PageContainer variant="parent" scrollable>
      {/* Header standardisé ✅ */}
      <ScreenHeader
        variant="parent"
        title={t('parent.title')}
        onBack={handleBack}
      />

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Tableau de bord</Text>
      </View>

      {/* Overall Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>📊 Statistiques Globales</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{totalGamesPlayed}</Text>
            <Text style={styles.statBoxLabel}>Niveaux complétés</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{Math.floor(totalPlayTime)} min</Text>
            <Text style={styles.statBoxLabel}>Temps de jeu</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{Object.keys(gameProgress).length}</Text>
            <Text style={styles.statBoxLabel}>Jeux essayés</Text>
          </View>
        </View>
      </View>

      {/* Skills Development */}
      <View style={styles.section}>
        <SkillsRadar skills={skillsData} />
      </View>

      {/* Progress by Game */}
      <View style={styles.section}>
        <ProgressChart data={gamesProgressData} title="Progression par Jeu" />
      </View>

      {/* Detailed Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails par Activité</Text>

        {gameRegistry
          .filter((game) => game.status === 'available')
          .map((game) => {
            const progress = gameProgress[game.id];
            const completedCount = progress ? Object.keys(progress.completedLevels).length : 0;
            const totalTime = progress?.totalPlayTimeMinutes || 0;
            const avgTime = completedCount > 0 ? (totalTime / completedCount).toFixed(1) : 0;

            return (
              <View key={game.id} style={styles.progressCard}>
                <View style={styles.progressCardHeader}>
                  <Text style={styles.gameName}>{t(game.nameKey)}</Text>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(game.category) },
                    ]}
                  >
                    <Text style={styles.categoryBadgeText}>{game.category}</Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{completedCount}</Text>
                    <Text style={styles.statLabel}>Niveaux</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{totalTime.toFixed(0)} min</Text>
                    <Text style={styles.statLabel}>Temps total</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{avgTime} min</Text>
                    <Text style={styles.statLabel}>Temps moyen</Text>
                  </View>
                </View>

                {/* Skills for this game */}
                <View style={styles.gameSkills}>
                  {game.skills.slice(0, 3).map((skill, index) => (
                    <Text key={index} style={styles.gameSkillTag}>
                      {skill.replace('_', ' ')}
                    </Text>
                  ))}
                </View>
              </View>
            );
          })}
      </View>

      {/* Pedagogical Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos de l'approche Montessori</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>
            Cette application suit les principes Montessori : apprentissage par la manipulation,
            auto-correction, progression à son rythme, et feedback bienveillant.
          </Text>
          <Text style={styles.aboutText}>
            Les activités développent la logique, la résolution de problèmes, et la persévérance
            sans stress ni compétition.
          </Text>
        </View>
      </View>
    </PageContainer>
  );
}

function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    logic: colors.home.categoryLogic,
    spatial: colors.home.categorySpatial,
    math: colors.home.categoryNumbers,
    memory: colors.home.categoryMemory,
    language: colors.home.categoryLanguage,
  };
  return categoryColors[category] || colors.primary.main;
}

const styles = StyleSheet.create({
  subtitleContainer: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[4],
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  statsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    marginBottom: spacing[6],
    ...shadows.lg,
  },
  statsCardTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    alignItems: 'center',
  },
  statBoxValue: {
    ...textStyles.h2,
    color: colors.primary.main,
    marginBottom: spacing[1],
  },
  statBoxLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  progressCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    marginBottom: spacing[4],
    ...shadows.md,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  gameName: {
    ...textStyles.h3,
    color: colors.text.primary,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  categoryBadgeText: {
    ...textStyles.caption,
    color: colors.text.inverse,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[6],
    marginBottom: spacing[3],
  },
  stat: {
    alignItems: 'flex-start',
  },
  statValue: {
    ...textStyles.h3,
    color: colors.primary.main,
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  gameSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  gameSkillTag: {
    ...textStyles.caption,
    backgroundColor: colors.background.secondary,
    color: colors.text.secondary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  aboutCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    ...shadows.md,
    gap: spacing[3],
  },
  aboutText: {
    ...textStyles.body,
    color: colors.text.primary,
    lineHeight: 24,
  },
});
