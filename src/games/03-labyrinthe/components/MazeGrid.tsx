import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MazeCell } from './MazeCell';
import { MazeGrid as GridType, ThemeType } from '../types';
import { THEMES } from '../data/themes';
import { theme } from '@/theme';

interface Props {
  grid: GridType;
  cellSize: number;
  theme: ThemeType;
  children?: React.ReactNode;
  showGridLines?: boolean;
}

export const MazeGrid: React.FC<Props> = ({ grid, cellSize, theme: themeType, children, showGridLines = false }) => {
  const themeConfig = THEMES[themeType];
  const isCozy = themeType === 'cozy';
  const padding = isCozy ? theme.spacing[3] : 0;
  const gap = isCozy ? theme.spacing[1] : 0;

  const containerWidth = grid.width * cellSize + (isCozy ? (grid.width - 1) * gap + padding * 2 : 0);
  const containerHeight = grid.height * cellSize + (isCozy ? (grid.height - 1) * gap + padding * 2 : 0);

  const containerStyle = useMemo(
    () => ({
      width: containerWidth,
      height: containerHeight,
      borderRadius: isCozy ? theme.borderRadius.xl : theme.borderRadius.md,
      borderWidth: isCozy ? 6 : 0,
      borderColor: themeConfig.borderColor || 'transparent',
    }),
    [containerWidth, containerHeight, isCozy, themeConfig.borderColor]
  );

  const innerStyle = useMemo(
    () => ({
      padding: isCozy ? padding : 0,
      gap: isCozy ? gap : 0,
    }),
    [isCozy, padding, gap]
  );

  // Pour le style Cozy, on utilise un LinearGradient comme fond
  if (isCozy) {
    return (
      <View style={[styles.outerContainer, containerStyle, styles.cozyBorder]}>
        <LinearGradient
          colors={['#A67C52', '#8B6B45']}
          style={[styles.gradientBackground, { borderRadius: theme.borderRadius.xl - 6 }]}
        >
          {/* Effet parquet (lignes subtiles) */}
          <View style={styles.woodGrainOverlay} />

          <View style={[styles.cellsContainer, innerStyle]}>
            {grid.cells.map((row, y) => (
              <View key={`row-${y}`} style={styles.row}>
                {row.map((cell, x) => (
                  <MazeCell key={`${x}-${y}`} cell={cell} cellSize={cellSize} theme={themeConfig} />
                ))}
              </View>
            ))}
            {children}
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Style classique pour les autres thèmes
  return (
    <View style={[styles.container, containerStyle, { backgroundColor: themeConfig.backgroundColor }]}>
      {/* Lignes de grille verticales */}
      {showGridLines && Array.from({ length: grid.width + 1 }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={[
            styles.gridLineVertical,
            {
              left: i * cellSize,
              height: grid.height * cellSize,
            },
          ]}
        />
      ))}

      {/* Lignes de grille horizontales */}
      {showGridLines && Array.from({ length: grid.height + 1 }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={[
            styles.gridLineHorizontal,
            {
              top: i * cellSize,
              width: grid.width * cellSize,
            },
          ]}
        />
      ))}

      {grid.cells.map((row, y) =>
        row.map((cell, x) => (
          <MazeCell key={`${x}-${y}`} cell={cell} cellSize={cellSize} theme={themeConfig} />
        ))
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cozyBorder: {
    borderStyle: 'solid',
  },
  gradientBackground: {
    flex: 1,
    overflow: 'hidden',
  },
  woodGrainOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  cellsContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[1],
  },
  container: {
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  gridLineVertical: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 1,
  },
  gridLineHorizontal: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 1,
  },
});
