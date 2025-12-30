/**
 * useEmbouteillageSound hook
 * Gère les effets sonores pour le jeu Embouteillage (Rush Hour)
 *
 * Sons disponibles:
 * - select: Son de sélection d'un véhicule
 * - move: Son de déplacement d'un véhicule
 * - blocked: Son quand un mouvement est bloqué
 * - victory: Son de victoire (voiture libérée)
 * - horn: Klaxon amusant
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

type TimeoutRef = ReturnType<typeof setTimeout> | null;

// Types de sons disponibles
type EmbouteillageSoundName =
  | 'select'    // Sélection d'un véhicule
  | 'move'      // Déplacement
  | 'blocked'   // Mouvement bloqué
  | 'victory'   // Victoire
  | 'horn';     // Klaxon

// Fichiers audio - On réutilise les sons existants du projet
// TODO: Ajouter des sons spécifiques au thème voiture/parking
const EMBOUTEILLAGE_SOUND_FILES: Record<EmbouteillageSoundName, AudioSource> = {
  select: require('../../../../assets/sounds/robot_select.mp3'),
  move: require('../../../../assets/sounds/robot_select.mp3'),
  blocked: require('../../../../assets/sounds/robot_error.mp3'),
  victory: require('../../../../assets/sounds/robot_correct.mp3'),
  horn: require('../../../../assets/sounds/robot_thinking.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<EmbouteillageSoundName, number> = {
  select: 0.5,
  move: 0.4,
  blocked: 0.6,
  victory: 0.8,
  horn: 0.7,
};

export function useEmbouteillageSound() {
  const { soundEnabled } = useAppSettings();
  const hornLoopRef = useRef<TimeoutRef>(null);

  // Créer les players audio
  const selectPlayer = useAudioPlayer(EMBOUTEILLAGE_SOUND_FILES.select);
  const movePlayer = useAudioPlayer(EMBOUTEILLAGE_SOUND_FILES.move);
  const blockedPlayer = useAudioPlayer(EMBOUTEILLAGE_SOUND_FILES.blocked);
  const victoryPlayer = useAudioPlayer(EMBOUTEILLAGE_SOUND_FILES.victory);
  const hornPlayer = useAudioPlayer(EMBOUTEILLAGE_SOUND_FILES.horn);

  // Map des players
  const playersRef = useRef<Map<EmbouteillageSoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['select', selectPlayer],
      ['move', movePlayer],
      ['blocked', blockedPlayer],
      ['victory', victoryPlayer],
      ['horn', hornPlayer],
    ])
  );

  // Jouer un son
  const playSound = useCallback((name: EmbouteillageSoundName, volumeOverride?: number) => {
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
  const playSelect = useCallback(() => {
    playSound('select');
  }, [playSound]);

  const playMove = useCallback(() => {
    playSound('move');
  }, [playSound]);

  const playBlocked = useCallback(() => {
    playSound('blocked');
  }, [playSound]);

  const playVictory = useCallback(() => {
    playSound('victory');
  }, [playSound]);

  const playHorn = useCallback(() => {
    playSound('horn');
  }, [playSound]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (hornLoopRef.current) {
        clearTimeout(hornLoopRef.current);
      }
    };
  }, []);

  return {
    playSound,
    playSelect,
    playMove,
    playBlocked,
    playVictory,
    playHorn,
  };
}

export default useEmbouteillageSound;
