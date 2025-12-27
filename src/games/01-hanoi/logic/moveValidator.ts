/**
 * Move validation for Tower of Hanoi
 */

import type { MoveValidation } from '@/types';
import type { HanoiGameState, TowerId } from '../types';
import { getTopDisk } from './hanoiEngine';

export interface MoveAttempt {
  from: TowerId;
  to: TowerId;
}

/**
 * Validates a move attempt
 */
export function validateMove(
  state: HanoiGameState,
  move: MoveAttempt
): MoveValidation {
  const { from, to } = move;

  if (from === to) {
    return { valid: false, reason: 'same_position' };
  }

  const sourceDisk = getTopDisk(state, from);
  if (!sourceDisk) {
    return { valid: false, reason: 'invalid_target' };
  }

  const targetDisk = getTopDisk(state, to);
  if (targetDisk && sourceDisk.size > targetDisk.size) {
    return { valid: false, reason: 'disk_too_large' };
  }

  return { valid: true };
}

/**
 * Gets a human-readable message for an invalid move reason
 */
export function getInvalidMoveMessage(
  reason: MoveValidation['reason'],
  language: 'fr' | 'en' = 'fr'
): string {
  const messages = {
    fr: {
      disk_too_large: 'Ce disque est trop grand pour aller ici !',
      same_position: 'Tu dois choisir une autre tour.',
      invalid_target: 'Il n\'y a pas de disque à déplacer.',
      blocked: 'Ce disque ne peut pas être déplacé.',
      out_of_bounds: 'Cette position n\'est pas valide.',
    },
    en: {
      disk_too_large: 'This disk is too big to go here!',
      same_position: 'You need to choose a different tower.',
      invalid_target: 'There is no disk to move.',
      blocked: 'This disk cannot be moved.',
      out_of_bounds: 'This position is not valid.',
    },
  };

  return reason ? messages[language][reason] || '' : '';
}
