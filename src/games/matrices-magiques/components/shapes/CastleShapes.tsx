/**
 * CastleShapes - SVG shapes for castle theme
 * Crown, Key, Shield, Sword, Gem, Flag, Tower, Potion
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
// CASTLE SHAPE RENDERERS
// ============================================================================

function renderCrown(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Base */}
      <Rect
        x={size * 0.2}
        y={size * 0.55}
        width={size * 0.6}
        height={size * 0.2}
        rx={3}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Points */}
      <Polygon
        points={`
          ${size * 0.2},${size * 0.55}
          ${size * 0.2},${size * 0.35}
          ${size * 0.32},${size * 0.45}
          ${size * 0.4},${size * 0.2}
          ${center},${size * 0.4}
          ${size * 0.6},${size * 0.2}
          ${size * 0.68},${size * 0.45}
          ${size * 0.8},${size * 0.35}
          ${size * 0.8},${size * 0.55}
        `}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        strokeLinejoin="round"
      />
      {/* Gems on points */}
      {isSolid && (
        <>
          <Circle cx={size * 0.4} cy={size * 0.25} r={4} fill="#FF6B6B" />
          <Circle cx={center} cy={size * 0.35} r={4} fill="#5B8DEE" />
          <Circle cx={size * 0.6} cy={size * 0.25} r={4} fill="#7BC74D" />
        </>
      )}
    </G>
  );
}

function renderKey(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Handle (ring) */}
      <Circle
        cx={center}
        cy={size * 0.25}
        r={size * 0.15}
        fill="none"
        stroke={color}
        strokeWidth={isSolid ? 8 : strokeWidth}
      />
      {/* Shaft */}
      <Rect
        x={center - 4}
        y={size * 0.35}
        width={8}
        height={size * 0.45}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Teeth */}
      <Rect
        x={center}
        y={size * 0.65}
        width={14}
        height={6}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      <Rect
        x={center}
        y={size * 0.75}
        width={10}
        height={6}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
    </G>
  );
}

function renderShield(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      <Path
        d={`
          M ${center} ${size * 0.1}
          L ${size * 0.85} ${size * 0.15}
          L ${size * 0.85} ${size * 0.5}
          Q ${size * 0.85} ${size * 0.75} ${center} ${size * 0.92}
          Q ${size * 0.15} ${size * 0.75} ${size * 0.15} ${size * 0.5}
          L ${size * 0.15} ${size * 0.15}
          Z
        `}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Cross emblem */}
      {isSolid && (
        <>
          <Rect
            x={center - 5}
            y={size * 0.25}
            width={10}
            height={size * 0.45}
            fill="rgba(255,255,255,0.5)"
            rx={2}
          />
          <Rect
            x={size * 0.3}
            y={size * 0.4}
            width={size * 0.4}
            height={10}
            fill="rgba(255,255,255,0.5)"
            rx={2}
          />
        </>
      )}
    </G>
  );
}

function renderSword(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Blade */}
      <Polygon
        points={`
          ${center},${size * 0.08}
          ${center + 8},${size * 0.6}
          ${center - 8},${size * 0.6}
        `}
        fill={isSolid ? '#C0C0C0' : 'none'}
        stroke={isSolid ? 'none' : '#C0C0C0'}
        strokeWidth={strokeWidth}
      />
      {/* Guard */}
      <Rect
        x={size * 0.25}
        y={size * 0.58}
        width={size * 0.5}
        height={8}
        rx={4}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Handle */}
      <Rect
        x={center - 5}
        y={size * 0.66}
        width={10}
        height={size * 0.2}
        rx={2}
        fill={isSolid ? '#8B4513' : 'none'}
        stroke={'#8B4513'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Pommel */}
      <Circle
        cx={center}
        cy={size * 0.9}
        r={7}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
    </G>
  );
}

function renderGem(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Main facet */}
      <Polygon
        points={`
          ${center},${size * 0.12}
          ${size * 0.82},${size * 0.4}
          ${size * 0.7},${size * 0.88}
          ${size * 0.3},${size * 0.88}
          ${size * 0.18},${size * 0.4}
        `}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        strokeLinejoin="round"
      />
      {/* Inner facets */}
      {isSolid && (
        <>
          <Polygon
            points={`${center},${size * 0.12} ${center},${size * 0.5} ${size * 0.82},${size * 0.4}`}
            fill="rgba(255,255,255,0.3)"
          />
          <Polygon
            points={`${center},${size * 0.5} ${size * 0.82},${size * 0.4} ${size * 0.7},${size * 0.88}`}
            fill="rgba(0,0,0,0.1)"
          />
          <Polygon
            points={`${center},${size * 0.5} ${size * 0.3},${size * 0.88} ${size * 0.7},${size * 0.88}`}
            fill="rgba(0,0,0,0.15)"
          />
        </>
      )}
    </G>
  );
}

function renderFlag(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';

  return (
    <G>
      {/* Pole */}
      <Rect
        x={size * 0.2}
        y={size * 0.1}
        width={6}
        height={size * 0.8}
        fill={isSolid ? '#8B4513' : 'none'}
        stroke={'#8B4513'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Flag */}
      <Path
        d={`
          M ${size * 0.26} ${size * 0.15}
          Q ${size * 0.5} ${size * 0.2} ${size * 0.8} ${size * 0.2}
          Q ${size * 0.7} ${size * 0.35} ${size * 0.8} ${size * 0.5}
          Q ${size * 0.5} ${size * 0.5} ${size * 0.26} ${size * 0.45}
          Z
        `}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Pole top */}
      <Circle
        cx={size * 0.23}
        cy={size * 0.1}
        r={5}
        fill={isSolid ? '#FFD93D' : 'none'}
        stroke={'#FFD93D'}
        strokeWidth={isSolid ? 0 : 2}
      />
    </G>
  );
}

function renderTower(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Main body */}
      <Rect
        x={size * 0.3}
        y={size * 0.25}
        width={size * 0.4}
        height={size * 0.65}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Battlements */}
      <Rect x={size * 0.25} y={size * 0.2} width={10} height={15} fill={isSolid ? color : 'none'} stroke={color} strokeWidth={isSolid ? 0 : strokeWidth} />
      <Rect x={center - 5} y={size * 0.2} width={10} height={15} fill={isSolid ? color : 'none'} stroke={color} strokeWidth={isSolid ? 0 : strokeWidth} />
      <Rect x={size * 0.65} y={size * 0.2} width={10} height={15} fill={isSolid ? color : 'none'} stroke={color} strokeWidth={isSolid ? 0 : strokeWidth} />
      {/* Roof */}
      <Polygon
        points={`${center},${size * 0.08} ${size * 0.25},${size * 0.2} ${size * 0.75},${size * 0.2}`}
        fill={isSolid ? '#8B0000' : 'none'}
        stroke={'#8B0000'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Window */}
      <Path
        d={`
          M ${center - 8} ${size * 0.5}
          Q ${center - 8} ${size * 0.38} ${center} ${size * 0.38}
          Q ${center + 8} ${size * 0.38} ${center + 8} ${size * 0.5}
          L ${center + 8} ${size * 0.6}
          L ${center - 8} ${size * 0.6}
          Z
        `}
        fill={isSolid ? '#4A4A4A' : 'none'}
        stroke={'#4A4A4A'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Door */}
      <Path
        d={`
          M ${center - 10} ${size * 0.9}
          L ${center - 10} ${size * 0.72}
          Q ${center - 10} ${size * 0.65} ${center} ${size * 0.65}
          Q ${center + 10} ${size * 0.65} ${center + 10} ${size * 0.72}
          L ${center + 10} ${size * 0.9}
          Z
        `}
        fill={isSolid ? '#4A4A4A' : 'none'}
        stroke={'#4A4A4A'}
        strokeWidth={isSolid ? 0 : 2}
      />
    </G>
  );
}

function renderPotion(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Neck */}
      <Rect
        x={center - 8}
        y={size * 0.1}
        width={16}
        height={size * 0.18}
        rx={2}
        fill={isSolid ? '#AAA' : 'none'}
        stroke={'#AAA'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Cork */}
      <Rect
        x={center - 6}
        y={size * 0.05}
        width={12}
        height={8}
        rx={2}
        fill={isSolid ? '#8B4513' : 'none'}
        stroke={'#8B4513'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Body */}
      <Path
        d={`
          M ${center - 8} ${size * 0.28}
          Q ${center - 25} ${size * 0.35} ${center - 25} ${size * 0.6}
          Q ${center - 25} ${size * 0.88} ${center} ${size * 0.88}
          Q ${center + 25} ${size * 0.88} ${center + 25} ${size * 0.6}
          Q ${center + 25} ${size * 0.35} ${center + 8} ${size * 0.28}
          Z
        `}
        fill={isSolid ? 'rgba(135, 206, 235, 0.5)' : 'none'}
        stroke={'rgba(135, 206, 235, 0.8)'}
        strokeWidth={isSolid ? 2 : strokeWidth}
      />
      {/* Liquid */}
      {isSolid && (
        <Path
          d={`
            M ${center - 22} ${size * 0.55}
            Q ${center - 22} ${size * 0.85} ${center} ${size * 0.85}
            Q ${center + 22} ${size * 0.85} ${center + 22} ${size * 0.55}
            Z
          `}
          fill={color}
        />
      )}
      {/* Bubbles */}
      {isSolid && (
        <>
          <Circle cx={center - 8} cy={size * 0.65} r={4} fill="rgba(255,255,255,0.4)" />
          <Circle cx={center + 5} cy={size * 0.7} r={3} fill="rgba(255,255,255,0.4)" />
          <Circle cx={center - 3} cy={size * 0.78} r={2} fill="rgba(255,255,255,0.4)" />
        </>
      )}
    </G>
  );
}

// ============================================================================
// MAIN RENDERER
// ============================================================================

export function renderCastleShape(props: ShapeRenderProps): React.ReactElement | null {
  switch (props.type) {
    case 'crown':
      return renderCrown(props);
    case 'key':
      return renderKey(props);
    case 'shield':
      return renderShield(props);
    case 'sword':
      return renderSword(props);
    case 'gem':
      return renderGem(props);
    case 'flag':
      return renderFlag(props);
    case 'tower':
      return renderTower(props);
    case 'potion':
      return renderPotion(props);
    default:
      return null;
  }
}
