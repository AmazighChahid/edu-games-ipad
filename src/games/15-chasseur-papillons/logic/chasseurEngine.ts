/**
 * Chasseur de Papillons Engine
 * Logique pure du jeu d'attention sélective
 *
 * Fonctions de génération de papillons, validation des captures,
 * gestion des règles et calcul des scores.
 * Ces fonctions sont pures (pas d'effets de bord) et testables unitairement.
 */

import type {
  Butterfly,
  ButterflyColor,
  ButterflyPattern,
  ButterflySize,
  ButterflyWingShape,
  GameRule,
  RuleType,
  ChasseurLevel,
  ChasseurCompletion,
} from '../types';

// ============================================
// TYPES
// ============================================

export interface CatchResult {
  valid: boolean;
  isTarget: boolean;
  points: number;
  streakBonus: number;
  message?: string;
}

export interface WaveConfig {
  totalButterflies: number;
  targetCount: number;
  distractorCount: number;
  spawnInterval: number;
}

// ============================================
// CONSTANTES
// ============================================

export const POINTS = {
  CORRECT_CATCH: 100,
  WRONG_CATCH: -50,
  MISSED_TARGET: -25,
  STREAK_BONUS: 10, // Par papillon dans la série
};

export const SPAWN_AREA = {
  MIN_X: 5,
  MAX_X: 95,
  MIN_Y: 10,
  MAX_Y: 90,
};

export const VELOCITY = {
  MIN: 0.3,
  MAX: 1.0,
};

// ============================================
// GÉNÉRATION DE PAPILLONS
// ============================================

/**
 * Génère un ID unique pour un papillon
 */
export function generateButterflyId(): string {
  return `butterfly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Génère une position aléatoire pour un papillon
 */
export function generateRandomPosition(): { x: number; y: number } {
  return {
    x: SPAWN_AREA.MIN_X + Math.random() * (SPAWN_AREA.MAX_X - SPAWN_AREA.MIN_X),
    y: SPAWN_AREA.MIN_Y + Math.random() * (SPAWN_AREA.MAX_Y - SPAWN_AREA.MIN_Y),
  };
}

/**
 * Génère une vélocité aléatoire
 */
export function generateRandomVelocity(speed: number = 1): { velocityX: number; velocityY: number } {
  const angle = Math.random() * Math.PI * 2;
  const magnitude = (VELOCITY.MIN + Math.random() * (VELOCITY.MAX - VELOCITY.MIN)) * speed;

  return {
    velocityX: Math.cos(angle) * magnitude,
    velocityY: Math.sin(angle) * magnitude,
  };
}

/**
 * Sélectionne un élément aléatoire d'un tableau
 */
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Génère un papillon avec des attributs aléatoires
 */
export function generateButterfly(
  availableColors: ButterflyColor[],
  availablePatterns: ButterflyPattern[],
  availableSizes: ButterflySize[],
  speed: number = 1,
  spawnTime: number = 0
): Butterfly {
  const position = generateRandomPosition();
  const velocity = generateRandomVelocity(speed);
  const wingShapes: ButterflyWingShape[] = ['round', 'pointed', 'wavy'];

  return {
    id: generateButterflyId(),
    color: randomElement(availableColors),
    pattern: randomElement(availablePatterns),
    size: randomElement(availableSizes),
    wingShape: randomElement(wingShapes),
    x: position.x,
    y: position.y,
    velocityX: velocity.velocityX,
    velocityY: velocity.velocityY,
    rotation: Math.random() * 360,
    isTarget: false, // Sera défini par matchesRule
    isCaught: false,
    spawnTime,
  };
}

/**
 * Génère un papillon qui correspond à la règle (cible)
 */
export function generateTargetButterfly(
  rule: GameRule,
  availableColors: ButterflyColor[],
  availablePatterns: ButterflyPattern[],
  availableSizes: ButterflySize[],
  speed: number = 1,
  spawnTime: number = 0
): Butterfly {
  const butterfly = generateButterfly(availableColors, availablePatterns, availableSizes, speed, spawnTime);

  // Forcer les attributs pour correspondre à la règle
  switch (rule.type) {
    case 'color':
      butterfly.color = rule.values[0] as ButterflyColor;
      break;
    case 'pattern':
      butterfly.pattern = rule.values[0] as ButterflyPattern;
      break;
    case 'size':
      butterfly.size = rule.values[0] as ButterflySize;
      break;
    case 'color_and_size':
      butterfly.color = rule.values[0] as ButterflyColor;
      butterfly.size = rule.values[1] as ButterflySize;
      break;
    case 'two_colors':
      butterfly.color = randomElement(rule.values as ButterflyColor[]);
      break;
    case 'color_or_pattern':
      // Choisir aléatoirement couleur ou motif
      if (Math.random() < 0.5) {
        butterfly.color = rule.values[0] as ButterflyColor;
      } else {
        butterfly.pattern = rule.values[1] as ButterflyPattern;
      }
      break;
    case 'size_and_pattern':
      butterfly.size = rule.values[0] as ButterflySize;
      butterfly.pattern = rule.values[1] as ButterflyPattern;
      break;
  }

  butterfly.isTarget = true;
  return butterfly;
}

/**
 * Génère un papillon distracteur (ne correspond pas à la règle)
 */
export function generateDistractorButterfly(
  rule: GameRule,
  availableColors: ButterflyColor[],
  availablePatterns: ButterflyPattern[],
  availableSizes: ButterflySize[],
  speed: number = 1,
  spawnTime: number = 0
): Butterfly {
  let butterfly: Butterfly;
  let attempts = 0;
  const maxAttempts = 20;

  // Générer jusqu'à obtenir un non-target
  do {
    butterfly = generateButterfly(availableColors, availablePatterns, availableSizes, speed, spawnTime);
    attempts++;
  } while (matchesRule(butterfly, rule) && attempts < maxAttempts);

  // Si après plusieurs tentatives on n'a pas trouvé, forcer un attribut différent
  if (matchesRule(butterfly, rule)) {
    switch (rule.type) {
      case 'color':
      case 'two_colors':
        const otherColors = availableColors.filter((c) => !rule.values.includes(c));
        if (otherColors.length > 0) {
          butterfly.color = randomElement(otherColors);
        }
        break;
      case 'not_color':
        // Pour not_color, le distracteur DOIT être de la couleur interdite
        butterfly.color = rule.values[0] as ButterflyColor;
        break;
      case 'pattern':
        const otherPatterns = availablePatterns.filter((p) => p !== rule.values[0]);
        if (otherPatterns.length > 0) {
          butterfly.pattern = randomElement(otherPatterns);
        }
        break;
      case 'size':
      case 'not_size':
        const otherSizes = availableSizes.filter((s) => s !== rule.values[0]);
        if (otherSizes.length > 0) {
          butterfly.size = randomElement(otherSizes);
        }
        break;
    }
  }

  butterfly.isTarget = false;
  return butterfly;
}

// ============================================
// VALIDATION DES RÈGLES
// ============================================

/**
 * Vérifie si un papillon correspond à une règle
 */
export function matchesRule(butterfly: Butterfly, rule: GameRule): boolean {
  switch (rule.type) {
    case 'color':
      return butterfly.color === rule.values[0];

    case 'pattern':
      return butterfly.pattern === rule.values[0];

    case 'size':
      return butterfly.size === rule.values[0];

    case 'color_and_size':
      return butterfly.color === rule.values[0] && butterfly.size === rule.values[1];

    case 'not_color':
      return butterfly.color !== rule.values[0];

    case 'two_colors':
      return rule.values.includes(butterfly.color);

    case 'color_or_pattern':
      return butterfly.color === rule.values[0] || butterfly.pattern === rule.values[1];

    case 'size_and_pattern':
      return butterfly.size === rule.values[0] && butterfly.pattern === rule.values[1];

    case 'not_size':
      return butterfly.size !== rule.values[0];

    case 'complex':
      // Pour les règles complexes, toutes les valeurs doivent correspondre
      return rule.values.every((value) => {
        if (['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'pink'].includes(value)) {
          return butterfly.color === value;
        }
        if (['solid', 'striped', 'spotted', 'gradient', 'hearts', 'stars'].includes(value)) {
          return butterfly.pattern === value;
        }
        if (['small', 'medium', 'large'].includes(value)) {
          return butterfly.size === value;
        }
        return true;
      });

    default:
      return false;
  }
}

// ============================================
// GESTION DES CAPTURES
// ============================================

/**
 * Évalue une tentative de capture
 */
export function evaluateCatch(
  butterfly: Butterfly,
  rule: GameRule,
  currentStreak: number
): CatchResult {
  const isTarget = matchesRule(butterfly, rule);

  if (isTarget) {
    const streakBonus = currentStreak * POINTS.STREAK_BONUS;
    return {
      valid: true,
      isTarget: true,
      points: POINTS.CORRECT_CATCH + streakBonus,
      streakBonus,
      message: currentStreak >= 3 ? `Combo x${currentStreak + 1} !` : 'Bravo !',
    };
  } else {
    return {
      valid: true,
      isTarget: false,
      points: POINTS.WRONG_CATCH,
      streakBonus: 0,
      message: 'Oups ! Ce papillon ne correspond pas.',
    };
  }
}

/**
 * Pénalité pour un papillon cible manqué
 */
export function calculateMissPenalty(): number {
  return POINTS.MISSED_TARGET;
}

// ============================================
// GESTION DES VAGUES
// ============================================

/**
 * Configure une vague de papillons
 */
export function configureWave(
  level: ChasseurLevel,
  waveNumber: number
): WaveConfig {
  const totalButterflies = level.butterfliesPerWave;
  const targetRatio = 1 - level.distractorRatio;

  // Augmenter légèrement la difficulté avec les vagues
  const waveMultiplier = 1 + (waveNumber - 1) * 0.1;

  const targetCount = Math.round(totalButterflies * targetRatio);
  const distractorCount = totalButterflies - targetCount;

  // Intervalle de spawn (ms)
  const spawnInterval = (level.waveDuration * 1000) / totalButterflies;

  return {
    totalButterflies,
    targetCount,
    distractorCount,
    spawnInterval: Math.max(500, spawnInterval / waveMultiplier),
  };
}

/**
 * Génère les papillons pour une vague
 */
export function generateWaveButterflies(
  level: ChasseurLevel,
  rule: GameRule,
  waveConfig: WaveConfig
): Butterfly[] {
  const butterflies: Butterfly[] = [];

  // Générer les cibles
  for (let i = 0; i < waveConfig.targetCount; i++) {
    const spawnTime = i * waveConfig.spawnInterval;
    butterflies.push(
      generateTargetButterfly(
        rule,
        level.availableColors,
        level.availablePatterns,
        level.availableSizes,
        level.butterflySpeed,
        spawnTime
      )
    );
  }

  // Générer les distracteurs
  for (let i = 0; i < waveConfig.distractorCount; i++) {
    const spawnTime = i * waveConfig.spawnInterval;
    butterflies.push(
      generateDistractorButterfly(
        rule,
        level.availableColors,
        level.availablePatterns,
        level.availableSizes,
        level.butterflySpeed,
        spawnTime
      )
    );
  }

  // Mélanger l'ordre des papillons
  return shuffleArray(butterflies);
}

/**
 * Mélange un tableau (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Sélectionne une règle aléatoire pour une vague
 */
export function selectRuleForWave(
  level: ChasseurLevel,
  previousRules: GameRule[]
): GameRule {
  // Éviter de répéter la même règle deux fois de suite
  const lastRule = previousRules[previousRules.length - 1];
  const availableRules = level.rules.filter((r) => r.id !== lastRule?.id);

  if (availableRules.length === 0) {
    return randomElement(level.rules);
  }

  return randomElement(availableRules);
}

// ============================================
// MOUVEMENT DES PAPILLONS
// ============================================

/**
 * Met à jour la position d'un papillon
 */
export function updateButterflyPosition(
  butterfly: Butterfly,
  deltaTime: number
): Butterfly {
  let newX = butterfly.x + butterfly.velocityX * deltaTime;
  let newY = butterfly.y + butterfly.velocityY * deltaTime;
  let newVelocityX = butterfly.velocityX;
  let newVelocityY = butterfly.velocityY;

  // Rebondir sur les bords
  if (newX < SPAWN_AREA.MIN_X || newX > SPAWN_AREA.MAX_X) {
    newVelocityX = -newVelocityX;
    newX = Math.max(SPAWN_AREA.MIN_X, Math.min(SPAWN_AREA.MAX_X, newX));
  }
  if (newY < SPAWN_AREA.MIN_Y || newY > SPAWN_AREA.MAX_Y) {
    newVelocityY = -newVelocityY;
    newY = Math.max(SPAWN_AREA.MIN_Y, Math.min(SPAWN_AREA.MAX_Y, newY));
  }

  // Légère variation de rotation pour un effet naturel
  const newRotation = (butterfly.rotation + deltaTime * 30) % 360;

  return {
    ...butterfly,
    x: newX,
    y: newY,
    velocityX: newVelocityX,
    velocityY: newVelocityY,
    rotation: newRotation,
  };
}

/**
 * Vérifie si un point touche un papillon
 */
export function isTouchingButterfly(
  touchX: number,
  touchY: number,
  butterfly: Butterfly,
  hitboxSize: number = 10
): boolean {
  const dx = touchX - butterfly.x;
  const dy = touchY - butterfly.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Zone de toucher plus grande pour les petits papillons
  const sizeMultiplier = butterfly.size === 'small' ? 1.5 : butterfly.size === 'large' ? 0.8 : 1;

  return distance <= hitboxSize * sizeMultiplier;
}

// ============================================
// CALCUL DU SCORE
// ============================================

/**
 * Calcule le score final et les étoiles
 */
export function calculateFinalScore(
  targetsCaught: number,
  totalTargets: number,
  wrongCatches: number,
  bestStreak: number,
  hintsUsed: number,
  timeSeconds: number
): { score: number; accuracy: number; stars: 1 | 2 | 3 } {
  // Précision
  const accuracy = totalTargets > 0 ? targetsCaught / totalTargets : 0;

  // Score de base
  let score = targetsCaught * POINTS.CORRECT_CATCH;
  score += wrongCatches * POINTS.WRONG_CATCH;
  score += bestStreak * POINTS.STREAK_BONUS * 2; // Bonus pour la meilleure série

  // Pénalités
  const hintPenalty = hintsUsed * 50;
  score -= hintPenalty;

  // Bonus temps (si terminé rapidement)
  const timeBonus = Math.max(0, (300 - timeSeconds) * 2);
  score += timeBonus;

  // Étoiles basées sur la précision
  let stars: 1 | 2 | 3;
  if (accuracy >= 0.9 && wrongCatches <= 1) {
    stars = 3;
  } else if (accuracy >= 0.7 && wrongCatches <= 3) {
    stars = 2;
  } else {
    stars = 1;
  }

  return {
    score: Math.max(0, score),
    accuracy,
    stars,
  };
}

/**
 * Crée un objet de complétion de niveau
 */
export function createCompletion(
  levelId: string,
  targetsCaught: number,
  totalTargets: number,
  wrongCatches: number,
  bestStreak: number,
  hintsUsed: number,
  timeSeconds: number
): ChasseurCompletion {
  const { score, accuracy, stars } = calculateFinalScore(
    targetsCaught,
    totalTargets,
    wrongCatches,
    bestStreak,
    hintsUsed,
    timeSeconds
  );

  return {
    levelId,
    score,
    accuracy,
    targetsCaught,
    totalTargets,
    wrongCatches,
    bestStreak,
    hintsUsed,
    timeSeconds,
    stars,
  };
}

// ============================================
// GÉNÉRATION D'INDICES
// ============================================

/**
 * Génère un indice basé sur la règle actuelle
 */
export function generateHint(
  rule: GameRule,
  hintLevel: 0 | 1 | 2 | 3
): string {
  const hints: Record<number, string> = {
    0: `Souviens-toi : ${rule.description}`,
    1: `Regarde bien ${rule.iconHint} - cherche les papillons qui correspondent !`,
    2: `Indice : ${rule.shortText}. Concentre-toi uniquement sur ceux-là !`,
    3: `Je vais t'aider ! Les prochains papillons cibles vont briller un peu.`,
  };

  return hints[hintLevel] ?? hints[0];
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Clone un papillon (deep copy)
 */
export function cloneButterfly(butterfly: Butterfly): Butterfly {
  return { ...butterfly };
}

/**
 * Clone un tableau de papillons
 */
export function cloneButterflies(butterflies: Butterfly[]): Butterfly[] {
  return butterflies.map(cloneButterfly);
}

/**
 * Marque un papillon comme attrapé
 */
export function markAsCaught(butterfly: Butterfly): Butterfly {
  return {
    ...butterfly,
    isCaught: true,
  };
}

/**
 * Filtre les papillons actifs (non attrapés)
 */
export function getActiveButterflies(butterflies: Butterfly[]): Butterfly[] {
  return butterflies.filter((b) => !b.isCaught);
}

/**
 * Compte les cibles restantes
 */
export function countRemainingTargets(butterflies: Butterfly[]): number {
  return butterflies.filter((b) => b.isTarget && !b.isCaught).length;
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  generateButterflyId,
  generateRandomPosition,
  generateRandomVelocity,
  generateButterfly,
  generateTargetButterfly,
  generateDistractorButterfly,
  matchesRule,
  evaluateCatch,
  calculateMissPenalty,
  configureWave,
  generateWaveButterflies,
  selectRuleForWave,
  updateButterflyPosition,
  isTouchingButterfly,
  calculateFinalScore,
  createCompletion,
  generateHint,
  cloneButterfly,
  cloneButterflies,
  markAsCaught,
  getActiveButterflies,
  countRemainingTargets,
  POINTS,
  SPAWN_AREA,
  VELOCITY,
};
