import { useSharedValue, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { useCallback } from 'react';
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
  const animateMove = useCallback((newPosition: Position, cellSize: number) => {
    x.value = withSpring(newPosition.x * cellSize, SPRING_CONFIG);
    y.value = withSpring(newPosition.y * cellSize, SPRING_CONFIG);
  }, []);

  /**
   * Anime un rebond quand bloqué
   */
  const animateBlocked = useCallback((direction: 'up' | 'down' | 'left' | 'right', cellSize: number) => {
    const offset = cellSize * 0.15;
    const currentX = x.value;
    const currentY = y.value;

    switch (direction) {
      case 'up':
        y.value = withSequence(
          withTiming(currentY - offset, { duration: 100 }),
          withSpring(currentY, SPRING_CONFIG)
        );
        break;
      case 'down':
        y.value = withSequence(
          withTiming(currentY + offset, { duration: 100 }),
          withSpring(currentY, SPRING_CONFIG)
        );
        break;
      case 'left':
        x.value = withSequence(
          withTiming(currentX - offset, { duration: 100 }),
          withSpring(currentX, SPRING_CONFIG)
        );
        break;
      case 'right':
        x.value = withSequence(
          withTiming(currentX + offset, { duration: 100 }),
          withSpring(currentX, SPRING_CONFIG)
        );
        break;
    }
  }, []);

  /**
   * Position initiale de l'avatar
   */
  const setInitialPosition = useCallback((position: Position, cellSize: number) => {
    x.value = position.x * cellSize;
    y.value = position.y * cellSize;
  }, []);

  return {
    animatedPosition: { x, y },
    animateMove,
    animateBlocked,
    setInitialPosition,
  };
}
