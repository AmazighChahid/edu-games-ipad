/**
 * useMathSound hook
 * Gère les effets sonores pour le jeu MathBlocks
 *
 * Sons disponibles:
 * - select: Son lors de la sélection d'un bloc
 * - match: Son de correspondance correcte (paire trouvée)
 * - error: Son de mauvaise correspondance
 * - combo: Son de combo (correspondances consécutives)
 * - victory: Son de victoire
 * - hint: Son d'indice
 */

import { useEffect, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

// Types de sons disponibles
type MathSoundName =
  | 'select'   // Sélection d'un bloc
  | 'match'    // Bonne correspondance
  | 'error'    // Mauvaise correspondance
  | 'combo'    // Combo bonus
  | 'victory'  // Victoire
  | 'hint';    // Indice

// Fichiers audio (réutilisation des sons existants)
const MATH_SOUND_FILES: Record<MathSoundName, AudioSource> = {
  select: require('../../../../assets/sounds/robot_select.mp3'),
  match: require('../../../../assets/sounds/robot_correct.mp3'),
  error: require('../../../../assets/sounds/robot_error.mp3'),
  combo: require('../../../../assets/sounds/victory.mp3'),
  victory: require('../../../../assets/sounds/victory.mp3'),
  hint: require('../../../../assets/sounds/hint.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<MathSoundName, number> = {
  select: 0.5,
  match: 0.7,
  error: 0.6,
  combo: 0.8,
  victory: 1.0,
  hint: 0.6,
};

export function useMathSound() {
  const { soundEnabled } = useAppSettings();

  // Créer les players audio
  const selectPlayer = useAudioPlayer(MATH_SOUND_FILES.select);
  const matchPlayer = useAudioPlayer(MATH_SOUND_FILES.match);
  const errorPlayer = useAudioPlayer(MATH_SOUND_FILES.error);
  const comboPlayer = useAudioPlayer(MATH_SOUND_FILES.combo);
  const victoryPlayer = useAudioPlayer(MATH_SOUND_FILES.victory);
  const hintPlayer = useAudioPlayer(MATH_SOUND_FILES.hint);

  // Map des players pour accès dynamique
  const players: Record<MathSoundName, ReturnType<typeof useAudioPlayer>> = {
    select: selectPlayer,
    match: matchPlayer,
    error: errorPlayer,
    combo: comboPlayer,
    victory: victoryPlayer,
    hint: hintPlayer,
  };

  // Jouer un son
  const playSound = useCallback(
    (name: MathSoundName, volumeOverride?: number) => {
      if (!soundEnabled) return;

      try {
        const player = players[name];
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
    [soundEnabled, players]
  );

  // Helpers pour chaque type de son
  const playSelect = useCallback(() => {
    playSound('select');
  }, [playSound]);

  const playMatch = useCallback(() => {
    playSound('match');
  }, [playSound]);

  const playError = useCallback(() => {
    playSound('error');
  }, [playSound]);

  const playCombo = useCallback((comboLevel: number) => {
    // Volume augmente avec le combo
    const volume = Math.min(0.5 + comboLevel * 0.1, 1.0);
    playSound('combo', volume);
  }, [playSound]);

  const playVictory = useCallback(() => {
    playSound('victory');
  }, [playSound]);

  const playHint = useCallback(() => {
    playSound('hint');
  }, [playSound]);

  return {
    playSound,
    playSelect,
    playMatch,
    playError,
    playCombo,
    playVictory,
    playHint,
  };
}

export default useMathSound;
