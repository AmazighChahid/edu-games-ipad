/**
 * Accessibility Animations Hook
 *
 * Fournit des utilitaires pour gérer les animations de manière accessible
 * Respecte le paramètre ReduceMotion du système iOS/Android
 *
 * Usage:
 * ```typescript
 * const { shouldAnimate, animationDuration, getAnimatedValue } = useAccessibilityAnimations();
 *
 * // Dans les styles animés
 * const style = useAnimatedStyle(() => ({
 *   transform: [{ scale: shouldAnimate ? animatedScale.value : 1 }],
 * }));
 * ```
 */

import { useReducedMotion } from 'react-native-reanimated';
import { useCallback, useMemo } from 'react';
import type { WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

// ============================================================================
// TYPES
// ============================================================================

export interface AccessibilityAnimationConfig {
  /** Durée de l'animation en ms (0 si reduced motion) */
  duration: number;
  /** Configuration spring accessible */
  springConfig: WithSpringConfig;
  /** Configuration timing accessible */
  timingConfig: WithTimingConfig;
  /** Si les animations sont désactivées */
  isReduced: boolean;
  /** Durée instantanée pour les transitions */
  instant: number;
}

export interface AnimationOverrides {
  /** Force une durée spécifique */
  forceDuration?: number;
  /** Multiplicateur de durée (0.5 = 50% plus rapide) */
  durationMultiplier?: number;
  /** Ignore ReduceMotion (utilisé avec parcimonie) */
  ignoreReducedMotion?: boolean;
}

// ============================================================================
// CONFIGURATION PAR DÉFAUT
// ============================================================================

/**
 * Configuration spring par défaut (naturelle et fluide)
 */
const DEFAULT_SPRING_CONFIG: WithSpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/**
 * Configuration spring réduite (plus rapide, moins de rebond)
 */
const REDUCED_SPRING_CONFIG: WithSpringConfig = {
  damping: 50,
  stiffness: 500,
  mass: 0.5,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
};

/**
 * Configuration timing par défaut
 */
const DEFAULT_TIMING_CONFIG: WithTimingConfig = {
  duration: 300,
};

/**
 * Configuration timing instantanée
 */
const INSTANT_TIMING_CONFIG: WithTimingConfig = {
  duration: 0,
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook pour gérer les animations accessibles
 *
 * @returns Configuration d'animation adaptée aux préférences système
 */
export function useAccessibilityAnimations(): {
  /** Si les animations doivent être jouées */
  shouldAnimate: boolean;
  /** Durée recommandée (0 si reduced motion) */
  animationDuration: number;
  /** Configuration spring adaptée */
  springConfig: WithSpringConfig;
  /** Configuration timing adaptée */
  timingConfig: WithTimingConfig;
  /** Obtient une valeur animée ou statique selon ReduceMotion */
  getAnimatedValue: <T>(animated: T, static_: T) => T;
  /** Obtient une durée adaptée */
  getDuration: (defaultDuration: number, overrides?: AnimationOverrides) => number;
  /** Configuration complète */
  config: AccessibilityAnimationConfig;
} {
  const reducedMotion = useReducedMotion();

  // Mémoriser la configuration pour éviter re-renders
  const config = useMemo<AccessibilityAnimationConfig>(() => {
    const isReduced = reducedMotion ?? false;

    return {
      duration: isReduced ? 0 : 300,
      springConfig: isReduced ? REDUCED_SPRING_CONFIG : DEFAULT_SPRING_CONFIG,
      timingConfig: isReduced ? INSTANT_TIMING_CONFIG : DEFAULT_TIMING_CONFIG,
      isReduced,
      instant: 0,
    };
  }, [reducedMotion]);

  // Fonction pour obtenir valeur animée ou statique
  const getAnimatedValue = useCallback(
    <T>(animated: T, static_: T): T => {
      return config.isReduced ? static_ : animated;
    },
    [config.isReduced]
  );

  // Fonction pour obtenir durée adaptée
  const getDuration = useCallback(
    (defaultDuration: number, overrides?: AnimationOverrides): number => {
      if (overrides?.ignoreReducedMotion) {
        return overrides.forceDuration ?? defaultDuration;
      }

      if (config.isReduced) {
        return 0;
      }

      let duration = overrides?.forceDuration ?? defaultDuration;

      if (overrides?.durationMultiplier) {
        duration *= overrides.durationMultiplier;
      }

      return duration;
    },
    [config.isReduced]
  );

  return {
    shouldAnimate: !config.isReduced,
    animationDuration: config.duration,
    springConfig: config.springConfig,
    timingConfig: config.timingConfig,
    getAnimatedValue,
    getDuration,
    config,
  };
}

// ============================================================================
// HOOKS SPÉCIALISÉS
// ============================================================================

/**
 * Hook pour animations de feedback (succès, erreur)
 */
export function useFeedbackAnimation(): {
  /** Durée du shake */
  shakeDuration: number;
  /** Durée du pulse */
  pulseDuration: number;
  /** Durée du bounce */
  bounceDuration: number;
  /** Si le feedback doit être animé */
  shouldAnimate: boolean;
} {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  return {
    shakeDuration: getDuration(400),
    pulseDuration: getDuration(300),
    bounceDuration: getDuration(500),
    shouldAnimate,
  };
}

/**
 * Hook pour animations de jeu (drag, drop, transitions)
 */
export function useGameAnimations(): {
  /** Durée de drag */
  dragDuration: number;
  /** Durée de snap (placement) */
  snapDuration: number;
  /** Durée de transition de niveau */
  levelTransitionDuration: number;
  /** Config spring pour drag */
  dragSpringConfig: WithSpringConfig;
  /** Si les animations sont activées */
  shouldAnimate: boolean;
} {
  const { shouldAnimate, getDuration, springConfig } = useAccessibilityAnimations();

  return {
    dragDuration: getDuration(100),
    snapDuration: getDuration(200),
    levelTransitionDuration: getDuration(500),
    dragSpringConfig: springConfig,
    shouldAnimate,
  };
}

/**
 * Hook pour animations de la mascotte
 */
export function useMascotAnimations(): {
  /** Durée du blink */
  blinkDuration: number;
  /** Durée du wave */
  waveDuration: number;
  /** Durée du bounce */
  bounceDuration: number;
  /** Intervalle entre blinks */
  blinkInterval: number;
  /** Si les animations sont activées */
  shouldAnimate: boolean;
} {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  return {
    blinkDuration: getDuration(150),
    waveDuration: getDuration(800),
    bounceDuration: getDuration(600),
    blinkInterval: shouldAnimate ? 3000 : 0,
    shouldAnimate,
  };
}

/**
 * Hook pour animations de background (soleil, nuages, fleurs)
 */
export function useBackgroundAnimations(): {
  /** Durée de rotation du soleil */
  sunRotationDuration: number;
  /** Durée de mouvement des nuages */
  cloudDuration: number;
  /** Durée de balancement des fleurs */
  flowerSwayDuration: number;
  /** Si les animations décoratives sont activées */
  shouldAnimate: boolean;
  /** Délai entre les animations (0 si reduced) */
  staggerDelay: number;
} {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  return {
    sunRotationDuration: getDuration(20000),
    cloudDuration: getDuration(60000),
    flowerSwayDuration: getDuration(2000),
    shouldAnimate,
    staggerDelay: shouldAnimate ? 200 : 0,
  };
}

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Crée une configuration spring adaptée
 */
export function createAccessibleSpring(
  isReduced: boolean,
  customConfig?: Partial<WithSpringConfig>
): WithSpringConfig {
  const baseConfig = isReduced ? REDUCED_SPRING_CONFIG : DEFAULT_SPRING_CONFIG;
  return { ...baseConfig, ...customConfig };
}

/**
 * Crée une configuration timing adaptée
 */
export function createAccessibleTiming(
  isReduced: boolean,
  duration: number
): WithTimingConfig {
  return {
    duration: isReduced ? 0 : duration,
  };
}

