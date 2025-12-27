/**
 * ChoiceButton - Individual answer choice button
 * 100x100dp button with various states (idle, selected, correct, incorrect)
 */

import React, { memo, useEffect } from 'react';
import { View, StyleSheet, Pressable, AccessibilityInfo } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { ShapeConfig, ChoiceButtonProps } from '../../types';
import { ShapeRenderer } from '../shapes';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ============================================================================
// CONSTANTS
// ============================================================================

const BUTTON_SIZE = 100;
const SHAPE_SIZE = 72;

// State colors
const STATE_COLORS = {
  idle: {
    background: ['#FFFFFF', '#F8F9FA'],
    border: '#E0E0E0',
  },
  selected: {
    background: ['#E3F2FD', '#BBDEFB'],
    border: '#5B8DEE',
  },
  correct: {
    background: ['#E8F5E9', '#C8E6C9'],
    border: '#7BC74D',
  },
  incorrect: {
    background: ['#FFF3E0', '#FFE0B2'],
    border: '#FFB347', // Orange, NOT red (child-friendly)
  },
  disabled: {
    background: ['#F5F5F5', '#EEEEEE'],
    border: '#BDBDBD',
  },
};

// ============================================================================
// CHOICE BUTTON COMPONENT
// ============================================================================

function ChoiceButtonComponent({
  shape,
  index,
  isSelected,
  state,
  onPress,
  size = BUTTON_SIZE,
}: ChoiceButtonProps) {
  // Animation values
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(2);
  const rotation = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.1);

  useEffect(() => {
    // Update animations based on state
    switch (state) {
      case 'selected':
        scale.value = withSpring(1.05, { damping: 10 });
        borderWidth.value = withTiming(4, { duration: 150 });
        shadowOpacity.value = withTiming(0.2, { duration: 150 });
        break;

      case 'correct':
        // Bounce animation for correct answer
        scale.value = withSequence(
          withSpring(1.15, { damping: 8 }),
          withSpring(1.05, { damping: 10 })
        );
        borderWidth.value = withTiming(4, { duration: 150 });
        break;

      case 'incorrect':
        // Gentle shake for wrong answer (NOT aggressive)
        rotation.value = withSequence(
          withTiming(-3, { duration: 50 }),
          withRepeat(
            withSequence(
              withTiming(3, { duration: 100 }),
              withTiming(-3, { duration: 100 })
            ),
            2,
            true
          ),
          withTiming(0, { duration: 50 })
        );
        borderWidth.value = withTiming(3, { duration: 150 });
        break;

      case 'disabled':
        scale.value = withSpring(0.95);
        shadowOpacity.value = withTiming(0.05, { duration: 150 });
        break;

      default: // idle
        scale.value = withSpring(1);
        borderWidth.value = withTiming(2, { duration: 150 });
        shadowOpacity.value = withTiming(0.1, { duration: 150 });
        rotation.value = withTiming(0, { duration: 100 });
    }
  }, [state]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderWidth: borderWidth.value,
  }));

  const handlePress = () => {
    if (state !== 'disabled') {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(index);
    }
  };

  const colors = STATE_COLORS[state];

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={state === 'disabled'}
      style={[
        styles.container,
        { width: size, height: size },
        animatedContainerStyle,
      ]}
      accessibilityRole="button"
      accessibilityState={{
        selected: isSelected,
        disabled: state === 'disabled',
      }}
      accessibilityLabel={`Choix ${index + 1}: ${shape.type} ${shape.color}`}
      accessibilityHint={
        state === 'disabled'
          ? 'Ce choix n\'est pas disponible'
          : isSelected
          ? 'Ce choix est sélectionné'
          : 'Appuie pour sélectionner ce choix'
      }
    >
      {/* Background with gradient */}
      <LinearGradient
        colors={colors.background as [string, string]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Border layer */}
      <Animated.View
        style={[
          styles.borderLayer,
          { borderColor: colors.border },
          animatedBorderStyle,
        ]}
      />

      {/* Shape */}
      <View style={styles.shapeContainer}>
        <ShapeRenderer
          config={shape}
          size={size * 0.72}
          animated={state === 'selected'}
        />
      </View>

      {/* Selection indicator */}
      {isSelected && state !== 'correct' && state !== 'incorrect' && (
        <View style={styles.selectionIndicator}>
          <View style={styles.selectionDot} />
        </View>
      )}

      {/* Correct indicator */}
      {state === 'correct' && (
        <View style={[styles.stateIndicator, styles.correctIndicator]}>
          <CorrectIcon />
        </View>
      )}

      {/* Incorrect indicator */}
      {state === 'incorrect' && (
        <View style={[styles.stateIndicator, styles.incorrectIndicator]}>
          <IncorrectIcon />
        </View>
      )}
    </AnimatedPressable>
  );
}

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const CorrectIcon = () => (
  <View style={styles.iconContainer}>
    <View style={[styles.checkMark, styles.checkMarkShort]} />
    <View style={[styles.checkMark, styles.checkMarkLong]} />
  </View>
);

const IncorrectIcon = () => (
  <View style={styles.iconContainer}>
    <View style={[styles.xMark, styles.xMark1]} />
    <View style={[styles.xMark, styles.xMark2]} />
  </View>
);

export const ChoiceButton = memo(ChoiceButtonComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  borderLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  shapeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  selectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5B8DEE',
  },
  stateIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  correctIndicator: {
    backgroundColor: '#7BC74D',
  },
  incorrectIndicator: {
    backgroundColor: '#FFB347', // Orange, child-friendly
  },
  iconContainer: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  checkMarkShort: {
    width: 6,
    height: 3,
    transform: [{ rotate: '45deg' }, { translateX: -3 }, { translateY: 2 }],
  },
  checkMarkLong: {
    width: 10,
    height: 3,
    transform: [{ rotate: '-45deg' }, { translateX: 1 }, { translateY: -1 }],
  },
  xMark: {
    position: 'absolute',
    width: 12,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  xMark1: {
    transform: [{ rotate: '45deg' }],
  },
  xMark2: {
    transform: [{ rotate: '-45deg' }],
  },
});
