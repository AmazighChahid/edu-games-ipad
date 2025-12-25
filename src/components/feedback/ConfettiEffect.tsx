/**
 * Effet de confettis pour les célébrations
 */

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiPieceProps {
  color: string;
  delay: number;
  startX: number;
  duration: number;
  size: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({
  color,
  delay,
  startX,
  duration,
  size,
}) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration,
        easing: Easing.out(Easing.quad),
      })
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(Math.random() > 0.5 ? 50 : -50, { duration: 500 }),
        -1,
        true
      )
    );

    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration: 1000 }), -1)
    );

    opacity.value = withDelay(
      delay + duration * 0.8,
      withTiming(0, { duration: duration * 0.2 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: color,
          width: size,
          height: size * 0.6,
          left: startX,
          borderRadius: size * 0.2,
        },
        animatedStyle,
      ]}
    />
  );
};

interface ConfettiEffectProps {
  active: boolean;
  onComplete?: () => void;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  active,
  onComplete,
}) => {
  const confettiColors = [
    Colors.discs.small,
    Colors.discs.medium,
    Colors.discs.large,
    Colors.secondary.soft,
    Colors.primary.soft,
    '#FFD700', // Or
    '#FF69B4', // Rose
  ];

  // Générer les pièces de confetti
  const confettiPieces = useMemo(() => {
    if (!active) return [];

    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 1000,
      startX: Math.random() * SCREEN_WIDTH,
      duration: 2000 + Math.random() * 1500,
      size: 8 + Math.random() * 8,
    }));
  }, [active]);

  useEffect(() => {
    if (active && onComplete) {
      const timer = setTimeout(onComplete, 3500);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          color={piece.color}
          delay={piece.delay}
          startX={piece.startX}
          duration={piece.duration}
          size={piece.size}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    top: 0,
  },
});
