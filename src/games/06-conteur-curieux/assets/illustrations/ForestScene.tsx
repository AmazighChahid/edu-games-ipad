/**
 * ForestScene SVG Illustration
 *
 * Scène de forêt pour les histoires de thème "nature"
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Polygon,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Ellipse,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface ForestSceneProps {
  width: number;
  height: number;
  animated?: boolean;
}

export function ForestScene({ width, height, animated = true }: ForestSceneProps) {
  const sunScale = useSharedValue(1);
  const butterflyX = useSharedValue(0);
  const butterflyY = useSharedValue(0);
  const cloudX = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;

    // Sun pulsing
    sunScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Butterfly movement
    butterflyX.value = withRepeat(
      withTiming(50, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    butterflyY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 500 }),
        withTiming(10, { duration: 500 })
      ),
      -1,
      true
    );

    // Cloud drift
    cloudX.value = withRepeat(
      withTiming(30, { duration: 8000, easing: Easing.linear }),
      -1,
      true
    );
  }, [animated]);

  const sunAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sunScale.value }],
  }));

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 400 300">
        <Defs>
          {/* Sky gradient */}
          <LinearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#87CEEB" stopOpacity="1" />
            <Stop offset="1" stopColor="#B0E0E6" stopOpacity="1" />
          </LinearGradient>

          {/* Ground gradient */}
          <LinearGradient id="groundGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7BC74D" stopOpacity="1" />
            <Stop offset="1" stopColor="#5A9A3D" stopOpacity="1" />
          </LinearGradient>

          {/* Tree trunk gradient */}
          <LinearGradient id="trunkGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#8B4513" stopOpacity="1" />
            <Stop offset="0.5" stopColor="#A0522D" stopOpacity="1" />
            <Stop offset="1" stopColor="#8B4513" stopOpacity="1" />
          </LinearGradient>

          {/* Foliage gradient */}
          <LinearGradient id="foliageGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#228B22" stopOpacity="1" />
            <Stop offset="1" stopColor="#006400" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Sky */}
        <Rect x="0" y="0" width="400" height="200" fill="url(#skyGradient)" />

        {/* Sun */}
        <G transform="translate(320, 50)">
          <Circle cx="0" cy="0" r="35" fill="#FFD93D" opacity="0.3" />
          <Circle cx="0" cy="0" r="25" fill="#FFD93D" />
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <Path
              key={i}
              d={`M 0 -35 L 3 -50 L -3 -50 Z`}
              fill="#FFD93D"
              transform={`rotate(${angle})`}
            />
          ))}
        </G>

        {/* Clouds */}
        <G transform="translate(50, 40)">
          <Ellipse cx="0" cy="0" rx="30" ry="15" fill="white" opacity="0.9" />
          <Ellipse cx="25" cy="-5" rx="25" ry="12" fill="white" opacity="0.9" />
          <Ellipse cx="-20" cy="5" rx="20" ry="10" fill="white" opacity="0.9" />
        </G>
        <G transform="translate(200, 30)">
          <Ellipse cx="0" cy="0" rx="25" ry="12" fill="white" opacity="0.8" />
          <Ellipse cx="20" cy="-3" rx="20" ry="10" fill="white" opacity="0.8" />
        </G>

        {/* Ground */}
        <Rect x="0" y="200" width="400" height="100" fill="url(#groundGradient)" />

        {/* Hills */}
        <Ellipse cx="100" cy="210" rx="120" ry="40" fill="#6AAF4A" />
        <Ellipse cx="300" cy="215" rx="150" ry="50" fill="#5A9F3A" />

        {/* Trees */}
        {/* Tree 1 (left) */}
        <G transform="translate(60, 160)">
          <Rect x="-8" y="0" width="16" height="50" fill="url(#trunkGradient)" />
          <Polygon points="0,-80 -40,0 40,0" fill="#228B22" />
          <Polygon points="0,-60 -35,10 35,10" fill="#2E8B2E" />
          <Polygon points="0,-40 -30,20 30,20" fill="#32CD32" />
        </G>

        {/* Tree 2 (center-left) */}
        <G transform="translate(140, 170)">
          <Rect x="-6" y="0" width="12" height="40" fill="url(#trunkGradient)" />
          <Polygon points="0,-60 -30,0 30,0" fill="#228B22" />
          <Polygon points="0,-45 -25,5 25,5" fill="#2E8B2E" />
        </G>

        {/* Tree 3 (center-right) */}
        <G transform="translate(260, 165)">
          <Rect x="-7" y="0" width="14" height="45" fill="url(#trunkGradient)" />
          <Polygon points="0,-70 -35,0 35,0" fill="#228B22" />
          <Polygon points="0,-55 -30,5 30,5" fill="#2E8B2E" />
          <Polygon points="0,-35 -25,15 25,15" fill="#32CD32" />
        </G>

        {/* Tree 4 (right) */}
        <G transform="translate(340, 175)">
          <Rect x="-5" y="0" width="10" height="35" fill="url(#trunkGradient)" />
          <Polygon points="0,-50 -25,0 25,0" fill="#228B22" />
          <Polygon points="0,-35 -20,5 20,5" fill="#2E8B2E" />
        </G>

        {/* Flowers */}
        {[
          { x: 30, y: 250, color: '#FF69B4' },
          { x: 90, y: 260, color: '#FFD700' },
          { x: 180, y: 255, color: '#FF6347' },
          { x: 280, y: 260, color: '#DA70D6' },
          { x: 350, y: 250, color: '#FF69B4' },
        ].map((flower, i) => (
          <G key={i} transform={`translate(${flower.x}, ${flower.y})`}>
            <Circle cx="0" cy="0" r="6" fill={flower.color} />
            <Circle cx="0" cy="0" r="3" fill="#FFD700" />
            <Rect x="-1" y="0" width="2" height="15" fill="#228B22" />
          </G>
        ))}

        {/* Butterfly */}
        <G transform="translate(180, 120)">
          <Ellipse cx="0" cy="0" rx="2" ry="6" fill="#333" />
          <Path d="M 0 -3 Q 10 -10, 8 0 Q 10 10, 0 3" fill="#FF69B4" />
          <Path d="M 0 -3 Q -10 -10, -8 0 Q -10 10, 0 3" fill="#FF69B4" />
          <Circle cx="0" cy="-8" r="2" fill="#333" />
        </G>

        {/* Path */}
        <Path
          d="M 200 300 Q 180 260, 200 230 Q 220 200, 200 180"
          fill="none"
          stroke="#D2B48C"
          strokeWidth="15"
          opacity="0.6"
        />
      </Svg>

      {/* Animated sun overlay */}
      {animated && (
        <Animated.View
          style={[
            styles.sunOverlay,
            { top: 15, right: 45 },
            sunAnimatedStyle,
          ]}
        >
          <View style={styles.sunGlow} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  sunOverlay: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunGlow: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFD93D',
    opacity: 0.2,
  },
});

export default ForestScene;
