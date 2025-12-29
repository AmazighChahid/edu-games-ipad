import { useCallback, useMemo } from 'react';
import {
  Sequence,
  SequenceElement,
  ThemeType,
} from '../types';
import { THEMES } from '../data/themes';
import { getRandomPattern, getSequenceLengthFromPattern } from '../data/patterns';
import {
  selectBaseElements,
  applySizeTransform,
  applyRotationTransform,
  applyNumericTransform,
  generateDistractors,
  generateId,
} from '../utils/patternUtils';

// ============================================
// HOOK POUR GÉNÉRER DES SÉQUENCES
// ============================================

// Déterminer la position de l'élément manquant selon la difficulté
function getMissingIndexPosition(
  sequenceLength: number,
  difficulty: number
): number {
  // Niveaux 1-3 : toujours à la fin (plus facile)
  if (difficulty <= 3) {
    return sequenceLength - 1;
  }

  // Niveaux 4-6 : fin ou avant-dernier
  if (difficulty <= 6) {
    const positions = [sequenceLength - 1, sequenceLength - 2];
    return positions[Math.floor(Math.random() * positions.length)];
  }

  // Niveaux 7-8 : dernière moitié de la séquence
  if (difficulty <= 8) {
    const halfPoint = Math.floor(sequenceLength / 2);
    const possiblePositions = [];
    for (let i = halfPoint; i < sequenceLength; i++) {
      possiblePositions.push(i);
    }
    return possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
  }

  // Niveaux 9-10 : n'importe où sauf les 2 premiers
  const possiblePositions = [];
  for (let i = 2; i < sequenceLength; i++) {
    possiblePositions.push(i);
  }
  return possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
}

export function useSequenceGenerator(theme: ThemeType) {
  // Éléments du thème
  const themeElements = useMemo(() => {
    return THEMES[theme].elements;
  }, [theme]);

  // Générer une séquence complète
  const generateSequence = useCallback(
    (difficulty: number): Sequence => {
      const pattern = getRandomPattern(difficulty);
      // Utiliser la nouvelle fonction basée sur le pattern
      const sequenceLength = getSequenceLengthFromPattern(pattern);

      // Sélectionner les éléments de base pour ce pattern
      // Le nombre d'éléments = max indice dans le cycle + 1 (pas la longueur du cycle)
      const uniqueIndicesCount = Math.max(...pattern.cycle) + 1;
      const baseElements = selectBaseElements(
        themeElements,
        uniqueIndicesCount
      );

      // Construire la séquence complète selon le pattern
      const allElements: SequenceElement[] = [];

      for (let i = 0; i < sequenceLength; i++) {
        const cycleIndex = pattern.cycle[i % pattern.cycle.length];
        let element = { ...baseElements[cycleIndex] };

        // Appliquer les transformations si nécessaire
        if (pattern.transform === 'size') {
          element = applySizeTransform(element, i, pattern.step || 1);
        } else if (pattern.transform === 'rotation') {
          element = applyRotationTransform(element, i, pattern.step || 90);
        } else if (pattern.transform === 'numeric') {
          element = applyNumericTransform(
            element,
            i,
            pattern.step || 1,
            pattern.type
          );
        }

        allElements.push({
          ...element,
          id: generateId(),
        });
      }

      // Déterminer la position de l'élément manquant selon la difficulté
      const missingIndex = getMissingIndexPosition(sequenceLength, difficulty);

      // Extraire l'élément manquant (la bonne réponse)
      const correctAnswer = allElements[missingIndex];

      // Créer la liste des éléments visibles (sans l'élément manquant)
      const elements = allElements.filter((_, index) => index !== missingIndex);

      // Générer les distracteurs (3 mauvaises réponses)
      const distractors = generateDistractors(
        themeElements,
        correctAnswer,
        3,
        pattern,
        baseElements
      );

      return {
        id: generateId(),
        elements,
        missingIndex,
        correctAnswer,
        distractors,
        patternDef: pattern,
        theme,
        difficulty,
      };
    },
    [themeElements, theme]
  );

  return { generateSequence };
}
