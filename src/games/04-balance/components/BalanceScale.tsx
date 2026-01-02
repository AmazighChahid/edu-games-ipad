/**
 * Balance Scale Component
 * Enhanced animated balance with realistic physics and visual effects
 * Designed for children 6-10 years with large touch targets
 */

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../../../theme';
import type { BalanceState, PlacedObject, WeightObject } from '../types';
import { useBalancePhysics, useVictoryCelebration } from '../hooks/useBalancePhysics';

// ============================================
// TYPES
// ============================================

interface BalanceScaleProps {
  balanceState: BalanceState;
  leftPlateContent?: React.ReactNode;
  rightPlateContent?: React.ReactNode;
  showWeightIndicators?: boolean;
  showDebugInfo?: boolean;
  onVictory?: () => void;
  isInteractive?: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const BEAM_WIDTH = 420;
const BEAM_HEIGHT = 18;
const PLATE_SIZE = 150;
const SUPPORT_HEIGHT = 100;
const ROPE_HEIGHT = 70;
const FULCRUM_SIZE = 50;

// Balance color palette
const BALANCE_COLORS = {
  beam: {
    primary: '#8B4513',     // Saddle brown
    secondary: '#A0522D',    // Sienna
    highlight: '#CD853F',    // Peru
  },
  plate: {
    background: '#DEB887',   // Burlywood
    border: '#8B4513',       // Saddle brown
    balanced: colors.feedback.success,
    glow: 'rgba(72, 187, 120, 0.4)',
  },
  support: {
    primary: '#6B4423',      // Dark wood
    secondary: '#8B5A2B',    // Lighter wood
  },
  rope: '#D2691E',           // Chocolate brown
  fulcrum: '#FFD700',        // Gold
};

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Plate component with drop zone styling
 */
interface PlateProps {
  side: 'left' | 'right';
  isBalanced: boolean;
  totalWeight: number;
  showWeight: boolean;
  children?: React.ReactNode;
  animatedStyle?: ReturnType<typeof useAnimatedStyle>;
}

function Plate({
  side,
  isBalanced,
  totalWeight,
  showWeight,
  children,
  animatedStyle,
}: PlateProps) {
  return (
    <Animated.View
      style={[
        styles.plateWrapper,
        side === 'left' ? styles.plateLeft : styles.plateRight,
        animatedStyle,
      ] as unknown as StyleProp<ViewStyle>}
    >
      {/* Rope/Chain */}
      <View style={styles.ropeContainer}>
        <View style={styles.rope} />
        <View style={styles.ropeKnot} />
      </View>

      {/* Plate */}
      <View
        style={[
          styles.plate,
          isBalanced && styles.plateBalanced,
        ]}
      >
        {/* Inner plate gradient for depth */}
        <View style={styles.plateInner}>
          {/* Content area */}
          <View style={styles.plateContent}>
            {children}
          </View>

          {/* Weight indicator */}
          {showWeight && totalWeight > 0 && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={styles.weightIndicator}
            >
              <Text style={styles.weightText}>{totalWeight}</Text>
            </Animated.View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

/**
 * Victory particle effect
 */
function VictoryParticles({ show }: { show: boolean }) {
  const { triggerCelebration, particleStyles } = useVictoryCelebration();

  useEffect(() => {
    if (show) {
      triggerCelebration();
    }
  }, [show, triggerCelebration]);

  if (!show) return null;

  const emojis = ['⭐', '✨', '🌟', '💫', '⚡', '🎉', '🎊', '⚖️'];

  return (
    <View style={styles.particlesContainer}>
      {particleStyles.map((style, index) => (
        <Animated.Text
          key={`particle-${index}`}
          style={[styles.particle, style]}
        >
          {emojis[index]}
        </Animated.Text>
      ))}
    </View>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function BalanceScale({
  balanceState,
  leftPlateContent,
  rightPlateContent,
  showWeightIndicators = false,
  showDebugInfo = false,
  onVictory,
  isInteractive = true,
}: BalanceScaleProps) {
  const {
    beamAnimatedStyle,
    leftPlateAnimatedStyle,
    rightPlateAnimatedStyle,
    triggerVictoryAnimation,
    isAnimating,
  } = useBalancePhysics(
    {
      leftWeight: balanceState.leftPlate.totalWeight,
      rightWeight: balanceState.rightPlate.totalWeight,
      isBalanced: balanceState.isBalanced,
    },
    {},
    onVictory
  );

  // Trigger victory animation when balanced
  useEffect(() => {
    if (balanceState.isBalanced) {
      triggerVictoryAnimation();
    }
  }, [balanceState.isBalanced, triggerVictoryAnimation]);

  return (
    <View style={styles.container}>
      {/* Victory particles */}
      <VictoryParticles show={balanceState.isBalanced} />

      {/* Support/Stand */}
      <View style={styles.supportContainer}>
        {/* Base */}
        <View style={styles.supportBase}>
          <View style={styles.supportBaseTop} />
          <View style={styles.supportBaseFront} />
        </View>

        {/* Pole */}
        <View style={styles.supportPole} />

        {/* Fulcrum (pivot point) */}
        <View style={styles.fulcrum}>
          <View style={styles.fulcrumInner} />
        </View>
      </View>

      {/* Beam (rotates around fulcrum) */}
      <Animated.View style={[styles.beam, beamAnimatedStyle] as unknown as StyleProp<ViewStyle>}>
        {/* Beam gradient for wood effect */}
        <View style={styles.beamInner}>
          <View style={styles.beamHighlight} />
        </View>

        {/* Beam end decorations */}
        <View style={[styles.beamEnd, styles.beamEndLeft]} />
        <View style={[styles.beamEnd, styles.beamEndRight]} />
      </Animated.View>

      {/* Plates (positioned relative to beam, animated vertically) */}
      <View style={styles.platesContainer}>
        <Plate
          side="left"
          isBalanced={balanceState.isBalanced}
          totalWeight={balanceState.leftPlate.totalWeight}
          showWeight={showWeightIndicators}
          animatedStyle={leftPlateAnimatedStyle}
        >
          {leftPlateContent}
        </Plate>

        <Plate
          side="right"
          isBalanced={balanceState.isBalanced}
          totalWeight={balanceState.rightPlate.totalWeight}
          showWeight={showWeightIndicators}
          animatedStyle={rightPlateAnimatedStyle}
        >
          {rightPlateContent}
        </Plate>
      </View>

      {/* Debug info */}
      {showDebugInfo && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            L: {balanceState.leftPlate.totalWeight.toFixed(1)} |
            R: {balanceState.rightPlate.totalWeight.toFixed(1)} |
            Angle: {balanceState.angle.toFixed(1)}°
          </Text>
        </View>
      )}

      {/* Balanced indicator */}
      {balanceState.isBalanced && (
        <Animated.View
          entering={ZoomIn.springify().damping(12)}
          style={styles.balancedBadge}
        >
          <Text style={styles.balancedText}>Équilibré!</Text>
        </Animated.View>
      )}
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 380,
    position: 'relative',
  },

  // Support/Stand
  supportContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    zIndex: 0,
  },
  supportBase: {
    alignItems: 'center',
  },
  supportBaseTop: {
    width: 100,
    height: 15,
    backgroundColor: BALANCE_COLORS.support.secondary,
    borderRadius: 4,
  },
  supportBaseFront: {
    width: 80,
    height: 25,
    backgroundColor: BALANCE_COLORS.support.primary,
    marginTop: -5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  supportPole: {
    width: 20,
    height: SUPPORT_HEIGHT,
    backgroundColor: BALANCE_COLORS.support.primary,
    position: 'absolute',
    bottom: 35,
  },
  fulcrum: {
    position: 'absolute',
    bottom: SUPPORT_HEIGHT + 25,
    width: FULCRUM_SIZE,
    height: FULCRUM_SIZE / 2,
    backgroundColor: BALANCE_COLORS.fulcrum,
    borderTopLeftRadius: FULCRUM_SIZE / 2,
    borderTopRightRadius: FULCRUM_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  fulcrumInner: {
    width: 12,
    height: 12,
    backgroundColor: '#B8860B',
    borderRadius: 6,
    marginTop: -4,
  },

  // Beam
  beam: {
    width: BEAM_WIDTH,
    height: BEAM_HEIGHT,
    backgroundColor: BALANCE_COLORS.beam.primary,
    borderRadius: 9,
    position: 'absolute',
    top: 100,
    zIndex: 2,
    boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.3)',
    elevation: 6,
  },
  beamInner: {
    flex: 1,
    borderRadius: 9,
    overflow: 'hidden',
  },
  beamHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BEAM_HEIGHT / 3,
    backgroundColor: BALANCE_COLORS.beam.highlight,
    opacity: 0.5,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  beamEnd: {
    position: 'absolute',
    top: (BEAM_HEIGHT - 24) / 2,
    width: 24,
    height: 24,
    backgroundColor: BALANCE_COLORS.beam.secondary,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: BALANCE_COLORS.beam.primary,
  },
  beamEndLeft: {
    left: -12,
  },
  beamEndRight: {
    right: -12,
  },

  // Plates container
  platesContainer: {
    position: 'absolute',
    top: 100,
    width: BEAM_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  plateWrapper: {
    alignItems: 'center',
  },
  plateLeft: {
    marginLeft: -PLATE_SIZE / 2 + 30,
  },
  plateRight: {
    marginRight: -PLATE_SIZE / 2 + 30,
  },

  // Rope
  ropeContainer: {
    alignItems: 'center',
    marginBottom: -5,
  },
  rope: {
    width: 4,
    height: ROPE_HEIGHT,
    backgroundColor: BALANCE_COLORS.rope,
    borderRadius: 2,
  },
  ropeKnot: {
    width: 10,
    height: 10,
    backgroundColor: BALANCE_COLORS.rope,
    borderRadius: 5,
    marginTop: -5,
  },

  // Plate
  plate: {
    width: PLATE_SIZE,
    height: PLATE_SIZE,
    borderRadius: PLATE_SIZE / 2,
    backgroundColor: BALANCE_COLORS.plate.background,
    borderWidth: 5,
    borderColor: BALANCE_COLORS.plate.border,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
    elevation: 5,
    overflow: 'hidden',
  },
  plateBalanced: {
    borderColor: BALANCE_COLORS.plate.balanced,
    boxShadow: '0px 0px 15px rgba(72, 187, 120, 0.6)',
    elevation: 10,
  },
  plateInner: {
    flex: 1,
    borderRadius: PLATE_SIZE / 2 - 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  plateContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing[2],
    gap: spacing[1],
  },

  // Weight indicator
  weightIndicator: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.round,
  },
  weightText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: '600',
  },

  // Victory particles
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    fontSize: 24,
  },

  // Balanced badge
  balancedBadge: {
    position: 'absolute',
    top: 20,
    backgroundColor: colors.feedback.success,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.round,
    boxShadow: '0px 4px 8px rgba(72, 187, 120, 0.4)',
    elevation: 6,
  },
  balancedText: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: '700',
  },

  // Debug
  debugContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: spacing[2],
    borderRadius: borderRadius.sm,
  },
  debugText: {
    color: colors.text.inverse,
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default BalanceScale;
