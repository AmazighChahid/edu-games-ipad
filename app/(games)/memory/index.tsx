/**
 * Memory Game Screen
 *
 * Écran principal du jeu Super Mémoire
 */

import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, spacing, borderRadius, shadows, fontFamily } from '@/theme';
import { useMemoryGame, getFirstMemoryLevel, GameBoard } from '@/games/memory';
import { VictoryCard, type VictoryBadge } from '@/components/common';
import { CardUnlockScreen } from '@/components/collection';
import { useCardUnlock } from '@/hooks/useCardUnlock';
import { useCollection } from '@/store';

// Fonction pour calculer le badge non-compétitif du Memory
const getMemoryBadge = (attempts: number, stars: number): VictoryBadge => {
  if (stars === 3) {
    return { icon: '🧠', label: 'Mémoire d\'Or' };
  } else if (stars === 2) {
    return { icon: '⭐', label: 'Concentré' };
  } else {
    return { icon: '💪', label: 'Persévérant' };
  }
};

export default function MemoryScreen() {
  const router = useRouter();
  const { getUnlockedCardsCount } = useCollection();
  const {
    gameState,
    result,
    isLoading,
    startGame,
    handleCardFlip,
    pauseGame,
    resumeGame,
    restartLevel,
  } = useMemoryGame();

  // Calculer si la performance est optimale (3 étoiles)
  const isOptimal = result?.stars === 3;
  const currentLevel = 1; // Memory n'a qu'un niveau pour l'instant

  // Système de déblocage de cartes
  const {
    unlockedCard,
    showUnlockAnimation,
    checkAndUnlockCard,
    dismissUnlockAnimation,
  } = useCardUnlock({
    gameId: 'memory',
    levelId: `level_${currentLevel}`,
    levelNumber: currentLevel,
    isOptimal,
  });

  // Check pour déblocage de carte après victoire
  const [hasCheckedUnlock, setHasCheckedUnlock] = useState(false);

  useEffect(() => {
    if (result && !hasCheckedUnlock) {
      const timer = setTimeout(() => {
        checkAndUnlockCard();
        setHasCheckedUnlock(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [result, hasCheckedUnlock, checkAndUnlockCard]);

  // Reset l'état quand on recommence
  useEffect(() => {
    if (!result) {
      setHasCheckedUnlock(false);
    }
  }, [result]);

  // Démarrer avec le premier niveau
  useEffect(() => {
    if (!gameState && !isLoading) {
      const firstLevel = getFirstMemoryLevel();
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
    Alert.alert(
      '💡 Indice',
      'Observe bien les cartes que tu retournes. Essaie de te souvenir de leur position !',
      [{ text: 'Compris !' }]
    );
  }, []);

  // Handlers pour le déblocage de cartes
  const handleViewCollection = () => {
    dismissUnlockAnimation();
    router.push('/(games)/collection');
  };

  const handleContinueAfterUnlock = () => {
    dismissUnlockAnimation();
  };

  // Afficher l'écran de déblocage de carte si une carte a été débloquée
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

  // Afficher l'écran de victoire avec VictoryCard unifié
  if (result) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <VictoryCard
          title="Bravo !"
          message="Tu as trouvé toutes les paires !"
          stats={{
            moves: result.attempts,
            timeElapsed: result.timeSeconds,
            stars: result.stars,
          }}
          badge={getMemoryBadge(result.attempts, result.stars)}
          onReplay={restartLevel}
          onHome={() => router.back()}
          onCollection={handleViewCollection}
          hasNextLevel={false}
        />
      </SafeAreaView>
    );
  }

  // Afficher le chargement
  if (isLoading || !gameState) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Préparation des cartes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Afficher le jeu
  return (
    <GameBoard
      gameState={gameState}
      onCardPress={handleCardFlip}
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
});
