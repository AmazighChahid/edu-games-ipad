/**
 * Composant Tour (Piquet)
 * Design moderne en bois avec effet de brillance
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, LayoutRectangle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue,
  withRepeat,
  interpolateColor,
} from 'react-native-reanimated';
import { Disc } from './Disc';
import { Tower as TowerType } from '../types';
import { Colors, Layout } from '../../../constants';

interface TowerProps {
  tower: TowerType;
  totalDiscs: number;
  selectedTower: number | null;
  onDiscDragStart: (towerIndex: number) => void;
  onDiscDragEnd: (towerIndex: number, position: { x: number; y: number }) => void;
  onDiscTap: (towerIndex: number) => void;
  onLayout?: (layout: LayoutRectangle) => void;
  isValidDropTarget: boolean;
  isHovering: boolean;
  isHintSource?: boolean;
  isHintTarget?: boolean;
}

const TOWER_WIDTH = 120;
const POLE_HEIGHT = 200;
const POLE_WIDTH = 14;

export const Tower: React.FC<TowerProps> = ({
  tower,
  totalDiscs,
  selectedTower,
  onDiscDragStart,
  onDiscDragEnd,
  onDiscTap,
  onLayout,
  isValidDropTarget,
  isHovering,
  isHintSource = false,
  isHintTarget = false,
}) => {
  const shakeX = useSharedValue(0);
  const hintPulse = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  // Animation de pulsation pour l'indice
  useEffect(() => {
    if (isHintSource || isHintTarget) {
      hintPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0, { duration: 600 })
        ),
        -1,
        true
      );
      glowOpacity.value = withTiming(1, { duration: 300 });
    } else {
      hintPulse.value = 0;
      glowOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isHintSource, isHintTarget]);

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const glowStyle = useAnimatedStyle(() => {
    const color = isHintSource
      ? `rgba(245, 166, 35, ${hintPulse.value * 0.5})`
      : isHintTarget
      ? `rgba(72, 187, 120, ${hintPulse.value * 0.5})`
      : 'transparent';

    return {
      backgroundColor: color,
      opacity: glowOpacity.value,
    };
  });

  const handleLayout = (event: { nativeEvent: { layout: LayoutRectangle } }) => {
    if (onLayout) {
      onLayout(event.nativeEvent.layout);
    }
  };

  const isSelected = selectedTower === tower.id;

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      onLayout={handleLayout}
    >
      {/* Glow d'indice */}
      <Animated.View style={[styles.glowOverlay, glowStyle]} />

      {/* Piquet en bois avec dégradé */}
      <View style={styles.poleContainer}>
        <LinearGradient
          colors={[Colors.wood.poleHighlight, Colors.wood.pole, Colors.wood.medium]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.pole}
        >
          {/* Reflet brillant */}
          <View style={styles.poleHighlight} />
        </LinearGradient>

        {/* Sommet arrondi du piquet */}
        <View style={styles.poleTop}>
          <LinearGradient
            colors={[Colors.wood.poleHighlight, Colors.wood.pole]}
            style={styles.poleTopGradient}
          />
        </View>
      </View>

      {/* Zone des disques */}
      <View style={styles.discsContainer}>
        {tower.discs.map((disc, index) => (
          <Disc
            key={disc.id}
            disc={disc}
            towerIndex={tower.id}
            discIndex={index}
            isTop={index === tower.discs.length - 1}
            totalDiscs={totalDiscs}
            onDragStart={() => onDiscDragStart(tower.id)}
            onDragEnd={(position) => onDiscDragEnd(tower.id, position)}
            onTap={() => onDiscTap(tower.id)}
            isSelected={isSelected && index === tower.discs.length - 1}
            isHintHighlighted={isHintSource && index === tower.discs.length - 1}
          />
        ))}
      </View>

      {/* Indicateur de drop zone valide */}
      {isValidDropTarget && (
        <View style={styles.dropIndicator}>
          <View style={styles.dropIndicatorInner} />
        </View>
      )}

      {/* Indicateur de sélection */}
      {isSelected && (
        <View style={styles.selectedIndicator} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: TOWER_WIDTH,
    height: POLE_HEIGHT + 80,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    zIndex: -1,
  },
  poleContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  pole: {
    width: POLE_WIDTH,
    height: POLE_HEIGHT,
    borderRadius: POLE_WIDTH / 2,
    overflow: 'hidden',
  },
  poleHighlight: {
    position: 'absolute',
    left: 2,
    top: 20,
    bottom: 20,
    width: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  poleTop: {
    position: 'absolute',
    top: -8,
    width: POLE_WIDTH + 4,
    height: 16,
    borderRadius: (POLE_WIDTH + 4) / 2,
    overflow: 'hidden',
  },
  poleTopGradient: {
    flex: 1,
    borderRadius: (POLE_WIDTH + 4) / 2,
  },
  discsContainer: {
    position: 'absolute',
    bottom: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column-reverse',
  },
  dropIndicator: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.feedback.success,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropIndicatorInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.feedback.success + '30',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 60,
    height: 6,
    backgroundColor: Colors.secondary.medium,
    borderRadius: 3,
  },
});
