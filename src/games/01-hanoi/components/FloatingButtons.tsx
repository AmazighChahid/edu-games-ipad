/**
 * FloatingButtons component
 * Floating action buttons for Reset and Hint
 * New design with halo/pulse effect on hint button
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

import { shadows } from '../../../theme';

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
    background: 'rgba(255, 255, 255, 0.95)',
    icon: '#5B8DEE',
  },
  hint: {
    gradient: ['#FFB347', '#FFA020'] as [string, string],
    haloColor: 'rgba(255, 179, 71, 0.3)',
  },
  disabled: {
    background: '#CCCCCC',
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
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.3);

  // Halo pulse animation for hint button
  useEffect(() => {
    if (!hintDisabled && hintsRemaining > 0) {
      // Halo expanding animation
      haloScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.4, { duration: 1000, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      );
      haloOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 0 }),
          withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      haloScale.value = withTiming(1, { duration: 200 });
      haloOpacity.value = withTiming(0, { duration: 200 });
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
    transform: [{ scale: hintScale.value }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value }],
    opacity: haloOpacity.value,
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
        <Text style={styles.resetIcon}>↻</Text>
      </AnimatedPressable>

      {/* Hint button - Right with halo effect */}
      <View style={styles.hintContainer}>
        {/* Halo effect */}
        {!isHintDisabled && (
          <Animated.View style={[styles.halo, haloStyle]} />
        )}

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
    </View>
  );
}

const BUTTON_SIZE = 64;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
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
    fontSize: 28,
    color: COLORS.reset.icon,
  },

  // Hint button container with halo
  hintContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Halo effect
  halo: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: COLORS.hint.haloColor,
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
    fontSize: 28,
  },

  // Badge compteur indices
  hintBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#5B8DEE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  hintBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
