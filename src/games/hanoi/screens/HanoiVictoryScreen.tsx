/**
 * Hanoi victory screen
 * Celebration screen after winning
 */

import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows } from '@/theme';
import { Button } from '@/components/common';
import { useStore } from '@/store/useStore';

export function HanoiVictoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const recentSessions = useStore((state) => state.recentSessions);

  const lastSession = recentSessions.find((s) => s.gameId === 'hanoi');
  const moveCount = lastSession?.moveCount ?? 0;

  const handlePlayAgain = () => {
    router.replace('/(games)/hanoi/play');
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[6],
          paddingBottom: insets.bottom + spacing[6],
          paddingLeft: insets.left + spacing[8],
          paddingRight: insets.right + spacing[8],
        },
      ]}
    >
      <View style={styles.content}>
        <Animated.View entering={ZoomIn.delay(200)} style={styles.emojiContainer}>
          <Text style={styles.emoji}>🎉</Text>
        </Animated.View>

        <Animated.Text entering={FadeIn.delay(400)} style={styles.title}>
          {t('games.hanoi.victory.congratulations')}
        </Animated.Text>

        <Animated.Text entering={FadeIn.delay(600)} style={styles.subtitle}>
          {t('games.hanoi.victory.youDidIt')}
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(800)} style={styles.statsCard}>
          <Text style={styles.statsLabel}>{t('common.moves')}</Text>
          <Text style={styles.statsValue}>{moveCount}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1000)} style={styles.buttons}>
          <Button
            onPress={handlePlayAgain}
            label={t('games.hanoi.victory.playAgain')}
            size="large"
          />
          <Button
            onPress={handleHome}
            label={t('games.hanoi.victory.backHome')}
            variant="ghost"
            size="large"
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.game,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    ...shadows.lg,
  },
  emoji: {
    fontSize: 60,
  },
  title: {
    ...textStyles.gameTitle,
    color: colors.primary.main,
    marginBottom: spacing[2],
  },
  subtitle: {
    ...textStyles.h2,
    color: colors.text.secondary,
    marginBottom: spacing[8],
  },
  statsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    alignItems: 'center',
    marginBottom: spacing[8],
    ...shadows.md,
  },
  statsLabel: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  statsValue: {
    ...textStyles.gameTitle,
    color: colors.primary.main,
  },
  buttons: {
    gap: spacing[4],
    alignItems: 'center',
  },
});
