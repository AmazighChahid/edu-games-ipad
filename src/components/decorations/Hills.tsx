import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/theme';

export const Hills: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Hill 1 - Front */}
      <LinearGradient
        colors={[theme.colors.home.hills.front, theme.colors.home.hills.frontDark]}
        style={[styles.hill, styles.hill1]}
      />
      {/* Hill 2 - Back (lighter) */}
      <LinearGradient
        colors={[theme.colors.home.hills.back, theme.colors.home.hills.backDark]}
        style={[styles.hill, styles.hill2]}
      />
      {/* Hill 3 - Front */}
      <LinearGradient
        colors={[theme.colors.home.hills.front, theme.colors.home.hills.frontDark]}
        style={[styles.hill, styles.hill3]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 2,
  },
  hill: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 9999,
    borderTopRightRadius: 9999,
  },
  hill1: {
    left: -100,
    width: 500,
    height: 250,
  },
  hill2: {
    left: 300,
    width: 600,
    height: 200,
  },
  hill3: {
    right: -150,
    width: 550,
    height: 230,
  },
});
