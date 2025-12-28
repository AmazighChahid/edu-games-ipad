/**
 * MemoryIntroScreen
 * Écran d'introduction pour le jeu Super Mémoire
 * Suit le pattern Hanoi : sélection niveau visible, preview grille en dessous, transition animée
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  ZoomIn,
  FadeIn,
} from 'react-native-reanimated';

import {
  GameIntroTemplate,
  generateDefaultLevels,
  type LevelConfig,
  type TrainingConfig,
  type TrainingParam,
} from '../../../components/common';
import { GameBoard } from '../components/GameBoard';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { useActiveProfile } from '../../../store/useStore';
import { getAllLevels, getLevelById } from '../data/levels';
import { MEMORY_THEMES } from '../data/themes';
import { colors, spacing, textStyles, borderRadius, shadows, fontFamily } from '../../../theme';
import type { MemoryLevel, CardTheme } from '../types';

// ============================================
// TYPES
// ============================================

type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

// Helper: Array de thèmes avec emoji pour sélection
const THEME_OPTIONS = [
  { id: 'animals' as CardTheme, name: 'Animaux', emoji: '🐶' },
  { id: 'fruits' as CardTheme, name: 'Fruits', emoji: '🍎' },
  { id: 'vehicles' as CardTheme, name: 'Véhicules', emoji: '🚗' },
  { id: 'nature' as CardTheme, name: 'Nature', emoji: '🌸' },
  { id: 'space' as CardTheme, name: 'Espace', emoji: '🚀' },
  { id: 'emojis' as CardTheme, name: 'Émojis', emoji: '😀' },
];

// Helper: obtenir info thème
const getThemeInfo = (themeId: CardTheme) => THEME_OPTIONS.find(t => t.id === themeId) || THEME_OPTIONS[0];

// Mapping niveau (1-10) vers niveau Memory
const LEVEL_TO_MEMORY_ID: Record<number, string> = {
  1: 'memory-easy-01',
  2: 'memory-easy-02',
  3: 'memory-easy-03',
  4: 'memory-easy-04',
  5: 'memory-easy-05',
  6: 'memory-medium-01',
  7: 'memory-medium-02',
  8: 'memory-hard-01',
  9: 'memory-hard-02',
  10: 'memory-hard-04',
};

// Messages de la mascotte Mémo
const MEMO_MESSAGES = {
  intro: "Salut ! Je suis Mémo l'Éléphant ! J'ai une mémoire d'éléphant... et toi ?",
  levelSelect: (pairs: number) => `${pairs} paires à trouver ! Tu peux le faire !`,
  training: "Mode entraînement ! Choisis ton thème préféré !",
  hint: "Regarde bien les cartes avant de retourner ! 👀",
  victory: "Incroyable ! Tu as une super mémoire ! 🧠",
};

// ============================================
// COMPOSANT MASCOTTE MÉMO
// ============================================

interface MemoMascotProps {
  message: string;
  emotion: EmotionType;
}

function MemoMascot({ message, emotion }: MemoMascotProps) {
  const emojiMap: Record<EmotionType, string> = {
    neutral: '🐘',
    happy: '🎉',
    thinking: '🤔',
    excited: '🏆',
    encouraging: '💪',
  };

  return (
    <View style={mascotStyles.container}>
      <View style={mascotStyles.mascotWrapper}>
        <Text style={mascotStyles.mascotEmoji}>{emojiMap[emotion]}</Text>
        <View style={mascotStyles.nameTag}>
          <Text style={mascotStyles.nameText}>Mémo</Text>
        </View>
      </View>
      <View style={mascotStyles.bubble}>
        <Text style={mascotStyles.bubbleText}>{message}</Text>
      </View>
    </View>
  );
}

const mascotStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[3],
    gap: spacing[3],
  },
  mascotWrapper: {
    alignItems: 'center',
  },
  mascotEmoji: {
    fontSize: 48,
  },
  nameTag: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
    marginTop: spacing[1],
  },
  nameText: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[3],
    ...shadows.md,
  },
  bubbleText: {
    ...textStyles.body,
    color: colors.text.primary,
    fontFamily: fontFamily.medium,
  },
});

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function MemoryIntroScreen() {
  const router = useRouter();
  const profile = useActiveProfile();

  // État
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('animals');
  const [mascotMessage, setMascotMessage] = useState(MEMO_MESSAGES.intro);
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');

  // Hook du jeu Memory
  const {
    gameState,
    result,
    isLoading,
    startGame,
    handleCardFlip,
    pauseGame,
    resumeGame,
    restartLevel,
  } = useMemoryGame();

  // Générer les niveaux basés sur l'âge de l'enfant
  const levels = useMemo(() => {
    return generateDefaultLevels('memory', profile?.birthDate, []);
  }, [profile?.birthDate]);

  // Niveau Memory actuel
  const currentMemoryLevel = useMemo((): MemoryLevel | null => {
    if (!selectedLevel) return null;
    const memoryId = LEVEL_TO_MEMORY_ID[selectedLevel.number];
    return getLevelById(memoryId) || null;
  }, [selectedLevel]);

  // Configuration entraînement
  const trainingParams: TrainingParam[] = useMemo(() => [
    {
      id: 'theme',
      label: 'Thème',
      type: 'select',
      options: THEME_OPTIONS.map(t => ({ value: t.id, label: `${t.emoji} ${t.name}` })),
      defaultValue: 'animals',
    },
    {
      id: 'pairs',
      label: 'Paires',
      type: 'select',
      options: [
        { value: '4', label: '4 paires (Facile)' },
        { value: '6', label: '6 paires (Moyen)' },
        { value: '8', label: '8 paires (Difficile)' },
      ],
      defaultValue: '4',
    },
  ], []);

  const [trainingValues, setTrainingValues] = useState<Record<string, string | number | boolean>>({
    theme: 'animals',
    pairs: '4',
  });

  const trainingConfig: TrainingConfig = {
    availableParams: trainingParams,
    currentValues: trainingValues,
    onParamChange: (paramId, value) => {
      setTrainingValues(prev => ({ ...prev, [paramId]: value }));
      if (paramId === 'theme') {
        setSelectedTheme(value as CardTheme);
      }
    },
  };

  // Handlers
  const handleBack = useCallback(() => {
    if (isPlaying) {
      if (gameState?.phase === 'playing') {
        Alert.alert(
          'Quitter le jeu ?',
          'Ta progression sera perdue.',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Quitter',
              style: 'destructive',
              onPress: () => {
                setIsPlaying(false);
                setMascotMessage("On recommence ? Choisis un niveau !");
                setMascotEmotion('encouraging');
              },
            },
          ]
        );
      } else {
        setIsPlaying(false);
        setMascotMessage("On recommence ? Choisis un niveau !");
        setMascotEmotion('encouraging');
      }
    } else {
      router.back();
    }
  }, [isPlaying, gameState, router]);

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    const memoryId = LEVEL_TO_MEMORY_ID[level.number];
    const memoryLevel = getLevelById(memoryId);
    if (memoryLevel) {
      setMascotMessage(MEMO_MESSAGES.levelSelect(memoryLevel.pairCount));
      setMascotEmotion('happy');
    }
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel || !currentMemoryLevel) return;
    startGame(currentMemoryLevel);
    setIsPlaying(true);
    setMascotMessage("C'est parti ! Trouve les paires !");
    setMascotEmotion('excited');
  }, [selectedLevel, currentMemoryLevel, startGame]);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode(!isTrainingMode);
    setMascotMessage(isTrainingMode ? MEMO_MESSAGES.intro : MEMO_MESSAGES.training);
    setMascotEmotion('thinking');
  }, [isTrainingMode]);

  const handleParentPress = useCallback(() => {
    router.push('/(parent)');
  }, [router]);

  const handleHelpPress = useCallback(() => {
    setMascotMessage(MEMO_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    setSelectedLevel(null);
    setMascotMessage(MEMO_MESSAGES.intro);
    setMascotEmotion('neutral');
  }, []);

  const handleHint = useCallback(() => {
    setMascotMessage(MEMO_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, []);

  // Render level card custom
  const renderLevelCard = useCallback((level: LevelConfig, isSelected: boolean) => {
    const memoryId = LEVEL_TO_MEMORY_ID[level.number];
    const memoryLevel = getLevelById(memoryId);
    if (!memoryLevel) return null;

    const difficultyColor =
      memoryLevel.difficulty === 'easy' ? colors.feedback.success :
      memoryLevel.difficulty === 'medium' ? colors.secondary.main :
      colors.feedback.error;

    const themeInfo = getThemeInfo(memoryLevel.theme);

    return (
      <View
        style={[
          styles.levelCard,
          isSelected && styles.levelCardSelected,
          !level.isUnlocked && styles.levelCardLocked,
        ]}
      >
        {/* Badge thème */}
        <Text style={styles.levelThemeIcon}>
          {!level.isUnlocked ? '🔒' : themeInfo?.emoji || '🃏'}
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

        {/* Paires */}
        <View style={[styles.pairsBadge, { backgroundColor: difficultyColor }]}>
          <Text style={styles.pairsText}>{memoryLevel.pairCount}p</Text>
        </View>

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
  }, []);

  // Render game preview
  const renderGame = useCallback(() => {
    // Si on joue, afficher le jeu complet
    if (isPlaying && gameState) {
      return (
        <View style={styles.gameFullContainer}>
          <GameBoard
            gameState={gameState}
            onCardPress={handleCardFlip}
            onPause={pauseGame}
            onHint={handleHint}
            onBack={handleBack}
          />
        </View>
      );
    }

    if (!currentMemoryLevel) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyEmoji}>🐘</Text>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir les détails
          </Text>
        </View>
      );
    }

    const themeInfo = getThemeInfo(currentMemoryLevel.theme);

    return (
      <View style={styles.gameContainer}>
        {/* Preview des cartes (schématique) */}
        <View style={styles.cardPreview}>
          {Array.from({ length: Math.min(currentMemoryLevel.pairCount * 2, 12) }).map((_, i) => (
            <Animated.View
              key={i}
              entering={ZoomIn.delay(i * 50)}
              style={[
                styles.previewCard,
                { backgroundColor: i % 2 === 0 ? colors.primary.light : colors.secondary.light },
              ]}
            >
              <Text style={styles.previewCardText}>?</Text>
            </Animated.View>
          ))}
        </View>

        {/* Info du niveau */}
        <View style={styles.levelInfoCard}>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoIcon}>{themeInfo?.emoji || '🃏'}</Text>
            <Text style={styles.levelInfoText}>Thème: {themeInfo?.name || 'Varié'}</Text>
          </View>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoIcon}>🎴</Text>
            <Text style={styles.levelInfoText}>{currentMemoryLevel.pairCount} paires à trouver</Text>
          </View>
          {currentMemoryLevel.timeLimit > 0 && (
            <View style={styles.levelInfoRow}>
              <Text style={styles.levelInfoIcon}>⏱️</Text>
              <Text style={styles.levelInfoText}>
                Temps limite: {Math.floor(currentMemoryLevel.timeLimit / 60)}:{String(currentMemoryLevel.timeLimit % 60).padStart(2, '0')}
              </Text>
            </View>
          )}
        </View>

        {/* Bouton Jouer */}
        <Pressable onPress={handleStartPlaying} style={styles.playButton}>
          <LinearGradient
            colors={[colors.primary.main, colors.primary.dark]}
            style={styles.playButtonGradient}
          >
            <Text style={styles.playButtonEmoji}>🎴</Text>
            <Text style={styles.playButtonText}>C'est parti !</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }, [
    isPlaying,
    gameState,
    currentMemoryLevel,
    handleStartPlaying,
    handleCardFlip,
    pauseGame,
    handleHint,
    handleBack,
  ]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    const allLevels = getAllLevels();
    const totalLevels = allLevels.length;
    const currentLevel = selectedLevel?.number || 0;

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>0</Text>
          <Text style={styles.progressLabel}>/ {totalLevels} niveaux</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{currentLevel}</Text>
          <Text style={styles.progressLabel}>🎴 Actuel</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>0</Text>
          <Text style={styles.progressLabel}>⭐ Étoiles</Text>
        </View>
      </View>
    );
  }, [selectedLevel?.number]);

  // Render mascot
  const renderMascot = useMemo(() => (
    <MemoMascot message={mascotMessage} emotion={mascotEmotion} />
  ), [mascotMessage, mascotEmotion]);

  return (
    <GameIntroTemplate
      // Header
      title="Super Mémoire"
      emoji="🐘"
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
        mascotEmotion === 'excited' ? 'victory' :
        mascotEmotion === 'thinking' ? 'hint' :
        mascotEmotion === 'encouraging' ? 'encourage' :
        'intro'
      }

      // Boutons flottants
      showResetButton={!isPlaying}
      onReset={handleReset}
      showHintButton={!isPlaying}
      onHint={handleHint}
      hintsRemaining={3}
      hintsDisabled={false}

      // Animation config
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
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    alignItems: 'center',
    minWidth: 72,
    minHeight: 100,
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
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  levelNumberSelected: {
    color: colors.primary.main,
  },
  levelNumberLocked: {
    fontSize: 20,
    color: colors.text.muted,
  },
  pairsBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
    marginTop: spacing[1],
  },
  pairsText: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
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

  // Card preview
  cardPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[2],
    maxWidth: 280,
  },
  previewCard: {
    width: 44,
    height: 60,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  previewCardText: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },

  // Level info card
  levelInfoCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    ...shadows.md,
    gap: spacing[2],
    width: '100%',
    maxWidth: 280,
  },
  levelInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  levelInfoIcon: {
    fontSize: 20,
  },
  levelInfoText: {
    ...textStyles.body,
    color: colors.text.primary,
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
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 20,
  },

  // Progress panel
  progressPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[5],
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
