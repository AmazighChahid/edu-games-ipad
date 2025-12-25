import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  AccessibilityRole,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Layout, Typography } from '../../constants';

interface IconButtonProps {
  onPress: () => void;
  icon: string;  // Emoji ou caractère unicode
  label?: string;
  size?: 'medium' | 'large' | 'extraLarge';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon,
  label,
  size = 'large',
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const sizeValue = {
    medium: Layout.touchTarget.comfortable,
    large: Layout.touchTarget.large,
    extraLarge: Layout.touchTarget.extraLarge,
  }[size];

  const iconSize = {
    medium: Typography.sizes.lg,
    large: Typography.sizes.xl,
    extraLarge: Typography.sizes.xxl,
  }[size];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.base,
        styles[variant],
        { width: sizeValue, height: sizeValue },
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      accessible={true}
      accessibilityRole={'button' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.icon, { fontSize: iconSize }]}>{icon}</Text>
      {label && (
        <Text
          style={[
            styles.label,
            styles[`${variant}Label` as keyof typeof styles],
          ]}
        >
          {label}
        </Text>
      )}
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
    backgroundColor: Colors.primary.soft,
  },
  secondary: {
    backgroundColor: Colors.secondary.soft,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },

  // States
  disabled: {
    backgroundColor: Colors.neutral.border,
    opacity: 0.6,
  },

  icon: {
    textAlign: 'center',
  },

  label: {
    marginTop: Layout.spacing.xs,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },

  primaryLabel: {
    color: Colors.primary.dark,
  },
  secondaryLabel: {
    color: Colors.secondary.dark,
  },
  ghostLabel: {
    color: Colors.neutral.text,
  },
});
