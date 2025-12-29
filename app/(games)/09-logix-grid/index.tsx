/**
 * Logix Grid - Écran Principal
 *
 * Écran d'introduction et de jeu pour Logix Grid.
 * Utilise le pattern Hook + Template avec GameIntroTemplate.
 *
 * @see docs/GAME_ARCHITECTURE.md
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { theme } from '../../../src/theme';
import {
  GameIntroTemplate,
  VictoryCard,
  HintButton,
  Button,
} from '../../../src/components/common';
import { Icons } from '../../../src/constants/icons';
import {
  useLogixGridIntro,
  GameBoard,
  AdaMascot,
} from '../../../src/games/09-logix-grid';

// ============================================================================
// COMPONENT
// ============================================================================

export default function LogixGridScreen() {
  const {
    // Niveaux
    levels,
    selectedLevel,
    handleSelectLevel,

    // État jeu
    isPlaying,
    isVictory,

    // Animations
    selectorStyle,
    progressPanelStyle,

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

  // Rendu du jeu actif
  const renderGame = () => {
    if (!gameState) return null;

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
  };

  // Boutons d'action
  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <Button
        label="C'est parti !"
        onPress={handleStartPlaying}
        variant="primary"
        size="large"
        disabled={!selectedLevel}
      />
    </View>
  );

  // Bouton indice
  const renderHintButton = () => (
    <HintButton
      remaining={hintsRemaining}
      maxHints={gameState?.puzzle.hintsAvailable ?? 3}
      onPress={handleHintRequest}
      disabled={hintsRemaining === 0}
    />
  );

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
      renderProgress={isPlaying ? () => (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#666' }}>
            Indices utilisés: {progressData.cluesUsed}/{progressData.totalClues}
          </Text>
        </View>
      ) : undefined}
    />
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  actionButtons: {
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
  },
});
