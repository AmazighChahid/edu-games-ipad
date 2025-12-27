/**
 * Sky - Ciel dégradé pour ForestBackground V10
 * Gradient vertical du bleu au vert
 */

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { skyGradient, HomeV10ZIndex } from '../../../theme/home-v10-colors';

export const Sky = memo(() => {
  return (
    <LinearGradient
      colors={[...skyGradient.colors]}
      locations={[...skyGradient.locations]}
      start={skyGradient.start}
      end={skyGradient.end}
      style={styles.sky}
    />
  );
});

Sky.displayName = 'Sky';

const styles = StyleSheet.create({
  sky: {
    ...StyleSheet.absoluteFillObject,
    zIndex: HomeV10ZIndex.sky,
  },
});
