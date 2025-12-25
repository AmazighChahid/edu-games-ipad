/**
 * Hook pour la gestion des sons
 */

import { useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useAppStore } from '../store';

// Types de sons disponibles
export type SoundType = 'tap' | 'pickup' | 'drop' | 'success' | 'error' | 'victory';

// Cache des sons chargés
const soundCache: Map<SoundType, Audio.Sound> = new Map();

// Placeholder - En production, on chargerait de vrais fichiers audio
// Pour l'instant, on simule les sons avec des tonalités
const loadSound = async (type: SoundType): Promise<Audio.Sound | null> => {
  try {
    // Dans une vraie app, on chargerait les fichiers audio ici
    // const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/tap.mp3'));
    // Pour l'instant, on retourne null car pas de fichiers audio
    return null;
  } catch (error) {
    console.warn(`Could not load sound: ${type}`, error);
    return null;
  }
};

export const useSound = () => {
  const { soundEnabled } = useAppStore();
  const initialized = useRef(false);

  // Initialiser le système audio
  useEffect(() => {
    const initAudio = async () => {
      if (initialized.current) return;

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
        initialized.current = true;
      } catch (error) {
        console.warn('Could not initialize audio', error);
      }
    };

    initAudio();

    // Nettoyer les sons au démontage
    return () => {
      soundCache.forEach((sound) => {
        sound.unloadAsync();
      });
      soundCache.clear();
    };
  }, []);

  // Jouer un son
  const playSound = useCallback(
    async (type: SoundType) => {
      if (!soundEnabled) return;

      try {
        let sound: Audio.Sound | undefined = soundCache.get(type);

        if (!sound) {
          const loadedSound = await loadSound(type);
          if (loadedSound) {
            sound = loadedSound;
            soundCache.set(type, sound);
          }
        }

        if (sound) {
          await sound.setPositionAsync(0);
          await sound.playAsync();
        }
      } catch (error) {
        console.warn(`Could not play sound: ${type}`, error);
      }
    },
    [soundEnabled]
  );

  // Précharger tous les sons
  const preloadSounds = useCallback(async () => {
    const soundTypes: SoundType[] = ['tap', 'pickup', 'drop', 'success', 'error', 'victory'];

    for (const type of soundTypes) {
      if (!soundCache.has(type)) {
        const sound = await loadSound(type);
        if (sound) {
          soundCache.set(type, sound);
        }
      }
    }
  }, []);

  return {
    playSound,
    preloadSounds,
  };
};
