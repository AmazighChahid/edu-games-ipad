import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Rect, Polygon, Path } from 'react-native-svg';

// ============================================
// COMPOSANTS SVG - FORMES GÉOMÉTRIQUES
// ============================================

interface ShapeProps {
  size?: number;
  color?: string;
  rotation?: number;
}

// Cercle
export const CircleSVG: React.FC<ShapeProps> = ({
  size = 60,
  color = '#5B8DEE',
  rotation = 0
}) => {
  const radius = size / 2;

  return (
    <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - 2}
          fill={color}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

// Carré
export const SquareSVG: React.FC<ShapeProps> = ({
  size = 60,
  color = '#FFB347',
  rotation = 0
}) => {
  const cornerRadius = size * 0.1; // 10% de border-radius

  return (
    <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Rect
          x="2"
          y="2"
          width={size - 4}
          height={size - 4}
          rx={cornerRadius}
          ry={cornerRadius}
          fill={color}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

// Triangle
export const TriangleSVG: React.FC<ShapeProps> = ({
  size = 60,
  color = '#7BC74D',
  rotation = 0
}) => {
  const points = `${size / 2},5 ${size - 5},${size - 5} 5,${size - 5}`;

  return (
    <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Polygon
          points={points}
          fill={color}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

// Losange / Diamant
export const DiamondSVG: React.FC<ShapeProps> = ({
  size = 60,
  color = '#E056FD',
  rotation = 0
}) => {
  const mid = size / 2;
  const points = `${mid},5 ${size - 5},${mid} ${mid},${size - 5} 5,${mid}`;

  return (
    <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Polygon
          points={points}
          fill={color}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

// Étoile (bonus)
export const StarSVG: React.FC<ShapeProps> = ({
  size = 60,
  color = '#F39C12',
  rotation = 0
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size / 2 - 3;
  const innerRadius = outerRadius * 0.4;
  const points = [];

  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return (
    <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Polygon
          points={points.join(' ')}
          fill={color}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};
