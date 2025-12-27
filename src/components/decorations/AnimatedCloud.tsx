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

interface AnimatedCloudProps {
  position: 'left' | 'center' | 'right';
  delay?: number;
}

export const AnimatedCloud: React.FC<AnimatedCloudProps> = ({ position, delay = 0 }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      translateX.value = withRepeat(
        withSequence(
          withTiming(15, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
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
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const getPositionStyle = () => {
    switch (position) {
      case 'left':
        return { top: 50, left: 60, width: 100, height: 40 };
      case 'center':
        return { top: 80, left: 250, width: 80, height: 32 };
      case 'right':
        return { top: 40, right: 280, width: 90, height: 36 };
    }
  };

  const getCircleStyle = () => {
    switch (position) {
      case 'left':
        return [
          { top: -20, left: 20, width: 60, height: 35 },
          { top: -10, left: 50, width: 40, height: 25 },
        ];
      case 'center':
        return [{ top: -15, left: 15, width: 50, height: 28 }];
      case 'right':
        return [{ top: -18, left: 25, width: 55, height: 30 }];
    }
  };

  const positionStyle = getPositionStyle();
  const circles = getCircleStyle();

  return (
    <Animated.View style={[styles.cloud, positionStyle, animatedStyle]}>
      {circles.map((circle, index) => (
        <View key={index} style={[styles.cloudCircle, circle]} />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    backgroundColor: theme.colors.home.clouds.white,
    borderRadius: 50,
    opacity: 0.9,
    zIndex: 1,
  },
  cloudCircle: {
    position: 'absolute',
    backgroundColor: theme.colors.home.clouds.white,
    borderRadius: 999,
  },
});
