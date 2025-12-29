/**
 * Floating Action Buttons Component
 * Hint and Validate buttons with animations
 * Matches the HTML mockup design
 */

import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, shadows, touchTargets, colors, fontFamily } from '@/theme';
import { useStore } from '@/store';

interface FloatingActionButtonsProps {
  onHint: () => void;
  onValidate: () => void;
  hintsRemaining?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButtons({
  onHint,
  onValidate,
  hintsRemaining = 3,
}: FloatingActionButtonsProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);
  const hintScale = useSharedValue(1);
  const validateScale = useSharedValue(1);

  const handleHint = () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    hintScale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1.1, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );

    onHint();
  };

  const handleValidate = () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    validateScale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );

    onValidate();
  };

  const hintAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hintScale.value }],
  }));

  const validateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: validateScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Hint button */}
      <AnimatedPressable
        onPress={handleHint}
        style={[styles.button, styles.hintButton, hintAnimatedStyle]}
      >
        <Text style={styles.buttonIcon}>💡</Text>
        {hintsRemaining > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{hintsRemaining}</Text>
          </View>
        )}
      </AnimatedPressable>

      {/* Validate button */}
      <AnimatedPressable
        onPress={handleValidate}
        style={[styles.button, styles.validateButton, validateAnimatedStyle]}
      >
        <Text style={styles.buttonIcon}>✓</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing[4],
    bottom: 120,
    gap: spacing[3],
    zIndex: 100,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  hintButton: {
    backgroundColor: '#FFB347', // Orange gradient: linear-gradient(135deg, #FFB347, #FF9500)
    position: 'relative',
  },
  validateButton: {
    backgroundColor: '#7BC74D', // Green gradient: linear-gradient(135deg, #7BC74D, #5BAE6B)
  },
  buttonIcon: {
    fontSize: 28,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    backgroundColor: '#E57373',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    color: colors.text.inverse,
  },
});
