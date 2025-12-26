/**
 * ArtShapes - SVG shapes for art/abstract theme
 * Spiral, Wave, Zigzag, Dots, Stripes, Cross, Arrow, Heart
 */

import React from 'react';
import {
  Circle,
  Rect,
  Polygon,
  Path,
  G,
  Line,
} from 'react-native-svg';
import { ShapeRenderProps } from './BasicShapes';

// ============================================================================
// ART SHAPE RENDERERS
// ============================================================================

function renderSpiral(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const center = size / 2;
  const isSolid = fill === 'solid';

  // Generate spiral path
  const spiralPath = generateSpiralPath(center, center, 5, 35, 3);

  return (
    <Path
      d={spiralPath}
      fill="none"
      stroke={color}
      strokeWidth={isSolid ? 5 : strokeWidth}
      strokeLinecap="round"
    />
  );
}

function generateSpiralPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  turns: number
): string {
  const points: string[] = [];
  const steps = turns * 36;

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * turns * Math.PI * 2;
    const radius = innerRadius + ((outerRadius - innerRadius) * i) / steps;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      points.push(`L ${x} ${y}`);
    }
  }

  return points.join(' ');
}

function renderWave(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  // Generate 3 wave lines
  const waveY1 = center - 15;
  const waveY2 = center;
  const waveY3 = center + 15;

  const generateWavePath = (y: number) => `
    M ${size * 0.1} ${y}
    Q ${size * 0.25} ${y - 12} ${size * 0.4} ${y}
    Q ${size * 0.55} ${y + 12} ${size * 0.7} ${y}
    Q ${size * 0.85} ${y - 12} ${size * 0.9} ${y}
  `;

  return (
    <G>
      <Path
        d={generateWavePath(waveY1)}
        fill="none"
        stroke={color}
        strokeWidth={isSolid ? 4 : strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d={generateWavePath(waveY2)}
        fill="none"
        stroke={color}
        strokeWidth={isSolid ? 4 : strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d={generateWavePath(waveY3)}
        fill="none"
        stroke={color}
        strokeWidth={isSolid ? 4 : strokeWidth}
        strokeLinecap="round"
      />
    </G>
  );
}

function renderZigzag(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';

  const zigzagPath = `
    M ${size * 0.1} ${size * 0.3}
    L ${size * 0.3} ${size * 0.7}
    L ${size * 0.5} ${size * 0.3}
    L ${size * 0.7} ${size * 0.7}
    L ${size * 0.9} ${size * 0.3}
  `;

  return (
    <Path
      d={zigzagPath}
      fill="none"
      stroke={color}
      strokeWidth={isSolid ? 6 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function renderDots(props: ShapeRenderProps) {
  const { color, fill, size } = props;
  const isSolid = fill === 'solid';

  // 3x3 grid of dots
  const dots = [];
  const spacing = size * 0.25;
  const startX = size * 0.25;
  const startY = size * 0.25;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      dots.push(
        <Circle
          key={`${row}-${col}`}
          cx={startX + col * spacing}
          cy={startY + row * spacing}
          r={8}
          fill={isSolid ? color : 'none'}
          stroke={color}
          strokeWidth={isSolid ? 0 : 2}
        />
      );
    }
  }

  return <G>{dots}</G>;
}

function renderStripes(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';

  // 5 diagonal stripes
  const stripes = [];
  const stripeWidth = isSolid ? 8 : strokeWidth;

  for (let i = 0; i < 5; i++) {
    const offset = i * size * 0.22 - size * 0.1;
    stripes.push(
      <Line
        key={i}
        x1={offset}
        y1={size * 0.1}
        x2={offset + size * 0.7}
        y2={size * 0.9}
        stroke={color}
        strokeWidth={stripeWidth}
        strokeLinecap="round"
      />
    );
  }

  return <G>{stripes}</G>;
}

function renderCross(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;
  const armWidth = 16;
  const armLength = size * 0.35;

  return (
    <G>
      {/* Vertical arm */}
      <Rect
        x={center - armWidth / 2}
        y={center - armLength}
        width={armWidth}
        height={armLength * 2}
        rx={3}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Horizontal arm */}
      <Rect
        x={center - armLength}
        y={center - armWidth / 2}
        width={armLength * 2}
        height={armWidth}
        rx={3}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
    </G>
  );
}

function renderArrow(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <Polygon
      points={`
        ${center},${size * 0.1}
        ${size * 0.85},${center}
        ${size * 0.6},${center}
        ${size * 0.6},${size * 0.85}
        ${size * 0.4},${size * 0.85}
        ${size * 0.4},${center}
        ${size * 0.15},${center}
      `}
      fill={isSolid ? color : 'none'}
      stroke={color}
      strokeWidth={isSolid ? 0 : strokeWidth}
      strokeLinejoin="round"
    />
  );
}

function renderHeart(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  const heartPath = `
    M ${center} ${size * 0.88}
    C ${size * 0.15} ${size * 0.6} ${size * 0.05} ${size * 0.35} ${size * 0.25} ${size * 0.2}
    C ${size * 0.4} ${size * 0.1} ${center} ${size * 0.2} ${center} ${size * 0.3}
    C ${center} ${size * 0.2} ${size * 0.6} ${size * 0.1} ${size * 0.75} ${size * 0.2}
    C ${size * 0.95} ${size * 0.35} ${size * 0.85} ${size * 0.6} ${center} ${size * 0.88}
    Z
  `;

  return (
    <G>
      <Path
        d={heartPath}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Highlight */}
      {isSolid && (
        <Circle
          cx={center - 12}
          cy={size * 0.32}
          r={6}
          fill="rgba(255,255,255,0.4)"
        />
      )}
    </G>
  );
}

// ============================================================================
// MAIN RENDERER
// ============================================================================

export function renderArtShape(props: ShapeRenderProps): React.ReactElement | null {
  switch (props.type) {
    case 'spiral':
      return renderSpiral(props);
    case 'wave':
      return renderWave(props);
    case 'zigzag':
      return renderZigzag(props);
    case 'dots':
      return renderDots(props);
    case 'stripes':
      return renderStripes(props);
    case 'cross':
      return renderCross(props);
    case 'arrow':
      return renderArrow(props);
    case 'heart':
      return renderHeart(props);
    default:
      return null;
  }
}
