/**
 * SudokuBackground component
 * Library-themed background for Sudoku game matching HTML mockup
 * Features: sky gradient, clouds, stars, bookshelf, books, and plants
 */

import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme';
import { LibraryDecoration } from './LibraryDecoration';

interface SudokuBackgroundProps {
  children: React.ReactNode;
}

// Color palette for the library/classroom theme
const LIBRARY_COLORS = {
  skyGradient: ['#E8F4FD', '#D4ECFB', '#C9E4F7', '#B8D4E8'] as const,
  skyLocations: [0, 0.4, 0.7, 1] as const,
};

export function SudokuBackground({ children }: SudokuBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Sky gradient background - matching HTML mockup */}
      <LinearGradient
        colors={LIBRARY_COLORS.skyGradient}
        locations={LIBRARY_COLORS.skyLocations}
        style={styles.gradient}
      />

      {/* Library decorations (clouds, stars, bookshelf, books, plants) */}
      <LibraryDecoration />

      {/* Content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
