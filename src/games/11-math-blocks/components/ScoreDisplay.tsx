/**
 * ScoreDisplay component
 * Shows score, combo, and progress
 */

import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { colors, borderRadius, spacing } from '../../../theme';

interface ScoreDisplayProps {
  score: number;
  combo: number;
  matchesFound: number;
  totalPairs: number;
}

export function ScoreDisplay({
  score,
  combo,
  matchesFound,
  totalPairs,
}: ScoreDisplayProps) {
  const comboScale = useSharedValue(1);

  // Animate combo when it increases
  useEffect(() => {
    if (combo > 0) {
      comboScale.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [combo]);

  const comboAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Score */}
      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      {/* Combo */}
      {combo > 1 && (
        <Animated.View style={[styles.comboBox, comboAnimatedStyle]}>
          <Text style={styles.comboText}>Combo x{combo}!</Text>
        </Animated.View>
      )}

      {/* Progress */}
      <View style={styles.progressBox}>
        <Text style={styles.progressLabel}>Paires</Text>
        <Text style={styles.progressValue}>
          {matchesFound} / {totalPairs}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[3],
  },
  scoreBox: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minWidth: 100,
  },
  scoreLabel: {
    fontSize: 14, // Amélioré (était 12) - label secondaire
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  comboBox: {
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
  },
  comboText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  progressBox: {
    backgroundColor: colors.background.card,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  progressLabel: {
    fontSize: 14, // Amélioré (était 12) - label secondaire
    color: colors.text.muted,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});
