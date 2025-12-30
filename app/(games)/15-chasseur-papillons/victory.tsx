/**
 * Chasseur de Papillons - Victory Screen
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

const getChasseurBadge = (
  accuracy: number,
  bestStreak: number,
  hintsUsed: number
): VictoryBadge => {
  if (accuracy >= 90 && hintsUsed === 0) {
    return { icon: '🦋', label: 'Maître Chasseur' };
  } else if (bestStreak >= 10) {
    return { icon: '🔥', label: 'En Feu' };
  } else if (accuracy >= 70) {
    return { icon: '👁️', label: 'Oeil de Lynx' };
  } else if (hintsUsed >= 3) {
    return { icon: '💪', label: 'Persévérant' };
  } else {
    return { icon: '🌸', label: 'Explorateur' };
  }
};

// ============================================
// ÉCRAN DE VICTOIRE
// ============================================

export default function ChasseurPapillonsVictoryScreen() {
  const router = useRouter();
  const { getUnlockedCardsCount } = useCollection();
  const recordCompletion = useStore((state) => state.recordCompletion);

  const params = useLocalSearchParams<{
    score: string;
    targetsCaught: string;
    wrongCatches: string;
    bestStreak: string;
    accuracy: string;
    totalTime: string;
    level: string;
    hintsUsed?: string;
  }>();

  // Parse les paramètres
  const score = parseInt(params.score ?? '0', 10);
  const targetsCaught = parseInt(params.targetsCaught ?? '0', 10);
  const wrongCatches = parseInt(params.wrongCatches ?? '0', 10);
  const bestStreak = parseInt(params.bestStreak ?? '0', 10);
  const accuracy = parseInt(params.accuracy ?? '0', 10);
  const totalTime = parseInt(params.totalTime ?? '0', 10);
  const currentLevel = parseInt(params.level ?? '1', 10);
  const hintsUsed = parseInt(params.hintsUsed ?? '0', 10);
  const nextLevel = currentLevel < 10 ? currentLevel + 1 : null;

  // Calculs
  const badge = getChasseurBadge(accuracy, bestStreak, hintsUsed);
  const isOptimal = accuracy >= 80 && hintsUsed === 0;

  // Système de déblocage de cartes
  const {
    unlockedCard,
    showUnlockAnimation,
    checkAndUnlockCard,
    dismissUnlockAnimation,
  } = useCardUnlock({
    gameId: 'chasseur-papillons',
    levelId: `level_${currentLevel}`,
    levelNumber: currentLevel,
    isOptimal,
  });

  // Sauvegarder la progression du niveau complété
  const [hasRecordedCompletion, setHasRecordedCompletion] = useState(false);

  useEffect(() => {
    if (!hasRecordedCompletion) {
      recordCompletion({
        gameId: 'chasseur-papillons',
        levelId: `level_${currentLevel}`,
        completedAt: Date.now(),
        moveCount: targetsCaught,
        timeSeconds: Math.floor(totalTime / 1000),
        hintsUsed: hintsUsed,
      });
      setHasRecordedCompletion(true);
    }
  }, [hasRecordedCompletion, recordCompletion, currentLevel, targetsCaught, totalTime, hintsUsed]);

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
    router.replace('/(games)/15-chasseur-papillons');
  };

  const handleNextLevel = () => {
    if (nextLevel) {
      router.replace({
        pathname: '/(games)/15-chasseur-papillons',
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
              { label: 'Score', value: `${score}`, icon: '🏆' },
              { label: 'Attrapés', value: `🦋 ${targetsCaught}`, icon: '✅' },
              { label: 'Précision', value: `${accuracy}%` },
              { label: 'Meilleure série', value: `🔥 ${bestStreak}` },
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
