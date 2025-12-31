/**
 * useLabyrintheSound hook
 * Gère les effets sonores pour le jeu Labyrinthe
 *
 * Sons disponibles:
 * - move: Son de déplacement
 * - collect: Son de collecte d'objet/gemme
 * - unlock: Son de porte déverrouillée
 * - blocked: Son de mur/obstacle
 * - correct: Son d'arrivée à destination
 * - hint: Son d'indice
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

// Types de sons disponibles
type LabyrintheSoundName =
  | 'move'      // Déplacement
  | 'collect'   // Collecte gemme/objet
  | 'unlock'    // Porte déverrouillée
  | 'blocked'   // Mur/obstacle
  | 'correct'   // Arrivée/victoire
  | 'hint'      // Indice
  | 'step';     // Pas

// Fichiers audio
const LABYRINTHE_SOUND_FILES: Record<LabyrintheSoundName, AudioSource> = {
  move: require('../../../../assets/sounds/move.mp3'),
  collect: require('../../../../assets/sounds/collect.mp3'),
  unlock: require('../../../../assets/sounds/unlock.mp3'),
  blocked: require('../../../../assets/sounds/blocked.mp3'),
  correct: require('../../../../assets/sounds/correct.mp3'),
  hint: require('../../../../assets/sounds/hint.mp3'),
  step: require('../../../../assets/sounds/step.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<LabyrintheSoundName, number> = {
  move: 0.4,
  collect: 0.7,
  unlock: 0.8,
  blocked: 0.5,
  correct: 0.9,
  hint: 0.6,
  step: 0.3,
};

export function useLabyrintheSound() {
  const { soundEnabled } = useAppSettings();

  // Créer les players audio
  const movePlayer = useAudioPlayer(LABYRINTHE_SOUND_FILES.move);
  const collectPlayer = useAudioPlayer(LABYRINTHE_SOUND_FILES.collect);
  const unlockPlayer = useAudioPlayer(LABYRINTHE_SOUND_FILES.unlock);
  const blockedPlayer = useAudioPlayer(LABYRINTHE_SOUND_FILES.blocked);
  const correctPlayer = useAudioPlayer(LABYRINTHE_SOUND_FILES.correct);
  const hintPlayer = useAudioPlayer(LABYRINTHE_SOUND_FILES.hint);
  const stepPlayer = useAudioPlayer(LABYRINTHE_SOUND_FILES.step);

  // Map des players
  const playersRef = useRef<Map<LabyrintheSoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['move', movePlayer],
      ['collect', collectPlayer],
      ['unlock', unlockPlayer],
      ['blocked', blockedPlayer],
      ['correct', correctPlayer],
      ['hint', hintPlayer],
      ['step', stepPlayer],
    ])
  );

  // Jouer un son
  const playSound = useCallback((name: LabyrintheSoundName, volumeOverride?: number) => {
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
  const playMove = useCallback(() => playSound('move'), [playSound]);
  const playCollect = useCallback(() => playSound('collect'), [playSound]);
  const playUnlock = useCallback(() => playSound('unlock'), [playSound]);
  const playBlocked = useCallback(() => playSound('blocked'), [playSound]);
  const playCorrect = useCallback(() => playSound('correct'), [playSound]);
  const playHint = useCallback(() => playSound('hint'), [playSound]);
  const playStep = useCallback(() => playSound('step'), [playSound]);

  return {
    playSound,
    playMove,
    playCollect,
    playUnlock,
    playBlocked,
    playCorrect,
    playHint,
    playStep,
  };
}

export default useLabyrintheSound;
