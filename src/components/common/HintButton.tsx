/**
 * HintButton Component
 *
 * Bouton d'indices animé avec feedback haptique
 * Affiche le nombre d'indices restants sous forme de points
 *
 * @example
 * // Mode standard avec 3 indices
 * <HintButton
 *   hintsRemaining={3}
 *   maxHints={3}
 *   onPress={handleHint}
 * />
 *
 * @example
 * // Mode compact avec couleur personnalisée
 * <HintButton
 *   hintsRemaining={2}
 *   maxHints={3}
 *   onPress={handleHint}
 *   size="small"
 *   colorScheme="blue"
 * />
 *
 * @example
 * // Mode avec texte
 * <HintButton
 *   hintsRemaining={1}
 *   maxHints={3}
 *   onPress={handleHint}
 *   showLabel
 *   labelPosition="right"
 * />
 */

import { memo } from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily } from '../../theme';

// ============================================================================
// TYPES
// ============================================================================

type HintButtonSize = 'small' | 'medium' | 'large';
type HintButtonColorScheme = 'orange' | 'blue' | 'green' | 'purple';
type LabelPosition = 'right' | 'bottom';

interface HintButtonProps {
  /** Nombre d'indices restants */
  hintsRemaining: number;
  /** Nombre maximum d'indices (pour l'affichage des points) */
  maxHints?: number;
  /** Callback lors du clic */
  onPress: () => void;
  /** Désactivé manuellement */
  disabled?: boolean;
  /** Taille du bouton */
  size?: HintButtonSize;
  /** Schéma de couleur */
  colorScheme?: HintButtonColorScheme;
  /** Afficher le label texte */
  showLabel?: boolean;
  /** Position du label */
  labelPosition?: LabelPosition;
  /** Texte du label personnalisé */
  customLabel?: string;
  /** Icône personnalisée (emoji) */
  icon?: string;
  /** Style du conteneur externe */
  style?: ViewStyle;
  /** Désactiver les vibrations */
  disableHaptics?: boolean;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const SIZE_CONFIG = {
  small: {
    buttonSize: 48,
    iconSize: 22,
    dotSize: 6,
    dotGap: 3,
  },
  medium: {
    buttonSize: 64,
    iconSize: 28,
    dotSize: 8,
    dotGap: 4,
  },
  large: {
    buttonSize: 80,
    iconSize: 36,
    dotSize: 10,
    dotGap: 5,
  },
};

const COLOR_SCHEMES = {
  orange: {
    background: '#FFB347',
    backgroundDisabled: '#BDBDBD',
    dotActive: '#FFFFFF',
    dotInactive: 'rgba(255, 255, 255, 0.3)',
  },
  blue: {
    background: colors.primary.main,
    backgroundDisabled: colors.text.muted,
    dotActive: '#FFFFFF',
    dotInactive: 'rgba(255, 255, 255, 0.3)',
  },
  green: {
    background: colors.feedback.success,
    backgroundDisabled: colors.text.muted,
    dotActive: '#FFFFFF',
    dotInactive: 'rgba(255, 255, 255, 0.3)',
  },
  purple: {
    background: '#9B59B6',
    backgroundDisabled: colors.text.muted,
    dotActive: '#FFFFFF',
    dotInactive: 'rgba(255, 255, 255, 0.3)',
  },
};

// ============================================================================
// HINT BUTTON COMPONENT
// ============================================================================

function HintButtonComponent({
  hintsRemaining,
  maxHints = 3,
  onPress,
  disabled = false,
  size = 'medium',
  colorScheme = 'orange',
  showLabel = false,
  labelPosition = 'right',
  customLabel,
  icon = '💡',
  style,
  disableHaptics = false,
}: HintButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const sizeConfig = SIZE_CONFIG[size];
  const colorConfig = COLOR_SCHEMES[colorScheme];
  const isDisabled = disabled || hintsRemaining <= 0;

  const handlePress = () => {
    if (isDisabled) {
      // Shake animation when disabled
      if (!disableHaptics) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      rotation.value = withSequence(
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 100 }),
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 50 })
      );
    } else {
      if (!disableHaptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const buttonStyle: ViewStyle = {
    width: sizeConfig.buttonSize,
    height: sizeConfig.buttonSize,
    borderRadius: sizeConfig.buttonSize / 2,
    backgroundColor: isDisabled
      ? colorConfig.backgroundDisabled
      : colorConfig.background,
  };

  const label = customLabel || `${hintsRemaining} indice${hintsRemaining !== 1 ? 's' : ''}`;

  // Render hint dots
  const renderDots = () => (
    <View style={[styles.countContainer, { gap: sizeConfig.dotGap }]}>
      {Array.from({ length: maxHints }, (_, i) => i + 1).map((dot) => (
        <View
          key={dot}
          style={[
            {
              width: sizeConfig.dotSize,
              height: sizeConfig.dotSize,
              borderRadius: sizeConfig.dotSize / 2,
            },
            {
              backgroundColor:
                dot <= hintsRemaining
                  ? colorConfig.dotActive
                  : colorConfig.dotInactive,
            },
          ]}
        />
      ))}
    </View>
  );

  const renderButton = () => (
    <Pressable
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.9);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      accessibilityRole="button"
      accessibilityLabel={`Demander un indice, ${hintsRemaining} restants`}
      accessibilityState={{ disabled: isDisabled }}
    >
      <Animated.View
        style={[
          styles.button,
          buttonStyle,
          isDisabled && styles.buttonDisabled,
          animatedStyle,
        ]}
      >
        <Text style={[styles.icon, { fontSize: sizeConfig.iconSize }]}>
          {icon}
        </Text>
        {renderDots()}
      </Animated.View>
    </Pressable>
  );

  // With label
  if (showLabel) {
    const isHorizontal = labelPosition === 'right';
    return (
      <View
        style={[
          styles.wrapper,
          isHorizontal ? styles.wrapperHorizontal : styles.wrapperVertical,
          style,
        ]}
      >
        {renderButton()}
        <Text
          style={[
            styles.label,
            isDisabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
      </View>
    );
  }

  // Without label
  return (
    <View style={style}>
      {renderButton()}
    </View>
  );
}

export const HintButton = memo(HintButtonComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  wrapperHorizontal: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  wrapperVertical: {
    flexDirection: 'column',
    gap: spacing[2],
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  icon: {
    marginBottom: 4,
  },
  countContainer: {
    flexDirection: 'row',
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text.primary,
  },
  labelDisabled: {
    color: colors.text.muted,
  },
});

export type { HintButtonProps, HintButtonSize, HintButtonColorScheme };
export default HintButton;
