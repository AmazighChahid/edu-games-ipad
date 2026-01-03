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
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  GameIntroTemplate,
  LevelCard,
  EmptyState,
  ProgressStatsPanel,
  createAttemptsStatConfig,
  createProgressStatConfig,
  createErrorsStatConfig,
  createStreakStatConfig,
  type LevelConfig,
} from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { SequenceDisplay } from '../components/SequenceDisplay';
import { ChoicePanel } from '../components/ChoicePanel';
import { MascotRobot } from '../components/MascotRobot';
import { useSuitesIntro } from '../hooks/useSuitesIntro';
import { suitesParentGuideData } from '../data/parentGuideData';
import { spacing } from '../../../theme';

// ============================================
// MAIN SCREEN
// ============================================

export default function SuitesIntroScreen() {
  // Hook orchestrateur - toute la logique métier
  const intro = useSuitesIntro();

  // Render level card - utilise le composant commun LevelCard
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => (
      <LevelCard level={level} isSelected={isSelected} />
    ),
    []
  );

  // Render game area (séquence + choix)
  const renderGame = useCallback(() => {
    if (!intro.currentSequence) {
      return (
        <EmptyState
          message="Sélectionne un niveau pour voir la suite"
          emoji="🔮"
          size="medium"
        />
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

  // Render progress panel using ProgressStatsPanel
  const renderProgress = useCallback(() => {
    const { current, total, totalAttempts, failedAttempts, maxStreak } = intro.progressData;
    const progress = current / total;

    // Build stats array
    const stats = [
      createAttemptsStatConfig(totalAttempts),
      createProgressStatConfig(current, total),
      createErrorsStatConfig(failedAttempts),
    ];

    // Add streak if > 0
    if (maxStreak > 0) {
      stats.push(createStreakStatConfig(maxStreak));
    }

    return (
      <ProgressStatsPanel
        stats={stats}
        progressConfig={{
          progress,
          showProgressBar: true,
        }}
        useGlassEffect
      />
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
  sequenceArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
    marginTop: spacing[2],
  },
  choiceArea: {
    marginBottom: spacing[4],
  },
});
