import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
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
          />
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sequenceRow}>
          {renderElements()}

          {/* Zone manquante */}
          <MissingSlot
            expectedElement={sequence.correctAnswer}
            placedElement={status === 'success' ? sequence.correctAnswer : selectedAnswer}
            status={status}
            onDrop={onDropInSlot}
          />
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: DIMENSIONS.spacing.sm,
  },
  sequenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DIMENSIONS.sequenceElement.spacing,
  },
});
