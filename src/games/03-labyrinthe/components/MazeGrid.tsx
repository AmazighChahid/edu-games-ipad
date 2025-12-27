import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MazeCell } from './MazeCell';
import { MazeGrid as GridType, ThemeType } from '../types';
import { THEMES } from '../data/themes';

interface Props {
  grid: GridType;
  cellSize: number;
  theme: ThemeType;
  children?: React.ReactNode;
  showGridLines?: boolean;
}

export const MazeGrid: React.FC<Props> = ({ grid, cellSize, theme, children, showGridLines = true }) => {
  const themeConfig = THEMES[theme];

  const gridStyle = useMemo(
    () => ({
      width: grid.width * cellSize,
      height: grid.height * cellSize,
      backgroundColor: themeConfig.backgroundColor,
    }),
    [grid.width, grid.height, cellSize, themeConfig]
  );

  return (
    <View style={[styles.container, gridStyle]}>
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
  container: {
    position: 'relative',
    borderRadius: 12,
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
