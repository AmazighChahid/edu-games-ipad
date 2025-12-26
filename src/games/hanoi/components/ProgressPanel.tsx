/**
 * ProgressPanel component
 * Displays game stats with moves counter, optimal target, and progress bar
 * Child-friendly design with encouraging messages
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

import { textStyles, spacing, borderRadius, shadows } from '@/theme';

interface ProgressPanelProps {
  currentMoves: number;
  optimalMoves: number;
  progress: number; // 0-1, based on disks moved to target
  visible?: boolean;
}

// Colors
const COLORS = {
  background: '#FFFFFF',
  divider: '#EEEEEE',
  moves: '#5B8DEE',
  optimal: '#7BC74D',
  progressBg: '#EEEEEE',
  progressFill: ['#7BC74D', '#5BAE6B'],
  text: {
    label: '#9A9A9A',
    value: '#4A4A4A',
    encourage: '#7BC74D',
  },
};

// Get encouraging message based on progress
const getEncouragingMessage = (progress: number, moves: number, optimal: number): string => {
  if (progress >= 1) return 'Bravo ! Tu as gagné ! 🎉';
  if (progress >= 0.7) return 'Tu y es presque ! 💪';
  if (progress >= 0.4) return 'Continue comme ça ! 🌟';
  if (moves <= optimal / 2) return 'Bon début ! ✨';
  return 'C\'est parti ! 🚀';
};

export function ProgressPanel({
  currentMoves,
  optimalMoves,
  progress,
  visible = true,
}: ProgressPanelProps) {
  const progressWidth = useSharedValue(0);

  // Animate progress bar
  useEffect(() => {
    progressWidth.value = withSpring(progress * 100, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${Math.min(100, progressWidth.value)}%`,
  }));

  if (!visible) return null;

  const encourageMessage = getEncouragingMessage(progress, currentMoves, optimalMoves);

  return (
    <View style={styles.container}>
      {/* Stats row */}
      <View style={styles.statsRow}>
        {/* Current moves */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Tes coups</Text>
          <Text style={[styles.statNumber, { color: COLORS.moves }]}>
            {currentMoves}
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Optimal moves */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Objectif</Text>
          <Text style={[styles.statNumber, { color: COLORS.optimal }]}>
            {optimalMoves}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>

      {/* Encouraging message */}
      <Text style={styles.encourageText}>{encourageMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 110,
    right: 20,
    backgroundColor: COLORS.background,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    paddingBottom: spacing[4],
    minWidth: 180,
    ...shadows.lg,
    zIndex: 100,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    ...textStyles.caption,
    color: COLORS.text.label,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  statNumber: {
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 48,
  },
  divider: {
    width: 2,
    height: 50,
    backgroundColor: COLORS.divider,
  },

  // Progress bar
  progressContainer: {
    marginTop: spacing[4],
  },
  progressBackground: {
    height: 12,
    backgroundColor: COLORS.progressBg,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.optimal,
    borderRadius: 6,
  },

  // Encouraging message
  encourageText: {
    ...textStyles.caption,
    color: COLORS.text.encourage,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing[2],
  },
});
