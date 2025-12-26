import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AnimatedButterflyProps {
  position: 1 | 2 | 3 | 4 | 5 | 6;
}

export const AnimatedButterfly: React.FC<AnimatedButterflyProps> = ({ position }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Varied delays for each butterfly
    const delays = [0, 2000, 1000, 3000, 1500, 2500];
    const delay = delays[position - 1];

    // Varied animation speeds for natural movement
    const speeds = [1500, 1800, 1300, 2000, 1600, 1400];
    const speed = speeds[position - 1];

    // Varied movement ranges for diversity
    const xRanges = [
      [30, 60],
      [40, 80],
      [25, 50],
      [35, 70],
      [20, 45],
      [30, 55],
    ];
    const [xMid, xMax] = xRanges[position - 1];

    const yRanges = [
      [-20, 20],
      [-25, 25],
      [-15, 15],
      [-30, 30],
      [-18, 18],
      [-22, 22],
    ];
    const [yMin, yMax] = yRanges[position - 1];

    const startAnimation = () => {
      translateX.value = withRepeat(
        withSequence(
          withTiming(xMid, { duration: speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(xMax, { duration: speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(xMid, { duration: speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: speed, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      translateY.value = withRepeat(
        withSequence(
          withTiming(yMin, { duration: speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(yMax, { duration: speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: speed, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      rotation.value = withRepeat(
        withSequence(
          withTiming(10, { duration: speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(-10, { duration: speed, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: speed, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    };

    if (delay > 0) {
      setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }
  }, [position]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  // Different screen positions for each butterfly - spread across iPad landscape view
  const positionStyles = [
    { top: 200, left: 200 },      // Position 1: upper left
    { top: 250, right: 250 },     // Position 2: upper right
    { top: 400, left: 150 },      // Position 3: middle left
    { top: 350, right: 180 },     // Position 4: middle right
    { top: 500, left: 300 },      // Position 5: lower left-center
    { top: 180, right: 400 },     // Position 6: upper right-center
  ];
  const positionStyle = positionStyles[position - 1];

  return (
    <Animated.View style={[styles.butterfly, positionStyle, animatedStyle]}>
      <Text style={styles.emoji}>🦋</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  butterfly: {
    position: 'absolute',
    zIndex: 3,
  },
  emoji: {
    fontSize: 24,
  },
});
