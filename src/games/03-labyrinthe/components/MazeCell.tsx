import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MazeCell as CellType, Theme } from '../types';
import { InteractiveElement } from './InteractiveElement';
import { theme as appTheme } from '@/theme';

interface Props {
  cell: CellType;
  cellSize: number;
  theme: Theme;
}

const DEFAULT_WALL_THICKNESS = 3;

export const MazeCell = memo<Props>(({ cell, cellSize, theme }) => {
  const isWall = cell.type === 'wall';
  const isStart = cell.type === 'start';
  const isEnd = cell.type === 'end';
  const isCozy = theme.id === 'cozy';
  const wallThickness = theme.wallThickness || DEFAULT_WALL_THICKNESS;

  // Style de cellule pour le mode Cozy (position relative dans la grille flex)
  const cozyCellStyle = useMemo(() => ({
    width: cellSize,
    height: cellSize,
    borderRadius: appTheme.borderRadius.sm,
  }), [cellSize]);

  // Style de cellule pour les autres thèmes (position absolue)
  const absoluteCellStyle = useMemo(() => ({
    position: 'absolute' as const,
    left: cell.x * cellSize,
    top: cell.y * cellSize,
    width: cellSize,
    height: cellSize,
  }), [cell.x, cell.y, cellSize]);

  // Rendu pour le thème Cozy (Version 5 - Bois Cozy)
  if (isCozy) {
    return (
      <View style={[styles.cozyCell, cozyCellStyle]}>
        <LinearGradient
          colors={
            isWall
              ? [theme.wallColor, theme.wallColor]
              : [
                  theme.cellGradient?.start || '#F5DEB3',
                  theme.cellGradient?.middle || '#DEB887',
                  theme.cellGradient?.end || '#D2B48C',
                ]
          }
          locations={isWall ? [0, 1] : [0, 0.5, 1]}
          style={[styles.cozyCellGradient, { borderRadius: appTheme.borderRadius.sm }]}
        >
          {/* Effet de reflet (highlight) */}
          {!isWall && (
            <View style={[styles.cozyHighlight, { borderRadius: appTheme.borderRadius.sm }]} />
          )}

          {/* Murs épais style Bois Cozy */}
          {!isWall && (
            <>
              {cell.walls.top && (
                <View
                  style={[
                    styles.wallTop,
                    { backgroundColor: theme.wallColor, height: wallThickness },
                  ]}
                />
              )}
              {cell.walls.right && (
                <View
                  style={[
                    styles.wallRight,
                    { backgroundColor: theme.wallColor, width: wallThickness },
                  ]}
                />
              )}
              {cell.walls.bottom && (
                <View
                  style={[
                    styles.wallBottom,
                    { backgroundColor: theme.wallColor, height: wallThickness },
                  ]}
                />
              )}
              {cell.walls.left && (
                <View
                  style={[
                    styles.wallLeft,
                    { backgroundColor: theme.wallColor, width: wallThickness },
                  ]}
                />
              )}
            </>
          )}

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

          {/* Trace de visite */}
          {cell.visited && !isWall && <View style={styles.cozyVisitedOverlay} />}
        </LinearGradient>
      </View>
    );
  }

  // Rendu classique pour les autres thèmes
  const backgroundStyle = {
    backgroundColor: isWall ? theme.wallColor : theme.pathColor,
  };

  return (
    <View style={[styles.cell, absoluteCellStyle, backgroundStyle]}>
      {/* Murs entre les cellules */}
      {!isWall && (
        <>
          {cell.walls.top && (
            <View
              style={[
                styles.wallTop,
                { backgroundColor: theme.wallColor, height: wallThickness },
              ]}
            />
          )}
          {cell.walls.right && (
            <View
              style={[
                styles.wallRight,
                { backgroundColor: theme.wallColor, width: wallThickness },
              ]}
            />
          )}
          {cell.walls.bottom && (
            <View
              style={[
                styles.wallBottom,
                { backgroundColor: theme.wallColor, height: wallThickness },
              ]}
            />
          )}
          {cell.walls.left && (
            <View
              style={[
                styles.wallLeft,
                { backgroundColor: theme.wallColor, width: wallThickness },
              ]}
            />
          )}
        </>
      )}

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
  cozyCell: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cozyCellGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cozyHighlight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderWidth: 0,
    opacity: 0.4,
    // Simule le radial-gradient avec un effet de brillance en haut-gauche
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  cozyVisitedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(91, 141, 238, 0.2)',
    borderRadius: appTheme.borderRadius.sm,
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
  wallTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  wallRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  wallBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  wallLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
});
