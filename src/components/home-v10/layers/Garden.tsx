/**
 * Garden - Jardin central avec fleurs animées pour ForestBackground V10
 * 7 plantes avec animation de balancement + fleurs dispersées
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { HomeV10Colors, HomeV10ZIndex, HomeV10Animations } from '@/theme/home-v10-colors';

const gardenFlowers = ['🌸', '🌻', '🌷', '🌺', '🌼', '🌹', '🪻'];

interface GardenPlantProps {
  flower: string;
  delay: number;
}

const GardenPlant = memo(({ flower, delay }: GardenPlantProps) => {
  const rotate = useSharedValue(-4);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    rotate.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(4, {
            duration: HomeV10Animations.plantSway / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(-4, {
            duration: HomeV10Animations.plantSway / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      )
    );
  }, [reducedMotion, delay, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.plant, animatedStyle]}>
      <Text style={styles.plantFlower}>{flower}</Text>
      <View style={styles.plantStem} />
    </Animated.View>
  );
});

GardenPlant.displayName = 'GardenPlant';

// Fleurs dispersées dans l'herbe
const scatteredFlowers = [
  { emoji: '🌸', bottom: 85, left: 300 },
  { emoji: '🌼', bottom: 90, left: 450 },
  { emoji: '🌷', bottom: 82, left: 750 },
  { emoji: '🌻', bottom: 88, left: 900 },
  { emoji: '🌺', bottom: 95, right: 350 },
  { emoji: '🌸', bottom: 80, right: 500 },
];

interface ScatteredFlowerProps {
  emoji: string;
  bottom: number;
  left?: number;
  right?: number;
  delay: number;
}

const ScatteredFlower = memo(({ emoji, bottom, left, right, delay }: ScatteredFlowerProps) => {
  const rotate = useSharedValue(-3);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    rotate.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(3, {
            duration: HomeV10Animations.flowerSway / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(-3, {
            duration: HomeV10Animations.flowerSway / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      )
    );
  }, [reducedMotion, delay, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const positionStyle = {
    bottom,
    ...(left !== undefined ? { left } : {}),
    ...(right !== undefined ? { right } : {}),
  };

  return (
    <Animated.View style={[styles.scatteredFlower, positionStyle, animatedStyle]}>
      <Text style={styles.scatteredFlowerText}>{emoji}</Text>
    </Animated.View>
  );
});

ScatteredFlower.displayName = 'ScatteredFlower';

export const Garden = memo(() => {
  const { width } = useWindowDimensions();

  return (
    <>
      {/* Jardin central */}
      <View style={[styles.gardenContainer, { left: width / 2 - (gardenFlowers.length * 35) / 2 }]}>
        {gardenFlowers.map((flower, index) => (
          <GardenPlant key={index} flower={flower} delay={index * 400} />
        ))}
      </View>

      {/* Fleurs dispersées */}
      <View style={styles.scatteredContainer} pointerEvents="none">
        {scatteredFlowers.map((flower, index) => (
          <ScatteredFlower
            key={index}
            {...flower}
            delay={index * 500}
          />
        ))}
      </View>
    </>
  );
});

Garden.displayName = 'Garden';

const styles = StyleSheet.create({
  gardenContainer: {
    position: 'absolute',
    bottom: 70,
    flexDirection: 'row',
    gap: 35,
    zIndex: HomeV10ZIndex.garden,
  },
  plant: {
    alignItems: 'center',
  },
  plantFlower: {
    fontSize: 32,
  },
  plantStem: {
    width: 4,
    height: 28,
    backgroundColor: HomeV10Colors.grassDark,
    borderRadius: 2,
    marginTop: -8,
  },
  scatteredContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: HomeV10ZIndex.bushes,
  },
  scatteredFlower: {
    position: 'absolute',
  },
  scatteredFlowerText: {
    fontSize: 18,
  },
});
