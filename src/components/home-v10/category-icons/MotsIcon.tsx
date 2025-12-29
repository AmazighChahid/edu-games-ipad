import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const MotsIcon = ({ size = 26, color = '#9C27B0' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M6 8C9 6.5 12 6.5 16 8V26C12 24.5 9 24.5 6 26V8Z"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M26 8C23 6.5 20 6.5 16 8V26C20 24.5 23 24.5 26 26V8Z"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M9 13H14M9 17H14M9 21H14" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
    <Path d="M18 13H23M18 17H23M18 21H23" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
  </Svg>
);
