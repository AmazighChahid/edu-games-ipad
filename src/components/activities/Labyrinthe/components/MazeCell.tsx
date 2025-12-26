import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MazeCell as CellType, Theme } from '../types';
import { InteractiveElement } from './InteractiveElement';

interface Props {
  cell: CellType;
  cellSize: number;
  theme: Theme;
}

export const MazeCell = memo<Props>(({ cell, cellSize, theme }) => {
  const isWall = cell.type === 'wall';
  const isStart = cell.type === 'start';
  const isEnd = cell.type === 'end';

  const cellStyle = {
    position: 'absolute' as const,
    left: cell.x * cellSize,
    top: cell.y * cellSize,
    width: cellSize,
    height: cellSize,
  };

  const backgroundStyle = {
    backgroundColor: isWall ? theme.wallColor : theme.pathColor,
  };

  return (
    <View style={[styles.cell, cellStyle, backgroundStyle]}>
      {/* Marqueur de départ */}
      {isStart && (
        <View style={styles.marker}>
          <Text style={[styles.icon, { fontSize: cellSize * 0.5 }]}>{theme.startIcon}</Text>
        </View>
      )}

      {/* Marqueur d'arrivée */}
      {isEnd && (
        <View style={styles.marker}>
          <Text style={[styles.icon, { fontSize: cellSize * 0.5 }]}>{theme.endIcon}</Text>
        </View>
      )}

      {/* Élément interactif */}
      {cell.interactive && !cell.interactive.collected && (
        <InteractiveElement element={cell.interactive} size={cellSize * 0.7} />
      )}

      {/* Trace de visite (fil d'Ariane léger) */}
      {cell.visited && !isWall && <View style={styles.visitedOverlay} />}
    </View>
  );
});

MazeCell.displayName = 'MazeCell';

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  visitedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(91, 141, 238, 0.15)',
    borderRadius: 2,
  },
});
