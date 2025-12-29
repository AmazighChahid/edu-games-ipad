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
import { LinearGradient } from 'expo-linear-gradient';

import { GameIntroTemplate, type LevelConfig, PetalsIndicator } from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { SequenceDisplay } from '../components/SequenceDisplay';
import { ChoicePanel } from '../components/ChoicePanel';
import { MascotRobot } from '../components/MascotRobot';
import { useSuitesIntro } from '../hooks/useSuitesIntro';
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
// Avec barres de difficulté visuelles
// ============================================

interface LevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
}

// Mapping difficulté → nombre de barres (1-3)
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

// Couleurs des barres de difficulté
const DIFFICULTY_COLORS = {
  easy: '#7BC74D',    // Vert
  medium: '#FFB347',  // Orange
  hard: '#FF6B6B',    // Rouge
  empty: '#E0E0E0',   // Gris
};

const SuitesLevelCard: React.FC<LevelCardProps> = ({ level, isSelected }) => {
  const difficultyLevel = getDifficultyLevel(level.difficulty);

  // Rendu des barres de difficulté
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

  // Rendu des pétales (score)
  const renderPetals = () => (
    <PetalsIndicator
      filledCount={(level.stars || 0) as 0 | 1 | 2 | 3}
      size="small"
      isSelected={isSelected}
    />
  );

  // Contenu de la carte
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

  // Style de base de la carte
  const containerStyle = [
    styles.levelCard,
    level.isCompleted && styles.levelCardCompleted,
    !level.isUnlocked && styles.levelCardLocked,
  ];

  // Rendu avec gradient si sélectionné, sinon View normale
  if (isSelected) {
    return (
      <LinearGradient
        colors={['#5B8DEE', '#4A7BD9']}
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
  // Custom Level Card - Design avec barres de difficulté
  levelCard: {
    width: 80,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    borderColor: '#E8F5E9',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
    ...shadows.md,
    overflow: 'visible',
  },
  levelCardCompleted: {
    borderColor: '#81C784',
  },
  levelCardSelected: {
    borderColor: '#3D6BC9',
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
    transform: [{ scale: 1.08 }],
  },
  levelCardLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },

  // Barres de difficulté
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

  // Numéro de niveau
  levelNumber: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    fontWeight: '800',
    color: '#5D4E6D',
    lineHeight: 28,
  },
  levelNumberSelected: {
    color: '#FFFFFF',
  },
  levelNumberLocked: {
    fontSize: 28,
  },

  // Badge check complété
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    backgroundColor: '#7BC74D',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  checkBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
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
