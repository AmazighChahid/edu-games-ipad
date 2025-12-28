/**
 * LabyrintheIntroScreen
 * Écran d'introduction pour le jeu Labyrinthe Logique
 * Suit le pattern Hanoi : sélection niveau visible, preview maze en dessous, transition animée
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import {
  GameIntroTemplate,
  generateDefaultLevels,
  type LevelConfig,
  type TrainingConfig,
  type TrainingParam,
} from '../../../components/common';
import { MazeGrid } from '../components/MazeGrid';
import { MascotBubble } from '../components/MascotBubble';
import { LabyrintheGame } from '../LabyrintheGame';
import { useMazeGenerator } from '../hooks/useMazeGenerator';
import { useActiveProfile } from '../../../store/useStore';
import { LEVELS } from '../data/levels';
import { THEMES } from '../data/themes';
import { colors, spacing, textStyles, borderRadius, shadows, fontFamily } from '../../../theme';
import type { LevelConfig as MazeLevelConfig, MazeGrid as MazeGridType, ThemeType, SessionStats } from '../types';

// ============================================
// TYPES
// ============================================

type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

// Mapping niveau -> configuration labyrinthe
const LEVEL_TO_MAZE_CONFIG: Record<number, Partial<MazeLevelConfig>> = {
  1: { width: 5, height: 5, hasKeys: false, hasGems: false, difficulty: 1 },
  2: { width: 5, height: 5, hasKeys: false, hasGems: true, gemCount: 1, difficulty: 1 },
  3: { width: 5, height: 5, hasKeys: false, hasGems: true, gemCount: 2, difficulty: 1 },
  4: { width: 5, height: 5, hasKeys: true, keyCount: 1, hasGems: true, gemCount: 2, difficulty: 2 },
  5: { width: 7, height: 7, hasKeys: false, hasGems: true, gemCount: 3, difficulty: 2 },
  6: { width: 7, height: 7, hasKeys: true, keyCount: 1, hasGems: true, gemCount: 3, difficulty: 2 },
  7: { width: 7, height: 7, hasKeys: true, keyCount: 2, hasGems: true, gemCount: 4, difficulty: 3 },
  8: { width: 9, height: 9, hasKeys: true, keyCount: 1, hasGems: true, gemCount: 4, difficulty: 3 },
  9: { width: 9, height: 9, hasKeys: true, keyCount: 2, hasGems: true, gemCount: 5, difficulty: 4 },
  10: { width: 9, height: 9, hasKeys: true, keyCount: 3, hasGems: true, gemCount: 6, difficulty: 5 },
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function LabyrintheIntroScreen() {
  const router = useRouter();
  const profile = useActiveProfile();
  const { width: screenWidth } = useWindowDimensions();
  const { generateMaze } = useMazeGenerator();

  // État
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('forest');
  const [mascotMessage, setMascotMessage] = useState("🐿️ Coucou ! Je suis Noisette ! Aide-moi à trouver la sortie du labyrinthe !");
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');
  const [previewMaze, setPreviewMaze] = useState<MazeGridType | null>(null);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());

  // Générer les niveaux basés sur l'âge de l'enfant
  const levels = useMemo(() => {
    return generateDefaultLevels('labyrinthe', profile?.birthDate, []);
  }, [profile?.birthDate]);

  // Configuration labyrinthe actuelle (basée sur le niveau sélectionné)
  const currentMazeConfig = useMemo((): MazeLevelConfig | null => {
    if (!selectedLevel) return null;

    const levelNum = selectedLevel.number;
    const mazeConfig = LEVEL_TO_MAZE_CONFIG[levelNum] || LEVEL_TO_MAZE_CONFIG[1];

    // Trouver le niveau existant le plus proche dans LEVELS
    const existingLevel = LEVELS.find(l => l.id === levelNum) || LEVELS[0];

    return {
      ...existingLevel,
      ...mazeConfig,
      theme: selectedTheme,
    };
  }, [selectedLevel, selectedTheme]);

  // Générer un labyrinthe de preview quand le niveau change
  useEffect(() => {
    if (currentMazeConfig && !isPlaying) {
      const maze = generateMaze(currentMazeConfig);
      setPreviewMaze(maze);
    }
  }, [currentMazeConfig, generateMaze, isPlaying]);

  // Taille des cellules pour le preview
  const cellSize = useMemo(() => {
    if (!currentMazeConfig) return 30;
    const maxGridWidth = screenWidth - 64; // padding
    return Math.floor(maxGridWidth / currentMazeConfig.width);
  }, [screenWidth, currentMazeConfig]);

  // Configuration entraînement
  const trainingParams: TrainingParam[] = useMemo(() => [
    {
      id: 'theme',
      label: 'Thème',
      type: 'select',
      options: [
        { value: 'forest', label: '🌲 Forêt' },
        { value: 'temple', label: '🏛️ Temple' },
        { value: 'space', label: '🚀 Espace' },
        { value: 'ice', label: '❄️ Glace' },
        { value: 'garden', label: '🌸 Jardin' },
      ],
      defaultValue: 'forest',
    },
    {
      id: 'size',
      label: 'Taille',
      type: 'select',
      options: [
        { value: 'small', label: '5×5 (Petit)' },
        { value: 'medium', label: '7×7 (Moyen)' },
        { value: 'large', label: '9×9 (Grand)' },
      ],
      defaultValue: 'small',
    },
    {
      id: 'hasKeys',
      label: 'Clés & Portes',
      type: 'toggle',
      defaultValue: false,
    },
  ], []);

  const [trainingValues, setTrainingValues] = useState<Record<string, string | number | boolean>>({
    theme: 'forest',
    size: 'small',
    hasKeys: false,
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
    const config = LEVEL_TO_MAZE_CONFIG[level.number] || LEVEL_TO_MAZE_CONFIG[1];
    const sizeText = config.width === 5 ? 'petit' : config.width === 7 ? 'moyen' : 'grand';
    setMascotMessage(`Niveau ${level.number} ! Un labyrinthe ${sizeText} t'attend !${config.hasKeys ? ' Avec des clés à trouver ! 🔑' : ''}`);
    setMascotEmotion('happy');
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    setIsPlaying(true);
    setMascotMessage("C'est parti ! Guide-moi vers la sortie ! ⭐");
    setMascotEmotion('excited');
  }, [selectedLevel]);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode(!isTrainingMode);
    setMascotMessage(isTrainingMode
      ? "Retour aux niveaux normaux !"
      : "Mode entraînement ! Configure le labyrinthe comme tu veux !");
    setMascotEmotion('thinking');
  }, [isTrainingMode]);

  const handleParentPress = useCallback(() => {
    router.push('/(parent)');
  }, [router]);

  const handleHelpPress = useCallback(() => {
    setMascotMessage("Glisse ton doigt pour me déplacer ! Collecte les clés 🔑 pour ouvrir les portes et trouve la sortie ⭐ !");
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    if (currentMazeConfig) {
      const maze = generateMaze(currentMazeConfig);
      setPreviewMaze(maze);
      setMascotMessage("Nouveau labyrinthe ! Observe bien le chemin...");
      setMascotEmotion('neutral');
    }
  }, [currentMazeConfig, generateMaze]);

  const handleHint = useCallback(() => {
    setMascotMessage("Regarde bien où sont les impasses ! Essaie de repérer le chemin avant de partir ! 💡");
    setMascotEmotion('thinking');
  }, []);

  const handleLevelComplete = useCallback((stats: SessionStats) => {
    console.log('Niveau terminé !', stats);
    setCompletedLevels(prev => new Set(prev).add(stats.levelId));

    // Passer au niveau suivant ou retour à la sélection
    const currentIndex = levels.findIndex(l => l.number === selectedLevel?.number);
    if (currentIndex < levels.length - 1) {
      setSelectedLevel(levels[currentIndex + 1]);
      setMascotMessage("Bravo ! 🎉 Prêt pour le niveau suivant ?");
      setMascotEmotion('excited');
    } else {
      setSelectedLevel(null);
      setMascotMessage("Incroyable ! Tu as terminé tous les niveaux ! 🏆");
      setMascotEmotion('excited');
    }
    setIsPlaying(false);
  }, [levels, selectedLevel]);

  // Render level card custom
  const renderLevelCard = useCallback((level: LevelConfig, isSelected: boolean) => {
    const config = LEVEL_TO_MAZE_CONFIG[level.number] || LEVEL_TO_MAZE_CONFIG[1];
    const isCompleted = completedLevels.has(level.number);

    return (
      <View
        style={[
          styles.levelCard,
          isSelected && styles.levelCardSelected,
          !level.isUnlocked && styles.levelCardLocked,
          isCompleted && styles.levelCardCompleted,
        ]}
      >
        {/* Icône thème */}
        <Text style={styles.levelThemeIcon}>
          {!level.isUnlocked ? '🔒' : config.hasKeys ? '🔑' : '🐿️'}
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

        {/* Taille du labyrinthe */}
        <Text style={styles.levelSize}>{config.width}×{config.height}</Text>

        {/* Étoiles si complété */}
        {isCompleted && level.stars !== undefined && (
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
  }, [completedLevels]);

  // Render game preview / full game
  const renderGame = useCallback(() => {
    // Si on joue vraiment, afficher le jeu complet
    if (isPlaying && currentMazeConfig) {
      return (
        <View style={styles.gameFullContainer}>
          <LabyrintheGame
            level={currentMazeConfig}
            onComplete={handleLevelComplete}
            onExit={() => {
              setIsPlaying(false);
              setMascotMessage("On réessaie ? Choisis un niveau !");
            }}
          />
        </View>
      );
    }

    // Sinon, afficher la preview du labyrinthe
    if (!previewMaze || !currentMazeConfig) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyEmoji}>🐿️</Text>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir le labyrinthe
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.gameContainer}>
        {/* Preview du labyrinthe */}
        <View style={styles.mazePreviewContainer}>
          <MazeGrid
            grid={previewMaze}
            cellSize={Math.min(cellSize, 40)}
            theme={selectedTheme}
            showGridLines={true}
          />
        </View>

        {/* Info du niveau */}
        <View style={styles.levelInfoCard}>
          <View style={styles.levelInfoRow}>
            <Text style={styles.levelInfoLabel}>Taille :</Text>
            <Text style={styles.levelInfoValue}>{currentMazeConfig.width}×{currentMazeConfig.height}</Text>
          </View>
          {currentMazeConfig.hasGems && (
            <View style={styles.levelInfoRow}>
              <Text style={styles.levelInfoLabel}>Gemmes :</Text>
              <Text style={styles.levelInfoValue}>💎 × {currentMazeConfig.gemCount}</Text>
            </View>
          )}
          {currentMazeConfig.hasKeys && (
            <View style={styles.levelInfoRow}>
              <Text style={styles.levelInfoLabel}>Clés :</Text>
              <Text style={styles.levelInfoValue}>🔑 × {currentMazeConfig.keyCount}</Text>
            </View>
          )}
        </View>

        {/* Bouton Jouer */}
        <Pressable onPress={handleStartPlaying} style={styles.playButton}>
          <LinearGradient
            colors={[colors.primary.main, colors.primary.dark]}
            style={styles.playButtonGradient}
          >
            <Text style={styles.playButtonEmoji}>🚀</Text>
            <Text style={styles.playButtonText}>C'est parti !</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }, [
    isPlaying,
    currentMazeConfig,
    previewMaze,
    cellSize,
    selectedTheme,
    handleStartPlaying,
    handleLevelComplete,
  ]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    const totalLevels = levels.length;
    const completed = completedLevels.size;
    const currentLevel = selectedLevel?.number || 0;

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{completed}</Text>
          <Text style={styles.progressLabel}>/ {totalLevels} niveaux</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{currentLevel}</Text>
          <Text style={styles.progressLabel}>🏃 Niveau actuel</Text>
        </View>
      </View>
    );
  }, [levels.length, completedLevels.size, selectedLevel?.number]);

  // Render mascot
  const renderMascot = useMemo(() => (
    <MascotBubble
      message={mascotMessage}
      visible={!isPlaying}
      position="top"
    />
  ), [mascotMessage, isPlaying]);

  return (
    <GameIntroTemplate
      // Header
      title="Labyrinthe Logique"
      emoji="🐿️"
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
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    minWidth: 80,
    minHeight: 100,
    borderWidth: 3,
    borderColor: colors.background.secondary,
    ...shadows.md,
  },
  levelCardSelected: {
    backgroundColor: '#E8F5E9', // Vert forêt clair
    borderColor: '#4CAF50',
    transform: [{ scale: 1.05 }],
  },
  levelCardLocked: {
    backgroundColor: colors.background.secondary,
    opacity: 0.6,
  },
  levelCardCompleted: {
    borderColor: colors.feedback.success,
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
  levelNumberSelected: {
    color: '#4CAF50',
  },
  levelNumberLocked: {
    fontSize: 22,
    color: colors.text.muted,
  },
  levelSize: {
    fontSize: 12,
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

  // Maze preview
  mazePreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },

  // Level info card
  levelInfoCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    ...shadows.md,
    gap: spacing[2],
  },
  levelInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  levelInfoLabel: {
    ...textStyles.body,
    color: colors.text.secondary,
    fontFamily: fontFamily.regular,
  },
  levelInfoValue: {
    ...textStyles.body,
    color: colors.text.primary,
    fontFamily: fontFamily.semiBold,
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
    color: '#4CAF50', // Vert forêt
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
