/**
 * BasicShapes - SVG shapes for basic geometric forms
 * Circle, Square, Triangle, Diamond, Hexagon, Star, Pentagon, Oval
 */

import React from 'react';
import {
  Circle,
  Rect,
  Polygon,
  Path,
  Ellipse,
  G,
  Defs,
  Pattern,
  Line,
} from 'react-native-svg';
import { ShapeType, FillStyle } from '../../types';

export interface ShapeRenderProps {
  type: ShapeType;
  color: string;
  fill: FillStyle;
  size: number;
  rotation: number;
  strokeWidth: number;
  count?: number;
  pattern?: string;
}

// ============================================================================
// PATTERN DEFINITIONS FOR DALTONISM
// ============================================================================

export function renderPatternDefs(patternId: string, patternType: string) {
  switch (patternType) {
    case 'striped':
      return (
        <Pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="8"
          height="8"
        >
          <Line x1="0" y1="0" x2="8" y2="8" stroke="currentColor" strokeWidth="2" />
        </Pattern>
      );
    case 'dotted':
      return (
        <Pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="8"
          height="8"
        >
          <Circle cx="4" cy="4" r="2" fill="currentColor" />
        </Pattern>
      );
    case 'checkered':
      return (
        <Pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="8"
          height="8"
        >
          <Rect x="0" y="0" width="4" height="4" fill="currentColor" />
          <Rect x="4" y="4" width="4" height="4" fill="currentColor" />
        </Pattern>
      );
    default:
      return null;
  }
}

// ============================================================================
// BASIC SHAPE RENDERERS
// ============================================================================

function renderCircle(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2 - 5;

  return (
    <Circle
      cx={center}
      cy={center}
      r={radius}
      fill={fill === 'solid' ? color : 'none'}
      stroke={color}
      strokeWidth={fill === 'outline' ? strokeWidth : 0}
    />
  );
}

function renderSquare(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const margin = 10;
  const squareSize = size - margin * 2 - strokeWidth;

  return (
    <Rect
      x={margin + strokeWidth / 2}
      y={margin + strokeWidth / 2}
      width={squareSize}
      height={squareSize}
      rx={4}
      ry={4}
      fill={fill === 'solid' ? color : 'none'}
      stroke={color}
      strokeWidth={fill === 'outline' ? strokeWidth : 0}
    />
  );
}

function renderTriangle(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const margin = 10;
  const center = size / 2;
  const top = margin;
  const bottom = size - margin;
  const left = margin;
  const right = size - margin;

  const points = `${center},${top} ${right},${bottom} ${left},${bottom}`;

  return (
    <Polygon
      points={points}
      fill={fill === 'solid' ? color : 'none'}
      stroke={color}
      strokeWidth={fill === 'outline' ? strokeWidth : 0}
      strokeLinejoin="round"
    />
  );
}

function renderDiamond(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const margin = 8;
  const center = size / 2;
  const top = margin;
  const bottom = size - margin;
  const left = margin;
  const right = size - margin;

  const points = `${center},${top} ${right},${center} ${center},${bottom} ${left},${center}`;

  return (
    <Polygon
      points={points}
      fill={fill === 'solid' ? color : 'none'}
      stroke={color}
      strokeWidth={fill === 'outline' ? strokeWidth : 0}
      strokeLinejoin="round"
    />
  );
}

function renderHexagon(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const center = size / 2;
  const radius = (size - 20) / 2;

  // Generate hexagon points
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <Polygon
      points={points}
      fill={fill === 'solid' ? color : 'none'}
      stroke={color}
      strokeWidth={fill === 'outline' ? strokeWidth : 0}
      strokeLinejoin="round"
    />
  );
}

function renderStar(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const center = size / 2;
  const outerRadius = (size - 20) / 2;
  const innerRadius = outerRadius * 0.4;
  const points = 5;

  // Generate star points
  const starPoints = Array.from({ length: points * 2 }, (_, i) => {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <Polygon
      points={starPoints}
      fill={fill === 'solid' ? color : 'none'}
      stroke={color}
      strokeWidth={fill === 'outline' ? strokeWidth : 0}
      strokeLinejoin="round"
    />
  );
}

function renderPentagon(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const center = size / 2;
  const radius = (size - 20) / 2;

  // Generate pentagon points
  const points = Array.from({ length: 5 }, (_, i) => {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <Polygon
      points={points}
      fill={fill === 'solid' ? color : 'none'}
      stroke={color}
      strokeWidth={fill === 'outline' ? strokeWidth : 0}
      strokeLinejoin="round"
    />
  );
}

function renderOval(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const center = size / 2;
  const rx = (size - 20) / 2;
  const ry = rx * 0.6;

  return (
    <Ellipse
      cx={center}
      cy={center}
      rx={rx}
      ry={ry}
      fill={fill === 'solid' ? color : 'none'}
      stroke={color}
      strokeWidth={fill === 'outline' ? strokeWidth : 0}
    />
  );
}

// ============================================================================
// MAIN RENDERER
// ============================================================================

export function renderBasicShape(props: ShapeRenderProps): React.ReactElement | null {
  switch (props.type) {
    case 'circle':
      return renderCircle(props);
    case 'square':
      return renderSquare(props);
    case 'triangle':
      return renderTriangle(props);
    case 'diamond':
      return renderDiamond(props);
    case 'hexagon':
      return renderHexagon(props);
    case 'star':
      return renderStar(props);
    case 'pentagon':
      return renderPentagon(props);
    case 'oval':
      return renderOval(props);
    default:
      // Fallback to circle for unknown types
      return renderCircle(props);
  }
}
