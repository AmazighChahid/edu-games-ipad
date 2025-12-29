import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const TousIcon = ({ size = 26, color = '#4CAF50' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M6 15L16 7L26 15"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 14V24C8 25.1 8.9 26 10 26H14V20C14 19.4 14.4 19 15 19H17C17.6 19 18 19.4 18 20V26H22C23.1 26 24 25.1 24 24V14"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
