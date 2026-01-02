/**
 * useSudokuSound Hook
 * Gestion centralisée des sons pour le jeu Sudoku
 */

import { useCallback } from 'react';
import { Audio } from 'expo-av';
import { useStore } from '@/store';

// Types de sons disponibles
export type SudokuSoundType =
  | 'select'    // Sélection d'une case
  | 'place'     // Placement d'un symbole
  | 'correct'   // Placement correct
  | 'error'     // Placement incorrect
  | 'hint'      // Utilisation d'un indice
  | 'victory'   // Victoire/niveau complété
  | 'levelUp'   // Passage au niveau suivant
  | 'star';     // Obtention d'une étoile

// Cache des sons pour éviter de les recharger
let soundCache: Record<string, Audio.Sound> = {};

export function useSudokuSound() {
  const soundEnabled = useStore((state) => state.soundEnabled);

  /**
   * Joue un son générique
   */
  const playSound = useCallback(
    async (soundType: SudokuSoundType) => {
      if (!soundEnabled) return;

      try {
        // Map des sons vers les fichiers
        // Note: Les fichiers audio doivent être ajoutés dans assets/sounds/
        const soundMap: Record<SudokuSoundType, string> = {
          select: 'tap',
          place: 'pop',
          correct: 'success',
          error: 'error',
          hint: 'hint',
          victory: 'victory',
          levelUp: 'levelup',
          star: 'star',
        };

        const soundName = soundMap[soundType];

        // Utiliser le cache si disponible
        if (soundCache[soundName]) {
          await soundCache[soundName].replayAsync();
          return;
        }

        // Charger le son (à adapter selon la structure de fichiers)
        // const { sound } = await Audio.Sound.createAsync(
        //   require(`@/assets/sounds/${soundName}.mp3`)
        // );
        // soundCache[soundName] = sound;
        // await sound.playAsync();

        // Pour l'instant, log le son demandé
        if (__DEV__) console.log(`[Sound] Playing: ${soundType}`);
      } catch (error) {
        console.warn(`[Sound] Error playing ${soundType}:`, error);
      }
    },
    [soundEnabled]
  );

  /**
   * Son de sélection de case
   */
  const playSelect = useCallback(() => {
    playSound('select');
  }, [playSound]);

  /**
   * Son de placement de symbole
   */
  const playPlace = useCallback(() => {
    playSound('place');
  }, [playSound]);

  /**
   * Son de placement correct
   */
  const playCorrect = useCallback(() => {
    playSound('correct');
  }, [playSound]);

  /**
   * Son d'erreur
   */
  const playError = useCallback(() => {
    playSound('error');
  }, [playSound]);

  /**
   * Son d'indice
   */
  const playHint = useCallback(() => {
    playSound('hint');
  }, [playSound]);

  /**
   * Son de victoire
   */
  const playVictory = useCallback(() => {
    playSound('victory');
  }, [playSound]);

  /**
   * Son de passage au niveau suivant
   */
  const playLevelUp = useCallback(() => {
    playSound('levelUp');
  }, [playSound]);

  /**
   * Son d'obtention d'étoile
   */
  const playStar = useCallback(() => {
    playSound('star');
  }, [playSound]);

  /**
   * Nettoie le cache des sons (à appeler au démontage)
   */
  const cleanup = useCallback(async () => {
    for (const sound of Object.values(soundCache)) {
      try {
        await sound.unloadAsync();
      } catch {
        // Ignorer les erreurs de nettoyage
      }
    }
    soundCache = {};
  }, []);

  return {
    playSelect,
    playPlace,
    playCorrect,
    playError,
    playHint,
    playVictory,
    playLevelUp,
    playStar,
    cleanup,
    // Accès direct pour des sons personnalisés
    playSound,
  };
}

export default useSudokuSound;
