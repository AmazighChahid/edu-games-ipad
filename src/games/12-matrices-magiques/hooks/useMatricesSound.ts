/**
 * useMatricesSound hook
 * Gère les effets sonores pour le jeu Matrices Magiques
 *
 * Sons disponibles:
 * - select: Son de sélection d'une réponse
 * - correct: Son de bonne réponse
 * - error: Son de mauvaise réponse
 * - hint: Son d'indice
 * - levelUp: Son de passage de niveau
 * - worldUnlock: Son de déblocage d'un monde
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

// Types de sons disponibles
type MatricesSoundName =
  | 'select'       // Sélection d'une réponse
  | 'correct'      // Bonne réponse
  | 'error'        // Mauvaise réponse
  | 'hint'         // Indice affiché
  | 'levelUp'      // Passage de niveau
  | 'worldUnlock'  // Déblocage d'un monde
  | 'magic';       // Effet magique

// Fichiers audio
const MATRICES_SOUND_FILES: Record<MatricesSoundName, AudioSource> = {
  select: require('../../../../assets/sounds/select.mp3'),
  correct: require('../../../../assets/sounds/correct.mp3'),
  error: require('../../../../assets/sounds/error.mp3'),
  hint: require('../../../../assets/sounds/hint.mp3'),
  levelUp: require('../../../../assets/sounds/level_up.mp3'),
  worldUnlock: require('../../../../assets/sounds/world_unlock.mp3'),
  magic: require('../../../../assets/sounds/magic.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<MatricesSoundName, number> = {
  select: 0.5,
  correct: 0.8,
  error: 0.6,
  hint: 0.6,
  levelUp: 0.9,
  worldUnlock: 1.0,
  magic: 0.7,
};

export function useMatricesSound() {
  const { soundEnabled } = useAppSettings();

  // Créer les players audio
  const selectPlayer = useAudioPlayer(MATRICES_SOUND_FILES.select);
  const correctPlayer = useAudioPlayer(MATRICES_SOUND_FILES.correct);
  const errorPlayer = useAudioPlayer(MATRICES_SOUND_FILES.error);
  const hintPlayer = useAudioPlayer(MATRICES_SOUND_FILES.hint);
  const levelUpPlayer = useAudioPlayer(MATRICES_SOUND_FILES.levelUp);
  const worldUnlockPlayer = useAudioPlayer(MATRICES_SOUND_FILES.worldUnlock);
  const magicPlayer = useAudioPlayer(MATRICES_SOUND_FILES.magic);

  // Map des players
  const playersRef = useRef<Map<MatricesSoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['select', selectPlayer],
      ['correct', correctPlayer],
      ['error', errorPlayer],
      ['hint', hintPlayer],
      ['levelUp', levelUpPlayer],
      ['worldUnlock', worldUnlockPlayer],
      ['magic', magicPlayer],
    ])
  );

  // Jouer un son
  const playSound = useCallback((name: MatricesSoundName, volumeOverride?: number) => {
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

  // Sons spécifiques
  const playSelect = useCallback(() => playSound('select'), [playSound]);
  const playCorrect = useCallback(() => playSound('correct'), [playSound]);
  const playError = useCallback(() => playSound('error'), [playSound]);
  const playHint = useCallback(() => playSound('hint'), [playSound]);
  const playLevelUp = useCallback(() => playSound('levelUp'), [playSound]);
  const playWorldUnlock = useCallback(() => playSound('worldUnlock'), [playSound]);
  const playMagic = useCallback(() => playSound('magic'), [playSound]);

  return {
    playSound,
    playSelect,
    playCorrect,
    playError,
    playHint,
    playLevelUp,
    playWorldUnlock,
    playMagic,
  };
}

export default useMatricesSound;
