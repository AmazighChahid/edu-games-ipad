/**
 * Sélecteur de mode de jeu
 * Permet de choisir entre Découverte, Défi et Expert
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Layout } from '../../../constants';
import { GameMode, GAME_MODES } from '../types';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <View style={styles.container}>
      {GAME_MODES.map((mode, index) => {
        const isActive = currentMode === mode.id;
        const isDiscovery = mode.id === 'discovery';

        return (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeButton,
              isActive && styles.modeButtonActive,
              isDiscovery && isActive && styles.discoveryButtonActive,
            ]}
            onPress={() => onModeChange(mode.id)}
            accessibilityLabel={mode.label}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.modeText,
                isActive && styles.modeTextActive,
              ]}
            >
              {isDiscovery && isActive ? '• ' : ''}
              {mode.label}
              {isDiscovery && isActive ? ': ' : ''}
            </Text>
            {isDiscovery && isActive && (
              <Text style={styles.sunIcon}>{'☀️'}</Text>
            )}
            {!isDiscovery && isActive && (
              <Text style={styles.chevron}>{'>'}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary.medium,
    borderRadius: 30,
    padding: 4,
    ...Layout.shadow.small,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 26,
    minWidth: 100,
  },
  modeButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  discoveryButtonActive: {
    backgroundColor: Colors.secondary.dark,
  },
  modeText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  modeTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chevron: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '700',
  },
  sunIcon: {
    fontSize: 16,
    marginLeft: 2,
  },
});
