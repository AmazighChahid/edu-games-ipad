/**
 * useSound hook
 * Manages sound effects using expo-audio
 */

import { useEffect, useRef } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../store/useStore';

type SoundName =
  | 'disk_move'      // Valid disk movement
  | 'disk_error'     // Invalid movement attempt
  | 'disk_place'     // Disk placed successfully
  | 'victory'        // Game victory
  | 'hint';          // Hint activated

// Sound file mappings
const SOUND_FILES: Record<SoundName, AudioSource> = {
  disk_move: require('../../assets/sounds/disk_move.mp3'),
  disk_error: require('../../assets/sounds/disk_error.mp3'),
  disk_place: require('../../assets/sounds/disk_place.mp3'),
  victory: require('../../assets/sounds/victory.mp3'),
  hint: require('../../assets/sounds/hint.mp3'),
};

export function useSound() {
  const { soundEnabled } = useAppSettings();

  // Create audio players for each sound
  const diskMovePlayer = useAudioPlayer(SOUND_FILES.disk_move);
  const diskErrorPlayer = useAudioPlayer(SOUND_FILES.disk_error);
  const diskPlacePlayer = useAudioPlayer(SOUND_FILES.disk_place);
  const victoryPlayer = useAudioPlayer(SOUND_FILES.victory);
  const hintPlayer = useAudioPlayer(SOUND_FILES.hint);

  const playersRef = useRef<Map<SoundName, ReturnType<typeof useAudioPlayer>>>(new Map([
    ['disk_move', diskMovePlayer],
    ['disk_error', diskErrorPlayer],
    ['disk_place', diskPlacePlayer],
    ['victory', victoryPlayer],
    ['hint', hintPlayer],
  ]));

  const playSound = (name: SoundName, volume = 0.8) => {
    if (!soundEnabled) return;

    try {
      const player = playersRef.current.get(name);
      if (!player) {
        console.warn(`Sound ${name} not found`);
        return;
      }

      // Vérifier si le son est chargé avant de jouer
      if (!player.isLoaded) {
        return;
      }

      // Set volume and play
      player.volume = volume;
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.warn(`Failed to play sound ${name}:`, error);
    }
  };

  return { playSound };
}
