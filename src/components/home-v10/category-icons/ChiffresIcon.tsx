import React from 'react';
import Svg, { Rect, Path, Text as SvgText } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const ChiffresIcon = ({ size = 26, color = '#1976D2' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x={5} y={5} width={22} height={22} rx={4} stroke={color} strokeWidth={2.5} />
    <Path d="M16 5V27" stroke={color} strokeWidth={2} opacity={0.5} />
    <Path d="M5 16H27" stroke={color} strokeWidth={2} opacity={0.5} />
    <SvgText x={10.5} y={14} fill={color} fontFamily="Arial" fontWeight="800" fontSize={8} textAnchor="middle">1</SvgText>
    <SvgText x={21.5} y={14} fill={color} fontFamily="Arial" fontWeight="800" fontSize={8} textAnchor="middle">2</SvgText>
    <SvgText x={10.5} y={24} fill={color} fontFamily="Arial" fontWeight="800" fontSize={8} textAnchor="middle">3</SvgText>
    <SvgText x={21.5} y={24} fill={color} fontFamily="Arial" fontWeight="800" fontSize={8} textAnchor="middle">4</SvgText>
  </Svg>
);
