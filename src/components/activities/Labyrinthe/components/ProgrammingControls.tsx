import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Direction } from '../types';

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
      {/* Grille de contrôle directionnelle */}
      <View style={styles.directionalPad}>
        {/* Ligne 1: Haut */}
        <View style={styles.row}>
          <View style={styles.spacer} />
          <DirectionButton
            direction="up"
            icon="↑"
            color="#5B8DEE"
            onPress={() => onAddInstruction('up')}
            disabled={isExecuting}
          />
          <View style={styles.spacer} />
        </View>

        {/* Ligne 2: Gauche, Centre, Droite */}
        <View style={styles.row}>
          <DirectionButton
            direction="left"
            icon="←"
            color="#E53E3E"
            onPress={() => onAddInstruction('left')}
            disabled={isExecuting}
          />
          <View style={styles.centerButton}>
            <Text style={styles.centerIcon}>+</Text>
          </View>
          <DirectionButton
            direction="right"
            icon="→"
            color="#F6AD55"
            onPress={() => onAddInstruction('right')}
            disabled={isExecuting}
          />
        </View>

        {/* Ligne 3: Bas */}
        <View style={styles.row}>
          <View style={styles.spacer} />
          <DirectionButton
            direction="down"
            icon="↓"
            color="#68D391"
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
          color={isExecuting ? "#A0AEC0" : "#48BB78"}
          onPress={onExecute}
          disabled={!canExecute || isExecuting}
        />
        <ActionButton
          icon="↺"
          label="Recommencer"
          color="#E53E3E"
          onPress={onReset}
          disabled={!canReset}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(91, 141, 238, 0.2)',
  },
  directionalPad: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  directionButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  directionIcon: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  spacer: {
    width: 56,
    height: 56,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.3)',
    borderStyle: 'dashed',
  },
  centerIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(91, 141, 238, 0.5)',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 140,
  },
  actionIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
