/**
 * Conteur Curieux Engine
 *
 * Logique principale pour le jeu de compréhension de lecture
 */

import type {
  ConteurLevel,
  ConteurGameState,
  ConteurResult,
  PlayerAnswer,
} from '../types';
import { DEFAULT_CONTEUR_CONFIG } from '../types';

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Crée une nouvelle partie
 */
export function createGame(level: ConteurLevel): ConteurGameState {
  return {
    phase: 'intro',
    level,
    readingMode: 'mixed',
    currentParagraph: 0,
    currentQuestion: 0,
    playerAnswers: [],
    hintsUsed: 0,
    hintsRemaining: level.hintsAvailable,
    readingTime: 0,
    questionsTime: 0,
    selectedOptionId: null,
    showingHint: false,
    vocabularyPopup: null,
    isAudioPlaying: false,
    audioPosition: 0,
    currentWordIndex: 0,
    currentAttempts: 0,
  };
}

// ============================================================================
// NAVIGATION
// ============================================================================

/**
 * Passe à la phase de lecture
 */
export function startReading(state: ConteurGameState): ConteurGameState {
  return {
    ...state,
    phase: 'reading',
    currentParagraph: 0,
  };
}

/**
 * Passe au paragraphe suivant
 */
export function nextParagraph(state: ConteurGameState): ConteurGameState {
  const nextIndex = state.currentParagraph + 1;
  const totalParagraphs = state.level.story.paragraphs.length;

  if (nextIndex >= totalParagraphs) {
    // Passer aux questions
    return {
      ...state,
      phase: 'questions',
      currentQuestion: 0,
    };
  }

  return {
    ...state,
    currentParagraph: nextIndex,
  };
}

/**
 * Passe au paragraphe précédent
 */
export function previousParagraph(state: ConteurGameState): ConteurGameState {
  if (state.currentParagraph <= 0) {
    return state;
  }

  return {
    ...state,
    currentParagraph: state.currentParagraph - 1,
  };
}

/**
 * Termine la lecture et passe aux questions
 */
export function finishReading(state: ConteurGameState): ConteurGameState {
  return {
    ...state,
    phase: 'questions',
    currentQuestion: 0,
  };
}

// ============================================================================
// QUESTIONS
// ============================================================================

/**
 * Sélectionne une option de réponse
 */
export function selectOption(
  state: ConteurGameState,
  optionId: string
): ConteurGameState {
  return {
    ...state,
    selectedOptionId: optionId,
  };
}

/**
 * Valide la réponse actuelle
 */
export function validateAnswer(state: ConteurGameState): ConteurGameState {
  if (!state.selectedOptionId) return state;

  const currentQuestion = state.level.story.questions[state.currentQuestion];
  const selectedOption = currentQuestion.options.find(
    (opt) => opt.id === state.selectedOptionId
  );

  if (!selectedOption) return state;

  const answer: PlayerAnswer = {
    questionId: currentQuestion.id,
    selectedOptionId: state.selectedOptionId,
    isCorrect: selectedOption.isCorrect,
    hintsUsed: state.showingHint ? 1 : 0,
    timeSpent: 0, // TODO: Track individual question time
  };

  const newAnswers = [...state.playerAnswers, answer];
  const nextQuestionIndex = state.currentQuestion + 1;
  const totalQuestions = state.level.story.questions.length;

  // Vérifier si c'est la dernière question
  if (nextQuestionIndex >= totalQuestions) {
    return {
      ...state,
      phase: 'results',
      playerAnswers: newAnswers,
      selectedOptionId: null,
      showingHint: false,
    };
  }

  return {
    ...state,
    playerAnswers: newAnswers,
    currentQuestion: nextQuestionIndex,
    selectedOptionId: null,
    showingHint: false,
  };
}

/**
 * Demande un indice
 */
export function requestHint(state: ConteurGameState): ConteurGameState {
  if (state.hintsUsed >= state.level.hintsAvailable) {
    return state;
  }

  return {
    ...state,
    hintsUsed: state.hintsUsed + 1,
    showingHint: true,
  };
}

/**
 * Cache l'indice
 */
export function hideHint(state: ConteurGameState): ConteurGameState {
  return {
    ...state,
    showingHint: false,
  };
}

// ============================================================================
// TIMER
// ============================================================================

/**
 * Incrémente le temps de lecture
 */
export function tickReadingTime(state: ConteurGameState): ConteurGameState {
  return {
    ...state,
    readingTime: state.readingTime + 1,
  };
}

/**
 * Incrémente le temps sur les questions
 */
export function tickQuestionsTime(state: ConteurGameState): ConteurGameState {
  return {
    ...state,
    questionsTime: state.questionsTime + 1,
  };
}

// ============================================================================
// RESULT
// ============================================================================

/**
 * Calcule le résultat de la partie
 */
export function calculateResult(state: ConteurGameState): ConteurResult {
  const { level, playerAnswers, readingTime, questionsTime, hintsUsed } = state;

  const correctAnswers = playerAnswers.filter((a) => a.isCorrect).length;
  const totalQuestions = level.story.questions.length;
  const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
  const isPerfect = scorePercent === 100 && hintsUsed === 0;

  // Calculer les étoiles (1-5)
  let stars: 1 | 2 | 3 | 4 | 5;
  if (isPerfect) {
    stars = 5;
  } else if (scorePercent >= 80 && hintsUsed === 0) {
    stars = 4;
  } else if (scorePercent >= DEFAULT_CONTEUR_CONFIG.threeStarsScore) {
    stars = 3;
  } else if (scorePercent >= DEFAULT_CONTEUR_CONFIG.twoStarsScore) {
    stars = 2;
  } else {
    stars = 1;
  }

  // Vérifier si réussi
  const passed = scorePercent >= level.passingScore;

  // Message de Plume basé sur le score
  let plumeMessage: string;
  if (isPerfect) {
    plumeMessage = 'PARFAIT ! Tu es un vrai champion de lecture !';
  } else if (stars >= 4) {
    plumeMessage = 'Bravo ! Tu as très bien compris l\'histoire !';
  } else if (stars >= 3) {
    plumeMessage = 'Super ! Tu as bien compris !';
  } else if (passed) {
    plumeMessage = 'Bien joué ! Continue comme ça !';
  } else {
    plumeMessage = 'N\'abandonne pas ! Tu peux réessayer !';
  }

  return {
    levelId: level.id,
    scorePercent,
    correctAnswers,
    totalQuestions,
    readingTimeSeconds: readingTime,
    questionsTimeSeconds: questionsTime,
    hintsUsed,
    stars,
    passed,
    unlockedCard: level.story.collectible,
    skillsEarned: [],
    plumeMessage,
    isPerfect,
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Obtient la question actuelle
 */
export function getCurrentQuestion(state: ConteurGameState) {
  return state.level.story.questions[state.currentQuestion];
}

/**
 * Obtient le paragraphe actuel
 */
export function getCurrentParagraph(state: ConteurGameState): string {
  return state.level.story.paragraphs[state.currentParagraph] || '';
}

/**
 * Obtient la progression dans la lecture
 */
export function getReadingProgress(state: ConteurGameState): number {
  const total = state.level.story.paragraphs.length;
  if (total === 0) return 0;
  return ((state.currentParagraph + 1) / total) * 100;
}

/**
 * Obtient la progression dans les questions
 */
export function getQuestionsProgress(state: ConteurGameState): number {
  const total = state.level.story.questions.length;
  if (total === 0) return 0;
  return (state.currentQuestion / total) * 100;
}

/**
 * Vérifie si la réponse sélectionnée est correcte
 */
export function isSelectedAnswerCorrect(state: ConteurGameState): boolean | null {
  if (!state.selectedOptionId) return null;

  const currentQuestion = getCurrentQuestion(state);
  const selectedOption = currentQuestion?.options.find(
    (opt) => opt.id === state.selectedOptionId
  );

  return selectedOption?.isCorrect ?? null;
}
