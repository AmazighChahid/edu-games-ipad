/**
 * Définitions des éléments de machine
 * ====================================
 * Tous les éléments disponibles dans La Fabrique de Réactions
 */

import type { ElementDefinition, ElementCategory } from '../types';

// ============================================
// ÉLÉMENTS DE MACHINE
// ============================================

export const ELEMENTS: ElementDefinition[] = [
  // ========== SOURCES ==========
  {
    id: 'hamster_wheel',
    name: 'Roue de Gédéon',
    emoji: '🐹',
    category: 'source',
    description: 'Gédéon court et fait tourner la roue !',
    acceptsEnergy: [],
    producesEnergy: ['rotation'],
    connectionPoints: [
      { id: 'out', position: 'right', type: 'output', acceptedEnergy: ['rotation'] },
    ],
    activationDelay: 500,
    animationDuration: 2000,
    unlockedAtLevel: 1,
    size: { width: 90, height: 90 },
    zIndex: 10,
  },
  {
    id: 'spring',
    name: 'Ressort',
    emoji: '🌀',
    category: 'source',
    description: 'Se détend et pousse !',
    acceptsEnergy: [],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'out', position: 'top', type: 'output', acceptedEnergy: ['linear'] },
    ],
    activationDelay: 200,
    animationDuration: 400,
    unlockedAtLevel: 4,
    size: { width: 60, height: 80 },
    zIndex: 10,
  },

  // ========== TRANSMISSIONS ==========
  {
    id: 'gear',
    name: 'Engrenage',
    emoji: '⚙️',
    category: 'transmission',
    description: 'Transmet la rotation à un autre engrenage',
    acceptsEnergy: ['rotation'],
    producesEnergy: ['rotation'],
    connectionPoints: [
      { id: 'in', position: 'left', type: 'input', acceptedEnergy: ['rotation'] },
      { id: 'out', position: 'right', type: 'output', acceptedEnergy: ['rotation'] },
    ],
    activationDelay: 100,
    animationDuration: 1000,
    unlockedAtLevel: 2,
    size: { width: 70, height: 70 },
    zIndex: 5,
  },
  {
    id: 'ramp',
    name: 'Rampe',
    emoji: '📐',
    category: 'transmission',
    description: 'Fait rouler les objets vers le bas',
    acceptsEnergy: ['impact', 'linear'],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'in', position: 'top', type: 'input', acceptedEnergy: ['impact', 'linear'] },
      { id: 'out', position: 'bottom', type: 'output', acceptedEnergy: ['linear'] },
    ],
    activationDelay: 50,
    animationDuration: 800,
    unlockedAtLevel: 3,
    size: { width: 100, height: 60 },
    zIndex: 2,
  },
  {
    id: 'dominos',
    name: 'Dominos',
    emoji: '🀱',
    category: 'transmission',
    description: 'Cascade d\'impacts en série',
    acceptsEnergy: ['impact', 'linear'],
    producesEnergy: ['impact'],
    connectionPoints: [
      { id: 'in', position: 'left', type: 'input', acceptedEnergy: ['impact', 'linear'] },
      { id: 'out', position: 'right', type: 'output', acceptedEnergy: ['impact'] },
    ],
    activationDelay: 100,
    animationDuration: 1200,
    unlockedAtLevel: 1,
    size: { width: 100, height: 50 },
    zIndex: 5,
  },
  {
    id: 'lever',
    name: 'Levier',
    emoji: '🔧',
    category: 'transmission',
    description: 'Bascule quand on appuie dessus',
    acceptsEnergy: ['impact', 'linear'],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'in', position: 'left', type: 'input', acceptedEnergy: ['impact', 'linear'] },
      { id: 'out', position: 'right', type: 'output', acceptedEnergy: ['linear'] },
    ],
    activationDelay: 200,
    animationDuration: 600,
    unlockedAtLevel: 5,
    size: { width: 90, height: 50 },
    zIndex: 5,
  },
  {
    id: 'pulley',
    name: 'Poulie',
    emoji: '🪝',
    category: 'transmission',
    description: 'Change la direction de la force',
    acceptsEnergy: ['linear'],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['linear'] },
      { id: 'out', position: 'top', type: 'output', acceptedEnergy: ['linear'] },
    ],
    activationDelay: 150,
    animationDuration: 700,
    unlockedAtLevel: 7,
    size: { width: 60, height: 80 },
    zIndex: 5,
  },
  {
    id: 'trampoline',
    name: 'Trampoline',
    emoji: '🎪',
    category: 'transmission',
    description: 'Fait rebondir vers le haut',
    acceptsEnergy: ['impact'],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'in', position: 'top', type: 'input', acceptedEnergy: ['impact'] },
      { id: 'out', position: 'top', type: 'output', acceptedEnergy: ['linear'] },
    ],
    activationDelay: 50,
    animationDuration: 500,
    unlockedAtLevel: 8,
    size: { width: 80, height: 40 },
    zIndex: 2,
  },

  // ========== OBJETS MOBILES ==========
  {
    id: 'ball',
    name: 'Balle',
    emoji: '⚽',
    category: 'mobile',
    description: 'Roule et rebondit',
    acceptsEnergy: ['linear', 'impact'],
    producesEnergy: ['impact'],
    connectionPoints: [
      { id: 'in', position: 'center', type: 'input', acceptedEnergy: ['linear', 'impact'] },
      { id: 'out', position: 'center', type: 'output', acceptedEnergy: ['impact'] },
    ],
    activationDelay: 0,
    animationDuration: 800,
    unlockedAtLevel: 1,
    size: { width: 50, height: 50 },
    zIndex: 8,
  },
  {
    id: 'marble',
    name: 'Bille',
    emoji: '🔵',
    category: 'mobile',
    description: 'Petite bille qui roule vite',
    acceptsEnergy: ['linear'],
    producesEnergy: ['impact'],
    connectionPoints: [
      { id: 'in', position: 'center', type: 'input', acceptedEnergy: ['linear'] },
      { id: 'out', position: 'center', type: 'output', acceptedEnergy: ['impact'] },
    ],
    activationDelay: 0,
    animationDuration: 600,
    unlockedAtLevel: 3,
    size: { width: 30, height: 30 },
    zIndex: 8,
  },

  // ========== DÉCLENCHEURS ==========
  {
    id: 'button',
    name: 'Bouton',
    emoji: '🔘',
    category: 'trigger',
    description: 'Appuyer pour activer',
    acceptsEnergy: ['impact', 'linear'],
    producesEnergy: ['electric'],
    connectionPoints: [
      { id: 'in', position: 'top', type: 'input', acceptedEnergy: ['impact', 'linear'] },
      { id: 'out', position: 'bottom', type: 'output', acceptedEnergy: ['electric'] },
    ],
    activationDelay: 100,
    animationDuration: 300,
    unlockedAtLevel: 6,
    size: { width: 50, height: 40 },
    zIndex: 5,
  },
  {
    id: 'target',
    name: 'Cible',
    emoji: '🎯',
    category: 'trigger',
    description: 'Se déclenche quand touchée',
    acceptsEnergy: ['impact'],
    producesEnergy: ['electric'],
    connectionPoints: [
      { id: 'in', position: 'center', type: 'input', acceptedEnergy: ['impact'] },
      { id: 'out', position: 'bottom', type: 'output', acceptedEnergy: ['electric'] },
    ],
    activationDelay: 50,
    animationDuration: 400,
    unlockedAtLevel: 9,
    size: { width: 60, height: 60 },
    zIndex: 5,
  },

  // ========== EFFETS FINAUX ==========
  {
    id: 'light',
    name: 'Lumière',
    emoji: '💡',
    category: 'effect',
    description: "S'allume quand activée !",
    acceptsEnergy: ['electric', 'rotation'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['electric', 'rotation'] },
    ],
    activationDelay: 50,
    animationDuration: 1000,
    unlockedAtLevel: 1,
    size: { width: 50, height: 70 },
    zIndex: 10,
  },
  {
    id: 'bell',
    name: 'Cloche',
    emoji: '🔔',
    category: 'effect',
    description: 'Ding dong !',
    acceptsEnergy: ['impact'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'center', type: 'input', acceptedEnergy: ['impact'] },
    ],
    activationDelay: 0,
    animationDuration: 1500,
    unlockedAtLevel: 1,
    size: { width: 60, height: 70 },
    zIndex: 10,
  },
  {
    id: 'confetti',
    name: 'Confettis',
    emoji: '🎉',
    category: 'effect',
    description: 'Explosion festive !',
    acceptsEnergy: ['electric', 'impact'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['electric', 'impact'] },
    ],
    activationDelay: 100,
    animationDuration: 2000,
    unlockedAtLevel: 10,
    size: { width: 70, height: 70 },
    zIndex: 10,
  },
  {
    id: 'fan',
    name: 'Ventilateur',
    emoji: '🌬️',
    category: 'effect',
    description: 'Souffle du vent !',
    acceptsEnergy: ['electric', 'rotation'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['electric', 'rotation'] },
    ],
    activationDelay: 300,
    animationDuration: 2000,
    unlockedAtLevel: 4,
    size: { width: 60, height: 60 },
    zIndex: 10,
  },
  {
    id: 'flag',
    name: 'Drapeau',
    emoji: '🚩',
    category: 'effect',
    description: 'Se lève fièrement !',
    acceptsEnergy: ['linear'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['linear'] },
    ],
    activationDelay: 200,
    animationDuration: 1000,
    unlockedAtLevel: 5,
    size: { width: 40, height: 80 },
    zIndex: 10,
  },
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Récupère la définition d'un élément par son ID
 */
export function getElementDefinition(id: string): ElementDefinition | undefined {
  return ELEMENTS.find((e) => e.id === id);
}

/**
 * Récupère les éléments par catégorie
 */
export function getElementsByCategory(category: ElementCategory): ElementDefinition[] {
  return ELEMENTS.filter((e) => e.category === category);
}

/**
 * Récupère les éléments débloqués pour un niveau donné
 */
export function getUnlockedElements(levelNumber: number): ElementDefinition[] {
  return ELEMENTS.filter((e) => e.unlockedAtLevel <= levelNumber);
}

/**
 * Vérifie si deux types d'énergie sont compatibles
 */
export function areEnergiesCompatible(
  producedEnergy: string[],
  acceptedEnergy: string[]
): boolean {
  return producedEnergy.some((energy) => acceptedEnergy.includes(energy));
}

export default ELEMENTS;
