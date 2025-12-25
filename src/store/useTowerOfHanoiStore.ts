/**
 * Store Zustand pour le jeu Tour de Hanoï
 * Design moderne 6-10 ans avec modes de jeu et système d'indices
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, GameMode, GAME_MODES } from '../games/tower-of-hanoi/types';
import {
  initializeGame,
  tryMove,
  isValidMove,
  calculateStars,
  getOptimalMoves,
  getHint,
} from '../games/tower-of-hanoi/logic/gameEngine';

interface TowerOfHanoiStore {
  // État du jeu
  gameState: GameState;
  discCount: number;
  errorCount: number;

  // Mode de jeu et progression
  gameMode: GameMode;
  hintsUsed: number;
  hintsRemaining: number;
  personalBest: Record<string, number>; // clé: "mode-discCount", valeur: meilleur score

  // Panneau parent
  isParentPanelOpen: boolean;

  // Animation d'indice
  currentHint: { from: number; to: number } | null;

  // Actions
  startNewGame: (discCount?: number, mode?: GameMode) => void;
  selectTower: (towerIndex: number) => void;
  moveDisc: (fromTower: number, toTower: number) => boolean;
  resetGame: () => void;
  setGameMode: (mode: GameMode) => void;
  useHint: () => { from: number; to: number } | null;
  clearHint: () => void;
  toggleParentPanel: () => void;
  setParentPanelOpen: (open: boolean) => void;

  // Getters calculés
  getStars: () => number;
  canMove: (fromTower: number, toTower: number) => boolean;
  isDiscDraggable: (towerIndex: number, discIndex: number) => boolean;
  getOptimal: () => number;
  getProgress: () => { current: number; total: number };
  getPersonalBest: () => number | null;
  getModeConfig: () => typeof GAME_MODES[0];
}

export const useTowerOfHanoiStore = create<TowerOfHanoiStore>()(
  persist(
    (set, get) => ({
      // État initial
      gameState: initializeGame(6),
      discCount: 6,
      errorCount: 0,
      gameMode: 'discovery',
      hintsUsed: 0,
      hintsRemaining: 3,
      personalBest: {},
      isParentPanelOpen: false,
      currentHint: null,

      // Démarrer une nouvelle partie
      startNewGame: (discCount?: number, mode?: GameMode) => {
        const newMode = mode || get().gameMode;
        const modeConfig = GAME_MODES.find(m => m.id === newMode) || GAME_MODES[0];
        const newDiscCount = discCount || Math.min(Math.max(get().discCount, modeConfig.minDiscs), modeConfig.maxDiscs);

        set({
          gameState: initializeGame(newDiscCount),
          discCount: newDiscCount,
          errorCount: 0,
          gameMode: newMode,
          hintsUsed: 0,
          hintsRemaining: modeConfig.maxHints,
          currentHint: null,
        });
      },

      // Sélectionner une tour (pour mode tap-to-select)
      selectTower: (towerIndex: number) => {
        const { gameState } = get();
        const { selectedTower, towers } = gameState;

        if (selectedTower === null) {
          if (towers[towerIndex].discs.length > 0) {
            set({
              gameState: {
                ...gameState,
                selectedTower: towerIndex,
              },
              currentHint: null,
            });
          }
          return;
        }

        if (selectedTower === towerIndex) {
          set({
            gameState: {
              ...gameState,
              selectedTower: null,
            },
          });
          return;
        }

        get().moveDisc(selectedTower, towerIndex);

        set({
          gameState: {
            ...get().gameState,
            selectedTower: null,
          },
        });
      },

      // Déplacer un disque
      moveDisc: (fromTower: number, toTower: number) => {
        const { gameState, errorCount, gameMode, discCount, personalBest } = get();

        const result = tryMove(gameState, fromTower, toTower);

        if (result.success && result.newState) {
          // Mettre à jour le record personnel si victoire
          let newPersonalBest = personalBest;
          if (result.newState.isComplete) {
            const key = `${gameMode}-${discCount}`;
            const currentBest = personalBest[key];
            if (!currentBest || result.newState.moveCount < currentBest) {
              newPersonalBest = {
                ...personalBest,
                [key]: result.newState.moveCount,
              };
            }
          }

          set({
            gameState: result.newState,
            errorCount: 0,
            personalBest: newPersonalBest,
            currentHint: null,
          });
          return true;
        } else {
          set({
            errorCount: errorCount + 1,
          });
          return false;
        }
      },

      // Réinitialiser la partie
      resetGame: () => {
        const { discCount, gameMode } = get();
        const modeConfig = GAME_MODES.find(m => m.id === gameMode) || GAME_MODES[0];
        set({
          gameState: initializeGame(discCount),
          errorCount: 0,
          hintsUsed: 0,
          hintsRemaining: modeConfig.maxHints,
          currentHint: null,
        });
      },

      // Changer le mode de jeu
      setGameMode: (mode: GameMode) => {
        const modeConfig = GAME_MODES.find(m => m.id === mode) || GAME_MODES[0];
        const currentDiscCount = get().discCount;
        const newDiscCount = Math.min(Math.max(currentDiscCount, modeConfig.minDiscs), modeConfig.maxDiscs);

        set({
          gameMode: mode,
          discCount: newDiscCount,
          gameState: initializeGame(newDiscCount),
          hintsUsed: 0,
          hintsRemaining: modeConfig.maxHints,
          currentHint: null,
          errorCount: 0,
        });
      },

      // Utiliser un indice
      useHint: () => {
        const { gameState, hintsRemaining, gameMode } = get();
        const modeConfig = GAME_MODES.find(m => m.id === gameMode) || GAME_MODES[0];

        if (!modeConfig.hintsEnabled || hintsRemaining <= 0) {
          return null;
        }

        const hint = getHint(gameState);
        if (hint) {
          set({
            hintsUsed: get().hintsUsed + 1,
            hintsRemaining: hintsRemaining - 1,
            currentHint: hint,
          });
        }
        return hint;
      },

      // Effacer l'indice actuel
      clearHint: () => {
        set({ currentHint: null });
      },

      // Basculer le panneau parent
      toggleParentPanel: () => {
        set({ isParentPanelOpen: !get().isParentPanelOpen });
      },

      // Définir l'état du panneau parent
      setParentPanelOpen: (open: boolean) => {
        set({ isParentPanelOpen: open });
      },

      // Calculer les étoiles
      getStars: () => {
        const { gameState, discCount } = get();
        return calculateStars(gameState.moveCount, discCount);
      },

      // Vérifier si un mouvement est possible
      canMove: (fromTower: number, toTower: number) => {
        const { gameState } = get();
        return isValidMove(gameState.towers, fromTower, toTower);
      },

      // Vérifier si un disque peut être déplacé
      isDiscDraggable: (towerIndex: number, discIndex: number) => {
        const { gameState } = get();
        const tower = gameState.towers[towerIndex];
        return discIndex === tower.discs.length - 1;
      },

      // Obtenir le nombre optimal de coups
      getOptimal: () => {
        return getOptimalMoves(get().discCount);
      },

      // Obtenir la progression
      getProgress: () => {
        const { gameState, discCount } = get();
        return {
          current: gameState.moveCount,
          total: getOptimalMoves(discCount),
        };
      },

      // Obtenir le record personnel pour le mode/disques actuels
      getPersonalBest: () => {
        const { gameMode, discCount, personalBest } = get();
        const key = `${gameMode}-${discCount}`;
        return personalBest[key] || null;
      },

      // Obtenir la configuration du mode actuel
      getModeConfig: () => {
        const { gameMode } = get();
        return GAME_MODES.find(m => m.id === gameMode) || GAME_MODES[0];
      },
    }),
    {
      name: 'tower-of-hanoi-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        personalBest: state.personalBest,
        gameMode: state.gameMode,
        discCount: state.discCount,
      }),
    }
  )
);
