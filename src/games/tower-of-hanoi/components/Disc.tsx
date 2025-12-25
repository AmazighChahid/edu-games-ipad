/**
 * Composant Disque
 * Design plat moderne avec reflets subtils
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Disc as DiscType, getDiscColor } from '../types';
import { Colors, Layout } from '../../../constants';

interface DiscProps {
  disc: DiscType;
  towerIndex: number;
  discIndex: number;
  isTop: boolean;
  totalDiscs: number;
  onDragStart: () => void;
  onDragEnd: (dropPosition: { x: number; y: number }) => void;
  onTap: () => void;
  isSelected: boolean;
  isHintHighlighted?: boolean;
}

// Calculer la largeur du disque
const getDiscWidth = (size: number, totalDiscs: number): number => {
  const minWidth = 45;
  const maxWidth = 110;
  const range = maxWidth - minWidth;
  const step = range / (totalDiscs - 1 || 1);
  return minWidth + (size - 1) * step;
};

// Obtenir une couleur plus claire pour le dégradé
const getLighterColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const lighter = (c: number) => Math.min(255, c + 40);

  return `rgb(${lighter(r)}, ${lighter(g)}, ${lighter(b)})`;
};

// Obtenir une couleur plus foncée
const getDarkerColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const darker = (c: number) => Math.max(0, c - 30);

  return `rgb(${darker(r)}, ${darker(g)}, ${darker(b)})`;
};

export const Disc: React.FC<DiscProps> = ({
  disc,
  towerIndex,
  discIndex,
  isTop,
  totalDiscs,
  onDragStart,
  onDragEnd,
  onTap,
  isSelected,
  isHintHighlighted = false,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  const width = getDiscWidth(disc.size, totalDiscs);
  const baseColor = getDiscColor(disc.size);
  const lighterColor = getLighterColor(baseColor);
  const darkerColor = getDarkerColor(baseColor);

  // Animation de pulsation pour l'indice
  useEffect(() => {
    if (isHintHighlighted) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.3, { duration: 500 })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      glowOpacity.value = withTiming(0, { duration: 200 });
      if (!isSelected) {
        scale.value = withTiming(1, { duration: 200 });
      }
    }
  }, [isHintHighlighted]);

  const triggerHapticStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const triggerHapticEnd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Geste de glisser-déposer
  const panGesture = Gesture.Pan()
    .enabled(isTop)
    .onStart(() => {
      'worklet';
      scale.value = withSpring(1.15);
      zIndex.value = 100;
      runOnJS(triggerHapticStart)();
      runOnJS(onDragStart)();
    })
    .onChange((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      'worklet';
      scale.value = withSpring(1);
      zIndex.value = 0;
      runOnJS(triggerHapticEnd)();
      runOnJS(onDragEnd)({
        x: event.absoluteX,
        y: event.absoluteY,
      });
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  // Geste de tap
  const tapGesture = Gesture.Tap()
    .enabled(isTop)
    .onEnd(() => {
      'worklet';
      runOnJS(onTap)();
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.discContainer,
          { width: width + 10 },
          animatedStyle,
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Disque ${disc.size}`}
        accessibilityHint={
          isTop
            ? 'Tapez pour sélectionner ou glissez pour déplacer'
            : 'Ce disque ne peut pas être déplacé'
        }
        accessibilityState={{ disabled: !isTop }}
      >
        {/* Glow pour l'indice */}
        {isHintHighlighted && (
          <Animated.View
            style={[
              styles.hintGlow,
              { width: width + 20, backgroundColor: Colors.secondary.medium },
              glowStyle,
            ]}
          />
        )}

        {/* Disque avec dégradé */}
        <LinearGradient
          colors={[lighterColor, baseColor, darkerColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.disc,
            {
              width,
              opacity: isTop ? 1 : 0.9,
            },
            isSelected && styles.selected,
          ]}
        >
          {/* Reflet subtil en haut */}
          <View style={styles.highlight} />

          {/* Ombre interne en bas */}
          <View style={styles.innerShadow} />
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  discContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  disc: {
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Layout.shadow.medium,
  },
  highlight: {
    position: 'absolute',
    top: 3,
    left: '15%',
    right: '15%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 3,
  },
  innerShadow: {
    position: 'absolute',
    bottom: 2,
    left: '10%',
    right: '10%',
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
  },
  selected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Layout.shadow.large,
  },
  hintGlow: {
    position: 'absolute',
    height: 36,
    borderRadius: 18,
  },
});
