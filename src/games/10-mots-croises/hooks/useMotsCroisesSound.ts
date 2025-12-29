/**
 * useMotsCroisesSound hook
 * Gère les effets sonores pour le jeu des Mots Croisés
 *
 * Sons disponibles:
 * - select: Son court lors de la sélection d'une cellule
 * - type: Son de frappe au clavier
 * - correct: Fanfare pour mot trouvé
 * - error: Son doux d'erreur
 * - hint: Son de révélation d'indice
 * - victory: Fanfare de victoire
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

type TimeoutRef = ReturnType<typeof setTimeout> | null;

// Types de sons disponibles
type MotsCroisesSoundName =
  | 'select'   // Sélection cellule
  | 'type'     // Frappe clavier
  | 'correct'  // Mot trouvé
  | 'error'    // Mauvaise lettre
  | 'hint'     // Indice révélé
  | 'victory'; // Victoire finale

// Fichiers audio - utilise les sons existants du projet
const MOTS_CROISES_SOUND_FILES: Record<MotsCroisesSoundName, AudioSource> = {
  select: require('../../../../assets/sounds/robot_select.mp3'),
  type: require('../../../../assets/sounds/disk_move.mp3'),
  correct: require('../../../../assets/sounds/robot_correct.mp3'),
  error: require('../../../../assets/sounds/robot_error.mp3'),
  hint: require('../../../../assets/sounds/hint.mp3'),
  victory: require('../../../../assets/sounds/victory.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<MotsCroisesSoundName, number> = {
  select: 0.5,
  type: 0.4,
  correct: 0.8,
  error: 0.6,
  hint: 0.7,
  victory: 0.9,
};

export function useMotsCroisesSound() {
  const { soundEnabled } = useAppSettings();

  // Créer les players audio
  const selectPlayer = useAudioPlayer(MOTS_CROISES_SOUND_FILES.select);
  const typePlayer = useAudioPlayer(MOTS_CROISES_SOUND_FILES.type);
  const correctPlayer = useAudioPlayer(MOTS_CROISES_SOUND_FILES.correct);
  const errorPlayer = useAudioPlayer(MOTS_CROISES_SOUND_FILES.error);
  const hintPlayer = useAudioPlayer(MOTS_CROISES_SOUND_FILES.hint);
  const victoryPlayer = useAudioPlayer(MOTS_CROISES_SOUND_FILES.victory);

  // Map des players
  const playersRef = useRef<Map<MotsCroisesSoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['select', selectPlayer],
      ['type', typePlayer],
      ['correct', correctPlayer],
      ['error', errorPlayer],
      ['hint', hintPlayer],
      ['victory', victoryPlayer],
    ])
  );

  // Jouer un son
  const playSound = useCallback(
    (name: MotsCroisesSoundName, volumeOverride?: number) => {
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
    },
    [soundEnabled]
  );

  // Helpers pour chaque type de son
  const playSelect = useCallback(() => {
    playSound('select');
  }, [playSound]);

  const playType = useCallback(() => {
    playSound('type');
  }, [playSound]);

  const playCorrect = useCallback(() => {
    playSound('correct');
  }, [playSound]);

  const playError = useCallback(() => {
    playSound('error');
  }, [playSound]);

  const playHint = useCallback(() => {
    playSound('hint');
  }, [playSound]);

  const playVictory = useCallback(() => {
    playSound('victory');
  }, [playSound]);

  return {
    playSound,
    playSelect,
    playType,
    playCorrect,
    playError,
    playHint,
    playVictory,
  };
}

export default useMotsCroisesSound;
