import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../../theme';

interface FloatingFlowersProps {
  position: 'left' | 'right';
}

export const FloatingFlowers: React.FC<FloatingFlowersProps> = ({ position }) => {
  const flowers = position === 'left'
    ? [theme.colors.home.flowers.pink, theme.colors.home.flowers.yellow, theme.colors.home.flowers.purple]
    : [theme.colors.home.flowers.yellow, theme.colors.home.flowers.pink, theme.colors.home.flowers.purple];

  const positionStyle = position === 'left' ? { bottom: 130, left: 150 } : { bottom: 130, right: 170 };

  return (
    <View style={[styles.container, positionStyle]}>
      {flowers.map((color, index) => (
        <Flower key={index} color={color} delay={index * 300} />
      ))}
    </View>
  );
};

interface FlowerProps {
  color: string;
  delay: number;
}

const Flower: React.FC<FlowerProps> = ({ color, delay }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      rotation.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    };

    if (delay > 0) {
      setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return <Animated.View style={[styles.flower, { backgroundColor: color }, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 8,
    zIndex: 4,
  },
  flower: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
