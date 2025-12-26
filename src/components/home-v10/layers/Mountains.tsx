/**
 * Mountains - Montagnes lointaines et proches pour ForestBackground V10
 * Formes triangulaires avec effet de profondeur
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { HomeV10Colors, HomeV10ZIndex } from '@/theme/home-v10-colors';

interface MountainProps {
  left?: number;
  right?: number;
  bottom: number;
  width: number;
  height: number;
  color: string;
}

const Mountain = memo(({ left, right, bottom, width, height, color }: MountainProps) => {
  const style = useMemo(
    () => ({
      position: 'absolute' as const,
      bottom,
      ...(left !== undefined ? { left } : {}),
      ...(right !== undefined ? { right } : {}),
      width: 0,
      height: 0,
      borderStyle: 'solid' as const,
      borderLeftWidth: width,
      borderRightWidth: width,
      borderBottomWidth: height,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: color,
    }),
    [left, right, bottom, width, height, color]
  );

  return <View style={style} />;
});

Mountain.displayName = 'Mountain';

// Neige sur montagne
const MountainSnow = memo(({ left, bottom }: { left: number; bottom: number }) => {
  const style = useMemo(
    () => ({
      position: 'absolute' as const,
      bottom,
      left,
      width: 0,
      height: 0,
      borderStyle: 'solid' as const,
      borderLeftWidth: 70,
      borderRightWidth: 70,
      borderBottomWidth: 60,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: HomeV10Colors.mountainSnow,
    }),
    [left, bottom]
  );

  return <View style={style} />;
});

MountainSnow.displayName = 'MountainSnow';

export const MountainsFar = memo(() => {
  const { height } = useWindowDimensions();
  const bottom = height * 0.42; // Position relative à la hauteur

  return (
    <View style={[styles.container, styles.mountainsFar]}>
      <Mountain left={-80} bottom={0} width={200} height={180} color={HomeV10Colors.mountainFar} />
      <Mountain left={250} bottom={0} width={250} height={220} color={HomeV10Colors.mountainMid} />
      <MountainSnow left={400} bottom={180} />
      <Mountain right={150} bottom={0} width={220} height={200} color={HomeV10Colors.mountainFar} />
      <Mountain right={-100} bottom={0} width={280} height={250} color={HomeV10Colors.mountainDark} />
    </View>
  );
});

MountainsFar.displayName = 'MountainsFar';

export const MountainsNear = memo(() => {
  return (
    <View style={[styles.container, styles.mountainsNear]}>
      <Mountain left={-50} bottom={0} width={150} height={130} color={HomeV10Colors.mountainNear} />
      <Mountain left={350} bottom={0} width={180} height={150} color="#4A8D5A" />
      <Mountain right={50} bottom={0} width={160} height={140} color={HomeV10Colors.mountainNear} />
    </View>
  );
});

MountainsNear.displayName = 'MountainsNear';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  mountainsFar: {
    bottom: 350,
    zIndex: HomeV10ZIndex.mountainsFar,
  },
  mountainsNear: {
    bottom: 250,
    zIndex: HomeV10ZIndex.mountainsNear,
  },
});
