/**
 * useMemorySound Hook
 *
 * Gestion des sons pour le jeu Memory
 * Utilise expo-audio pour la lecture des sons
 *
 * Sons utilisés :
 * - card_flip: Son de retournement (disk_move)
 * - card_match: Son de paire trouvée (robot_correct)
 * - card_mismatch: Son d'erreur (robot_error)
 * - victory: Son de victoire
 * - hint: Son d'indice
 * - select: Son de sélection (robot_select)
 * - start: Son de début (disk_place)
 */

import { useCallback, useRef } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store/useStore';

// ============================================================================
// TYPES
// ============================================================================

export type MemorySoundName =
  | 'card_flip'      // Carte retournée
  | 'card_match'     // Paire trouvée
  | 'card_mismatch'  // Pas de paire
  | 'victory'        // Partie gagnée
  | 'hint'           // Indice utilisé
  | 'select'         // Sélection niveau
  | 'start';         // Début partie

export interface UseMemorySoundReturn {
  /** Joue un son */
  playSound: (name: MemorySoundName) => void;
  /** Joue le son de retournement de carte */
  playFlip: () => void;
  /** Joue le son de paire trouvée */
  playMatch: () => void;
  /** Joue le son d'erreur (pas de paire) */
  playMismatch: () => void;
  /** Joue le son de victoire */
  playVictory: () => void;
  /** Joue le son d'indice */
  playHint: () => void;
  /** Joue le son de sélection */
  playSelect: () => void;
  /** Joue le son de début */
  playStart: () => void;
}

// ============================================================================
// SOUND FILES
// ============================================================================

// Réutilisation des sons existants dans assets/sounds/
const MEMORY_SOUND_FILES: Record<MemorySoundName, AudioSource> = {
  card_flip: require('../../../../assets/sounds/disk_move.mp3'),
  card_match: require('../../../../assets/sounds/robot_correct.mp3'),
  card_mismatch: require('../../../../assets/sounds/robot_error.mp3'),
  victory: require('../../../../assets/sounds/victory.mp3'),
  hint: require('../../../../assets/sounds/hint.mp3'),
  select: require('../../../../assets/sounds/robot_select.mp3'),
  start: require('../../../../assets/sounds/disk_place.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<MemorySoundName, number> = {
  card_flip: 0.5,
  card_match: 0.8,
  card_mismatch: 0.6,
  victory: 0.9,
  hint: 0.7,
  select: 0.5,
  start: 0.6,
};

// ============================================================================
// HOOK
// ============================================================================

export function useMemorySound(): UseMemorySoundReturn {
  const { soundEnabled } = useAppSettings();

  // Créer les players audio
  const flipPlayer = useAudioPlayer(MEMORY_SOUND_FILES.card_flip);
  const matchPlayer = useAudioPlayer(MEMORY_SOUND_FILES.card_match);
  const mismatchPlayer = useAudioPlayer(MEMORY_SOUND_FILES.card_mismatch);
  const victoryPlayer = useAudioPlayer(MEMORY_SOUND_FILES.victory);
  const hintPlayer = useAudioPlayer(MEMORY_SOUND_FILES.hint);
  const selectPlayer = useAudioPlayer(MEMORY_SOUND_FILES.select);
  const startPlayer = useAudioPlayer(MEMORY_SOUND_FILES.start);

  // Map des players
  const playersRef = useRef<Map<MemorySoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['card_flip', flipPlayer],
      ['card_match', matchPlayer],
      ['card_mismatch', mismatchPlayer],
      ['victory', victoryPlayer],
      ['hint', hintPlayer],
      ['select', selectPlayer],
      ['start', startPlayer],
    ])
  );

  // Fonction générique pour jouer un son
  const playSound = useCallback((name: MemorySoundName, volumeOverride?: number) => {
    if (!soundEnabled) return;

    try {
      const player = playersRef.current.get(name);
      if (!player) {
        console.warn(`[MemorySound] Son ${name} non trouvé`);
        return;
      }

      // Vérifier si le son est chargé
      if (!player.isLoaded) {
        return;
      }

      const volume = volumeOverride ?? DEFAULT_VOLUMES[name];
      player.volume = volume;
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.warn(`[MemorySound] Erreur lecture son ${name}:`, error);
    }
  }, [soundEnabled]);

  // Raccourcis pour chaque son
  const playFlip = useCallback(() => playSound('card_flip'), [playSound]);
  const playMatch = useCallback(() => playSound('card_match'), [playSound]);
  const playMismatch = useCallback(() => playSound('card_mismatch'), [playSound]);
  const playVictory = useCallback(() => playSound('victory'), [playSound]);
  const playHint = useCallback(() => playSound('hint'), [playSound]);
  const playSelect = useCallback(() => playSound('select'), [playSound]);
  const playStart = useCallback(() => playSound('start'), [playSound]);

  return {
    playSound,
    playFlip,
    playMatch,
    playMismatch,
    playVictory,
    playHint,
    playSelect,
    playStart,
  };
}

export default useMemorySound;
