/**
 * BalanceIntroScreen
 * Écran d'introduction pour le jeu Balance Logique
 *
 * Architecture : Hook + Template
 * - useBalanceIntro() : toute la logique métier
 * - GameIntroTemplate : UI partagée
 * - Composants spécifiques : DrHibou, BalanceScale
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { GameIntroTemplate, type LevelConfig, PetalsIndicator } from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { VictoryCard, type VictoryBadge } from '../../../components/common';
import { BalanceScale } from '../components/BalanceScale';
import { WeightObject } from '../components/WeightObject';
import { DrHibou } from '../components/DrHibou';
import { useBalanceIntro } from '../hooks/useBalanceIntro';
import { balanceParentGuideData } from '../data/parentGuideData';
import { Icons } from '../../../constants/icons';
import { PHASE_INFO } from '../types';
import type { WeightObject as WeightObjectType } from '../types';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
  fontSize,
  touchTargets,
} from '../../../theme';

// ============================================
// HELPERS
// ============================================

// Fonction pour calculer le badge non-compétitif de Balance
const getBalanceBadge = (attempts: number, hintsUsed: number, stars: number): VictoryBadge => {
  if (stars === 3 && hintsUsed === 0) {
    return { icon: Icons.balance, label: 'Équilibriste' };
  } else if (stars >= 2) {
    return { icon: Icons.experiment, label: 'Scientifique' };
  } else if (hintsUsed >= 2) {
    return { icon: Icons.muscle, label: 'Persévérant' };
  } else {
    return { icon: Icons.star, label: 'Explorateur' };
  }
};

// Calculate stars based on performance
const calculateStars = (attempts: number, hints: number): 1 | 2 | 3 => {
  if (attempts <= 3 && hints === 0) return 3;
  if (attempts <= 5 || hints <= 1) return 2;
  return 1;
};

// ============================================
// CUSTOM LEVEL CARD (spécifique à Balance)
// Avec indicateur de phase coloré
// ============================================

interface LevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
}

const BalanceLevelCard: React.FC<LevelCardProps> = ({ level, isSelected }) => {
  // Extraire la phase depuis le metadata ou utiliser une valeur par défaut
  const phase = (level.metadata?.phase as 1 | 2 | 3 | 4) || 1;
  const phaseInfo = PHASE_INFO[phase];

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
      {/* Indicateur de phase */}
      <View style={[styles.phaseIndicator, { backgroundColor: phaseInfo.color }]}>
        <Text style={styles.phaseIndicatorText}>{phaseInfo.icon}</Text>
      </View>

      {/* Numéro du niveau */}
      <Text
        style={[
          styles.levelNumber,
          isSelected && styles.levelNumberSelected,
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? level.number : Icons.lock}
      </Text>

      {/* Pétales si débloqué */}
      {level.isUnlocked && renderPetals()}

      {/* Badge complété */}
      {level.isCompleted && !isSelected && (
        <View style={[styles.checkBadge, { backgroundColor: phaseInfo.color }]}>
          <Text style={styles.checkBadgeText}>{Icons.checkmark}</Text>
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

  // Rendu avec gradient si sélectionné
  if (isSelected) {
    return (
      <LinearGradient
        colors={[phaseInfo.color, `${phaseInfo.color}DD`]}
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

export default function BalanceIntroScreen() {
  // Hook orchestrateur - toute la logique métier
  const intro = useBalanceIntro();

  // Render custom level card
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => (
      <BalanceLevelCard level={level} isSelected={isSelected} />
    ),
    []
  );

  // Render game area (balance + objets disponibles)
  const renderGame = useCallback(() => {
    if (!intro.currentPuzzle) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir l'expérience
          </Text>
        </View>
      );
    }

    // Render plate content
    const renderPlateContent = (side: 'left' | 'right') => {
      const plate = side === 'left'
        ? intro.balanceState.leftPlate
        : intro.balanceState.rightPlate;

      return (
        <View style={styles.plateContent}>
          {plate.objects.map((obj) => (
            <TouchableOpacity
              key={obj.id}
              onPress={() => intro.handleRemoveObject(obj.id, side)}
              activeOpacity={0.7}
              style={styles.plateObjectTouchable}
            >
              <Animated.View entering={ZoomIn.springify()} style={styles.plateObject}>
                <Text style={styles.plateObjectEmoji}>{obj.emoji}</Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      );
    };

    return (
      <View style={styles.gameArea}>
        {/* Balance */}
        <View style={styles.balanceContainer}>
          <BalanceScale
            balanceState={intro.isPlaying ? intro.balanceState : (intro.previewBalanceState || intro.balanceState)}
            leftPlateContent={renderPlateContent('left')}
            rightPlateContent={renderPlateContent('right')}
            showWeightIndicators={intro.currentPuzzle.phase >= 3}
          />
        </View>

        {/* Objets disponibles (visible en mode jeu) */}
        {intro.isPlaying && (
          <Animated.View entering={FadeIn.delay(300)} style={styles.stockContainer}>
            <Text style={styles.stockTitle}>Objets disponibles</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stockScroll}
            >
              {intro.availableObjects.map((obj) => (
                <WeightObject
                  key={obj.id}
                  object={obj}
                  onDragEnd={(x, y) => {
                    // Déterminer le côté en fonction de la position X
                    const side = x < 200 ? 'left' : 'right';
                    intro.handlePlaceObject(obj, side);
                  }}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    );
  }, [intro]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    const { current, total, attempts, hintsUsed, discoveredEquivalences } = intro.progressData;

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressStatsRow}>
          {/* Niveau actuel */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>NIVEAU</Text>
            <Text style={[styles.progressStatValue, { color: colors.primary.main }]}>
              {current}/{total}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Coups */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>COUPS</Text>
            <Text style={[styles.progressStatValue, { color: colors.text.primary }]}>
              {attempts}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Indices */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>INDICES</Text>
            <Text style={[styles.progressStatValue, { color: colors.secondary.main }]}>
              {hintsUsed}
            </Text>
          </View>

          {discoveredEquivalences > 0 && (
            <>
              <View style={styles.progressDivider} />

              {/* Découvertes */}
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatLabel}>DÉCOUVERTES</Text>
                <Text style={[styles.progressStatValue, { color: colors.feedback.success }]}>
                  {Icons.lab} {discoveredEquivalences}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  }, [intro.progressData]);

  // Calcul des étoiles pour la victoire
  const earnedStars = intro.isVictory
    ? calculateStars(intro.progressData.attempts, intro.progressData.hintsUsed)
    : 1;

  return (
    <>
      <GameIntroTemplate
        // Header
        title="Balance Logique"
        emoji={Icons.balance}
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
          <DrHibou
            mood={intro.mascotEmotion === 'celebratory' ? 'celebratory' :
                  intro.mascotEmotion === 'excited' ? 'excited' :
                  intro.mascotEmotion === 'thinking' ? 'curious' : 'neutral'}
            message={intro.mascotMessage}
            size="medium"
            position="center"
            showBubble={!intro.isVictory}
          />
        }

        // Floating buttons
        showResetButton
        onReset={intro.handleReset}
        showHintButton
        onHint={intro.handleHint}
        hintsRemaining={intro.hintsRemaining}
        hintsDisabled={intro.hintsRemaining === 0}

        // Victory
        isVictory={intro.isVictory}
        victoryComponent={
          intro.isVictory && (
            <VictoryCard
              variant="overlay"
              title="Eurêka !"
              message="Tu as équilibré la balance !"
              mascot={{
                emoji: Icons.owl,
                message: earnedStars === 3 ? 'Parfait !' : 'Bien joué !',
              }}
              stats={{
                moves: intro.progressData.attempts,
                hintsUsed: intro.progressData.hintsUsed,
                stars: earnedStars,
              }}
              badge={getBalanceBadge(intro.progressData.attempts, intro.progressData.hintsUsed, earnedStars)}
              onReplay={intro.handleReset}
              onNextLevel={intro.handleNextLevel}
              hasNextLevel={intro.currentPuzzle !== null}
              nextLevelLabel="Puzzle suivant"
              onHome={intro.handleBack}
            />
          )
        }

        // Mode entrainement désactivé (on utilise sandbox séparé)
        showTrainingMode={false}

        // Bouton play
        playButtonText="C'est parti !"
        playButtonEmoji={Icons.lab}
      />

      {/* Fiche parent de l'activité */}
      <ParentDrawer
        isVisible={intro.showParentDrawer}
        onClose={() => intro.setShowParentDrawer(false)}
        activityName={balanceParentGuideData.activityName}
        activityEmoji={balanceParentGuideData.activityEmoji}
        gameData={balanceParentGuideData.gameData}
        appBehavior={balanceParentGuideData.appBehavior}
        competences={balanceParentGuideData.competences}
        scienceData={balanceParentGuideData.scienceData}
        advices={balanceParentGuideData.advices}
        warningText={balanceParentGuideData.warningText}
        teamMessage={balanceParentGuideData.teamMessage}
        questionsDuring={balanceParentGuideData.questionsDuring}
        questionsAfter={balanceParentGuideData.questionsAfter}
        questionsWarning={balanceParentGuideData.questionsWarning}
        dailyActivities={balanceParentGuideData.dailyActivities}
        transferPhrases={balanceParentGuideData.transferPhrases}
        resources={balanceParentGuideData.resources}
        badges={balanceParentGuideData.badges}
        ageExpectations={balanceParentGuideData.ageExpectations}
        settings={balanceParentGuideData.settings}
      />
    </>
  );
}

// ============================================
// STYLES (spécifiques à ce jeu)
// ============================================

const styles = StyleSheet.create({
  // Custom Level Card - Design avec indicateur de phase
  levelCard: {
    width: 80,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    borderColor: '#E3F2FD',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
    ...shadows.md,
    overflow: 'visible',
    position: 'relative',
  },
  levelCardCompleted: {
    borderColor: '#81C784',
  },
  levelCardSelected: {
    borderColor: 'transparent',
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  levelCardLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },

  // Indicateur de phase
  phaseIndicator: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...shadows.sm,
  },
  phaseIndicatorText: {
    fontSize: fontSize.xs,
  },

  // Numéro de niveau
  levelNumber: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    color: '#5D4E6D',
    lineHeight: 32,
  },
  levelNumberSelected: {
    color: '#FFFFFF',
  },
  levelNumberLocked: {
    fontSize: fontSize.xl,
  },

  // Badge check complété
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...shadows.sm,
  },
  checkBadgeText: {
    fontSize: fontSize.xs,
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
    fontSize: fontSize.lg,
    color: colors.text.muted,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
  },
  gameArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  balanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },

  // Plate content
  plateContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  plateObjectTouchable: {
    minWidth: touchTargets.minimum,
    minHeight: touchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateObject: {
    padding: spacing[1],
  },
  plateObjectEmoji: {
    fontSize: fontSize['2xl'],
  },

  // Stock d'objets
  stockContainer: {
    width: '100%',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    ...shadows.sm,
  },
  stockTitle: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  stockScroll: {
    gap: spacing[3],
    paddingVertical: spacing[2],
  },

  // Progress Panel (style similaire à Suites Logiques)
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
    color: '#A0AEC0',
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },
  progressStatValue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    fontWeight: '700',
    lineHeight: 28,
  },
  progressDivider: {
    width: 2,
    height: 36,
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },
});
