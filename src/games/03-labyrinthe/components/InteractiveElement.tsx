import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Icons } from '@/constants/icons';
import { InteractiveElement as InteractiveType } from '../types';

interface Props {
  element: InteractiveType;
  size: number;
}

const ELEMENT_ICONS: Record<string, string> = {
  key: Icons.key,
  door: Icons.door,
  gem: Icons.gem,
  button: '🔘',
  teleporter: Icons.spiral,
};

const COLOR_STYLES = {
  red: '#E53E3E',
  blue: '#5B8DEE',
  green: '#7BC74D',
  yellow: '#F39C12',
  purple: '#E056FD',
};

export const InteractiveElement: React.FC<Props> = ({ element, size }) => {
  const icon = ELEMENT_ICONS[element.type];
  const colorStyle = element.color ? COLOR_STYLES[element.color] : 'transparent';

  // Shared value pour l'animation de pulsation
  const scale = useSharedValue(1);

  // Démarrer l'animation de pulsation pour les objets collectables
  useEffect(() => {
    if (element.type === 'gem' || element.type === 'key') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
    }
  }, [element.type]);

  // Style animé simple qui lit la valeur partagée
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
    >
      {/* Cercle de couleur pour les clés et portes */}
      {element.color && (element.type === 'key' || element.type === 'door') && (
        <View
          style={[
            styles.colorCircle,
            {
              backgroundColor: colorStyle,
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: (size * 0.8) / 2,
            },
          ]}
        />
      )}

      {/* Icône */}
      <Text style={[styles.icon, { fontSize: size * 0.6 }]}>{icon}</Text>

      {/* Indicateur de porte fermée/ouverte */}
      {element.type === 'door' && !element.isActive && (
        <View style={[styles.lockIndicator, { top: -size * 0.1 }]}>
          <Text style={{ fontSize: size * 0.3 }}>{Icons.lock}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  colorCircle: {
    position: 'absolute',
    opacity: 0.3,
  },
  icon: {
    textAlign: 'center',
  },
  lockIndicator: {
    position: 'absolute',
    right: 0,
  },
});
