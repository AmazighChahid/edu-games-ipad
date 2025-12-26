/**
 * StarsRow Component
 *
 * Rangée d'étoiles animées séquentiellement
 * Affiche le nombre d'étoiles obtenues (1-5)
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing } from '@/theme';

interface StarsRowProps {
  /** Nombre d'étoiles (1-5) */
  stars: 1 | 2 | 3 | 4 | 5;
  /** Nombre total d'étoiles à afficher */
  totalStars?: number;
  /** Taille des étoiles */
  size?: 'small' | 'medium' | 'large';
  /** Animer l'apparition */
  animated?: boolean;
  /** Délai initial avant animation (ms) */
  initialDelay?: number;
  /** Callback après animation complète */
  onAnimationComplete?: () => void;
}

const SIZES = {
  small: 24,
  medium: 40,
  large: 56,
};

const STAR_DELAY = 200; // Délai entre chaque étoile

export function StarsRow({
  stars,
  totalStars = 5,
  size = 'medium',
  animated = true,
  initialDelay = 300,
  onAnimationComplete,
}: StarsRowProps) {
  const starSize = SIZES[size];

  // Animation values pour chaque étoile
  const starScales = Array.from({ length: totalStars }, () => useSharedValue(animated ? 0 : 1));
  const starRotations = Array.from({ length: totalStars }, () => useSharedValue(animated ? -45 : 0));

  useEffect(() => {
    if (!animated) return;

    // Animer chaque étoile séquentiellement
    starScales.forEach((scale, index) => {
      const isEarned = index < stars;
      const delay = initialDelay + index * STAR_DELAY;

      // Animation de scale
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.3, { damping: 8, stiffness: 150 }),
          withSpring(1, { damping: 12 })
        )
      );

      // Animation de rotation
      starRotations[index].value = withDelay(
        delay,
        withSequence(
          withTiming(15, { duration: 100 }),
          withSpring(0, { damping: 10 })
        )
      );

      // Haptic feedback pour les étoiles gagnées
      if (isEarned) {
        setTimeout(() => {
          Haptics.impactAsync(
            index === stars - 1
              ? Haptics.ImpactFeedbackStyle.Heavy
              : Haptics.ImpactFeedbackStyle.Light
          );
        }, delay);
      }
    });

    // Callback après toutes les animations
    if (onAnimationComplete) {
      const totalDelay = initialDelay + totalStars * STAR_DELAY + 300;
      setTimeout(onAnimationComplete, totalDelay);
    }
  }, [animated, stars, initialDelay]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalStars }).map((_, index) => {
        const isEarned = index < stars;

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { scale: starScales[index].value },
            { rotate: `${starRotations[index].value}deg` },
          ],
        }));

        return (
          <Animated.View key={index} style={[styles.starContainer, animatedStyle]}>
            <Text
              style={[
                styles.star,
                {
                  fontSize: starSize,
                  opacity: isEarned ? 1 : 0.25,
                },
              ]}
            >
              {isEarned ? '⭐' : '☆'}
            </Text>

            {/* Glow effect for earned stars */}
            {isEarned && (
              <View
                style={[
                  styles.glow,
                  {
                    width: starSize * 1.5,
                    height: starSize * 1.5,
                  },
                ]}
              />
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  starContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    zIndex: 1,
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderRadius: 999,
    zIndex: 0,
  },
});

export default StarsRow;
