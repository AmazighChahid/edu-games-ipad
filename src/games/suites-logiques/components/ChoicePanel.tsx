import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SequenceElement as ElementType } from '../types';
import { SequenceElement } from './SequenceElement';
import { DIMENSIONS } from '../constants/gameConfig';

// ============================================
// COMPOSANT CHOICE PANEL
// Panel contenant les options de réponse
// ============================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  choices: ElementType[];
  selectedId: string | undefined;
  onSelect: (element: ElementType) => void;
  onConfirm?: (element: ElementType) => void;
  disabled: boolean;
  hintLevel: number;
  correctAnswerId: string;
}

export const ChoicePanel: React.FC<Props> = ({
  choices,
  selectedId,
  onSelect,
  onConfirm,
  disabled,
  hintLevel,
  correctAnswerId,
}) => {
  // Mélanger les choix une seule fois
  const shuffledChoices = useMemo(() => {
    return [...choices].sort(() => Math.random() - 0.5);
  }, [choices]);

  // Filtrer selon le niveau d'indice
  const visibleChoices = useMemo(() => {
    if (hintLevel >= 3) {
      // Niveau 3: Ne montrer que 2 options (correct + 1 distracteur)
      const correct = shuffledChoices.find(c => c.id === correctAnswerId)!;
      const distractor = shuffledChoices.find(c => c.id !== correctAnswerId)!;
      return [correct, distractor].sort(() => Math.random() - 0.5);
    }
    if (hintLevel >= 4) {
      // Niveau 4: Ne montrer que la bonne réponse
      return shuffledChoices.filter(c => c.id === correctAnswerId);
    }
    return shuffledChoices;
  }, [shuffledChoices, hintLevel, correctAnswerId]);

  // Composant pour un bouton de choix individuel
  const ChoiceButton: React.FC<{
    element: ElementType;
    isSelected: boolean;
    isRevealed: boolean;
  }> = ({ element, isSelected, isRevealed }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
      scale.value = withSpring(1);
    };

    const handlePress = () => {
      if (!disabled) {
        onSelect(element);
        // Confirmer automatiquement après sélection
        if (onConfirm) {
          setTimeout(() => onConfirm(element), 100);
        }
      }
    };

    return (
      <AnimatedPressable
        style={[
          styles.choiceButton,
          isSelected && styles.selectedChoice,
          isRevealed && styles.revealedChoice,
          animatedStyle,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
      >
        <SequenceElement element={element} size={DIMENSIONS.choice.size} />
      </AnimatedPressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.choicesRow}>
        {visibleChoices.map(choice => (
          <ChoiceButton
            key={choice.id}
            element={choice}
            isSelected={choice.id === selectedId}
            isRevealed={hintLevel >= 4 && choice.id === correctAnswerId}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: DIMENSIONS.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    marginHorizontal: DIMENSIONS.spacing.lg,
  },
  choicesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: DIMENSIONS.choice.spacing,
    flexWrap: 'wrap',
  },
  choiceButton: {
    borderRadius: DIMENSIONS.choice.borderRadius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedChoice: {
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  revealedChoice: {
    shadowColor: '#7BC74D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
});
