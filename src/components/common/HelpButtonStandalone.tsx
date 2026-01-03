/**
 * HelpButtonStandalone component
 * Independent help button with "?" icon for displaying help/rules modal
 * Named "Standalone" to avoid conflict with HintButton (💡)
 */

import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows, touchTargets } from '../../theme';
import { Icons } from '../../constants/icons';
import { useStore } from '../../store';

type HelpButtonSize = 'small' | 'medium' | 'large';

export interface HelpButtonStandaloneProps {
  /** Callback when pressed */
  onPress: () => void;
  /** Icon to display. Default: '?' */
  icon?: string;
  /** Size variant. Default: 'medium' */
  size?: HelpButtonSize;
  /** Background color. Default: theme secondary blue */
  backgroundColor?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const sizeConfig: Record<HelpButtonSize, { size: number; iconSize: number }> = {
  small: {
    size: 48,
    iconSize: 22,
  },
  medium: {
    size: touchTargets.minimum,
    iconSize: 28,
  },
  large: {
    size: touchTargets.large,
    iconSize: 34,
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HelpButtonStandalone({
  onPress,
  icon = Icons.help,
  size = 'medium',
  backgroundColor = colors.ui.buttonBlue,
  accessibilityLabel = 'Aide',
}: HelpButtonStandaloneProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);
  const scale = useSharedValue(1);

  const config = sizeConfig[size];

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
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
          width: config.size,
          height: config.size,
          backgroundColor,
        },
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Affiche l'aide et les règles du jeu"
    >
      <Text style={[styles.icon, { fontSize: config.iconSize }]}>{icon}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
    ...shadows.md,
  },
  icon: {
    color: colors.text.inverse,
    fontWeight: '700',
  },
});
