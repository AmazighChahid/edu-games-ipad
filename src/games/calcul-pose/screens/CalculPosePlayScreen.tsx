/**
 * Calcul Posé Play Screen
 * Main gameplay screen with drawing canvas and calculation board
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '@/theme';
import { AssistantBubble } from '@/components/assistant';
import { useAssistant } from '@/store/useStore';
import { DrawingCanvas, CalculationBoard } from '../components';
import { useCalculPoseGame } from '../hooks/useCalculPoseGame';
import type { DrawingPath } from '../types';

interface CalculPosePlayScreenProps {
  levelId?: string;
}

export function CalculPosePlayScreen({ levelId }: CalculPosePlayScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const assistant = useAssistant();

  const [showSuccess, setShowSuccess] = useState(false);

  const canvasScale = useSharedValue(1);

  const handleVictory = useCallback(() => {
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/(games)/calcul-pose/victory');
    }, 2000);
  }, [router]);

  const {
    gameState,
    level,
    problemIndex,
    totalProblems,
    isVictory,
    isRecognizing,
    recognitionReady,
    selectCell,
    handleDrawingComplete,
    submitDigit,
    clearCurrentDrawing,
    setCanvasSize,
    reset,
  } = useCalculPoseGame({
    levelId,
    onVictory: handleVictory,
  });

  // Canvas size based on screen width
  const canvasSize = Math.min(screenWidth * 0.4, 250);

  useEffect(() => {
    setCanvasSize(canvasSize, canvasSize);
  }, [canvasSize, setCanvasSize]);

  const handleBack = () => {
    router.back();
  };

  const handleReset = () => {
    canvasScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    reset();
  };

  const handleCellPress = (cellId: string) => {
    selectCell(cellId);
  };

  const handleDrawingDone = (paths: DrawingPath[]) => {
    handleDrawingComplete(paths);
  };

  const handleClear = () => {
    clearCurrentDrawing();
  };

  // Direct digit input buttons for fallback
  const handleDigitInput = (digit: number) => {
    if (gameState.currentCellId) {
      submitDigit(digit);
    }
  };

  const canvasAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: canvasScale.value }],
  }));

  const currentCell = gameState.cells.find(c => c.id === gameState.currentCellId);
  const hasSelectedCell = currentCell && currentCell.isEditable;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[2],
          paddingBottom: insets.bottom + spacing[2],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Calcul Posé</Text>
          <Text style={styles.headerProgress}>
            {problemIndex + 1} / {totalProblems}
          </Text>
        </View>

        <Pressable onPress={handleReset} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>↻</Text>
        </Pressable>
      </View>

      {/* Main content - Horizontal layout */}
      <View style={styles.mainContent}>
        {/* Left side - Calculation board */}
        <View style={styles.calculationSide}>
          <CalculationBoard
            gameState={gameState}
            onCellPress={handleCellPress}
            selectedCellId={gameState.currentCellId}
          />
        </View>

        {/* Right side - Drawing area */}
        <View style={styles.drawingSide}>
          {hasSelectedCell ? (
            <Animated.View
              entering={SlideInRight.duration(300)}
              style={[styles.canvasContainer, canvasAnimStyle]}
            >
              <Text style={styles.canvasLabel}>Dessine le chiffre ici :</Text>

              <DrawingCanvas
                width={canvasSize}
                height={canvasSize}
                onDrawingComplete={handleDrawingDone}
                onClear={handleClear}
                disabled={isVictory}
                recognizedDigit={gameState.recognizedDigit}
              />

              {isRecognizing && (
                <View style={styles.recognizingBadge}>
                  <Text style={styles.recognizingText}>Analyse...</Text>
                </View>
              )}

              {/* Digit buttons as fallback/alternative input */}
              <View style={styles.digitButtons}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                  <Pressable
                    key={digit}
                    onPress={() => handleDigitInput(digit)}
                    style={({ pressed }) => [
                      styles.digitButton,
                      pressed && styles.digitButtonPressed,
                    ]}
                  >
                    <Text style={styles.digitButtonText}>{digit}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn} style={styles.hintContainer}>
              <Text style={styles.hintIcon}>👆</Text>
              <Text style={styles.hintText}>
                Touche une case vide pour écrire
              </Text>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Success overlay */}
      {showSuccess && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut}
          style={styles.successOverlay}
        >
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successText}>Bravo !</Text>
        </Animated.View>
      )}

      {/* Assistant bubble */}
      {assistant.isVisible && assistant.currentMessage && (
        <AssistantBubble
          message={assistant.currentMessage}
          mood={assistant.mood}
          onDismiss={assistant.hideMessage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.game,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  headerButton: {
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  headerButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  headerProgress: {
    ...textStyles.caption,
    color: colors.text.muted,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    gap: spacing[6],
  },
  calculationSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawingSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasContainer: {
    alignItems: 'center',
    gap: spacing[3],
  },
  canvasLabel: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  recognizingBadge: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  recognizingText: {
    ...textStyles.caption,
    color: colors.primary.contrast,
    fontWeight: 'bold',
  },
  digitButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[2],
    marginTop: spacing[4],
    maxWidth: 280,
  },
  digitButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
    borderWidth: 2,
    borderColor: colors.ui.border,
  },
  digitButtonPressed: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
  },
  digitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  hintContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  hintIcon: {
    fontSize: 48,
    marginBottom: spacing[3],
  },
  hintText: {
    ...textStyles.body,
    color: colors.text.muted,
    textAlign: 'center',
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: spacing[4],
  },
  successText: {
    ...textStyles.gameTitle,
    color: colors.primary.contrast,
  },
});
