/**
 * Memory Game Types
 *
 * Types pour le jeu Super Mémoire
 */

// ============================================================================
// TYPES DE BASE
// ============================================================================

export type CardTheme = 'animals' | 'fruits' | 'vehicles' | 'nature' | 'space' | 'emojis';

export type CardState = 'hidden' | 'revealed' | 'matched';

export type GamePhase = 'intro' | 'playing' | 'paused' | 'victory';

export type Difficulty = 'easy' | 'medium' | 'hard';

// ============================================================================
// CARTE
// ============================================================================

export interface MemoryCard {
  /** Identifiant unique de la carte */
  id: string;
  /** Identifiant du symbole (les paires ont le même symbolId) */
  symbolId: string;
  /** Symbole affiché (emoji ou image) */
  symbol: string;
  /** État actuel de la carte */
  state: CardState;
  /** Position dans la grille */
  position: number;
}

// ============================================================================
// NIVEAU
// ============================================================================

export interface MemoryLevel {
  /** Identifiant unique du niveau */
  id: string;
  /** Nom du niveau */
  name: string;
  /** Description */
  description: string;
  /** Nombre de paires (4, 6, 8, 10, 12) */
  pairCount: number;
  /** Thème des cartes */
  theme: CardTheme;
  /** Difficulté */
  difficulty: Difficulty;
  /** Temps maximum en secondes (0 = pas de limite) */
  timeLimit: number;
  /** Temps idéal en secondes (pour calcul étoiles) */
  idealTime: number;
  /** Nombre d'essais idéal */
  idealAttempts: number;
  /** Âge recommandé */
  ageRange: string;
  /** Verrouillé */
  locked: boolean;
  /** Condition de déverrouillage */
  unlockCondition?: string;
  /** Mode entraînement (niveau 0) */
  isTraining?: boolean;
}

// ============================================================================
// ÉTAT DU JEU
// ============================================================================

export interface MemoryGameState {
  /** Liste des cartes */
  cards: MemoryCard[];
  /** Cartes actuellement révélées (max 2) */
  revealedCards: string[];
  /** Paires trouvées */
  matchedPairs: number;
  /** Nombre total de paires */
  totalPairs: number;
  /** Nombre d'essais (chaque paire de cartes retournées = 1 essai) */
  attempts: number;
  /** Phase actuelle */
  phase: GamePhase;
  /** Temps écoulé en secondes */
  timeElapsed: number;
  /** Niveau actuel */
  level: MemoryLevel;
  /** En train de vérifier une paire */
  isChecking: boolean;
  /** Animation en cours */
  isAnimating: boolean;
}

// ============================================================================
// RÉSULTAT
// ============================================================================

export interface MemoryResult {
  /** Niveau joué */
  levelId: string;
  /** Victoire */
  isVictory: boolean;
  /** Temps total en secondes */
  timeSeconds: number;
  /** Nombre d'essais */
  attempts: number;
  /** Score calculé (basé sur temps et essais) */
  score: number;
  /** Étoiles obtenues (1-3) */
  stars: number;
  /** Précision (paires trouvées / essais) */
  accuracy: number;
  /** Nouveau record personnel */
  isNewRecord: boolean;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface MemoryConfig {
  /** Délai avant retournement des cartes non matchées (ms) */
  mismatchDelay: number;
  /** Durée de l'animation de retournement (ms) */
  flipDuration: number;
  /** Durée de l'animation de match (ms) */
  matchAnimationDuration: number;
  /** Délai entre deux coups minimum (ms) */
  minMoveCooldown: number;
}

export const DEFAULT_MEMORY_CONFIG: MemoryConfig = {
  mismatchDelay: 1000,
  flipDuration: 300,
  matchAnimationDuration: 500,
  minMoveCooldown: 200,
};

// ============================================================================
// ACTIONS
// ============================================================================

export type MemoryAction =
  | { type: 'FLIP_CARD'; cardId: string }
  | { type: 'CHECK_MATCH' }
  | { type: 'RESET_REVEALED' }
  | { type: 'MARK_MATCHED' }
  | { type: 'TICK_TIME' }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'RESET_GAME' }
  | { type: 'SET_CHECKING'; isChecking: boolean }
  | { type: 'SET_ANIMATING'; isAnimating: boolean };

// ============================================================================
// THÈMES
// ============================================================================

export interface ThemeConfig {
  id: CardTheme;
  name: string;
  description: string;
  symbols: string[];
  backgroundColor: string;
  accentColor: string;
}

