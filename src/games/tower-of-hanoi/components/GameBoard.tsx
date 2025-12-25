/**
 * Plateau de jeu Tour de Hanoï
 * Design moderne avec plateau en bois 3D isométrique
 */

import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, LayoutRectangle, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Tower } from './Tower';
import { WoodenBase } from './WoodenBase';
import { useTowerOfHanoiStore } from '../../../store';
import { Colors, Layout } from '../../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_WIDTH = Math.min(SCREEN_WIDTH - 40, 700);

interface TowerLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GameBoardProps {
  currentHint?: { from: number; to: number } | null;
  onHintUsed?: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  currentHint,
  onHintUsed,
}) => {
  const {
    gameState,
    discCount,
    selectTower,
    moveDisc,
    canMove,
  } = useTowerOfHanoiStore();

  const [towerLayouts, setTowerLayouts] = useState<TowerLayout[]>([]);
  const [draggingFrom, setDraggingFrom] = useState<number | null>(null);
  const [hoveringTower, setHoveringTower] = useState<number | null>(null);
  const boardRef = useRef<View>(null);
  const [boardLayout, setBoardLayout] = useState<LayoutRectangle | null>(null);

  const handleTowerLayout = useCallback((towerIndex: number, layout: LayoutRectangle) => {
    setTowerLayouts((prev) => {
      const newLayouts = [...prev];
      newLayouts[towerIndex] = {
        x: layout.x,
        y: layout.y,
        width: layout.width,
        height: layout.height,
      };
      return newLayouts;
    });
  }, []);

  const handleDiscDragStart = useCallback((towerIndex: number) => {
    setDraggingFrom(towerIndex);
    if (onHintUsed) {
      onHintUsed();
    }
  }, [onHintUsed]);

  const handleDiscDragEnd = useCallback(
    (fromTower: number, position: { x: number; y: number }) => {
      if (!boardLayout) {
        setDraggingFrom(null);
        setHoveringTower(null);
        return;
      }

      let targetTower = -1;
      const relativeX = position.x - boardLayout.x;

      towerLayouts.forEach((layout, index) => {
        if (layout) {
          const towerLeft = layout.x - Layout.dropZone.padding;
          const towerRight = layout.x + layout.width + Layout.dropZone.padding;

          if (relativeX >= towerLeft && relativeX <= towerRight) {
            targetTower = index;
          }
        }
      });

      if (targetTower !== -1 && targetTower !== fromTower) {
        const success = moveDisc(fromTower, targetTower);

        if (success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      }

      setDraggingFrom(null);
      setHoveringTower(null);
    },
    [boardLayout, towerLayouts, moveDisc]
  );

  const handleDiscTap = useCallback(
    (towerIndex: number) => {
      selectTower(towerIndex);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onHintUsed) {
        onHintUsed();
      }
    },
    [selectTower, onHintUsed]
  );

  const isValidDropTarget = useCallback(
    (towerIndex: number): boolean => {
      if (draggingFrom === null) return false;
      if (draggingFrom === towerIndex) return false;
      return canMove(draggingFrom, towerIndex);
    },
    [draggingFrom, canMove]
  );

  const handleBoardLayout = (event: { nativeEvent: { layout: LayoutRectangle } }) => {
    setBoardLayout(event.nativeEvent.layout);
  };

  // Vérifier si une tour est la source ou la cible de l'indice
  const isHintSource = (towerIndex: number) => currentHint?.from === towerIndex;
  const isHintTarget = (towerIndex: number) => currentHint?.to === towerIndex;

  return (
    <View
      ref={boardRef}
      style={styles.container}
      onLayout={handleBoardLayout}
    >
      {/* Plateau en bois (base 3D) */}
      <WoodenBase width={BOARD_WIDTH} />

      {/* Conteneur des tours */}
      <View style={styles.towersContainer}>
        {gameState.towers.map((tower, index) => (
          <Tower
            key={tower.id}
            tower={tower}
            totalDiscs={discCount}
            selectedTower={gameState.selectedTower}
            onDiscDragStart={handleDiscDragStart}
            onDiscDragEnd={handleDiscDragEnd}
            onDiscTap={handleDiscTap}
            onLayout={(layout) => handleTowerLayout(index, layout)}
            isValidDropTarget={isValidDropTarget(index)}
            isHovering={hoveringTower === index}
            isHintSource={isHintSource(index)}
            isHintTarget={isHintTarget(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  towersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: BOARD_WIDTH,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 50,
  },
});
