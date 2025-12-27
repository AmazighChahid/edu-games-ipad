/**
 * Button component
 * Child-friendly button with haptic feedback
 */

import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '../../theme';
import { useStore } from '../../store';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  onPress,
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);

  const handlePress = () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          size === 'small' ? styles.labelSmall : styles.labelDefault,
          variantTextStyles[variant],
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    ...shadows.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  label: {
    textAlign: 'center',
  },
  labelDefault: {
    ...textStyles.button,
  },
  labelSmall: {
    ...textStyles.buttonSmall,
  },
  labelDisabled: {
    color: colors.text.muted,
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  small: {
    height: touchTargets.small,
    paddingHorizontal: spacing[3],
  },
  medium: {
    height: touchTargets.medium,
    paddingHorizontal: spacing[5],
  },
  large: {
    height: touchTargets.large,
    paddingHorizontal: spacing[6],
  },
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primary.main,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.ui.border,
    shadowOpacity: 0,
    elevation: 0,
  },
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = {
  primary: {
    color: colors.primary.contrast,
  },
  secondary: {
    color: colors.secondary.contrast,
  },
  ghost: {
    color: colors.text.primary,
  },
};
