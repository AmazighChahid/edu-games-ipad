/**
 * Memory Engine
 *
 * Logique centrale du jeu Memory
 * Gère le mélange, les correspondances et le score
 */

import type {
  MemoryCard,
  MemoryGameState,
  MemoryLevel,
  MemoryResult,
  CardState,
  GamePhase,
} from '../types';

// ============================================================================
// CRÉATION DU JEU
// ============================================================================

/**
 * Crée un jeu de cartes mélangées pour un niveau
 */
export function createGame(level: MemoryLevel, symbols: string[]): MemoryGameState {
  const cards = createShuffledCards(level.pairCount, symbols);

  return {
    cards,
    revealedCards: [],
    matchedPairs: 0,
    totalPairs: level.pairCount,
    attempts: 0,
    phase: 'playing',
    timeElapsed: 0,
    level,
    isChecking: false,
    isAnimating: false,
  };
}

/**
 * Crée et mélange les cartes
 */
export function createShuffledCards(pairCount: number, symbols: string[]): MemoryCard[] {
  // Sélectionner les symboles nécessaires
  const selectedSymbols = symbols.slice(0, pairCount);

  // Créer les paires
  const cards: MemoryCard[] = [];

  selectedSymbols.forEach((symbol, index) => {
    // Carte 1 de la paire
    cards.push({
      id: `card-${index}-a`,
      symbolId: `symbol-${index}`,
      symbol,
      state: 'hidden',
      position: cards.length,
    });

    // Carte 2 de la paire
    cards.push({
      id: `card-${index}-b`,
      symbolId: `symbol-${index}`,
      symbol,
      state: 'hidden',
      position: cards.length,
    });
  });

  // Mélanger (Fisher-Yates)
  return shuffleArray(cards).map((card, index) => ({
    ...card,
    position: index,
  }));
}

/**
 * Mélange un tableau (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ============================================================================
// LOGIQUE DE JEU
// ============================================================================

/**
 * Retourne une carte
 */
export function flipCard(state: MemoryGameState, cardId: string): MemoryGameState {
  // Vérifications
  if (state.isChecking || state.isAnimating) return state;
  if (state.phase !== 'playing') return state;
  if (state.revealedCards.length >= 2) return state;
  if (state.revealedCards.includes(cardId)) return state;

  const card = state.cards.find((c) => c.id === cardId);
  if (!card || card.state !== 'hidden') return state;

  // Mettre à jour les cartes
  const updatedCards = state.cards.map((c) =>
    c.id === cardId ? { ...c, state: 'revealed' as CardState } : c
  );

  const newRevealedCards = [...state.revealedCards, cardId];

  return {
    ...state,
    cards: updatedCards,
    revealedCards: newRevealedCards,
  };
}

/**
 * Vérifie si les deux cartes révélées forment une paire
 */
export function checkMatch(state: MemoryGameState): {
  isMatch: boolean;
  newState: MemoryGameState;
} {
  if (state.revealedCards.length !== 2) {
    return { isMatch: false, newState: state };
  }

  const [cardId1, cardId2] = state.revealedCards;
  const card1 = state.cards.find((c) => c.id === cardId1);
  const card2 = state.cards.find((c) => c.id === cardId2);

  if (!card1 || !card2) {
    return { isMatch: false, newState: state };
  }

  const isMatch = card1.symbolId === card2.symbolId;

  // Incrémenter les essais
  const newAttempts = state.attempts + 1;

  if (isMatch) {
    // Marquer comme matchées
    const updatedCards = state.cards.map((c) =>
      c.id === cardId1 || c.id === cardId2 ? { ...c, state: 'matched' as CardState } : c
    );

    const newMatchedPairs = state.matchedPairs + 1;
    const isVictory = newMatchedPairs >= state.totalPairs;

    return {
      isMatch: true,
      newState: {
        ...state,
        cards: updatedCards,
        revealedCards: [],
        matchedPairs: newMatchedPairs,
        attempts: newAttempts,
        phase: isVictory ? 'victory' : 'playing',
      },
    };
  }

  // Pas de match - les cartes seront retournées après un délai
  return {
    isMatch: false,
    newState: {
      ...state,
      attempts: newAttempts,
      isChecking: true,
    },
  };
}

/**
 * Retourne les cartes non matchées (après délai)
 */
export function resetRevealedCards(state: MemoryGameState): MemoryGameState {
  const updatedCards = state.cards.map((c) =>
    state.revealedCards.includes(c.id) && c.state === 'revealed'
      ? { ...c, state: 'hidden' as CardState }
      : c
  );

  return {
    ...state,
    cards: updatedCards,
    revealedCards: [],
    isChecking: false,
  };
}

// ============================================================================
// SCORE ET RÉSULTATS
// ============================================================================

/**
 * Calcule le résultat final
 */
export function calculateResult(state: MemoryGameState): MemoryResult {
  const { level, timeElapsed, attempts, matchedPairs, totalPairs } = state;
  const isVictory = matchedPairs >= totalPairs;

  // Précision : paires trouvées / essais (1.0 = parfait)
  const accuracy = attempts > 0 ? matchedPairs / attempts : 0;

  // Score basé sur le temps et la précision
  const timeScore = Math.max(0, 100 - Math.floor(timeElapsed / 5));
  const accuracyScore = Math.floor(accuracy * 100);
  const score = Math.floor((timeScore + accuracyScore) / 2);

  // Étoiles
  const stars = calculateStars(level, timeElapsed, attempts);

  return {
    levelId: level.id,
    isVictory,
    timeSeconds: timeElapsed,
    attempts,
    score,
    stars,
    accuracy,
    isNewRecord: false, // À déterminer par le système de progression
  };
}

/**
 * Calcule le nombre d'étoiles
 */
export function calculateStars(
  level: MemoryLevel,
  timeElapsed: number,
  attempts: number
): number {
  const { idealTime, idealAttempts, pairCount } = level;

  // Ratio temps (1.0 = parfait, >1 = plus lent que l'idéal)
  const timeRatio = timeElapsed / idealTime;

  // Ratio essais (pairCount = parfait, donc attempts/pairCount)
  const attemptRatio = attempts / pairCount;

  // 3 étoiles : temps <= idéal ET essais <= idéal
  if (timeRatio <= 1.0 && attemptRatio <= 1.2) {
    return 3;
  }

  // 2 étoiles : temps <= 1.5x idéal ET essais <= 1.5x paires
  if (timeRatio <= 1.5 && attemptRatio <= 1.5) {
    return 2;
  }

  // 1 étoile : jeu terminé
  return 1;
}

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Vérifie si le jeu est terminé
 */
export function isGameComplete(state: MemoryGameState): boolean {
  return state.matchedPairs >= state.totalPairs;
}

/**
 * Vérifie si le temps est écoulé
 */
export function isTimeUp(state: MemoryGameState): boolean {
  if (state.level.timeLimit === 0) return false;
  return state.timeElapsed >= state.level.timeLimit;
}

/**
 * Incrémente le temps
 */
export function tickTime(state: MemoryGameState): MemoryGameState {
  if (state.phase !== 'playing') return state;

  const newTimeElapsed = state.timeElapsed + 1;

  // Vérifier la limite de temps
  if (state.level.timeLimit > 0 && newTimeElapsed >= state.level.timeLimit) {
    return {
      ...state,
      timeElapsed: newTimeElapsed,
      phase: 'victory', // Même si temps écoulé, on considère comme "fin de partie"
    };
  }

  return {
    ...state,
    timeElapsed: newTimeElapsed,
  };
}

/**
 * Obtient le nombre de cartes révélées
 */
export function getRevealedCount(state: MemoryGameState): number {
  return state.revealedCards.length;
}

/**
 * Obtient les dimensions de grille optimales
 */
export function getGridDimensions(pairCount: number): { rows: number; cols: number } {
  const totalCards = pairCount * 2;

  // Configurations optimales par nombre de paires
  const configs: Record<number, { rows: number; cols: number }> = {
    4: { rows: 2, cols: 4 },   // 8 cartes
    6: { rows: 3, cols: 4 },   // 12 cartes
    8: { rows: 4, cols: 4 },   // 16 cartes
    10: { rows: 4, cols: 5 },  // 20 cartes
    12: { rows: 4, cols: 6 },  // 24 cartes
  };

  return configs[pairCount] || { rows: 4, cols: Math.ceil(totalCards / 4) };
}

