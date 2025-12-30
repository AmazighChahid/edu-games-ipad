/**
 * useFabriqueSound hook
 * =====================
 * Gère les effets sonores pour La Fabrique de Réactions
 *
 * Sons disponibles:
 * - select: Clic mécanique lors de la sélection
 * - place: Son de placement d'une pièce
 * - correct: Engrenages + cloche pour victoire
 * - error: Grincement mécanique pour échec
 * - gear: Son d'engrenage qui tourne
 * - bell: Tintement de cloche
 * - ambient: Fond sonore d'atelier (en boucle)
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

type TimeoutRef = ReturnType<typeof setTimeout> | null;

// Types de sons disponibles
type FabriqueSoundName =
  | 'select'    // Sélection d'un emplacement
  | 'place'     // Placement d'une pièce
  | 'correct'   // Victoire
  | 'error'     // Échec
  | 'gear'      // Engrenage
  | 'bell'      // Cloche
  | 'ambient';  // Fond sonore atelier

// Fichiers audio (on réutilise des sons existants, à remplacer par des sons spécifiques)
const FABRIQUE_SOUND_FILES: Record<FabriqueSoundName, AudioSource> = {
  select: require('../../../../assets/sounds/robot_select.mp3'),
  place: require('../../../../assets/sounds/robot_select.mp3'),
  correct: require('../../../../assets/sounds/robot_correct.mp3'),
  error: require('../../../../assets/sounds/robot_error.mp3'),
  gear: require('../../../../assets/sounds/robot_thinking.mp3'),
  bell: require('../../../../assets/sounds/robot_correct.mp3'),
  ambient: require('../../../../assets/sounds/robot_ambient.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<FabriqueSoundName, number> = {
  select: 0.5,
  place: 0.6,
  correct: 0.8,
  error: 0.7,
  gear: 0.4,
  bell: 0.7,
  ambient: 0.1,
};

export function useFabriqueSound() {
  const { soundEnabled } = useAppSettings();
  const ambientLoopRef = useRef<TimeoutRef>(null);

  // Créer les players audio
  const selectPlayer = useAudioPlayer(FABRIQUE_SOUND_FILES.select);
  const placePlayer = useAudioPlayer(FABRIQUE_SOUND_FILES.place);
  const correctPlayer = useAudioPlayer(FABRIQUE_SOUND_FILES.correct);
  const errorPlayer = useAudioPlayer(FABRIQUE_SOUND_FILES.error);
  const gearPlayer = useAudioPlayer(FABRIQUE_SOUND_FILES.gear);
  const bellPlayer = useAudioPlayer(FABRIQUE_SOUND_FILES.bell);
  const ambientPlayer = useAudioPlayer(FABRIQUE_SOUND_FILES.ambient);

  // Map des players
  const playersRef = useRef<Map<FabriqueSoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['select', selectPlayer],
      ['place', placePlayer],
      ['correct', correctPlayer],
      ['error', errorPlayer],
      ['gear', gearPlayer],
      ['bell', bellPlayer],
      ['ambient', ambientPlayer],
    ])
  );

  // Jouer un son
  const playSound = useCallback(
    (name: FabriqueSoundName, volumeOverride?: number) => {
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
    },
    [soundEnabled]
  );

  // Démarrer le fond sonore ambient en boucle
  const startAmbient = useCallback(() => {
    if (!soundEnabled) return;

    const playAmbientLoop = () => {
      playSound('ambient');
      // Relancer en boucle toutes les 10 secondes
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
      console.debug('Audio player already released');
    }
  }, []);

  // Sons spécifiques
  const playSelect = useCallback(() => playSound('select'), [playSound]);
  const playPlace = useCallback(() => playSound('place'), [playSound]);
  const playCorrect = useCallback(() => playSound('correct'), [playSound]);
  const playError = useCallback(() => playSound('error'), [playSound]);
  const playGear = useCallback(() => playSound('gear'), [playSound]);
  const playBell = useCallback(() => playSound('bell'), [playSound]);

  // Nettoyage
  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, [stopAmbient]);

  return {
    playSound,
    playSelect,
    playPlace,
    playCorrect,
    playError,
    playGear,
    playBell,
    startAmbient,
    stopAmbient,
  };
}

export default useFabriqueSound;
