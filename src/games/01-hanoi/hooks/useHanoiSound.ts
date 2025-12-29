/**
 * useHanoiSound hook
 * Gère les effets sonores pour le jeu Tour de Hanoï
 *
 * Sons disponibles:
 * - playDiskPlace: Son de placement de disque réussi
 * - playDiskError: Son d'erreur (mouvement invalide)
 * - playVictory: Son de victoire
 * - playHint: Son d'indice
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern Hook+Template
 */

import { useCallback } from 'react';
import { useSound } from '../../../hooks/useSound';

// ============================================
// TYPES
// ============================================

export interface UseHanoiSoundReturn {
  /** Jouer le son de placement de disque réussi */
  playDiskPlace: () => void;
  /** Jouer le son d'erreur (mouvement invalide) */
  playDiskError: () => void;
  /** Jouer le son de victoire */
  playVictory: () => void;
  /** Jouer le son d'indice */
  playHint: () => void;
}

// ============================================
// VOLUMES PAR DÉFAUT
// ============================================

const VOLUMES = {
  diskPlace: 0.6,
  diskError: 0.5,
  victory: 0.7,
  hint: 0.6,
} as const;

// ============================================
// HOOK
// ============================================

export function useHanoiSound(): UseHanoiSoundReturn {
  const { playSound } = useSound();

  const playDiskPlace = useCallback(() => {
    playSound('disk_place', VOLUMES.diskPlace);
  }, [playSound]);

  const playDiskError = useCallback(() => {
    playSound('disk_error', VOLUMES.diskError);
  }, [playSound]);

  const playVictory = useCallback(() => {
    playSound('victory', VOLUMES.victory);
  }, [playSound]);

  const playHint = useCallback(() => {
    playSound('hint', VOLUMES.hint);
  }, [playSound]);

  return {
    playDiskPlace,
    playDiskError,
    playVictory,
    playHint,
  };
}

export default useHanoiSound;
