/**
 * HanoiIntroScreen
 * Écran d'introduction pour le jeu Tour de Hanoï
 *
 * Architecture : Hook + Template
 * - useHanoiIntro() : toute la logique métier
 * - GameIntroTemplate : UI partagée
 * - Composants spécifiques : HanoiMascot, HanoiLevelCard, ProgressPanel
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { GameIntroTemplate, type LevelConfig } from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import {
  DraggableGameBoard,
  VictoryOverlay,
  ProgressPanel,
} from '../components';
import { HanoiMascot } from '../components/HanoiMascot';
import { HanoiLevelCard } from '../components/HanoiLevelCard';
import { useHanoiIntro } from '../hooks/useHanoiIntro';
import { hanoiParentGuideData } from '../data/parentGuideData';
import { Icons } from '../../../constants/icons';
import { colors, spacing, borderRadius, shadows, fontFamily } from '../../../theme';

// ============================================
// DEMO MODAL (extracted from original)
// ============================================

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
  onShowTutorial?: () => void;
}

function HanoiDemoModal({ visible, onClose, onShowTutorial }: HowToPlayModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.demoOverlay}>
        <Animated.View entering={FadeIn} style={styles.demoModal}>
          <Pressable onPress={onClose} style={styles.demoCloseButton}>
            <Text style={styles.demoCloseText}>{Icons.close}</Text>
          </Pressable>

          <Text style={styles.demoTitle}>Comment jouer</Text>

          {/* Objectif */}
          <Text style={styles.demoObjective}>
            L'objectif est de déplacer tous les disques de la tour de gauche vers la tour de droite.
          </Text>

          {/* Démo visuelle */}
          <View style={styles.demoArea}>
            <View style={styles.demoPlatform} />
            <View style={styles.demoTowers}>
              <View style={styles.demoTowerContainer}>
                <View style={styles.demoTowerPole} />
                <Text style={styles.demoTowerLabel}>A</Text>
                <View style={styles.demoDisksContainer}>
                  <View style={[styles.demoDiskStyle, styles.demoDiskSmall]} />
                  <View style={[styles.demoDiskStyle, styles.demoDiskMedium]} />
                  <View style={[styles.demoDiskStyle, styles.demoDiskLarge]} />
                </View>
              </View>
              <View style={styles.demoTowerContainer}>
                <View style={styles.demoTowerPole} />
                <Text style={styles.demoTowerLabel}>B</Text>
              </View>
              <View style={styles.demoTowerContainer}>
                <View style={[styles.demoTowerPole, styles.demoTowerPoleTarget]} />
                <Text style={[styles.demoTowerLabel, styles.demoTowerLabelTarget]}>C</Text>
              </View>
            </View>
          </View>

          {/* Règles */}
          <View style={styles.demoSection}>
            <Text style={styles.demoSectionTitle}>Règles :</Text>
            <View style={styles.demoRulesList}>
              <View style={styles.demoRuleItem}>
                <Text style={styles.demoRuleBullet}>•</Text>
                <Text style={styles.demoRuleText}>Un seul disque peut être déplacé à la fois</Text>
              </View>
              <View style={styles.demoRuleItem}>
                <Text style={styles.demoRuleBullet}>•</Text>
                <Text style={styles.demoRuleText}>Un disque ne peut être placé que sur un disque plus grand ou sur une tour vide</Text>
              </View>
              <View style={styles.demoRuleItem}>
                <Text style={styles.demoRuleBullet}>•</Text>
                <Text style={styles.demoRuleText}>Touche une tour pour prendre ou déposer un disque</Text>
              </View>
            </View>
          </View>

          {/* Contrôles */}
          <View style={styles.demoSection}>
            <Text style={styles.demoSectionTitle}>Contrôles :</Text>
            <View style={styles.demoRulesList}>
              <View style={styles.demoRuleItem}>
                <Text style={styles.demoRuleBullet}>•</Text>
                <View style={styles.demoRuleTextContainer}>
                  <Text style={styles.demoRuleBold}>Toucher </Text>
                  <Text style={styles.demoRuleText}>une tour pour sélectionner/désélectionner</Text>
                </View>
              </View>
              <View style={styles.demoRuleItem}>
                <Text style={styles.demoRuleBullet}>•</Text>
                <View style={styles.demoRuleTextContainer}>
                  <Text style={styles.demoRuleBold}>Glisser </Text>
                  <Text style={styles.demoRuleText}>un disque vers une autre tour</Text>
                </View>
              </View>
              <View style={styles.demoRuleItem}>
                <Text style={styles.demoRuleBullet}>•</Text>
                <View style={styles.demoRuleTextContainer}>
                  <Text style={styles.demoRuleBold}>Double-tap </Text>
                  <Text style={styles.demoRuleText}>pour annuler la sélection</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Boutons */}
          <View style={styles.demoButtonsRow}>
            <Pressable onPress={onClose} style={styles.demoButtonPrimary}>
              <Text style={styles.demoButtonIcon}>{Icons.check}</Text>
              <Text style={styles.demoButtonPrimaryText}>Compris !</Text>
            </Pressable>
            {onShowTutorial && (
              <Pressable onPress={onShowTutorial} style={styles.demoButtonSecondary}>
                <Text style={styles.demoButtonIcon}>{Icons.play}</Text>
                <Text style={styles.demoButtonSecondaryText}>Voir le tutoriel</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ============================================
// MAIN SCREEN
// ============================================

export function HanoiIntroScreen() {
  // Hook orchestrateur - toute la logique métier
  const intro = useHanoiIntro();

  // Render custom level card
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => (
      <HanoiLevelCard level={level} isSelected={isSelected} />
    ),
    []
  );

  // Render game area (draggable game board)
  const renderGame = useCallback(() => {
    return (
      <View style={styles.boardContainer}>
        <DraggableGameBoard
          gameState={intro.gameState}
          totalDisks={intro.level.diskCount}
          onMove={intro.handleMove}
          hasMovedOnce={intro.hasMovedOnce}
          highlightedTowers={intro.highlightedTowers}
        />

        {/* Hint Toast */}
        {intro.hintMessage && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.hintToast}>
            <Text style={styles.hintToastText}>{intro.hintMessage}</Text>
          </Animated.View>
        )}
      </View>
    );
  }, [intro.gameState, intro.level.diskCount, intro.handleMove, intro.hasMovedOnce, intro.highlightedTowers, intro.hintMessage]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    return (
      <ProgressPanel
        currentMoves={intro.moveCount}
        optimalMoves={intro.level.optimalMoves ?? 7}
        progress={intro.progress}
        bestMoves={intro.bestMoves}
        visible={!intro.isVictory}
      />
    );
  }, [intro.moveCount, intro.level.optimalMoves, intro.progress, intro.bestMoves, intro.isVictory]);

  // Check if there's a next level
  const hasNextLevel = intro.selectedLevel
    ? intro.levels.findIndex((l) => l.id === intro.selectedLevel?.id) < intro.levels.length - 1
    : false;

  return (
    <>
      <GameIntroTemplate
        // Header
        title="La Tour Magique"
        emoji={Icons.castle}
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
          <HanoiMascot
            message={intro.mascotMessage}
            emotion={intro.mascotEmotion}
            visible={!intro.isVictory}
          />
        }

        // Floating buttons
        showResetButton
        onReset={intro.handleReset}
        showHintButton={intro.gameMode !== 'expert'}
        onHint={intro.handleHint}
        hintsRemaining={intro.hintsRemaining}
        hintsDisabled={intro.hintsRemaining === 0}
        showForceCompleteButton={intro.devMode}
        onForceComplete={intro.handleForceComplete}

        // Victory
        isVictory={intro.isVictory}
        victoryComponent={
          <VictoryOverlay
            visible={intro.isVictory}
            moves={intro.moveCount}
            optimalMoves={intro.level.optimalMoves ?? 7}
            timeElapsed={intro.timeElapsed}
            hintsUsed={intro.hintsUsed}
            levelId={intro.level.id}
            hasNextLevel={hasNextLevel}
            onNextLevel={intro.handleNextLevel}
            onReplay={intro.handleReplay}
            onHome={intro.handleBack}
          />
        }
      />

      {/* Parent Drawer */}
      <ParentDrawer
        isVisible={intro.showParentDrawer}
        onClose={() => intro.setShowParentDrawer(false)}
        // Activity data from parentGuideData
        activityName={hanoiParentGuideData.activityName}
        activityEmoji={hanoiParentGuideData.activityEmoji}
        gameData={hanoiParentGuideData.gameData}
        appBehavior={hanoiParentGuideData.appBehavior}
        competences={hanoiParentGuideData.competences}
        scienceData={hanoiParentGuideData.scienceData}
        algorithmData={hanoiParentGuideData.algorithmData}
        advices={hanoiParentGuideData.advices}
        warningText={hanoiParentGuideData.warningText}
        teamMessage={hanoiParentGuideData.teamMessage}
        questionsDuring={hanoiParentGuideData.questionsDuring}
        questionsAfter={hanoiParentGuideData.questionsAfter}
        questionsWarning={hanoiParentGuideData.questionsWarning}
        dailyActivities={hanoiParentGuideData.dailyActivities}
        transferPhrases={hanoiParentGuideData.transferPhrases}
        resources={hanoiParentGuideData.resources}
        badges={hanoiParentGuideData.badges}
        ageExpectations={hanoiParentGuideData.ageExpectations}
        settings={hanoiParentGuideData.settings}
        // Dynamic game state
        stats={{
          totalGames: 12,
          successfulGames: 8,
          totalTime: '45min',
        }}
        progress={{
          currentLevel: intro.level.diskCount,
          maxLevel: 8,
          progressPercent: Math.round((intro.level.diskCount / 8) * 100),
          nextObjective: `Prochain objectif : ${intro.level.diskCount + 1} disques`,
        }}
        currentMode={intro.gameMode}
        onModeChange={intro.handleModeChange}
        childAge={8}
        hintsRemaining={intro.hintsRemaining}
        maxHints={intro.maxHints}
        onHintPress={intro.handleHint}
        // Legacy props
        currentMoves={intro.moveCount}
        optimalMoves={intro.level.optimalMoves ?? 7}
        currentLevel={intro.level.diskCount}
      />

      {/* Demo Modal */}
      <HanoiDemoModal
        visible={intro.showDemo}
        onClose={() => intro.setShowDemo(false)}
      />
    </>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Game board container
  boardContainer: {
    flex: 1,
    minHeight: 400,
    maxHeight: 550,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hint toast
  hintToast: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  hintToastText: {
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
    color: colors.primary.contrast,
  },

  // Demo Modal styles
  demoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoModal: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    width: '90%',
    maxWidth: 500,
    alignItems: 'center',
    ...shadows.lg,
  },
  demoCloseButton: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoCloseText: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  demoTitle: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: colors.primary.light,
    marginBottom: spacing[4],
  },
  demoObjective: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[4],
    paddingHorizontal: spacing[2],
  },
  demoSection: {
    alignSelf: 'stretch',
    marginTop: spacing[3],
  },
  demoSectionTitle: {
    fontSize: 17,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  demoRulesList: {
    alignSelf: 'stretch',
  },
  demoRuleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
    paddingLeft: spacing[1],
  },
  demoRuleBullet: {
    fontSize: 16,
    color: colors.text.muted,
    marginRight: spacing[2],
    marginTop: 3,
  },
  demoRuleTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  demoRuleText: {
    fontSize: 15,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  demoRuleBold: {
    fontSize: 15,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
    lineHeight: 22,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[4],
  },
  demoButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.round,
    gap: spacing[2],
    minHeight: 52,
  },
  demoButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary.light,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.round,
    gap: spacing[2],
    minHeight: 52,
  },
  demoButtonIcon: {
    fontSize: 18,
  },
  demoButtonPrimaryText: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
  },
  demoButtonSecondaryText: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.background.primary,
  },
  demoArea: {
    width: '100%',
    height: 140,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing[2],
  },
  demoPlatform: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 10,
    backgroundColor: colors.game.towerBase,
    borderRadius: 5,
  },
  demoTowers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: 110,
  },
  demoTowerContainer: {
    alignItems: 'center',
    width: 80,
  },
  demoTowerPole: {
    width: 6,
    height: 80,
    backgroundColor: colors.game.towerBase,
    borderRadius: 3,
  },
  demoTowerPoleTarget: {
    backgroundColor: colors.feedback.success,
  },
  demoTowerLabel: {
    marginTop: spacing[1],
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.text.secondary,
  },
  demoTowerLabelTarget: {
    color: colors.feedback.success,
  },
  demoDisksContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  demoDiskStyle: {
    height: 14,
    borderRadius: 7,
    marginBottom: 2,
  },
  demoDiskSmall: {
    width: 28,
    backgroundColor: colors.game.disk1,
    zIndex: 3,
  },
  demoDiskMedium: {
    width: 44,
    backgroundColor: colors.game.disk2,
    zIndex: 2,
  },
  demoDiskLarge: {
    width: 60,
    backgroundColor: colors.game.disk3,
    zIndex: 1,
  },
  demoHintContainer: {
    marginTop: spacing[4],
    minHeight: 30,
    justifyContent: 'center',
  },
  demoHint: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: colors.primary.main,
    textAlign: 'center',
  },
  demoRules: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[4],
    gap: spacing[3],
  },
  demoRule: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.text.muted,
  },
  demoRuleSeparator: {
    color: colors.text.muted,
  },
  demoButton: {
    marginTop: spacing[5],
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[8],
    borderRadius: borderRadius.lg,
    minHeight: 64,
    justifyContent: 'center',
  },
  demoButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
  },
});

export default HanoiIntroScreen;
