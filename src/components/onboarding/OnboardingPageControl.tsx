/**
 * OnboardingPageControl
 * Indicateurs de page (dots) pour l'onboarding
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

interface OnboardingPageControlProps {
  count: number;
  currentIndex: number;
}

interface DotProps {
  index: number;
  currentIndex: number;
}

function Dot({ index, currentIndex }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = index === currentIndex;

    return {
      width: withSpring(isActive ? 32 : 10, {
        damping: 15,
        stiffness: 150,
      }),
      backgroundColor: isActive ? colors.primary.main : colors.ui.border,
      transform: [
        {
          scale: withSpring(isActive ? 1 : 0.8, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  }, [currentIndex]);

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function OnboardingPageControl({
  count,
  currentIndex,
}: OnboardingPageControlProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Dot key={index} index={index} currentIndex={currentIndex} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
});

export default OnboardingPageControl;
