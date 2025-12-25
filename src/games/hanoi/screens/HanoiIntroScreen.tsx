/**
 * Hanoi intro screen
 * Shows rules and lets the child select a level
 * Specs: 02-ux-flow.md - Écran A (Start)
 * - Choix disques: 3/4/5
 * - Bouton Commencer + Démo (20s)
 * - Pictos règles avec voix/micro-texte
 */

import { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '@/theme';
import { Button } from '@/components/common';
import { hanoiLevels } from '../data/levels';
import type { HanoiLevelConfig } from '../types';

// Picto icons for rules (accessible, no reading needed)
const RuleIcon = ({ type }: { type: 'goal' | 'oneAtTime' | 'noBigOnSmall' }) => {
  const icons: Record<string, { bg: string; symbol: string }> = {
    goal: { bg: colors.feedback.success, symbol: '→' },
    oneAtTime: { bg: colors.primary.main, symbol: '1' },
    noBigOnSmall: { bg: colors.feedback.error, symbol: '✕' },
  };
  const { bg, symbol } = icons[type];

  return (
    <View style={[styles.ruleIcon, { backgroundColor: bg }]}>
      <Text style={styles.ruleIconText}>{symbol}</Text>
    </View>
  );
};

// Mini demo animation state
interface DemoState {
  isPlaying: boolean;
  step: number;
}

export function HanoiIntroScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedLevel, setSelectedLevel] = useState<HanoiLevelConfig>(hanoiLevels[1]); // Default 3 disks
  const [demoState, setDemoState] = useState<DemoState>({ isPlaying: false, step: 0 });
  const demoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Demo animation values
  const demoDisk1Y = useSharedValue(0);
  const demoDisk1X = useSharedValue(0);
  const demoDisk2Y = useSharedValue(0);
  const demoDisk2X = useSharedValue(0);

  const handlePlay = () => {
    if (demoTimeoutRef.current) {
      clearTimeout(demoTimeoutRef.current);
    }
    router.push({
      pathname: '/(games)/hanoi/play',
      params: { levelId: selectedLevel.id },
    });
  };

  const handleBack = () => {
    if (demoTimeoutRef.current) {
      clearTimeout(demoTimeoutRef.current);
    }
    router.back();
  };

  // Demo: shows 2-3 moves slowly, then prompts "À toi"
  const handleDemo = useCallback(() => {
    if (demoState.isPlaying) return;

    setDemoState({ isPlaying: true, step: 0 });

    // Step 1: Move small disk (after 500ms)
    demoTimeoutRef.current = setTimeout(() => {
      demoDisk1Y.value = withSequence(
        withTiming(-40, { duration: 300, easing: Easing.out(Easing.quad) }),
        withTiming(-40, { duration: 200 })
      );
      demoDisk1X.value = withDelay(300, withTiming(60, { duration: 400 }));
      demoDisk1Y.value = withDelay(700, withTiming(0, { duration: 300 }));

      setDemoState({ isPlaying: true, step: 1 });
    }, 500);

    // Step 2: Move medium disk (after 2s)
    demoTimeoutRef.current = setTimeout(() => {
      demoDisk2Y.value = withSequence(
        withTiming(-40, { duration: 300, easing: Easing.out(Easing.quad) }),
        withTiming(-40, { duration: 200 })
      );
      demoDisk2X.value = withDelay(300, withTiming(120, { duration: 400 }));
      demoDisk2Y.value = withDelay(700, withTiming(0, { duration: 300 }));

      setDemoState({ isPlaying: true, step: 2 });
    }, 2000);

    // End demo after ~4s
    demoTimeoutRef.current = setTimeout(() => {
      setDemoState({ isPlaying: false, step: 0 });
      // Reset positions
      demoDisk1X.value = withTiming(0, { duration: 300 });
      demoDisk1Y.value = withTiming(0, { duration: 300 });
      demoDisk2X.value = withTiming(0, { duration: 300 });
      demoDisk2Y.value = withTiming(0, { duration: 300 });
    }, 4500);
  }, [demoState.isPlaying, demoDisk1X, demoDisk1Y, demoDisk2X, demoDisk2Y]);

  const demoDisk1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: demoDisk1X.value },
      { translateY: demoDisk1Y.value },
    ],
  }));

  const demoDisk2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: demoDisk2X.value },
      { translateY: demoDisk2Y.value },
    ],
  }));

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

  // Quick disk count selector (3/4/5 for 6-7 years core)
  const quickDiskCounts = [3, 4, 5];

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
        {/* Rules Card with pictos */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.rulesCard}>
          {/* Mini demo illustration */}
          <View style={styles.demoIllustration}>
            <View style={styles.miniTowers}>
              {/* Tower A */}
              <View style={styles.miniTower}>
                <View style={styles.miniPole} />
                <Animated.View style={[styles.miniDisk, styles.miniDiskSmall, demoDisk1Style]} />
                <Animated.View style={[styles.miniDisk, styles.miniDiskMedium, demoDisk2Style]} />
                <View style={[styles.miniDisk, styles.miniDiskLarge]} />
                <Text style={styles.towerLabel}>A</Text>
              </View>
              {/* Tower B */}
              <View style={styles.miniTower}>
                <View style={styles.miniPole} />
                <Text style={styles.towerLabel}>B</Text>
              </View>
              {/* Tower C - destination */}
              <View style={styles.miniTower}>
                <View style={[styles.miniPole, styles.miniPoleTarget]} />
                <Text style={[styles.towerLabel, styles.towerLabelTarget]}>C</Text>
              </View>
            </View>
            {demoState.isPlaying && demoState.step >= 1 && (
              <Animated.Text entering={FadeIn} style={styles.demoHint}>
                {demoState.step === 1 ? "D'abord, on bouge les petits..." : "On libère le grand disque !"}
              </Animated.Text>
            )}
          </View>

          {/* Rules with pictos - short phrases for voice + visual */}
          <View style={styles.rules}>
            <Animated.View entering={FadeInUp.delay(300)} style={styles.rule}>
              <RuleIcon type="goal" />
              <Text style={styles.ruleText}>
                Déplace la pile de <Text style={styles.ruleBold}>A</Text> vers <Text style={styles.ruleBold}>C</Text>
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400)} style={styles.rule}>
              <RuleIcon type="oneAtTime" />
              <Text style={styles.ruleText}>Un disque à la fois</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500)} style={styles.rule}>
              <RuleIcon type="noBigOnSmall" />
              <Text style={styles.ruleText}>Grand sur petit = interdit</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Quick disk selector + levels */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.levelsSection}>
          {/* Quick disk count buttons */}
          <Text style={styles.sectionTitle}>Nombre de disques</Text>
          <View style={styles.quickSelector}>
            {quickDiskCounts.map((count) => {
              const level = hanoiLevels.find((l) => l.diskCount === count);
              if (!level) return null;
              const isSelected = selectedLevel.diskCount === count;

              return (
                <Pressable
                  key={count}
                  onPress={() => setSelectedLevel(level)}
                  style={[
                    styles.quickButton,
                    isSelected && styles.quickButtonSelected,
                  ]}
                >
                  <Text style={[styles.quickButtonText, isSelected && styles.quickButtonTextSelected]}>
                    {count}
                  </Text>
                  {/* Mini disk stack preview */}
                  <View style={styles.quickDisks}>
                    {Array.from({ length: count }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.quickDisk,
                          {
                            width: 12 + (count - i) * 6,
                            backgroundColor: isSelected
                              ? colors.primary.contrast
                              : colors.game[`disk${(i % 5) + 1}` as keyof typeof colors.game],
                          },
                        ]}
                      />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* More levels scroll */}
          <Text style={styles.moreLevelsTitle}>Tous les niveaux</Text>
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
                    {level.diskCount} disques
                  </Text>
                  <Text style={styles.levelOptimal}>
                    Min: {level.optimalMoves} coups
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>

      {/* Bottom buttons: Demo + Play */}
      <Animated.View entering={FadeInUp.delay(800)} style={styles.buttonContainer}>
        <Pressable
          onPress={handleDemo}
          style={[styles.demoButton, demoState.isPlaying && styles.demoButtonActive]}
          disabled={demoState.isPlaying}
        >
          <Text style={styles.demoButtonIcon}>▶</Text>
          <Text style={styles.demoButtonText}>
            {demoState.isPlaying ? 'Démo en cours...' : 'Démo (20s)'}
          </Text>
        </Pressable>

        <Button
          onPress={handlePlay}
          label="Commencer"
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
    padding: spacing[5],
    justifyContent: 'space-between',
    ...shadows.lg,
  },
  demoIllustration: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  miniTowers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    height: 100,
    paddingBottom: spacing[2],
  },
  miniTower: {
    alignItems: 'center',
    width: 60,
  },
  miniPole: {
    position: 'absolute',
    bottom: 20,
    width: 6,
    height: 60,
    backgroundColor: colors.game.towerBase,
    borderRadius: 3,
  },
  miniPoleTarget: {
    backgroundColor: colors.feedback.success,
  },
  miniDisk: {
    height: 10,
    borderRadius: 5,
    marginBottom: 2,
  },
  miniDiskSmall: {
    width: 24,
    backgroundColor: colors.game.disk1,
    zIndex: 3,
  },
  miniDiskMedium: {
    width: 36,
    backgroundColor: colors.game.disk2,
    zIndex: 2,
  },
  miniDiskLarge: {
    width: 48,
    backgroundColor: colors.game.disk3,
    zIndex: 1,
  },
  towerLabel: {
    marginTop: spacing[1],
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  towerLabelTarget: {
    color: colors.feedback.success,
  },
  demoHint: {
    marginTop: spacing[2],
    fontSize: 14,
    color: colors.primary.main,
    fontStyle: 'italic',
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
  ruleIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleIconText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ruleText: {
    ...textStyles.body,
    color: colors.text.primary,
    flex: 1,
  },
  ruleBold: {
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  levelsSection: {
    flex: 1.2,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  quickSelector: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  quickButton: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[3],
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    ...shadows.md,
  },
  quickButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main,
  },
  quickButtonText: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  quickButtonTextSelected: {
    color: colors.primary.contrast,
  },
  quickDisks: {
    alignItems: 'center',
    gap: 2,
  },
  quickDisk: {
    height: 6,
    borderRadius: 3,
  },
  moreLevelsTitle: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  levelsScroll: {
    gap: spacing[3],
    paddingRight: spacing[4],
  },
  levelCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    width: 130,
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
    ...textStyles.h3,
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
    height: 50,
    justifyContent: 'flex-end',
  },
  diskPreview: {
    height: 7,
    borderRadius: borderRadius.sm,
  },
  levelDisksCount: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  levelOptimal: {
    ...textStyles.caption,
    color: colors.text.muted,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    paddingTop: spacing[4],
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
    borderWidth: 2,
    borderColor: colors.primary.main,
    ...shadows.md,
  },
  demoButtonActive: {
    backgroundColor: colors.primary.light,
  },
  demoButtonIcon: {
    fontSize: 16,
    color: colors.primary.main,
  },
  demoButtonText: {
    ...textStyles.body,
    color: colors.primary.main,
    fontWeight: '600',
  },
});
