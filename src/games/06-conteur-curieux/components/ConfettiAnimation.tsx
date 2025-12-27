/**
 * ConfettiAnimation Component
 *
 * Animation de confettis qui tombent
 * Utilisé sur l'écran de victoire
 */

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

interface ConfettiProps {
  count?: number;
  duration?: number;
  colors?: string[];
  loop?: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  color: string;
  size: number;
  rotation: number;
  shape: 'circle' | 'square' | 'rectangle';
}

export function ConfettiAnimation({
  count = 30,
  duration = 3000,
  colors = ['#5B8DEE', '#FFB347', '#7BC74D', '#E056FD', '#FFD93D', '#FF6B6B'],
  loop = true,
}: ConfettiProps) {
  const { width, height } = useWindowDimensions();

  // Generate confetti pieces
  const confettiPieces = useMemo<ConfettiPiece[]>(() => {
    const pieces: ConfettiPiece[] = [];
    const shapes: ConfettiPiece['shape'][] = ['circle', 'square', 'rectangle'];

    for (let i = 0; i < count; i++) {
      pieces.push({
        id: i,
        x: Math.random() * width,
        delay: Math.random() * 2000,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    return pieces;
  }, [count, width, colors]);

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.map((piece) => (
        <ConfettiPieceComponent
          key={piece.id}
          piece={piece}
          duration={duration}
          height={height}
          loop={loop}
        />
      ))}
    </View>
  );
}

interface ConfettiPieceComponentProps {
  piece: ConfettiPiece;
  duration: number;
  height: number;
  loop: boolean;
}

function ConfettiPieceComponent({
  piece,
  duration,
  height,
  loop,
}: ConfettiPieceComponentProps) {
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const horizontalOffset = useSharedValue(0);

  useEffect(() => {
    // Falling animation
    progress.value = withDelay(
      piece.delay,
      loop
        ? withRepeat(
            withTiming(1, { duration, easing: Easing.linear }),
            -1,
            false
          )
        : withTiming(1, { duration, easing: Easing.linear })
    );

    // Rotation animation
    rotation.value = withDelay(
      piece.delay,
      withRepeat(
        withTiming(720, { duration: duration * 0.7, easing: Easing.linear }),
        -1,
        false
      )
    );

    // Horizontal sway
    horizontalOffset.value = withDelay(
      piece.delay,
      withRepeat(
        withTiming(20, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [-50, height + 50]);

    return {
      transform: [
        { translateY },
        { translateX: horizontalOffset.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: interpolate(progress.value, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
    };
  });

  const shapeStyle = useMemo(() => {
    switch (piece.shape) {
      case 'circle':
        return {
          width: piece.size,
          height: piece.size,
          borderRadius: piece.size / 2,
        };
      case 'square':
        return {
          width: piece.size,
          height: piece.size,
          borderRadius: 2,
        };
      case 'rectangle':
        return {
          width: piece.size,
          height: piece.size * 0.5,
          borderRadius: 2,
        };
    }
  }, [piece.shape, piece.size]);

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: piece.x,
          backgroundColor: piece.color,
          ...shapeStyle,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 10,
  },
  confetti: {
    position: 'absolute',
    top: 0,
  },
});

export default ConfettiAnimation;
