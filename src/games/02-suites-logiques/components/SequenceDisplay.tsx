import React, { useMemo } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Sequence, SequenceElement as ElementType, GameStatus } from '../types';
import { SequenceElement } from './SequenceElement';
import { MissingSlot } from './MissingSlot';
import { DIMENSIONS } from '../constants/gameConfig';

// ============================================
// COMPOSANT SEQUENCE DISPLAY
// Affiche la suite complète avec les éléments + slot manquant
// ============================================

interface Props {
  sequence: Sequence;
  selectedAnswer: ElementType | null;
  status: GameStatus;
  hintLevel: number;
  onDropInSlot?: () => void;
}

export const SequenceDisplay: React.FC<Props> = ({
  sequence,
  selectedAnswer,
  status,
  hintLevel,
  onDropInSlot,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  // Calculer la taille optimale des éléments selon le nombre d'éléments
  const elementSize = useMemo(() => {
    // Nombre total d'éléments à afficher (séquence + slot manquant)
    const totalElements = sequence.elements.length + 1;

    // Espace disponible (largeur écran - padding container - marges)
    const containerPadding = DIMENSIONS.spacing.lg * 2; // padding du container
    const horizontalPadding = DIMENSIONS.spacing.sm * 2; // padding du scrollContent
    const availableWidth = screenWidth - containerPadding - horizontalPadding - 32; // 32 pour marges supplémentaires

    // Espace entre les éléments
    const totalSpacing = DIMENSIONS.sequenceElement.spacing * (totalElements - 1);

    // Taille maximale possible pour que tout rentre sans scroll
    const maxSizeForFit = (availableWidth - totalSpacing) / totalElements;

    // Limiter entre une taille min (60) et max (120) pour rester lisible
    const minSize = 60;
    const maxSize = 120;

    return Math.max(minSize, Math.min(maxSize, Math.floor(maxSizeForFit)));
  }, [sequence.elements.length, screenWidth]);

  // Déterminer quels éléments doivent pulser (pour les indices)
  const shouldElementPulse = (element: ElementType, index: number): boolean => {
    if (hintLevel < 2) return false;

    // Pour les patterns simples, faire pulser les éléments identiques
    const pattern = sequence.patternDef;

    if (pattern.type === 'ABAB' || pattern.type === 'AABB' || pattern.type === 'ABC') {
      // Identifier les éléments qui correspondent au pattern
      const cycleIndex = pattern.cycle[index % pattern.cycle.length];
      const expectedCycleIndex =
        pattern.cycle[sequence.missingIndex % pattern.cycle.length];

      return cycleIndex === expectedCycleIndex;
    }

    return false;
  };

  // Rendu des éléments de la séquence
  const renderElements = () => {
    return sequence.elements.map((element, index) => {
      const isPulsing = shouldElementPulse(element, index);
      const isHighlighted = hintLevel >= 1 && index < 2; // Mettre en évidence les 2 premiers

      return (
        <Animated.View
          key={element.id}
          entering={FadeInRight.delay(index * 100).springify()}
        >
          <SequenceElement
            element={element}
            index={index}
            isPulsing={isPulsing}
            isHighlighted={isHighlighted}
            size={elementSize}
          />
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>QUELLE FORME VIENT APRÈS ?</Text>
      <View style={styles.sequenceWrapper}>
        <View style={styles.sequenceRow}>
          {renderElements()}

          {/* Zone manquante */}
          <MissingSlot
            expectedElement={sequence.correctAnswer}
            placedElement={status === 'success' ? sequence.correctAnswer : selectedAnswer}
            status={status}
            onDrop={onDropInSlot}
            size={elementSize}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: DIMENSIONS.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
  },
  instructionText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#888888',
    textAlign: 'center',
    marginBottom: DIMENSIONS.spacing.md,
    letterSpacing: 1,
  },
  sequenceWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sequenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DIMENSIONS.sequenceElement.spacing,
  },
});
