import { useCallback, useMemo } from 'react';
import {
  Sequence,
  SequenceElement,
  ThemeType,
  PatternDefinition,
} from '../types';
import { THEMES } from '../data/themes';
import { getRandomPattern, getSequenceLength } from '../data/patterns';
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

export function useSequenceGenerator(theme: ThemeType) {
  // Éléments du thème
  const themeElements = useMemo(() => {
    return THEMES[theme].elements;
  }, [theme]);

  // Générer une séquence complète
  const generateSequence = useCallback(
    (difficulty: number): Sequence => {
      const pattern = getRandomPattern(difficulty);
      const sequenceLength = getSequenceLength(difficulty);

      // Sélectionner les éléments de base pour ce pattern
      const baseElements = selectBaseElements(
        themeElements,
        pattern.cycle.length
      );

      // Construire la séquence selon le pattern
      const elements: SequenceElement[] = [];

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

        elements.push({
          ...element,
          id: generateId(),
        });
      }

      // L'élément manquant est le dernier
      const correctAnswer = elements.pop()!;
      const missingIndex = elements.length;

      // Générer les distracteurs (3 mauvaises réponses)
      const distractors = generateDistractors(
        themeElements,
        correctAnswer,
        3,
        pattern
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
