/**
 * GameBoard Component
 *
 * Plateau de jeu principal pour Memory
 * Utilise ScreenHeader standardisé + stats bar + grille
 *
 * Refactorisé pour respecter les guidelines UX enfant:
 * - Touch targets ≥ 64dp
 * - fontSize ≥ 16pt (labels), ≥ 18pt (texte courant)
 * - Imports depuis /theme/
 */

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, borderRadius, shadows, fontFamily, touchTargets, textStyles } from '../../../theme';
import { ScreenHeader } from '../../../components/common';
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
      {/* Header standardisé */}
      <ScreenHeader
        variant="game"
        title={level.name}
        emoji={Icons.elephant}
        onBack={onBack}
        showParentButton={false}
        showHelpButton={false}
      />

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>{Icons.memoryPairs}</Text>
          <Text style={styles.statValue}>
            {matchedPairs}/{totalPairs}
          </Text>
          <Text style={styles.statLabel}>Paires</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <Text style={styles.statIcon}>{Icons.target}</Text>
          <Text style={styles.statValue}>{attempts}</Text>
          <Text style={styles.statLabel}>Essais</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <Text style={styles.statIcon}>{level.timeLimit > 0 ? Icons.timer : Icons.clock}</Text>
          <Text
            style={[
              styles.statValue,
              isTimeWarning && styles.statValueWarning,
            ]}
          >
            {timeDisplay}
          </Text>
          <Text style={styles.statLabel}>
            {level.timeLimit > 0 ? 'Reste' : 'Temps'}
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
        <Text style={styles.progressText}>
          {Math.round((matchedPairs / totalPairs) * 100)}%
        </Text>
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        <MemoryGrid
          cards={cards}
          onCardPress={onCardPress}
          disabled={gameState.isChecking || gameState.phase !== 'playing'}
        />
      </View>

      {/* Footer avec boutons */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[4] }]}>
        {/* Bouton Pause */}
        <Pressable
          style={styles.footerButton}
          onPress={onPause}
          accessibilityLabel="Pause"
          accessibilityRole="button"
        >
          <Text style={styles.footerButtonIcon}>{Icons.pause}</Text>
          <Text style={styles.footerButtonText}>Pause</Text>
        </Pressable>

        {/* Bouton Indice */}
        <Pressable
          style={[styles.footerButton, styles.hintButton]}
          onPress={onHint}
          accessibilityLabel="Obtenir un indice"
          accessibilityRole="button"
        >
          <Text style={styles.footerButtonIcon}>{Icons.lightbulb}</Text>
          <Text style={styles.footerButtonText}>Indice</Text>
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

  // ============================================
  // STATS BAR
  // ============================================
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background.card,
    marginHorizontal: spacing[4],
    marginTop: spacing[2],
    borderRadius: borderRadius.xl,
    gap: spacing[4],
    ...shadows.md,
  },
  stat: {
    alignItems: 'center',
    minWidth: 80,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.text.muted,
  },
  statValue: {
    fontSize: 24,
    fontFamily: fontFamily.displayBold,
    color: colors.text.primary,
  },
  statValueWarning: {
    color: colors.feedback.error,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.ui.border,
  },

  // ============================================
  // PROGRESS BAR
  // ============================================
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: colors.ui.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.feedback.success,
    borderRadius: borderRadius.round,
  },
  progressText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.feedback.success,
    minWidth: 50,
    textAlign: 'right',
  },

  // ============================================
  // GRID
  // ============================================
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ============================================
  // FOOTER BUTTONS
  // ============================================
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[4],
    paddingTop: spacing[4],
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: colors.background.card,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.xl,
    minHeight: touchTargets.large,
    minWidth: 120,
    ...shadows.md,
  },
  hintButton: {
    backgroundColor: colors.secondary.main,
  },
  footerButtonIcon: {
    fontSize: 24,
  },
  footerButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
});

export default GameBoard;
