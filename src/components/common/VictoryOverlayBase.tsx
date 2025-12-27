/**
 * VictoryOverlayBase Component
 *
 * Overlay de base pour les écrans de victoire
 * Fournit le backdrop assombrissant et le conteneur centré
 *
 * @example
 * <VictoryOverlayBase visible={isVictory}>
 *   <Confetti />
 *   <VictoryCard stats={stats} />
 * </VictoryOverlayBase>
 */

import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface VictoryOverlayBaseProps {
  /** Visibilité de l'overlay */
  visible: boolean;
  /** Contenu de l'overlay */
  children: ReactNode;
  /** Opacité du backdrop (0-1) */
  backdropOpacity?: number;
  /** Couleur du backdrop */
  backdropColor?: string;
  /** Durée de l'animation d'entrée en ms */
  enterDuration?: number;
  /** Durée de l'animation de sortie en ms */
  exitDuration?: number;
  /** Style personnalisé du conteneur */
  style?: ViewStyle;
  /** Z-index de l'overlay */
  zIndex?: number;
}

export function VictoryOverlayBase({
  visible,
  children,
  backdropOpacity = 0.6,
  backdropColor = '#000000',
  enterDuration = 300,
  exitDuration = 200,
  style,
  zIndex = 1000,
}: VictoryOverlayBaseProps) {
  if (!visible) return null;

  return (
    <View style={[styles.overlay, { zIndex }, style]}>
      {/* Backdrop assombrissant */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            backgroundColor: backdropColor,
            opacity: backdropOpacity,
          },
        ]}
        entering={FadeIn.duration(enterDuration)}
        exiting={FadeOut.duration(exitDuration)}
      />

      {/* Contenu */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default VictoryOverlayBase;
