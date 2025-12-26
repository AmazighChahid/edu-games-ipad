import { SequenceElement, PatternDefinition, PatternType } from '../types';

// ============================================
// UTILITAIRES POUR LA MANIPULATION DES PATTERNS
// ============================================

// Sélectionner des éléments de base aléatoires
export function selectBaseElements(
  elements: SequenceElement[],
  count: number
): SequenceElement[] {
  const shuffled = [...elements].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Transformer un élément avec une progression de taille
export function applySizeTransform(
  element: SequenceElement,
  index: number,
  step: number
): SequenceElement {
  const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
  const sizeIndex = Math.min(Math.floor(index * step), sizes.length - 1);

  return {
    ...element,
    size: sizes[sizeIndex],
    id: `${element.id}_size_${sizeIndex}`,
  };
}

// Transformer un élément avec une rotation
export function applyRotationTransform(
  element: SequenceElement,
  index: number,
  step: number
): SequenceElement {
  const rotation = (index * step) % 360;

  return {
    ...element,
    rotation,
    id: `${element.id}_rot_${rotation}`,
  };
}

// Transformer un élément en nombre (pour suites numériques)
export function applyNumericTransform(
  element: SequenceElement,
  index: number,
  step: number,
  patternType: PatternType
): SequenceElement {
  let value: number;

  switch (patternType) {
    case 'numeric_add':
      // Suite arithmétique : +step
      value = (index + 1) * step;
      break;

    case 'numeric_mult':
      // Suite géométrique : ×step
      value = Math.pow(step, index);
      break;

    case 'fibonacci':
      // Suite de Fibonacci
      value = fibonacci(index);
      break;

    default:
      value = index + 1;
  }

  return {
    ...element,
    type: 'number',
    value,
    displayAsset: value.toString(),
    label: value.toString(),
    id: `num_${value}`,
  };
}

// Calculer la suite de Fibonacci
export function fibonacci(n: number): number {
  if (n <= 1) return n === 0 ? 1 : 1;
  let a = 1;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

// Générer des distracteurs intelligents
export function generateDistractors(
  allElements: SequenceElement[],
  correctAnswer: SequenceElement,
  count: number,
  pattern: PatternDefinition
): SequenceElement[] {
  const distractors: SequenceElement[] = [];
  const usedIds = new Set([correctAnswer.id]);

  // Stratégie différente selon le type de pattern
  if (pattern.transform === 'numeric') {
    // Pour les suites numériques, générer des nombres proches
    const correctValue = correctAnswer.value as number;
    const possibleDistractors = [
      correctValue - 1,
      correctValue + 1,
      correctValue - 2,
      correctValue + 2,
      correctValue * 2,
      Math.floor(correctValue / 2),
    ].filter(v => v > 0 && v !== correctValue);

    // Mélanger et prendre les premiers
    const shuffled = possibleDistractors.sort(() => Math.random() - 0.5);
    for (const value of shuffled.slice(0, count)) {
      distractors.push({
        ...correctAnswer,
        id: `distractor_num_${value}`,
        value,
        displayAsset: value.toString(),
        label: value.toString(),
      });
    }
  } else {
    // Pour les patterns visuels, prendre d'autres éléments du thème
    const candidates = allElements.filter(e => e.id !== correctAnswer.id);
    const shuffled = candidates.sort(() => Math.random() - 0.5);

    for (const element of shuffled.slice(0, count)) {
      if (!usedIds.has(element.id)) {
        distractors.push({
          ...element,
          id: `distractor_${element.id}`,
        });
        usedIds.add(element.id);
      }
    }
  }

  // S'assurer qu'on a assez de distracteurs
  while (distractors.length < count && allElements.length > 0) {
    const randomElement = allElements[Math.floor(Math.random() * allElements.length)];
    if (!usedIds.has(randomElement.id)) {
      distractors.push({
        ...randomElement,
        id: `distractor_fallback_${randomElement.id}`,
      });
      usedIds.add(randomElement.id);
    }
  }

  return distractors.slice(0, count);
}

// Mélanger un tableau (Fisher-Yates shuffle)
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Générer un ID unique
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
