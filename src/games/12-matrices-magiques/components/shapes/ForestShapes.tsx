/**
 * ForestShapes - SVG shapes for forest theme
 * Tree, Leaf, Mushroom, Flower, Butterfly, Ladybug, Acorn, Pine
 */

import React from 'react';
import {
  Circle,
  Rect,
  Polygon,
  Path,
  Ellipse,
  G,
} from 'react-native-svg';
import { ShapeRenderProps } from './BasicShapes';

// ============================================================================
// FOREST SHAPE RENDERERS
// ============================================================================

function renderTree(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  // Tree: triangle crown + rectangle trunk
  const crownPoints = `${center},15 ${size - 15},${size * 0.6} ${15},${size * 0.6}`;
  const trunkWidth = 16;
  const trunkHeight = size * 0.25;

  return (
    <G>
      {/* Crown */}
      <Polygon
        points={crownPoints}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        strokeLinejoin="round"
      />
      {/* Trunk */}
      <Rect
        x={center - trunkWidth / 2}
        y={size * 0.55}
        width={trunkWidth}
        height={trunkHeight}
        rx={2}
        fill={isSolid ? '#8B4513' : 'none'}
        stroke={isSolid ? 'none' : '#8B4513'}
        strokeWidth={isSolid ? 0 : 2}
      />
    </G>
  );
}

function renderLeaf(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  // Leaf shape using bezier curves
  const leafPath = `
    M ${center} ${size * 0.1}
    Q ${size * 0.8} ${center} ${center} ${size * 0.9}
    Q ${size * 0.2} ${center} ${center} ${size * 0.1}
    Z
  `;

  return (
    <G>
      <Path
        d={leafPath}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Leaf vein */}
      {isSolid && (
        <Path
          d={`M ${center} ${size * 0.2} L ${center} ${size * 0.8}`}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={2}
        />
      )}
    </G>
  );
}

function renderMushroom(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Cap */}
      <Ellipse
        cx={center}
        cy={size * 0.35}
        rx={size * 0.4}
        ry={size * 0.25}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Stem */}
      <Path
        d={`M ${center - 12} ${size * 0.45} Q ${center - 14} ${size * 0.85} ${center - 10} ${size * 0.9} L ${center + 10} ${size * 0.9} Q ${center + 14} ${size * 0.85} ${center + 12} ${size * 0.45}`}
        fill={isSolid ? '#F5F5DC' : 'none'}
        stroke={isSolid ? 'none' : '#F5F5DC'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Spots on cap */}
      {isSolid && (
        <>
          <Circle cx={center - 12} cy={size * 0.3} r={5} fill="rgba(255,255,255,0.6)" />
          <Circle cx={center + 10} cy={size * 0.35} r={4} fill="rgba(255,255,255,0.6)" />
          <Circle cx={center} cy={size * 0.25} r={3} fill="rgba(255,255,255,0.6)" />
        </>
      )}
    </G>
  );
}

function renderFlower(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;
  const petalRadius = size * 0.18;

  // 5 petals around center
  const petals = Array.from({ length: 5 }, (_, i) => {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const x = center + Math.cos(angle) * size * 0.25;
    const y = center + Math.sin(angle) * size * 0.25;
    return { x, y };
  });

  return (
    <G>
      {/* Petals */}
      {petals.map((p, i) => (
        <Circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={petalRadius}
          fill={isSolid ? color : 'none'}
          stroke={color}
          strokeWidth={isSolid ? 0 : strokeWidth}
        />
      ))}
      {/* Center */}
      <Circle
        cx={center}
        cy={center}
        r={size * 0.12}
        fill={isSolid ? '#FFD93D' : 'none'}
        stroke={isSolid ? 'none' : '#FFD93D'}
        strokeWidth={isSolid ? 0 : 2}
      />
    </G>
  );
}

function renderButterfly(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Left wing */}
      <Ellipse
        cx={center - size * 0.22}
        cy={center - size * 0.1}
        rx={size * 0.25}
        ry={size * 0.2}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        transform={`rotate(-20, ${center - size * 0.22}, ${center - size * 0.1})`}
      />
      <Ellipse
        cx={center - size * 0.18}
        cy={center + size * 0.15}
        rx={size * 0.18}
        ry={size * 0.15}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        transform={`rotate(-30, ${center - size * 0.18}, ${center + size * 0.15})`}
      />
      {/* Right wing */}
      <Ellipse
        cx={center + size * 0.22}
        cy={center - size * 0.1}
        rx={size * 0.25}
        ry={size * 0.2}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        transform={`rotate(20, ${center + size * 0.22}, ${center - size * 0.1})`}
      />
      <Ellipse
        cx={center + size * 0.18}
        cy={center + size * 0.15}
        rx={size * 0.18}
        ry={size * 0.15}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        transform={`rotate(30, ${center + size * 0.18}, ${center + size * 0.15})`}
      />
      {/* Body */}
      <Ellipse
        cx={center}
        cy={center}
        rx={size * 0.05}
        ry={size * 0.25}
        fill={isSolid ? '#4A4A4A' : 'none'}
        stroke={'#4A4A4A'}
        strokeWidth={isSolid ? 0 : 2}
      />
    </G>
  );
}

function renderLadybug(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Body */}
      <Ellipse
        cx={center}
        cy={center + size * 0.05}
        rx={size * 0.35}
        ry={size * 0.3}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Head */}
      <Circle
        cx={center}
        cy={center - size * 0.25}
        r={size * 0.12}
        fill={isSolid ? '#2D3436' : 'none'}
        stroke={'#2D3436'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Center line */}
      {isSolid && (
        <Path
          d={`M ${center} ${center - size * 0.15} L ${center} ${center + size * 0.35}`}
          stroke="#2D3436"
          strokeWidth={3}
        />
      )}
      {/* Spots */}
      {isSolid && (
        <>
          <Circle cx={center - 12} cy={center} r={6} fill="#2D3436" />
          <Circle cx={center + 12} cy={center} r={6} fill="#2D3436" />
          <Circle cx={center - 8} cy={center + 15} r={5} fill="#2D3436" />
          <Circle cx={center + 8} cy={center + 15} r={5} fill="#2D3436" />
        </>
      )}
    </G>
  );
}

function renderAcorn(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Cap */}
      <Path
        d={`M ${size * 0.25} ${center} Q ${size * 0.25} ${size * 0.2} ${center} ${size * 0.2} Q ${size * 0.75} ${size * 0.2} ${size * 0.75} ${center} L ${size * 0.25} ${center}`}
        fill={isSolid ? '#8B4513' : 'none'}
        stroke={'#8B4513'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Body */}
      <Ellipse
        cx={center}
        cy={center + size * 0.15}
        rx={size * 0.22}
        ry={size * 0.28}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Stem */}
      {isSolid && (
        <Rect
          x={center - 3}
          y={size * 0.12}
          width={6}
          height={10}
          rx={2}
          fill="#8B4513"
        />
      )}
    </G>
  );
}

function renderPine(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  // Three triangles stacked
  const layer1 = `${center},12 ${size * 0.7},${size * 0.35} ${size * 0.3},${size * 0.35}`;
  const layer2 = `${center},${size * 0.25} ${size * 0.78},${size * 0.55} ${size * 0.22},${size * 0.55}`;
  const layer3 = `${center},${size * 0.4} ${size * 0.85},${size * 0.75} ${size * 0.15},${size * 0.75}`;

  return (
    <G>
      <Polygon
        points={layer3}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        strokeLinejoin="round"
      />
      <Polygon
        points={layer2}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        strokeLinejoin="round"
      />
      <Polygon
        points={layer1}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        strokeLinejoin="round"
      />
      {/* Trunk */}
      <Rect
        x={center - 8}
        y={size * 0.72}
        width={16}
        height={size * 0.2}
        rx={2}
        fill={isSolid ? '#8B4513' : 'none'}
        stroke={'#8B4513'}
        strokeWidth={isSolid ? 0 : 2}
      />
    </G>
  );
}

// ============================================================================
// MAIN RENDERER
// ============================================================================

export function renderForestShape(props: ShapeRenderProps): React.ReactElement | null {
  switch (props.type) {
    case 'tree':
      return renderTree(props);
    case 'leaf':
      return renderLeaf(props);
    case 'mushroom':
      return renderMushroom(props);
    case 'flower':
      return renderFlower(props);
    case 'butterfly':
      return renderButterfly(props);
    case 'ladybug':
      return renderLadybug(props);
    case 'acorn':
      return renderAcorn(props);
    case 'pine':
      return renderPine(props);
    default:
      return null;
  }
}
