import React from 'react';
import { useRouter } from 'expo-router';
import { SessionStats } from '../types';
import { VictoryCard, type VictoryBadge } from '@/components/common';

interface Props {
  stats: SessionStats;
  onReplay: () => void;
  onNext: () => void;
  onExit: () => void;
  onCollection?: () => void;
}

// Fonction pour calculer le badge non-compétitif du Labyrinthe
const getLabyrintheBadge = (stats: SessionStats): VictoryBadge => {
  if (stats.stars === 3 && stats.hintsUsed === 0) {
    return { icon: '🐿️', label: 'Explorateur Expert' };
  } else if (stats.stars >= 2) {
    return { icon: '🗺️', label: 'Aventurier' };
  } else if (stats.hintsUsed >= 3) {
    return { icon: '💪', label: 'Persévérant' };
  } else {
    return { icon: '🌟', label: 'Curieux' };
  }
};

// Fonction pour obtenir le message de la mascotte
const getMascotMessage = (stats: SessionStats): string => {
  if (stats.stars === 3) {
    return 'Incroyable ! Tu es un vrai champion !';
  } else if (stats.stars === 2) {
    return 'Super ! Tu as été rapide !';
  } else {
    return 'Hourra ! On est sortis !';
  }
};

export const VictoryScreen: React.FC<Props> = ({ stats, onReplay, onNext, onExit, onCollection }) => {
  const router = useRouter();

  // Construire les stats personnalisées
  const customStats = [];

  customStats.push({
    label: 'Exploration',
    value: `${stats.explorationPercent}%`,
    icon: '🗺️',
  });

  if (stats.gemsCollected > 0) {
    customStats.push({
      label: 'Gemmes',
      value: stats.gemsCollected,
      icon: '💎',
    });
  }

  // Handler pour la collection
  const handleViewCollection = () => {
    if (onCollection) {
      onCollection();
    } else {
      router.push('/(games)/collection');
    }
  };

  return (
    <VictoryCard
      variant="overlay"
      title="Victoire !"
      message="Tu as trouvé la sortie !"
      mascot={{
        emoji: '🐿️',
        message: getMascotMessage(stats),
      }}
      stats={{
        timeElapsed: stats.time,
        hintsUsed: stats.hintsUsed,
        stars: stats.stars,
        customStats: customStats,
      }}
      badge={getLabyrintheBadge(stats)}
      onReplay={onReplay}
      onNextLevel={onNext}
      hasNextLevel={true}
      nextLevelLabel="Niveau suivant →"
      onHome={onExit}
      onCollection={handleViewCollection}
    />
  );
};
