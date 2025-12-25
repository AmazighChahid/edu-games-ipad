import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  AccessibilityRole,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Layout, Typography } from '../../constants';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'medium' | 'large';
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  variant = 'primary',
  size = 'large',
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const labelStyles = [
    styles.label,
    styles[`${variant}Label` as keyof typeof styles],
    styles[`${size}Label` as keyof typeof styles],
    disabled && styles.disabledLabel,
    textStyle,
  ];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[buttonStyles, animatedStyle]}
      accessible={true}
      accessibilityRole={'button' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      <Text style={labelStyles}>{label}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.borderRadius.lg,
    ...Layout.shadow.medium,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary.medium,
  },
  secondary: {
    backgroundColor: Colors.secondary.medium,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: Colors.primary.medium,
  },

  // Sizes
  medium: {
    minWidth: Layout.touchTarget.comfortable,
    minHeight: Layout.touchTarget.comfortable,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  large: {
    minWidth: Layout.touchTarget.large,
    minHeight: Layout.touchTarget.large,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
  },

  // States
  disabled: {
    backgroundColor: Colors.neutral.border,
    shadowOpacity: 0,
    elevation: 0,
  },

  // Label styles
  label: {
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
  },
  primaryLabel: {
    color: Colors.neutral.surface,
    fontSize: Typography.sizes.md,
  },
  secondaryLabel: {
    color: Colors.neutral.surface,
    fontSize: Typography.sizes.md,
  },
  outlineLabel: {
    color: Colors.primary.medium,
    fontSize: Typography.sizes.md,
  },
  mediumLabel: {
    fontSize: Typography.sizes.sm,
  },
  largeLabel: {
    fontSize: Typography.sizes.md,
  },
  disabledLabel: {
    color: Colors.neutral.textLight,
  },
});
