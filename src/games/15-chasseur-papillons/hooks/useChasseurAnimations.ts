/**
 * useChasseurAnimations - Hook pour les animations du Chasseur de Papillons
 *
 * Gère les animations Reanimated pour les transitions :
 * - Transition mode sélection → mode jeu
 * - Animation du sélecteur de niveaux
 * - Animation du panneau de progression
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

// ============================================
// CONFIGURATION
// ============================================

const ANIMATION_CONFIG = {
  /** Durée du slide du sélecteur */
  selectorSlideDuration: 400,
  /** Durée du fade du sélecteur */
  selectorFadeDuration: 300,
  /** Délai avant apparition du panneau de progression */
  progressDelayDuration: 200,
  /** Distance de slide du sélecteur */
  selectorSlideDistance: -150,
  /** Damping du spring */
  springDamping: 15,
  /** Stiffness du spring */
  springStiffness: 150,
};

// ============================================
// TYPES
// ============================================

export interface UseChasseurAnimationsReturn {
  /** Style animé pour le sélecteur de niveaux */
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  /** Style animé pour le panneau de progression */
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;
  /** Transition vers le mode jeu */
  transitionToPlayMode: () => void;
  /** Transition vers le mode sélection */
  transitionToSelectionMode: () => void;
}

// ============================================
// HOOK
// ============================================

export function useChasseurAnimations(): UseChasseurAnimationsReturn {
  // Valeurs partagées pour les animations
  const selectorY = useSharedValue(0);
  const selectorOpacity = useSharedValue(1);
  const progressPanelOpacity = useSharedValue(0);

  // Style animé du sélecteur
  const selectorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: selectorY.value }],
    opacity: selectorOpacity.value,
  }));

  // Style animé du panneau de progression
  const progressPanelStyle = useAnimatedStyle(() => ({
    opacity: progressPanelOpacity.value,
  }));

  // Transition vers le mode jeu
  const transitionToPlayMode = useCallback(() => {
    // Slide et fade out du sélecteur
    selectorY.value = withTiming(ANIMATION_CONFIG.selectorSlideDistance, {
      duration: ANIMATION_CONFIG.selectorSlideDuration,
      easing: Easing.out(Easing.quad),
    });
    selectorOpacity.value = withTiming(0, {
      duration: ANIMATION_CONFIG.selectorFadeDuration,
    });

    // Fade in du panneau de progression avec délai
    progressPanelOpacity.value = withDelay(
      ANIMATION_CONFIG.progressDelayDuration,
      withTiming(1, { duration: ANIMATION_CONFIG.selectorFadeDuration })
    );
  }, [selectorY, selectorOpacity, progressPanelOpacity]);

  // Transition vers le mode sélection
  const transitionToSelectionMode = useCallback(() => {
    // Spring back du sélecteur
    selectorY.value = withSpring(0, {
      damping: ANIMATION_CONFIG.springDamping,
      stiffness: ANIMATION_CONFIG.springStiffness,
    });
    selectorOpacity.value = withTiming(1, {
      duration: ANIMATION_CONFIG.selectorFadeDuration,
    });

    // Fade out du panneau de progression
    progressPanelOpacity.value = withTiming(0, { duration: 200 });
  }, [selectorY, selectorOpacity, progressPanelOpacity]);

  return {
    selectorStyle,
    progressPanelStyle,
    transitionToPlayMode,
    transitionToSelectionMode,
  };
}

export default useChasseurAnimations;
