/**
 * MathBlock component
 * A single block displaying either a calculation or a result
 * With gravity fall and explosion animations
 */

import { useEffect } from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import { colors, borderRadius, spacing } from '../../../theme';
import type { MathBlock as MathBlockType } from '../types';

interface MathBlockProps {
  block: MathBlockType;
  size: number;
  onPress: (block: MathBlockType) => void;
  targetRow?: number; // For gravity animation
  onExplosionComplete?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Particle component for explosion effect
function ExplosionParticle({
  delay,
  angle,
  distance,
  size,
  color,
}: {
  delay: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const radians = (angle * Math.PI) / 180;
    const targetX = Math.cos(radians) * distance;
    const targetY = Math.sin(radians) * distance;

    translateX.value = withDelay(
      delay,
      withTiming(targetX, { duration: 400, easing: Easing.out(Easing.quad) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(targetY, { duration: 400, easing: Easing.out(Easing.quad) })
    );
    scale.value = withDelay(
      delay,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) })
    );
    opacity.value = withDelay(delay, withTiming(0, { duration: 350 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function MathBlock({
  block,
  size,
  onPress,
  targetRow,
  onExplosionComplete,
}: MathBlockProps) {
  const isOperation = block.type === 'operation';

  // Animation values
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const showExplosion = useSharedValue(false);

  // Handle gravity animation when targetRow changes
  useEffect(() => {
    if (targetRow !== undefined && targetRow !== block.row) {
      const distance = (targetRow - block.row) * (size + spacing[2]);
      translateY.value = withSpring(distance, {
        damping: 12,
        stiffness: 100,
        mass: 0.8,
      });
    }
  }, [targetRow, block.row, size]);

  // Handle match/explosion animation
  useEffect(() => {
    if (block.isMatched) {
      showExplosion.value = true;

      // Scale up then disappear
      scale.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withTiming(0, { duration: 250 })
      );
      opacity.value = withDelay(100, withTiming(0, { duration: 200 }));

      // Callback after explosion
      if (onExplosionComplete) {
        setTimeout(() => {
          runOnJS(onExplosionComplete)();
        }, 350);
      }
    }
  }, [block.isMatched]);

  const animatedStyle = useAnimatedStyle(() => {
    const baseTransform = [
      { translateY: translateY.value },
      { scale: scale.value },
    ];

    if (block.isSelected) {
      return {
        transform: [
          { translateY: translateY.value },
          { scale: withSpring(1.1, { damping: 12 }) },
        ],
        shadowOpacity: withSpring(0.3),
        opacity: 1,
      };
    }

    return {
      transform: baseTransform,
      shadowOpacity: 0.1,
      opacity: opacity.value,
    };
  });

  const backgroundColor = isOperation
    ? colors.primary.main
    : colors.secondary.main;

  const selectedBorderColor = block.isSelected
    ? colors.feedback.success
    : 'transparent';

  // Generate explosion particles
  const particles = block.isMatched
    ? Array.from({ length: 8 }).map((_, i) => ({
        angle: i * 45,
        delay: Math.random() * 50,
        distance: size * 0.8 + Math.random() * size * 0.4,
        particleSize: 6 + Math.random() * 8,
        color:
          i % 2 === 0
            ? isOperation
              ? colors.primary.light
              : colors.secondary.light
            : '#FFD700',
      }))
    : [];

  return (
    <View style={{ width: size, height: size }}>
      <AnimatedPressable
        onPress={() => !block.isMatched && onPress(block)}
        style={[
          styles.container,
          {
            width: size,
            height: size,
            backgroundColor,
            borderColor: selectedBorderColor,
          },
          animatedStyle,
        ]}
        disabled={block.isMatched}
      >
        {/* Top highlight */}
        <Animated.View style={[styles.highlight, { height: size * 0.2 }]} />

        {/* Content */}
        <Text
          style={[
            styles.text,
            {
              fontSize: isOperation ? size * 0.22 : size * 0.35,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {block.display}
        </Text>

        {/* Bottom shadow */}
        <Animated.View style={[styles.shadow, { height: size * 0.1 }]} />
      </AnimatedPressable>

      {/* Explosion particles */}
      {block.isMatched && (
        <View style={styles.explosionContainer}>
          {particles.map((p, i) => (
            <ExplosionParticle
              key={i}
              angle={p.angle}
              delay={p.delay}
              distance={p.distance}
              size={p.particleSize}
              color={p.color}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    // Shadow
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  text: {
    color: colors.text.inverse,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: spacing[1],
  },
  explosionContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
