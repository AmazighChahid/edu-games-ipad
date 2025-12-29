/**
 * BalanceHanoiIntroScreen
 * Écran d'introduction pour le jeu Balance Logique
 * Suit le pattern Hanoi : sélection niveau visible, preview balance en dessous, transition animée
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  ZoomIn,
} from 'react-native-reanimated';

import {
  GameIntroTemplate,
  generateDefaultLevels,
  type LevelConfig,
  type TrainingConfig,
  type TrainingParam,
} from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { BalanceScale } from '../components/BalanceScale';
import { DrHibou } from '../components/DrHibou';
import { BalanceGameScreen } from './BalanceGameScreen';
import { useBalanceGame } from '../hooks/useBalanceGame';
import { useActiveProfile } from '../../../store/useStore';
import { getAllPuzzles, getPuzzleById, getPuzzlesByPhase } from '../data/puzzles';
import { createInitialState, addObjectToPlate } from '../logic/balanceEngine';
import { createObject } from '../data/objects';
import { balanceParentGuideData } from '../data/parentGuideData';
import { colors, spacing, textStyles, borderRadius, shadows, fontFamily, fontSize } from '../../../theme';
import { Icons } from '../../../constants/icons';
import type { Puzzle, Phase, MascotMood } from '../types';
import { PHASE_INFO } from '../types';

// ============================================
// TYPES
// ============================================

type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

// Mapping niveau (1-10) vers puzzle
const LEVEL_TO_PUZZLE_ID: Record<number, string> = {
  1: 'balance_1',  // Phase 1: Première balance
  2: 'balance_3',  // Phase 1: Trois pommes
  3: 'balance_5',  // Phase 1: Quatre fruits
  4: 'balance_6',  // Phase 2: La pastèque mystérieuse
  5: 'balance_8',  // Phase 2: Deux bananes
  6: 'balance_11', // Phase 2: Pastèque + banane
  7: 'balance_13', // Phase 3: Premier calcul
  8: 'balance_16', // Phase 3: Somme à gauche
  9: 'balance_21', // Phase 4: L'inconnue
  10: 'balance_30', // Phase 4: Défi final
};

// ============================================
// HELPER: Create demo balance state
// ============================================

function createDemoBalance(puzzle: Puzzle) {
  let state = createInitialState();

  // Add initial objects from puzzle
  puzzle.initialLeft.forEach(item => {
    for (let i = 0; i < item.count; i++) {
      const obj = createObject(item.objectId, `demo_${item.objectId}_left_${i}`);
      state = addObjectToPlate(state, obj, 'left');
    }
  });

  puzzle.initialRight.forEach(item => {
    for (let i = 0; i < item.count; i++) {
      const obj = createObject(item.objectId, `demo_${item.objectId}_right_${i}`);
      state = addObjectToPlate(state, obj, 'right');
    }
  });

  return state;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export function BalanceHanoiIntroScreen() {
  const router = useRouter();
  const profile = useActiveProfile();

  // État
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase>(1);
  const [mascotMessage, setMascotMessage] = useState("Coucou ! Je suis Dr. Hibou ! Bienvenue dans mon laboratoire !");
  const [mascotMood, setMascotMood] = useState<MascotMood>('curious');
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // Générer les niveaux basés sur l'âge de l'enfant
  const levels = useMemo(() => {
    return generateDefaultLevels('balance', profile?.birthDate, []);
  }, [profile?.birthDate]);

  // Puzzle actuel basé sur le niveau sélectionné
  useEffect(() => {
    if (selectedLevel) {
      const puzzleId = LEVEL_TO_PUZZLE_ID[selectedLevel.number];
      const puzzle = getPuzzleById(puzzleId);
      if (puzzle) {
        setCurrentPuzzle(puzzle);
      }
    } else {
      setCurrentPuzzle(null);
    }
  }, [selectedLevel]);

  // État de démonstration de la balance
  const demoBalanceState = useMemo(() => {
    if (!currentPuzzle) return createInitialState();
    return createDemoBalance(currentPuzzle);
  }, [currentPuzzle]);

  // Configuration entraînement - accès aux modes spéciaux
  const trainingParams: TrainingParam[] = useMemo(() => [
    {
      id: 'phase',
      label: 'Phase',
      type: 'select',
      options: [
        { value: '1', label: `${PHASE_INFO[1].icon} ${PHASE_INFO[1].name}` },
        { value: '2', label: `${PHASE_INFO[2].icon} ${PHASE_INFO[2].name}` },
        { value: '3', label: `${PHASE_INFO[3].icon} ${PHASE_INFO[3].name}` },
        { value: '4', label: `${PHASE_INFO[4].icon} ${PHASE_INFO[4].name}` },
      ],
      defaultValue: '1',
    },
    {
      id: 'mode',
      label: 'Mode',
      type: 'select',
      options: [
        { value: 'levels', label: `${Icons.lab} Niveaux` },
        { value: 'sandbox', label: `${Icons.sandbox} Mode Libre` },
        { value: 'journal', label: `${Icons.journal} Mon Journal` },
      ],
      defaultValue: 'levels',
    },
  ], []);

  const [trainingValues, setTrainingValues] = useState<Record<string, string | number | boolean>>({
    phase: '1',
    mode: 'levels',
  });

  const trainingConfig: TrainingConfig = {
    availableParams: trainingParams,
    currentValues: trainingValues,
    onParamChange: (paramId, value) => {
      setTrainingValues(prev => ({ ...prev, [paramId]: value }));
      if (paramId === 'phase') {
        setSelectedPhase(parseInt(value as string) as Phase);
      }
    },
  };

  // Handlers
  const handleBack = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      setMascotMessage("Tu veux réessayer ? Choisis un niveau !");
      setMascotMood('curious');
    } else {
      router.back();
    }
  }, [isPlaying, router]);

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    const puzzleId = LEVEL_TO_PUZZLE_ID[level.number];
    const puzzle = getPuzzleById(puzzleId);

    if (puzzle) {
      const phaseInfo = PHASE_INFO[puzzle.phase];
      setMascotMessage(`${phaseInfo.icon} ${puzzle.name} ! ${puzzle.description}`);
      setMascotMood('excited');
    }
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel || !currentPuzzle) return;
    setIsPlaying(true);
    setMascotMessage("C'est parti ! Équilibre la balance !");
    setMascotMood('curious');
  }, [selectedLevel, currentPuzzle]);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode(!isTrainingMode);
    setMascotMessage(isTrainingMode
      ? "Retour aux niveaux !"
      : "Mode entraînement ! Explore toutes les phases !");
    setMascotMood('curious');
  }, [isTrainingMode]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage("Place les objets sur la balance pour l'équilibrer ! Quand les deux côtés pèsent pareil, elle reste droite !");
    setMascotMood('excited');
  }, []);

  const handleReset = useCallback(() => {
    setCurrentPuzzle(prev => prev ? { ...prev } : null);
    setMascotMessage("Nouvelle expérience ! Observe bien la balance...");
    setMascotMood('neutral');
  }, []);

  const handleHint = useCallback(() => {
    if (currentPuzzle && currentPuzzle.hints.length > 0) {
      setMascotMessage(currentPuzzle.hints[0]);
      setMascotMood('curious');
    }
  }, [currentPuzzle]);

  // Render level card custom
  const renderLevelCard = useCallback((level: LevelConfig, isSelected: boolean) => {
    const puzzleId = LEVEL_TO_PUZZLE_ID[level.number];
    const puzzle = getPuzzleById(puzzleId);
    const phaseInfo = puzzle ? PHASE_INFO[puzzle.phase] : PHASE_INFO[1];

    return (
      <View
        style={[
          styles.levelCard,
          isSelected && styles.levelCardSelected,
          !level.isUnlocked && styles.levelCardLocked,
          isSelected && { borderColor: phaseInfo.color },
        ]}
      >
        {/* Icône phase */}
        <Text style={styles.levelThemeIcon}>
          {!level.isUnlocked ? Icons.lock : phaseInfo.icon}
        </Text>

        {/* Numéro niveau */}
        <Text
          style={[
            styles.levelNumber,
            isSelected && { color: phaseInfo.color },
            !level.isUnlocked && styles.levelNumberLocked,
          ]}
        >
          {level.number}
        </Text>

        {/* Nom de la phase */}
        <Text style={styles.levelPhaseName}>
          {puzzle ? `P${puzzle.phase}` : ''}
        </Text>

        {/* Étoiles si complété */}
        {level.isCompleted && level.stars !== undefined && (
          <View style={styles.starsRow}>
            {[1, 2, 3].map((star) => (
              <Text
                key={star}
                style={star <= (level.stars || 0) ? styles.starFilled : styles.starEmpty}
              >
                {Icons.starFull}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }, []);

  // Render plate content for demo
  const renderPlateContent = useCallback((side: 'left' | 'right') => {
    const plate = side === 'left' ? demoBalanceState.leftPlate : demoBalanceState.rightPlate;

    return (
      <View style={styles.demoPlateContent}>
        {plate.objects.map((obj) => (
          <Animated.Text
            key={obj.id}
            entering={ZoomIn.delay(300)}
            style={styles.demoObjectEmoji}
          >
            {obj.emoji}
          </Animated.Text>
        ))}
      </View>
    );
  }, [demoBalanceState]);

  // Render game preview / full game
  const renderGame = useCallback(() => {
    // Si on joue, déléguer au BalanceGameScreen existant
    if (isPlaying && currentPuzzle) {
      return (
        <View style={styles.gameFullContainer}>
          <BalanceGameScreen />
        </View>
      );
    }

    // Sinon, afficher la preview de la balance
    if (!currentPuzzle) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyEmoji}>{Icons.owl}</Text>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir l'expérience
          </Text>
        </View>
      );
    }

    const phaseInfo = PHASE_INFO[currentPuzzle.phase];

    return (
      <View style={styles.gameContainer}>
        {/* Preview de la balance */}
        <View style={styles.balancePreviewContainer}>
          <BalanceScale
            balanceState={demoBalanceState}
            leftPlateContent={renderPlateContent('left')}
            rightPlateContent={renderPlateContent('right')}
            showWeightIndicators={currentPuzzle.phase >= 3}
          />
        </View>

        {/* Info du puzzle */}
        <View style={[styles.puzzleInfoCard, { borderColor: phaseInfo.color }]}>
          <View style={styles.puzzleInfoHeader}>
            <Text style={styles.puzzleInfoEmoji}>{phaseInfo.icon}</Text>
            <View>
              <Text style={styles.puzzleInfoTitle}>{currentPuzzle.name}</Text>
              <Text style={styles.puzzleInfoPhase}>{phaseInfo.name}</Text>
            </View>
          </View>
          <Text style={styles.puzzleInfoDescription}>{currentPuzzle.description}</Text>
        </View>

        {/* Bouton Jouer */}
        <Pressable onPress={handleStartPlaying} style={styles.playButton}>
          <LinearGradient
            colors={[colors.primary.main, colors.primary.dark]}
            style={styles.playButtonGradient}
          >
            <Text style={styles.playButtonEmoji}>{Icons.lab}</Text>
            <Text style={styles.playButtonText}>Expérimentons !</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }, [
    isPlaying,
    currentPuzzle,
    demoBalanceState,
    renderPlateContent,
    handleStartPlaying,
  ]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    const allPuzzles = getAllPuzzles();
    const totalPuzzles = allPuzzles.length;
    const completedCount = 0; // TODO: get from store

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{completedCount}</Text>
          <Text style={styles.progressLabel}>/ {totalPuzzles} puzzles</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{currentPuzzle?.phase || '-'}</Text>
          <Text style={styles.progressLabel}>{Icons.experiment} Phase</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>0</Text>
          <Text style={styles.progressLabel}>{Icons.journal} Découvertes</Text>
        </View>
      </View>
    );
  }, [currentPuzzle?.phase]);

  // Render mascot
  const renderMascot = useMemo(() => (
    <DrHibou
      mood={mascotMood}
      message={mascotMessage}
      size="medium"
      position="center"
      showBubble={!isPlaying}
    />
  ), [mascotMessage, mascotMood, isPlaying]);

  return (
    <>
      <GameIntroTemplate
        // Header
        title="Balance Logique"
        emoji={Icons.balance}
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
        mascotComponent={!isPlaying ? renderMascot : undefined}
        mascotMessage={mascotMessage}
        mascotMessageType={
          mascotMood === 'celebratory' ? 'victory' :
          mascotMood === 'excited' ? 'hint' :
          mascotMood === 'curious' ? 'encourage' :
          'intro'
        }

        // Boutons flottants
        showResetButton={!isPlaying}
        onReset={handleReset}
        showHintButton={!isPlaying && !!currentPuzzle}
        onHint={handleHint}
        hintsRemaining={3}
        hintsDisabled={false}

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
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Level cards
  levelCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    minWidth: 80,
    minHeight: 100,
    borderWidth: 3,
    borderColor: colors.background.secondary,
    ...shadows.md,
  },
  levelCardSelected: {
    backgroundColor: colors.primary.light,
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
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  levelNumberLocked: {
    fontSize: 22,
    color: colors.text.muted,
  },
  levelPhaseName: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: spacing[1],
  },
  starFilled: {
    fontSize: 12,
    color: colors.secondary.main,
  },
  starEmpty: {
    fontSize: 12,
    color: colors.text.muted,
    opacity: 0.3,
  },

  // Game container
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  gameFullContainer: {
    flex: 1,
    width: '100%',
  },
  gamePreviewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
    gap: spacing[4],
  },
  gamePreviewEmptyEmoji: {
    fontSize: 64,
  },
  gamePreviewEmptyText: {
    ...textStyles.body,
    color: colors.text.muted,
    textAlign: 'center',
  },

  // Balance preview
  balancePreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  demoPlateContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  demoObjectEmoji: {
    fontSize: 28,
  },

  // Puzzle info card
  puzzleInfoCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: 2,
    ...shadows.md,
    gap: spacing[2],
    width: '100%',
    maxWidth: 320,
  },
  puzzleInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  puzzleInfoEmoji: {
    fontSize: 36,
  },
  puzzleInfoTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    fontFamily: fontFamily.bold,
  },
  puzzleInfoPhase: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  puzzleInfoDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing[2],
  },

  // Play button
  playButton: {
    marginTop: spacing[2],
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  playButtonEmoji: {
    fontSize: 24,
  },
  playButtonText: {
    ...textStyles.button,
    color: colors.text.inverse,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
  },

  // Progress panel
  progressPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing[4],
    ...shadows.md,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    ...textStyles.h3,
    color: colors.primary.main,
    fontFamily: fontFamily.bold,
  },
  progressLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
    fontSize: 10,
  },
  progressDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.background.secondary,
  },
});

export default BalanceHanoiIntroScreen;
