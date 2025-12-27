/**
 * FriendshipScene SVG Illustration
 *
 * Scène d'amitié pour les histoires de thème "friendship"
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Ellipse,
} from 'react-native-svg';

interface FriendshipSceneProps {
  width: number;
  height: number;
  animated?: boolean;
}

export function FriendshipScene({ width, height }: FriendshipSceneProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 400 300">
        <Defs>
          {/* Sky gradient */}
          <LinearGradient id="friendSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#87CEEB" stopOpacity="1" />
            <Stop offset="1" stopColor="#B0E0E6" stopOpacity="1" />
          </LinearGradient>

          {/* Grass gradient */}
          <LinearGradient id="friendGrass" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7BC74D" stopOpacity="1" />
            <Stop offset="1" stopColor="#5A9A3D" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Sky */}
        <Rect x="0" y="0" width="400" height="200" fill="url(#friendSky)" />

        {/* Sun */}
        <Circle cx="320" cy="60" r="35" fill="#FFD93D" />

        {/* Clouds */}
        <G transform="translate(60, 50)">
          <Ellipse cx="0" cy="0" rx="28" ry="14" fill="white" opacity="0.9" />
          <Ellipse cx="22" cy="-5" rx="22" ry="11" fill="white" opacity="0.9" />
          <Ellipse cx="-18" cy="5" rx="18" ry="9" fill="white" opacity="0.9" />
        </G>
        <G transform="translate(240, 35)">
          <Ellipse cx="0" cy="0" rx="22" ry="11" fill="white" opacity="0.85" />
          <Ellipse cx="18" cy="-3" rx="18" ry="9" fill="white" opacity="0.85" />
        </G>

        {/* Ground */}
        <Rect x="0" y="200" width="400" height="100" fill="url(#friendGrass)" />

        {/* Park bench */}
        <G transform="translate(200, 220)">
          {/* Bench legs */}
          <Rect x="-50" y="0" width="8" height="30" fill="#5D4037" />
          <Rect x="42" y="0" width="8" height="30" fill="#5D4037" />
          {/* Seat */}
          <Rect x="-55" y="-5" width="110" height="10" fill="#8D6E63" rx="3" />
          {/* Backrest */}
          <Rect x="-50" y="-30" width="100" height="8" fill="#8D6E63" rx="2" />
          <Rect x="-50" y="-20" width="100" height="8" fill="#8D6E63" rx="2" />
          {/* Backrest supports */}
          <Rect x="-45" y="-30" width="5" height="30" fill="#5D4037" />
          <Rect x="40" y="-30" width="5" height="30" fill="#5D4037" />
        </G>

        {/* Character 1 (left - on bench) */}
        <G transform="translate(160, 185)">
          {/* Body */}
          <Ellipse cx="0" cy="15" rx="15" ry="20" fill="#3498DB" />
          {/* Head */}
          <Circle cx="0" cy="-10" r="18" fill="#FFDAB9" />
          {/* Hair */}
          <Path d="M -15 -20 Q -5 -35, 10 -25 Q 18 -30, 15 -15" fill="#8B4513" />
          {/* Eyes */}
          <Circle cx="-6" cy="-12" r="3" fill="white" />
          <Circle cx="6" cy="-12" r="3" fill="white" />
          <Circle cx="-5" cy="-11" r="1.5" fill="#2C3E50" />
          <Circle cx="7" cy="-11" r="1.5" fill="#2C3E50" />
          {/* Smile */}
          <Path d="M -6 -2 Q 0 5, 6 -2" stroke="#E74C3C" strokeWidth="2" fill="none" />
          {/* Arm waving */}
          <Path d="M 12 10 Q 30 -5, 35 -15" stroke="#FFDAB9" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Hand */}
          <Circle cx="35" cy="-15" r="5" fill="#FFDAB9" />
        </G>

        {/* Character 2 (right - on bench) */}
        <G transform="translate(240, 185)">
          {/* Body */}
          <Ellipse cx="0" cy="15" rx="15" ry="20" fill="#E74C3C" />
          {/* Head */}
          <Circle cx="0" cy="-10" r="18" fill="#DEB887" />
          {/* Hair */}
          <Ellipse cx="0" cy="-22" rx="16" ry="10" fill="#2C3E50" />
          {/* Eyes */}
          <Circle cx="-6" cy="-12" r="3" fill="white" />
          <Circle cx="6" cy="-12" r="3" fill="white" />
          <Circle cx="-5" cy="-11" r="1.5" fill="#2C3E50" />
          <Circle cx="7" cy="-11" r="1.5" fill="#2C3E50" />
          {/* Smile */}
          <Path d="M -6 -2 Q 0 5, 6 -2" stroke="#E74C3C" strokeWidth="2" fill="none" />
          {/* Arm */}
          <Path d="M -12 10 Q -25 0, -20 -10" stroke="#DEB887" strokeWidth="8" fill="none" strokeLinecap="round" />
          <Circle cx="-20" cy="-10" r="5" fill="#DEB887" />
        </G>

        {/* Character 3 (standing - playing) */}
        <G transform="translate(80, 210)">
          {/* Body */}
          <Ellipse cx="0" cy="20" rx="14" ry="25" fill="#9B59B6" />
          {/* Head */}
          <Circle cx="0" cy="-15" r="16" fill="#FFDAB9" />
          {/* Hair pigtails */}
          <Circle cx="-15" cy="-18" r="8" fill="#FFD700" />
          <Circle cx="15" cy="-18" r="8" fill="#FFD700" />
          <Ellipse cx="0" cy="-25" rx="14" ry="8" fill="#FFD700" />
          {/* Eyes */}
          <Circle cx="-5" cy="-17" r="2.5" fill="white" />
          <Circle cx="5" cy="-17" r="2.5" fill="white" />
          <Circle cx="-4" cy="-16" r="1.2" fill="#2C3E50" />
          <Circle cx="6" cy="-16" r="1.2" fill="#2C3E50" />
          {/* Happy mouth */}
          <Path d="M -5 -8 Q 0 -2, 5 -8" stroke="#E74C3C" strokeWidth="2" fill="none" />
          {/* Legs */}
          <Rect x="-8" y="42" width="6" height="20" fill="#FFDAB9" />
          <Rect x="2" y="42" width="6" height="20" fill="#FFDAB9" />
          {/* Shoes */}
          <Ellipse cx="-5" cy="62" rx="6" ry="4" fill="#E74C3C" />
          <Ellipse cx="5" cy="62" rx="6" ry="4" fill="#E74C3C" />
        </G>

        {/* Ball */}
        <G transform="translate(50, 250)">
          <Circle cx="0" cy="0" r="12" fill="#E74C3C" />
          <Path d="M -10 -5 Q 0 -12, 10 -5" stroke="white" strokeWidth="2" fill="none" />
          <Path d="M -10 5 Q 0 12, 10 5" stroke="white" strokeWidth="2" fill="none" />
        </G>

        {/* Hearts floating */}
        <G>
          <Path d="M 190 140 L 195 135 Q 200 130, 205 135 L 210 140 L 200 155 Z" fill="#FF69B4" opacity="0.7" />
          <Path d="M 220 150 L 223 147 Q 226 144, 229 147 L 232 150 L 226 158 Z" fill="#FF69B4" opacity="0.6" />
          <Path d="M 175 155 L 177 153 Q 179 151, 181 153 L 183 155 L 179 160 Z" fill="#FF69B4" opacity="0.5" />
        </G>

        {/* Tree (right) */}
        <G transform="translate(350, 170)">
          <Rect x="-8" y="0" width="16" height="50" fill="#8B4513" />
          <Circle cx="0" cy="-25" r="35" fill="#228B22" />
          <Circle cx="-20" cy="-5" r="22" fill="#2E8B2E" />
          <Circle cx="20" cy="-10" r="25" fill="#2E8B2E" />
        </G>

        {/* Flowers */}
        {[
          { x: 30, y: 265, color: '#FF69B4' },
          { x: 120, y: 270, color: '#FFD700' },
          { x: 300, y: 268, color: '#DA70D6' },
          { x: 370, y: 265, color: '#FF6347' },
        ].map((flower, i) => (
          <G key={i} transform={`translate(${flower.x}, ${flower.y})`}>
            <Rect x="-1" y="0" width="2" height="10" fill="#228B22" />
            <Circle cx="0" cy="-3" r="5" fill={flower.color} />
            <Circle cx="0" cy="-3" r="2" fill="#FFD700" />
          </G>
        ))}

        {/* Butterfly */}
        <G transform="translate(130, 160)">
          <Ellipse cx="0" cy="0" rx="2" ry="5" fill="#333" />
          <Path d="M 0 -2 Q 8 -8, 6 0 Q 8 8, 0 2" fill="#9B59B6" />
          <Path d="M 0 -2 Q -8 -8, -6 0 Q -8 8, 0 2" fill="#9B59B6" />
          <Circle cx="0" cy="-6" r="1.5" fill="#333" />
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

export default FriendshipScene;
