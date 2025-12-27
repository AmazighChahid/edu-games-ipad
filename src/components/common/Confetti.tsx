/**
 * Confetti Component
 *
 * Animation de confettis unifiée pour les écrans de victoire
 * Supporte 2 modes : emoji (icônes) et shapes (formes géométriques)
 *
 * @example
 * // Mode emoji (défaut)
 * <Confetti type="emoji" />
 *
 * // Mode shapes avec couleurs custom
 * <Confetti type="shapes" colors={['#5B8DEE', '#FFB347']} />
 */

import { useEffect, useMemo } from 'react';
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

// Types
type ConfettiType = 'emoji' | 'shapes';
type ShapeType = 'circle' | 'square' | 'rectangle';

interface ConfettiProps {
  /** Type de confetti : emoji ou formes géométriques */
  type?: ConfettiType;
  /** Nombre de confettis */
  count?: number;
  /** Durée de l'animation en ms */
  duration?: number;
  /** Couleurs des confettis (pour type 'shapes') */
  colors?: string[];
  /** Emojis à utiliser (pour type 'emoji') */
  emojis?: string[];
  /** Animation en boucle */
  loop?: boolean;
  /** Désactiver l'animation (accessibilité) */
  disabled?: boolean;
}

interface ConfettiPieceData {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotationSpeed: number;
  size: number;
  // Pour type 'emoji'
  emoji?: string;
  // Pour type 'shapes'
  color?: string;
  shape?: ShapeType;
}

// Valeurs par défaut
const DEFAULT_EMOJIS = ['🎉', '⭐', '🌟', '💫', '✨', '🎊'];
const DEFAULT_COLORS = ['#5B8DEE', '#FFB347', '#7BC74D', '#E056FD', '#FFD93D', '#FF6B6B'];
const DEFAULT_COUNT = 25;
const DEFAULT_DURATION = 3000;

/**
 * Composant interne pour un confetti emoji
 */
function EmojiConfettiPiece({
  emoji,
  x,
  delay,
  duration,
  rotationSpeed,
  size,
  height,
  loop,
}: ConfettiPieceData & { height: number; loop: boolean }) {
  const translateY = useSharedValue(-50);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Animation de chute
    translateY.value = withDelay(
      delay,
      loop
        ? withRepeat(
            withTiming(height + 50, { duration, easing: Easing.inOut(Easing.quad) }),
            -1,
            false
          )
        : withTiming(height + 50, { duration, easing: Easing.inOut(Easing.quad) })
    );

    // Animation de rotation
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: duration / rotationSpeed, easing: Easing.linear }),
        -1,
        false
      )
    );

    // Fade out à la fin (seulement si pas en boucle)
    if (!loop) {
      opacity.value = withDelay(
        delay + duration - 500,
        withTiming(0, { duration: 500 })
      );
    }
  }, [delay, duration, rotationSpeed, height, loop]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        styles.emojiConfetti,
        { left: x, fontSize: size },
        animatedStyle,
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

/**
 * Composant interne pour un confetti forme géométrique
 */
function ShapeConfettiPiece({
  color,
  shape,
  x,
  delay,
  duration,
  size,
  height,
  loop,
}: ConfettiPieceData & { height: number; loop: boolean }) {
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const horizontalOffset = useSharedValue(0);

  useEffect(() => {
    // Animation de chute
    progress.value = withDelay(
      delay,
      loop
        ? withRepeat(
            withTiming(1, { duration, easing: Easing.linear }),
            -1,
            false
          )
        : withTiming(1, { duration, easing: Easing.linear })
    );

    // Animation de rotation
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(720, { duration: duration * 0.7, easing: Easing.linear }),
        -1,
        false
      )
    );

    // Oscillation horizontale
    horizontalOffset.value = withDelay(
      delay,
      withRepeat(
        withTiming(20, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );
  }, [delay, duration, height, loop]);

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

  // Style de la forme
  const shapeStyle = useMemo(() => {
    switch (shape) {
      case 'circle':
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
        };
      case 'square':
        return {
          width: size,
          height: size,
          borderRadius: 2,
        };
      case 'rectangle':
        return {
          width: size,
          height: size * 0.5,
          borderRadius: 2,
        };
      default:
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
        };
    }
  }, [shape, size]);

  return (
    <Animated.View
      style={[
        styles.shapeConfetti,
        { left: x, backgroundColor: color },
        shapeStyle,
        animatedStyle,
      ]}
    />
  );
}

/**
 * Composant Confetti unifié
 */
export function Confetti({
  type = 'emoji',
  count = DEFAULT_COUNT,
  duration = DEFAULT_DURATION,
  colors = DEFAULT_COLORS,
  emojis = DEFAULT_EMOJIS,
  loop = true,
  disabled = false,
}: ConfettiProps) {
  const { width, height } = useWindowDimensions();

  // Génération des pièces de confetti
  const confettiPieces = useMemo<ConfettiPieceData[]>(() => {
    if (disabled) return [];

    const shapes: ShapeType[] = ['circle', 'square', 'rectangle'];

    return Array.from({ length: count }, (_, i) => {
      const baseData: ConfettiPieceData = {
        id: i,
        x: Math.random() * width,
        delay: Math.random() * 2000,
        duration: duration + Math.random() * 500,
        rotationSpeed: 1 + Math.random() * 1.5,
        size: type === 'emoji' ? 20 + Math.random() * 12 : 8 + Math.random() * 8,
      };

      if (type === 'emoji') {
        return {
          ...baseData,
          emoji: emojis[i % emojis.length],
        };
      } else {
        return {
          ...baseData,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        };
      }
    });
  }, [count, width, duration, type, colors, emojis, disabled]);

  if (disabled || confettiPieces.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.map((piece) =>
        type === 'emoji' ? (
          <EmojiConfettiPiece
            key={piece.id}
            {...piece}
            height={height}
            loop={loop}
          />
        ) : (
          <ShapeConfettiPiece
            key={piece.id}
            {...piece}
            height={height}
            loop={loop}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 10,
  },
  emojiConfetti: {
    position: 'absolute',
    top: 0,
  },
  shapeConfetti: {
    position: 'absolute',
    top: 0,
  },
});

export default Confetti;
