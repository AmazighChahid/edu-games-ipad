import React, { useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { SequenceElement as ElementType } from '../types';
import { SequenceElement } from './SequenceElement';
import { DIMENSIONS } from '../constants/gameConfig';

// ============================================
// COMPOSANT CHOICE PANEL
// Panel contenant les options de réponse
// ============================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

type StatusType = 'playing' | 'checking' | 'success' | 'error' | 'hint';

interface Props {
  choices: ElementType[];
  selectedId: string | undefined;
  onSelect: (element: ElementType) => void;
  onConfirm?: (element: ElementType) => void;
  disabled: boolean;
  hintLevel: number;
  correctAnswerId: string;
  status?: StatusType;
}

export const ChoicePanel: React.FC<Props> = ({
  choices,
  selectedId,
  onSelect,
  onConfirm,
  disabled,
  hintLevel,
  correctAnswerId,
  status = 'playing',
}) => {
  // Référence pour conserver l'ordre des choix mélangés
  const shuffledOrderRef = useRef<string[]>([]);
  const lastChoicesKeyRef = useRef<string>('');

  // Animation pour le shake sur erreur
  const shakeAnim = useSharedValue(0);

  // Créer une clé unique pour détecter un changement de séquence
  const choicesKey = choices.map(c => c.id).sort().join(',');

  // Mélanger uniquement quand une nouvelle séquence arrive
  const shuffledChoices = useMemo(() => {
    if (choicesKey !== lastChoicesKeyRef.current) {
      // Nouvelle séquence : mélanger et sauvegarder l'ordre
      const shuffled = [...choices].sort(() => Math.random() - 0.5);
      shuffledOrderRef.current = shuffled.map(c => c.id);
      lastChoicesKeyRef.current = choicesKey;
      return shuffled;
    }
    // Même séquence : utiliser l'ordre sauvegardé
    return shuffledOrderRef.current
      .map(id => choices.find(c => c.id === id))
      .filter(Boolean) as ElementType[];
  }, [choices, choicesKey]);

  // Animation de shake sur erreur
  useEffect(() => {
    if (status === 'error') {
      shakeAnim.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [status]);

  const containerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnim.value }],
  }));

  // Filtrer selon le niveau d'indice (sans re-mélanger)
  const visibleChoices = useMemo(() => {
    if (hintLevel >= 4) {
      // Niveau 4: Ne montrer que la bonne réponse
      return shuffledChoices.filter(c => c.id === correctAnswerId);
    }
    if (hintLevel >= 3) {
      // Niveau 3: Ne montrer que 2 options (correct + 1 distracteur) - garder l'ordre
      const correct = shuffledChoices.find(c => c.id === correctAnswerId);
      const distractor = shuffledChoices.find(c => c.id !== correctAnswerId);
      // Retourner dans l'ordre original du shuffle
      return shuffledChoices.filter(
        c => c.id === correctAnswerId || c.id === distractor?.id
      );
    }
    return shuffledChoices;
  }, [shuffledChoices, hintLevel, correctAnswerId]);

  // Couleur de fond selon le statut
  const getBackgroundColor = () => {
    switch (status) {
      case 'success':
        return 'rgba(76, 175, 80, 0.3)'; // Vert
      case 'error':
        return 'rgba(244, 67, 54, 0.3)'; // Rouge
      default:
        return 'rgba(255, 255, 255, 0.8)';
    }
  };

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
        // Ne plus confirmer automatiquement - l'utilisateur doit cliquer sur "Valider"
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
    <AnimatedView
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        containerAnimStyle,
      ]}
    >
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

      {/* Bouton Valider - apparaît quand une réponse est sélectionnée */}
      {selectedId && !disabled && onConfirm && (
        <Animated.View entering={FadeIn} style={styles.validateButtonContainer}>
          <Pressable
            style={styles.validateButton}
            onPress={() => {
              const selected = choices.find(c => c.id === selectedId);
              if (selected) {
                onConfirm(selected);
              }
            }}
          >
            <Text style={styles.validateButtonText}>✓ Valider</Text>
          </Pressable>
        </Animated.View>
      )}
    </AnimatedView>
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
  validateButtonContainer: {
    marginTop: DIMENSIONS.spacing.lg,
    alignItems: 'center',
  },
  validateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  validateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
