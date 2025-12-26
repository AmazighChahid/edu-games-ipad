/**
 * FloatingButtons component
 * Floating action buttons for Reset and Hint
 * Child-friendly design with animations
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { shadows, touchTargets } from '@/theme';

interface FloatingButtonsProps {
  onReset: () => void;
  onHint: () => void;
  hintsRemaining?: number;
  hintDisabled?: boolean;
  visible?: boolean;
}

// Colors
const COLORS = {
  reset: {
    background: '#FFFFFF',
    icon: '#5B8DEE',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  hint: {
    gradient: ['#F39C12', '#E67E22'] as [string, string],
    icon: '#FFFFFF',
    shadow: 'rgba(243, 156, 18, 0.4)',
  },
  disabled: {
    background: '#CCCCCC',
    icon: '#999999',
  },
};

// Haptic feedback helper
const triggerHaptic = (type: 'light' | 'medium') => {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(
    type === 'light'
      ? Haptics.ImpactFeedbackStyle.Light
      : Haptics.ImpactFeedbackStyle.Medium
  );
};

// Animated Pressable wrapper
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingButtons({
  onReset,
  onHint,
  hintsRemaining = 3,
  hintDisabled = false,
  visible = true,
}: FloatingButtonsProps) {
  // Animation values
  const resetScale = useSharedValue(1);
  const hintScale = useSharedValue(1);
  const hintPulse = useSharedValue(1);

  // Pulse animation for hint button when available
  useEffect(() => {
    if (!hintDisabled && hintsRemaining > 0) {
      hintPulse.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      hintPulse.value = withTiming(1, { duration: 200 });
    }
  }, [hintDisabled, hintsRemaining]);

  // Press handlers
  const handleResetPress = () => {
    resetScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 15 })
    );
    triggerHaptic('light');
    onReset();
  };

  const handleHintPress = () => {
    if (hintDisabled || hintsRemaining <= 0) return;

    hintScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 15 })
    );
    triggerHaptic('medium');
    onHint();
  };

  // Animated styles
  const resetStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resetScale.value }],
  }));

  const hintStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hintScale.value * hintPulse.value }],
  }));

  if (!visible) return null;

  const isHintDisabled = hintDisabled || hintsRemaining <= 0;

  return (
    <View style={styles.container}>
      {/* Reset button - Left */}
      <AnimatedPressable
        onPress={handleResetPress}
        style={[styles.button, styles.resetButton, resetStyle]}
      >
        <Text style={styles.resetIcon}>🔄</Text>
      </AnimatedPressable>

      {/* Hint button - Right */}
      <AnimatedPressable
        onPress={handleHintPress}
        disabled={isHintDisabled}
        style={[styles.button, hintStyle]}
      >
        {isHintDisabled ? (
          <View style={[styles.hintButtonInner, styles.hintButtonDisabled]}>
            <Text style={styles.hintIcon}>💡</Text>
          </View>
        ) : (
          <LinearGradient
            colors={COLORS.hint.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hintButtonInner}
          >
            <Text style={styles.hintIcon}>💡</Text>
            {/* Badge compteur indices */}
            {hintsRemaining < 99 && (
              <View style={styles.hintBadge}>
                <Text style={styles.hintBadgeText}>{hintsRemaining}</Text>
              </View>
            )}
          </LinearGradient>
        )}
      </AnimatedPressable>
    </View>
  );
}

const BUTTON_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    zIndex: 100,
  },

  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Reset button
  resetButton: {
    backgroundColor: COLORS.reset.background,
    ...shadows.lg,
  },
  resetIcon: {
    fontSize: 36,
  },

  // Hint button
  hintButtonInner: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  hintButtonDisabled: {
    backgroundColor: COLORS.disabled.background,
  },
  hintIcon: {
    fontSize: 36,
  },

  // Badge compteur indices
  hintBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5B8DEE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  hintBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
