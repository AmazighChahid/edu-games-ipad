/**
 * Hanoi intro screen
 * Shows rules and lets the child select a level
 */

import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '@/theme';
import { Button } from '@/components/common';
import { hanoiLevels } from '../data/levels';
import type { HanoiLevelConfig } from '../types';

export function HanoiIntroScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedLevel, setSelectedLevel] = useState<HanoiLevelConfig>(hanoiLevels[0]);

  const handlePlay = () => {
    router.push({
      pathname: '/(games)/hanoi/play',
      params: { levelId: selectedLevel.id },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return colors.feedback.success;
      case 'medium':
        return colors.feedback.warning;
      case 'hard':
        return colors.feedback.error;
      default:
        return colors.text.secondary;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return t('common.easy');
      case 'medium':
        return t('common.medium');
      case 'hard':
        return t('common.hard');
      default:
        return difficulty;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[4],
          paddingBottom: insets.bottom + spacing[4],
          paddingLeft: insets.left + spacing[6],
          paddingRight: insets.right + spacing[6],
        },
      ]}
    >
      <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{t('games.hanoi.name')}</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <View style={styles.mainContent}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.rulesCard}>
          <View style={styles.illustration}>
            <Text style={styles.illustrationEmoji}>🗼</Text>
          </View>

          <View style={styles.rules}>
            <Animated.View entering={FadeInUp.delay(300)} style={styles.rule}>
              <Text style={styles.ruleNumber}>1</Text>
              <Text style={styles.ruleText}>{t('games.hanoi.intro.goal')}</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400)} style={styles.rule}>
              <Text style={styles.ruleNumber}>2</Text>
              <Text style={styles.ruleText}>{t('games.hanoi.intro.rule1')}</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500)} style={styles.rule}>
              <Text style={styles.ruleNumber}>3</Text>
              <Text style={styles.ruleText}>{t('games.hanoi.intro.rule2')}</Text>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.levelsSection}>
          <Text style={styles.sectionTitle}>{t('games.hanoi.intro.selectLevel')}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.levelsScroll}
          >
            {hanoiLevels.map((level, index) => (
              <Animated.View
                key={level.id}
                entering={FadeInUp.delay(400 + index * 100)}
              >
                <Pressable
                  onPress={() => setSelectedLevel(level)}
                  style={[
                    styles.levelCard,
                    selectedLevel.id === level.id && styles.levelCardSelected,
                  ]}
                >
                  <View style={styles.levelHeader}>
                    <Text style={styles.levelNumber}>{level.displayOrder}</Text>
                    <View
                      style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(level.difficulty) },
                      ]}
                    >
                      <Text style={styles.difficultyText}>
                        {getDifficultyLabel(level.difficulty)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.levelDisks}>
                    {Array.from({ length: level.diskCount }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.diskPreview,
                          {
                            width: 20 + (level.diskCount - i) * 8,
                            backgroundColor: colors.game[`disk${(i % 5) + 1}` as keyof typeof colors.game],
                          },
                        ]}
                      />
                    ))}
                  </View>

                  <Text style={styles.levelDisksCount}>
                    {level.diskCount} {t('games.hanoi.disks')}
                  </Text>
                  <Text style={styles.levelOptimal}>
                    {t('games.hanoi.minMoves')}: {level.optimalMoves}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(800)} style={styles.buttonContainer}>
        <Button
          onPress={handlePlay}
          label={t('games.hanoi.intro.letsGo')}
          size="large"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.game,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  backButton: {
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: colors.text.primary,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: touchTargets.medium,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing[6],
  },
  rulesCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  illustration: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  illustrationEmoji: {
    fontSize: 40,
  },
  rules: {
    width: '100%',
    gap: spacing[3],
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.background.secondary,
    padding: spacing[3],
    borderRadius: borderRadius.lg,
  },
  ruleNumber: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary.main,
    color: colors.primary.contrast,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    overflow: 'hidden',
  },
  ruleText: {
    ...textStyles.bodySmall,
    color: colors.text.primary,
    flex: 1,
  },
  levelsSection: {
    flex: 1.2,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  levelsScroll: {
    gap: spacing[3],
    paddingRight: spacing[4],
  },
  levelCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    width: 140,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    ...shadows.md,
  },
  levelCardSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing[3],
  },
  levelNumber: {
    ...textStyles.h2,
    color: colors.text.primary,
  },
  difficultyBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  difficultyText: {
    ...textStyles.caption,
    color: colors.text.inverse,
    fontWeight: 'bold',
  },
  levelDisks: {
    alignItems: 'center',
    gap: 3,
    marginBottom: spacing[2],
    height: 60,
    justifyContent: 'flex-end',
  },
  diskPreview: {
    height: 8,
    borderRadius: borderRadius.sm,
  },
  levelDisksCount: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  levelOptimal: {
    ...textStyles.caption,
    color: colors.text.muted,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: spacing[4],
  },
});
