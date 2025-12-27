/**
 * RadarChart Component
 *
 * Graphique radar pour afficher les scores de compétences
 * Utilise react-native-svg pour le rendu
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';

import { fontFamily, spacing } from '@/theme';
import type { CompetencyScores } from '../types';

interface RadarChartProps {
  data: CompetencyScores;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  backgroundColor?: string;
  showLabels?: boolean;
  animated?: boolean;
}

// Labels et emojis pour chaque compétence
const COMPETENCY_LABELS: Record<keyof CompetencyScores, { label: string; emoji: string }> = {
  factual: { label: 'Factuel', emoji: '🔍' },
  sequential: { label: 'Séquentiel', emoji: '📋' },
  causal: { label: 'Causal', emoji: '🔗' },
  emotional: { label: 'Émotions', emoji: '💭' },
  inferential: { label: 'Inférence', emoji: '🔮' },
  opinion: { label: 'Opinion', emoji: '💡' },
};

// Ordre des compétences sur le radar (sens horaire depuis le haut)
const COMPETENCY_ORDER: (keyof CompetencyScores)[] = [
  'factual',
  'sequential',
  'causal',
  'emotional',
  'inferential',
  'opinion',
];

export function RadarChart({
  data,
  size = 200,
  fillColor = 'rgba(155, 89, 182, 0.3)',
  strokeColor = '#9B59B6',
  backgroundColor = '#F0E6F5',
  showLabels = true,
  animated = true,
}: RadarChartProps) {
  const { width: screenWidth } = useWindowDimensions();

  // Ajuster la taille pour les petits écrans
  const adjustedSize = Math.min(size, screenWidth - 80);
  const center = adjustedSize / 2;
  const radius = adjustedSize / 2 - 40; // Marge pour les labels

  // Calculer les points du polygone
  const { dataPoints, gridPoints, labelPositions } = useMemo(() => {
    const numSides = COMPETENCY_ORDER.length;
    const angleStep = (2 * Math.PI) / numSides;
    const startAngle = -Math.PI / 2; // Commencer en haut

    // Points pour les données
    const dataPoints = COMPETENCY_ORDER.map((key, index) => {
      const angle = startAngle + index * angleStep;
      const value = data[key] / 100; // Normaliser 0-1
      const r = value * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      };
    });

    // Points pour la grille (contour)
    const gridPoints = [0.25, 0.5, 0.75, 1].map((scale) =>
      COMPETENCY_ORDER.map((_, index) => {
        const angle = startAngle + index * angleStep;
        const r = scale * radius;
        return {
          x: center + r * Math.cos(angle),
          y: center + r * Math.sin(angle),
        };
      })
    );

    // Positions des labels
    const labelPositions = COMPETENCY_ORDER.map((key, index) => {
      const angle = startAngle + index * angleStep;
      const labelRadius = radius + 30;
      return {
        x: center + labelRadius * Math.cos(angle),
        y: center + labelRadius * Math.sin(angle),
        key,
        ...COMPETENCY_LABELS[key],
      };
    });

    return { dataPoints, gridPoints, labelPositions };
  }, [data, center, radius]);

  // Convertir les points en string pour SVG Polygon
  const dataPointsString = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const Container = animated ? Animated.View : View;
  const containerProps = animated
    ? { entering: FadeIn.duration(500) }
    : {};

  return (
    <Container style={styles.container} {...containerProps}>
      <Svg width={adjustedSize} height={adjustedSize}>
        {/* Grille de fond */}
        {gridPoints.map((points, gridIndex) => (
          <Polygon
            key={`grid-${gridIndex}`}
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#E0D0E8"
            strokeWidth={1}
            strokeDasharray={gridIndex < 3 ? '4,4' : '0'}
          />
        ))}

        {/* Lignes du centre vers les sommets */}
        {COMPETENCY_ORDER.map((_, index) => {
          const angle = -Math.PI / 2 + (index * 2 * Math.PI) / COMPETENCY_ORDER.length;
          return (
            <Line
              key={`line-${index}`}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#E0D0E8"
              strokeWidth={1}
            />
          );
        })}

        {/* Polygone des données */}
        <Polygon
          points={dataPointsString}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2}
        />

        {/* Points sur les sommets des données */}
        {dataPoints.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={strokeColor}
          />
        ))}

        {/* Centre */}
        <Circle cx={center} cy={center} r={3} fill="#9B59B6" />
      </Svg>

      {/* Labels externes (en React Native pour meilleure gestion du texte) */}
      {showLabels && (
        <View style={[styles.labelsContainer, { width: adjustedSize, height: adjustedSize }]}>
          {labelPositions.map((label) => {
            // Ajuster la position du label
            const labelWidth = 70;
            const labelHeight = 40;
            let left = label.x - labelWidth / 2;
            let top = label.y - labelHeight / 2;

            // Ajustements pour éviter le débordement
            if (label.x < center) {
              left = label.x - labelWidth + 10;
            } else if (label.x > center) {
              left = label.x - 10;
            }

            return (
              <View
                key={label.key}
                style={[
                  styles.labelWrapper,
                  {
                    left,
                    top,
                    width: labelWidth,
                    height: labelHeight,
                  },
                ]}
              >
                <Text style={styles.labelEmoji}>{label.emoji}</Text>
                <Text style={styles.labelText}>{label.label}</Text>
                <Text style={styles.labelScore}>{data[label.key]}%</Text>
              </View>
            );
          })}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  labelWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelEmoji: {
    fontSize: 14,
  },
  labelText: {
    fontSize: 10,
    fontFamily: fontFamily.medium,
    color: '#4A5568',
    textAlign: 'center',
  },
  labelScore: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
    color: '#9B59B6',
  },
});

export default RadarChart;
