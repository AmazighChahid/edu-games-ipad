/**
 * MagicScene SVG Illustration
 *
 * Scène magique pour les histoires de thème "magic"
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
  RadialGradient,
  Stop,
  G,
  Ellipse,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface MagicSceneProps {
  width: number;
  height: number;
  animated?: boolean;
}

export function MagicScene({ width, height, animated = true }: MagicSceneProps) {
  const starScale = useSharedValue(1);

  useEffect(() => {
    if (!animated) return;

    starScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [animated]);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 400 300">
        <Defs>
          {/* Night sky gradient */}
          <LinearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#1a1a2e" stopOpacity="1" />
            <Stop offset="0.5" stopColor="#16213e" stopOpacity="1" />
            <Stop offset="1" stopColor="#0f3460" stopOpacity="1" />
          </LinearGradient>

          {/* Magic glow */}
          <RadialGradient id="magicGlow" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#E056FD" stopOpacity="0.6" />
            <Stop offset="1" stopColor="#E056FD" stopOpacity="0" />
          </RadialGradient>

          {/* Castle gradient */}
          <LinearGradient id="castleGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4A4063" stopOpacity="1" />
            <Stop offset="1" stopColor="#2C2541" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Night sky */}
        <Rect x="0" y="0" width="400" height="300" fill="url(#nightSky)" />

        {/* Stars */}
        {[
          { x: 30, y: 20, r: 2 },
          { x: 80, y: 50, r: 1.5 },
          { x: 120, y: 30, r: 2 },
          { x: 180, y: 40, r: 1 },
          { x: 220, y: 25, r: 2.5 },
          { x: 280, y: 55, r: 1.5 },
          { x: 330, y: 35, r: 2 },
          { x: 370, y: 20, r: 1 },
          { x: 50, y: 80, r: 1 },
          { x: 150, y: 70, r: 1.5 },
          { x: 350, y: 65, r: 1 },
          { x: 250, y: 85, r: 2 },
        ].map((star, i) => (
          <Circle key={i} cx={star.x} cy={star.y} r={star.r} fill="white" opacity="0.8" />
        ))}

        {/* Shooting star */}
        <Path
          d="M 50 60 L 90 90"
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Moon */}
        <G transform="translate(320, 60)">
          <Circle cx="0" cy="0" r="35" fill="#F5F5DC" />
          <Circle cx="10" cy="-5" r="30" fill="url(#nightSky)" />
          {/* Moon craters */}
          <Circle cx="-15" cy="10" r="5" fill="#E5E5CC" opacity="0.5" />
          <Circle cx="-5" cy="-15" r="3" fill="#E5E5CC" opacity="0.5" />
        </G>

        {/* Magic castle */}
        <G transform="translate(200, 150)">
          {/* Main building */}
          <Rect x="-60" y="0" width="120" height="100" fill="url(#castleGradient)" />

          {/* Left tower */}
          <Rect x="-80" y="-30" width="30" height="130" fill="#3D3456" />
          <Polygon points="-80,-30 -65,-60 -50,-30" fill="#4A4063" />
          <Rect x="-75" y="20" width="8" height="15" fill="#FFD700" opacity="0.8" />

          {/* Right tower */}
          <Rect x="50" y="-30" width="30" height="130" fill="#3D3456" />
          <Polygon points="50,-30 65,-60 80,-30" fill="#4A4063" />
          <Rect x="57" y="20" width="8" height="15" fill="#FFD700" opacity="0.8" />

          {/* Center tower */}
          <Rect x="-20" y="-60" width="40" height="80" fill="#4A4063" />
          <Polygon points="-20,-60 0,-100 20,-60" fill="#5A507A" />
          <Circle cx="0" cy="-40" r="10" fill="#FFD700" opacity="0.9" />

          {/* Windows */}
          <Rect x="-40" y="20" width="15" height="25" fill="#FFD700" opacity="0.7" />
          <Rect x="25" y="20" width="15" height="25" fill="#FFD700" opacity="0.7" />
          <Rect x="-8" y="60" width="16" height="30" fill="#2C2541" rx="8" />

          {/* Flags */}
          <G transform="translate(-65, -60)">
            <Rect x="0" y="-25" width="2" height="25" fill="#8B4513" />
            <Path d="M 2 -25 L 15 -18 L 2 -10 Z" fill="#E74C3C" />
          </G>
          <G transform="translate(65, -60)">
            <Rect x="0" y="-25" width="2" height="25" fill="#8B4513" />
            <Path d="M 2 -25 L 15 -18 L 2 -10 Z" fill="#3498DB" />
          </G>
          <G transform="translate(0, -100)">
            <Rect x="-1" y="-30" width="2" height="30" fill="#8B4513" />
            <Path d="M 1 -30 L 18 -20 L 1 -10 Z" fill="#9B59B6" />
          </G>
        </G>

        {/* Magic particles/sparkles */}
        {[
          { x: 160, y: 120, r: 3 },
          { x: 240, y: 130, r: 2 },
          { x: 180, y: 80, r: 2.5 },
          { x: 220, y: 100, r: 2 },
          { x: 150, y: 160, r: 3 },
          { x: 250, y: 150, r: 2 },
        ].map((particle, i) => (
          <G key={i}>
            <Circle cx={particle.x} cy={particle.y} r={particle.r * 3} fill="url(#magicGlow)" />
            <Circle cx={particle.x} cy={particle.y} r={particle.r} fill="#E056FD" />
          </G>
        ))}

        {/* Magic wand with sparkle */}
        <G transform="translate(100, 200)">
          <Rect x="0" y="0" width="5" height="40" fill="#8B4513" rx="2" />
          <Rect x="-2" y="-5" width="9" height="10" fill="#FFD700" rx="2" />
          {/* Sparkle */}
          <Path
            d="M 2 -20 L 4 -10 L 8 -15 L 4 -18 L 10 -20 L 4 -22 L 8 -25 L 4 -22 L 2 -30 L 0 -22 L -4 -25 L 0 -22 L -6 -20 L 0 -18 L -4 -15 L 0 -18 Z"
            fill="#FFD700"
          />
        </G>

        {/* Ground with grass */}
        <Rect x="0" y="250" width="400" height="50" fill="#1a472a" />
        <Ellipse cx="100" cy="255" rx="80" ry="15" fill="#0d3320" />
        <Ellipse cx="300" cy="258" rx="100" ry="18" fill="#0d3320" />

        {/* Mushrooms */}
        <G transform="translate(60, 265)">
          <Rect x="-3" y="0" width="6" height="15" fill="#F5DEB3" />
          <Ellipse cx="0" cy="0" rx="12" ry="8" fill="#E74C3C" />
          <Circle cx="-4" cy="-2" r="2" fill="white" />
          <Circle cx="4" cy="2" r="1.5" fill="white" />
        </G>
        <G transform="translate(340, 260)">
          <Rect x="-2" y="0" width="4" height="12" fill="#F5DEB3" />
          <Ellipse cx="0" cy="0" rx="8" ry="5" fill="#9B59B6" />
          <Circle cx="-2" cy="-1" r="1.5" fill="white" />
          <Circle cx="3" cy="1" r="1" fill="white" />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
  },
});

export default MagicScene;
