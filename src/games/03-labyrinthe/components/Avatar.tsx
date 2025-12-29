import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { Icons } from '@/constants/icons';
import { GameStatus, Direction } from '../types';

interface Props {
  animatedPosition: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  };
  direction: Direction;
  cellSize: number;
  status: GameStatus;
}

export const Avatar: React.FC<Props> = ({ animatedPosition, direction, cellSize, status }) => {
  // Style animé pour la position
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: animatedPosition.x.value },
        { translateY: animatedPosition.y.value },
      ],
    };
  });

  // Rotation selon la direction
  const getRotation = () => {
    switch (direction) {
      case 'up':
        return '0deg';
      case 'right':
        return '90deg';
      case 'down':
        return '180deg';
      case 'left':
        return '270deg';
    }
  };

  // Emoji ou image de l'avatar
  const getAvatarEmoji = () => {
    switch (status) {
      case 'blocked':
      case 'door_locked':
        return Icons.thinking;
      case 'victory':
        return Icons.celebration;
      case 'interacting':
      case 'door_opening':
        return Icons.sparkles;
      default:
        return '🧒';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { width: cellSize * 0.8, height: cellSize * 0.8 },
        animatedStyle,
      ]}
    >
      <Animated.Text
        style={[
          styles.avatar,
          { fontSize: cellSize * 0.5, transform: [{ rotate: getRotation() }] },
        ]}
      >
        {getAvatarEmoji()}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  avatar: {
    textAlign: 'center',
  },
});
