/**
 * MatricesPuzzleScreen - Main puzzle gameplay screen
 * Displays matrix grid, choices, mascot, and feedback
 */

import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideInDown,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { WorldTheme, GameState } from '../types';
import { WORLDS, PIXEL_DIALOGUES } from '../data';
import { useMatricesGame } from '../hooks';
import {
  MatrixGrid,
  ChoicePanel,
  PixelWithBubble,
  PixelMascot,
  SpeechBubble,
  HintButton,
  ProgressDots,
  AttemptsDisplay,
  ValidateButton,
} from '../components';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================================================
// HEADER COMPONENT
// ============================================================================

interface HeaderProps {
  worldName: string;
  primaryColor: string;
  puzzleIndex: number;
  totalPuzzles: number;
  hintsRemaining: number;
  onHintPress: () => void;
  onBackPress: () => void;
  attempts: number;
  maxAttempts: number;
}

const Header = ({
  worldName,
  primaryColor,
  puzzleIndex,
  totalPuzzles,
  hintsRemaining,
  onHintPress,
  onBackPress,
  attempts,
  maxAttempts,
}: HeaderProps) => (
  <Animated.View
    entering={FadeInDown.duration(300)}
    style={styles.header}
  >
    {/* Back button */}
    <Pressable
      onPress={onBackPress}
      style={styles.backButton}
      accessibilityLabel="Retour"
      accessibilityRole="button"
    >
      <Text style={styles.backIcon}>←</Text>
    </Pressable>

    {/* Center section */}
    <View style={styles.headerCenter}>
      <Text style={[styles.worldName, { color: primaryColor }]}>
        {worldName}
      </Text>
      <ProgressDots
        total={totalPuzzles}
        current={puzzleIndex}
        completed={puzzleIndex}
        primaryColor={primaryColor}
      />
    </View>

    {/* Right section */}
    <View style={styles.headerRight}>
      <AttemptsDisplay attempts={attempts} maxAttempts={maxAttempts} />
    </View>
  </Animated.View>
);

// ============================================================================
// FEEDBACK OVERLAY
// ============================================================================

interface FeedbackOverlayProps {
  state: GameState;
  onContinue: () => void;
  isLastPuzzle: boolean;
}

const FeedbackOverlay = ({ state, onContinue, isLastPuzzle }: FeedbackOverlayProps) => {
  if (state !== 'correct' && state !== 'revealing') return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.feedbackOverlay}
    >
      <Pressable
        style={styles.feedbackContent}
        onPress={onContinue}
      >
        <Animated.View
          entering={SlideInUp.duration(400).springify()}
          style={styles.feedbackCard}
        >
          <Text style={styles.feedbackEmoji}>
            {state === 'correct' ? '🎉' : '💡'}
          </Text>
          <Text style={styles.feedbackTitle}>
            {state === 'correct' ? 'Bravo !' : 'Voici la solution'}
          </Text>
          <Text style={styles.feedbackSubtitle}>
            {state === 'correct'
              ? 'Tu as trouvé le bon motif !'
              : 'Tu feras mieux la prochaine fois !'}
          </Text>
          <View style={styles.feedbackButton}>
            <Text style={styles.feedbackButtonText}>
              {isLastPuzzle ? 'Voir les résultats' : 'Puzzle suivant'}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

// ============================================================================
// PUZZLE SCREEN COMPONENT
// ============================================================================

export function MatricesPuzzleScreen() {
  const { worldId } = useLocalSearchParams<{ worldId: WorldTheme }>();
  const validWorldId = (worldId || 'forest') as WorldTheme;
  const world = WORLDS[validWorldId];

  const {
    puzzle,
    puzzleIndex,
    totalPuzzles,
    selectedChoice,
    correctChoiceIndex,
    incorrectChoiceIndex,
    gameState,
    attempts,
    maxAttempts,
    pixelMood,
    pixelMessage,
    hintsRemaining,
    canRequestHint,
    currentHint,
    startGame,
    selectChoice,
    submitAnswer,
    requestHint,
    nextPuzzle,
    exitGame,
  } = useMatricesGame();

  // Start game when screen mounts
  useEffect(() => {
    startGame(validWorldId);
  }, [validWorldId, startGame]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    exitGame();
    router.back();
  }, [exitGame]);

  // Handle continue after correct/reveal
  const handleContinue = useCallback(() => {
    if (gameState === 'complete') {
      // Navigate to victory screen
      router.replace({
        pathname: '/(games)/12-matrices-magiques/victory',
        params: {
          worldId: validWorldId,
          puzzlesCompleted: puzzleIndex + 1,
        },
      });
    } else {
      nextPuzzle();
    }
  }, [gameState, nextPuzzle, validWorldId, puzzleIndex]);

  // Get button state for choices
  const getChoiceState = useCallback(
    (index: number) => {
      if (correctChoiceIndex === index) return 'correct';
      if (incorrectChoiceIndex === index) return 'incorrect';
      if (selectedChoice === index) return 'selected';
      if (gameState === 'checking' || correctChoiceIndex !== null) return 'disabled';
      return 'idle';
    },
    [correctChoiceIndex, incorrectChoiceIndex, selectedChoice, gameState]
  );

  // Loading state
  if (!puzzle) {
    return (
      <View style={[styles.container, { backgroundColor: world.backgroundColor }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  const isLastPuzzle = puzzleIndex >= totalPuzzles - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background */}
      <LinearGradient
        colors={[world.backgroundColor, world.gradientColors[1] + '20']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <Header
          worldName={world.name}
          primaryColor={world.primaryColor}
          puzzleIndex={puzzleIndex}
          totalPuzzles={totalPuzzles}
          hintsRemaining={hintsRemaining}
          onHintPress={requestHint}
          onBackPress={handleBack}
          attempts={attempts}
          maxAttempts={maxAttempts}
        />

        {/* Main content */}
        <View style={styles.content}>
          {/* Mascot area */}
          <Animated.View
            entering={SlideInUp.duration(400).springify()}
            style={styles.mascotArea}
          >
            <View style={styles.mascotRow}>
              <PixelMascot mood={pixelMood} size="small" animated={true} />
              <SpeechBubble
                message={pixelMessage || 'Trouve le motif !'}
                theme={validWorldId}
                isVisible={true}
              />
            </View>
          </Animated.View>

          {/* Matrix Grid */}
          <Animated.View
            entering={FadeIn.delay(200).duration(400)}
            style={styles.gridArea}
          >
            <MatrixGrid
              cells={puzzle.cells}
              gridSize={puzzle.gridSize}
              theme={validWorldId}
              highlightedCells={
                currentHint?.visualHint === 'highlight_row'
                  ? puzzle.cells[puzzle.targetPosition.row]?.map((_, col) => ({
                      row: puzzle.targetPosition.row,
                      col,
                    }))
                  : currentHint?.visualHint === 'highlight_column'
                  ? puzzle.cells.map((_, row) => ({
                      row,
                      col: puzzle.targetPosition.col,
                    }))
                  : []
              }
              showPatternHints={currentHint?.visualHint === 'show_pattern'}
              animated={true}
            />
          </Animated.View>

          {/* Hint button */}
          <Animated.View
            entering={FadeIn.delay(300).duration(300)}
            style={styles.hintArea}
          >
            <HintButton
              hintsRemaining={hintsRemaining}
              onPress={requestHint}
              disabled={!canRequestHint || gameState !== 'playing'}
            />
          </Animated.View>
        </View>

        {/* Bottom section: Choices and Validate */}
        <View style={styles.bottomSection}>
          {/* Choice Panel */}
          <ChoicePanel
            choices={puzzle.choices}
            selectedIndex={selectedChoice}
            correctIndex={correctChoiceIndex}
            incorrectIndex={incorrectChoiceIndex}
            onChoiceSelect={selectChoice}
            theme={validWorldId}
            disabled={gameState !== 'playing' && gameState !== 'incorrect'}
          />

          {/* Validate Button */}
          <Animated.View
            entering={SlideInDown.delay(400).duration(300).springify()}
            style={styles.validateArea}
          >
            <ValidateButton
              onPress={submitAnswer}
              disabled={selectedChoice === null || gameState !== 'playing'}
              primaryColor={world.primaryColor}
            />
          </Animated.View>
        </View>
      </SafeAreaView>

      {/* Feedback Overlay */}
      <FeedbackOverlay
        state={gameState}
        onContinue={handleContinue}
        isLastPuzzle={isLastPuzzle}
      />
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'Nunito-Medium',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  worldName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Fredoka-Bold',
    marginBottom: 4,
  },
  headerRight: {
    width: 60,
    alignItems: 'center',
  },
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mascotArea: {
    marginBottom: 8,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  gridArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintArea: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  // Bottom section
  bottomSection: {
    paddingBottom: 16,
  },
  validateArea: {
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  // Feedback overlay
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  feedbackContent: {
    width: '100%',
    alignItems: 'center',
    padding: 24,
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 8,
  },
  feedbackEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Fredoka-Bold',
  },
  feedbackSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Nunito-Regular',
  },
  feedbackButton: {
    backgroundColor: '#7BC74D',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  feedbackButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
  },
});
