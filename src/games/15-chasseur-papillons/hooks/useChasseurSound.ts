/**
 * useChasseurSound hook
 * Gère les effets sonores pour le jeu Chasseur de Papillons
 *
 * Sons disponibles:
 * - catch: Son de capture d'un papillon
 * - wrong: Son d'erreur (mauvais papillon)
 * - miss: Son de papillon qui s'échappe
 * - streak: Son de série (bonus)
 * - wave_complete: Son de fin de vague
 * - victory: Son de victoire
 * - flutter: Son d'ailes de papillon (ambiance)
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useAppSettings } from '../../../store';

type TimeoutRef = ReturnType<typeof setTimeout> | null;

// Types de sons disponibles
type ChasseurSoundName =
  | 'catch'        // Bonne capture
  | 'wrong'        // Mauvais papillon
  | 'miss'         // Papillon échappé
  | 'streak'       // Série bonus
  | 'wave_complete' // Fin de vague
  | 'victory'      // Victoire
  | 'flutter';     // Ambiance ailes

// Fichiers audio (réutilisation des sons existants du projet)
const CHASSEUR_SOUND_FILES: Record<ChasseurSoundName, AudioSource> = {
  catch: require('../../../../assets/sounds/robot_correct.mp3'),
  wrong: require('../../../../assets/sounds/robot_error.mp3'),
  miss: require('../../../../assets/sounds/disk_error.mp3'),
  streak: require('../../../../assets/sounds/hint.mp3'),
  wave_complete: require('../../../../assets/sounds/victory.mp3'),
  victory: require('../../../../assets/sounds/victory.mp3'),
  flutter: require('../../../../assets/sounds/robot_ambient.mp3'),
};

// Configuration des volumes par défaut
const DEFAULT_VOLUMES: Record<ChasseurSoundName, number> = {
  catch: 0.7,
  wrong: 0.6,
  miss: 0.4,
  streak: 0.8,
  wave_complete: 0.8,
  victory: 0.9,
  flutter: 0.15, // Très faible pour l'ambiance
};

export function useChasseurSound() {
  const { soundEnabled } = useAppSettings();
  const ambientLoopRef = useRef<TimeoutRef>(null);

  // Créer les players audio
  const catchPlayer = useAudioPlayer(CHASSEUR_SOUND_FILES.catch);
  const wrongPlayer = useAudioPlayer(CHASSEUR_SOUND_FILES.wrong);
  const missPlayer = useAudioPlayer(CHASSEUR_SOUND_FILES.miss);
  const streakPlayer = useAudioPlayer(CHASSEUR_SOUND_FILES.streak);
  const waveCompletePlayer = useAudioPlayer(CHASSEUR_SOUND_FILES.wave_complete);
  const victoryPlayer = useAudioPlayer(CHASSEUR_SOUND_FILES.victory);
  const flutterPlayer = useAudioPlayer(CHASSEUR_SOUND_FILES.flutter);

  // Map des players
  const playersRef = useRef<Map<ChasseurSoundName, ReturnType<typeof useAudioPlayer>>>(
    new Map([
      ['catch', catchPlayer],
      ['wrong', wrongPlayer],
      ['miss', missPlayer],
      ['streak', streakPlayer],
      ['wave_complete', waveCompletePlayer],
      ['victory', victoryPlayer],
      ['flutter', flutterPlayer],
    ])
  );

  // Jouer un son
  const playSound = useCallback((name: ChasseurSoundName, volumeOverride?: number) => {
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

  // Démarrer l'ambiance de fond
  const startAmbient = useCallback(() => {
    if (!soundEnabled) return;

    const playAmbientLoop = () => {
      playSound('flutter');
      // Le fichier ambient fait ~15 secondes, on le relance en boucle
      ambientLoopRef.current = setTimeout(playAmbientLoop, 15000);
    };

    playAmbientLoop();
  }, [soundEnabled, playSound]);

  // Arrêter l'ambiance
  const stopAmbient = useCallback(() => {
    if (ambientLoopRef.current) {
      clearTimeout(ambientLoopRef.current);
      ambientLoopRef.current = null;
    }

    try {
      const flutterPlayerInstance = playersRef.current.get('flutter');
      if (flutterPlayerInstance && flutterPlayerInstance.playing) {
        flutterPlayerInstance.pause();
      }
    } catch (error) {
      console.debug('Audio player already released');
    }
  }, []);

  // Raccourcis pour chaque son
  const playCatch = useCallback(() => playSound('catch'), [playSound]);
  const playWrong = useCallback(() => playSound('wrong'), [playSound]);
  const playMiss = useCallback(() => playSound('miss'), [playSound]);
  const playStreak = useCallback(() => playSound('streak'), [playSound]);
  const playWaveComplete = useCallback(() => playSound('wave_complete'), [playSound]);
  const playVictory = useCallback(() => playSound('victory'), [playSound]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, [stopAmbient]);

  return {
    playSound,
    playCatch,
    playWrong,
    playMiss,
    playStreak,
    playWaveComplete,
    playVictory,
    startAmbient,
    stopAmbient,
  };
}

export default useChasseurSound;
