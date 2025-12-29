import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const FavorisIcon = ({ size = 26, color = '#E53935' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M16 28C16 28 5 21 5 13C5 9 8 5 12 5C14.5 5 16 7 16 7C16 7 17.5 5 20 5C24 5 27 9 27 13C27 21 16 28 16 28Z"
      stroke={color}
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
    <Path
      d="M10 11C8.5 11 7 12.5 7 14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      opacity={0.5}
    />
  </Svg>
);
