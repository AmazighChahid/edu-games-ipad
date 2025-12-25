/**
 * IconButton component
 * Touch-friendly icon button for game controls
 */

import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

import { colors, borderRadius, shadows, touchTargets } from '@/theme';
import { useStore } from '@/store/useStore';

type IconButtonVariant = 'primary' | 'secondary' | 'ghost';
type IconButtonSize = 'small' | 'medium' | 'large';

interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  accessibilityLabel: string;
}

export function IconButton({
  onPress,
  icon,
  variant = 'ghost',
  size = 'medium',
  disabled = false,
  accessibilityLabel,
}: IconButtonProps) {
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
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        sizeStyles[size],
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
});

const sizeStyles: Record<IconButtonSize, ViewStyle> = {
  small: {
    width: touchTargets.small,
    height: touchTargets.small,
  },
  medium: {
    width: touchTargets.medium,
    height: touchTargets.medium,
  },
  large: {
    width: touchTargets.large,
    height: touchTargets.large,
  },
};

const variantStyles: Record<IconButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primary.main,
    ...shadows.md,
  },
  secondary: {
    backgroundColor: colors.background.card,
    ...shadows.sm,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
};
