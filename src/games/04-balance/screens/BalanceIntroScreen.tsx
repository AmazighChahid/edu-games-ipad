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

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { Phase } from '../types';

import {
  GameIntroTemplate,
  type LevelConfig,
  PetalsIndicator,
  VictoryCard,
  type VictoryBadge,
  AgeGroupSelector,
  EmptyState,
  ProgressStatsPanel,
  createProgressStatConfig,
  createAttemptsStatConfig,
  createHintsStatConfig,
  type StatConfig,
} from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
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
// AGE GROUP OPTIONS (pour AgeGroupSelector)
// ============================================

const AGE_OPTIONS = [
  { id: '6-7' as const, label: '6-7 ans', phase: 1 as Phase },
  { id: '7-8' as const, label: '7-8 ans', phase: 2 as Phase },
  { id: '8-9' as const, label: '8-9 ans', phase: 3 as Phase },
  { id: '9-10' as const, label: '9-10 ans', phase: 4 as Phase },
];

// Helper pour convertir Phase en AgeGroup
const phaseToAgeGroup = (phase: Phase): '6-7' | '7-8' | '8-9' | '9-10' => {
  const mapping: Record<Phase, '6-7' | '7-8' | '8-9' | '9-10'> = {
    1: '6-7',
    2: '7-8',
    3: '8-9',
    4: '9-10',
  };
  return mapping[phase];
};

// Helper pour convertir AgeGroup en Phase
const ageGroupToPhase = (ageGroup: '6-7' | '7-8' | '8-9' | '9-10'): Phase => {
  const mapping: Record<string, Phase> = {
    '6-7': 1,
    '7-8': 2,
    '8-9': 3,
    '9-10': 4,
  };
  return mapping[ageGroup];
};

// ============================================
// JOURNAL BUTTON
// ============================================

interface JournalButtonProps {
  onPress: () => void;
}

const JournalButton: React.FC<JournalButtonProps> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    style={styles.journalButton}
    accessibilityLabel="Ouvrir le journal"
    accessibilityRole="button"
  >
    <Text style={styles.journalButtonIcon}>{Icons.journal}</Text>
  </Pressable>
);

// ============================================
// CUSTOM LEVEL CARD (spécifique à Balance)
// Avec indicateur de phase coloré
// ============================================

interface LevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
}

const BalanceLevelCard: React.FC<LevelCardProps> = ({ level, isSelected }) => {
  // Cas spécial : Niveau 0 = Mode Libre
  const isFreeMode = level.number === 0 || level.config?.isFreeMode;

  if (isFreeMode) {
    const containerStyle = [
      styles.levelCard,
      styles.freeModeCard,
      isSelected && styles.freeModeCardSelected,
    ];

    const content = (
      <>
        <Text style={styles.freeModeIcon}>{Icons.palette}</Text>
        <Text style={[styles.freeModeLabel, isSelected && styles.freeModeLabelSelected]}>
          Libre
        </Text>
      </>
    );

    if (isSelected) {
      return (
        <LinearGradient
          colors={[colors.secondary.main, colors.secondary.dark || '#E67E22']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[containerStyle, styles.freeModeCardSelected]}
        >
          {content}
        </LinearGradient>
      );
    }

    return <View style={containerStyle}>{content}</View>;
  }

  // Extraire la phase depuis le config ou utiliser une valeur par défaut
  const phase = (level.config?.phase as 1 | 2 | 3 | 4) || 1;
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
        <EmptyState
          message="Sélectionne un niveau pour voir l'expérience"
          emoji={Icons.balance}
          size="medium"
        />
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

    // Mode aperçu (pas en train de jouer)
    if (!intro.isPlaying) {
      return (
        <View style={styles.gameArea}>
          <View style={styles.balanceContainerPreview}>
            <BalanceScale
              balanceState={intro.previewBalanceState || intro.balanceState}
              leftPlateContent={renderPlateContent('left')}
              rightPlateContent={renderPlateContent('right')}
              showWeightIndicators={intro.currentPuzzle.phase >= 3}
            />
          </View>
        </View>
      );
    }

    // Mode jeu actif : layout 2 colonnes (balance à gauche, objets à droite)
    return (
      <View style={styles.gameAreaPlaying}>
        {/* Colonne gauche : Balance */}
        <View style={styles.balanceColumn}>
          <BalanceScale
            balanceState={intro.balanceState}
            leftPlateContent={renderPlateContent('left')}
            rightPlateContent={renderPlateContent('right')}
            showWeightIndicators={intro.currentPuzzle.phase >= 3}
          />
        </View>

        {/* Colonne droite : Objets disponibles */}
        <Animated.View entering={FadeIn.delay(300)} style={styles.stockColumn}>
          <Text style={styles.stockTitle}>Objets disponibles</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.stockScrollVertical}
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
      </View>
    );
  }, [intro]);

  // Build progress stats using memoized helper
  const progressStats = useMemo(() => {
    const { current, total, attempts, hintsUsed, discoveredEquivalences } = intro.progressData;

    const stats: StatConfig[] = [
      createProgressStatConfig(current, total),
      createAttemptsStatConfig(attempts),
      createHintsStatConfig(hintsUsed, 3), // Max 3 hints
    ];

    // Add discoveries if any
    if (discoveredEquivalences > 0) {
      stats.push({
        id: 'discoveries',
        label: 'DÉCOUVERTES',
        value: `${Icons.lab} ${discoveredEquivalences}`,
        color: colors.feedback.success,
      });
    }

    return stats;
  }, [intro.progressData]);

  // Render progress panel using ProgressStatsPanel
  const renderProgress = useCallback(() => {
    return (
      <ProgressStatsPanel
        stats={progressStats}
        useGlassEffect
      />
    );
  }, [progressStats]);

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
        headerRightContent={
          <View style={styles.headerButtons}>
            <AgeGroupSelector
              selectedAge={phaseToAgeGroup(intro.selectedPhase)}
              onAgeChange={(ageGroup) => intro.handlePhaseChange(ageGroupToPhase(ageGroup))}
            />
            <JournalButton onPress={intro.handleGoToJournal} />
          </View>
        }

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
            position="left"
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

  // Mode Libre (niveau 0)
  freeModeCard: {
    backgroundColor: colors.secondary.light || '#FFF3E0',
    borderColor: colors.secondary.main,
    borderStyle: 'dashed',
  },
  freeModeCardSelected: {
    borderColor: 'transparent',
    borderStyle: 'solid',
    shadowColor: colors.secondary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  freeModeIcon: {
    fontSize: fontSize['2xl'],
    marginBottom: spacing[1],
  },
  freeModeLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.secondary.dark || '#E67E22',
  },
  freeModeLabelSelected: {
    color: '#FFFFFF',
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

  // Mode aperçu (isPlaying = false)
  gameArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  balanceContainerPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 0.7 }],  // Réduit pour l'aperçu
    opacity: 0.85,
  },
  // Mode jeu (isPlaying = true) - Layout 2 colonnes
  gameAreaPlaying: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: spacing[2],
    gap: spacing[4],
  },
  balanceColumn: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: spacing[2],
  },
  stockColumn: {
    flex: 1,
    minWidth: 120,
    maxWidth: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.xl,
    padding: spacing[3],
    ...shadows.md,
  },

  // Plate content
  plateContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    overflow: 'hidden',
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

  // Stock d'objets (styles pour le panneau vertical à droite)
  stockTitle: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  stockScrollVertical: {
    alignItems: 'center',
    gap: spacing[3],
    paddingBottom: spacing[4],
  },

  // Header buttons container
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },

  // Journal button
  journalButton: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    borderRadius: touchTargets.minimum / 2,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.secondary.light || '#FFE0B2',
    ...shadows.sm,
  },
  journalButtonIcon: {
    fontSize: fontSize.xl,
  },
});
