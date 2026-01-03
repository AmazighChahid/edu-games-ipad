/**
 * LogixGridIntroScreen
 * Ecran d'introduction pour le jeu Logix Grid
 *
 * Architecture : Hook + Template
 * - useLogixGridIntro() : toute la logique metier
 * - GameIntroTemplate : UI partagee
 * - Composants specifiques : AdaMascot, LogixGrid, CluePanel
 *
 * VUE isPlaying=true :
 * - Header avec badges niveau et progression
 * - Layout 2 colonnes : CluePanel (gauche) + LogixGrid (droite)
 * - Mascotte Ada en bas avec bulle dialogue
 * - Bouton aide flottant
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  GameIntroTemplate,
  VictoryCard,
  LevelCard,
  type LevelConfig,
} from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { Icons } from '../../../constants/icons';
import { theme } from '../../../theme';
import { AdaMascot } from '../components/AdaMascot';
import { CluePanel } from '../components/CluePanel';
import { LogixGrid } from '../components/LogixGrid';
import { logixGridParentGuideData } from '../data/parentGuideData';
import { useLogixGridIntro } from '../hooks/useLogixGridIntro';

// ============================================
// MAIN SCREEN
// ============================================

export default function LogixGridIntroScreen() {
  // Hook orchestrateur - toute la logique métier
  const intro = useLogixGridIntro();

  // ============================================
  // RENDER LEVEL CARD - Utilise le composant commun LevelCard
  // ============================================
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => (
      <LevelCard level={level} isSelected={isSelected} />
    ),
    []
  );

  // ============================================
  // RENDER GAME - Zone de jeu principale
  // ============================================
  const renderGame = useCallback(() => {
    // Etat vide - pas de niveau selectionne
    if (!intro.gameState) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Selectionne un niveau pour commencer
          </Text>
        </View>
      );
    }

    // ========================================
    // MODE PLAYING - Jeu actif
    // Layout 2 colonnes : CluePanel (40%) + LogixGrid (60%)
    // ========================================
    if (intro.isPlaying) {
      return (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.playingContainer}
        >
          {/* Zone de jeu principale : 2 colonnes */}
          <View style={styles.gameColumnsContainer}>
            {/* Panneau des indices - 40% */}
            <View style={styles.cluePanel}>
              <CluePanel
                clues={intro.gameState.puzzle.clues}
                usedClueIds={intro.gameState.usedClueIds}
                activeClueId={intro.gameState.activeHint?.clueId ?? null}
                onCluePress={intro.handleClueUse}
              />
            </View>

            {/* Grille de jeu - 60% */}
            <View style={styles.gridPanel}>
              <LogixGrid
                gameState={intro.gameState}
                errors={intro.errors}
                onCellToggle={intro.handleCellToggle}
                onCellSelect={intro.handleCellSelect}
                getCellState={intro.getCellStateValue}
                showLegend={true}
              />
            </View>
          </View>
          {/* Note: La mascotte est affichée par GameIntroTemplate via mascotComponent */}
        </Animated.View>
      );
    }

    // ========================================
    // MODE INTRO - Apercu du niveau
    // Grille seule en preview
    // ========================================
    return (
      <View style={styles.previewContainer}>
        <LogixGrid
          gameState={intro.gameState}
          errors={intro.errors}
          onCellToggle={intro.handleCellToggle}
          onCellSelect={intro.handleCellSelect}
          getCellState={intro.getCellStateValue}
          showLegend={false}
        />
      </View>
    );
  }, [intro]);

  // ============================================
  // RENDER PROGRESS - Panneau de progression
  // ============================================
  const renderProgress = useCallback(() => {
    if (!intro.isPlaying || !intro.gameState) return null;

    const { cluesUsed, totalClues, timeElapsed } = intro.progressData;

    // Formater le temps en mm:ss
    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressStatsRow}>
          {/* Timer */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>TEMPS</Text>
            <Text style={[styles.progressStatValue, { color: theme.colors.primary.main }]}>
              {Icons.timer} {formatTime(timeElapsed)}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Indices utilisés */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>INDICES</Text>
            <Text style={[styles.progressStatValue, { color: theme.colors.feedback.success }]}>
              {cluesUsed}/{totalClues}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Aides restantes */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>AIDES</Text>
            <Text style={[styles.progressStatValue, { color: theme.colors.secondary.main }]}>
              {Icons.lightbulb} {intro.hintsRemaining}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [intro.isPlaying, intro.gameState, intro.progressData, intro.hintsRemaining]);

  // ============================================
  // ÉCRAN DE VICTOIRE
  // ============================================
  if (intro.isVictory && intro.result) {
    return (
      <VictoryCard
        title="Enquête résolue !"
        celebrationEmoji={Icons.search}
        message="Tu es un super détective !"
        stats={{
          timeElapsed: intro.result.timeSeconds,
          stars: intro.result.stars,
          hintsUsed: intro.result.hintsUsed,
          customStats: [
            {
              label: 'Actions',
              value: intro.result.actionCount,
              icon: Icons.target,
            },
            {
              label: 'Score',
              value: `${intro.result.score} pts`,
              icon: Icons.star,
            },
          ],
        }}
        onReplay={intro.handleReset}
        onHome={intro.handleBack}
      />
    );
  }

  // ============================================
  // ÉCRAN PRINCIPAL - GameIntroTemplate
  // ============================================
  return (
    <>
      <GameIntroTemplate
        // Header
        title="Logix Grid"
        emoji={Icons.search}
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

        // Mascotte Ada
        mascotComponent={
          <AdaMascot
            message={intro.mascotMessage}
            emotion={intro.mascotEmotion}
            visible={true}
          />
        }

        // Boutons flottants
        showResetButton={intro.isPlaying}
        onReset={intro.handleReset}
        showHintButton={intro.isPlaying}
        onHint={intro.handleHintRequest}
        hintsRemaining={intro.hintsRemaining}
        hintsDisabled={intro.hintsRemaining === 0}

        // Victory
        isVictory={intro.isVictory}

        // Mode entrainement désactivé
        showTrainingMode={false}
      />

      {/* Fiche parent de l'activité */}
      <ParentDrawer
        isVisible={intro.showParentDrawer}
        onClose={() => intro.setShowParentDrawer(false)}
        activityName={logixGridParentGuideData.activityName}
        activityEmoji={logixGridParentGuideData.activityEmoji}
        gameData={logixGridParentGuideData.gameData}
        appBehavior={logixGridParentGuideData.appBehavior}
        competences={logixGridParentGuideData.competences}
        scienceData={logixGridParentGuideData.scienceData}
        advices={logixGridParentGuideData.advices}
        warningText={logixGridParentGuideData.warningText}
        teamMessage={logixGridParentGuideData.teamMessage}
        questionsDuring={logixGridParentGuideData.questionsDuring}
        questionsAfter={logixGridParentGuideData.questionsAfter}
        questionsWarning={logixGridParentGuideData.questionsWarning}
        dailyActivities={logixGridParentGuideData.dailyActivities}
        transferPhrases={logixGridParentGuideData.transferPhrases}
        resources={logixGridParentGuideData.resources}
        badges={logixGridParentGuideData.badges}
        ageExpectations={logixGridParentGuideData.ageExpectations}
        settings={logixGridParentGuideData.settings}
      />
    </>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // =====================
  // ETAT VIDE
  // =====================
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[8],
  },
  emptyStateText: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },

  // =====================
  // MODE INTRO - APERCU
  // =====================
  previewContainer: {
    flex: 1,
    width: '100%',
    opacity: 0.85,
    alignItems: 'center',
  },

  // =====================
  // MODE PLAYING - LAYOUT PRINCIPAL
  // =====================
  playingContainer: {
    flex: 1,
    width: '100%',
  },

  // Zone de jeu 2 colonnes
  gameColumnsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: theme.spacing[2],
    gap: theme.spacing[3],
  },
  cluePanel: {
    flex: 4, // 40%
    minWidth: 280,
    maxWidth: 400,
  },
  gridPanel: {
    flex: 6, // 60%
    justifyContent: 'center',
    alignItems: 'center',
  },

  // =====================
  // PROGRESS PANEL
  // =====================
  progressPanel: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    ...theme.shadows.md,
  },
  progressStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  progressStatItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  progressStatLabel: {
    fontSize: 11,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.text.muted,
    letterSpacing: 0.5,
    marginBottom: theme.spacing[1],
  },
  progressStatValue: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.xl,
    lineHeight: 28,
  },
  progressDivider: {
    width: 2,
    height: 32,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 1,
  },
});
