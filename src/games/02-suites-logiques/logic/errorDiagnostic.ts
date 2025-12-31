/**
 * Error Diagnostic - Diagnostic pedagogique des erreurs
 *
 * Analyse les erreurs pour fournir des hints cibles.
 */

import { SequenceElement } from '../types';
import { SequencePuzzle, ErrorType } from './types';

// ============================================
// DIAGNOSTIC PRINCIPAL
// ============================================

/**
 * Diagnostiquer le type d'erreur commise
 */
export function diagnoseError(
  puzzle: SequencePuzzle,
  chosen: SequenceElement,
  correct: SequenceElement
): ErrorType {
  // Si c'est correct, pas d'erreur
  if (chosen.id === correct.id || chosen.value === correct.value) {
    return 'unknown';
  }

  // Diagnostic selon le type de pattern
  if (puzzle.pattern.transform === 'numeric') {
    return diagnoseNumericError(puzzle, chosen, correct);
  }

  if (puzzle.pattern.transform === 'size') {
    return diagnoseSizeError(chosen, correct);
  }

  if (puzzle.pattern.transform === 'rotation') {
    return diagnoseRotationError(puzzle, chosen, correct);
  }

  // Patterns visuels (alternation, mirror, nested)
  return diagnoseVisualError(puzzle, chosen, correct);
}

// ============================================
// DIAGNOSTIC NUMERIQUE
// ============================================

/**
 * Diagnostiquer une erreur sur un pattern numerique
 */
function diagnoseNumericError(
  puzzle: SequencePuzzle,
  chosen: SequenceElement,
  correct: SequenceElement
): ErrorType {
  const chosenValue = chosen.value as number;
  const correctValue = correct.value as number;
  const diff = chosenValue - correctValue;
  const step = puzzle.pattern.step || 1;

  // Off by one : +/- 1 de la bonne reponse
  if (Math.abs(diff) === 1) {
    return 'off_by_one';
  }

  // A choisi l'element precedent de la suite
  if (diff === -step && puzzle.pattern.type === 'numeric_add') {
    return 'used_previous';
  }

  // A saute un element (choisi le suivant du suivant)
  if (diff === step && puzzle.pattern.type === 'numeric_add') {
    return 'used_next_next';
  }

  // Pour les multiplications
  if (puzzle.pattern.type === 'numeric_mult') {
    // A divise au lieu de multiplier
    if (chosenValue === correctValue / step) {
      return 'used_previous';
    }
    // A multiplie une fois de trop
    if (chosenValue === correctValue * step) {
      return 'used_next_next';
    }
    // Confusion addition/multiplication
    // Ex: suite x2, a fait +2 a la place
    const lastElement = puzzle.sequence[puzzle.sequence.length - 1];
    const lastValue = lastElement.value as number;
    if (chosenValue === lastValue + step) {
      return 'confusion_add_mult';
    }
  }

  // Pour les suites additives, verifier confusion avec multiplication
  if (puzzle.pattern.type === 'numeric_add') {
    const lastElement = puzzle.sequence[puzzle.sequence.length - 1];
    const lastValue = lastElement.value as number;
    // A multiplie au lieu d'additionner
    if (chosenValue === lastValue * 2 || chosenValue === lastValue * step) {
      return 'confusion_add_mult';
    }
  }

  // Pour les carres parfaits
  if (puzzle.pattern.type === 'numeric_square') {
    // Verifier si c'est un carre adjacent
    const correctRoot = Math.sqrt(correctValue);
    const chosenRoot = Math.sqrt(chosenValue);
    if (Number.isInteger(chosenRoot)) {
      if (Math.abs(chosenRoot - correctRoot) === 1) {
        return 'wrong_step'; // Carre precedent ou suivant
      }
    }
    // Pas un carre parfait
    return 'wrong_step';
  }

  // Pour Fibonacci
  if (puzzle.pattern.type === 'fibonacci') {
    // Verifier si proche (erreur d'addition)
    if (Math.abs(diff) <= 2) {
      return 'off_by_one';
    }
    return 'wrong_step';
  }

  // Pour les nombres premiers
  if (puzzle.pattern.type === 'prime') {
    // Verifier si c'est un nombre pair (erreur classique)
    if (chosenValue > 2 && chosenValue % 2 === 0) {
      return 'wrong_step'; // A choisi un non-premier
    }
    return 'wrong_step';
  }

  // Erreur de pas generique
  return 'wrong_step';
}

// ============================================
// DIAGNOSTIC TAILLE
// ============================================

/**
 * Diagnostiquer une erreur sur un pattern de taille
 */
function diagnoseSizeError(
  chosen: SequenceElement,
  correct: SequenceElement
): ErrorType {
  // Meme element mais mauvaise taille
  if (chosen.value === correct.value && chosen.size !== correct.size) {
    return 'wrong_size';
  }

  // Mauvais element
  if (chosen.shape && correct.shape) {
    if (chosen.shape !== correct.shape) {
      return 'wrong_shape';
    }
    if (chosen.color !== correct.color) {
      return 'wrong_color';
    }
  }

  return 'wrong_size';
}

// ============================================
// DIAGNOSTIC ROTATION
// ============================================

/**
 * Diagnostiquer une erreur sur un pattern de rotation
 */
function diagnoseRotationError(
  puzzle: SequencePuzzle,
  chosen: SequenceElement,
  correct: SequenceElement
): ErrorType {
  // Meme element mais mauvaise rotation
  if (chosen.value === correct.value) {
    const rotationDiff = Math.abs((chosen.rotation || 0) - (correct.rotation || 0));
    const step = puzzle.pattern.step || 90;

    // Erreur d'un pas de rotation
    if (rotationDiff === step || rotationDiff === 360 - step) {
      return 'wrong_rotation';
    }

    return 'wrong_rotation';
  }

  // Mauvais element entierement
  if (chosen.shape && correct.shape && chosen.shape !== correct.shape) {
    return 'wrong_shape';
  }

  return 'wrong_rotation';
}

// ============================================
// DIAGNOSTIC VISUEL
// ============================================

/**
 * Diagnostiquer une erreur sur un pattern visuel
 */
function diagnoseVisualError(
  puzzle: SequencePuzzle,
  chosen: SequenceElement,
  correct: SequenceElement
): ErrorType {
  // Patterns miroir
  if (isMirrorPattern(puzzle.pattern.type)) {
    // Verifier si c'est une confusion de symetrie
    const chosenInSequence = puzzle.sequence.some(e => e.value === chosen.value);
    if (chosenInSequence) {
      return 'mirror_confusion';
    }
  }

  // Patterns avec forme et couleur
  if (chosen.shape && correct.shape) {
    // Bonne forme, mauvaise couleur
    if (chosen.shape === correct.shape && chosen.color !== correct.color) {
      return 'wrong_color';
    }

    // Bonne couleur, mauvaise forme
    if (chosen.color === correct.color && chosen.shape !== correct.shape) {
      return 'wrong_shape';
    }
  }

  // Verifier si l'element choisi fait partie de la sequence (decalage de cycle)
  const chosenInSequence = puzzle.sequence.some(e => e.value === chosen.value);
  if (chosenInSequence) {
    return 'cycle_shift';
  }

  // Aucun pattern detecte
  return 'random_guess';
}

// ============================================
// HELPERS
// ============================================

/**
 * Verifier si c'est un pattern miroir
 */
function isMirrorPattern(patternType: string): boolean {
  return ['mirror', 'ABCBA', 'ABCDCBA'].includes(patternType);
}

/**
 * Calculer la "distance" entre deux elements
 * Utile pour evaluer la qualite des distracteurs
 */
export function calculateElementDistance(
  a: SequenceElement,
  b: SequenceElement,
  patternType: string
): number {
  let distance = 0;

  // Distance numerique
  if (typeof a.value === 'number' && typeof b.value === 'number') {
    const numericDist = Math.abs(a.value - b.value);
    // Normaliser: petite difference = petite distance
    distance += Math.min(numericDist, 10);
  }

  // Distance de forme
  if (a.shape && b.shape) {
    distance += a.shape === b.shape ? 0 : 3;
  }

  // Distance de couleur
  if (a.color && b.color) {
    distance += a.color === b.color ? 0 : 2;
  }

  // Distance de taille
  if (a.size && b.size) {
    const sizes = ['small', 'medium', 'large'];
    const aIdx = sizes.indexOf(a.size);
    const bIdx = sizes.indexOf(b.size);
    distance += Math.abs(aIdx - bIdx);
  }

  // Distance de rotation
  if (a.rotation !== undefined && b.rotation !== undefined) {
    const rotDist = Math.abs(a.rotation - b.rotation);
    distance += Math.min(rotDist, 360 - rotDist) / 45; // Normaliser par step de 45
  }

  return distance;
}

/**
 * Obtenir une description humaine de l'erreur
 */
export function getErrorDescription(errorType: ErrorType): string {
  const descriptions: Record<ErrorType, string> = {
    off_by_one: "Presque ! Tu t'es trompe d'un tout petit peu.",
    wrong_step: "Le pas de la suite n'est pas le bon.",
    used_previous: "Tu as choisi l'element d'avant dans la suite.",
    used_next_next: "Tu as saute un element !",
    confusion_add_mult: "Attention, est-ce qu'on ajoute ou qu'on multiplie ?",
    wrong_operation: "Ce n'est pas la bonne operation.",
    wrong_color: "La forme est bonne, mais pas la couleur !",
    wrong_shape: "La couleur est bonne, mais pas la forme !",
    wrong_size: "C'est le bon element, mais pas la bonne taille.",
    wrong_rotation: "C'est le bon element, mais pas la bonne rotation.",
    mirror_confusion: "Attention a la symetrie du motif miroir !",
    cycle_shift: "Tu t'es decale dans le cycle du motif.",
    random_guess: "Essaie de trouver la regle qui se repete.",
    unknown: "Continue a chercher !",
  };

  return descriptions[errorType] || descriptions.unknown;
}

/**
 * Obtenir la dimension concernee par l'erreur
 */
export function getErrorDimension(
  errorType: ErrorType
): 'number' | 'color' | 'shape' | 'size' | 'rotation' | 'pattern' | null {
  switch (errorType) {
    case 'off_by_one':
    case 'wrong_step':
    case 'used_previous':
    case 'used_next_next':
    case 'confusion_add_mult':
    case 'wrong_operation':
      return 'number';

    case 'wrong_color':
      return 'color';

    case 'wrong_shape':
      return 'shape';

    case 'wrong_size':
      return 'size';

    case 'wrong_rotation':
      return 'rotation';

    case 'mirror_confusion':
    case 'cycle_shift':
      return 'pattern';

    default:
      return null;
  }
}
