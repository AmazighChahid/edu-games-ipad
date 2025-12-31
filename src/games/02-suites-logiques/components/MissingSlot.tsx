import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SequenceElement as ElementType, GameStatus } from '../types';
import { DIMENSIONS, ELEMENT_COLORS } from '../data/gameConfig';
import { SequenceElement } from './SequenceElement';

// ============================================
// COMPOSANT MISSING SLOT
// Zone "?" pour l'élément manquant
// ============================================

interface Props {
  expectedElement: ElementType;
  placedElement: ElementType | null;
  status: GameStatus;
  onDrop?: () => void;
  size?: number;
}

export const MissingSlot: React.FC<Props> = ({
  expectedElement,
  placedElement,
  status,
  onDrop,
  size = DIMENSIONS.missingSlot.size,
}) => {
  // Animation de pulsation de la bordure
  const borderPulseStyle = useAnimatedStyle(() => {
    if (status === 'success' || placedElement) return {};

    return {
      borderColor: withRepeat(
        withSequence(
          withTiming(ELEMENT_COLORS.highlight, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(ELEMENT_COLORS.border, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      ),
    };
  }, [status, placedElement]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: DIMENSIONS.missingSlot.borderRadius,
        },
        borderPulseStyle,
      ]}
    >
      {placedElement ? (
        // Afficher l'élément placé
        <SequenceElement
          element={placedElement}
          size={size}
        />
      ) : (
        // Afficher le point d'interrogation
        <Text style={[styles.questionMark, { fontSize: size * 0.6 }]}>?</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ELEMENT_COLORS.white,
    borderWidth: DIMENSIONS.missingSlot.borderWidth,
    borderColor: ELEMENT_COLORS.border,
    borderStyle: 'dashed',
  },
  questionMark: {
    fontWeight: 'bold',
    color: ELEMENT_COLORS.highlight,
    opacity: 0.5,
  },
});
