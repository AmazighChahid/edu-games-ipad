/**
 * useSuitesSound hook
 * Gère les effets sonores pour le jeu des Suites Logiques
 *
 * Sons disponibles:
 * - select: Bip court lors de la sélection d'une forme
 * - correct: Bips joyeux pour une bonne réponse
 * - error: Bip descendant pour une mauvaise réponse
 * - thinking: Bips espacés pendant la réflexion
 * - ambient: Fond sonore robotique léger (en boucle)
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

type TimeoutRef = ReturnType<typeof setTimeout> | null;

// Types de sons disponibles
type SuitesSoundName =
  | 'select'      // Sélection d'une forme
  | 'correct'     // Bonne réponse
  | 'error'       // Mauvaise réponse
  | 'thinking'    // Robot réfléchit
  | 'ambient';    // Fond sonore robotique

// Fichiers audio
const SUITES_SOUND_FILES: Record<SuitesSoundName, AudioSource> = {
  select: require('../../../../assets/sounds/robot_select.mp3'),
  correct: require('../../../../assets/sounds/robot_correct.mp3'),
  error: require('../../../../assets/sounds/robot_error.mp3'),
  thinking: require('../../../../assets/sounds/robot_thinking.mp3'),
  ambient: require('../../../../assets/sounds/robot_ambient.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<SuitesSoundName, number> = {
  select: 0.6,
  correct: 0.8,
  error: 0.7,
  thinking: 0.5,
  ambient: 0.15, // Très faible pour le fond
};

export function useSuitesSound() {
  const { soundEnabled } = useAppSettings();
  const ambientLoopRef = useRef<TimeoutRef>(null);

  // Créer les players audio
  const selectPlayer = useAudioPlayer(SUITES_SOUND_FILES.select);
  const correctPlayer = useAudioPlayer(SUITES_SOUND_FILES.correct);
  const errorPlayer = useAudioPlayer(SUITES_SOUND_FILES.error);
  const thinkingPlayer = useAudioPlayer(SUITES_SOUND_FILES.thinking);
  const ambientPlayer = useAudioPlayer(SUITES_SOUND_FILES.ambient);

  // Map des players
  const playersRef = useRef<Map<SuitesSoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['select', selectPlayer],
      ['correct', correctPlayer],
      ['error', errorPlayer],
      ['thinking', thinkingPlayer],
      ['ambient', ambientPlayer],
    ])
  );

  // Jouer un son
  const playSound = useCallback((name: SuitesSoundName, volumeOverride?: number) => {
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

  // Démarrer le fond sonore ambient en boucle
  const startAmbient = useCallback(() => {
    if (!soundEnabled) return;

    const playAmbientLoop = () => {
      playSound('ambient');
      // Le fichier ambient fait ~10 secondes, on le relance en boucle
      ambientLoopRef.current = setTimeout(playAmbientLoop, 10000);
    };

    playAmbientLoop();
  }, [soundEnabled, playSound]);

  // Arrêter le fond sonore
  const stopAmbient = useCallback(() => {
    if (ambientLoopRef.current) {
      clearTimeout(ambientLoopRef.current);
      ambientLoopRef.current = null;
    }

    try {
      const ambientPlayerInstance = playersRef.current.get('ambient');
      if (ambientPlayerInstance && ambientPlayerInstance.playing) {
        ambientPlayerInstance.pause();
      }
    } catch (error) {
      // Le player peut avoir été libéré lors du démontage du composant
      console.debug('Audio player already released');
    }
  }, []);

  // Jouer le son de sélection
  const playSelect = useCallback(() => {
    playSound('select');
  }, [playSound]);

  // Jouer le son de bonne réponse
  const playCorrect = useCallback(() => {
    playSound('correct');
  }, [playSound]);

  // Jouer le son de mauvaise réponse
  const playError = useCallback(() => {
    playSound('error');
  }, [playSound]);

  // Jouer le son de réflexion
  const playThinking = useCallback(() => {
    playSound('thinking');
  }, [playSound]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, [stopAmbient]);

  return {
    playSound,
    playSelect,
    playCorrect,
    playError,
    playThinking,
    startAmbient,
    stopAmbient,
  };
}

export default useSuitesSound;
