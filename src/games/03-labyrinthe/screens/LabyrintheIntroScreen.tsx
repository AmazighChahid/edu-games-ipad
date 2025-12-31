/**
 * LabyrintheIntroScreen
 * Écran d'introduction pour le jeu Labyrinthe Logique
 *
 * Architecture : Hook + Template
 * - useLabyrintheIntro : orchestrateur (logique métier)
 * - GameIntroTemplate : template partagé (UI)
 *
 * @see docs/GAME_ARCHITECTURE.md
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  GameIntroTemplate,
  MascotBubble,
  type LevelConfig,
} from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { MazeGrid } from '../components/MazeGrid';
import { LabyrintheGame } from '../components/LabyrintheGame';
import { useLabyrintheIntro } from '../hooks/useLabyrintheIntro';
import { labyrintheParentGuideData } from '../data/parentGuideData';
import { theme } from '../../../theme';
import { Icons } from '../../../constants/icons';

// ============================================
// COMPOSANT PRINCIPAL (~150 lignes)
// ============================================

export default function LabyrintheIntroScreen() {
  const {
    // Niveaux
    levels,
    selectedLevel,
    handleSelectLevel,
    completedLevels,
    // État jeu
    isPlaying,
    isTrainingMode,
    // Configuration labyrinthe
    currentMazeConfig,
    previewMaze,
    selectedTheme,
    cellSize,
    // Mode entraînement
    trainingConfig,
    // Parent drawer
    showParentDrawer,
    setShowParentDrawer,
    // Mascot
    mascotMessage,
    mascotEmotion,
    // Handlers
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleTrainingPress,
    handleReset,
    handleHint,
    handleLevelComplete,
    setIsPlaying,
    setMascotMessage,
    // Hints
    hintsRemaining,
  } = useLabyrintheIntro();

  // Render level card custom
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => {
      const LEVEL_CONFIG: Record<number, { width: number; hasKeys: boolean }> = {
        1: { width: 5, hasKeys: false }, 2: { width: 5, hasKeys: false },
        3: { width: 5, hasKeys: false }, 4: { width: 5, hasKeys: true },
        5: { width: 7, hasKeys: false }, 6: { width: 7, hasKeys: true },
        7: { width: 7, hasKeys: true }, 8: { width: 9, hasKeys: true },
        9: { width: 9, hasKeys: true }, 10: { width: 9, hasKeys: true },
      };
      const config = LEVEL_CONFIG[level.number] || { width: 5, hasKeys: false };
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
          <Text style={styles.levelThemeIcon}>
            {!level.isUnlocked ? Icons.lock : config.hasKeys ? Icons.key : Icons.squirrel}
          </Text>
          <Text style={[
            styles.levelNumber,
            isSelected && styles.levelNumberSelected,
            !level.isUnlocked && styles.levelNumberLocked,
          ]}>
            {level.number}
          </Text>
          <Text style={styles.levelSize}>{config.width}×{config.width}</Text>
          {isCompleted && level.stars !== undefined && (
            <View style={styles.starsRow}>
              {[1, 2, 3].map((star) => (
                <Text key={star} style={star <= (level.stars || 0) ? styles.starFilled : styles.starEmpty}>
                  {Icons.star}
                </Text>
              ))}
            </View>
          )}
        </View>
      );
    },
    [completedLevels]
  );

  // Render game preview
  const renderGame = useCallback(() => {
    if (!previewMaze || !currentMazeConfig) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir le labyrinthe
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.gameContainer}>
        <View style={styles.mazePreviewContainer}>
          <MazeGrid
            grid={previewMaze}
            cellSize={Math.min(cellSize, 56)}
            theme={selectedTheme}
            showGridLines={selectedTheme !== 'cozy'}
          />
        </View>
      </View>
    );
  }, [currentMazeConfig, previewMaze, cellSize, selectedTheme]);

  // Render progress panel
  const renderProgress = useCallback(() => (
    <View style={styles.progressPanel}>
      <View style={styles.progressItem}>
        <Text style={styles.progressValue}>{completedLevels.size}</Text>
        <Text style={styles.progressLabel}>/ {levels.length} niveaux</Text>
      </View>
      <View style={styles.progressDivider} />
      <View style={styles.progressItem}>
        <Text style={styles.progressValue}>{selectedLevel?.number || 0}</Text>
        <Text style={styles.progressLabel}>{Icons.rocket} Niveau actuel</Text>
      </View>
    </View>
  ), [levels.length, completedLevels.size, selectedLevel?.number]);

  // Render mascot
  const renderMascot = useMemo(() => (
    <View style={styles.mascotWithBubble}>
      <Text style={styles.mascotEmoji}>{Icons.squirrel}</Text>
      <MascotBubble message={mascotMessage} showDecorations={true} tailPosition="left" />
    </View>
  ), [mascotMessage]);

  // Si on joue, afficher directement le jeu
  if (isPlaying && currentMazeConfig) {
    return (
      <LabyrintheGame
        level={currentMazeConfig}
        onComplete={handleLevelComplete}
        onExit={() => {
          setIsPlaying(false);
          setMascotMessage("On réessaie ? Choisis un niveau !");
        }}
      />
    );
  }

  return (
    <>
      <GameIntroTemplate
        title="Labyrinthe Logique"
        emoji={Icons.squirrel}
        onBack={handleBack}
        onParentPress={handleParentPress}
        onHelpPress={handleHelpPress}
        showParentButton={true}
        showHelpButton={true}
        levels={levels}
        selectedLevel={selectedLevel}
        onSelectLevel={handleSelectLevel}
        renderLevelCard={renderLevelCard}
        levelColumns={5}
        showTrainingMode={true}
        trainingConfig={trainingConfig}
        onTrainingPress={handleTrainingPress}
        isTrainingMode={isTrainingMode}
        renderGame={renderGame}
        isPlaying={isPlaying}
        onStartPlaying={handleStartPlaying}
        renderProgress={renderProgress}
        mascotComponent={!isPlaying ? renderMascot : undefined}
        mascotMessage={mascotMessage}
        mascotMessageType={
          mascotEmotion === 'excited' ? 'victory' :
          mascotEmotion === 'thinking' ? 'hint' :
          mascotEmotion === 'encouraging' ? 'encourage' : 'intro'
        }
        showResetButton={!isPlaying}
        onReset={handleReset}
        showHintButton={!isPlaying}
        onHint={handleHint}
        hintsRemaining={hintsRemaining}
        hintsDisabled={false}
        animationConfig={{ selectorSlideDuration: 400, selectorFadeDuration: 300 }}
      />

      <ParentDrawer
        isVisible={showParentDrawer}
        onClose={() => setShowParentDrawer(false)}
        {...labyrintheParentGuideData}
      />
    </>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  levelCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    alignItems: 'center',
    minWidth: 80,
    minHeight: 100,
    borderWidth: 3,
    borderColor: theme.colors.background.secondary,
    ...theme.shadows.md,
  },
  levelCardSelected: {
    backgroundColor: theme.colors.feedback.successLight,
    borderColor: theme.colors.feedback.success,
    transform: [{ scale: 1.05 }],
  },
  levelCardLocked: {
    backgroundColor: theme.colors.background.secondary,
    opacity: 0.6,
  },
  levelCardCompleted: {
    borderColor: theme.colors.feedback.success,
  },
  levelThemeIcon: { fontSize: 24, marginBottom: theme.spacing[1] },
  levelNumber: {
    fontSize: 28,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  levelNumberSelected: { color: theme.colors.feedback.success },
  levelNumberLocked: { fontSize: 22, color: theme.colors.text.muted },
  levelSize: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  starsRow: { flexDirection: 'row', marginTop: theme.spacing[1] },
  starFilled: { fontSize: theme.fontSize.base, color: theme.colors.secondary.main },
  starEmpty: { fontSize: theme.fontSize.base, color: theme.colors.text.muted, opacity: 0.3 },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[4],
  },
  gamePreviewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[8],
    gap: theme.spacing[4],
  },
  gamePreviewEmptyText: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  mazePreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  progressPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[6],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borderRadius.xl,
    marginHorizontal: theme.spacing[4],
    ...theme.shadows.md,
  },
  progressItem: { alignItems: 'center' },
  progressValue: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.feedback.success,
  },
  progressLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
  progressDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.background.secondary,
  },
  mascotWithBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  mascotEmoji: { fontSize: 64 },
});
