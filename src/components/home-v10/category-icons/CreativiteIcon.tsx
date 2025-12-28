import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const CreativiteIcon = ({ size = 26, color = '#E91E63' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M16 4C11 4 7 8 7 13C7 16 8.5 18.5 11 21C12 22 12.5 23 12.5 25H19.5C19.5 23 20 22 21 21C23.5 18.5 25 16 25 13C25 8 21 4 16 4Z"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 28H20" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M14 31H18" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M12 15C12.5 12 14 10 16.5 10" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
  </Svg>
);
