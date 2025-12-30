/**
 * ChasseurIntroScreen
 * Écran d'introduction pour le jeu Chasseur de Papillons
 *
 * Architecture : Hook + Template
 * - useChasseurIntro() : toute la logique métier
 * - GameIntroTemplate : UI partagée
 * - Composants extraits : MascotFlutty, ButterflySprite, RuleBadge, ChasseurLevelCard
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { GameIntroTemplate, type LevelConfig } from '../../../components/common';
import { MascotFlutty, ButterflySprite, RuleBadge, ChasseurLevelCard } from '../components';
import { useChasseurIntro } from '../hooks/useChasseurIntro';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
} from '../../../theme';

// ============================================
// MAIN SCREEN
// ============================================

export default function ChasseurIntroScreen() {
  const intro = useChasseurIntro();

  // Render level card avec composant extrait
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => (
      <ChasseurLevelCard level={level} isSelected={isSelected} />
    ),
    []
  );

  // Render game area
  const renderGame = useCallback(() => {
    const { butterflies, currentRule, gameState } = intro;

    // Mode preview (pas encore en jeu)
    if (!intro.isPlaying) {
      return (
        <View style={styles.gamePreviewContainer}>
          {currentRule && <RuleBadge rule={currentRule} />}
          <View style={styles.previewField}>
            <Text style={styles.previewEmoji}>🦋</Text>
            <Text style={styles.previewText}>
              Attrape les papillons selon la consigne !
            </Text>
          </View>
        </View>
      );
    }

    // Mode jeu actif
    return (
      <View style={styles.gameContainer}>
        {/* Rule badge en haut */}
        {currentRule && (
          <Animated.View entering={FadeInUp.duration(300)}>
            <RuleBadge rule={currentRule} />
          </Animated.View>
        )}

        {/* Champ de jeu */}
        <View style={styles.butterflyField}>
          {butterflies.map((butterfly) => (
            <ButterflySprite
              key={butterfly.id}
              butterfly={butterfly}
              onCatch={intro.handleCatchButterfly}
              hintLevel={gameState.currentHintLevel}
            />
          ))}
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            ⏱️ {Math.ceil(gameState.timeRemaining / 1000)}s
          </Text>
        </View>
      </View>
    );
  }, [intro]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    const { progressData } = intro;

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressStatsRow}>
          {/* Score */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>SCORE</Text>
            <Text style={[styles.progressStatValue, { color: colors.primary.main }]}>
              {progressData.score}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Attrapés */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>ATTRAPÉS</Text>
            <Text style={[styles.progressStatValue, { color: colors.feedback.success }]}>
              {progressData.targetsCaught}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Erreurs */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>ERREURS</Text>
            <Text style={[styles.progressStatValue, { color: colors.feedback.error }]}>
              {progressData.wrongCatches}
            </Text>
          </View>

          {progressData.streak >= 3 && (
            <>
              <View style={styles.progressDivider} />
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatLabel}>SÉRIE</Text>
                <Text style={[styles.progressStatValue, { color: '#E056FD' }]}>
                  🔥 {progressData.streak}
                </Text>
              </View>
            </>
          )}

          <View style={styles.progressDivider} />

          {/* Vague */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>VAGUE</Text>
            <Text style={[styles.progressStatValue, { color: '#9B59B6' }]}>
              {progressData.currentWave}/{progressData.totalWaves}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [intro.progressData]);

  return (
    <GameIntroTemplate
      // Header
      title="Chasseur de Papillons"
      emoji="🦋"
      onBack={intro.handleBack}
      onParentPress={intro.handleParentPress}
      onHelpPress={intro.handleHelpPress}
      showParentButton
      showHelpButton

      // Niveaux
      levels={intro.levels}
      selectedLevel={intro.selectedLevel}
      onSelectLevel={intro.handleSelectLevel}
      renderLevelCard={renderLevelCard}

      // Jeu
      renderGame={renderGame}
      isPlaying={intro.isPlaying}
      onStartPlaying={intro.handleStartPlaying}

      // Progress
      renderProgress={renderProgress}

      // Mascot
      mascotComponent={
        <MascotFlutty
          message={intro.mascotMessage}
          emotion={intro.mascotEmotion}
          visible={!intro.isVictory}
        />
      }

      // Floating buttons
      showResetButton
      onReset={intro.handleReset}
      showHintButton
      onHint={intro.handleHint}
      hintsRemaining={intro.hintsRemaining}
      hintsDisabled={intro.hintsRemaining === 0}
      onForceComplete={intro.handleForceComplete}

      // Victory
      isVictory={intro.isVictory}

      // Training mode disabled
      showTrainingMode={false}
    />
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Game preview
  gamePreviewContainer: {
    alignItems: 'center',
    gap: spacing[4],
  },
  previewField: {
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    borderRadius: borderRadius.xl,
    padding: spacing[8],
    alignItems: 'center',
    gap: spacing[3],
    borderWidth: 2,
    borderColor: 'rgba(155, 89, 182, 0.2)',
    borderStyle: 'dashed',
  },
  previewEmoji: {
    fontSize: 48,
  },
  previewText: {
    fontSize: 16,
    color: colors.text.muted,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
  },

  // Game container
  gameContainer: {
    flex: 1,
    width: '100%',
  },

  // Butterfly field
  butterflyField: {
    flex: 1,
    backgroundColor: 'rgba(155, 89, 182, 0.05)',
    borderRadius: borderRadius.xl,
    position: 'relative',
    minHeight: 300,
    overflow: 'hidden',
  },

  // Timer
  timerContainer: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  timerText: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },

  // Progress Panel
  progressPanel: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 20,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    ...shadows.lg,
    zIndex: 100,
    marginVertical: spacing[2],
  },
  progressStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  progressStatItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  progressStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.muted,
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },
  progressStatValue: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  progressDivider: {
    width: 2,
    height: 36,
    backgroundColor: colors.background.tertiary,
    borderRadius: 1,
  },
});
