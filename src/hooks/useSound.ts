/**
 * useSound hook
 * Manages sound effects using expo-av
 */

import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useAppSettings } from '../store/useStore';

type SoundName =
  | 'disk_move'      // Valid disk movement
  | 'disk_error'     // Invalid movement attempt
  | 'disk_place'     // Disk placed successfully
  | 'victory'        // Game victory
  | 'hint';          // Hint activated

// Sound file mappings
const SOUND_FILES: Record<SoundName, any> = {
  disk_move: require('../../assets/sounds/disk_move.mp3'),
  disk_error: require('../../assets/sounds/disk_error.mp3'),
  disk_place: require('../../assets/sounds/disk_place.mp3'),
  victory: require('../../assets/sounds/victory.mp3'),
  hint: require('../../assets/sounds/hint.mp3'),
};

export function useSound() {
  const { soundEnabled } = useAppSettings();
  const soundsRef = useRef<Map<SoundName, Audio.Sound>>(new Map());
  const isLoadingRef = useRef(false);

  useEffect(() => {
    // Configure audio mode
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.warn('Failed to configure audio mode:', error);
      }
    };

    setupAudio();

    // Load sounds
    const loadSounds = async () => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      try {
        for (const [name, source] of Object.entries(SOUND_FILES)) {
          try {
            const { sound } = await Audio.Sound.createAsync(source, {
              shouldPlay: false,
              volume: 0.8,
            });
            soundsRef.current.set(name as SoundName, sound);
          } catch (error) {
            console.warn(`Failed to load sound ${name}:`, error);
          }
        }
      } catch (error) {
        console.warn('Failed to load sounds:', error);
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadSounds();

    // Cleanup
    return () => {
      soundsRef.current.forEach((sound) => {
        sound.unloadAsync().catch(console.warn);
      });
      soundsRef.current.clear();
    };
  }, []);

  const playSound = async (name: SoundName, volume = 0.8) => {
    if (!soundEnabled) return;

    try {
      const sound = soundsRef.current.get(name);
      if (!sound) {
        console.warn(`Sound ${name} not loaded`);
        return;
      }

      // Reset to start and play
      await sound.setPositionAsync(0);
      await sound.setVolumeAsync(volume);
      await sound.playAsync();
    } catch (error) {
      console.warn(`Failed to play sound ${name}:`, error);
    }
  };

  return { playSound };
}
