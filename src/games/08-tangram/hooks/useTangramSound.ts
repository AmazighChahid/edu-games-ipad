/**
 * useTangramSound hook
 * Gère les effets sonores pour le jeu Tangram
 *
 * Sons disponibles:
 * - pickup: Son quand on attrape une pièce
 * - drop: Son quand on pose une pièce
 * - rotate: Son de rotation de pièce
 * - snap: Son quand une pièce s'enclenche correctement
 * - correct: Son de bonne réponse / puzzle complété
 * - error: Son de mauvais placement
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

// Types de sons disponibles
type TangramSoundName =
  | 'pickup'    // Attraper une pièce
  | 'drop'      // Poser une pièce
  | 'rotate'    // Rotation
  | 'snap'      // Enclencher correctement
  | 'correct'   // Puzzle complété
  | 'error';    // Mauvais placement

// Fichiers audio
const TANGRAM_SOUND_FILES: Record<TangramSoundName, AudioSource> = {
  pickup: require('../../../../assets/sounds/pickup.mp3'),
  drop: require('../../../../assets/sounds/drop.mp3'),
  rotate: require('../../../../assets/sounds/rotate.mp3'),
  snap: require('../../../../assets/sounds/snap.mp3'),
  correct: require('../../../../assets/sounds/correct.mp3'),
  error: require('../../../../assets/sounds/error.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<TangramSoundName, number> = {
  pickup: 0.5,
  drop: 0.6,
  rotate: 0.4,
  snap: 0.7,
  correct: 0.9,
  error: 0.6,
};

export function useTangramSound() {
  const { soundEnabled } = useAppSettings();

  // Créer les players audio
  const pickupPlayer = useAudioPlayer(TANGRAM_SOUND_FILES.pickup);
  const dropPlayer = useAudioPlayer(TANGRAM_SOUND_FILES.drop);
  const rotatePlayer = useAudioPlayer(TANGRAM_SOUND_FILES.rotate);
  const snapPlayer = useAudioPlayer(TANGRAM_SOUND_FILES.snap);
  const correctPlayer = useAudioPlayer(TANGRAM_SOUND_FILES.correct);
  const errorPlayer = useAudioPlayer(TANGRAM_SOUND_FILES.error);

  // Map des players
  const playersRef = useRef<Map<TangramSoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['pickup', pickupPlayer],
      ['drop', dropPlayer],
      ['rotate', rotatePlayer],
      ['snap', snapPlayer],
      ['correct', correctPlayer],
      ['error', errorPlayer],
    ])
  );

  // Jouer un son
  const playSound = useCallback((name: TangramSoundName, volumeOverride?: number) => {
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
  const playPickup = useCallback(() => playSound('pickup'), [playSound]);
  const playDrop = useCallback(() => playSound('drop'), [playSound]);
  const playRotate = useCallback(() => playSound('rotate'), [playSound]);
  const playSnap = useCallback(() => playSound('snap'), [playSound]);
  const playCorrect = useCallback(() => playSound('correct'), [playSound]);
  const playError = useCallback(() => playSound('error'), [playSound]);

  return {
    playSound,
    playPickup,
    playDrop,
    playRotate,
    playSnap,
    playCorrect,
    playError,
  };
}

export default useTangramSound;
