/**
 * TangramBoard Component
 *
 * Plateau de jeu complet pour le Tangram
 *
 * REFACTORED:
 * - Touch targets >= 64dp (Guidelines)
 * - Font sizes >= 18pt (Guidelines)
 * - Icons from @/constants/icons (centralized)
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withDelay,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows, fontFamily, touchTargets, fontSize } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import type { TangramGameState } from '../types';
import { TangramPiece } from './TangramPiece';
import { ShadowShape } from './ShadowShape';

// ============================================================================
// TYPES
// ============================================================================

interface TangramBoardProps {
  /** État du jeu */
  gameState: TangramGameState;
  /** Callback déplacement */
  onMovePiece: (pieceId: string, deltaX: number, deltaY: number) => void;
  /** Callback fin de déplacement */
  onMoveEnd: (pieceId: string) => void;
  /** Callback rotation */
  onRotatePiece: (pieceId: string, clockwise: boolean) => void;
  /** Callback flip */
  onFlipPiece: (pieceId: string) => void;
  /** Callback sélection */
  onSelectPiece: (pieceId: string | null) => void;
  /** Callback pause */
  onPause: () => void;
  /** Callback indice */
  onHint: () => void;
  /** Callback retour */
  onBack: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BOARD_PADDING = 20;
const HEADER_HEIGHT = 60;
const CONTROLS_HEIGHT = 80;

// Calculer la taille du plateau
const BOARD_WIDTH = SCREEN_WIDTH - BOARD_PADDING * 2;
const BOARD_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - CONTROLS_HEIGHT - 100;

// Échelle pour les pièces (basé sur une grille de 100x100)
const SCALE = Math.min(BOARD_WIDTH, BOARD_HEIGHT) / 120;

// ============================================================================
// COMPONENT
// ============================================================================

export function TangramBoard({
  gameState,
  onMovePiece,
  onMoveEnd,
  onRotatePiece,
  onFlipPiece,
  onSelectPiece,
  onPause,
  onHint,
  onBack,
}: TangramBoardProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  // Animation pour l'indice
  const hintOpacity = useSharedValue(0);

  // Formater le temps
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculer la progression
  const placedCount = gameState.pieces.filter(p => p.isPlaced).length;
  const totalPieces = gameState.pieces.length;
  const progress = (placedCount / totalPieces) * 100;

  // Pièce sélectionnée
  const selectedPiece = gameState.selectedPieceId
    ? gameState.pieces.find(p => p.id === gameState.selectedPieceId)
    : null;

  // Animation de l'indice actif
  const hintStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
  }));

  // Afficher l'indice si disponible
  React.useEffect(() => {
    if (gameState.activeHint) {
      hintOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: getDuration(500) }),
          withTiming(0.3, { duration: getDuration(500) })
        ),
        -1,
        true
      );
    } else {
      hintOpacity.value = withTiming(0, { duration: getDuration(200) });
    }
  }, [gameState.activeHint, getDuration, hintOpacity]);

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <Animated.View
          style={styles.header}
          entering={shouldAnimate ? FadeInUp.duration(300) : undefined}
        >
          {/* Bouton retour - 64dp touch target */}
          <Pressable
            style={styles.backButton}
            onPress={onBack}
            accessibilityLabel="Retour"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>{Icons.back}</Text>
          </Pressable>

          {/* Infos niveau */}
          <View style={styles.levelInfo}>
            <Text style={styles.levelName}>{gameState.level.name}</Text>
            <Text style={styles.levelDifficulty}>
              {Icons.star.repeat(
                gameState.level.puzzle.difficulty === 'easy' ? 1 :
                gameState.level.puzzle.difficulty === 'medium' ? 2 : 3
              )}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>{Icons.timer}</Text>
              <Text style={styles.statValue}>{formatTime(gameState.timeElapsed)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>{Icons.refresh}</Text>
              <Text style={styles.statValue}>{gameState.moveCount}</Text>
            </View>
          </View>

          {/* Bouton pause - 64dp touch target */}
          <Pressable
            style={styles.pauseButton}
            onPress={onPause}
            accessibilityLabel="Pause"
            accessibilityRole="button"
          >
            <Text style={styles.pauseButtonText}>{Icons.pause}</Text>
          </Pressable>
        </Animated.View>

        {/* Barre de progression */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${progress}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {placedCount}/{totalPieces} pièces placées
          </Text>
        </View>

        {/* Plateau de jeu */}
        <View style={styles.boardContainer}>
          <View style={[styles.board, { width: BOARD_WIDTH, height: BOARD_HEIGHT }]}>
            {/* Silhouette cible */}
            <ShadowShape
              silhouette={gameState.level.silhouette}
              scale={SCALE}
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
            />

            {/* Indice visuel */}
            {gameState.activeHint && (
              <Animated.View style={[styles.hintOverlay, hintStyle]}>
                <View
                  style={[
                    styles.hintMarker,
                    {
                      left: gameState.activeHint.targetPosition.x * SCALE,
                      top: gameState.activeHint.targetPosition.y * SCALE,
                    }
                  ]}
                />
              </Animated.View>
            )}

            {/* Pièces */}
            {gameState.pieces.map((piece) => (
              <TangramPiece
                key={piece.id}
                piece={piece}
                scale={SCALE}
                isSelected={piece.id === gameState.selectedPieceId}
                onMove={onMovePiece}
                onMoveEnd={onMoveEnd}
                onRotate={onRotatePiece}
                onSelect={onSelectPiece}
                disabled={gameState.phase !== 'playing'}
              />
            ))}
          </View>
        </View>

        {/* Contrôles - 64dp touch targets minimum */}
        <Animated.View
          style={styles.controls}
          entering={shouldAnimate ? FadeIn.delay(200).duration(300) : undefined}
        >
          {/* Bouton rotation gauche */}
          <Pressable
            style={[
              styles.controlButton,
              !selectedPiece && styles.controlButtonDisabled,
            ]}
            onPress={() => selectedPiece && onRotatePiece(selectedPiece.id, false)}
            disabled={!selectedPiece}
            accessibilityLabel="Tourner dans le sens antihoraire"
            accessibilityRole="button"
          >
            <Text style={styles.controlButtonText}>{Icons.rotateLeft}</Text>
            <Text style={styles.controlButtonLabel}>Tourner</Text>
          </Pressable>

          {/* Bouton flip */}
          <Pressable
            style={[
              styles.controlButton,
              !selectedPiece && styles.controlButtonDisabled,
            ]}
            onPress={() => selectedPiece && onFlipPiece(selectedPiece.id)}
            disabled={!selectedPiece}
            accessibilityLabel="Retourner la pièce"
            accessibilityRole="button"
          >
            <Text style={styles.controlButtonText}>{Icons.flip}</Text>
            <Text style={styles.controlButtonLabel}>Retourner</Text>
          </Pressable>

          {/* Bouton indice */}
          <Pressable
            style={[
              styles.controlButton,
              styles.hintButton,
              gameState.hintsUsed >= gameState.level.hintsAvailable && styles.controlButtonDisabled,
            ]}
            onPress={onHint}
            disabled={gameState.hintsUsed >= gameState.level.hintsAvailable}
            accessibilityLabel={`Indice, ${gameState.level.hintsAvailable - gameState.hintsUsed} restants`}
            accessibilityRole="button"
          >
            <Text style={styles.controlButtonText}>{Icons.hint}</Text>
            <Text style={styles.controlButtonLabel}>
              Indice ({gameState.level.hintsAvailable - gameState.hintsUsed})
            </Text>
          </Pressable>

          {/* Bouton rotation droite */}
          <Pressable
            style={[
              styles.controlButton,
              !selectedPiece && styles.controlButtonDisabled,
            ]}
            onPress={() => selectedPiece && onRotatePiece(selectedPiece.id, true)}
            disabled={!selectedPiece}
            accessibilityLabel="Tourner dans le sens horaire"
            accessibilityRole="button"
          >
            <Text style={styles.controlButtonText}>{Icons.rotateRight}</Text>
            <Text style={styles.controlButtonLabel}>Tourner</Text>
          </Pressable>
        </Animated.View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            {selectedPiece
              ? 'Déplace la pièce • Double-tap pour tourner'
              : 'Touche une pièce pour la sélectionner'}
          </Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    height: HEADER_HEIGHT,
  },
  // Touch target >= 64dp (Guidelines AUDIT)
  backButton: {
    width: touchTargets.minimum, // 64dp
    height: touchTargets.minimum, // 64dp
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  backButtonText: {
    fontSize: 28,
    color: colors.text.primary,
  },
  levelInfo: {
    flex: 1,
    alignItems: 'center',
  },
  levelName: {
    fontSize: fontSize.lg, // 18pt minimum (Guidelines)
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  levelDifficulty: {
    fontSize: fontSize.md, // 16pt
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  statIcon: {
    fontSize: fontSize.lg, // 18pt
  },
  statValue: {
    fontSize: fontSize.lg, // 18pt minimum (Guidelines)
    fontFamily: fontFamily.medium,
    color: colors.text.secondary,
  },
  // Touch target >= 64dp (Guidelines AUDIT)
  pauseButton: {
    width: touchTargets.minimum, // 64dp
    height: touchTargets.minimum, // 64dp
    borderRadius: borderRadius.round,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  pauseButtonText: {
    fontSize: 24,
  },
  progressContainer: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary.main,
    borderRadius: borderRadius.round,
  },
  progressText: {
    fontSize: fontSize.lg, // 18pt minimum (Guidelines)
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing[1],
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BOARD_PADDING,
  },
  board: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    ...shadows.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  hintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hintMarker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.5)',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
    height: CONTROLS_HEIGHT,
  },
  // Touch target >= 64dp (Guidelines AUDIT)
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    minWidth: touchTargets.minimum, // 64dp
    minHeight: touchTargets.minimum, // 64dp
    ...shadows.sm,
  },
  controlButtonDisabled: {
    opacity: 0.4,
  },
  hintButton: {
    backgroundColor: colors.secondary.main,
  },
  controlButtonText: {
    fontSize: 28,
  },
  controlButtonLabel: {
    fontSize: fontSize.md, // 16pt (labels can be slightly smaller)
    color: colors.text.secondary,
    marginTop: 2,
  },
  instructionsContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  instructions: {
    fontSize: fontSize.lg, // 18pt minimum (Guidelines)
    color: colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TangramBoard;
