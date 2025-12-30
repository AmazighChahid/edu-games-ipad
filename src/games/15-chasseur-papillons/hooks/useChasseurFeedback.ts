/**
 * useChasseurFeedback - Hook pour les feedbacks du Chasseur de Papillons
 *
 * Gère les feedbacks visuels et sonores :
 * - Messages de la mascotte Flutty
 * - Émotions de la mascotte
 * - Sons de jeu
 * - Réactions aux événements du jeu
 */

import { useEffect, useRef, useCallback } from 'react';
import { useChasseurSound } from './useChasseurSound';
import type { FluttyEmotion, ChasseurGameState } from '../types';

// ============================================
// MESSAGES MASCOTTE
// ============================================

const FLUTTY_MESSAGES = {
  welcome: [
    "Coucou ! Prêt à chasser des papillons ? 🦋",
    "Les papillons volent ! Attrape les bons !",
    "Observe bien les couleurs avant d'attraper !",
  ],
  start: [
    "C'est parti ! Attrape les bons papillons !",
    "Regarde bien la consigne et chasse !",
    "Les papillons arrivent ! Concentre-toi !",
  ],
  success: [
    "Bravo ! Tu as attrapé le bon ! 🎉",
    "Super ! Continue comme ça ! ⭐",
    "Bien joué ! Tes yeux sont rapides ! 👁️",
  ],
  error: [
    "Oups ! Ce n'était pas le bon. Relis la consigne !",
    "Pas grave ! Observe mieux les couleurs.",
    "Ce n'était pas celui-là. Prends ton temps !",
  ],
  streak: [
    "Waouh ! Quelle série ! 🔥",
    "Tu es en feu ! Continue ! ⚡",
    "Incroyable concentration ! 🌟",
  ],
  waveComplete: [
    "Vague terminée ! Prêt pour la suite ?",
    "Bien joué ! Nouvelle règle dans 3... 2... 1...",
    "Super ! Une autre vague arrive !",
  ],
  hint: "Je te montre lesquels attraper ! ✨",
  levelSelect: {
    easy: "Parfait pour s'entraîner !",
    medium: "Bonne difficulté !",
    hard: "Un vrai défi de concentration !",
  },
  back: "On recommence ? Choisis un niveau !",
  reset: "On recommence ! Prêt ?",
  help: "Lis bien la consigne en haut de l'écran !",
  newWave: "Nouvelle vague ! Concentre-toi sur la nouvelle règle !",
} as const;

// ============================================
// TYPES
// ============================================

export interface UseChasseurFeedbackProps {
  gameState: ChasseurGameState;
  onVictory?: () => void;
}

export interface UseChasseurFeedbackReturn {
  // État
  mascotMessage: string;
  mascotEmotion: FluttyEmotion;

  // Setters directs
  setMascotMessage: (message: string) => void;
  setMascotEmotion: (emotion: FluttyEmotion) => void;

  // Actions
  showWelcomeMessage: () => void;
  showStartMessage: () => void;
  showSuccessMessage: () => void;
  showErrorMessage: () => void;
  showStreakMessage: () => void;
  showWaveCompleteMessage: () => void;
  showHintMessage: () => void;
  showLevelSelectMessage: (difficulty: 'easy' | 'medium' | 'hard', levelNumber: number) => void;
  showBackMessage: () => void;
  showResetMessage: () => void;
  showHelpMessage: () => void;
  showNewWaveMessage: () => void;

  // Sons
  sounds: ReturnType<typeof useChasseurSound>;
}

// ============================================
// HELPERS
// ============================================

function getRandomMessage(messages: readonly string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================
// HOOK
// ============================================

export function useChasseurFeedback({
  gameState,
  onVictory,
}: UseChasseurFeedbackProps): UseChasseurFeedbackReturn {
  // État local
  const mascotMessageRef = useRef<string>(FLUTTY_MESSAGES.welcome[0]);
  const mascotEmotionRef = useRef<FluttyEmotion>('neutral');

  // Pour forcer les re-renders quand le message/émotion change
  const [, forceUpdate] = useCallback(() => {
    return [{}, () => {}];
  }, [])();

  // Sons
  const sounds = useChasseurSound();

  // Refs pour tracker les changements
  const lastTargetsCaughtRef = useRef(0);
  const lastWrongCatchesRef = useRef(0);
  const lastStreakRef = useRef(0);

  // Setters
  const setMascotMessage = useCallback((message: string) => {
    mascotMessageRef.current = message;
  }, []);

  const setMascotEmotion = useCallback((emotion: FluttyEmotion) => {
    mascotEmotionRef.current = emotion;
  }, []);

  // Actions de feedback
  const showWelcomeMessage = useCallback(() => {
    setMascotMessage(getRandomMessage(FLUTTY_MESSAGES.welcome));
    setMascotEmotion('neutral');
  }, [setMascotMessage, setMascotEmotion]);

  const showStartMessage = useCallback(() => {
    setMascotMessage(getRandomMessage(FLUTTY_MESSAGES.start));
    setMascotEmotion('excited');
  }, [setMascotMessage, setMascotEmotion]);

  const showSuccessMessage = useCallback(() => {
    sounds.playCatch();
    setMascotMessage(getRandomMessage(FLUTTY_MESSAGES.success));
    setMascotEmotion('happy');
  }, [sounds, setMascotMessage, setMascotEmotion]);

  const showErrorMessage = useCallback(() => {
    sounds.playWrong();
    setMascotMessage(getRandomMessage(FLUTTY_MESSAGES.error));
    setMascotEmotion('encouraging');
  }, [sounds, setMascotMessage, setMascotEmotion]);

  const showStreakMessage = useCallback(() => {
    sounds.playStreak();
    setMascotMessage(getRandomMessage(FLUTTY_MESSAGES.streak));
    setMascotEmotion('excited');
  }, [sounds, setMascotMessage, setMascotEmotion]);

  const showWaveCompleteMessage = useCallback(() => {
    sounds.playWaveComplete();
    setMascotMessage(getRandomMessage(FLUTTY_MESSAGES.waveComplete));
    setMascotEmotion('happy');
  }, [sounds, setMascotMessage, setMascotEmotion]);

  const showHintMessage = useCallback(() => {
    setMascotMessage(FLUTTY_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, [setMascotMessage, setMascotEmotion]);

  const showLevelSelectMessage = useCallback((difficulty: 'easy' | 'medium' | 'hard', levelNumber: number) => {
    const difficultyMessage = FLUTTY_MESSAGES.levelSelect[difficulty];
    setMascotMessage(`Niveau ${levelNumber} ! ${difficultyMessage}`);
    setMascotEmotion('happy');
  }, [setMascotMessage, setMascotEmotion]);

  const showBackMessage = useCallback(() => {
    setMascotMessage(FLUTTY_MESSAGES.back);
    setMascotEmotion('encouraging');
  }, [setMascotMessage, setMascotEmotion]);

  const showResetMessage = useCallback(() => {
    setMascotMessage(FLUTTY_MESSAGES.reset);
    setMascotEmotion('neutral');
  }, [setMascotMessage, setMascotEmotion]);

  const showHelpMessage = useCallback(() => {
    setMascotMessage(FLUTTY_MESSAGES.help);
    setMascotEmotion('thinking');
  }, [setMascotMessage, setMascotEmotion]);

  const showNewWaveMessage = useCallback(() => {
    setMascotMessage(FLUTTY_MESSAGES.newWave);
    setMascotEmotion('neutral');
  }, [setMascotMessage, setMascotEmotion]);

  // Effect pour réagir aux événements du jeu
  useEffect(() => {
    // Bonne capture
    if (gameState.targetsCaught > lastTargetsCaughtRef.current) {
      showSuccessMessage();

      // Streak bonus (tous les 3)
      if (gameState.streak > 0 && gameState.streak % 3 === 0) {
        showStreakMessage();
      }
    }
    lastTargetsCaughtRef.current = gameState.targetsCaught;

    // Mauvaise capture
    if (gameState.wrongCatches > lastWrongCatchesRef.current) {
      showErrorMessage();
    }
    lastWrongCatchesRef.current = gameState.wrongCatches;

    lastStreakRef.current = gameState.streak;
  }, [gameState.targetsCaught, gameState.wrongCatches, gameState.streak, showSuccessMessage, showErrorMessage, showStreakMessage]);

  // Effect pour la fin de vague
  useEffect(() => {
    if (gameState.status === 'wave_complete') {
      showWaveCompleteMessage();
    }
  }, [gameState.status, showWaveCompleteMessage]);

  // Effect pour la victoire
  useEffect(() => {
    if (gameState.status === 'victory') {
      sounds.playVictory();
      onVictory?.();
    }
  }, [gameState.status, sounds, onVictory]);

  return {
    // État
    mascotMessage: mascotMessageRef.current,
    mascotEmotion: mascotEmotionRef.current,

    // Setters
    setMascotMessage,
    setMascotEmotion,

    // Actions
    showWelcomeMessage,
    showStartMessage,
    showSuccessMessage,
    showErrorMessage,
    showStreakMessage,
    showWaveCompleteMessage,
    showHintMessage,
    showLevelSelectMessage,
    showBackMessage,
    showResetMessage,
    showHelpMessage,
    showNewWaveMessage,

    // Sons
    sounds,
  };
}

export default useChasseurFeedback;
