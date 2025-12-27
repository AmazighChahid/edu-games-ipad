/**
 * AdventureScene SVG Illustration
 *
 * Scène d'aventure pour les histoires de thème "adventure"
 */

import React from 'react';
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

interface AdventureSceneProps {
  width: number;
  height: number;
  animated?: boolean;
}

export function AdventureScene({ width, height }: AdventureSceneProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 400 300">
        <Defs>
          {/* Sky gradient */}
          <LinearGradient id="adventureSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FF7F50" stopOpacity="1" />
            <Stop offset="0.5" stopColor="#FFB347" stopOpacity="1" />
            <Stop offset="1" stopColor="#FFD700" stopOpacity="1" />
          </LinearGradient>

          {/* Mountain gradient */}
          <LinearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#6B5B95" stopOpacity="1" />
            <Stop offset="1" stopColor="#4A4063" stopOpacity="1" />
          </LinearGradient>

          {/* Sand gradient */}
          <LinearGradient id="sandGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F4D03F" stopOpacity="1" />
            <Stop offset="1" stopColor="#E9B824" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Sky */}
        <Rect x="0" y="0" width="400" height="200" fill="url(#adventureSky)" />

        {/* Sun setting */}
        <Circle cx="200" cy="180" r="50" fill="#FF6347" opacity="0.8" />
        <Circle cx="200" cy="180" r="40" fill="#FF7F50" />

        {/* Mountains (background) */}
        <Polygon points="0,200 80,100 160,200" fill="#8E7CC3" />
        <Polygon points="100,200 200,80 300,200" fill="url(#mountainGradient)" />
        <Polygon points="240,200 340,120 400,200" fill="#7B68AB" />

        {/* Snow caps */}
        <Polygon points="200,80 180,110 220,110" fill="white" opacity="0.9" />
        <Polygon points="340,120 325,140 355,140" fill="white" opacity="0.8" />

        {/* Desert/Sand */}
        <Rect x="0" y="200" width="400" height="100" fill="url(#sandGradient)" />

        {/* Sand dunes */}
        <Ellipse cx="80" cy="220" rx="100" ry="30" fill="#DDA520" opacity="0.6" />
        <Ellipse cx="320" cy="230" rx="120" ry="40" fill="#DAA520" opacity="0.5" />

        {/* Treasure chest */}
        <G transform="translate(180, 240)">
          {/* Chest body */}
          <Rect x="-25" y="0" width="50" height="30" fill="#8B4513" rx="3" />
          {/* Chest lid */}
          <Path
            d="M -25 0 Q -25 -15, 0 -15 Q 25 -15, 25 0 Z"
            fill="#A0522D"
          />
          {/* Chest band */}
          <Rect x="-25" y="8" width="50" height="5" fill="#DAA520" />
          <Rect x="-3" y="-5" width="6" height="20" fill="#DAA520" />
          {/* Lock */}
          <Circle cx="0" cy="12" r="5" fill="#FFD700" />
          <Rect x="-2" y="12" width="4" height="6" fill="#FFD700" />
        </G>

        {/* Palm tree (left) */}
        <G transform="translate(50, 210)">
          <Rect x="-5" y="0" width="10" height="50" fill="#8B4513" />
          {/* Trunk texture */}
          <Rect x="-5" y="10" width="10" height="3" fill="#6B3F12" />
          <Rect x="-5" y="20" width="10" height="3" fill="#6B3F12" />
          <Rect x="-5" y="30" width="10" height="3" fill="#6B3F12" />
          {/* Leaves */}
          <Path d="M 0 -10 Q 30 -20, 40 0" stroke="#228B22" strokeWidth="5" fill="none" />
          <Path d="M 0 -10 Q -30 -20, -40 0" stroke="#228B22" strokeWidth="5" fill="none" />
          <Path d="M 0 -10 Q 0 -40, 5 -50" stroke="#228B22" strokeWidth="5" fill="none" />
          <Path d="M 0 -10 Q 25 -35, 35 -25" stroke="#2E8B22" strokeWidth="4" fill="none" />
          <Path d="M 0 -10 Q -25 -35, -35 -25" stroke="#2E8B22" strokeWidth="4" fill="none" />
        </G>

        {/* Palm tree (right) */}
        <G transform="translate(350, 220)">
          <Rect x="-4" y="0" width="8" height="40" fill="#8B4513" />
          <Path d="M 0 -8 Q 25 -15, 30 0" stroke="#228B22" strokeWidth="4" fill="none" />
          <Path d="M 0 -8 Q -25 -15, -30 0" stroke="#228B22" strokeWidth="4" fill="none" />
          <Path d="M 0 -8 Q 0 -30, 3 -35" stroke="#228B22" strokeWidth="4" fill="none" />
        </G>

        {/* Map/Compass */}
        <G transform="translate(300, 250)">
          <Ellipse cx="0" cy="0" rx="20" ry="15" fill="#F5DEB3" />
          <Circle cx="0" cy="0" r="10" fill="none" stroke="#8B4513" strokeWidth="1" />
          <Path d="M 0 -8 L 3 0 L 0 8 L -3 0 Z" fill="#E74C3C" />
          <Path d="M 0 -8 L -3 0 L 0 8 L 3 0 Z" fill="#2C3E50" />
        </G>

        {/* Flying bird silhouettes */}
        <Path d="M 100 60 Q 105 55, 110 60 Q 115 55, 120 60" stroke="#333" strokeWidth="2" fill="none" />
        <Path d="M 130 80 Q 135 75, 140 80 Q 145 75, 150 80" stroke="#333" strokeWidth="2" fill="none" />
        <Path d="M 80 90 Q 85 85, 90 90 Q 95 85, 100 90" stroke="#333" strokeWidth="1.5" fill="none" />

        {/* Stars starting to appear */}
        <Circle cx="50" cy="30" r="2" fill="white" opacity="0.6" />
        <Circle cx="350" cy="40" r="2" fill="white" opacity="0.5" />
        <Circle cx="280" cy="25" r="1.5" fill="white" opacity="0.4" />
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

export default AdventureScene;
