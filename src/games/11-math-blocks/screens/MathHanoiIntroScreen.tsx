/**
 * MathHanoiIntroScreen
 * Écran d'introduction pour MathBlocks utilisant le pattern Hook + Template
 *
 * Architecture:
 * - useMathIntro: Hook orchestrateur (logique, navigation, état)
 * - CalcMascot: Mascotte avec MascotBubble
 * - GameIntroTemplate: Template unifié
 *
 * @see docs/GAME_ARCHITECTURE.md
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { ZoomIn } from 'react-native-reanimated';

import {
  GameIntroTemplate,
  type LevelConfig,
} from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { Icons } from '../../../constants/icons';
import { theme } from '../../../theme';
import { useMathIntro } from '../hooks/useMathIntro';
import { CalcMascot } from '../components/CalcMascot';
import { OPERATION_SYMBOLS } from '../types';
import { getLevel } from '../data/levels';
import { mathBlocksParentGuideData } from '../data/parentGuideData';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function MathHanoiIntroScreen() {
  const {
    // Niveaux
    levels,
    selectedLevel,
    currentMathLevel,
    handleSelectLevel,

    // État
    isPlaying,
    isTrainingMode,

    // Training
    trainingConfig,
    handleTrainingPress,

    // Mascot
    mascotMessage,
    mascotEmotion,

    // Progress
    progressData,

    // Handlers
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleReset,
    handleHint,

    // Hints
    hintsRemaining,
    hintsDisabled,

    // Parent drawer
    showParentDrawer,
    setShowParentDrawer,
  } = useMathIntro();

  // Render level card custom
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => {
      const mathLevel = getLevel(`level_${level.number}`);
      if (!mathLevel) return null;

      const difficultyColor =
        mathLevel.difficulty === 'easy'
          ? theme.colors.feedback.success
          : mathLevel.difficulty === 'medium'
          ? theme.colors.secondary.main
          : theme.colors.feedback.error;

      const ops = mathLevel.operations.map((op) => OPERATION_SYMBOLS[op]).join(' ');

      return (
        <View
          style={[
            styles.levelCard,
            isSelected && styles.levelCardSelected,
            !level.isUnlocked && styles.levelCardLocked,
          ]}
        >
          {/* Badge difficulté */}
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
            <Text style={styles.difficultyText}>
              {mathLevel.difficulty === 'easy'
                ? Icons.star
                : mathLevel.difficulty === 'medium'
                ? `${Icons.star}${Icons.star}`
                : `${Icons.star}${Icons.star}${Icons.star}`}
            </Text>
          </View>

          {/* Numéro niveau */}
          <Text
            style={[
              styles.levelNumber,
              isSelected && styles.levelNumberSelected,
              !level.isUnlocked && styles.levelNumberLocked,
            ]}
          >
            {level.isUnlocked ? level.number : Icons.lock}
          </Text>

          {/* Opérations */}
          <Text style={styles.levelOps}>{ops}</Text>

          {/* Étoiles si complété */}
          {level.isCompleted && level.stars !== undefined && (
            <View style={styles.starsRow}>
              {[1, 2, 3].map((star) => (
                <Text
                  key={star}
                  style={star <= (level.stars || 0) ? styles.starFilled : styles.starEmpty}
                >
                  {Icons.star}
                </Text>
              ))}
            </View>
          )}
        </View>
      );
    },
    []
  );

  // Render game preview
  const renderGame = useCallback(() => {
    if (!currentMathLevel) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyEmoji}>{Icons.abacus}</Text>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir les détails
          </Text>
        </View>
      );
    }

    const ops = currentMathLevel.operations.map((op) => OPERATION_SYMBOLS[op]).join(' ');

    return (
      <View style={styles.gameContainer}>
        {/* Preview de la grille (schématique) */}
        <View style={styles.gridPreview}>
          <View style={styles.gridPreviewInner}>
            {Array.from({ length: Math.min(currentMathLevel.gridRows, 4) }).map((_, row) => (
              <View key={row} style={styles.gridRow}>
                {Array.from({ length: Math.min(currentMathLevel.gridCols, 5) }).map((_, col) => (
                  <Animated.View
                    key={`${row}-${col}`}
                    entering={ZoomIn.delay((row * 5 + col) * 30)}
                    style={[
                      styles.gridCell,
                      {
                        backgroundColor:
                          (row + col) % 2 === 0
                            ? theme.colors.primary.light
                            : theme.colors.secondary.light,
                      },
                    ]}
                  >
                    <Text style={styles.gridCellText}>
                      {(row + col) % 3 === 0 ? '?' : (row + col) % 3 === 1 ? ops.split(' ')[0] : '='}
                    </Text>
                  </Animated.View>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Info du niveau */}
        <View style={styles.levelInfoCard}>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoIcon}>{Icons.puzzle}</Text>
            <Text style={styles.levelInfoText}>
              Grille {currentMathLevel.gridRows}×{currentMathLevel.gridCols}
            </Text>
          </View>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoIcon}>{Icons.target}</Text>
            <Text style={styles.levelInfoText}>{currentMathLevel.targetPairs} paires à trouver</Text>
          </View>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoIcon}>{Icons.timer}</Text>
            <Text style={styles.levelInfoText}>
              {Math.floor(currentMathLevel.timeLimit / 60)}:
              {String(currentMathLevel.timeLimit % 60).padStart(2, '0')}
            </Text>
          </View>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoIcon}>{Icons.math}</Text>
            <Text style={styles.levelInfoText}>
              Nombres: {currentMathLevel.numberRange[0]}-{currentMathLevel.numberRange[1]}
            </Text>
          </View>
        </View>

        {/* Bouton Jouer */}
        <Pressable onPress={handleStartPlaying} style={styles.playButton}>
          <LinearGradient
            colors={[theme.colors.secondary.main, theme.colors.secondary.dark]}
            style={styles.playButtonGradient}
          >
            <Text style={styles.playButtonEmoji}>{Icons.rocket}</Text>
            <Text style={styles.playButtonText}>C'est parti !</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }, [currentMathLevel, handleStartPlaying]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{progressData.completedLevels}</Text>
          <Text style={styles.progressLabel}>/ {progressData.totalLevels} niveaux</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{progressData.currentLevel}</Text>
          <Text style={styles.progressLabel}>{Icons.chart} Actuel</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{progressData.totalStars}</Text>
          <Text style={styles.progressLabel}>{Icons.star} Étoiles</Text>
        </View>
      </View>
    );
  }, [progressData]);

  // Render mascot
  const renderMascot = useMemo(
    () => <CalcMascot message={mascotMessage} emotion={mascotEmotion} />,
    [mascotMessage, mascotEmotion]
  );

  return (
    <>
      <GameIntroTemplate
        // Header
        title="MathBlocks"
        emoji={Icons.abacus}
        onBack={handleBack}
        onParentPress={handleParentPress}
        onHelpPress={handleHelpPress}
        showParentButton={true}
        showHelpButton={true}

        // Niveaux
        levels={levels}
        selectedLevel={selectedLevel}
        onSelectLevel={handleSelectLevel}
        renderLevelCard={renderLevelCard}
        levelColumns={5}

        // Mode entraînement
        showTrainingMode={true}
        trainingConfig={trainingConfig}
        onTrainingPress={handleTrainingPress}
        isTrainingMode={isTrainingMode}

        // Jeu
        renderGame={renderGame}
        isPlaying={isPlaying}
        onStartPlaying={handleStartPlaying}

        // Progress
        renderProgress={renderProgress}

        // Mascotte
        mascotComponent={renderMascot}
        mascotMessage={mascotMessage}
        mascotMessageType={
          mascotEmotion === 'excited'
            ? 'victory'
            : mascotEmotion === 'thinking'
            ? 'hint'
            : mascotEmotion === 'encouraging'
            ? 'encourage'
            : 'intro'
        }

        // Boutons flottants
        showResetButton={true}
        onReset={handleReset}
        showHintButton={true}
        onHint={handleHint}
        hintsRemaining={hintsRemaining}
        hintsDisabled={hintsDisabled}

        // Animation config
        animationConfig={{
          selectorSlideDuration: 400,
          selectorFadeDuration: 300,
        }}
      />

      {/* Fiche parent de l'activité */}
      <ParentDrawer
        isVisible={showParentDrawer}
        onClose={() => setShowParentDrawer(false)}
        activityName={mathBlocksParentGuideData.activityName}
        activityEmoji={mathBlocksParentGuideData.activityEmoji}
        gameData={mathBlocksParentGuideData.gameData}
        appBehavior={mathBlocksParentGuideData.appBehavior}
        competences={mathBlocksParentGuideData.competences}
        scienceData={mathBlocksParentGuideData.scienceData}
        advices={mathBlocksParentGuideData.advices}
        warningText={mathBlocksParentGuideData.warningText}
        teamMessage={mathBlocksParentGuideData.teamMessage}
        questionsDuring={mathBlocksParentGuideData.questionsDuring}
        questionsAfter={mathBlocksParentGuideData.questionsAfter}
        questionsWarning={mathBlocksParentGuideData.questionsWarning}
        dailyActivities={mathBlocksParentGuideData.dailyActivities}
        transferPhrases={mathBlocksParentGuideData.transferPhrases}
        resources={mathBlocksParentGuideData.resources}
        badges={mathBlocksParentGuideData.badges}
        ageExpectations={mathBlocksParentGuideData.ageExpectations}
        settings={mathBlocksParentGuideData.settings}
      />
    </>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Level cards
  levelCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[3],
    alignItems: 'center',
    minWidth: 72,
    minHeight: 100,
    borderWidth: 3,
    borderColor: theme.colors.background.secondary,
    ...theme.shadows.md,
  },
  levelCardSelected: {
    backgroundColor: theme.colors.secondary.light,
    borderColor: theme.colors.secondary.main,
    transform: [{ scale: 1.05 }],
  },
  levelCardLocked: {
    backgroundColor: theme.colors.background.secondary,
    opacity: 0.6,
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[1],
  },
  difficultyText: {
    fontSize: 10,
  },
  levelNumber: {
    fontSize: 24,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  levelNumberSelected: {
    color: theme.colors.secondary.main,
  },
  levelNumberLocked: {
    fontSize: 20,
    color: theme.colors.text.muted,
  },
  levelOps: {
    fontSize: 14,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: theme.spacing[1],
  },
  starFilled: {
    fontSize: 12,
    color: theme.colors.secondary.main,
  },
  starEmpty: {
    fontSize: 12,
    color: theme.colors.text.muted,
    opacity: 0.3,
  },

  // Game container
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[4],
  },
  gamePreviewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[8],
    gap: theme.spacing[4],
  },
  gamePreviewEmptyEmoji: {
    fontSize: 64,
  },
  gamePreviewEmptyText: {
    ...theme.textStyles.body,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },

  // Grid preview
  gridPreview: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[4],
    ...theme.shadows.lg,
  },
  gridPreviewInner: {
    gap: theme.spacing[2],
  },
  gridRow: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  gridCell: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCellText: {
    fontSize: 18,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.primary,
  },

  // Level info card
  levelInfoCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    ...theme.shadows.md,
    gap: theme.spacing[2],
    width: '100%',
    maxWidth: 280,
  },
  levelInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  levelInfoIcon: {
    fontSize: 20,
  },
  levelInfoText: {
    ...theme.textStyles.body,
    color: theme.colors.text.primary,
  },

  // Play button
  playButton: {
    marginTop: theme.spacing[2],
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[8],
    borderRadius: theme.borderRadius.xl,
    minHeight: theme.touchTargets.child,
    ...theme.shadows.lg,
  },
  playButtonEmoji: {
    fontSize: 24,
  },
  playButtonText: {
    ...theme.textStyles.button,
    color: theme.colors.text.inverse,
    fontFamily: theme.fontFamily.bold,
    fontSize: 20,
  },

  // Progress panel
  progressPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[5],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    borderRadius: theme.borderRadius.xl,
    marginHorizontal: theme.spacing[4],
    ...theme.shadows.md,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    ...theme.textStyles.h3,
    color: theme.colors.secondary.main,
    fontFamily: theme.fontFamily.bold,
  },
  progressLabel: {
    ...theme.textStyles.caption,
    color: theme.colors.text.secondary,
    fontSize: 10,
  },
  progressDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.background.secondary,
  },
});
