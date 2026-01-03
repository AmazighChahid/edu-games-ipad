/**
 * ParentTipsButton component
 * Button to access parent tips/guide for the current activity
 */

import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors, spacing, fontFamily, fontSize, borderRadius, shadows, touchTargets } from '../../theme';
import { Icons } from '../../constants/icons';
import { useStore } from '../../store';

type ParentTipsButtonSize = 'small' | 'medium' | 'large';

export interface ParentTipsButtonProps {
  /** Callback when pressed */
  onPress: () => void;
  /** Button label. Default: "Conseil parents" */
  label?: string;
  /** Show text label. Default: true */
  showLabel?: boolean;
  /** Size variant. Default: 'medium' */
  size?: ParentTipsButtonSize;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const sizeConfig: Record<ParentTipsButtonSize, { height: number; iconSize: number; fontSize: number; paddingH: number }> = {
  small: {
    height: 48,
    iconSize: 18,
    fontSize: fontSize.sm,
    paddingH: spacing[3],
  },
  medium: {
    height: touchTargets.minimum,
    iconSize: 22,
    fontSize: fontSize.md,
    paddingH: spacing[4],
  },
  large: {
    height: touchTargets.large,
    iconSize: 26,
    fontSize: fontSize.lg,
    paddingH: spacing[5],
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ParentTipsButton({
  onPress,
  label = 'Conseil parents',
  showLabel = true,
  size = 'medium',
  accessibilityLabel,
}: ParentTipsButtonProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);
  const scale = useSharedValue(1);

  const config = sizeConfig[size];

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        {
          height: config.height,
          paddingHorizontal: showLabel ? config.paddingH : spacing[3],
        },
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      <Text style={[styles.icon, { fontSize: config.iconSize }]}>
        {Icons.family}
      </Text>
      {showLabel && (
        <Text style={[styles.label, { fontSize: config.fontSize }]}>
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9', // Light green background
    borderRadius: borderRadius.md,
    ...shadows.sm,
    gap: spacing[2],
  },
  icon: {
    color: colors.feedback.success,
  },
  label: {
    fontFamily: fontFamily.medium,
    color: colors.feedback.success,
  },
});
