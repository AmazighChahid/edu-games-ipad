/**
 * Tangram Game Screen
 *
 * Écran principal du jeu Puzzle Formes (Tangram)
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, spacing, borderRadius, shadows, fontFamily } from '../../../src/theme';
import { useTangramGame, getFirstTangramLevel, TangramBoard } from '../../../src/games/08-tangram';

export default function TangramScreen() {
  const router = useRouter();
  const {
    gameState,
    result,
    isLoading,
    startGame,
    handleMove,
    handleMoveEnd,
    handleRotate,
    handleFlip,
    handleSelect,
    pauseGame,
    resumeGame,
    restartLevel,
    requestHint,
  } = useTangramGame();

  // Démarrer avec le premier niveau
  useEffect(() => {
    if (!gameState && !isLoading) {
      const firstLevel = getFirstTangramLevel();
      startGame(firstLevel);
    }
  }, [gameState, isLoading, startGame]);

  // Handlers
  const handleBack = useCallback(() => {
    if (gameState?.phase === 'playing') {
      Alert.alert(
        'Quitter le jeu ?',
        'Ta progression sera perdue.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Quitter', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  }, [gameState, router]);

  const handlePause = useCallback(() => {
    pauseGame();
    Alert.alert(
      'Jeu en pause',
      'Prends ton temps !',
      [{ text: 'Reprendre', onPress: resumeGame }]
    );
  }, [pauseGame, resumeGame]);

  const handleHint = useCallback(() => {
    if (gameState && gameState.hintsUsed < gameState.level.hintsAvailable) {
      requestHint();
      Alert.alert(
        '💡 Indice',
        'Regarde la zone qui clignote ! C\'est là que tu dois placer une pièce.',
        [{ text: 'Compris !' }]
      );
    } else {
      Alert.alert(
        '💡 Plus d\'indices',
        'Tu as utilisé tous tes indices. Continue, tu peux y arriver !',
        [{ text: 'OK' }]
      );
    }
  }, [gameState, requestHint]);

  // Afficher l'écran de victoire
  if (result) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.victoryContainer}>
          <Text style={styles.victoryEmoji}>🎨</Text>
          <Text style={styles.victoryTitle}>Bravo !</Text>
          <Text style={styles.victorySubtitle}>
            Tu as reconstitué la forme !
          </Text>

          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Temps</Text>
              <Text style={styles.statValue}>
                {Math.floor(result.timeSeconds / 60)}:{(result.timeSeconds % 60).toString().padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Mouvements</Text>
              <Text style={styles.statValue}>{result.moveCount}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Indices utilisés</Text>
              <Text style={styles.statValue}>{result.hintsUsed}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Étoiles</Text>
              <Text style={styles.statValue}>
                {'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}
              </Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable style={styles.primaryButton} onPress={restartLevel}>
              <Text style={styles.primaryButtonText}>Rejouer</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
              <Text style={styles.secondaryButtonText}>Menu</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Afficher le chargement
  if (isLoading || !gameState) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Préparation des pièces...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Afficher le jeu
  return (
    <TangramBoard
      gameState={gameState}
      onMovePiece={handleMove}
      onMoveEnd={handleMoveEnd}
      onRotatePiece={handleRotate}
      onFlipPiece={handleFlip}
      onSelectPiece={handleSelect}
      onPause={handlePause}
      onHint={handleHint}
      onBack={handleBack}
    />
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.text.secondary,
    fontFamily: fontFamily.medium,
  },
  victoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  victoryEmoji: {
    fontSize: 80,
    marginBottom: spacing[4],
  },
  victoryTitle: {
    fontSize: 36,
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    color: colors.primary.main,
    marginBottom: spacing[2],
  },
  victorySubtitle: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: spacing[8],
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    width: '100%',
    maxWidth: 300,
    marginBottom: spacing[8],
    ...shadows.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  statLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: 20,
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
    gap: spacing[3],
  },
  primaryButton: {
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  primaryButtonText: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  secondaryButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
