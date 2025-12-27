/**
 * FamilyScene SVG Illustration
 *
 * Scène familiale pour les histoires de thème "family"
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

interface FamilySceneProps {
  width: number;
  height: number;
  animated?: boolean;
}

export function FamilyScene({ width, height }: FamilySceneProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 400 300">
        <Defs>
          {/* Sky gradient */}
          <LinearGradient id="familySky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#87CEEB" stopOpacity="1" />
            <Stop offset="1" stopColor="#E0F6FF" stopOpacity="1" />
          </LinearGradient>

          {/* Grass gradient */}
          <LinearGradient id="familyGrass" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7BC74D" stopOpacity="1" />
            <Stop offset="1" stopColor="#5A9A3D" stopOpacity="1" />
          </LinearGradient>

          {/* House wall gradient */}
          <LinearGradient id="houseWall" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFF8DC" stopOpacity="1" />
            <Stop offset="1" stopColor="#F5DEB3" stopOpacity="1" />
          </LinearGradient>

          {/* Roof gradient */}
          <LinearGradient id="roofGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#E74C3C" stopOpacity="1" />
            <Stop offset="1" stopColor="#C0392B" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Sky */}
        <Rect x="0" y="0" width="400" height="180" fill="url(#familySky)" />

        {/* Sun */}
        <Circle cx="350" cy="50" r="30" fill="#FFD93D" opacity="0.9" />

        {/* Clouds */}
        <G transform="translate(80, 40)">
          <Ellipse cx="0" cy="0" rx="25" ry="12" fill="white" opacity="0.9" />
          <Ellipse cx="20" cy="-4" rx="20" ry="10" fill="white" opacity="0.9" />
          <Ellipse cx="-15" cy="4" rx="15" ry="8" fill="white" opacity="0.9" />
        </G>
        <G transform="translate(280, 60)">
          <Ellipse cx="0" cy="0" rx="20" ry="10" fill="white" opacity="0.8" />
          <Ellipse cx="15" cy="-3" rx="15" ry="8" fill="white" opacity="0.8" />
        </G>

        {/* Grass/Ground */}
        <Rect x="0" y="180" width="400" height="120" fill="url(#familyGrass)" />

        {/* House */}
        <G transform="translate(200, 140)">
          {/* Main building */}
          <Rect x="-70" y="0" width="140" height="100" fill="url(#houseWall)" />

          {/* Roof */}
          <Polygon points="-80,0 0,-50 80,0" fill="url(#roofGradient)" />

          {/* Chimney */}
          <Rect x="30" y="-40" width="20" height="30" fill="#8B4513" />
          {/* Smoke */}
          <Ellipse cx="40" cy="-50" rx="8" ry="6" fill="#D3D3D3" opacity="0.6" />
          <Ellipse cx="45" cy="-60" rx="6" ry="5" fill="#D3D3D3" opacity="0.5" />
          <Ellipse cx="42" cy="-70" rx="5" ry="4" fill="#D3D3D3" opacity="0.4" />

          {/* Door */}
          <Rect x="-15" y="40" width="30" height="50" fill="#8B4513" rx="3" />
          <Circle cx="10" cy="65" r="3" fill="#FFD700" />
          {/* Door window */}
          <Rect x="-8" y="50" width="16" height="15" fill="#87CEEB" rx="8" />

          {/* Windows */}
          <G transform="translate(-45, 20)">
            <Rect x="0" y="0" width="25" height="25" fill="#87CEEB" rx="2" />
            <Rect x="11" y="0" width="3" height="25" fill="#F5DEB3" />
            <Rect x="0" y="11" width="25" height="3" fill="#F5DEB3" />
            {/* Curtains */}
            <Path d="M 2 2 L 2 10 L 10 2 Z" fill="#FF69B4" opacity="0.5" />
            <Path d="M 23 2 L 23 10 L 15 2 Z" fill="#FF69B4" opacity="0.5" />
          </G>
          <G transform="translate(20, 20)">
            <Rect x="0" y="0" width="25" height="25" fill="#87CEEB" rx="2" />
            <Rect x="11" y="0" width="3" height="25" fill="#F5DEB3" />
            <Rect x="0" y="11" width="25" height="3" fill="#F5DEB3" />
            {/* Curtains */}
            <Path d="M 2 2 L 2 10 L 10 2 Z" fill="#87CEFA" opacity="0.5" />
            <Path d="M 23 2 L 23 10 L 15 2 Z" fill="#87CEFA" opacity="0.5" />
          </G>

          {/* Attic window */}
          <Circle cx="0" cy="-25" r="12" fill="#87CEEB" />
          <Rect x="-1" y="-37" width="2" height="24" fill="#F5DEB3" />
          <Rect x="-12" y="-26" width="24" height="2" fill="#F5DEB3" />
        </G>

        {/* Garden path */}
        <Path
          d="M 200 240 L 200 300"
          stroke="#D2B48C"
          strokeWidth="30"
          opacity="0.7"
        />

        {/* Fence */}
        {[-80, -60, -40, 60, 80, 100].map((x, i) => (
          <G key={i} transform={`translate(${200 + x}, 200)`}>
            <Rect x="-3" y="0" width="6" height="35" fill="#F5DEB3" />
            <Polygon points="-3,0 0,-8 3,0" fill="#F5DEB3" />
          </G>
        ))}
        <Rect x="110" y="210" width="80" height="4" fill="#F5DEB3" />
        <Rect x="250" y="210" width="70" height="4" fill="#F5DEB3" />
        <Rect x="110" y="225" width="80" height="4" fill="#F5DEB3" />
        <Rect x="250" y="225" width="70" height="4" fill="#F5DEB3" />

        {/* Tree (left) */}
        <G transform="translate(50, 170)">
          <Rect x="-8" y="0" width="16" height="60" fill="#8B4513" />
          <Circle cx="0" cy="-30" r="40" fill="#228B22" />
          <Circle cx="-25" cy="-10" r="25" fill="#2E8B2E" />
          <Circle cx="25" cy="-15" r="28" fill="#2E8B2E" />
        </G>

        {/* Flowers in garden */}
        {[
          { x: 130, y: 250, color: '#FF69B4' },
          { x: 145, y: 255, color: '#FFD700' },
          { x: 160, y: 248, color: '#FF6347' },
          { x: 240, y: 252, color: '#DA70D6' },
          { x: 255, y: 248, color: '#FFD700' },
          { x: 270, y: 255, color: '#FF69B4' },
        ].map((flower, i) => (
          <G key={i} transform={`translate(${flower.x}, ${flower.y})`}>
            <Rect x="-1" y="0" width="2" height="12" fill="#228B22" />
            <Circle cx="0" cy="-3" r="5" fill={flower.color} />
            <Circle cx="0" cy="-3" r="2" fill="#FFD700" />
          </G>
        ))}

        {/* Bird on fence */}
        <G transform="translate(280, 195)">
          <Ellipse cx="0" cy="0" rx="8" ry="6" fill="#3498DB" />
          <Circle cx="-6" cy="-4" r="5" fill="#3498DB" />
          <Circle cx="-8" cy="-5" r="1.5" fill="white" />
          <Circle cx="-8" cy="-5" r="0.8" fill="black" />
          <Path d="M -11 -4 L -15 -5 L -11 -3 Z" fill="#F39C12" />
          <Path d="M 5 0 L 12 3 L 5 2 Z" fill="#2980B9" />
        </G>

        {/* Swing set (right side) */}
        <G transform="translate(350, 180)">
          {/* Frame */}
          <Path d="M -25 0 L -15 60 M 25 0 L 15 60" stroke="#4A4A4A" strokeWidth="4" />
          <Rect x="-25" y="0" width="50" height="4" fill="#4A4A4A" />
          {/* Swing */}
          <Path d="M 0 5 L -5 50 M 0 5 L 5 50" stroke="#8B4513" strokeWidth="2" />
          <Rect x="-8" y="48" width="16" height="4" fill="#8B4513" rx="2" />
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

export default FamilyScene;
