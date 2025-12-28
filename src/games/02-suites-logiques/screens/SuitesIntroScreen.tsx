/**
 * SuitesIntroScreen
 * Écran d'introduction pour le jeu Suites Logiques
 * Suit le pattern Hanoi : sélection niveau visible, jeu en dessous, transition animée
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  FadeIn,
} from 'react-native-reanimated';

import {
  GameIntroTemplate,
  generateDefaultLevels,
  type LevelConfig,
  type TrainingConfig,
  type TrainingParam,
} from '../../../components/common';
import { SequenceDisplay } from '../components/SequenceDisplay';
import { ChoicePanel } from '../components/ChoicePanel';
import { MascotRobot } from '../components/MascotRobot';
import { useSuitesGame } from '../hooks/useSuitesGame';
import { useSuitesSound } from '../hooks/useSuitesSound';
import { useActiveProfile } from '../../../store/useStore';
import { THEMES, getUnlockedThemes } from '../data/themes';
import { PIXEL_MESSAGES } from '../constants/gameConfig';
import { colors, spacing, textStyles, borderRadius, shadows, fontFamily } from '../../../theme';
import type { ThemeType, SequenceElement } from '../types';

// ============================================
// TYPES
// ============================================

type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

// Mapping niveau -> difficulté thème
const LEVEL_TO_THEME_DIFFICULTY: Record<number, { patterns: number; distractors: number }> = {
  1: { patterns: 1, distractors: 2 },  // ABAB simple, 2 distracteurs
  2: { patterns: 1, distractors: 3 },  // ABAB, 3 distracteurs
  3: { patterns: 2, distractors: 3 },  // AABB, 3 distracteurs
  4: { patterns: 2, distractors: 4 },  // AABB + AAB, 4 distracteurs
  5: { patterns: 3, distractors: 4 },  // ABC introduit
  6: { patterns: 3, distractors: 5 },  // ABC + mélanges
  7: { patterns: 4, distractors: 5 },  // Patterns complexes
  8: { patterns: 4, distractors: 6 },  // Croissant/Décroissant
  9: { patterns: 5, distractors: 6 },  // Numériques
  10: { patterns: 5, distractors: 7 }, // Expert - tous patterns
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function SuitesIntroScreen() {
  const router = useRouter();
  const profile = useActiveProfile();

  // État
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('shapes');
  const [mascotMessage, setMascotMessage] = useState("Bip bop ! Choisis un niveau pour commencer !");
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');

  // Générer les niveaux basés sur l'âge de l'enfant
  const levels = useMemo(() => {
    return generateDefaultLevels('suites-logiques', profile?.birthDate, []);
  }, [profile?.birthDate]);

  // Thèmes débloqués
  const unlockedThemes = useMemo(() => {
    return getUnlockedThemes({
      totalSequences: 0, // TODO: récupérer depuis le store
      currentLevel: selectedLevel?.number || 1,
      unlockedThemes: ['shapes', 'colors', 'farm'],
    });
  }, [selectedLevel]);

  // Configuration entraînement
  const trainingParams: TrainingParam[] = useMemo(() => [
    {
      id: 'theme',
      label: 'Thème',
      type: 'select',
      options: unlockedThemes.map(themeId => ({
        value: themeId,
        label: `${THEMES[themeId].icon} ${THEMES[themeId].name}`,
      })),
      defaultValue: 'shapes',
    },
    {
      id: 'difficulty',
      label: 'Difficulté',
      type: 'select',
      options: [
        { value: 'easy', label: 'Facile' },
        { value: 'medium', label: 'Moyen' },
        { value: 'hard', label: 'Difficile' },
      ],
      defaultValue: 'medium',
    },
  ], [unlockedThemes]);

  const [trainingValues, setTrainingValues] = useState<Record<string, string | number | boolean>>({
    theme: 'shapes',
    difficulty: 'medium',
  });

  const trainingConfig: TrainingConfig = {
    availableParams: trainingParams,
    currentValues: trainingValues,
    onParamChange: (paramId, value) => {
      setTrainingValues(prev => ({ ...prev, [paramId]: value }));
      if (paramId === 'theme') {
        setSelectedTheme(value as ThemeType);
      }
    },
  };

  // Hook du jeu (pour la preview)
  const currentLevel = selectedLevel?.number || 1;
  const {
    gameState,
    sessionState,
    currentSequence,
    selectAnswer,
    confirmAnswer,
    requestHint,
    nextSequence,
  } = useSuitesGame({
    theme: selectedTheme,
    initialLevel: currentLevel,
  });

  // Sons
  const { playSelect, playCorrect, playError } = useSuitesSound();

  // Handlers
  const handleBack = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      setMascotMessage("On recommence ? Choisis un niveau !");
      setMascotEmotion('encouraging');
    } else {
      router.back();
    }
  }, [isPlaying, router]);

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    setMascotMessage(`Niveau ${level.number} ! ${level.difficulty === 'easy' ? 'Parfait pour commencer !' : level.difficulty === 'hard' ? 'Un vrai défi !' : 'Bonne difficulté !'}`);
    setMascotEmotion('happy');
    // Générer une nouvelle séquence pour la preview
    nextSequence();
  }, [nextSequence]);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    setIsPlaying(true);
    setMascotMessage("C'est parti ! Trouve ce qui vient après !");
    setMascotEmotion('excited');
  }, [selectedLevel]);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode(!isTrainingMode);
    setMascotMessage(isTrainingMode
      ? "Retour aux niveaux normaux !"
      : "Mode entraînement ! Configure comme tu veux !");
    setMascotEmotion('thinking');
  }, [isTrainingMode]);

  const handleParentPress = useCallback(() => {
    router.push('/(parent)');
  }, [router]);

  const handleHelpPress = useCallback(() => {
    setMascotMessage("Observe bien la suite ! Qu'est-ce qui se répète ?");
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    nextSequence();
    setMascotMessage("Nouvelle suite ! Observe bien...");
    setMascotEmotion('neutral');
  }, [nextSequence]);

  const handleHint = useCallback(() => {
    requestHint();
    const hints = PIXEL_MESSAGES.hint1;
    setMascotMessage(hints);
    setMascotEmotion('thinking');
  }, [requestHint]);

  const handleSelectAnswer = useCallback((element: SequenceElement) => {
    playSelect();
    selectAnswer(element);
    setMascotMessage("Bip ! Clique sur 'Valider' !");
    setMascotEmotion('happy');
  }, [selectAnswer, playSelect]);

  const handleConfirm = useCallback(() => {
    confirmAnswer();
  }, [confirmAnswer]);

  // Effets pour les feedbacks
  React.useEffect(() => {
    if (gameState.status === 'success') {
      playCorrect();
      const messages = PIXEL_MESSAGES.success;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('excited');
    } else if (gameState.status === 'error') {
      playError();
      const messages = PIXEL_MESSAGES.error;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('encouraging');
    }
  }, [gameState.status, playCorrect, playError]);

  // Render level card custom
  const renderLevelCard = useCallback((level: LevelConfig, isSelected: boolean) => {
    const themeIcon = THEMES[selectedTheme]?.icon || '🔷';

    return (
      <View
        style={[
          styles.levelCard,
          isSelected && styles.levelCardSelected,
          !level.isUnlocked && styles.levelCardLocked,
        ]}
      >
        {/* Icône thème */}
        <Text style={styles.levelThemeIcon}>{level.isUnlocked ? themeIcon : '🔒'}</Text>

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
  }, [selectedTheme]);

  // Render game preview
  const renderGame = useCallback(() => {
    if (!currentSequence) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir la suite
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.gameContainer}>
        {/* Zone de la suite */}
        <View style={styles.sequenceArea}>
          <SequenceDisplay
            sequence={currentSequence}
            selectedAnswer={gameState.selectedAnswer}
            status={gameState.status}
            hintLevel={gameState.currentHintLevel}
            onDropInSlot={handleConfirm}
          />
        </View>

        {/* Zone des choix (seulement si on joue) */}
        {isPlaying && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={styles.choiceArea}
          >
            <ChoicePanel
              choices={[currentSequence.correctAnswer, ...currentSequence.distractors]}
              selectedId={gameState.selectedAnswer?.id}
              onSelect={handleSelectAnswer}
              onConfirm={handleConfirm}
              disabled={gameState.status === 'checking' || gameState.status === 'success'}
              hintLevel={gameState.currentHintLevel}
              correctAnswerId={currentSequence.correctAnswer.id}
              status={gameState.status}
            />
          </Animated.View>
        )}

        {/* Bouton Jouer (si pas encore en train de jouer) */}
        {!isPlaying && selectedLevel && (
          <Pressable
            onPress={handleStartPlaying}
            style={styles.playButton}
          >
            <LinearGradient
              colors={[colors.primary.main, colors.primary.dark]}
              style={styles.playButtonGradient}
            >
              <Text style={styles.playButtonEmoji}>🚀</Text>
              <Text style={styles.playButtonText}>C'est parti !</Text>
            </LinearGradient>
          </Pressable>
        )}
      </View>
    );
  }, [
    currentSequence,
    gameState,
    isPlaying,
    selectedLevel,
    handleConfirm,
    handleSelectAnswer,
    handleStartPlaying,
  ]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{sessionState.sequencesCompleted}</Text>
          <Text style={styles.progressLabel}>/ 8 suites</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{sessionState.currentStreak}</Text>
          <Text style={styles.progressLabel}>🔥 Streak</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{4 - gameState.currentHintLevel}</Text>
          <Text style={styles.progressLabel}>💡 Indices</Text>
        </View>
      </View>
    );
  }, [sessionState, gameState.currentHintLevel]);

  // Render mascot
  const renderMascot = useMemo(() => (
    <MascotRobot
      message={mascotMessage}
      emotion={mascotEmotion}
      visible={true}
      canPlayAudio={isPlaying}
    />
  ), [mascotMessage, mascotEmotion, isPlaying]);

  return (
    <GameIntroTemplate
      // Header
      title="Suites Logiques"
      emoji="🔮"
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
        mascotEmotion === 'excited' ? 'victory' :
        mascotEmotion === 'thinking' ? 'hint' :
        mascotEmotion === 'encouraging' ? 'encourage' :
        'intro'
      }

      // Boutons flottants
      showResetButton={true}
      onReset={handleReset}
      showHintButton={true}
      onHint={handleHint}
      hintsRemaining={4 - gameState.currentHintLevel}
      hintsDisabled={gameState.currentHintLevel >= 4}

      // Animation config custom (optionnel)
      animationConfig={{
        selectorSlideDuration: 400,
        selectorFadeDuration: 300,
      }}
    />
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
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    alignItems: 'center',
    minWidth: 100,
    minHeight: 120,
    borderWidth: 3,
    borderColor: colors.background.secondary,
    ...shadows.md,
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

  // Game container
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
  },
  gamePreviewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  gamePreviewEmptyText: {
    ...textStyles.body,
    color: colors.text.muted,
    textAlign: 'center',
  },
  sequenceArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  choiceArea: {
    marginBottom: spacing[4],
  },

  // Play button
  playButton: {
    marginTop: spacing[4],
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
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 20,
  },

  // Progress panel
  progressPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
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
  },
  progressDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.background.secondary,
  },
});
