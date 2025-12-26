/**
 * SpaceShapes - SVG shapes for space theme
 * Planet, Rocket, Satellite, Moon, Meteor, UFO, Astronaut, Comet
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
// SPACE SHAPE RENDERERS
// ============================================================================

function renderPlanet(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;
  const radius = (size - 24) / 2;

  return (
    <G>
      {/* Planet body */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Ring */}
      <Ellipse
        cx={center}
        cy={center}
        rx={radius + 10}
        ry={8}
        fill="none"
        stroke={isSolid ? 'rgba(255,255,255,0.5)' : color}
        strokeWidth={3}
        transform={`rotate(-20, ${center}, ${center})`}
      />
      {/* Surface details */}
      {isSolid && (
        <>
          <Circle cx={center - 10} cy={center - 8} r={8} fill="rgba(0,0,0,0.1)" />
          <Circle cx={center + 8} cy={center + 6} r={5} fill="rgba(0,0,0,0.1)" />
        </>
      )}
    </G>
  );
}

function renderRocket(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Body */}
      <Path
        d={`
          M ${center} ${size * 0.1}
          Q ${center + 18} ${size * 0.2} ${center + 18} ${size * 0.6}
          L ${center + 18} ${size * 0.75}
          L ${center - 18} ${size * 0.75}
          L ${center - 18} ${size * 0.6}
          Q ${center - 18} ${size * 0.2} ${center} ${size * 0.1}
          Z
        `}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Window */}
      <Circle
        cx={center}
        cy={size * 0.35}
        r={10}
        fill={isSolid ? '#87CEEB' : 'none'}
        stroke={isSolid ? 'none' : '#87CEEB'}
        strokeWidth={2}
      />
      {/* Fins */}
      <Polygon
        points={`${center - 18},${size * 0.65} ${center - 30},${size * 0.85} ${center - 18},${size * 0.75}`}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      <Polygon
        points={`${center + 18},${size * 0.65} ${center + 30},${size * 0.85} ${center + 18},${size * 0.75}`}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Flame */}
      {isSolid && (
        <Polygon
          points={`${center - 10},${size * 0.75} ${center},${size * 0.92} ${center + 10},${size * 0.75}`}
          fill="#FF9F43"
        />
      )}
    </G>
  );
}

function renderSatellite(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Body */}
      <Rect
        x={center - 15}
        y={center - 10}
        width={30}
        height={20}
        rx={4}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Left panel */}
      <Rect
        x={size * 0.1}
        y={center - 15}
        width={size * 0.2}
        height={30}
        rx={2}
        fill={isSolid ? '#4169E1' : 'none'}
        stroke={isSolid ? 'none' : '#4169E1'}
        strokeWidth={2}
      />
      {/* Right panel */}
      <Rect
        x={size * 0.7}
        y={center - 15}
        width={size * 0.2}
        height={30}
        rx={2}
        fill={isSolid ? '#4169E1' : 'none'}
        stroke={isSolid ? 'none' : '#4169E1'}
        strokeWidth={2}
      />
      {/* Antenna */}
      <Path
        d={`M ${center} ${center - 10} L ${center} ${center - 25}`}
        stroke={isSolid ? '#AAA' : color}
        strokeWidth={2}
      />
      <Circle
        cx={center}
        cy={center - 28}
        r={4}
        fill={isSolid ? '#FF4444' : 'none'}
        stroke={'#FF4444'}
        strokeWidth={1}
      />
    </G>
  );
}

function renderMoon(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;
  const radius = (size - 24) / 2;

  return (
    <G>
      {/* Main moon */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Crescent shadow */}
      {isSolid && (
        <Circle
          cx={center + 12}
          cy={center}
          r={radius - 4}
          fill="rgba(0,0,0,0.15)"
        />
      )}
      {/* Craters */}
      {isSolid && (
        <>
          <Circle cx={center - 12} cy={center - 8} r={6} fill="rgba(0,0,0,0.1)" />
          <Circle cx={center - 5} cy={center + 10} r={4} fill="rgba(0,0,0,0.1)" />
          <Circle cx={center + 8} cy={center - 12} r={3} fill="rgba(0,0,0,0.1)" />
        </>
      )}
    </G>
  );
}

function renderMeteor(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Tail */}
      <Polygon
        points={`${size * 0.65},${size * 0.3} ${size * 0.9},${size * 0.1} ${size * 0.75},${size * 0.35}`}
        fill={isSolid ? '#FFB347' : 'none'}
        stroke={'#FFB347'}
        strokeWidth={isSolid ? 0 : 2}
      />
      <Polygon
        points={`${size * 0.6},${size * 0.4} ${size * 0.95},${size * 0.05} ${size * 0.7},${size * 0.3}`}
        fill={isSolid ? '#FF9F43' : 'none'}
        stroke={'#FF9F43'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Body */}
      <Ellipse
        cx={center - size * 0.1}
        cy={center + size * 0.1}
        rx={size * 0.25}
        ry={size * 0.2}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
        transform={`rotate(-30, ${center - size * 0.1}, ${center + size * 0.1})`}
      />
    </G>
  );
}

function renderUfo(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Dome */}
      <Path
        d={`
          M ${center - 20} ${center}
          Q ${center - 20} ${center - 25} ${center} ${center - 25}
          Q ${center + 20} ${center - 25} ${center + 20} ${center}
          Z
        `}
        fill={isSolid ? '#87CEEB' : 'none'}
        stroke={'#87CEEB'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Body */}
      <Ellipse
        cx={center}
        cy={center + 5}
        rx={size * 0.4}
        ry={size * 0.12}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Lights */}
      {isSolid && (
        <>
          <Circle cx={center - 20} cy={center + 5} r={4} fill="#FFD93D" />
          <Circle cx={center} cy={center + 10} r={4} fill="#FFD93D" />
          <Circle cx={center + 20} cy={center + 5} r={4} fill="#FFD93D" />
        </>
      )}
      {/* Beam */}
      {isSolid && (
        <Polygon
          points={`${center - 15},${center + 15} ${center - 25},${size * 0.85} ${center + 25},${size * 0.85} ${center + 15},${center + 15}`}
          fill="rgba(135, 206, 235, 0.3)"
        />
      )}
    </G>
  );
}

function renderAstronaut(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Helmet */}
      <Circle
        cx={center}
        cy={size * 0.28}
        r={size * 0.2}
        fill={isSolid ? '#FFFFFF' : 'none'}
        stroke={'#FFFFFF'}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Visor */}
      <Circle
        cx={center}
        cy={size * 0.28}
        r={size * 0.12}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Body */}
      <Ellipse
        cx={center}
        cy={size * 0.58}
        rx={size * 0.22}
        ry={size * 0.2}
        fill={isSolid ? '#FFFFFF' : 'none'}
        stroke={'#FFFFFF'}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Backpack */}
      <Rect
        x={center + size * 0.15}
        y={size * 0.4}
        width={size * 0.12}
        height={size * 0.25}
        rx={3}
        fill={isSolid ? '#AAA' : 'none'}
        stroke={'#AAA'}
        strokeWidth={isSolid ? 0 : 2}
      />
      {/* Legs */}
      <Ellipse
        cx={center - 10}
        cy={size * 0.82}
        rx={8}
        ry={12}
        fill={isSolid ? '#FFFFFF' : 'none'}
        stroke={'#FFFFFF'}
        strokeWidth={isSolid ? 0 : 2}
      />
      <Ellipse
        cx={center + 10}
        cy={size * 0.82}
        rx={8}
        ry={12}
        fill={isSolid ? '#FFFFFF' : 'none'}
        stroke={'#FFFFFF'}
        strokeWidth={isSolid ? 0 : 2}
      />
    </G>
  );
}

function renderComet(props: ShapeRenderProps) {
  const { color, fill, size, strokeWidth } = props;
  const isSolid = fill === 'solid';
  const center = size / 2;

  return (
    <G>
      {/* Tail */}
      <Path
        d={`
          M ${center - 5} ${center}
          Q ${size * 0.1} ${center} ${size * 0.05} ${center - 8}
          L ${size * 0.02} ${center + 8}
          Q ${size * 0.1} ${center} ${center - 5} ${center}
        `}
        fill={isSolid ? 'rgba(255,255,255,0.5)' : 'none'}
        stroke={isSolid ? 'none' : 'rgba(255,255,255,0.5)'}
        strokeWidth={2}
      />
      {/* Core */}
      <Circle
        cx={center + size * 0.15}
        cy={center}
        r={size * 0.18}
        fill={isSolid ? color : 'none'}
        stroke={color}
        strokeWidth={isSolid ? 0 : strokeWidth}
      />
      {/* Glow */}
      {isSolid && (
        <Circle
          cx={center + size * 0.15}
          cy={center}
          r={size * 0.22}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={3}
        />
      )}
    </G>
  );
}

// ============================================================================
// MAIN RENDERER
// ============================================================================

export function renderSpaceShape(props: ShapeRenderProps): React.ReactElement | null {
  switch (props.type) {
    case 'planet':
      return renderPlanet(props);
    case 'rocket':
      return renderRocket(props);
    case 'satellite':
      return renderSatellite(props);
    case 'moon':
      return renderMoon(props);
    case 'meteor':
      return renderMeteor(props);
    case 'ufo':
      return renderUfo(props);
    case 'astronaut':
      return renderAstronaut(props);
    case 'comet':
      return renderComet(props);
    default:
      return null;
  }
}
