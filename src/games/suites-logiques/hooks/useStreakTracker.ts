import { useState, useCallback } from 'react';

// ============================================
// HOOK POUR SUIVRE LES SÉRIES DE RÉUSSITES
// ============================================

export function useStreakTracker() {
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Incrémenter le streak
  const incrementStreak = useCallback(() => {
    setStreak(prev => {
      const newStreak = prev + 1;
      setMaxStreak(current => Math.max(current, newStreak));
      return newStreak;
    });
  }, []);

  // Réinitialiser le streak (après une erreur)
  const resetStreak = useCallback(() => {
    setStreak(0);
  }, []);

  return {
    streak,
    maxStreak,
    incrementStreak,
    resetStreak,
  };
}
