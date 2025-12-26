export type GameCategory = 'logic' | 'spatial' | 'numbers' | 'memory' | 'language';

// Nouveau système de niveaux V2 (remplace les étoiles)
export type GameLevel = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Game {
  id: string;
  name: string;
  icon: string; // Emoji
  category: GameCategory;
  progress: number; // 0-100
  level: GameLevel; // Nouveau: bronze/silver/gold/diamond
  levelProgress: number; // 0-5 (points vers le prochain niveau)
  stars?: number; // Deprecated: gardé pour compatibilité
  isNew?: boolean;
  isHot?: boolean; // Nouveau: jeu populaire
  isComingSoon?: boolean;
}

export interface ChildProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  level: number;
  totalStars: number;
  totalBadges: number;
  currentStreak: number;
  weekProgress: boolean[]; // [L, M, M, J, V, S, D]
  todayIndex: number; // 0-6
  flowersCount: number;
  gamesCompleted: number;
  totalPlayTime: string; // "8h"
  // Nouveau: collection de cartes
  collectedCards: number;
  totalCards: number;
}

export interface AISuggestion {
  suggestedGame: {
    id: string;
    name: string;
    icon: string;
    reason: string;
  };
}

export type CategoryId = 'home' | 'logic' | 'numbers' | 'spatial' | 'words' | 'progress';

export interface Category {
  id: CategoryId;
  icon: string;
  label: string;
}

// Types pour les cartes de collection
export interface CollectionCard {
  id: string;
  emoji: string;
  name: string;
  isUnlocked: boolean;
}
