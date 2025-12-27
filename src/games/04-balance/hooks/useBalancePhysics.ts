/**
 * Balance Physics Hook
 * Provides realistic spring-based physics animation for the balance scale
 * Uses react-native-reanimated for smooth 60fps animations
 */

import { useEffect, useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  interpolate,
  Extrapolation,
  runOnJS,
  useDerivedValue,
  SharedValue,
  cancelAnimation,
} from 'react-native-reanimated';
import { BALANCE_CONFIG } from '../types';

// ============================================
// TYPES
// ============================================

export interface BalancePhysicsConfig {
  /** Maximum tilt angle in degrees */
  maxAngle: number;
  /** Weight difference sensitivity (weight per degree) */
  sensitivity: number;
  /** Tolerance for considering balance "balanced" */
  tolerance: number;
  /** Spring animation config */
  spring: {
    damping: number;
    stiffness: number;
    mass: number;
  };
  /** Enable oscillation effect when object is dropped */
  enableDropOscillation: boolean;
  /** Enable celebration bounce when balanced */
  enableBalanceBounce: boolean;
}

export interface BalancePhysicsState {
  leftWeight: number;
  rightWeight: number;
  isBalanced: boolean;
}

export interface UseBalancePhysicsReturn {
  /** Current animated angle (shared value) */
  angle: SharedValue<number>;
  /** Animated style for the beam rotation */
  beamAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  /** Animated style for left plate vertical offset */
  leftPlateAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  /** Animated style for right plate vertical offset */
  rightPlateAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  /** Trigger drop animation (oscillation effect) */
  triggerDropAnimation: (side: 'left' | 'right') => void;
  /** Trigger victory celebration animation */
  triggerVictoryAnimation: () => void;
  /** Current computed angle value */
  computedAngle: number;
  /** Whether the balance is currently animating */
  isAnimating: SharedValue<boolean>;
}

// ============================================
// DEFAULT CONFIG
// ============================================

const DEFAULT_CONFIG: BalancePhysicsConfig = {
  maxAngle: BALANCE_CONFIG.maxAngle,
  sensitivity: BALANCE_CONFIG.sensitivity,
  tolerance: BALANCE_CONFIG.balanceTolerance,
  spring: BALANCE_CONFIG.springConfig,
  enableDropOscillation: true,
  enableBalanceBounce: true,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate the angle based on weight difference
 * Negative = tilted left (left is heavier)
 * Positive = tilted right (right is heavier)
 */
function calculateAngle(
  leftWeight: number,
  rightWeight: number,
  config: BalancePhysicsConfig
): number {
  'worklet';
  const diff = leftWeight - rightWeight;
  const rawAngle = -diff * config.sensitivity;

  // Clamp to max angle
  return Math.max(-config.maxAngle, Math.min(config.maxAngle, rawAngle));
}

/**
 * Check if weights are balanced within tolerance
 */
function checkBalanced(
  leftWeight: number,
  rightWeight: number,
  tolerance: number
): boolean {
  'worklet';
  return Math.abs(leftWeight - rightWeight) <= tolerance;
}

// ============================================
// MAIN HOOK
// ============================================

export function useBalancePhysics(
  state: BalancePhysicsState,
  config: Partial<BalancePhysicsConfig> = {},
  onBalanced?: () => void
): UseBalancePhysicsReturn {
  // Merge config with defaults
  const fullConfig: BalancePhysicsConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    spring: { ...DEFAULT_CONFIG.spring, ...config.spring },
  };

  // Shared values for animations
  const angle = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  const dropBounce = useSharedValue(0);
  const victoryScale = useSharedValue(1);
  const leftPlateOffset = useSharedValue(0);
  const rightPlateOffset = useSharedValue(0);

  // Compute target angle from state
  const targetAngle = calculateAngle(
    state.leftWeight,
    state.rightWeight,
    fullConfig
  );

  // Update angle when state changes
  useEffect(() => {
    const springConfig = {
      damping: fullConfig.spring.damping,
      stiffness: fullConfig.spring.stiffness,
      mass: fullConfig.spring.mass,
    };

    isAnimating.value = true;

    // Animate to new angle with spring physics
    angle.value = withSpring(targetAngle, springConfig, (finished) => {
      if (finished) {
        isAnimating.value = false;

        // Check if balanced and trigger callback
        if (state.isBalanced && onBalanced) {
          runOnJS(onBalanced)();
        }
      }
    });
  }, [state.leftWeight, state.rightWeight, targetAngle]);

  // Trigger drop oscillation animation
  const triggerDropAnimation = useCallback((side: 'left' | 'right') => {
    if (!fullConfig.enableDropOscillation) return;

    const plateOffset = side === 'left' ? leftPlateOffset : rightPlateOffset;

    // Small bounce effect when object is dropped
    plateOffset.value = withSequence(
      withTiming(8, { duration: 80 }),
      withSpring(0, {
        damping: 8,
        stiffness: 300,
        mass: 0.5,
      })
    );

    // Add extra wobble to the beam
    dropBounce.value = withSequence(
      withTiming(side === 'left' ? -3 : 3, { duration: 50 }),
      withSpring(0, {
        damping: 10,
        stiffness: 200,
      })
    );
  }, [fullConfig.enableDropOscillation]);

  // Trigger victory celebration animation
  const triggerVictoryAnimation = useCallback(() => {
    if (!fullConfig.enableBalanceBounce) return;

    // Celebration bounce sequence
    victoryScale.value = withSequence(
      withTiming(1.05, { duration: 150 }),
      withSpring(1, {
        damping: 8,
        stiffness: 200,
      })
    );

    // Slight beam wobble for celebration
    dropBounce.value = withSequence(
      withDelay(100, withTiming(2, { duration: 100 })),
      withTiming(-2, { duration: 100 }),
      withSpring(0, {
        damping: 15,
        stiffness: 150,
      })
    );
  }, [fullConfig.enableBalanceBounce]);

  // Beam animated style (rotation)
  const beamAnimatedStyle = useAnimatedStyle(() => {
    const totalAngle = angle.value + dropBounce.value;

    return {
      transform: [
        { rotate: `${totalAngle}deg` },
        { scale: victoryScale.value },
      ],
    };
  });

  // Left plate animated style (vertical offset based on angle + drop bounce)
  const leftPlateAnimatedStyle = useAnimatedStyle(() => {
    // Calculate vertical offset based on angle
    // When tilted left (negative angle), left plate goes down
    const angleOffset = interpolate(
      angle.value + dropBounce.value,
      [-fullConfig.maxAngle, 0, fullConfig.maxAngle],
      [30, 0, -30],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY: angleOffset + leftPlateOffset.value },
      ],
    };
  });

  // Right plate animated style (vertical offset based on angle + drop bounce)
  const rightPlateAnimatedStyle = useAnimatedStyle(() => {
    // Calculate vertical offset based on angle
    // When tilted right (positive angle), right plate goes down
    const angleOffset = interpolate(
      angle.value + dropBounce.value,
      [-fullConfig.maxAngle, 0, fullConfig.maxAngle],
      [-30, 0, 30],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY: angleOffset + rightPlateOffset.value },
      ],
    };
  });

  return {
    angle,
    beamAnimatedStyle,
    leftPlateAnimatedStyle,
    rightPlateAnimatedStyle,
    triggerDropAnimation,
    triggerVictoryAnimation,
    computedAngle: targetAngle,
    isAnimating,
  };
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook for plate swing animation when dragging over
 */
export function usePlateHoverAnimation() {
  const hoverScale = useSharedValue(1);
  const hoverGlow = useSharedValue(0);

  const startHover = useCallback(() => {
    hoverScale.value = withSpring(1.05, {
      damping: 15,
      stiffness: 300,
    });
    hoverGlow.value = withTiming(1, { duration: 200 });
  }, []);

  const endHover = useCallback(() => {
    hoverScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    hoverGlow.value = withTiming(0, { duration: 200 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(hoverGlow.value, [0, 1], [0, 0.4]);
    const radius = interpolate(hoverGlow.value, [0, 1], [0, 12]);
    return {
      transform: [{ scale: hoverScale.value }],
      boxShadow: `0px 0px ${radius}px rgba(0, 0, 0, ${opacity})`,
    };
  });

  return {
    startHover,
    endHover,
    animatedStyle,
  };
}

/**
 * Hook for object bounce animation when placed
 */
export function useObjectPlacementAnimation() {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-10);

  const triggerPlacement = useCallback(() => {
    // Reset
    scale.value = 0;
    rotation.value = -10;

    // Animate in with bounce
    scale.value = withSpring(1, {
      damping: 8,
      stiffness: 200,
      mass: 0.8,
    });
    rotation.value = withSequence(
      withSpring(5, { damping: 10, stiffness: 300 }),
      withSpring(0, { damping: 12, stiffness: 200 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: scale.value,
  }));

  return {
    triggerPlacement,
    animatedStyle,
  };
}

/**
 * Hook for victory celebration particles effect
 * Returns positions for confetti-like elements
 */
export function useVictoryCelebration() {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    x: useSharedValue(0),
    y: useSharedValue(0),
    scale: useSharedValue(0),
    rotation: useSharedValue(0),
    opacity: useSharedValue(0),
  }));

  const triggerCelebration = useCallback(() => {
    particles.forEach((particle, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 80 + Math.random() * 40;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;
      const delay = i * 50;

      particle.opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));
      particle.scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 200 }),
          withTiming(0, { duration: 400 })
        )
      );
      particle.x.value = withDelay(
        delay,
        withSpring(targetX, { damping: 12, stiffness: 80 })
      );
      particle.y.value = withDelay(
        delay,
        withSpring(targetY - 20, { damping: 12, stiffness: 80 })
      );
      particle.rotation.value = withDelay(
        delay,
        withTiming(360 + Math.random() * 180, { duration: 600 })
      );
    });
  }, []);

  const particleStyles = particles.map((particle) =>
    useAnimatedStyle(() => ({
      transform: [
        { translateX: particle.x.value },
        { translateY: particle.y.value },
        { scale: particle.scale.value },
        { rotate: `${particle.rotation.value}deg` },
      ],
      opacity: particle.opacity.value,
    }))
  );

  return {
    triggerCelebration,
    particleStyles,
  };
}
