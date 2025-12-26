/**
 * Module Core - Architecture centralisée
 *
 * Ce module regroupe les fonctionnalités partagées par tous les jeux :
 * - Types communs
 * - Système pédagogique Montessori
 * - Assistant IA bienveillant
 *
 * Usage :
 * ```typescript
 * import { ChildAssistant, getFeedbackMessage, adaptDifficulty } from '@/core';
 * ```
 */

// Types centralisés
export * from './types/core.types';

// Module Pedagogy (Progression Montessori, Feedback, Difficulté)
export * from './pedagogy';

// Module AI (Assistant, Scripts, Contexte)
export * from './ai';
