/**
 * SuitesIntroScreen
 * Écran d'introduction pour le jeu Suites Logiques
 *
 * Architecture : Hook + Template
 * - useSuitesIntro() : toute la logique métier
 * - GameIntroTemplate : UI partagée
 * - Composants spécifiques : MascotRobot, SequenceDisplay, ChoicePanel
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { GameIntroTemplate, type LevelConfig } from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { SequenceDisplay } from '../components/SequenceDisplay';
import { ChoicePanel } from '../components/ChoicePanel';
import { MascotRobot } from '../components/MascotRobot';
import { useSuitesIntro } from '../hooks/useSuitesIntro';
import { THEMES } from '../data/themes';
import { suitesParentGuideData } from '../data/parentGuideData';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
} from '../../../theme';

// ============================================
// CUSTOM LEVEL CARD (spécifique à Suites Logiques)
// ============================================

interface LevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
}

const SuitesLevelCard: React.FC<LevelCardProps> = ({ level, isSelected }) => {
  const themeIcon = THEMES['shapes']?.icon || '🔷';

  return (
    <View
      style={[
        styles.levelCard,
        level.isCompleted && styles.levelCardCompleted,
        isSelected && styles.levelCardSelected,
        !level.isUnlocked && styles.levelCardLocked,
      ]}
    >
      {/* Icône thème */}
      <Text style={styles.levelThemeIcon}>
        {level.isUnlocked ? themeIcon : '🔒'}
      </Text>

      {/* Numéro niveau */}
      <Text
        style={[
          styles.levelNumber,
          isSelected && styles.levelNumberSelected,
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.number}
      </Text>

      {/* Étoiles si complété */}
      {level.isCompleted && level.stars !== undefined && (
        <View style={styles.starsRow}>
          {[1, 2, 3].map((star) => (
            <Text
              key={star}
              style={star <= (level.stars || 0) ? styles.starFilled : styles.starEmpty}
            >
              ★
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

// ============================================
// MAIN SCREEN
// ============================================

export default function SuitesIntroScreen() {
  // Hook orchestrateur - toute la logique métier
  const intro = useSuitesIntro();

  // Render custom level card
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => (
      <SuitesLevelCard level={level} isSelected={isSelected} />
    ),
    []
  );

  // Render game area (séquence + choix)
  const renderGame = useCallback(() => {
    if (!intro.currentSequence) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir la suite
          </Text>
        </View>
      );
    }

    return (
      <>
        {/* Zone de la suite */}
        <View style={styles.sequenceArea}>
          <SequenceDisplay
            sequence={intro.currentSequence}
            selectedAnswer={intro.gameState.selectedAnswer}
            status={intro.gameState.status}
            hintLevel={intro.gameState.currentHintLevel}
            onDropInSlot={intro.handleConfirm}
          />
        </View>

        {/* Zone des choix (visible quand on joue) */}
        {intro.isPlaying && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.choiceArea}>
            <ChoicePanel
              choices={[intro.currentSequence.correctAnswer, ...intro.currentSequence.distractors]}
              selectedId={intro.gameState.selectedAnswer?.id}
              onSelect={intro.handleSelectAnswer}
              onConfirm={intro.handleConfirm}
              disabled={intro.gameState.status === 'checking' || intro.gameState.status === 'success'}
              hintLevel={intro.gameState.currentHintLevel}
              correctAnswerId={intro.currentSequence.correctAnswer.id}
              status={intro.gameState.status === 'idle' || intro.gameState.status === 'selected' ? 'playing' : intro.gameState.status}
            />
          </Animated.View>
        )}
      </>
    );
  }, [intro]);

  // Render progress panel (style similaire à Hanoi ProgressPanel)
  const renderProgress = useCallback(() => {
    const { current, total, totalAttempts, failedAttempts, maxStreak } = intro.progressData;
    const progress = current / total;

    // Message d'encouragement
    const getMessage = () => {
      if (progress >= 1) return 'Bravo ! 🎉';
      if (progress >= 0.7) return 'Tu y es presque ! 💪';
      if (progress >= 0.4) return 'Continue ! 🌟';
      return "C'est parti ! 🚀";
    };

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressStatsRow}>
          {/* Coups joués */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>COUPS</Text>
            <Text style={[styles.progressStatValue, { color: colors.primary.main }]}>
              {totalAttempts}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Réussies */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>RÉUSSIES</Text>
            <Text style={[styles.progressStatValue, { color: colors.feedback.success }]}>
              {current}/{total}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Erreurs */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>ERREURS</Text>
            <Text style={[styles.progressStatValue, { color: colors.feedback.error }]}>
              {failedAttempts}
            </Text>
          </View>

          {maxStreak > 0 && (
            <>
              <View style={styles.progressDivider} />

              {/* Record série */}
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatLabel}>RECORD</Text>
                <Text style={[styles.progressStatValue, { color: '#E056FD' }]}>
                  🔥 {maxStreak}
                </Text>
              </View>
            </>
          )}

          <View style={styles.progressDivider} />

          {/* Barre de progression */}
          <View style={styles.progressBarSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressEncourageText}>{getMessage()}</Text>
          </View>
        </View>
      </View>
    );
  }, [intro.progressData]);

  return (
    <>
      <GameIntroTemplate
        // Header
        title="Suites Logiques"
        emoji="🔮"
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
          <MascotRobot
            message={intro.mascotMessage}
            emotion={intro.mascotEmotion}
            visible={!intro.isVictory}
            canPlayAudio={intro.canPlayAudio}
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

        // Mode entrainement désactivé pour ce jeu
        showTrainingMode={false}
      />

      {/* Fiche parent de l'activité */}
      <ParentDrawer
        isVisible={intro.showParentDrawer}
        onClose={() => intro.setShowParentDrawer(false)}
        activityName={suitesParentGuideData.activityName}
        activityEmoji={suitesParentGuideData.activityEmoji}
        gameData={suitesParentGuideData.gameData}
        appBehavior={suitesParentGuideData.appBehavior}
        competences={suitesParentGuideData.competences}
        scienceData={suitesParentGuideData.scienceData}
        advices={suitesParentGuideData.advices}
        warningText={suitesParentGuideData.warningText}
        teamMessage={suitesParentGuideData.teamMessage}
        questionsDuring={suitesParentGuideData.questionsDuring}
        questionsAfter={suitesParentGuideData.questionsAfter}
        questionsWarning={suitesParentGuideData.questionsWarning}
        dailyActivities={suitesParentGuideData.dailyActivities}
        transferPhrases={suitesParentGuideData.transferPhrases}
        resources={suitesParentGuideData.resources}
        badges={suitesParentGuideData.badges}
        ageExpectations={suitesParentGuideData.ageExpectations}
        settings={suitesParentGuideData.settings}
      />
    </>
  );
}

// ============================================
// STYLES (spécifiques à ce jeu)
// ============================================

const styles = StyleSheet.create({
  // Custom Level Card
  levelCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    alignItems: 'center',
    minWidth: 100,
    minHeight: 120,
    borderWidth: 3,
    borderColor: colors.background.secondary,
    ...shadows.md,
  },
  levelCardCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#7BC74D',
  },
  levelCardSelected: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
    transform: [{ scale: 1.05 }],
  },
  levelCardLocked: {
    backgroundColor: colors.background.secondary,
    opacity: 0.6,
  },
  levelThemeIcon: {
    fontSize: 24,
    marginBottom: spacing[1],
  },
  levelNumber: {
    fontSize: 32,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  levelNumberSelected: {
    color: colors.primary.main,
  },
  levelNumberLocked: {
    fontSize: 24,
    color: colors.text.muted,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: spacing[1],
  },
  starFilled: {
    fontSize: 14,
    color: colors.secondary.main,
  },
  starEmpty: {
    fontSize: 14,
    color: colors.text.muted,
    opacity: 0.3,
  },

  // Game Area
  gamePreviewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  gamePreviewEmptyText: {
    fontSize: 16,
    color: colors.text.muted,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
  },
  sequenceArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
    marginTop: spacing[2],
  },
  choiceArea: {
    marginBottom: spacing[4],
  },

  // Progress Panel (style Hanoi)
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
    color: '#A0AEC0',
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
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },
  progressBarSection: {
    alignItems: 'center',
    gap: spacing[2],
  },
  progressBar: {
    width: 80,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.feedback.success,
    borderRadius: 4,
  },
  progressEncourageText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.feedback.success,
  },
});
