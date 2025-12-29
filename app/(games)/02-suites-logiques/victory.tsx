/**
 * Suites Logiques - Victory Screen
 * Écran de victoire avec VictoryCard unifié et système de déblocage de cartes
 */

import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { colors, spacing } from '../../../src/theme';
import { VictoryCard, PageContainer, Confetti, type VictoryBadge } from '../../../src/components/common';
import { CardUnlockScreen } from '../../../src/components/collection';
import { useCardUnlock } from '../../../src/hooks';
import { useCollection, useStore } from '../../../src/store';

// ============================================
// BADGES NON-COMPÉTITIFS
// ============================================

const getSuitesLogBadge = (
  correctFirstTry: number,
  completed: number,
  hintsUsed: number
): VictoryBadge => {
  const successRate = correctFirstTry / completed;

  if (hintsUsed === 0 && successRate >= 0.8) {
    return { icon: '🧠', label: 'Logicien' };
  } else if (successRate >= 0.6) {
    return { icon: '⭐', label: 'Perspicace' };
  } else if (hintsUsed >= 5) {
    return { icon: '💪', label: 'Persévérant' };
  } else {
    return { icon: '🌟', label: 'Explorateur' };
  }
};

// ============================================
// ÉCRAN DE VICTOIRE
// ============================================

export default function SuitesLogiquesVictoryScreen() {
  const router = useRouter();
  const { getUnlockedCardsCount } = useCollection();
  const recordCompletion = useStore((state) => state.recordCompletion);

  const params = useLocalSearchParams<{
    completed: string;
    correctFirstTry: string;
    maxStreak: string;
    totalTime: string;
    level: string;
    hintsUsed?: string;
  }>();

  // Parse les paramètres
  const completed = parseInt(params.completed ?? '8', 10);
  const correctFirstTry = parseInt(params.correctFirstTry ?? '0', 10);
  const maxStreak = parseInt(params.maxStreak ?? '0', 10);
  const totalTime = parseInt(params.totalTime ?? '0', 10);
  const currentLevel = parseInt(params.level ?? '1', 10);
  const hintsUsed = parseInt(params.hintsUsed ?? '0', 10);
  const nextLevel = currentLevel < 5 ? currentLevel + 1 : null;

  // Calculs
  const successRate = Math.round((correctFirstTry / completed) * 100);
  const badge = getSuitesLogBadge(correctFirstTry, completed, hintsUsed);
  const isOptimal = successRate >= 80 && hintsUsed === 0;

  // Système de déblocage de cartes
  const {
    unlockedCard,
    showUnlockAnimation,
    checkAndUnlockCard,
    dismissUnlockAnimation,
  } = useCardUnlock({
    gameId: 'suites-logiques',
    levelId: `level_${currentLevel}`,
    levelNumber: currentLevel,
    isOptimal,
  });

  // Sauvegarder la progression du niveau complété
  const [hasRecordedCompletion, setHasRecordedCompletion] = useState(false);

  useEffect(() => {
    if (!hasRecordedCompletion) {
      recordCompletion({
        gameId: 'suites-logiques',
        levelId: `level_${currentLevel}`,
        completedAt: Date.now(),
        moveCount: completed, // Nombre de séquences complétées
        timeSeconds: Math.floor(totalTime / 1000),
        hintsUsed: hintsUsed,
      });
      setHasRecordedCompletion(true);
    }
  }, [hasRecordedCompletion, recordCompletion, currentLevel, completed, totalTime, hintsUsed]);

  // Check pour déblocage de carte
  const [hasCheckedUnlock, setHasCheckedUnlock] = useState(false);

  useEffect(() => {
    if (!hasCheckedUnlock) {
      const timer = setTimeout(() => {
        checkAndUnlockCard();
        setHasCheckedUnlock(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasCheckedUnlock, checkAndUnlockCard]);

  // Handlers
  const handlePlayAgain = () => {
    router.replace('/(games)/02-suites-logiques');
  };

  const handleNextLevel = () => {
    if (nextLevel) {
      router.replace({
        pathname: '/(games)/02-suites-logiques',
        params: { level: nextLevel.toString() },
      });
    }
  };

  const handleHome = () => {
    router.push('/');
  };

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

  // Formatage du temps
  const timeInSeconds = Math.floor(totalTime / 1000);

  return (
    <PageContainer variant="playful" showDecorations={false}>
      {/* Animation confetti */}
      <Confetti type="emoji" count={30} loop={false} />

      <View style={styles.content}>
        <VictoryCard
          title="Bravo !"
          message={`Niveau ${currentLevel} terminé !`}
          stats={{
            timeElapsed: timeInSeconds,
            hintsUsed: hintsUsed > 0 ? hintsUsed : undefined,
            customStats: [
              { label: 'Réussies', value: `${correctFirstTry}/${completed}`, icon: '✅' },
              { label: 'Meilleure série', value: `🔥 ${maxStreak}` },
              { label: 'Taux de réussite', value: `${successRate}%` },
            ],
          }}
          badge={badge}
          onReplay={handlePlayAgain}
          onNextLevel={nextLevel ? handleNextLevel : undefined}
          hasNextLevel={nextLevel !== null}
          nextLevelLabel={nextLevel ? `Niveau ${nextLevel} →` : undefined}
          onHome={handleHome}
          onCollection={handleViewCollection}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[4],
  },
});
