/**
 * ProgressPanel component
 * Centered stats block with moves, objective, record, and progress bar
 * Inspired by new UX design
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
  bestMoves?: number; // Personal best record
  visible?: boolean;
}

// Colors
const COLORS = {
  background: 'rgba(255, 255, 255, 0.97)',
  divider: '#E2E8F0',
  moves: '#5B8DEE',
  optimal: '#7BC74D',
  best: '#E056FD',
  progressBg: '#E2E8F0',
  progressFill: '#7BC74D',
  text: {
    label: '#A0AEC0',
    encourage: '#7BC74D',
  },
};

// Get encouraging message based on progress
const getEncouragingMessage = (progress: number, moves: number, optimal: number): string => {
  if (progress >= 1) return 'Bravo ! 🎉';
  if (progress >= 0.7) return 'Tu y es presque ! 💪';
  if (progress >= 0.4) return 'Continue ! 🌟';
  if (moves <= optimal / 2) return 'Bon début ! ✨';
  return 'C\'est parti ! 🚀';
};

export function ProgressPanel({
  currentMoves,
  optimalMoves,
  progress,
  bestMoves,
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
          <Text style={styles.statLabel}>TES COUPS</Text>
          <Text style={[styles.statValue, { color: COLORS.moves }]}>
            {currentMoves}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Optimal moves */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>OBJECTIF</Text>
          <Text style={[styles.statValue, { color: COLORS.optimal }]}>
            {optimalMoves}
          </Text>
        </View>

        {bestMoves !== undefined && (
          <>
            <View style={styles.divider} />

            {/* Best record */}
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>TON RECORD</Text>
              <Text style={[styles.statValue, { color: COLORS.best }]}>
                {bestMoves}
              </Text>
            </View>
          </>
        )}

        <View style={styles.divider} />

        {/* Progress indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          <Text style={styles.encourageText}>{encourageMessage}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    ...shadows.lg,
    zIndex: 100,
    marginVertical: spacing[2],
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[5],
  },

  statItem: {
    alignItems: 'center',
    minWidth: 70,
  },

  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.label,
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },

  statValue: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 36,
  },

  divider: {
    width: 2,
    height: 40,
    backgroundColor: COLORS.divider,
    borderRadius: 1,
  },

  progressSection: {
    alignItems: 'center',
    gap: spacing[2],
  },

  progressBar: {
    width: 100,
    height: 8,
    backgroundColor: COLORS.progressBg,
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: COLORS.progressFill,
    borderRadius: 4,
  },

  encourageText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.encourage,
  },
});
