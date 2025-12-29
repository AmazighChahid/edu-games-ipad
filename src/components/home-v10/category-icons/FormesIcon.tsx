import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const FormesIcon = ({ size = 26, color = '#FF8F00' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M8 8H12C12 5.8 13.8 4 16 4C18.2 4 20 5.8 20 8H24V12C26.2 12 28 13.8 28 16C28 18.2 26.2 20 24 20V24H20C20 26.2 18.2 28 16 28C13.8 28 12 26.2 12 24H8V20C5.8 20 4 18.2 4 16C4 13.8 5.8 12 8 12V8Z"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
