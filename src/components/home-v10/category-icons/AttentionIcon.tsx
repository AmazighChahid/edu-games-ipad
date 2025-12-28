import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const AttentionIcon = ({ size = 26, color = '#00ACC1' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx={16} cy={16} r={9} stroke={color} strokeWidth={2.5} />
    <Circle cx={16} cy={16} r={5} stroke={color} strokeWidth={2.5} />
    <Circle cx={16} cy={16} r={1.5} fill={color} />
    <Path d="M16 4V6" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M16 26V28" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M4 16H6" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M26 16H28" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);
