/**
 * Calcul Posé Victory Screen
 * Celebration screen after completing a level
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, textStyles, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store/useStore';

export function CalculPoseVictoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { hapticEnabled } = useStore();

  // Animations
  const starScale1 = useSharedValue(0);
  const starScale2 = useSharedValue(0);
  const starScale3 = useSharedValue(0);
  const trophyBounce = useSharedValue(0);
  const confettiRotation = useSharedValue(0);

  useEffect(() => {
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Trophy bounce
    trophyBounce.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 500, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );

    // Stars pop in sequence
    starScale1.value = withDelay(300, withSpringValue(1));
    starScale2.value = withDelay(500, withSpringValue(1));
    starScale3.value = withDelay(700, withSpringValue(1));

    // Confetti rotation
    confettiRotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1
    );
  }, []);

  const withSpringValue = (toValue: number) =>
    withSequence(
      withTiming(toValue * 1.3, { duration: 200 }),
      withTiming(toValue, { duration: 150 })
    );

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: trophyBounce.value }],
  }));

  const star1Style = useAnimatedStyle(() => ({
    transform: [{ scale: starScale1.value }],
  }));

  const star2Style = useAnimatedStyle(() => ({
    transform: [{ scale: starScale2.value }],
  }));

  const star3Style = useAnimatedStyle(() => ({
    transform: [{ scale: starScale3.value }],
  }));

  const handlePlayAgain = () => {
    router.replace('/(games)/calcul-pose');
  };

  const handleHome = () => {
    router.replace('/');
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[6],
          paddingBottom: insets.bottom + spacing[6],
        },
      ]}
    >
      {/* Stars */}
      <View style={styles.starsContainer}>
        <Animated.Text style={[styles.star, styles.starLeft, star1Style]}>
          ⭐
        </Animated.Text>
        <Animated.Text style={[styles.star, styles.starCenter, star2Style]}>
          ⭐
        </Animated.Text>
        <Animated.Text style={[styles.star, styles.starRight, star3Style]}>
          ⭐
        </Animated.Text>
      </View>

      {/* Trophy */}
      <Animated.View style={[styles.trophyContainer, trophyStyle]}>
        <Text style={styles.trophy}>🏆</Text>
      </Animated.View>

      {/* Message */}
      <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.messageContainer}>
        <Text style={styles.title}>Félicitations !</Text>
        <Text style={styles.subtitle}>Tu as réussi tous les calculs !</Text>
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeIn.delay(600).duration(500)} style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>✏️</Text>
          <Text style={styles.statLabel}>Super travail !</Text>
        </View>
      </Animated.View>

      {/* Buttons */}
      <Animated.View entering={FadeIn.delay(800).duration(500)} style={styles.buttonsContainer}>
        <Pressable
          onPress={handlePlayAgain}
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonIcon}>🔄</Text>
          <Text style={styles.primaryButtonText}>Rejouer</Text>
        </Pressable>

        <Pressable
          onPress={handleHome}
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonIcon}>🏠</Text>
          <Text style={styles.secondaryButtonText}>Accueil</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.game,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: spacing[4],
    height: 80,
  },
  star: {
    fontSize: 50,
  },
  starLeft: {
    marginRight: -10,
    marginBottom: 10,
  },
  starCenter: {
    fontSize: 60,
    zIndex: 1,
  },
  starRight: {
    marginLeft: -10,
    marginBottom: 10,
  },
  trophyContainer: {
    marginBottom: spacing[6],
  },
  trophy: {
    fontSize: 100,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  title: {
    ...textStyles.gameTitle,
    color: colors.secondary.main,
    marginBottom: spacing[2],
  },
  subtitle: {
    ...textStyles.h3,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: colors.background.card,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderRadius: borderRadius.xl,
    marginBottom: spacing[8],
    ...shadows.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  statEmoji: {
    fontSize: 28,
  },
  statLabel: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
    ...shadows.md,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
  },
  secondaryButton: {
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.ui.border,
  },
  buttonIcon: {
    fontSize: 20,
  },
  primaryButtonText: {
    ...textStyles.body,
    color: colors.primary.contrast,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
});
