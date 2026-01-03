/**
 * ValidateButton component
 * Child-friendly validation button with haptic feedback
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors, spacing, fontFamily, fontSize, borderRadius, shadows, touchTargets } from '../../theme';
import { Icons } from '../../constants/icons';
import { useStore } from '../../store';

type ValidateButtonVariant = 'success' | 'primary' | 'secondary';
type ValidateButtonSize = 'medium' | 'large';

export interface ValidateButtonProps {
  /** Callback when pressed */
  onPress: () => void;
  /** Button label. Default: "Valider" */
  label?: string;
  /** Icon emoji. Default: checkmark */
  icon?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Color variant. Default: 'success' */
  variant?: ValidateButtonVariant;
  /** Size variant. Default: 'large' */
  size?: ValidateButtonSize;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const variantColors: Record<ValidateButtonVariant, { bg: string; bgPressed: string }> = {
  success: {
    bg: colors.feedback.success,
    bgPressed: '#3AA56C',
  },
  primary: {
    bg: colors.primary.main,
    bgPressed: colors.primary.dark,
  },
  secondary: {
    bg: colors.secondary.main,
    bgPressed: colors.secondary.dark,
  },
};

const sizeConfig: Record<ValidateButtonSize, { height: number; paddingH: number; fontSize: number; iconSize: number }> = {
  medium: {
    height: touchTargets.medium,
    paddingH: spacing[5],
    fontSize: fontSize.md,
    iconSize: 20,
  },
  large: {
    height: touchTargets.large,
    paddingH: spacing[6],
    fontSize: fontSize.lg,
    iconSize: 24,
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ValidateButton({
  onPress,
  label = 'Valider',
  icon = Icons.checkmark,
  disabled = false,
  loading = false,
  variant = 'success',
  size = 'large',
  accessibilityLabel,
}: ValidateButtonProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);
  const scale = useSharedValue(1);

  const config = sizeConfig[size];
  const colorConfig = variantColors[variant];

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          height: config.height,
          paddingHorizontal: config.paddingH,
          backgroundColor: colorConfig.bg,
        },
        isDisabled && styles.disabled,
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.text.inverse} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.icon, { fontSize: config.iconSize }]}>{icon}</Text>
          <Text style={[styles.label, { fontSize: config.fontSize }]}>{label}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  icon: {
    marginRight: spacing[1],
  },
  label: {
    fontFamily: fontFamily.semiBold,
    color: colors.text.inverse,
  },
  disabled: {
    opacity: 0.5,
  },
});
