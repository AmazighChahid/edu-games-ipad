/**
 * GameGrid component
 * Displays the grid of math blocks
 */

import { View, StyleSheet, useWindowDimensions } from 'react-native';

import { colors, spacing, borderRadius } from '../../../theme';
import type { GameGrid as GameGridType, MathBlock as MathBlockType } from '../types';
import { MathBlock } from './MathBlock';

interface GameGridProps {
  grid: GameGridType;
  onBlockPress: (block: MathBlockType) => void;
}

export function GameGrid({ grid, onBlockPress }: GameGridProps) {
  const { width, height } = useWindowDimensions();

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  // Calculate block size based on available space
  const isLandscape = width > height;
  const availableWidth = isLandscape ? width * 0.7 : width * 0.9;
  const availableHeight = isLandscape ? height * 0.5 : height * 0.45;

  const blockWidth = (availableWidth - spacing[2] * (cols + 1)) / cols;
  const blockHeight = (availableHeight - spacing[2] * (rows + 1)) / rows;
  const blockSize = Math.min(blockWidth, blockHeight, 100);

  const gridWidth = blockSize * cols + spacing[2] * (cols + 1);
  const gridHeight = blockSize * rows + spacing[2] * (rows + 1);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.gridContainer,
          {
            width: gridWidth,
            height: gridHeight,
          },
        ]}
      >
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((block, colIndex) => (
              <View key={`${rowIndex}-${colIndex}`} style={styles.cell}>
                {block && (
                  <MathBlock
                    block={block}
                    size={blockSize}
                    onPress={onBlockPress}
                  />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[2],
    // Shadow
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
