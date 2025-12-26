/**
 * ConfettiLayer Component
 * Falling confetti animation using Reanimated only (no external library)
 */

import { useMemo, useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_EMOJIS = ['🎉', '⭐', '🌟', '💫', '✨', '🎊'];
const CONFETTI_COUNT = 20;

interface ConfettiPiece {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  rotationSpeed: number;
  size: number;
}

interface ConfettiItemProps extends ConfettiPiece {}

function ConfettiItem({
  emoji,
  x,
  delay,
  duration,
  rotationSpeed,
  size,
}: ConfettiItemProps) {
  const translateY = useSharedValue(-50);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Fall animation
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 50, {
        duration,
        easing: Easing.inOut(Easing.quad),
      })
    );

    // Rotation animation
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, {
          duration: duration / rotationSpeed,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Fade out near the end
    opacity.value = withDelay(
      delay + duration - 500,
      withTiming(0, { duration: 500 })
    );
  }, [delay, duration, rotationSpeed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        styles.confetti,
        {
          left: x,
          fontSize: size,
        },
        animatedStyle,
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

export function ConfettiLayer() {
  const confettiPieces = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        x: Math.random() * SCREEN_WIDTH,
        delay: Math.random() * 200, // Stagger within first 200ms
        duration: 2500 + Math.random() * 500, // 2.5-3s duration
        rotationSpeed: 1 + Math.random() * 1.5,
        size: 20 + Math.random() * 12, // 20-32 font size
      })),
    []
  );

  return (
    <>
      {confettiPieces.map((piece) => (
        <ConfettiItem key={piece.id} {...piece} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
    top: 0,
  },
});
