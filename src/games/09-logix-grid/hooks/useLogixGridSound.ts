/**
 * useLogixGridSound hook
 * Gère les effets sonores pour le jeu Logix Grid
 *
 * Sons disponibles:
 * - select: Clic lors de la sélection d'une cellule
 * - correct: Son de validation (case correcte)
 * - error: Son d'erreur (case incorrecte)
 * - hint: Son d'indice
 * - victory: Son de victoire
 * - clue: Son d'utilisation d'un indice textuel
 */

import { useEffect, useCallback, useRef } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

// Types de sons disponibles
type LogixSoundName =
  | 'select'    // Sélection d'une cellule
  | 'correct'   // Bonne réponse
  | 'error'     // Mauvaise réponse
  | 'hint'      // Demande d'indice
  | 'victory'   // Victoire
  | 'clue';     // Utilisation d'un indice

// Fichiers audio - on réutilise les sons existants du projet
// Note: À remplacer par des sons spécifiques à Logix Grid si disponibles
const LOGIX_SOUND_FILES: Record<LogixSoundName, AudioSource> = {
  select: require('../../../../assets/sounds/robot_select.mp3'),
  correct: require('../../../../assets/sounds/robot_correct.mp3'),
  error: require('../../../../assets/sounds/robot_error.mp3'),
  hint: require('../../../../assets/sounds/robot_thinking.mp3'),
  victory: require('../../../../assets/sounds/robot_correct.mp3'),
  clue: require('../../../../assets/sounds/robot_select.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<LogixSoundName, number> = {
  select: 0.5,
  correct: 0.8,
  error: 0.6,
  hint: 0.6,
  victory: 1.0,
  clue: 0.4,
};

export interface UseLogixGridSoundReturn {
  /** Joue un son par nom */
  playSound: (name: LogixSoundName, volumeOverride?: number) => void;
  /** Joue le son de sélection */
  playSelect: () => void;
  /** Joue le son de bonne réponse */
  playCorrect: () => void;
  /** Joue le son d'erreur */
  playError: () => void;
  /** Joue le son d'indice */
  playHint: () => void;
  /** Joue le son de victoire */
  playVictory: () => void;
  /** Joue le son d'utilisation d'indice textuel */
  playClue: () => void;
}

export function useLogixGridSound(): UseLogixGridSoundReturn {
  const { soundEnabled } = useAppSettings();

  // Créer les players audio
  const selectPlayer = useAudioPlayer(LOGIX_SOUND_FILES.select);
  const correctPlayer = useAudioPlayer(LOGIX_SOUND_FILES.correct);
  const errorPlayer = useAudioPlayer(LOGIX_SOUND_FILES.error);
  const hintPlayer = useAudioPlayer(LOGIX_SOUND_FILES.hint);
  const victoryPlayer = useAudioPlayer(LOGIX_SOUND_FILES.victory);
  const cluePlayer = useAudioPlayer(LOGIX_SOUND_FILES.clue);

  // Map des players
  const playersRef = useRef<Map<LogixSoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['select', selectPlayer],
      ['correct', correctPlayer],
      ['error', errorPlayer],
      ['hint', hintPlayer],
      ['victory', victoryPlayer],
      ['clue', cluePlayer],
    ])
  );

  // Mettre à jour la map quand les players changent
  useEffect(() => {
    playersRef.current.set('select', selectPlayer);
    playersRef.current.set('correct', correctPlayer);
    playersRef.current.set('error', errorPlayer);
    playersRef.current.set('hint', hintPlayer);
    playersRef.current.set('victory', victoryPlayer);
    playersRef.current.set('clue', cluePlayer);
  }, [selectPlayer, correctPlayer, errorPlayer, hintPlayer, victoryPlayer, cluePlayer]);

  // Jouer un son
  const playSound = useCallback((name: LogixSoundName, volumeOverride?: number) => {
    if (!soundEnabled) return;

    try {
      const player = playersRef.current.get(name);
      if (!player) {
        console.warn(`Son ${name} non trouvé`);
        return;
      }

      const volume = volumeOverride ?? DEFAULT_VOLUMES[name];
      player.volume = volume;
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.warn(`Erreur lecture son ${name}:`, error);
    }
  }, [soundEnabled]);

  // Jouer le son de sélection
  const playSelect = useCallback(() => {
    playSound('select');
  }, [playSound]);

  // Jouer le son de bonne réponse
  const playCorrect = useCallback(() => {
    playSound('correct');
  }, [playSound]);

  // Jouer le son de mauvaise réponse
  const playError = useCallback(() => {
    playSound('error');
  }, [playSound]);

  // Jouer le son d'indice
  const playHint = useCallback(() => {
    playSound('hint');
  }, [playSound]);

  // Jouer le son de victoire
  const playVictory = useCallback(() => {
    playSound('victory');
  }, [playSound]);

  // Jouer le son d'utilisation d'indice textuel
  const playClue = useCallback(() => {
    playSound('clue');
  }, [playSound]);

  return {
    playSound,
    playSelect,
    playCorrect,
    playError,
    playHint,
    playVictory,
    playClue,
  };
}

export default useLogixGridSound;
