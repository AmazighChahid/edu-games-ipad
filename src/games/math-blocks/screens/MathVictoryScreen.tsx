/**
 * MathBlocks Victory Screen
 * Displays results after game completion using unified VictoryCard
 */

import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';
import { useStore, useCollection } from '@/store';
import { VictoryCard, type VictoryBadge } from '@/components/common';
import { CardUnlockScreen } from '@/components/collection';
import { useCardUnlock } from '@/hooks/useCardUnlock';

// Fonction pour calculer le badge non-compétitif de Math-Blocks
const getMathBlocksBadge = (pairsFound: number, isVictory: boolean): VictoryBadge => {
  if (isVictory && pairsFound >= 10) {
    return { icon: '🧮', label: 'Mathématicien' };
  } else if (isVictory) {
    return { icon: '⭐', label: 'Calculateur' };
  } else {
    return { icon: '💪', label: 'Persévérant' };
  }
};

export function MathVictoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const insets = useSafeAreaInsets();
  const currentSession = useStore((state) => state.currentSession);
  const { getUnlockedCardsCount } = useCollection();

  // Get current level from params or session
  const currentLevel = params.level
    ? parseInt(params.level, 10)
    : currentSession?.levelId
      ? parseInt(currentSession.levelId.replace('level-', ''), 10)
      : 1;

  // Get session data
  const moveCount = currentSession?.moveCount || 0;
  const isVictory = currentSession?.status === 'victory';

  // Calculer si la performance est optimale
  const isOptimal = isVictory && moveCount <= 15;

  // Système de déblocage de cartes
  const {
    unlockedCard,
    showUnlockAnimation,
    checkAndUnlockCard,
    dismissUnlockAnimation,
  } = useCardUnlock({
    gameId: 'math-blocks',
    levelId: `level_${currentLevel}`,
    levelNumber: currentLevel,
    isOptimal,
  });

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

  const handlePlayAgain = () => {
    router.replace({
      pathname: '/(games)/math-blocks/play',
      params: { level: String(currentLevel) },
    });
  };

  const handleNextLevel = () => {
    // Navigate to next level
    const nextLevel = currentLevel + 1;
    router.replace({
      pathname: '/(games)/math-blocks/play',
      params: { level: String(nextLevel) },
    });
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

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[4],
          paddingBottom: insets.bottom + spacing[4],
        },
      ]}
    >
      <VictoryCard
        title={isVictory ? 'Félicitations !' : 'Partie terminée'}
        message={isVictory ? `Tu as réussi le niveau ${currentLevel} !` : 'Le temps est écoulé...'}
        stats={{
          moves: moveCount,
          customStats: [
            {
              label: 'Statut',
              value: isVictory ? 'Victoire !' : 'Essaie encore !',
              icon: isVictory ? '✅' : '⏱️',
            },
          ],
        }}
        badge={getMathBlocksBadge(moveCount, isVictory)}
        celebrationEmoji={isVictory ? '🎉' : '💪'}
        showConfetti={isVictory}
        onReplay={handlePlayAgain}
        onNextLevel={isVictory ? handleNextLevel : undefined}
        hasNextLevel={isVictory}
        nextLevelLabel={`Niveau ${currentLevel + 1} →`}
        onHome={handleHome}
        onCollection={handleViewCollection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
