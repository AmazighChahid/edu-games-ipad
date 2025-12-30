/**
 * EmbouteillageIntroScreen
 * Écran d'introduction pour le jeu Embouteillage (Rush Hour)
 *
 * Architecture : Hook + Template
 * - useEmbouteillageIntro() : toute la logique métier
 * - GameIntroTemplate : UI partagée
 * - Composants spécifiques : TrafficMascot, ParkingGrid
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { GameIntroTemplate, type LevelConfig, PetalsIndicator } from '../../../components/common';
import { ParkingGrid } from '../components/ParkingGrid';
import { TrafficMascot } from '../components/TrafficMascot';
import { useEmbouteillageIntro } from '../hooks/useEmbouteillageIntro';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
  fontSize,
} from '../../../theme';

// ============================================
// CUSTOM LEVEL CARD
// ============================================

interface LevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
}

const getDifficultyLevel = (difficulty: LevelConfig['difficulty']): 1 | 2 | 3 => {
  switch (difficulty) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    case 'hard':
    case 'expert':
      return 3;
    default:
      return 1;
  }
};

const DIFFICULTY_COLORS = {
  easy: colors.feedback.success,
  medium: colors.secondary.main,
  hard: colors.feedback.error,
  empty: colors.ui.disabled,
};

const EmbouteillageLevelCard: React.FC<LevelCardProps> = ({ level, isSelected }) => {
  const difficultyLevel = getDifficultyLevel(level.difficulty);

  const renderDifficultyBars = () => {
    const bars = [
      { height: 14, filled: difficultyLevel >= 1, color: DIFFICULTY_COLORS.easy },
      { height: 21, filled: difficultyLevel >= 2, color: DIFFICULTY_COLORS.medium },
      { height: 28, filled: difficultyLevel >= 3, color: DIFFICULTY_COLORS.hard },
    ];

    return (
      <View style={styles.difficultyBarsContainer}>
        {bars.map((bar, index) => (
          <View
            key={index}
            style={[
              styles.difficultyBar,
              { height: bar.height },
              bar.filled
                ? { backgroundColor: isSelected ? '#FFFFFF' : bar.color }
                : { backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : DIFFICULTY_COLORS.empty },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderPetals = () => (
    <PetalsIndicator
      filledCount={(level.stars || 0) as 0 | 1 | 2 | 3}
      size="small"
      isSelected={isSelected}
    />
  );

  const cardContent = (
    <>
      {renderDifficultyBars()}
      <Text
        style={[
          styles.levelNumber,
          isSelected && styles.levelNumberSelected,
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? level.number : '🔒'}
      </Text>
      {level.isUnlocked && renderPetals()}
      {level.isCompleted && !isSelected && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkBadgeText}>✓</Text>
        </View>
      )}
    </>
  );

  const containerStyle = [
    styles.levelCard,
    level.isCompleted && styles.levelCardCompleted,
    !level.isUnlocked && styles.levelCardLocked,
  ];

  if (isSelected) {
    return (
      <LinearGradient
        colors={['#E53935', '#C62828']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[containerStyle, styles.levelCardSelected]}
      >
        {cardContent}
      </LinearGradient>
    );
  }

  return <View style={containerStyle}>{cardContent}</View>;
};

// ============================================
// MAIN SCREEN
// ============================================

export default function EmbouteillageIntroScreen() {
  const intro = useEmbouteillageIntro();

  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => (
      <EmbouteillageLevelCard level={level} isSelected={isSelected} />
    ),
    []
  );

  const renderGame = useCallback(() => {
    if (!intro.currentLevel || intro.vehicles.length === 0) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir le parking
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.gameArea}>
        <ParkingGrid
          vehicles={intro.vehicles}
          selectedVehicle={intro.gameState.selectedVehicle}
          exitRow={intro.currentLevel.exitRow}
          exitCol={intro.currentLevel.exitCol}
          onSelectVehicle={intro.handleSelectVehicle}
          onMoveVehicle={intro.handleMoveVehicle}
          canMove={intro.canMove}
          getMaxMoveDistance={intro.getMaxMoveDistance}
          status={intro.gameState.status}
        />

        {/* Undo button when playing */}
        {intro.isPlaying && intro.gameState.moveCount > 0 && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.undoButtonContainer}>
            <Pressable
              style={styles.undoButton}
              onPress={intro.handleUndo}
            >
              <Text style={styles.undoButtonText}>↩️ Annuler</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    );
  }, [intro]);

  const renderProgress = useCallback(() => {
    const { moves, minMoves, hintsUsed } = intro.progressData;
    const efficiency = minMoves > 0 ? Math.max(0, 100 - ((moves - minMoves) / minMoves) * 50) : 100;

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressStatsRow}>
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>COUPS</Text>
            <Text style={[styles.progressStatValue, { color: colors.primary.main }]}>
              {moves}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>OPTIMAL</Text>
            <Text style={[styles.progressStatValue, { color: colors.feedback.success }]}>
              {minMoves}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>INDICES</Text>
            <Text style={[styles.progressStatValue, { color: colors.accent.main }]}>
              {hintsUsed}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          <View style={styles.progressBarSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressBarFill, { width: `${Math.min(100, efficiency)}%` }]} />
            </View>
            <Text style={styles.progressEncourageText}>
              {moves <= minMoves ? '🌟 Parfait !' : moves <= minMoves * 1.5 ? '👍 Bien !' : '💪 Continue !'}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [intro.progressData]);

  return (
    <GameIntroTemplate
      title="Embouteillage"
      emoji="🚗"
      onBack={intro.handleBack}
      onParentPress={intro.handleParentPress}
      onHelpPress={intro.handleHelpPress}
      showParentButton
      showHelpButton

      levels={intro.levels}
      selectedLevel={intro.selectedLevel}
      onSelectLevel={intro.handleSelectLevel}
      renderLevelCard={renderLevelCard}

      renderGame={renderGame}
      isPlaying={intro.isPlaying}
      onStartPlaying={intro.handleStartPlaying}

      renderProgress={renderProgress}

      mascotComponent={
        <TrafficMascot
          message={intro.mascotMessage}
          emotion={intro.mascotEmotion}
          visible={!intro.isVictory}
          canPlayAudio={intro.canPlayAudio}
        />
      }

      showResetButton
      onReset={intro.handleReset}
      showHintButton
      onHint={intro.handleHint}
      hintsRemaining={intro.hintsRemaining}
      hintsDisabled={intro.hintsRemaining === 0}
      onForceComplete={intro.handleForceComplete}

      isVictory={intro.isVictory}
      showTrainingMode={false}
    />
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  levelCard: {
    width: 80,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    borderColor: colors.feedback.errorLight || '#FFCDD2',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    alignItems: 'center',
    gap: spacing[1],
    ...shadows.md,
    overflow: 'visible',
  },
  levelCardCompleted: {
    borderColor: colors.feedback.error,
  },
  levelCardSelected: {
    borderColor: colors.feedback.errorDark || '#B71C1C',
    shadowColor: colors.feedback.error,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  levelCardLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: colors.ui.disabled,
    opacity: 0.6,
  },

  difficultyBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 24,
    marginBottom: 6,
  },
  difficultyBar: {
    width: 8,
    borderRadius: 4,
  },

  levelNumber: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text.primary,
    lineHeight: 28,
  },
  levelNumberSelected: {
    color: colors.text.onDark,
  },
  levelNumberLocked: {
    fontSize: 28,
  },

  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    backgroundColor: colors.feedback.success,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.card,
    ...shadows.sm,
  },
  checkBadgeText: {
    fontSize: fontSize.xs,
    color: colors.text.onDark,
    fontWeight: '700',
  },

  gamePreviewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  gamePreviewEmptyText: {
    fontSize: fontSize.lg,
    color: colors.text.muted,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
  },

  gameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
  },

  undoButtonContainer: {
    marginTop: spacing[4],
  },
  undoButton: {
    backgroundColor: colors.text.secondary,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  undoButtonText: {
    color: colors.text.onDark,
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
  },

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
    fontSize: fontSize.xs,
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
    backgroundColor: colors.ui.disabled,
    borderRadius: 1,
  },
  progressBarSection: {
    alignItems: 'center',
    gap: spacing[2],
  },
  progressBar: {
    width: 80,
    height: 8,
    backgroundColor: colors.ui.disabled,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.feedback.success,
    borderRadius: 4,
  },
  progressEncourageText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.feedback.success,
  },
});
