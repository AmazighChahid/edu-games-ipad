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

// Générer les nombres premiers
function getPrime(n: number): number {
  const primes: number[] = [];
  let candidate = 2;
  while (primes.length <= n) {
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(candidate); i++) {
      if (candidate % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(candidate);
    candidate++;
  }
  return primes[n];
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

    case 'prime':
      // Nombres premiers : 2, 3, 5, 7, 11, 13...
      value = getPrime(index);
      break;

    case 'numeric_square':
      // Carrés parfaits : 1, 4, 9, 16, 25...
      value = Math.pow(index + 1, 2);
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

// Générer des distracteurs intelligents basés sur le pattern
// STRATÉGIE : Les distracteurs doivent utiliser les formes/couleurs du pattern
// pour que l'enfant doive vraiment comprendre la logique, pas juste éliminer
//
// Exemple: Pattern carré-losange orange/bleu
// - Bonne réponse: carré orange
// - Distracteurs: losange orange (autre forme, même couleur du pattern)
//                 carré bleu (même forme, autre couleur du pattern)
//                 losange bleu (autre élément du pattern)
export function generateDistractors(
  allElements: SequenceElement[],
  correctAnswer: SequenceElement,
  count: number,
  pattern: PatternDefinition,
  sequenceBaseElements?: SequenceElement[] // Éléments utilisés dans la séquence
): SequenceElement[] {
  const distractors: SequenceElement[] = [];
  const usedIds = new Set([correctAnswer.id]);
  const usedValues = new Set([correctAnswer.value]);

  const addDistractor = (element: SequenceElement): boolean => {
    if (!usedIds.has(element.id) && !usedValues.has(element.value)) {
      distractors.push({
        ...element,
        id: `distractor_${element.id}_${Date.now()}`,
      });
      usedIds.add(element.id);
      usedValues.add(element.value);
      return true;
    }
    return false;
  };

  // Stratégie différente selon le type de pattern
  if (pattern.transform === 'numeric') {
    // Pour les suites numériques, générer des distracteurs intelligents
    // basés sur le TYPE de suite pour tromper l'enfant
    const correctValue = correctAnswer.value as number;
    const step = pattern.step || 1;
    let possibleDistractors: number[] = [];

    switch (pattern.type) {
      case 'numeric_add':
        // Suite +n : proposer la valeur précédente, valeur +1, +2, etc.
        possibleDistractors = [
          correctValue - step,           // Valeur précédente de la suite
          correctValue + step,           // Valeur suivante (trop loin)
          correctValue - 1,              // Erreur de comptage
          correctValue + 1,              // Erreur de comptage
          correctValue + step - 1,       // Presque la bonne réponse suivante
          correctValue - step + 1,       // Presque la valeur précédente
        ];
        break;

      case 'numeric_mult':
        // Suite ×n : proposer des erreurs de multiplication
        possibleDistractors = [
          correctValue / step,           // Valeur précédente
          correctValue * step,           // Valeur suivante (trop loin)
          correctValue + step,           // Confusion +/×
          correctValue - step,           // Confusion -/÷
          Math.round(correctValue * 1.5), // Valeur proche mais fausse
          correctValue + 1,              // Simple erreur
        ];
        break;

      case 'numeric_square':
        // Carrés parfaits : proposer des non-carrés proches
        const sqrtValue = Math.sqrt(correctValue);
        possibleDistractors = [
          Math.pow(Math.round(sqrtValue) - 1, 2), // Carré précédent
          Math.pow(Math.round(sqrtValue) + 1, 2), // Carré suivant
          correctValue - 1,              // Presque carré
          correctValue + 1,              // Presque carré
          correctValue + 2,              // Non-carré proche
          Math.round(sqrtValue) * 2,     // Confusion avec double
        ];
        break;

      case 'fibonacci':
        // Fibonacci : proposer des erreurs d'addition
        possibleDistractors = [
          correctValue - 1,              // Presque Fibonacci
          correctValue + 1,              // Presque Fibonacci
          correctValue - 2,              // Autre erreur proche
          correctValue + 2,              // Autre erreur proche
          Math.round(correctValue * 1.5), // Erreur de calcul
          Math.round(correctValue * 0.6), // Ratio doré inversé
        ];
        break;

      case 'prime':
        // Nombres premiers : proposer des non-premiers proches
        possibleDistractors = [
          correctValue - 1,              // Probablement pair
          correctValue + 1,              // Probablement pair
          correctValue - 2,              // Proche mais pas premier
          correctValue + 2,              // Proche mais peut-être premier
          correctValue * 2,              // Double (jamais premier sauf 2)
          correctValue + 4,              // Plus loin
        ];
        break;

      default:
        // Fallback générique
        possibleDistractors = [
          correctValue - 1,
          correctValue + 1,
          correctValue - 2,
          correctValue + 2,
          correctValue * 2,
          Math.floor(correctValue / 2),
        ];
    }

    // Filtrer les valeurs valides et uniques
    const validDistractors = possibleDistractors
      .filter(v => v > 0 && v !== correctValue && Number.isInteger(v))
      .filter((v, i, arr) => arr.indexOf(v) === i); // Unique

    const shuffled = validDistractors.sort(() => Math.random() - 0.5);
    for (const value of shuffled.slice(0, count)) {
      distractors.push({
        ...correctAnswer,
        id: `distractor_num_${value}_${Date.now()}`,
        value,
        displayAsset: value.toString(),
        label: value.toString(),
      });
    }
  } else if (correctAnswer.shape && correctAnswer.color && sequenceBaseElements && sequenceBaseElements.length > 0) {
    // NOUVELLE STRATÉGIE pour les formes avec shape/color
    // Utiliser les formes et couleurs présentes dans le pattern comme base pour les distracteurs

    // Extraire les formes et couleurs uniques du pattern
    const patternShapes = new Set(sequenceBaseElements.map(e => e.shape).filter(Boolean));
    const patternColors = new Set(sequenceBaseElements.map(e => e.color).filter(Boolean));

    // Priorité 1: Autres éléments du pattern (pas la bonne réponse)
    // Ce sont les distracteurs les plus difficiles car ils font partie du pattern
    const otherPatternElements = sequenceBaseElements.filter(
      e => e.value !== correctAnswer.value
    );

    // Priorité 2: Éléments avec forme du pattern mais couleur différente
    // Ex: si pattern = carré orange + losange bleu, et réponse = carré orange
    // -> carré bleu (forme du pattern, couleur du pattern, mais mauvaise combinaison)
    const patternShapeOtherColor = allElements.filter(
      e => patternShapes.has(e.shape) &&
           patternColors.has(e.color) &&
           e.value !== correctAnswer.value &&
           !sequenceBaseElements.some(base => base.value === e.value)
    );

    // Priorité 3: Même forme que la réponse, couleur du pattern
    const sameShapePatternColor = allElements.filter(
      e => e.shape === correctAnswer.shape &&
           patternColors.has(e.color) &&
           e.value !== correctAnswer.value
    );

    // Priorité 4: Forme du pattern, même couleur que la réponse
    const patternShapeSameColor = allElements.filter(
      e => patternShapes.has(e.shape) &&
           e.color === correctAnswer.color &&
           e.value !== correctAnswer.value
    );

    // Mélanger chaque catégorie
    const shuffleArray = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    const shuffledOtherPattern = shuffleArray(otherPatternElements);
    const shuffledPatternShapeOtherColor = shuffleArray(patternShapeOtherColor);
    const shuffledSameShapePatternColor = shuffleArray(sameShapePatternColor);
    const shuffledPatternShapeSameColor = shuffleArray(patternShapeSameColor);

    // Ajouter d'abord les autres éléments du pattern (le plus trompeur)
    for (const element of shuffledOtherPattern) {
      if (distractors.length >= count) break;
      addDistractor(element);
    }

    // Puis les combinaisons trompeuses
    for (const element of shuffledPatternShapeOtherColor) {
      if (distractors.length >= count) break;
      addDistractor(element);
    }

    for (const element of shuffledSameShapePatternColor) {
      if (distractors.length >= count) break;
      addDistractor(element);
    }

    for (const element of shuffledPatternShapeSameColor) {
      if (distractors.length >= count) break;
      addDistractor(element);
    }
  } else if (correctAnswer.shape && correctAnswer.color) {
    // Fallback si pas de sequenceBaseElements : ancienne logique
    const sameShapeDifferentColor = allElements.filter(
      e => e.shape === correctAnswer.shape &&
           e.color !== correctAnswer.color &&
           e.value !== correctAnswer.value
    );

    const sameColorDifferentShape = allElements.filter(
      e => e.color === correctAnswer.color &&
           e.shape !== correctAnswer.shape &&
           e.value !== correctAnswer.value
    );

    const shuffledSameShape = [...sameShapeDifferentColor].sort(() => Math.random() - 0.5);
    const shuffledSameColor = [...sameColorDifferentShape].sort(() => Math.random() - 0.5);

    for (const element of shuffledSameShape) {
      if (distractors.length >= count) break;
      addDistractor(element);
    }

    for (const element of shuffledSameColor) {
      if (distractors.length >= count) break;
      addDistractor(element);
    }
  } else {
    // Fallback: pour les patterns visuels sans shape/color (images, etc.)
    const candidates = allElements.filter(
      e => e.id !== correctAnswer.id && e.value !== correctAnswer.value
    );
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);

    for (const element of shuffled) {
      if (distractors.length >= count) break;
      addDistractor(element);
    }
  }

  // S'assurer qu'on a assez de distracteurs (fallback avec tous les éléments)
  if (distractors.length < count) {
    const remainingCandidates = allElements.filter(
      e => !usedValues.has(e.value) && e.value !== correctAnswer.value
    );
    const shuffled = [...remainingCandidates].sort(() => Math.random() - 0.5);

    for (const element of shuffled) {
      if (distractors.length >= count) break;
      addDistractor(element);
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
