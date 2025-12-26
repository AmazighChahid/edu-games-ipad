/**
 * Keyboard Component
 *
 * Clavier personnalisé pour les mots croisés
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows, fontFamily } from '@/theme';
import { useAccessibilityAnimations } from '@/hooks';

// ============================================================================
// TYPES
// ============================================================================

interface KeyboardProps {
  /** Callback quand une lettre est pressée */
  onLetterPress: (letter: string) => void;
  /** Callback pour effacer */
  onDelete: () => void;
  /** Désactivé */
  disabled?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const KEYBOARD_ROWS = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['W', 'X', 'C', 'V', 'B', 'N', '⌫'],
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const KEY_MARGIN = 3;
const KEYBOARD_PADDING = 8;

// ============================================================================
// KEY COMPONENT
// ============================================================================

interface KeyProps {
  letter: string;
  onPress: () => void;
  isSpecial?: boolean;
  disabled?: boolean;
  size: number;
}

function Key({ letter, onPress, isSpecial, disabled, size }: KeyProps) {
  const { springConfig } = useAccessibilityAnimations();
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (disabled) return;

    scale.value = withSequence(
      withSpring(0.85, springConfig),
      withSpring(1, springConfig)
    );

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View
        style={[
          styles.key,
          {
            width: isSpecial ? size * 1.5 : size,
            height: size * 1.2,
            backgroundColor: isSpecial
              ? colors.primary.main
              : colors.background.card,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.keyText,
            {
              fontSize: isSpecial ? 18 : 20,
              color: isSpecial ? '#FFF' : colors.text.primary,
            },
          ]}
        >
          {letter}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ============================================================================
// KEYBOARD COMPONENT
// ============================================================================

export function Keyboard({
  onLetterPress,
  onDelete,
  disabled = false,
}: KeyboardProps) {
  // Calculer la taille des touches
  const maxKeysInRow = Math.max(...KEYBOARD_ROWS.map((row) => row.length));
  const keySize = Math.floor(
    (SCREEN_WIDTH - KEYBOARD_PADDING * 2 - KEY_MARGIN * maxKeysInRow * 2) /
      maxKeysInRow
  );

  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      onDelete();
    } else {
      onLetterPress(key);
    }
  };

  return (
    <View style={styles.container}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <Key
              key={key}
              letter={key}
              onPress={() => handleKeyPress(key)}
              isSpecial={key === '⌫'}
              disabled={disabled}
              size={keySize}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    paddingVertical: spacing[2],
    paddingHorizontal: KEYBOARD_PADDING,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: KEY_MARGIN,
  },
  key: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    marginHorizontal: KEY_MARGIN,
    ...shadows.sm,
  },
  keyText: {
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
  },
});

export default Keyboard;
