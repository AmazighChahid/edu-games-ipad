import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '@/theme';
import { Icons } from '@/constants/icons';
import { Direction } from '../types';

// ============================================
// CONSTANTS - Couleurs centralisées
// ============================================

const DIRECTION_COLORS = {
  up: theme.colors.primary.main,
  down: theme.colors.feedback.success,
  left: theme.colors.feedback.error,
  right: theme.colors.secondary.main,
} as const;

const ACTION_COLORS = {
  execute: theme.colors.feedback.success,
  executeDisabled: theme.colors.text.muted,
  reset: theme.colors.feedback.error,
} as const;

interface Props {
  onAddInstruction: (direction: Direction) => void;
  onExecute: () => void;
  onReset: () => void;
  canExecute: boolean;
  canReset: boolean;
  isExecuting: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DirectionButton: React.FC<{
  direction: Direction;
  icon: string;
  color: string;
  onPress: () => void;
  disabled: boolean;
}> = ({ direction, icon, color, onPress, disabled }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.9);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (disabled) return;
    onPress();
  };

  return (
    <AnimatedPressable
      style={[
        styles.directionButton,
        { backgroundColor: color },
        disabled && styles.disabledButton,
        animatedStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityLabel={`Ajouter ${direction === 'up' ? 'haut' : direction === 'down' ? 'bas' : direction === 'left' ? 'gauche' : 'droite'}`}
      accessibilityRole="button"
    >
      <Text style={styles.directionIcon}>{icon}</Text>
    </AnimatedPressable>
  );
};

const ActionButton: React.FC<{
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
  disabled: boolean;
}> = ({ icon, label, color, onPress, disabled }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.95);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      style={[
        styles.actionButton,
        { backgroundColor: color },
        disabled && styles.disabledButton,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </AnimatedPressable>
  );
};

export const ProgrammingControls: React.FC<Props> = ({
  onAddInstruction,
  onExecute,
  onReset,
  canExecute,
  canReset,
  isExecuting,
}) => {
  return (
    <View style={styles.container}>
      {/* Titre */}
      <Text style={styles.controlsTitle}>Directions</Text>

      {/* Grille de contrôle directionnelle */}
      <View style={styles.directionalPad}>
        {/* Ligne 1: Haut */}
        <View style={styles.row}>
          <View style={styles.spacer} />
          <DirectionButton
            direction="up"
            icon={Icons.back}
            color={DIRECTION_COLORS.up}
            onPress={() => onAddInstruction('up')}
            disabled={isExecuting}
          />
          <View style={styles.spacer} />
        </View>

        {/* Ligne 2: Gauche, Centre, Droite */}
        <View style={styles.row}>
          <DirectionButton
            direction="left"
            icon={Icons.back}
            color={DIRECTION_COLORS.left}
            onPress={() => onAddInstruction('left')}
            disabled={isExecuting}
          />
          <View style={styles.centerButton}>
            <Text style={styles.centerIcon}>+</Text>
          </View>
          <DirectionButton
            direction="right"
            icon={Icons.back}
            color={DIRECTION_COLORS.right}
            onPress={() => onAddInstruction('right')}
            disabled={isExecuting}
          />
        </View>

        {/* Ligne 3: Bas */}
        <View style={styles.row}>
          <View style={styles.spacer} />
          <DirectionButton
            direction="down"
            icon={Icons.back}
            color={DIRECTION_COLORS.down}
            onPress={() => onAddInstruction('down')}
            disabled={isExecuting}
          />
          <View style={styles.spacer} />
        </View>
      </View>

      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <ActionButton
          icon="▶"
          label={isExecuting ? "En cours..." : "Lancer"}
          color={isExecuting ? ACTION_COLORS.executeDisabled : ACTION_COLORS.execute}
          onPress={onExecute}
          disabled={!canExecute || isExecuting}
        />
        <ActionButton
          icon="↺"
          label="Recommencer"
          color={ACTION_COLORS.reset}
          onPress={onReset}
          disabled={!canReset}
        />
      </View>
    </View>
  );
};

// Taille des boutons directionnels (64dp minimum pour enfants)
const BUTTON_SIZE = theme.touchTargets.large;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing[2],
    ...theme.shadows.sm,
  },
  controlsTitle: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  directionalPad: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 3,
  },
  directionButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  directionIcon: {
    fontSize: 22,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.background.primary,
  },
  spacer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  centerButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.3)',
    borderStyle: 'dashed',
  },
  centerIcon: {
    fontSize: 18,
    fontFamily: theme.fontFamily.bold,
    color: 'rgba(91, 141, 238, 0.5)',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtons: {
    gap: theme.spacing[1],
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing[2],
    ...theme.shadows.sm,
    minHeight: theme.touchTargets.large,
  },
  actionIcon: {
    fontSize: 20,
    color: theme.colors.background.primary,
  },
  actionLabel: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.background.primary,
  },
});
