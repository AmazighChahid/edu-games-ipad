/**
 * useConteurSound hook
 * Gère les effets sonores pour le jeu Conteur Curieux
 *
 * Sons disponibles:
 * - pageFlip: Son de page qui tourne (navigation histoire)
 * - correct: Son de bonne réponse
 * - error: Son de mauvaise réponse
 * - select: Son de sélection d'une option
 * - complete: Son de fin d'histoire / victoire
 * - hint: Son d'indice affiché
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

type TimeoutRef = ReturnType<typeof setTimeout> | null;

// Types de sons disponibles
type ConteurSoundName =
  | 'pageFlip'    // Tourner une page
  | 'correct'     // Bonne réponse
  | 'error'       // Mauvaise réponse
  | 'select'      // Sélection d'option
  | 'complete'    // Fin d'histoire
  | 'hint'        // Indice affiché
  | 'ambient';    // Fond sonore conte

// Fichiers audio - utilise les sons génériques existants
const CONTEUR_SOUND_FILES: Record<ConteurSoundName, AudioSource> = {
  pageFlip: require('../../../../assets/sounds/page_flip.mp3'),
  correct: require('../../../../assets/sounds/correct.mp3'),
  error: require('../../../../assets/sounds/error.mp3'),
  select: require('../../../../assets/sounds/select.mp3'),
  complete: require('../../../../assets/sounds/complete.mp3'),
  hint: require('../../../../assets/sounds/hint.mp3'),
  ambient: require('../../../../assets/sounds/story_ambient.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<ConteurSoundName, number> = {
  pageFlip: 0.5,
  correct: 0.8,
  error: 0.6,
  select: 0.5,
  complete: 0.9,
  hint: 0.6,
  ambient: 0.1, // Très faible pour le fond
};

export function useConteurSound() {
  const { soundEnabled } = useAppSettings();
  const ambientLoopRef = useRef<TimeoutRef>(null);

  // Créer les players audio
  const pageFlipPlayer = useAudioPlayer(CONTEUR_SOUND_FILES.pageFlip);
  const correctPlayer = useAudioPlayer(CONTEUR_SOUND_FILES.correct);
  const errorPlayer = useAudioPlayer(CONTEUR_SOUND_FILES.error);
  const selectPlayer = useAudioPlayer(CONTEUR_SOUND_FILES.select);
  const completePlayer = useAudioPlayer(CONTEUR_SOUND_FILES.complete);
  const hintPlayer = useAudioPlayer(CONTEUR_SOUND_FILES.hint);
  const ambientPlayer = useAudioPlayer(CONTEUR_SOUND_FILES.ambient);

  // Map des players
  const playersRef = useRef<Map<ConteurSoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['pageFlip', pageFlipPlayer],
      ['correct', correctPlayer],
      ['error', errorPlayer],
      ['select', selectPlayer],
      ['complete', completePlayer],
      ['hint', hintPlayer],
      ['ambient', ambientPlayer],
    ])
  );

  // Jouer un son
  const playSound = useCallback((name: ConteurSoundName, volumeOverride?: number) => {
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
      // Le fichier ambient fait ~30 secondes, on le relance en boucle
      ambientLoopRef.current = setTimeout(playAmbientLoop, 30000);
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

  // Jouer le son de page qui tourne
  const playPageFlip = useCallback(() => {
    playSound('pageFlip');
  }, [playSound]);

  // Jouer le son de bonne réponse
  const playCorrect = useCallback(() => {
    playSound('correct');
  }, [playSound]);

  // Jouer le son de mauvaise réponse
  const playError = useCallback(() => {
    playSound('error');
  }, [playSound]);

  // Jouer le son de sélection
  const playSelect = useCallback(() => {
    playSound('select');
  }, [playSound]);

  // Jouer le son de victoire/fin
  const playComplete = useCallback(() => {
    playSound('complete');
  }, [playSound]);

  // Jouer le son d'indice
  const playHint = useCallback(() => {
    playSound('hint');
  }, [playSound]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, [stopAmbient]);

  return {
    playSound,
    playPageFlip,
    playCorrect,
    playError,
    playSelect,
    playComplete,
    playHint,
    startAmbient,
    stopAmbient,
  };
}

export default useConteurSound;
