/**
 * useFabriqueGame - Hook de logique de jeu pure
 * ==============================================
 * Gère l'état du puzzle et les interactions du joueur
 *
 * Responsabilités :
 * - État de la machine (éléments placés, connexions)
 * - Placement/retrait d'éléments
 * - Validation des connexions
 * - Simulation de la réaction en chaîne
 * - Calcul des étoiles
 */

import { useState, useCallback, useMemo } from 'react';
import type {
  LevelConfig,
  PlacedElement,
  GridPosition,
  Connection,
  SimulationResult,
  GameStatus,
  LevelResult,
  EnergyType,
} from '../types';
import { getElementDefinition, areEnergiesCompatible } from '../data/elements';

// ============================================
// TYPES
// ============================================

interface UseFabriqueGameProps {
  level: LevelConfig;
  onLevelComplete?: (result: LevelResult) => void;
}

interface UseFabriqueGameReturn {
  // État
  placedElements: PlacedElement[];
  connections: Connection[];
  selectedSlot: GridPosition | null;
  status: GameStatus;
  attempts: number;
  hintsUsed: number;
  currentHintLevel: 0 | 1 | 2 | 3;

  // Actions
  placeElement: (elementId: string, position: GridPosition) => boolean;
  removeElement: (placedId: string) => void;
  selectSlot: (position: GridPosition | null) => void;
  runSimulation: () => Promise<SimulationResult>;
  resetMachine: () => void;
  requestHint: () => void;

  // Requêtes
  canPlaceAt: (elementId: string, position: GridPosition) => boolean;
  getAvailableElements: () => string[];
  isLevelComplete: boolean;
  currentStars: number;

  // Simulation
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
}

// ============================================
// HOOK
// ============================================

export function useFabriqueGame({
  level,
  onLevelComplete,
}: UseFabriqueGameProps): UseFabriqueGameReturn {
  // ============================================
  // STATE
  // ============================================

  // Éléments placés (initialisé avec les éléments fixes du niveau)
  const [placedElements, setPlacedElements] = useState<PlacedElement[]>(
    level.fixedElements
  );

  // Emplacement sélectionné
  const [selectedSlot, setSelectedSlot] = useState<GridPosition | null>(null);

  // Statut du jeu
  const [status, setStatus] = useState<GameStatus>('idle');

  // Compteurs
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHintLevel, setCurrentHintLevel] = useState<0 | 1 | 2 | 3>(0);

  // Résultat de simulation
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // ============================================
  // COMPUTED: Connexions auto-générées
  // ============================================

  const connections = useMemo(() => {
    return autoConnect(placedElements);
  }, [placedElements]);

  // ============================================
  // COMPUTED: Éléments disponibles à placer
  // ============================================

  const getAvailableElements = useCallback((): string[] => {
    // Compter combien de chaque élément est déjà placé
    const placedCounts: Record<string, number> = {};
    placedElements.forEach((el) => {
      if (!el.isFixed) {
        placedCounts[el.elementId] = (placedCounts[el.elementId] || 0) + 1;
      }
    });

    // Compter combien de chaque élément est disponible dans le niveau
    const availableCounts: Record<string, number> = {};
    level.availableElements.forEach((id) => {
      availableCounts[id] = (availableCounts[id] || 0) + 1;
    });

    // Retourner les éléments qui n'ont pas tous été utilisés
    const remaining: string[] = [];
    Object.entries(availableCounts).forEach(([id, count]) => {
      const used = placedCounts[id] || 0;
      for (let i = 0; i < count - used; i++) {
        remaining.push(id);
      }
    });

    return remaining;
  }, [placedElements, level.availableElements]);

  // ============================================
  // ACTIONS: Placement d'éléments
  // ============================================

  const canPlaceAt = useCallback(
    (elementId: string, position: GridPosition): boolean => {
      // Vérifier si la position est un emplacement vide autorisé
      const isEmptySlot = level.emptySlots.some(
        (slot) => slot.row === position.row && slot.col === position.col
      );
      if (!isEmptySlot) return false;

      // Vérifier si pas déjà occupé par un élément non-fixe
      const isOccupied = placedElements.some(
        (el) =>
          el.position.row === position.row &&
          el.position.col === position.col &&
          !el.isFixed
      );
      if (isOccupied) return false;

      // Vérifier si l'élément est encore disponible
      const available = getAvailableElements();
      if (!available.includes(elementId)) return false;

      return true;
    },
    [level.emptySlots, placedElements, getAvailableElements]
  );

  const placeElement = useCallback(
    (elementId: string, position: GridPosition): boolean => {
      if (!canPlaceAt(elementId, position)) {
        return false;
      }

      const newElement: PlacedElement = {
        id: `placed_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        elementId,
        position,
        rotation: 0,
        state: 'idle',
        isFixed: false,
      };

      setPlacedElements((prev) => [...prev, newElement]);
      setStatus('placing');
      setSelectedSlot(null);

      return true;
    },
    [canPlaceAt]
  );

  const removeElement = useCallback(
    (placedId: string) => {
      const element = placedElements.find((e) => e.id === placedId);

      // Ne peut pas retirer un élément fixe
      if (!element || element.isFixed) {
        return;
      }

      setPlacedElements((prev) => prev.filter((e) => e.id !== placedId));
      setStatus('placing');
    },
    [placedElements]
  );

  const selectSlot = useCallback((position: GridPosition | null) => {
    setSelectedSlot(position);
  }, []);

  // ============================================
  // ACTIONS: Simulation
  // ============================================

  const runSimulation = useCallback(async (): Promise<SimulationResult> => {
    setIsSimulating(true);
    setAttempts((prev) => prev + 1);
    setStatus('simulating');

    // Simuler un délai pour l'animation
    await delay(500);

    // Valider la machine
    const result = validateMachine(placedElements, connections, level);

    setSimulationResult(result);
    setIsSimulating(false);

    if (result.success) {
      setStatus('success');

      // Calculer les étoiles
      const stars = calculateStars(
        attempts + 1,
        hintsUsed,
        level.stars3Threshold,
        level.stars2Threshold
      );

      // Notifier la complétion
      onLevelComplete?.({
        success: true,
        stars,
        moves: attempts + 1,
        hintsUsed,
        time: 0, // TODO: track time
      });
    } else {
      setStatus('error');
    }

    return result;
  }, [placedElements, connections, level, attempts, hintsUsed, onLevelComplete]);

  // ============================================
  // ACTIONS: Reset et indices
  // ============================================

  const resetMachine = useCallback(() => {
    setPlacedElements(level.fixedElements);
    setSelectedSlot(null);
    setStatus('idle');
    setSimulationResult(null);
  }, [level.fixedElements]);

  const requestHint = useCallback(() => {
    if (currentHintLevel >= 3) return;

    setHintsUsed((prev) => prev + 1);
    setCurrentHintLevel((prev) => Math.min(prev + 1, 3) as 0 | 1 | 2 | 3);
  }, [currentHintLevel]);

  // ============================================
  // COMPUTED: État de complétion
  // ============================================

  const isLevelComplete = status === 'success';

  const currentStars = useMemo(() => {
    return calculateStars(
      attempts,
      hintsUsed,
      level.stars3Threshold,
      level.stars2Threshold
    );
  }, [attempts, hintsUsed, level.stars3Threshold, level.stars2Threshold]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // État
    placedElements,
    connections,
    selectedSlot,
    status,
    attempts,
    hintsUsed,
    currentHintLevel,

    // Actions
    placeElement,
    removeElement,
    selectSlot,
    runSimulation,
    resetMachine,
    requestHint,

    // Requêtes
    canPlaceAt,
    getAvailableElements,
    isLevelComplete,
    currentStars,

    // Simulation
    simulationResult,
    isSimulating,
  };
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Génère automatiquement les connexions entre éléments adjacents
 */
function autoConnect(elements: PlacedElement[]): Connection[] {
  const connections: Connection[] = [];

  for (let i = 0; i < elements.length; i++) {
    for (let j = 0; j < elements.length; j++) {
      if (i === j) continue;

      const from = elements[i];
      const to = elements[j];

      // Vérifier si les éléments sont adjacents (distance 1)
      const distance = getGridDistance(from.position, to.position);
      if (distance !== 1) continue;

      // Vérifier si les types d'énergie sont compatibles
      const fromDef = getElementDefinition(from.elementId);
      const toDef = getElementDefinition(to.elementId);

      if (!fromDef || !toDef) continue;

      if (areEnergiesCompatible(fromDef.producesEnergy, toDef.acceptsEnergy)) {
        // Trouver le type d'énergie compatible
        const energyType = fromDef.producesEnergy.find((e) =>
          toDef.acceptsEnergy.includes(e)
        ) as EnergyType;

        connections.push({
          fromElementId: from.id,
          fromPointId: 'auto',
          toElementId: to.id,
          toPointId: 'auto',
          energyType,
        });
      }
    }
  }

  return connections;
}

/**
 * Calcule la distance Manhattan entre deux positions
 */
function getGridDistance(a: GridPosition, b: GridPosition): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Valide si la machine fonctionne
 * Vérifie que l'énergie peut circuler de la source à l'effet final
 */
function validateMachine(
  elements: PlacedElement[],
  connections: Connection[],
  _level: LevelConfig
): SimulationResult {
  // Trouver les sources
  const sources = elements.filter((e) => {
    const def = getElementDefinition(e.elementId);
    return def?.category === 'source';
  });

  if (sources.length === 0) {
    return {
      success: false,
      failedAt: 'start',
      reason: "Aucune source d'énergie trouvée",
    };
  }

  // Trouver les effets finaux
  const effects = elements.filter((e) => {
    const def = getElementDefinition(e.elementId);
    return def?.category === 'effect';
  });

  if (effects.length === 0) {
    return {
      success: false,
      failedAt: 'end',
      reason: 'Aucun effet final trouvé',
    };
  }

  // Parcourir le graphe de connexions depuis les sources
  const visited = new Set<string>();
  const queue: string[] = sources.map((s) => s.id);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    // Trouver les connexions sortantes
    const outgoing = connections.filter((c) => c.fromElementId === currentId);
    for (const conn of outgoing) {
      if (!visited.has(conn.toElementId)) {
        queue.push(conn.toElementId);
      }
    }
  }

  // Vérifier si au moins un effet final a été atteint
  const reachedEffects = effects.filter((e) => visited.has(e.id));

  if (reachedEffects.length > 0) {
    return {
      success: true,
      steps: visited.size,
      time: 0,
    };
  }

  // Trouver où ça s'est arrêté
  const lastVisited = Array.from(visited).pop() || 'unknown';
  return {
    success: false,
    failedAt: lastVisited,
    reason: "L'énergie n'a pas atteint l'objectif",
  };
}

/**
 * Calcule le nombre d'étoiles obtenues
 */
function calculateStars(
  attempts: number,
  hints: number,
  threshold3: number,
  threshold2: number
): 0 | 1 | 2 | 3 {
  const adjustedAttempts = attempts + hints * 2;

  if (adjustedAttempts <= threshold3) return 3;
  if (adjustedAttempts <= threshold2) return 2;
  if (adjustedAttempts > 0) return 1;
  return 0;
}

/**
 * Délai utilitaire
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default useFabriqueGame;
