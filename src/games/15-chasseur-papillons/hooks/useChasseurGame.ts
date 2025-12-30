/**
 * useChasseurGame Hook
 * Logique de jeu pure pour le Chasseur de Papillons
 *
 * Responsabilités :
 * - Gestion de l'état du jeu (score, vagues, papillons)
 * - Génération des papillons
 * - Vérification des captures
 * - Gestion du timer et des vagues
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type {
  ChasseurGameState,
  ChasseurSessionState,
  ChasseurLevel,
  GameRule,
  Butterfly,
  ButterflyColor,
  ButterflyPattern,
  ButterflySize,
  ButterflyWingShape,
  GameStatus,
} from '../types';
import { chasseurLevels, getLevelByOrder, matchesRule, getRandomRuleForLevel } from '../data/levels';

// ============================================
// CONFIGURATION
// ============================================

const GAME_CONFIG = {
  /** Points par bonne capture */
  pointsPerCatch: 100,
  /** Points bonus par élément de streak */
  streakBonus: 25,
  /** Pénalité pour mauvaise capture */
  wrongCatchPenalty: 50,
  /** Intervalle de mise à jour du jeu (ms) */
  updateInterval: 50,
  /** Intervalle d'apparition des papillons (ms) */
  spawnInterval: 2000,
  /** Délai avant disparition d'un papillon (ms) */
  butterflyLifetime: 8000,
};

// ============================================
// GÉNÉRATEUR DE PAPILLONS
// ============================================

function generateId(): string {
  return `butterfly_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateButterfly(
  level: ChasseurLevel,
  rule: GameRule,
  isTarget: boolean,
  spawnTime: number
): Butterfly {
  let color: ButterflyColor;
  let pattern: ButterflyPattern;
  let size: ButterflySize;

  if (isTarget) {
    // Génère un papillon qui correspond à la règle
    switch (rule.type) {
      case 'color':
        color = rule.values[0] as ButterflyColor;
        pattern = getRandomElement(level.availablePatterns);
        size = getRandomElement(level.availableSizes);
        break;

      case 'pattern':
        color = getRandomElement(level.availableColors);
        pattern = rule.values[0] as ButterflyPattern;
        size = getRandomElement(level.availableSizes);
        break;

      case 'size':
        color = getRandomElement(level.availableColors);
        pattern = getRandomElement(level.availablePatterns);
        size = rule.values[0] as ButterflySize;
        break;

      case 'two_colors':
        color = getRandomElement(rule.values) as ButterflyColor;
        pattern = getRandomElement(level.availablePatterns);
        size = getRandomElement(level.availableSizes);
        break;

      case 'color_and_size':
        color = rule.values[0] as ButterflyColor;
        pattern = getRandomElement(level.availablePatterns);
        size = rule.values[1] as ButterflySize;
        break;

      case 'not_color':
        // Génère une couleur différente de celle exclue
        const excludedColor = rule.values[0] as ButterflyColor;
        const validColors = level.availableColors.filter((c) => c !== excludedColor);
        color = getRandomElement(validColors);
        pattern = getRandomElement(level.availablePatterns);
        size = getRandomElement(level.availableSizes);
        break;

      default:
        color = getRandomElement(level.availableColors);
        pattern = getRandomElement(level.availablePatterns);
        size = getRandomElement(level.availableSizes);
    }
  } else {
    // Génère un distracteur (ne correspond PAS à la règle)
    let attempts = 0;
    do {
      color = getRandomElement(level.availableColors);
      pattern = getRandomElement(level.availablePatterns);
      size = getRandomElement(level.availableSizes);
      attempts++;
    } while (matchesRule({ color, pattern, size }, rule) && attempts < 10);
  }

  const wingShapes: ButterflyWingShape[] = ['round', 'pointed', 'wavy'];
  const speed = level.butterflySpeed;

  // Position de départ sur les bords
  const startSide = Math.floor(Math.random() * 4);
  let x: number, y: number, velocityX: number, velocityY: number;

  switch (startSide) {
    case 0: // Gauche
      x = -5;
      y = 20 + Math.random() * 60;
      velocityX = (0.3 + Math.random() * 0.4) * speed;
      velocityY = (Math.random() - 0.5) * 0.3 * speed;
      break;
    case 1: // Droite
      x = 105;
      y = 20 + Math.random() * 60;
      velocityX = -(0.3 + Math.random() * 0.4) * speed;
      velocityY = (Math.random() - 0.5) * 0.3 * speed;
      break;
    case 2: // Haut
      x = 20 + Math.random() * 60;
      y = -5;
      velocityX = (Math.random() - 0.5) * 0.3 * speed;
      velocityY = (0.3 + Math.random() * 0.4) * speed;
      break;
    default: // Bas
      x = 20 + Math.random() * 60;
      y = 105;
      velocityX = (Math.random() - 0.5) * 0.3 * speed;
      velocityY = -(0.3 + Math.random() * 0.4) * speed;
  }

  return {
    id: generateId(),
    color,
    pattern,
    size,
    wingShape: getRandomElement(wingShapes),
    x,
    y,
    velocityX,
    velocityY,
    rotation: Math.random() * 360,
    isTarget,
    isCaught: false,
    spawnTime,
  };
}

// ============================================
// HOOK PRINCIPAL
// ============================================

interface UseChasseurGameProps {
  initialLevel?: number;
}

export function useChasseurGame({ initialLevel = 1 }: UseChasseurGameProps = {}) {
  // ============================================
  // ÉTAT DU JEU
  // ============================================

  const [gameState, setGameState] = useState<ChasseurGameState>({
    level: null,
    currentWave: 0,
    currentRule: null,
    butterflies: [],
    score: 0,
    targetsCaught: 0,
    targetsMissed: 0,
    wrongCatches: 0,
    streak: 0,
    bestStreak: 0,
    status: 'idle',
    timeRemaining: 0,
    hintsUsed: 0,
    currentHintLevel: 0,
  });

  // ============================================
  // ÉTAT DE SESSION
  // ============================================

  const [sessionState, setSessionState] = useState<ChasseurSessionState>({
    levelId: '',
    startTime: new Date(),
    wavesCompleted: 0,
    totalTargetsCaught: 0,
    totalTargetsMissed: 0,
    totalWrongCatches: 0,
    sessionBestStreak: 0,
    sessionScore: 0,
    totalHints: 0,
    currentLevel: initialLevel,
  });

  // ============================================
  // REFS POUR LES INTERVALLES ET ANIMATION
  // ============================================

  const animationFrameRef = useRef<number | null>(null);
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveStartTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const missedTargetsRef = useRef<Set<string>>(new Set());

  // ============================================
  // NIVEAU ACTUEL
  // ============================================

  const currentLevelInfo = useMemo(() => {
    return getLevelByOrder(sessionState.currentLevel);
  }, [sessionState.currentLevel]);

  const maxHintsForLevel = currentLevelInfo?.hintsAvailable ?? 3;

  // ============================================
  // STATISTIQUES
  // ============================================

  const accuracy = useMemo(() => {
    const totalAttempts = gameState.targetsCaught + gameState.wrongCatches;
    if (totalAttempts === 0) return 1;
    return gameState.targetsCaught / totalAttempts;
  }, [gameState.targetsCaught, gameState.wrongCatches]);

  const isWaveComplete = useMemo(() => {
    if (!gameState.level) return false;
    return gameState.timeRemaining <= 0;
  }, [gameState.level, gameState.timeRemaining]);

  const isLevelComplete = useMemo(() => {
    if (!gameState.level) return false;
    return gameState.currentWave >= gameState.level.totalWaves && isWaveComplete;
  }, [gameState.level, gameState.currentWave, isWaveComplete]);

  // ============================================
  // INITIALISATION DU NIVEAU
  // ============================================

  const initLevel = useCallback((levelNumber: number) => {
    const level = getLevelByOrder(levelNumber);
    if (!level) return;

    const rule = getRandomRuleForLevel(level.id);
    if (!rule) return;

    setGameState({
      level,
      currentWave: 1,
      currentRule: rule,
      butterflies: [],
      score: 0,
      targetsCaught: 0,
      targetsMissed: 0,
      wrongCatches: 0,
      streak: 0,
      bestStreak: 0,
      status: 'idle',
      timeRemaining: level.waveDuration * 1000,
      hintsUsed: 0,
      currentHintLevel: 0,
    });

    setSessionState((prev) => ({
      ...prev,
      levelId: level.id,
      startTime: new Date(),
      currentLevel: levelNumber,
    }));
  }, []);

  // ============================================
  // DÉMARRAGE DE VAGUE
  // ============================================

  const startWave = useCallback(() => {
    if (!gameState.level || !gameState.currentRule) return;

    const now = Date.now();
    waveStartTimeRef.current = now;
    lastUpdateTimeRef.current = now;
    missedTargetsRef.current.clear();

    setGameState((prev) => ({
      ...prev,
      status: 'playing',
      butterflies: [],
      timeRemaining: prev.level!.waveDuration * 1000,
    }));

    // Game loop optimisé avec requestAnimationFrame
    const gameLoop = (timestamp: number) => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTimeRef.current;

      // Throttle à ~60fps (16ms) pour éviter les updates trop fréquentes
      if (deltaTime < 16) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      lastUpdateTimeRef.current = now;

      setGameState((prev) => {
        if (prev.status !== 'playing') return prev;

        const elapsed = now - waveStartTimeRef.current;
        const newTimeRemaining = Math.max(0, prev.level!.waveDuration * 1000 - elapsed);

        // Facteur de normalisation pour le mouvement (basé sur deltaTime)
        const movementFactor = deltaTime / 50; // Normaliser par rapport à 50ms

        // Collecter les papillons manqués pour mise à jour batch
        let newMissedCount = 0;

        // Mise à jour des positions des papillons
        const updatedButterflies = prev.butterflies
          .filter((b) => !b.isCaught)
          .map((b) => ({
            ...b,
            x: b.x + b.velocityX * movementFactor,
            y: b.y + b.velocityY * movementFactor,
            rotation: b.rotation + 2 * movementFactor,
          }))
          .filter((b) => {
            // Supprimer les papillons hors écran
            const isOnScreen = b.x > -10 && b.x < 110 && b.y > -10 && b.y < 110;
            if (!isOnScreen && b.isTarget && !b.isCaught) {
              // Éviter de compter plusieurs fois le même papillon
              if (!missedTargetsRef.current.has(b.id)) {
                missedTargetsRef.current.add(b.id);
                newMissedCount++;
              }
            }
            return isOnScreen;
          });

        // Appliquer les papillons manqués en une seule mise à jour
        const updatedState = {
          ...prev,
          butterflies: updatedButterflies,
          timeRemaining: newTimeRemaining,
          status: newTimeRemaining <= 0 ? 'wave_complete' as const : 'playing' as const,
        };

        if (newMissedCount > 0) {
          updatedState.targetsMissed = prev.targetsMissed + newMissedCount;
          updatedState.streak = 0;
        }

        return updatedState;
      });

      // Continuer la boucle si le jeu est actif
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Démarrer la boucle de jeu
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Spawner des papillons
    const spawnButterfly = () => {
      setGameState((prev) => {
        if (prev.status !== 'playing' || !prev.level || !prev.currentRule) return prev;

        const elapsed = Date.now() - waveStartTimeRef.current;
        const isTarget = Math.random() > prev.level.distractorRatio;
        const newButterfly = generateButterfly(prev.level, prev.currentRule, isTarget, elapsed);

        return {
          ...prev,
          butterflies: [...prev.butterflies, newButterfly],
        };
      });
    };

    // Premier papillon immédiatement
    spawnButterfly();

    // Puis à intervalle régulier
    const baseInterval = GAME_CONFIG.spawnInterval / (gameState.level?.butterflySpeed || 1);
    spawnIntervalRef.current = setInterval(spawnButterfly, baseInterval);
  }, [gameState.level, gameState.currentRule]);

  // ============================================
  // ARRÊT DES INTERVALLES
  // ============================================

  const stopIntervals = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
  }, []);

  // ============================================
  // ATTRAPER UN PAPILLON
  // ============================================

  const catchButterfly = useCallback(
    (butterflyId: string) => {
      setGameState((prev) => {
        const butterfly = prev.butterflies.find((b) => b.id === butterflyId);
        if (!butterfly || butterfly.isCaught) return prev;

        const updatedButterflies = prev.butterflies.map((b) =>
          b.id === butterflyId ? { ...b, isCaught: true } : b
        );

        if (butterfly.isTarget) {
          // Bonne capture !
          const newStreak = prev.streak + 1;
          const streakBonus = Math.floor(newStreak / 3) * GAME_CONFIG.streakBonus;
          const points = GAME_CONFIG.pointsPerCatch + streakBonus;

          return {
            ...prev,
            butterflies: updatedButterflies,
            targetsCaught: prev.targetsCaught + 1,
            score: prev.score + points,
            streak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak),
          };
        } else {
          // Mauvaise capture
          return {
            ...prev,
            butterflies: updatedButterflies,
            wrongCatches: prev.wrongCatches + 1,
            score: Math.max(0, prev.score - GAME_CONFIG.wrongCatchPenalty),
            streak: 0,
          };
        }
      });
    },
    []
  );

  // ============================================
  // PASSER À LA VAGUE SUIVANTE
  // ============================================

  const nextWave = useCallback(() => {
    stopIntervals();

    setGameState((prev) => {
      if (!prev.level) return prev;

      const newWave = prev.currentWave + 1;
      const isComplete = newWave > prev.level.totalWaves;

      if (isComplete) {
        return {
          ...prev,
          status: 'victory',
        };
      }

      // Nouvelle règle pour la nouvelle vague
      const newRule = getRandomRuleForLevel(prev.level.id);

      return {
        ...prev,
        currentWave: newWave,
        currentRule: newRule || prev.currentRule,
        butterflies: [],
        status: 'idle',
        timeRemaining: prev.level.waveDuration * 1000,
      };
    });

    setSessionState((prev) => ({
      ...prev,
      wavesCompleted: prev.wavesCompleted + 1,
    }));
  }, [stopIntervals]);

  // ============================================
  // DEMANDER UN INDICE
  // ============================================

  const requestHint = useCallback(() => {
    if (gameState.hintsUsed >= maxHintsForLevel) return;
    if (gameState.currentHintLevel >= 3) return;

    setGameState((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      currentHintLevel: Math.min(prev.currentHintLevel + 1, 3) as 0 | 1 | 2 | 3,
    }));

    setSessionState((prev) => ({
      ...prev,
      totalHints: prev.totalHints + 1,
    }));
  }, [gameState.hintsUsed, gameState.currentHintLevel, maxHintsForLevel]);

  // ============================================
  // PAUSE / REPRISE
  // ============================================

  const pauseGame = useCallback(() => {
    stopIntervals();
    setGameState((prev) => ({ ...prev, status: 'paused' }));
  }, [stopIntervals]);

  const resumeGame = useCallback(() => {
    if (gameState.status === 'paused') {
      waveStartTimeRef.current = Date.now() - (gameState.level!.waveDuration * 1000 - gameState.timeRemaining);
      setGameState((prev) => ({ ...prev, status: 'playing' }));
      startWave();
    }
  }, [gameState.status, gameState.level, gameState.timeRemaining, startWave]);

  // ============================================
  // RESET
  // ============================================

  const resetGame = useCallback(() => {
    stopIntervals();
    initLevel(sessionState.currentLevel);
  }, [stopIntervals, initLevel, sessionState.currentLevel]);

  // ============================================
  // CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      stopIntervals();
    };
  }, [stopIntervals]);

  // ============================================
  // EFFET DE FIN DE VAGUE
  // ============================================

  useEffect(() => {
    if (gameState.status === 'wave_complete') {
      stopIntervals();
    }
  }, [gameState.status, stopIntervals]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // État
    gameState,
    sessionState,
    currentLevelInfo,

    // Statistiques
    accuracy,
    isWaveComplete,
    isLevelComplete,
    maxHintsForLevel,
    hintsRemaining: maxHintsForLevel - gameState.hintsUsed,

    // Actions
    initLevel,
    startWave,
    catchButterfly,
    nextWave,
    requestHint,
    pauseGame,
    resumeGame,
    resetGame,
  };
}

export default useChasseurGame;
