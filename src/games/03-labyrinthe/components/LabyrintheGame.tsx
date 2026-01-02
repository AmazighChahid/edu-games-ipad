/**
 * LabyrintheGame.tsx
 * Composant principal du jeu Labyrinthe
 *
 * Structure :
 * - Section 1: Imports
 * - Section 2: Types & Constants
 * - Section 3: Composant Principal
 * - Section 4: Hooks & State
 * - Section 5: Handlers
 * - Section 6: Effects
 * - Section 7: Render conditionnel (Victory, CardUnlock)
 * - Section 8: Render principal (Game UI)
 * - Section 9: Styles
 */

// ============================================================================
// SECTION 1: IMPORTS
// ============================================================================

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

// Components
import { MazeGrid } from './MazeGrid';
import { Avatar } from './Avatar';
import { PathTrail } from './PathTrail';
import { Inventory } from './Inventory';
import { VictoryScreen } from './VictoryScreen';
import { InstructionQueue, Instruction } from './InstructionQueue';
import { ProgrammingControls } from './ProgrammingControls';

// Common components
import { CardUnlockScreen } from '../../../components/collection';
import { PageContainer } from '../../../components/common';

// Hooks
import { useMazeGame } from '../hooks/useMazeGame';
import { useAvatarMovement } from '../hooks/useAvatarMovement';
import { useCardUnlock } from '../../../hooks/useCardUnlock';
import { useCollection } from '../../../store';

// Types & Constants
import { LevelConfig, Direction, SessionStats, InteractiveElement } from '../types';
import { theme } from '../../../theme';
import { Icons } from '../../../constants/icons';

// ============================================================================
// SECTION 2: TYPES & CONSTANTS
// ============================================================================

interface Props {
  level: LevelConfig;
  onComplete: (stats: SessionStats) => void;
  onExit: () => void;
}

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Layout constants - optimisé pour utiliser tout l'espace
const LAYOUT = {
  MASCOT_HEIGHT: 50,        // Réduit pour plus d'espace
  BOTTOM_AREA_HEIGHT: 100,  // Réduit pour plus d'espace
  PADDING: 12,              // Padding minimal
  CONTROLS_WIDTH: 200,      // Contrôles plus compacts
  MAX_CELL_SIZE: 70,        // Taille max raisonnable
  EXECUTION_DELAY: 600,     // ms entre chaque instruction
  MAX_INSTRUCTIONS: 20,
} as const;

// Messages mascotte
const MASCOT_MESSAGES = {
  INITIAL: "Crée ton programme avec les flèches, puis appuie sur Lancer !",
  BLOCKED: "Oups ! C'est bloqué ici...",
  DOOR_LOCKED: "Il nous faut une clé pour cette porte !",
  DOOR_OPENING: "La porte s'ouvre !",
  PROGRAM_FULL: "Programme complet ! Appuie sur Lancer pour tester.",
  PROGRAM_CLEARED: "Programme effacé ! Recommence...",
  EXECUTING: "C'est parti ! Voyons si ton programme fonctionne...",
  PROGRAM_ENDED: "Programme terminé ! Modifie-le et réessaie.",
  EXECUTION_BLOCKED: "Oups ! Bloqué ici. Modifie ton programme.",
  RESET: "On recommence ! Crée un nouveau programme.",
  REPLAY: "On recommence ? Super !",
  BUTTON_PRESSED: "Click ! Quelque chose s'est ouvert...",
} as const;

// ============================================================================
// SECTION 3: COMPOSANT PRINCIPAL
// ============================================================================

export const LabyrintheGame: React.FC<Props> = ({ level, onComplete, onExit }) => {
  const router = useRouter();

  // ============================================================================
  // SECTION 4: HOOKS & STATE
  // ============================================================================

  // -- Store & External Hooks --
  const { getUnlockedCardsCount } = useCollection();

  // -- Game Logic Hook --
  const { mazeState, gameStatus, moveAvatar, resetLevel } = useMazeGame(level);

  // -- Animation Hook --
  const { animatedPosition, animateMove, animateBlocked, setInitialPosition } = useAvatarMovement();

  // -- UI State --
  const [mascotMessage, setMascotMessage] = useState<string>(MASCOT_MESSAGES.INITIAL);
  const [showVictory, setShowVictory] = useState(false);
  const [hasCheckedUnlock, setHasCheckedUnlock] = useState(false);

  // -- Programming State --
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(-1);
  const executionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -- Derived State --
  const isOptimal = mazeState.stats.stars === 3 && mazeState.hintsUsed === 0;

  // -- Card Unlock Hook --
  const {
    unlockedCard,
    showUnlockAnimation,
    checkAndUnlockCard,
    dismissUnlockAnimation,
  } = useCardUnlock({
    gameId: 'labyrinthe',
    levelId: `level_${level.id}`,
    levelNumber: level.id,
    isOptimal,
  });

  // -- Layout Calculations --
  const availableWidth = SCREEN_WIDTH - LAYOUT.CONTROLS_WIDTH - LAYOUT.PADDING * 3;
  const availableHeight = SCREEN_HEIGHT - LAYOUT.MASCOT_HEIGHT - LAYOUT.BOTTOM_AREA_HEIGHT - LAYOUT.PADDING * 3;
  const cellSizeByWidth = Math.floor(availableWidth / level.width);
  const cellSizeByHeight = Math.floor(availableHeight / level.height);
  const cellSize = Math.min(cellSizeByWidth, cellSizeByHeight, LAYOUT.MAX_CELL_SIZE);

  // ============================================================================
  // SECTION 5: HANDLERS
  // ============================================================================

  // -- Navigation Handlers --
  const handleViewCollection = useCallback(() => {
    dismissUnlockAnimation();
    router.push('/(games)/collection');
  }, [dismissUnlockAnimation, router]);

  const handleContinueAfterUnlock = useCallback(() => {
    dismissUnlockAnimation();
  }, [dismissUnlockAnimation]);

  // -- Movement Handler --
  const handleMove = useCallback(
    (direction: Direction): boolean => {
      const result = moveAvatar(direction);

      if (result.success) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        animateMove(result.newPosition!, cellSize);

        // Handle item collection
        if (result.collectedItem) {
          handleItemCollection(result.collectedItem);
        }
        return true;
      }
      return false;
    },
    [moveAvatar, cellSize]
  );

  // -- Item Collection Handler --
  const handleItemCollection = useCallback((item: InteractiveElement) => {
    switch (item.type) {
      case 'key':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setMascotMessage(`Super ! Une clé ${item.color} ! ${Icons.key}`);
        break;
      case 'gem':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setMascotMessage(`${Icons.gem} Bonus !`);
        break;
      case 'button':
        setMascotMessage(MASCOT_MESSAGES.BUTTON_PRESSED);
        break;
    }
  }, []);

  // -- Programming Handlers --
  const handleAddInstruction = useCallback((direction: Direction) => {
    if (instructions.length >= LAYOUT.MAX_INSTRUCTIONS) {
      setMascotMessage(MASCOT_MESSAGES.PROGRAM_FULL);
      return;
    }

    const newInstruction: Instruction = {
      id: `${Date.now()}-${Math.random()}`,
      direction,
      executed: false,
      current: false,
    };

    setInstructions(prev => [...prev, newInstruction]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [instructions.length]);

  const handleRemoveInstruction = useCallback((id: string) => {
    setInstructions(prev => prev.filter(inst => inst.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleClearInstructions = useCallback(() => {
    setInstructions([]);
    setMascotMessage(MASCOT_MESSAGES.PROGRAM_CLEARED);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  // -- Execution Handlers --
  const executeProgram = useCallback(() => {
    if (instructions.length === 0 || isExecuting) return;

    setIsExecuting(true);
    setCurrentInstructionIndex(0);
    setMascotMessage(MASCOT_MESSAGES.EXECUTING);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Mark first instruction as current
    setInstructions(prev => prev.map((inst, idx) => ({
      ...inst,
      current: idx === 0,
      executed: false,
    })));
  }, [instructions.length, isExecuting]);

  // -- Reset Handler --
  const handleReset = useCallback(() => {
    if (executionTimeoutRef.current) {
      clearTimeout(executionTimeoutRef.current);
    }
    resetLevel();
    setInstructions([]);
    setIsExecuting(false);
    setCurrentInstructionIndex(-1);
    setInitialPosition(mazeState.grid.start, cellSize);
    setMascotMessage(MASCOT_MESSAGES.RESET);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [resetLevel, mazeState.grid.start, cellSize, setInitialPosition]);

  // -- Victory Replay Handler --
  const handleReplay = useCallback(() => {
    handleReset();
    setShowVictory(false);
    setHasCheckedUnlock(false);
    setMascotMessage(MASCOT_MESSAGES.REPLAY);
  }, [handleReset]);

  // ============================================================================
  // SECTION 6: EFFECTS
  // ============================================================================

  // -- Initialization --
  useEffect(() => {
    setMascotMessage(MASCOT_MESSAGES.INITIAL);
    setInitialPosition(mazeState.grid.start, cellSize);
  }, []);

  // -- Cleanup timeouts --
  useEffect(() => {
    return () => {
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
      }
    };
  }, []);

  // -- Game Status Feedback --
  useEffect(() => {
    switch (gameStatus) {
      case 'blocked':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        animateBlocked(mazeState.avatarDirection, cellSize);
        setMascotMessage(MASCOT_MESSAGES.BLOCKED);
        break;
      case 'door_locked':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setMascotMessage(MASCOT_MESSAGES.DOOR_LOCKED);
        break;
      case 'door_opening':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setMascotMessage(MASCOT_MESSAGES.DOOR_OPENING);
        break;
      case 'victory':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowVictory(true);
        break;
    }
  }, [gameStatus]);

  // -- Sequential Instruction Execution --
  useEffect(() => {
    if (!isExecuting || currentInstructionIndex < 0) return;

    // Program finished
    if (currentInstructionIndex >= instructions.length) {
      setIsExecuting(false);
      setCurrentInstructionIndex(-1);
      if (gameStatus !== 'victory') {
        setMascotMessage(MASCOT_MESSAGES.PROGRAM_ENDED);
      }
      return;
    }

    const currentInstruction = instructions[currentInstructionIndex];

    // Execute with delay
    executionTimeoutRef.current = setTimeout(() => {
      const success = handleMove(currentInstruction.direction);

      // Update instruction states
      setInstructions(prev => prev.map((inst, idx) => ({
        ...inst,
        executed: idx <= currentInstructionIndex,
        current: idx === currentInstructionIndex + 1,
      })));

      if (!success) {
        // Blocked - stop execution
        setIsExecuting(false);
        setCurrentInstructionIndex(-1);
        setMascotMessage(MASCOT_MESSAGES.EXECUTION_BLOCKED);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      // Next instruction
      setCurrentInstructionIndex(prev => prev + 1);
    }, LAYOUT.EXECUTION_DELAY);

  }, [isExecuting, currentInstructionIndex, instructions, handleMove, gameStatus]);

  // -- Stop execution on victory --
  useEffect(() => {
    if (gameStatus === 'victory' && isExecuting) {
      setIsExecuting(false);
      setCurrentInstructionIndex(-1);
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
      }
    }
  }, [gameStatus, isExecuting]);

  // -- Card unlock check --
  useEffect(() => {
    if (showVictory && !hasCheckedUnlock) {
      const timer = setTimeout(() => {
        checkAndUnlockCard();
        setHasCheckedUnlock(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showVictory, hasCheckedUnlock, checkAndUnlockCard]);

  // -- Reset unlock state --
  useEffect(() => {
    if (!showVictory) {
      setHasCheckedUnlock(false);
    }
  }, [showVictory]);

  // ============================================================================
  // SECTION 7: RENDER CONDITIONNEL (Victory, CardUnlock)
  // ============================================================================

  // -- Card Unlock Screen --
  if (showUnlockAnimation && unlockedCard) {
    return (
      <CardUnlockScreen
        card={unlockedCard}
        unlockedCount={getUnlockedCardsCount()}
        onViewCollection={handleViewCollection}
        onContinue={handleContinueAfterUnlock}
      />
    );
  }

  // -- Victory Screen --
  if (showVictory) {
    return (
      <VictoryScreen
        stats={mazeState.stats}
        onReplay={handleReplay}
        onNext={() => onComplete(mazeState.stats)}
        onExit={onExit}
      />
    );
  }

  // ============================================================================
  // SECTION 8: RENDER PRINCIPAL (Game UI)
  // ============================================================================

  return (
    <PageContainer variant="playful" showDecorations={true}>
      <View style={styles.container}>

        {/* ===== TOP: Mascotte + Stats ===== */}
        <View style={styles.mascotArea}>
        <View style={styles.mascotBubble}>
          <Text style={styles.mascotEmoji}>{Icons.squirrel}</Text>
          <Text style={styles.mascotText}>{mascotMessage}</Text>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>{Icons.map}</Text>
            <Text style={styles.statText}>{mazeState.stats.explorationPercent}%</Text>
          </View>
          {level.hasGems && (
            <View style={styles.stat}>
              <Text style={styles.statIcon}>{Icons.gem}</Text>
              <Text style={styles.statText}>
                {mazeState.gemsCollected}/{mazeState.totalGems}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ===== MIDDLE: Labyrinthe + Contrôles ===== */}
      <View style={styles.mainArea}>

        {/* -- Left: Maze -- */}
        <View style={styles.gameArea}>
          <MazeGrid
            grid={mazeState.grid}
            cellSize={cellSize}
            theme={level.theme}
            showGridLines={level.theme !== 'cozy'}
          >
            {level.showPathTrail && (
              <PathTrail path={mazeState.pathHistory} cellSize={cellSize} />
            )}
            <Avatar
              animatedPosition={animatedPosition}
              direction={mazeState.avatarDirection}
              cellSize={cellSize}
              status={gameStatus}
            />
          </MazeGrid>

          {/* Inventory below maze */}
          {mazeState.inventory.length > 0 && (
            <View style={styles.inventoryContainer}>
              <Inventory items={mazeState.inventory} maxSlots={3} />
            </View>
          )}
        </View>

        {/* -- Right: Controls -- */}
        <View style={styles.controlsArea}>
          <ProgrammingControls
            onAddInstruction={handleAddInstruction}
            onExecute={executeProgram}
            onReset={handleReset}
            canExecute={instructions.length > 0}
            canReset={instructions.length > 0 || mazeState.pathHistory.length > 1}
            isExecuting={isExecuting}
          />
        </View>
      </View>

        {/* ===== BOTTOM: Programme (Instructions) ===== */}
        <View style={styles.bottomArea}>
          <InstructionQueue
            instructions={instructions}
            onRemoveInstruction={handleRemoveInstruction}
            onClear={handleClearInstructions}
            isExecuting={isExecuting}
            maxInstructions={LAYOUT.MAX_INSTRUCTIONS}
          />
        </View>
      </View>
    </PageContainer>
  );
};

// ============================================================================
// SECTION 9: STYLES
// ============================================================================

const styles = StyleSheet.create({
  // -- Container --
  container: {
    flex: 1,
  },

  // -- Top: Mascot Area (compacte) --
  mascotArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.PADDING,
    paddingVertical: theme.spacing[1],
    height: LAYOUT.MASCOT_HEIGHT,
  },
  mascotBubble: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    marginRight: theme.spacing[2],
    ...theme.shadows.sm,
  },
  mascotEmoji: {
    fontSize: 24,
    marginRight: theme.spacing[1],
  },
  mascotText: {
    flex: 1,
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.text.primary,
  },

  // -- Top: Stats Bar (compacte) --
  statsBar: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.primary,
  },

  // -- Middle: Main Area (utilise tout l'espace) --
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: LAYOUT.PADDING,
    gap: LAYOUT.PADDING,
  },

  // -- Middle Left: Game Area --
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // -- Middle Right: Controls Area --
  controlsArea: {
    width: LAYOUT.CONTROLS_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // -- Inventory Container --
  inventoryContainer: {
    marginTop: theme.spacing[2],
    alignItems: 'center',
  },

  // -- Bottom: Programme Area (compacte) --
  bottomArea: {
    height: LAYOUT.BOTTOM_AREA_HEIGHT,
    paddingHorizontal: LAYOUT.PADDING,
    paddingBottom: theme.spacing[1],
    justifyContent: 'center',
  },
});
