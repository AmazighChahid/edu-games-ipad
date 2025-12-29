/**
 * SudokuProgressPanel Component
 * Panneau affichant la progression du jeu
 * (cases restantes, indices utilisés, erreurs)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { colors, spacing, borderRadius, fontFamily, textStyles, shadows } from '@/theme';

// ============================================
// TYPES
// ============================================

interface SudokuProgressPanelProps {
  emptyCellsRemaining: number;
  totalEmptyCells: number;
  hintsUsed: number;
  errorsCount: number;
  progress: number; // 0-100
  maxHints?: number;
}

// ============================================
// COMPONENT
// ============================================

export function SudokuProgressPanel({
  emptyCellsRemaining,
  totalEmptyCells,
  hintsUsed,
  errorsCount,
  progress,
  maxHints = 3,
}: SudokuProgressPanelProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      {/* Barre de progression */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { width: `${progress}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {/* Cases restantes */}
        <View style={styles.statItem}>
          <View style={[styles.statIcon, styles.cellsIcon]}>
            <Text style={styles.statEmoji}>🔲</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {totalEmptyCells - emptyCellsRemaining}/{totalEmptyCells}
            </Text>
            <Text style={styles.statLabel}>Rempli</Text>
          </View>
        </View>

        {/* Indices */}
        <View style={styles.statItem}>
          <View style={[styles.statIcon, styles.hintsIcon]}>
            <Text style={styles.statEmoji}>💡</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {maxHints - hintsUsed}
            </Text>
            <Text style={styles.statLabel}>Indices</Text>
          </View>
        </View>

        {/* Erreurs */}
        <View style={styles.statItem}>
          <View style={[
            styles.statIcon,
            styles.errorsIcon,
            errorsCount > 0 && styles.errorsIconActive,
          ]}>
            <Text style={styles.statEmoji}>❌</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={[
              styles.statValue,
              errorsCount > 0 && styles.statValueError,
            ]}>
              {errorsCount}
            </Text>
            <Text style={styles.statLabel}>Erreurs</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    ...shadows.sm,
  },

  // Progress bar
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  progressBarBackground: {
    flex: 1,
    height: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.feedback.success,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.text.primary,
    minWidth: 44,
    textAlign: 'right',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellsIcon: {
    backgroundColor: colors.primary.light + '40',
  },
  hintsIcon: {
    backgroundColor: colors.feedback.warningLight,
  },
  errorsIcon: {
    backgroundColor: colors.background.secondary,
  },
  errorsIconActive: {
    backgroundColor: colors.feedback.errorLight,
  },
  statEmoji: {
    fontSize: 18,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  statValueError: {
    color: colors.feedback.error,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
  },
});

export default SudokuProgressPanel;
