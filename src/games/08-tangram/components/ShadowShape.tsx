/**
 * ShadowShape Component
 *
 * Silhouette cible à reproduire avec les pièces du Tangram
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';

import type { Point } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface ShadowShapeProps {
  /** Points de la silhouette (ou plusieurs polygones) */
  silhouette: Point[] | Point[][];
  /** Échelle */
  scale: number;
  /** Largeur du conteneur */
  width: number;
  /** Hauteur du conteneur */
  height: number;
  /** Couleur de la silhouette */
  color?: string;
  /** Opacité */
  opacity?: number;
  /** Afficher le contour */
  showOutline?: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convertit un tableau de points en chaîne SVG
 */
function pointsToSvgString(points: Point[], scale: number): string {
  return points.map(p => `${p.x * scale},${p.y * scale}`).join(' ');
}

/**
 * Vérifie si c'est un tableau de polygones
 */
function isMultiPolygon(silhouette: Point[] | Point[][]): silhouette is Point[][] {
  if (!silhouette || silhouette.length === 0) {
    return false;
  }
  return Array.isArray(silhouette[0]) && Array.isArray((silhouette[0] as Point[])[0]);
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ShadowShape({
  silhouette,
  scale,
  width,
  height,
  color = '#2C3E50',
  opacity = 0.3,
  showOutline = true,
}: ShadowShapeProps) {
  // Vérifier que la silhouette existe
  if (!silhouette || silhouette.length === 0) {
    return null;
  }

  // Normaliser en tableau de polygones
  const polygons: Point[][] = isMultiPolygon(silhouette)
    ? silhouette
    : [silhouette];

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="shadowGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={opacity * 1.2} />
            <Stop offset="100%" stopColor={color} stopOpacity={opacity * 0.8} />
          </LinearGradient>
        </Defs>

        {polygons.map((polygon, index) => (
          <React.Fragment key={index}>
            {/* Silhouette principale */}
            <Polygon
              points={pointsToSvgString(polygon, scale)}
              fill="url(#shadowGradient)"
            />

            {/* Contour */}
            {showOutline && (
              <Polygon
                points={pointsToSvgString(polygon, scale)}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="5,5"
                opacity={opacity * 1.5}
              />
            )}
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default ShadowShape;
