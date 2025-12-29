/**
 * Balance Intro Hook - Orchestrateur
 * Gère la logique d'introduction, sélection de niveau, et progression
 * Sépare la logique métier de l'UI pour une meilleure testabilité
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useActiveProfile } from '../../../store/useStore';
import { generateDefaultLevels, type LevelConfig, type TrainingParam } from '../../../components/common';
import { getAllPuzzles, getPuzzleById, getPuzzlesByPhase } from '../data/puzzles';
import { createInitialState, addObjectToPlate } from '../logic/balanceEngine';
import { createObject } from '../data/objects';
import { balanceParentGuideData } from '../data/parentGuideData';
import type { Puzzle, Phase, MascotMood, BalanceState } from '../types';
import { PHASE_INFO } from '../types';
import { Icons } from '../../../constants/icons';

// ============================================
// TYPES
// ============================================

export type BalanceGameView = 'intro' | 'game' | 'sandbox' | 'journal';

export interface UseBalanceIntroProps {
  onNavigateBack?: () => void;
}

export interface UseBalanceIntroReturn {
  // État
  selectedLevel: LevelConfig | null;
  isPlaying: boolean;
  isTrainingMode: boolean;
  selectedPhase: Phase;
  mascotMessage: string;
  mascotMood: MascotMood;
  currentPuzzle: Puzzle | null;
  showParentDrawer: boolean;
  levels: LevelConfig[];
  trainingParams: TrainingParam[];
  trainingValues: Record<string, string | number | boolean>;
  previewBalanceState: BalanceState | null;

  // Statistiques
  completedCount: number;
  totalPuzzles: number;

  // Handlers
  handleBack: () => void;
  handleSelectLevel: (level: LevelConfig) => void;
  handleStartPlaying: () => void;
  handleTrainingPress: () => void;
  handleTrainingChange: (id: string, value: string | number | boolean) => void;
  handleParentPress: () => void;
  handleCloseParentDrawer: () => void;
  handleHelpPress: () => void;
  handleReset: () => void;
  handleHint: () => void;

  // Données pour ParentDrawer
  parentGuideData: typeof balanceParentGuideData;

  // Helper pour le rendu
  getPhaseInfo: (phase: Phase) => typeof PHASE_INFO[Phase];
  getMascotMessageType: () => 'victory' | 'hint' | 'encourage' | 'intro';
}

// ============================================
// MESSAGES MASCOTTE
// ============================================

const MASCOT_MESSAGES = {
  welcome: "Coucou ! Je suis Dr. Hibou ! Bienvenue dans mon laboratoire !",
  help: "Place les objets sur la balance pour l'équilibrer ! Quand les deux côtés pèsent pareil, elle reste droite !",
  trainingOn: "Mode entraînement ! Explore toutes les phases !",
  trainingOff: "Retour aux niveaux !",
  selectLevel: "Sélectionne un niveau pour voir l'expérience",
  hint: "Observe bien les objets... Lequel va équilibrer la balance ?",
};

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useBalanceIntro({
  onNavigateBack,
}: UseBalanceIntroProps = {}): UseBalanceIntroReturn {
  const router = useRouter();
  const profile = useActiveProfile();

  // État principal
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase>(1);
  const [mascotMessage, setMascotMessage] = useState(MASCOT_MESSAGES.welcome);
  const [mascotMood, setMascotMood] = useState<MascotMood>('curious');
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [showParentDrawer, setShowParentDrawer] = useState(false);
  const [trainingValues, setTrainingValues] = useState<Record<string, string | number | boolean>>({
    phase: '1',
    mode: 'levels',
  });

  // Générer les niveaux basés sur l'âge de l'enfant
  const levels = useMemo(() => {
    return generateDefaultLevels('balance', profile?.birthDate, []);
  }, [profile?.birthDate]);

  // Tous les puzzles
  const allPuzzles = useMemo(() => getAllPuzzles(), []);
  const totalPuzzles = allPuzzles.length;

  // TODO: Récupérer depuis le store Zustand
  const completedCount = 0;

  // Puzzle actuel basé sur le niveau sélectionné
  useEffect(() => {
    if (selectedLevel) {
      const puzzle = getPuzzleById(selectedLevel.id);
      if (puzzle) {
        setCurrentPuzzle(puzzle);
        const phaseInfo = PHASE_INFO[puzzle.phase];
        setMascotMessage(`Phase ${puzzle.phase} : ${phaseInfo.name}`);
        setMascotMood('curious');
      }
    }
  }, [selectedLevel]);

  // Paramètres du mode entraînement
  const trainingParams: TrainingParam[] = useMemo(() => [
    {
      id: 'phase',
      label: 'Phase',
      type: 'select',
      options: [
        { value: '1', label: `${PHASE_INFO[1].icon} ${PHASE_INFO[1].name}` },
        { value: '2', label: `${PHASE_INFO[2].icon} ${PHASE_INFO[2].name}` },
        { value: '3', label: `${PHASE_INFO[3].icon} ${PHASE_INFO[3].name}` },
        { value: '4', label: `${PHASE_INFO[4].icon} ${PHASE_INFO[4].name}` },
      ],
      defaultValue: '1',
    },
    {
      id: 'mode',
      label: 'Mode',
      type: 'select',
      options: [
        { value: 'levels', label: `${Icons.lab} Niveaux` },
        { value: 'sandbox', label: `${Icons.sandbox} Mode Libre` },
        { value: 'journal', label: `${Icons.journal} Mon Journal` },
      ],
      defaultValue: 'levels',
    },
  ], []);

  // État de la balance pour preview
  const previewBalanceState = useMemo(() => {
    if (!currentPuzzle) return null;

    let state = createInitialState();

    // Ajouter les objets initiaux
    currentPuzzle.initialLeft.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        const obj = createObject(config.objectId, `preview_left_${config.objectId}_${i}`);
        state = addObjectToPlate(state, obj, 'left');
      }
    });

    currentPuzzle.initialRight.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        const obj = createObject(config.objectId, `preview_right_${config.objectId}_${i}`);
        state = addObjectToPlate(state, obj, 'right');
      }
    });

    return state;
  }, [currentPuzzle]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleBack = useCallback(() => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      router.back();
    }
  }, [router, onNavigateBack]);

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);

    // Trouver le puzzle correspondant
    const puzzle = getPuzzleById(level.id);
    if (puzzle) {
      setCurrentPuzzle(puzzle);
      setSelectedPhase(puzzle.phase);
    }
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (selectedLevel) {
      setIsPlaying(true);
      setMascotMood('excited');
    }
  }, [selectedLevel]);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode(prev => !prev);
    setMascotMessage(isTrainingMode ? MASCOT_MESSAGES.trainingOff : MASCOT_MESSAGES.trainingOn);
    setMascotMood('curious');
  }, [isTrainingMode]);

  const handleTrainingChange = useCallback((id: string, value: string | number | boolean) => {
    setTrainingValues(prev => ({ ...prev, [id]: value }));

    if (id === 'phase') {
      const phase = parseInt(value as string, 10) as Phase;
      setSelectedPhase(phase);
      const puzzles = getPuzzlesByPhase(phase);
      if (puzzles.length > 0) {
        setCurrentPuzzle(puzzles[0]);
      }
    }
  }, []);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleCloseParentDrawer = useCallback(() => {
    setShowParentDrawer(false);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage(MASCOT_MESSAGES.help);
    setMascotMood('excited');
  }, []);

  const handleReset = useCallback(() => {
    setCurrentPuzzle(prev => prev ? { ...prev } : null);
    setMascotMessage(MASCOT_MESSAGES.hint);
    setMascotMood('curious');
  }, []);

  const handleHint = useCallback(() => {
    if (currentPuzzle && currentPuzzle.hints.length > 0) {
      setMascotMessage(currentPuzzle.hints[0]);
      setMascotMood('encouraging');
    }
  }, [currentPuzzle]);

  // ============================================
  // HELPERS
  // ============================================

  const getPhaseInfo = useCallback((phase: Phase) => {
    return PHASE_INFO[phase];
  }, []);

  const getMascotMessageType = useCallback((): 'victory' | 'hint' | 'encourage' | 'intro' => {
    if (mascotMood === 'celebratory') return 'victory';
    if (mascotMood === 'excited') return 'hint';
    if (mascotMood === 'curious') return 'encourage';
    return 'intro';
  }, [mascotMood]);

  return {
    // État
    selectedLevel,
    isPlaying,
    isTrainingMode,
    selectedPhase,
    mascotMessage,
    mascotMood,
    currentPuzzle,
    showParentDrawer,
    levels,
    trainingParams,
    trainingValues,
    previewBalanceState,

    // Statistiques
    completedCount,
    totalPuzzles,

    // Handlers
    handleBack,
    handleSelectLevel,
    handleStartPlaying,
    handleTrainingPress,
    handleTrainingChange,
    handleParentPress,
    handleCloseParentDrawer,
    handleHelpPress,
    handleReset,
    handleHint,

    // Données
    parentGuideData: balanceParentGuideData,

    // Helpers
    getPhaseInfo,
    getMascotMessageType,
  };
}

export default useBalanceIntro;
