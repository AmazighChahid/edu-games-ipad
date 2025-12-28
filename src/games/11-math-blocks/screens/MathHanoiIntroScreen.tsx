/**
 * MathHanoiIntroScreen
 * Écran d'introduction pour MathBlocks avec le pattern Hanoi
 * Sélection niveau visible, preview grille en dessous, transition animée
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
import { useActiveProfile } from '../../../store/useStore';
import { mathLevels, getLevel } from '../data/levels';
import { OPERATION_SYMBOLS, type MathLevelConfig, type MathOperation } from '../types';
import { colors, spacing, textStyles, borderRadius, shadows, fontFamily } from '../../../theme';

// ============================================
// TYPES
// ============================================

type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

// Messages de la mascotte Calc
const CALC_MESSAGES = {
  intro: "Salut ! Je suis Calc ! Prêt pour du calcul mental ?",
  levelSelect: (level: number, ops: string) => `Niveau ${level} avec ${ops} ! Tu vas y arriver !`,
  training: "Mode entraînement ! Configure comme tu veux !",
  hint: "Cherche d'abord les calculs faciles !",
  victory: "Bravo ! Tu calcules comme un pro !",
};

// ============================================
// COMPOSANT MASCOTTE CALC
// ============================================

interface CalcMascotProps {
  message: string;
  emotion: EmotionType;
}

function CalcMascot({ message, emotion }: CalcMascotProps) {
  const emojiMap: Record<EmotionType, string> = {
    neutral: '🧮',
    happy: '🎯',
    thinking: '🤔',
    excited: '🎉',
    encouraging: '💪',
  };

  return (
    <View style={mascotStyles.container}>
      <View style={mascotStyles.mascotWrapper}>
        <Text style={mascotStyles.mascotEmoji}>{emojiMap[emotion]}</Text>
        <View style={mascotStyles.nameTag}>
          <Text style={mascotStyles.nameText}>Calc</Text>
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
    backgroundColor: colors.secondary.main,
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

export default function MathHanoiIntroScreen() {
  const router = useRouter();
  const profile = useActiveProfile();

  // État
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(CALC_MESSAGES.intro);
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');

  // Générer les niveaux basés sur l'âge de l'enfant
  const levels = useMemo(() => {
    return generateDefaultLevels('math-blocks', profile?.birthDate, []);
  }, [profile?.birthDate]);

  // Niveau MathBlocks actuel
  const currentMathLevel = useMemo((): MathLevelConfig | null => {
    if (!selectedLevel) return null;
    return getLevel(`level_${selectedLevel.number}`) || null;
  }, [selectedLevel]);

  // Configuration entraînement
  const trainingParams: TrainingParam[] = useMemo(() => [
    {
      id: 'operation',
      label: 'Opération',
      type: 'select',
      options: [
        { value: 'add', label: '➕ Addition' },
        { value: 'subtract', label: '➖ Soustraction' },
        { value: 'multiply', label: '✖️ Multiplication' },
        { value: 'divide', label: '➗ Division' },
        { value: 'all', label: '🎲 Toutes' },
      ],
      defaultValue: 'add',
    },
    {
      id: 'range',
      label: 'Nombres',
      type: 'select',
      options: [
        { value: '5', label: '1-5 (Facile)' },
        { value: '10', label: '1-10 (Moyen)' },
        { value: '20', label: '1-20 (Difficile)' },
        { value: '50', label: '1-50 (Expert)' },
      ],
      defaultValue: '10',
    },
  ], []);

  const [trainingValues, setTrainingValues] = useState<Record<string, string | number | boolean>>({
    operation: 'add',
    range: '10',
  });

  const trainingConfig: TrainingConfig = {
    availableParams: trainingParams,
    currentValues: trainingValues,
    onParamChange: (paramId, value) => {
      setTrainingValues(prev => ({ ...prev, [paramId]: value }));
    },
  };

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
    const mathLevel = getLevel(`level_${level.number}`);
    if (mathLevel) {
      const ops = mathLevel.operations.map(op => OPERATION_SYMBOLS[op]).join(' ');
      setMascotMessage(CALC_MESSAGES.levelSelect(level.number, ops));
      setMascotEmotion('happy');
    }
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    // Naviguer vers l'écran de jeu
    router.push(`/(games)/11-math-blocks/play?levelId=level_${selectedLevel.number}`);
  }, [selectedLevel, router]);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode(!isTrainingMode);
    setMascotMessage(isTrainingMode ? CALC_MESSAGES.intro : CALC_MESSAGES.training);
    setMascotEmotion('thinking');
  }, [isTrainingMode]);

  const handleParentPress = useCallback(() => {
    router.push('/(parent)');
  }, [router]);

  const handleHelpPress = useCallback(() => {
    setMascotMessage(CALC_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    setSelectedLevel(null);
    setMascotMessage(CALC_MESSAGES.intro);
    setMascotEmotion('neutral');
  }, []);

  const handleHint = useCallback(() => {
    setMascotMessage(CALC_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, []);

  // Render level card custom
  const renderLevelCard = useCallback((level: LevelConfig, isSelected: boolean) => {
    const mathLevel = getLevel(`level_${level.number}`);
    if (!mathLevel) return null;

    const difficultyColor =
      mathLevel.difficulty === 'easy' ? colors.feedback.success :
      mathLevel.difficulty === 'medium' ? colors.secondary.main :
      colors.feedback.error;

    const ops = mathLevel.operations.map(op => OPERATION_SYMBOLS[op]).join(' ');

    return (
      <View
        style={[
          styles.levelCard,
          isSelected && styles.levelCardSelected,
          !level.isUnlocked && styles.levelCardLocked,
        ]}
      >
        {/* Badge difficulté */}
        <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
          <Text style={styles.difficultyText}>
            {mathLevel.difficulty === 'easy' ? '⭐' : mathLevel.difficulty === 'medium' ? '⭐⭐' : '⭐⭐⭐'}
          </Text>
        </View>

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

        {/* Opérations */}
        <Text style={styles.levelOps}>{ops}</Text>

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
    if (!currentMathLevel) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyEmoji}>🧮</Text>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir les détails
          </Text>
        </View>
      );
    }

    const ops = currentMathLevel.operations.map(op => OPERATION_SYMBOLS[op]).join(' ');

    return (
      <View style={styles.gameContainer}>
        {/* Preview de la grille (schématique) */}
        <View style={styles.gridPreview}>
          <View style={styles.gridPreviewInner}>
            {Array.from({ length: Math.min(currentMathLevel.gridRows, 4) }).map((_, row) => (
              <View key={row} style={styles.gridRow}>
                {Array.from({ length: Math.min(currentMathLevel.gridCols, 5) }).map((_, col) => (
                  <Animated.View
                    key={`${row}-${col}`}
                    entering={ZoomIn.delay((row * 5 + col) * 30)}
                    style={[
                      styles.gridCell,
                      { backgroundColor: (row + col) % 2 === 0 ? colors.primary.light : colors.secondary.light },
                    ]}
                  >
                    <Text style={styles.gridCellText}>
                      {(row + col) % 3 === 0 ? '?' : (row + col) % 3 === 1 ? ops.split(' ')[0] : '='}
                    </Text>
                  </Animated.View>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Info du niveau */}
        <View style={styles.levelInfoCard}>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoIcon}>🧩</Text>
            <Text style={styles.levelInfoText}>Grille {currentMathLevel.gridRows}×{currentMathLevel.gridCols}</Text>
          </View>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoIcon}>🎯</Text>
            <Text style={styles.levelInfoText}>{currentMathLevel.targetPairs} paires à trouver</Text>
          </View>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoIcon}>⏱️</Text>
            <Text style={styles.levelInfoText}>
              {Math.floor(currentMathLevel.timeLimit / 60)}:{String(currentMathLevel.timeLimit % 60).padStart(2, '0')}
            </Text>
          </View>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoIcon}>🔢</Text>
            <Text style={styles.levelInfoText}>Nombres: {currentMathLevel.numberRange[0]}-{currentMathLevel.numberRange[1]}</Text>
          </View>
        </View>

        {/* Bouton Jouer */}
        <Pressable onPress={handleStartPlaying} style={styles.playButton}>
          <LinearGradient
            colors={[colors.secondary.main, colors.secondary.dark]}
            style={styles.playButtonGradient}
          >
            <Text style={styles.playButtonEmoji}>🚀</Text>
            <Text style={styles.playButtonText}>C'est parti !</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }, [currentMathLevel, handleStartPlaying]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    const totalLevels = mathLevels.length;
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
          <Text style={styles.progressLabel}>📊 Actuel</Text>
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
    <CalcMascot message={mascotMessage} emotion={mascotEmotion} />
  ), [mascotMessage, mascotEmotion]);

  return (
    <GameIntroTemplate
      // Header
      title="MathBlocks"
      emoji="🧮"
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
    backgroundColor: colors.secondary.light,
    borderColor: colors.secondary.main,
    transform: [{ scale: 1.05 }],
  },
  levelCardLocked: {
    backgroundColor: colors.background.secondary,
    opacity: 0.6,
  },
  difficultyBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
    marginBottom: spacing[1],
  },
  difficultyText: {
    fontSize: 10,
  },
  levelNumber: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  levelNumberSelected: {
    color: colors.secondary.main,
  },
  levelNumberLocked: {
    fontSize: 20,
    color: colors.text.muted,
  },
  levelOps: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
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

  // Grid preview
  gridPreview: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    ...shadows.lg,
  },
  gridPreviewInner: {
    gap: spacing[2],
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  gridCell: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCellText: {
    fontSize: 18,
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
    color: colors.secondary.main,
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
