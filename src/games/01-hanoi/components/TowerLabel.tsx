/**
 * TowerLabel component
 * Labels for towers: Départ, Étape, Arrivée
 * Color-coded with child-friendly design
 */

import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { textStyles, spacing, borderRadius, shadows } from '../../../theme';

type TowerType = 'start' | 'middle' | 'end';

interface TowerLabelProps {
  type: TowerType;
}

// Label configurations
const LABEL_CONFIG: Record<TowerType, {
  text: string;
  emoji: string;
  colors: [string, string] | string;
  textColor: string;
  isGradient: boolean;
}> = {
  start: {
    text: 'Départ',
    emoji: '🏠',
    colors: '#5B8DEE',
    textColor: '#5B8DEE',
    isGradient: false,
  },
  middle: {
    text: 'Étape',
    emoji: '🔄',
    colors: '#5B8DEE',
    textColor: '#FFFFFF',
    isGradient: false,
  },
  end: {
    text: 'Arrivée',
    emoji: '🎯',
    colors: ['#7BC74D', '#5BAE6B'] as [string, string],
    textColor: '#FFFFFF',
    isGradient: true,
  },
};

export function TowerLabel({ type }: TowerLabelProps) {
  const config = LABEL_CONFIG[type];

  // Solid background for start and middle
  if (!config.isGradient) {
    const isStart = type === 'start';
    return (
      <View style={[
        styles.container,
        isStart ? styles.containerOutline : styles.containerSolid,
        !isStart && { backgroundColor: config.colors as string },
      ]}>
        <Text style={[
          styles.text,
          { color: config.textColor },
        ]}>
          {config.text} {config.emoji}
        </Text>
      </View>
    );
  }

  // Gradient background for end tower
  return (
    <LinearGradient
      colors={config.colors as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={[styles.text, { color: config.textColor }]}>
        {config.text} {config.emoji}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  containerOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#5B8DEE',
  },
  containerSolid: {
    // Background color set inline
  },
  text: {
    ...textStyles.caption,
    fontWeight: '700',
    fontSize: 14,
  },
});
