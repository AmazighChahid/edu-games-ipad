/**
 * ScoreDisplay component
 * Shows score, combo, and progress
 * Refactored with theme tokens and Icons
 */

import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { theme } from '../../../theme';
import { Icons } from '../../../constants/icons';

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
        <Text style={styles.scoreLabel}>{Icons.star} Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      {/* Combo */}
      {combo > 1 && (
        <Animated.View style={[styles.comboBox, comboAnimatedStyle]}>
          <Text style={styles.comboText}>{Icons.fire} Combo x{combo}!</Text>
        </Animated.View>
      )}

      {/* Progress */}
      <View style={styles.progressBox}>
        <Text style={styles.progressLabel}>{Icons.target} Paires</Text>
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
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    gap: theme.spacing[3],
  },
  scoreBox: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minWidth: 100,
    minHeight: theme.touchTargets.child,
    justifyContent: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    fontFamily: theme.fontFamily.medium,
    color: 'rgba(255,255,255,0.9)',
  },
  scoreValue: {
    fontSize: 24,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.inverse,
  },
  comboBox: {
    backgroundColor: theme.colors.secondary.main,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    minHeight: theme.touchTargets.child,
    justifyContent: 'center',
  },
  comboText: {
    fontSize: 18,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.inverse,
  },
  progressBox: {
    backgroundColor: theme.colors.background.card,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minWidth: 100,
    minHeight: theme.touchTargets.child,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.text.muted,
  },
  progressValue: {
    fontSize: 18,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.primary,
  },
});
