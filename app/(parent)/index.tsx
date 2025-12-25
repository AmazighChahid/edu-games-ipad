import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, textStyles, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store/useStore';
import { gameRegistry } from '@/games/registry';

export default function ParentDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const gameProgress = useStore((state) => state.gameProgress);

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[4],
          paddingLeft: insets.left + spacing[6],
          paddingRight: insets.right + spacing[6],
        },
      ]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('parent.title')}</Text>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('parent.progress.title')}</Text>

        {gameRegistry.map((game) => {
          const progress = gameProgress[game.id];
          const completedCount = progress
            ? Object.keys(progress.completedLevels).length
            : 0;
          const totalTime = progress?.totalPlayTimeMinutes || 0;

          return (
            <View key={game.id} style={styles.progressCard}>
              <Text style={styles.gameName}>{t(game.nameKey)}</Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{completedCount}</Text>
                  <Text style={styles.statLabel}>{t('parent.progress.gamesPlayed')}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{totalTime} min</Text>
                  <Text style={styles.statLabel}>{t('parent.progress.totalTime')}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('parent.about.title')}</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>{t('parent.about.hanoiDescription')}</Text>
          <Text style={styles.skillsTitle}>{t('parent.about.skills')}</Text>
          <View style={styles.skillsList}>
            <Text style={styles.skill}>• {t('parent.about.skillPlanning')}</Text>
            <Text style={styles.skill}>• {t('parent.about.skillProblemSolving')}</Text>
            <Text style={styles.skill}>• {t('parent.about.skillSequencing')}</Text>
            <Text style={styles.skill}>• {t('parent.about.skillPerseverance')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingBottom: spacing[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  title: {
    ...textStyles.h1,
    color: colors.text.primary,
  },
  backButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    ...textStyles.button,
    color: colors.primary.contrast,
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
  gameName: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[8],
  },
  stat: {
    alignItems: 'flex-start',
  },
  statValue: {
    ...textStyles.h2,
    color: colors.primary.main,
  },
  statLabel: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
  },
  aboutCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    ...shadows.md,
  },
  aboutText: {
    ...textStyles.body,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  skillsTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  skillsList: {
    gap: spacing[1],
  },
  skill: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
});
