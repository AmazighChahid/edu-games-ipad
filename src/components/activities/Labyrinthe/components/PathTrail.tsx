import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Position } from '../types';

interface Props {
  path: Position[];
  cellSize: number;
}

const TRAIL_COLOR = '#5B8DEE';

export const PathTrail: React.FC<Props> = ({ path, cellSize }) => {
  const svgPath = useMemo(() => {
    if (path.length < 2) return '';

    const points = path.map((p) => ({
      x: p.x * cellSize + cellSize / 2,
      y: p.y * cellSize + cellSize / 2,
    }));

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }

    return d;
  }, [path, cellSize]);

  if (path.length < 2) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg style={StyleSheet.absoluteFill}>
        <Path
          d={svgPath}
          stroke={TRAIL_COLOR}
          strokeWidth={cellSize * 0.2}
          strokeOpacity={0.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};
