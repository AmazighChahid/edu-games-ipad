// ============================================
// UTILITAIRES : Labyrinthe Logique
// ============================================

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Mélange un tableau (algorithme Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Vérifie si deux positions sont égales
 */
export function positionsEqual(a: { x: number; y: number }, b: { x: number; y: number }): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Convertit une position en clé string
 */
export function positionToKey(pos: { x: number; y: number }): string {
  return `${pos.x},${pos.y}`;
}

/**
 * Convertit une clé string en position
 */
export function keyToPosition(key: string): { x: number; y: number } {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
}

/**
 * Calcule la distance Manhattan entre deux positions
 */
export function manhattanDistance(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Vérifie si une position est dans les limites de la grille
 */
export function isInBounds(
  pos: { x: number; y: number },
  width: number,
  height: number
): boolean {
  return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
}
