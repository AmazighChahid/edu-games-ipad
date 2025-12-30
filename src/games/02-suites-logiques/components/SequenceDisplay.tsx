import React, { useMemo } from 'react';
import { View, StyleSheet, Text, useWindowDimensions, ScrollView } from 'react-native';
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

  // Calculer la largeur du conteneur (95% de l'écran avec marge)
  const containerWidth = useMemo(() => {
    return screenWidth - DIMENSIONS.spacing.lg * 2; // Marge de chaque côté
  }, [screenWidth]);

  // Taille fixe des éléments pour garantir la lisibilité
  const elementSize = useMemo(() => {
    const isLargeScreen = screenWidth > 768;
    return isLargeScreen ? 120 : 80;
  }, [screenWidth]);

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

  // Rendu des éléments de la séquence avec le slot manquant à la bonne position
  const renderSequenceWithSlot = () => {
    const items: React.ReactNode[] = [];
    let elementIndex = 0;

    // Nombre total d'items = éléments visibles + 1 slot manquant
    const totalItems = sequence.elements.length + 1;

    for (let position = 0; position < totalItems; position++) {
      if (position === sequence.missingIndex) {
        // Insérer le slot manquant à cette position
        items.push(
          <Animated.View
            key="missing-slot"
            entering={FadeInRight.delay(position * 100).springify()}
          >
            <MissingSlot
              expectedElement={sequence.correctAnswer}
              placedElement={status === 'success' ? sequence.correctAnswer : selectedAnswer}
              status={status}
              onDrop={onDropInSlot}
              size={elementSize}
            />
          </Animated.View>
        );
      } else {
        // Insérer un élément visible
        const element = sequence.elements[elementIndex];
        const isPulsing = shouldElementPulse(element, position);
        const isHighlighted = hintLevel >= 1 && position < 2;

        items.push(
          <Animated.View
            key={element.id}
            entering={FadeInRight.delay(position * 100).springify()}
          >
            <SequenceElement
              element={element}
              index={position}
              isPulsing={isPulsing}
              isHighlighted={isHighlighted}
              size={elementSize}
            />
          </Animated.View>
        );
        elementIndex++;
      }
    }

    return items;
  };

  // Déterminer l'instruction selon la position du slot manquant
  const getInstruction = () => {
    const totalItems = sequence.elements.length + 1;
    const isAtEnd = sequence.missingIndex === totalItems - 1;

    if (isAtEnd) {
      return 'QUEL ÉLÉMENT VIENT APRÈS ?';
    }
    return 'QUEL ÉLÉMENT MANQUE ?';
  };

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <Text style={styles.instructionText}>{getInstruction()}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sequenceRow}>
          {renderSequenceWithSlot()}
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
  instructionText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#888888',
    textAlign: 'center',
    marginBottom: DIMENSIONS.spacing.md,
    letterSpacing: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.sm,
  },
  sequenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DIMENSIONS.sequenceElement.spacing,
  },
});
