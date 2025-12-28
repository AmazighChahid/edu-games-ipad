import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const LogiqueIcon = ({ size = 26, color = '#F57C00' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Engrenage principal */}
    <Circle cx={13} cy={13} r={5} stroke={color} strokeWidth={2.2} />
    <Circle cx={13} cy={13} r={2} fill={color} />
    {/* Dents engrenage 1 */}
    <Path d="M13 5V7M13 19V21M5 13H7M19 13H21" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    <Path d="M7.5 7.5L9 9M17 17L18.5 18.5M7.5 18.5L9 17M17 9L18.5 7.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    {/* Engrenage secondaire */}
    <Circle cx={22} cy={21} r={4} stroke={color} strokeWidth={2.2} />
    <Circle cx={22} cy={21} r={1.5} fill={color} />
    {/* Dents engrenage 2 */}
    <Path d="M22 15V16.5M22 25.5V27M16 21H17.5M26.5 21H28" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
