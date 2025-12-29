/**
 * GameBoard Component
 *
 * Plateau de jeu principal pour Memory
 * Inclut la grille, les stats et les contrôles
 */

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, borderRadius, shadows, fontFamily, touchTargets } from '../../../theme';
import { MemoryGrid } from './MemoryGrid';
import { Icons } from '../../../constants/icons';
import type { MemoryGameState } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface GameBoardProps {
  gameState: MemoryGameState;
  onCardPress: (cardId: string) => void;
  onPause: () => void;
  onHint: () => void;
  onBack: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function GameBoard({
  gameState,
  onCardPress,
  onPause,
  onHint,
  onBack,
}: GameBoardProps) {
  const insets = useSafeAreaInsets();

  const { cards, matchedPairs, totalPairs, attempts, timeElapsed, level } = gameState;

  // Formater le temps
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculer le temps restant si limite
  const timeDisplay = level.timeLimit > 0
    ? formatTime(Math.max(0, level.timeLimit - timeElapsed))
    : formatTime(timeElapsed);

  const isTimeWarning = level.timeLimit > 0 && (level.timeLimit - timeElapsed) <= 10;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack} accessibilityLabel="Retour" accessibilityRole="button">
          <Text style={styles.backButtonText}>{Icons.back}</Text>
        </Pressable>

        <View style={styles.levelInfo}>
          <Text style={styles.levelName}>{level.name}</Text>
        </View>

        <Pressable style={styles.pauseButton} onPress={onPause} accessibilityLabel="Pause" accessibilityRole="button">
          <Text style={styles.pauseButtonText}>{Icons.pause}</Text>
        </Pressable>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Paires</Text>
          <Text style={styles.statValue}>
            {matchedPairs}/{totalPairs}
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statLabel}>Essais</Text>
          <Text style={styles.statValue}>{attempts}</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statLabel}>
            {level.timeLimit > 0 ? 'Reste' : 'Temps'}
          </Text>
          <Text
            style={[
              styles.statValue,
              isTimeWarning && styles.statValueWarning,
            ]}
          >
            {timeDisplay}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(matchedPairs / totalPairs) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        <MemoryGrid
          cards={cards}
          onCardPress={onCardPress}
          disabled={gameState.isChecking || gameState.phase !== 'playing'}
        />
      </View>

      {/* Hint Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[4] }]}>
        <Pressable style={styles.hintButton} onPress={onHint} accessibilityLabel="Obtenir un indice" accessibilityRole="button">
          <Text style={styles.hintButtonText}>{Icons.lightbulb} Indice</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  backButton: {
    width: 64,
    height: 64,
    minWidth: 64,
    minHeight: 64,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: colors.text.primary,
  },
  levelInfo: {
    flex: 1,
    alignItems: 'center',
  },
  levelName: {
    fontSize: 18,
    fontFamily: fontFamily.display,
    fontWeight: '600',
    color: colors.text.primary,
  },
  pauseButton: {
    width: 64,
    height: 64,
    minWidth: 64,
    minHeight: 64,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButtonText: {
    fontSize: 24,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background.card,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.text.muted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statValueWarning: {
    color: colors.feedback.error,
  },
  progressContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.ui.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.feedback.success,
    borderRadius: borderRadius.round,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing[4],
  },
  hintButton: {
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.xl,
    minHeight: 64,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  hintButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    fontWeight: '600',
    color: colors.text.inverse,
  },
});

export default GameBoard;
