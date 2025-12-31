/**
 * SudokuIntroScreen - Refactored with Hook+Template Architecture
 *
 * Features:
 * - 10 progressive levels + Training mode
 * - Animated Felix mascot (fox)
 * - Smooth transitions between selection and gameplay
 * - Parent drawer integration
 * - Victory card with card unlock system
 */

import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';

import {
  GameIntroTemplate,
  PageContainer,
  VictoryCard,
  HintButton,
} from '@/components/common';
import { ParentDrawer } from '@/components/parent/ParentDrawer';
import { CardUnlockScreen } from '@/components/collection';
import { useCardUnlock } from '@/hooks/useCardUnlock';
import { useCollection } from '@/store';
import { theme } from '@/theme';
import { Icons } from '@/constants/icons';

import { useSudokuIntro } from '../hooks/useSudokuIntro';
import { FelixMascot } from '../components/FelixMascot';
import { SudokuLevelCard } from '../components/SudokuLevelCard';
import { TrainingModeSelector } from '../components/TrainingModeSelector';
import { SudokuGameArea } from '../components/SudokuGameArea';
import { SudokuProgressPanel } from '../components/SudokuProgressPanel';
import { SudokuBackground } from '../components/SudokuBackground';
import type { SudokuLevelConfig } from '../types';

// ============================================
// VICTORY BADGE HELPER
// ============================================

function getSudokuBadge(errorCount: number, hintsUsed: number) {
  if (errorCount === 0 && hintsUsed === 0) {
    return { icon: Icons.puzzle, label: 'Maître Puzzle' };
  } else if (errorCount <= 2 && hintsUsed <= 1) {
    return { icon: Icons.star, label: 'Perspicace' };
  } else if (hintsUsed >= 3) {
    return { icon: Icons.muscle, label: 'Persévérant' };
  } else {
    return { icon: Icons.sparkles, label: 'Explorateur' };
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export function SudokuIntroScreen() {
  const router = useRouter();
  const intro = useSudokuIntro();
  const { getUnlockedCardsCount } = useCollection();

  // Card unlock system
  const levelNumber = intro.selectedLevel?.number || 1;
  const isOptimal = intro.errorCount === 0 && intro.gameState.hintsUsed === 0;

  const {
    unlockedCard,
    showUnlockAnimation,
    checkAndUnlockCard,
    dismissUnlockAnimation,
  } = useCardUnlock({
    gameId: 'sudoku',
    levelId: `level_${levelNumber}`,
    levelNumber,
    isOptimal,
  });

  // Handle victory card unlock
  React.useEffect(() => {
    if (intro.isVictory && !showUnlockAnimation) {
      const timer = setTimeout(() => {
        checkAndUnlockCard();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [intro.isVictory, showUnlockAnimation, checkAndUnlockCard]);

  // Collection navigation
  const handleViewCollection = useCallback(() => {
    dismissUnlockAnimation();
    router.push('/(games)/collection');
  }, [dismissUnlockAnimation, router]);

  const handleContinueAfterUnlock = useCallback(() => {
    dismissUnlockAnimation();
  }, [dismissUnlockAnimation]);

  // Render level card
  const renderLevelCard = useCallback(
    (level: SudokuLevelConfig, isSelected: boolean) => (
      <SudokuLevelCard
        level={level}
        isSelected={isSelected}
        onPress={() => intro.handleSelectLevel(level)}
      />
    ),
    [intro.handleSelectLevel]
  );

  // Render game area
  const renderGame = useCallback(
    () => (
      <SudokuGameArea
        gameState={intro.gameState}
        onCellPress={intro.handleCellPress}
        onSymbolSelect={intro.handleSymbolSelect}
        onClear={intro.handleClearCell}
        selectedSymbol={intro.selectedSymbol}
        showConflicts={intro.gameConfig?.showConflicts}
        onDrop={intro.handleDrop}
      />
    ),
    [
      intro.gameState,
      intro.handleCellPress,
      intro.handleSymbolSelect,
      intro.handleClearCell,
      intro.selectedSymbol,
      intro.gameConfig?.showConflicts,
      intro.handleDrop,
    ]
  );

  // Render progress panel
  const renderProgress = useCallback(
    () => (
      <Animated.View style={intro.progressPanelStyle}>
        <SudokuProgressPanel
          emptyCellsRemaining={intro.progressData.emptyCellsRemaining}
          totalEmptyCells={intro.progressData.totalEmptyCells}
          hintsUsed={intro.progressData.hintsUsed}
          errorsCount={intro.progressData.errorsCount}
          progress={intro.progressData.progress}
          maxHints={3}
        />
      </Animated.View>
    ),
    [intro.progressPanelStyle, intro.progressData]
  );

  // Show card unlock screen if card unlocked
  if (showUnlockAnimation && unlockedCard) {
    return (
      <CardUnlockScreen
        card={unlockedCard}
        unlockedCount={getUnlockedCardsCount()}
        onViewCollection={handleViewCollection}
        onContinue={handleContinueAfterUnlock}
      />
    );
  }

  // Convert levels to GameIntroTemplate format
  const templateLevels = useMemo(
    () =>
      intro.levels.map((level) => ({
        id: level.id,
        number: level.number,
        difficulty: level.difficulty === 1 ? 'easy' as const : level.difficulty === 2 ? 'medium' as const : 'hard' as const,
        isUnlocked: level.isUnlocked,
        isCompleted: level.isCompleted,
        stars: level.stars,
      })),
    [intro.levels]
  );

  const selectedTemplateLevel = intro.selectedLevel
    ? {
        id: intro.selectedLevel.id,
        number: intro.selectedLevel.number,
        difficulty: intro.selectedLevel.difficulty === 1 ? 'easy' as const : intro.selectedLevel.difficulty === 2 ? 'medium' as const : 'hard' as const,
        isUnlocked: intro.selectedLevel.isUnlocked,
        isCompleted: intro.selectedLevel.isCompleted,
        stars: intro.selectedLevel.stars,
      }
    : null;

  return (
    <SudokuBackground>
      <PageContainer variant="playful" edges={['top', 'bottom']}>
        <GameIntroTemplate
          // Header
          title="Sudoku"
          emoji={Icons.puzzle}
          onBack={intro.handleBack}
          onParentPress={intro.handleParentPress}
          onHelpPress={intro.handleHelpPress}
          showParentButton
          showHelpButton

          // Levels
          levels={templateLevels}
          selectedLevel={selectedTemplateLevel}
          onSelectLevel={(level) => {
            const sudokuLevel = intro.levels.find((l) => l.id === level.id);
            if (sudokuLevel) {
              intro.handleSelectLevel(sudokuLevel);
            }
          }}
          renderLevelCard={(level, isSelected) => {
            const sudokuLevel = intro.levels.find((l) => l.id === level.id);
            if (sudokuLevel) {
              return renderLevelCard(sudokuLevel, isSelected);
            }
            return null;
          }}

          // Training mode
          showTrainingMode
          onTrainingPress={intro.handleTrainingModeToggle}

          // Game
          renderGame={renderGame}
          isPlaying={intro.isPlaying}
          onStartPlaying={intro.handleStartPlaying}

          // Progress (shown during play)
          renderProgress={renderProgress}

          // Mascot
          mascotComponent={
            <FelixMascot
              message={intro.mascotMessage}
              emotion={intro.mascotEmotion}
              visible={true}
            />
          }

          // Floating buttons
          showResetButton={intro.isPlaying}
          onReset={intro.handleReset}
          showHintButton={intro.isPlaying && intro.hintsRemaining > 0}
          onHint={intro.handleHint}
          hintsRemaining={intro.hintsRemaining}

          // Victory
          isVictory={intro.isVictory}
        />

        {/* Victory Overlay */}
        {intro.isVictory && intro.selectedLevel && (
          <VictoryCard
            variant="overlay"
            title="Bravo !"
            message={`Tu as complété le niveau ${intro.selectedLevel.number} !`}
            mascot={{
              emoji: Icons.fox,
              message:
                intro.errorCount === 0
                  ? 'Parfait ! Aucune erreur !'
                  : 'Super travail !',
            }}
            stats={{
              hintsUsed: intro.gameState.hintsUsed,
              customStats: [
                { label: 'Erreurs', value: intro.errorCount, icon: Icons.error },
              ],
            }}
            badge={getSudokuBadge(intro.errorCount, intro.gameState.hintsUsed)}
            onReplay={intro.handleReset}
            onHome={intro.handleBack}
            onCollection={handleViewCollection}
            hasNextLevel={intro.selectedLevel.number < 10}
          />
        )}

        {/* Training Mode Selector Modal */}
        <TrainingModeSelector
          visible={intro.showTrainingSelector}
          onClose={() => intro.setShowTrainingSelector(false)}
          config={intro.trainingConfig}
          onConfigChange={intro.handleTrainingConfigChange}
          onStart={intro.handleStartTraining}
        />

        {/* Parent Drawer - TODO: Add proper parent guide data */}
        <ParentDrawer
          isVisible={intro.showParentDrawer}
          onClose={() => intro.setShowParentDrawer(false)}
          activityName="Sudoku"
          activityEmoji={Icons.puzzle}
        />
      </PageContainer>
    </SudokuBackground>
  );
}

export default SudokuIntroScreen;
