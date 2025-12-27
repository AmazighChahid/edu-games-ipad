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
  onMove: (direction: Direction) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DirectionButton: React.FC<{
  direction: Direction;
  icon: string;
  onPress: () => void;
  style?: any;
}> = ({ direction, icon, onPress, style }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      style={[styles.button, style, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={`Déplacer vers ${direction === 'up' ? 'le haut' : direction === 'down' ? 'le bas' : direction === 'left' ? 'la gauche' : 'la droite'}`}
      accessibilityRole="button"
    >
      <Text style={styles.icon}>{icon}</Text>
    </AnimatedPressable>
  );
};

export const DirectionalControls: React.FC<Props> = ({ onMove }) => {
  return (
    <View style={styles.container}>
      <View style={styles.controlsGrid}>
        <View style={styles.row}>
          <View style={styles.spacer} />
          <DirectionButton direction="up" icon="⬆️" onPress={() => onMove('up')} />
          <View style={styles.spacer} />
        </View>
        <View style={styles.row}>
          <DirectionButton direction="left" icon="⬅️" onPress={() => onMove('left')} />
          <View style={styles.center} />
          <DirectionButton direction="right" icon="➡️" onPress={() => onMove('right')} />
        </View>
        <View style={styles.row}>
          <View style={styles.spacer} />
          <DirectionButton direction="down" icon="⬇️" onPress={() => onMove('down')} />
          <View style={styles.spacer} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  controlsGrid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#5B8DEE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 32,
  },
  spacer: {
    width: 64,
    height: 64,
  },
  center: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.3)',
    borderStyle: 'dashed',
  },
});
