/**
 * GameBackground component
 * Immersive nature background with sky gradient, clouds, trees, flowers, and grass
 * Child-friendly design for "La Tour Magique" theme
 */

import { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface GameBackgroundProps {
  children: React.ReactNode;
}

// Color palette for the magic tower theme
const COLORS = {
  sky: ['#E8F6FF', '#D4EDFC', '#B8E6C1', '#98D9A8'] as const,
  grass: ['#7BC74D', '#5BAE6B'] as const,
  cloud: '#FFFFFF',
  tree: {
    crown: ['#5BAE6B', '#3D8B4D'] as const,
    crownLight: ['#6BC77D', '#4AA85C'] as const,
    trunk: '#8B5A2B',
  },
  flower: {
    pink: '#FFB5C5',
    yellow: '#FFD700',
    rose: '#FF91A4',
  },
};

// Cloud component with floating animation
function Cloud({
  style,
  size = 'medium',
  delay = 0,
}: {
  style: object;
  size?: 'small' | 'medium' | 'large';
  delay?: number;
}) {
  const translateY = useSharedValue(0);

  const dimensions = {
    small: { width: 80, height: 35, beforeWidth: 55, beforeHeight: 28 },
    medium: { width: 100, height: 45, beforeWidth: 70, beforeHeight: 35 },
    large: { width: 120, height: 50, beforeWidth: 80, beforeHeight: 40 },
  };

  const d = dimensions[size];

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.cloud, style, { width: d.width, height: d.height }, animatedStyle]}>
      <View style={[styles.cloudBefore, { width: d.beforeWidth, height: d.beforeHeight }]} />
    </Animated.View>
  );
}

// Tree component
function Tree({
  style,
  size = 'medium',
}: {
  style: object;
  size?: 'small' | 'medium' | 'large';
}) {
  const dimensions = {
    small: { crownWidth: 60, crownHeight: 90, trunkWidth: 15, trunkHeight: 30 },
    medium: { crownWidth: 70, crownHeight: 100, trunkWidth: 18, trunkHeight: 35 },
    large: { crownWidth: 80, crownHeight: 120, trunkWidth: 20, trunkHeight: 40 },
  };

  const d = dimensions[size];
  const crownColors = size === 'small' ? COLORS.tree.crownLight : COLORS.tree.crown;

  return (
    <View style={[styles.tree, style]}>
      <LinearGradient
        colors={crownColors as unknown as string[]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.treeCrown, { width: d.crownWidth, height: d.crownHeight }]}
      />
      <View
        style={[
          styles.treeTrunk,
          {
            width: d.trunkWidth,
            height: d.trunkHeight,
            backgroundColor: COLORS.tree.trunk,
          }
        ]}
      />
    </View>
  );
}

// Flower component
function Flower({
  style,
  color,
  size = 18,
}: {
  style: object;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.flower,
        style,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
        }
      ]}
    />
  );
}

export function GameBackground({ children }: GameBackgroundProps) {
  const { width, height } = useWindowDimensions();
  const grassHeight = Math.max(60, height * 0.08);

  return (
    <View style={styles.container}>
      {/* Sky gradient background */}
      <LinearGradient
        colors={COLORS.sky as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.4, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Clouds - positioned relative to screen */}
      <Cloud style={{ top: 60, left: width * 0.05 }} size="large" />
      <Cloud style={{ top: 90, left: width * 0.4 }} size="medium" delay={2000} />
      <Cloud style={{ top: 50, right: width * 0.08 }} size="small" delay={1000} />

      {/* Trees - left side, positioned above grass */}
      <Tree style={{ left: 20, bottom: grassHeight - 10 }} size="large" />
      <Tree style={{ left: 90, bottom: grassHeight + 10 }} size="small" />

      {/* Trees - right side */}
      <Tree style={{ right: 30, bottom: grassHeight - 10 }} size="medium" />
      <Tree style={{ right: 100, bottom: grassHeight + 5 }} size="small" />

      {/* Flowers scattered in grass area */}
      <Flower style={{ left: 150, bottom: grassHeight + 5 }} color={COLORS.flower.pink} size={16} />
      <Flower style={{ left: 180, bottom: grassHeight + 10 }} color={COLORS.flower.yellow} size={12} />
      <Flower style={{ right: 140, bottom: grassHeight + 8 }} color={COLORS.flower.rose} size={14} />
      <Flower style={{ right: 170, bottom: grassHeight + 3 }} color={COLORS.flower.pink} size={10} />
      <Flower style={{ left: width * 0.3, bottom: grassHeight + 6 }} color={COLORS.flower.yellow} size={13} />
      <Flower style={{ right: width * 0.35, bottom: grassHeight + 12 }} color={COLORS.flower.rose} size={11} />

      {/* Grass at the bottom */}
      <LinearGradient
        colors={COLORS.grass as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.grass, { height: grassHeight }]}
      />

      {/* Content - children rendered on top */}
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },

  // Cloud styles
  cloud: {
    position: 'absolute',
    backgroundColor: COLORS.cloud,
    borderRadius: 50,
    opacity: 0.9,
    zIndex: 1,
  },
  cloudBefore: {
    position: 'absolute',
    top: -15,
    left: '25%',
    backgroundColor: COLORS.cloud,
    borderRadius: 40,
  },

  // Tree styles
  tree: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 2,
  },
  treeCrown: {
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  treeTrunk: {
    marginTop: -5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  // Flower styles
  flower: {
    position: 'absolute',
    zIndex: 3,
  },

  // Grass styles
  grass: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
});
