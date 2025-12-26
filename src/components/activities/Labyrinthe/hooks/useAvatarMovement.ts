import { useSharedValue } from 'react-native-reanimated';
import { withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { Position } from '../types';

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

export function useAvatarMovement() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  /**
   * Anime le déplacement vers une nouvelle position
   */
  const animateMove = (newPosition: Position, cellSize: number) => {
    'worklet';
    x.value = withSpring(newPosition.x * cellSize, SPRING_CONFIG);
    y.value = withSpring(newPosition.y * cellSize, SPRING_CONFIG);
  };

  /**
   * Anime un rebond quand bloqué
   */
  const animateBlocked = (direction: 'up' | 'down' | 'left' | 'right', cellSize: number) => {
    'worklet';
    const offset = cellSize * 0.15;

    switch (direction) {
      case 'up':
        y.value = withSequence(
          withTiming(y.value - offset, { duration: 100 }),
          withSpring(y.value, SPRING_CONFIG)
        );
        break;
      case 'down':
        y.value = withSequence(
          withTiming(y.value + offset, { duration: 100 }),
          withSpring(y.value, SPRING_CONFIG)
        );
        break;
      case 'left':
        x.value = withSequence(
          withTiming(x.value - offset, { duration: 100 }),
          withSpring(x.value, SPRING_CONFIG)
        );
        break;
      case 'right':
        x.value = withSequence(
          withTiming(x.value + offset, { duration: 100 }),
          withSpring(x.value, SPRING_CONFIG)
        );
        break;
    }
  };

  /**
   * Position initiale de l'avatar
   */
  const setInitialPosition = (position: Position, cellSize: number) => {
    'worklet';
    x.value = position.x * cellSize;
    y.value = position.y * cellSize;
  };

  return {
    animatedPosition: { x, y },
    animateMove,
    animateBlocked,
    setInitialPosition,
  };
}
