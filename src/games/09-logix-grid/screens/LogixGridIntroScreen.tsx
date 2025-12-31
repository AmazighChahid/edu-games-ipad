/**
 * LogixGridIntroScreen
 *
 * Écran d'introduction pour le jeu Logix Grid.
 * Suit le pattern Hook + Template avec GameIntroTemplate.
 *
 * @see docs/GAME_ARCHITECTURE.md
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  GameIntroTemplate,
  VictoryCard,
  HintButton,
  Button,
  MascotBubble,
} from '../../../components/common';
import { theme } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useLogixGridIntro } from '../hooks/useLogixGridIntro';
import { GameBoard } from '../components/GameBoard';
import { LogixGrid } from '../components/LogixGrid';
import { AdaMascot } from '../components/AdaMascot';

// ============================================================================
// COMPONENT
// ============================================================================

export default function LogixGridIntroScreen() {
  const {
    // Niveaux
    levels,
    selectedLevel,
    handleSelectLevel,

    // État jeu
    isPlaying,
    isVictory,

    // Mascot
    mascotMessage,
    mascotEmotion,

    // Game state
    gameState,
    result,
    errors,

    // Progress
    progressData,

    // Handlers
    handleCellToggle,
    handleCellSelect,
    handleClueUse,
    handleHintRequest,
    handleReset,
    handleBack,
    handleStartPlaying,
    getCellStateValue,

    // Hints
    hintsRemaining,
  } = useLogixGridIntro();

  // Écran de victoire
  if (isVictory && result) {
    return (
      <VictoryCard
        title="Enquête résolue !"
        emoji={Icons.search}
        subtitle="Tu es un super détective !"
        stats={[
          {
            label: 'Temps',
            value: `${Math.floor(result.timeSeconds / 60)}:${(result.timeSeconds % 60).toString().padStart(2, '0')}`,
            icon: Icons.timer,
          },
          {
            label: 'Actions',
            value: result.actionCount.toString(),
            icon: Icons.target,
          },
          {
            label: 'Indices',
            value: result.hintsUsed.toString(),
            icon: Icons.lightbulb,
          },
          {
            label: 'Score',
            value: `${result.score} pts`,
            icon: Icons.star,
          },
        ]}
        stars={result.stars}
        isPerfect={result.isPerfect}
        onReplay={handleReset}
        onHome={handleBack}
        replayLabel="Rejouer"
        homeLabel="Menu"
      />
    );
  }

  // Rendu du jeu - grille simple en intro, GameBoard complet en playing
  const renderGame = () => {
    if (!gameState) return null;

    // En mode playing, afficher le GameBoard complet avec timer, contrôles, etc.
    if (isPlaying) {
      return (
        <GameBoard
          gameState={gameState}
          errors={errors}
          onCellToggle={handleCellToggle}
          onCellSelect={handleCellSelect}
          onClueUse={handleClueUse}
          onHintRequest={handleHintRequest}
          getCellState={getCellStateValue}
          onPause={() => {}}
          onBack={handleBack}
        />
      );
    }

    // En mode intro (isPlaying=false), afficher juste la grille en aperçu
    return (
      <View style={styles.previewContainer}>
        <LogixGrid
          gameState={gameState}
          errors={errors}
          onCellToggle={handleCellToggle}
          onCellSelect={handleCellSelect}
          getCellState={getCellStateValue}
        />
      </View>
    );
  };

  // Rendu progress panel
  const renderProgress = () => {
    if (!isPlaying) return null;

    return (
      <View style={styles.progressPanel}>
        <Text style={styles.progressText}>
          Indices utilisés: {progressData.cluesUsed}/{progressData.totalClues}
        </Text>
      </View>
    );
  };

  return (
    <GameIntroTemplate
      // Header
      title="Logix Grid"
      emoji={Icons.search}
      onBack={handleBack}

      // Niveaux
      levels={levels}
      selectedLevel={selectedLevel}
      onSelectLevel={handleSelectLevel}

      // État
      isPlaying={isPlaying}
      isVictory={isVictory}

      // Mascotte Ada
      mascotComponent={
        <AdaMascot
          message={mascotMessage}
          emotion={mascotEmotion}
          visible={true}
        />
      }

      // Jeu - renderGame doit être une fonction
      renderGame={renderGame}

      // Boutons flottants (mode jeu)
      showResetButton={isPlaying}
      onReset={handleReset}
      showHintButton={isPlaying}
      onHint={handleHintRequest}
      hintsRemaining={hintsRemaining}

      // Transition vers le jeu
      onStartPlaying={handleStartPlaying}

      // Progress (en mode jeu)
      renderProgress={renderProgress}
    />
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    width: '100%',
    opacity: 0.8,
  },
  progressPanel: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
});
