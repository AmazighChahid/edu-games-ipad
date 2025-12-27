/**
 * Hanoi victory screen
 * Celebration screen after winning
 * Specs: 02-ux-flow.md - Écran D (Fin de niveau)
 * - Valoriser effort + proposer suite
 * - "Bravo !" + "Tu as réussi."
 * - Boutons: Rejouer / Niveau suivant
 * - Option badge non-compétitif
 * - Card unlock animation when applicable
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  BounceIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows } from '../../../theme';
import { Button } from '../../../components/common';
import { useStore, useCollection } from '../../../store';
import { hanoiLevels } from '../data/levels';
import { CardUnlockScreen } from '../../../components/collection';
import { useCardUnlock } from '../../../hooks/useCardUnlock';

// Badges non-compétitifs (spec 05-parent-space.md)
const getBadge = (moveCount: number, optimalMoves: number, hintsUsed: number): { icon: string; label: string } => {
  const efficiency = moveCount / optimalMoves;

  if (hintsUsed === 0 && efficiency <= 1.5) {
    return { icon: '🧠', label: 'Stratège' };
  } else if (efficiency <= 1.2) {
    return { icon: '⭐', label: 'Efficace' };
  } else if (hintsUsed >= 3) {
    return { icon: '💪', label: 'Persévérant' };
  } else {
    return { icon: '🌟', label: 'Calme' };
  }
};

export function HanoiVictoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const recentSessions = useStore((state) => state.recentSessions);
  const { getUnlockedCardsCount } = useCollection();

  const lastSession = recentSessions.find((s) => s.gameId === 'hanoi');
  const moveCount = lastSession?.moveCount ?? 0;
  const hintsUsed = lastSession?.hintsUsed ?? 0;
  const levelId = lastSession?.levelId;

  // Find current level and next level
  const currentLevel = hanoiLevels.find((l) => l.id === levelId) ?? hanoiLevels[0];
  const currentIndex = hanoiLevels.findIndex((l) => l.id === levelId);
  const nextLevel = currentIndex < hanoiLevels.length - 1 ? hanoiLevels[currentIndex + 1] : null;

  const badge = getBadge(moveCount, currentLevel.optimalMoves ?? 7, hintsUsed);

  // Check if performance was optimal
  const isOptimal = moveCount <= (currentLevel.optimalMoves ?? 7);

  // Card unlock system
  const {
    unlockedCard,
    showUnlockAnimation,
    checkAndUnlockCard,
    dismissUnlockAnimation,
  } = useCardUnlock({
    gameId: 'hanoi',
    levelId: levelId ?? 'level_1',
    levelNumber: currentLevel.diskCount ?? 3,
    isOptimal,
  });

  // Check for card unlock on mount
  const [hasCheckedUnlock, setHasCheckedUnlock] = useState(false);

  useEffect(() => {
    if (!hasCheckedUnlock) {
      // Delay the check to let victory animation play first
      const timer = setTimeout(() => {
        checkAndUnlockCard();
        setHasCheckedUnlock(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasCheckedUnlock, checkAndUnlockCard]);

  // Confetti animation
  const confettiScale = useSharedValue(0);
  const confettiRotate = useSharedValue(0);

  useEffect(() => {
    confettiScale.value = withDelay(
      300,
      withSequence(
        withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 200 })
      )
    );
    confettiRotate.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const confettiStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: confettiScale.value },
      { rotate: `${confettiRotate.value}deg` },
    ],
  }));

  const handlePlayAgain = () => {
    router.replace('/(games)/01-hanoi');
  };

  const handleNextLevel = () => {
    if (nextLevel) {
      router.replace('/(games)/01-hanoi');
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleViewCollection = () => {
    dismissUnlockAnimation();
    router.push('/(games)/collection');
  };

  const handleContinueAfterUnlock = () => {
    dismissUnlockAnimation();
  };

  // Show card unlock animation if a card was unlocked
  if (showUnlockAnimation && unlockedCard) {
    return (
      <CardUnlockScreen
        card={unlockedCard}
        unlockedCount={getUnlockedCardsCount()}
        onViewCollection={handleViewCollection}
        onContinue={handleContinueAfterUnlock}
      />
    );
  }

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
        {/* Confetti decoration */}
        <Animated.View style={[styles.confettiContainer, confettiStyle]}>
          <Text style={styles.confetti}>🎊</Text>
        </Animated.View>

        {/* Main celebration */}
        <Animated.View entering={ZoomIn.delay(200)} style={styles.emojiContainer}>
          <Text style={styles.emoji}>🎉</Text>
        </Animated.View>

        <Animated.Text entering={FadeIn.delay(400)} style={styles.title}>
          Bravo !
        </Animated.Text>

        <Animated.Text entering={FadeIn.delay(600)} style={styles.subtitle}>
          Tu as réussi !
        </Animated.Text>

        {/* Stats card with effort-focused metrics */}
        <Animated.View entering={FadeInDown.delay(800)} style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statsLabel}>Coups</Text>
              <Text style={styles.statsValue}>{moveCount}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statsLabel}>Optimal</Text>
              <Text style={styles.statsOptimal}>{currentLevel.optimalMoves}</Text>
            </View>
          </View>

          {/* Non-competitive badge */}
          <Animated.View entering={BounceIn.delay(1200)} style={styles.badgeContainer}>
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
            <Text style={styles.badgeLabel}>{badge.label}</Text>
          </Animated.View>
        </Animated.View>

        {/* Action buttons */}
        <Animated.View entering={FadeInDown.delay(1000)} style={styles.buttons}>
          {/* Primary: Next level (if available) */}
          {nextLevel ? (
            <Button
              onPress={handleNextLevel}
              label={`Niveau suivant (${nextLevel.diskCount} disques)`}
              size="large"
            />
          ) : (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>Tous les niveaux terminés !</Text>
            </View>
          )}

          {/* Secondary: Replay */}
          <Pressable onPress={handlePlayAgain} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonIcon}>↻</Text>
            <Text style={styles.secondaryButtonText}>Rejouer ce niveau</Text>
          </Pressable>

          {/* Collection button */}
          <Pressable onPress={handleViewCollection} style={styles.collectionButton}>
            <Text style={styles.collectionButtonIcon}>📚</Text>
            <Text style={styles.collectionButtonText}>Ma Collection</Text>
          </Pressable>

          {/* Tertiary: Home */}
          <Pressable onPress={handleHome} style={styles.tertiaryButton}>
            <Text style={styles.tertiaryButtonText}>Retour à l'accueil</Text>
          </Pressable>
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
  confettiContainer: {
    position: 'absolute',
    top: 40,
    right: 40,
  },
  confetti: {
    fontSize: 40,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    ...shadows.lg,
  },
  emoji: {
    fontSize: 60,
  },
  title: {
    ...textStyles.gameTitle,
    color: colors.primary.main,
    marginBottom: spacing[1],
  },
  subtitle: {
    ...textStyles.h2,
    color: colors.text.secondary,
    marginBottom: spacing[6],
  },
  statsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    alignItems: 'center',
    marginBottom: spacing[6],
    minWidth: 280,
    ...shadows.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.background.secondary,
  },
  statsLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },
  statsValue: {
    ...textStyles.gameTitle,
    color: colors.primary.main,
    fontSize: 36,
  },
  statsOptimal: {
    ...textStyles.h2,
    color: colors.feedback.success,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary.light,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.round,
    gap: spacing[2],
  },
  badgeIcon: {
    fontSize: 20,
  },
  badgeLabel: {
    ...textStyles.body,
    color: colors.secondary.dark,
    fontWeight: '600',
  },
  buttons: {
    gap: spacing[3],
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  completedBadge: {
    backgroundColor: colors.feedback.success,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.xl,
  },
  completedText: {
    ...textStyles.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
    borderWidth: 2,
    borderColor: colors.primary.main,
    ...shadows.sm,
  },
  secondaryButtonIcon: {
    fontSize: 18,
    color: colors.primary.main,
  },
  secondaryButtonText: {
    ...textStyles.body,
    color: colors.primary.main,
    fontWeight: '600',
  },
  tertiaryButton: {
    paddingVertical: spacing[2],
  },
  tertiaryButtonText: {
    ...textStyles.body,
    color: colors.text.muted,
    textDecorationLine: 'underline',
  },
  collectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(224, 86, 253, 0.1)',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    gap: spacing[2],
    borderWidth: 2,
    borderColor: '#E056FD',
  },
  collectionButtonIcon: {
    fontSize: 16,
  },
  collectionButtonText: {
    ...textStyles.body,
    color: '#E056FD',
    fontWeight: '600',
  },
});
