/**
 * Base en bois 3D isométrique pour le plateau de jeu
 * Effet visuel de profondeur avec dégradés
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants';

interface WoodenBaseProps {
  width: number;
}

export const WoodenBase: React.FC<WoodenBaseProps> = ({ width }) => {
  const height = 40;
  const depth = 25;

  return (
    <View style={[styles.container, { width }]}>
      {/* Surface supérieure du plateau */}
      <LinearGradient
        colors={[Colors.wood.baseHighlight, Colors.wood.base, Colors.wood.medium]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.topSurface, { width, height }]}
      >
        {/* Reflet brillant sur le bois */}
        <View style={styles.highlight} />
      </LinearGradient>

      {/* Face avant (profondeur 3D) */}
      <LinearGradient
        colors={[Colors.wood.medium, Colors.wood.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.frontFace, { width, height: depth }]}
      />

      {/* Ombre projetée */}
      <View style={[styles.shadow, { width: width - 20 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  topSurface: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 4,
    left: 20,
    right: 20,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  frontFace: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -2,
  },
  shadow: {
    height: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 100,
    marginTop: 5,
  },
});
