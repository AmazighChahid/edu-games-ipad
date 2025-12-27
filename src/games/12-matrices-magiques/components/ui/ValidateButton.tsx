/**
 * ValidateButton - Main action button to submit answer
 * Child-friendly with haptic feedback
 */

import React, { memo } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

// ============================================================================
// TYPES
// ============================================================================

interface ValidateButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  primaryColor?: string;
}

// ============================================================================
// VALIDATE BUTTON COMPONENT
// ============================================================================

function ValidateButtonComponent({
  onPress,
  disabled = false,
  label = 'Valider',
  primaryColor = '#7BC74D',
}: ValidateButtonProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gradientColors = disabled
    ? ['#BDBDBD', '#9E9E9E']
    : [primaryColor, adjustColor(primaryColor, -20)];

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => { if (!disabled) scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <LinearGradient
          colors={gradientColors as [string, string]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.label, disabled && styles.labelDisabled]}>
            {label}
          </Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

/**
 * Adjust a hex color by a given amount
 */
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

export const ValidateButton = memo(ValidateButtonComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Fredoka-Bold',
    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
  },
  labelDisabled: {
    opacity: 0.7,
  },
});
