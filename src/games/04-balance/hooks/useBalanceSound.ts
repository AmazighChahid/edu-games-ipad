/**
 * Balance Sound Hook
 * Gère les sons du jeu de la balance
 * Feedback audio pour les enfants: équilibre, erreur, victoire
 */

import { useCallback, useRef } from 'react';
import { Audio } from 'expo-av';

// ============================================
// TYPES
// ============================================

interface UseBalanceSoundReturn {
  /** Jouer le son d'équilibre atteint */
  playBalance: () => Promise<void>;
  /** Jouer le son d'objet placé */
  playPlace: () => Promise<void>;
  /** Jouer le son d'objet retiré */
  playRemove: () => Promise<void>;
  /** Jouer le son de déséquilibre */
  playUnbalance: () => Promise<void>;
  /** Jouer le son de victoire */
  playVictory: () => Promise<void>;
  /** Jouer le son d'indice */
  playHint: () => Promise<void>;
  /** Jouer le son de nouvelle découverte */
  playDiscovery: () => Promise<void>;
  /** Nettoyer les ressources audio */
  cleanup: () => Promise<void>;
}

// ============================================
// CONFIGURATION SONS
// ============================================

// Note: Ces chemins seront à adapter quand les fichiers audio seront disponibles
// Pour l'instant on utilise des sons système ou on les désactive gracieusement
const SOUND_CONFIG = {
  balance: null, // require('@/assets/sounds/balance/balance.mp3'),
  place: null, // require('@/assets/sounds/balance/place.mp3'),
  remove: null, // require('@/assets/sounds/balance/remove.mp3'),
  unbalance: null, // require('@/assets/sounds/balance/unbalance.mp3'),
  victory: null, // require('@/assets/sounds/balance/victory.mp3'),
  hint: null, // require('@/assets/sounds/balance/hint.mp3'),
  discovery: null, // require('@/assets/sounds/balance/discovery.mp3'),
};

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useBalanceSound(): UseBalanceSoundReturn {
  const soundsRef = useRef<Map<string, Audio.Sound>>(new Map());
  const isLoadingRef = useRef<Map<string, boolean>>(new Map());

  /**
   * Charge un son si nécessaire et le joue
   */
  const playSound = useCallback(async (soundKey: keyof typeof SOUND_CONFIG): Promise<void> => {
    try {
      const soundSource = SOUND_CONFIG[soundKey];

      // Si pas de fichier son configuré, on sort silencieusement
      if (!soundSource) {
        return;
      }

      // Éviter le chargement concurrent
      if (isLoadingRef.current.get(soundKey)) {
        return;
      }

      let sound = soundsRef.current.get(soundKey);

      // Charger le son s'il n'existe pas encore
      if (!sound) {
        isLoadingRef.current.set(soundKey, true);
        try {
          const { sound: newSound } = await Audio.Sound.createAsync(
            soundSource,
            { shouldPlay: false }
          );
          sound = newSound;
          soundsRef.current.set(soundKey, sound);
        } finally {
          isLoadingRef.current.set(soundKey, false);
        }
      }

      // Rejouer depuis le début
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      // Fail silently - les sons ne sont pas critiques
      console.warn(`[useBalanceSound] Erreur lecture son ${soundKey}:`, error);
    }
  }, []);

  /**
   * Nettoie toutes les ressources audio
   */
  const cleanup = useCallback(async (): Promise<void> => {
    const sounds = Array.from(soundsRef.current.values());
    await Promise.all(
      sounds.map(async (sound) => {
        try {
          await sound.unloadAsync();
        } catch {
          // Ignorer les erreurs de nettoyage
        }
      })
    );
    soundsRef.current.clear();
  }, []);

  return {
    playBalance: useCallback(() => playSound('balance'), [playSound]),
    playPlace: useCallback(() => playSound('place'), [playSound]),
    playRemove: useCallback(() => playSound('remove'), [playSound]),
    playUnbalance: useCallback(() => playSound('unbalance'), [playSound]),
    playVictory: useCallback(() => playSound('victory'), [playSound]),
    playHint: useCallback(() => playSound('hint'), [playSound]),
    playDiscovery: useCallback(() => playSound('discovery'), [playSound]),
    cleanup,
  };
}

export default useBalanceSound;
