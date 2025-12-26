import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import { MazeGrid } from './components/MazeGrid';
import { Avatar } from './components/Avatar';
import { PathTrail } from './components/PathTrail';
import { Inventory } from './components/Inventory';
import { VictoryScreen } from './components/VictoryScreen';
import { MascotBubble } from './components/MascotBubble';
import { InstructionQueue, Instruction } from './components/InstructionQueue';
import { ProgrammingControls } from './components/ProgrammingControls';

import { useMazeGame } from './hooks/useMazeGame';
import { useAvatarMovement } from './hooks/useAvatarMovement';

import { LevelConfig, Direction, SessionStats } from './types';
import { CardUnlockScreen } from '@/components/collection';
import { useCardUnlock } from '@/hooks/useCardUnlock';
import { useCollection } from '@/store';

interface Props {
  level: LevelConfig;
  onComplete: (stats: SessionStats) => void;
  onExit: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Espace réservé pour header, mascotte, stats
const HEADER_HEIGHT = 80;
const MASCOT_HEIGHT = 100;
const STATS_HEIGHT = 50;
const PADDING = 32;

export const LabyrintheGame: React.FC<Props> = ({ level, onComplete, onExit }) => {
  const router = useRouter();
  const { getUnlockedCardsCount } = useCollection();
  const { mazeState, gameStatus, moveAvatar, requestHint, resetLevel } = useMazeGame(level);

  const { animatedPosition, animateMove, animateBlocked, setInitialPosition } =
    useAvatarMovement();

  const [mascotMessage, setMascotMessage] = useState<string>('');
  const [showMascot, setShowMascot] = useState(true);
  const [showVictory, setShowVictory] = useState(false);
  const [hasCheckedUnlock, setHasCheckedUnlock] = useState(false);

  // État du système de programmation
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(-1);
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculer si la performance est optimale (3 étoiles)
  const isOptimal = mazeState.stats.stars === 3 && mazeState.hintsUsed === 0;

  // Système de déblocage de cartes
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

  // Check pour déblocage de carte après victoire
  useEffect(() => {
    if (showVictory && !hasCheckedUnlock) {
      const timer = setTimeout(() => {
        checkAndUnlockCard();
        setHasCheckedUnlock(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showVictory, hasCheckedUnlock, checkAndUnlockCard]);

  // Reset l'état quand on recommence
  useEffect(() => {
    if (!showVictory) {
      setHasCheckedUnlock(false);
    }
  }, [showVictory]);

  // Handlers pour le déblocage de cartes
  const handleViewCollection = useCallback(() => {
    dismissUnlockAnimation();
    router.push('/(games)/collection');
  }, [dismissUnlockAnimation, router]);

  const handleContinueAfterUnlock = useCallback(() => {
    dismissUnlockAnimation();
  }, [dismissUnlockAnimation]);

  // Calcul de la taille des cellules - adapter à l'espace disponible
  const availableWidth = SCREEN_WIDTH - PADDING * 2;
  const availableHeight = SCREEN_HEIGHT - HEADER_HEIGHT - MASCOT_HEIGHT - STATS_HEIGHT - PADDING * 2;

  // Prendre la plus petite taille pour que le labyrinthe rentre
  const cellSizeByWidth = Math.floor(availableWidth / level.width);
  const cellSizeByHeight = Math.floor(availableHeight / level.height);
  const cellSize = Math.min(cellSizeByWidth, cellSizeByHeight, 80); // Max 80px par cellule

  // Initialisation
  useEffect(() => {
    setMascotMessage("Crée ton programme avec les flèches, puis appuie sur Lancer !");
    setInitialPosition(mazeState.grid.start, cellSize);
  }, []);

  // Nettoyage des timeouts
  useEffect(() => {
    return () => {
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
      }
    };
  }, []);

  // Gestion du feedback selon le statut du jeu
  useEffect(() => {
    switch (gameStatus) {
      case 'blocked':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        animateBlocked(mazeState.avatarDirection, cellSize);
        setMascotMessage("Oups ! C'est bloqué ici...");
        break;
      case 'door_locked':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setMascotMessage("Il nous faut une clé pour cette porte !");
        break;
      case 'door_opening':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setMascotMessage("La porte s'ouvre !");
        break;
      case 'victory':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowVictory(true);
        break;
    }
  }, [gameStatus]);

  // Gestion du déplacement (exécute un mouvement unique)
  const handleMove = useCallback(
    (direction: Direction): boolean => {
      const result = moveAvatar(direction);

      if (result.success) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        animateMove(result.newPosition!, cellSize);

        // Vérifier les interactions
        if (result.collectedItem) {
          handleItemCollection(result.collectedItem);
        }
        return true;
      }
      return false;
    },
    [moveAvatar, cellSize]
  );

  // Ajouter une instruction au programme
  const handleAddInstruction = useCallback((direction: Direction) => {
    if (instructions.length >= 20) {
      setMascotMessage("Programme complet ! Appuie sur Lancer pour tester.");
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

  // Supprimer une instruction
  const handleRemoveInstruction = useCallback((id: string) => {
    setInstructions(prev => prev.filter(inst => inst.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // Effacer toutes les instructions
  const handleClearInstructions = useCallback(() => {
    setInstructions([]);
    setMascotMessage("Programme effacé ! Recommence...");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  // Exécuter le programme
  const executeProgram = useCallback(() => {
    if (instructions.length === 0 || isExecuting) return;

    setIsExecuting(true);
    setCurrentInstructionIndex(0);
    setMascotMessage("C'est parti ! Voyons si ton programme fonctionne...");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Marquer la première instruction comme courante
    setInstructions(prev => prev.map((inst, idx) => ({
      ...inst,
      current: idx === 0,
      executed: false,
    })));
  }, [instructions.length, isExecuting]);

  // Exécution séquentielle des instructions
  useEffect(() => {
    if (!isExecuting || currentInstructionIndex < 0) return;

    if (currentInstructionIndex >= instructions.length) {
      // Programme terminé
      setIsExecuting(false);
      setCurrentInstructionIndex(-1);
      if (gameStatus !== 'victory') {
        setMascotMessage("Programme terminé ! Modifie-le et réessaie.");
      }
      return;
    }

    const currentInstruction = instructions[currentInstructionIndex];

    // Exécuter l'instruction courante après un délai
    executionTimeoutRef.current = setTimeout(() => {
      const success = handleMove(currentInstruction.direction);

      // Mettre à jour l'état des instructions
      setInstructions(prev => prev.map((inst, idx) => ({
        ...inst,
        executed: idx <= currentInstructionIndex,
        current: idx === currentInstructionIndex + 1,
      })));

      if (!success) {
        // Mouvement bloqué - arrêter l'exécution
        setIsExecuting(false);
        setCurrentInstructionIndex(-1);
        setMascotMessage("Oups ! Bloqué ici. Modifie ton programme.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      // Passer à l'instruction suivante
      setCurrentInstructionIndex(prev => prev + 1);
    }, 600); // 600ms entre chaque instruction

  }, [isExecuting, currentInstructionIndex, instructions, handleMove, gameStatus]);

  // Arrêter l'exécution en cas de victoire
  useEffect(() => {
    if (gameStatus === 'victory' && isExecuting) {
      setIsExecuting(false);
      setCurrentInstructionIndex(-1);
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
      }
    }
  }, [gameStatus, isExecuting]);

  // Réinitialiser le niveau et le programme
  const handleReset = useCallback(() => {
    if (executionTimeoutRef.current) {
      clearTimeout(executionTimeoutRef.current);
    }
    resetLevel();
    setInstructions([]);
    setIsExecuting(false);
    setCurrentInstructionIndex(-1);
    setInitialPosition(mazeState.grid.start, cellSize);
    setMascotMessage("On recommence ! Crée un nouveau programme.");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [resetLevel, mazeState.grid.start, cellSize, setInitialPosition]);

  // Collecte d'objet
  const handleItemCollection = useCallback((item: any) => {
    switch (item.type) {
      case 'key':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setMascotMessage(`Super ! Une clé ${item.color} ! 🔑`);
        break;
      case 'gem':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setMascotMessage("💎 Bonus !");
        break;
      case 'button':
        setMascotMessage("Click ! Quelque chose s'est ouvert...");
        break;
    }
  }, []);

  // Demande d'indice
  const handleHint = useCallback(() => {
    const hint = requestHint();
    if (hint) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setMascotMessage(hint.message);
    }
  }, [requestHint]);

  // Afficher l'écran de déblocage de carte si une carte a été débloquée
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

  if (showVictory) {
    return (
      <VictoryScreen
        stats={mazeState.stats}
        onReplay={() => {
          handleReset();
          setShowVictory(false);
          setHasCheckedUnlock(false);
          setMascotMessage("On recommence ? Super !");
        }}
        onNext={() => onComplete(mazeState.stats)}
        onExit={onExit}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.iconButton}
          onPress={onExit}
          accessibilityLabel="Retour au menu"
        >
          <Text style={styles.iconButtonText}>🏠</Text>
        </Pressable>

        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>Niveau {level.id}</Text>
          <Text style={styles.levelName}>{level.name}</Text>
        </View>

        <Pressable
          style={styles.iconButton}
          onPress={handleHint}
          disabled={mazeState.hintsUsed >= 5}
          accessibilityLabel="Demander un indice"
        >
          <Text style={styles.iconButtonText}>💡</Text>
          {mazeState.hintsUsed > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{mazeState.hintsUsed}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Mascotte */}
      <MascotBubble message={mascotMessage} visible={showMascot} position="top" />

      {/* Zone de jeu */}
      <View style={styles.gameArea}>
        {/* Grille du labyrinthe avec lignes de grille visibles */}
        <MazeGrid grid={mazeState.grid} cellSize={cellSize} theme={level.theme} showGridLines={true}>
          {/* Fil d'Ariane */}
          {level.showPathTrail && (
            <PathTrail path={mazeState.pathHistory} cellSize={cellSize} />
          )}

          {/* Avatar */}
          <Avatar
            animatedPosition={animatedPosition}
            direction={mazeState.avatarDirection}
            cellSize={cellSize}
            status={gameStatus}
          />
        </MazeGrid>
      </View>

      {/* File d'instructions (Programme) */}
      <InstructionQueue
        instructions={instructions}
        onRemoveInstruction={handleRemoveInstruction}
        onClear={handleClearInstructions}
        isExecuting={isExecuting}
        maxInstructions={20}
      />

      {/* Inventaire */}
      {mazeState.inventory.length > 0 && (
        <View style={styles.inventoryContainer}>
          <Inventory items={mazeState.inventory} maxSlots={3} />
        </View>
      )}

      {/* Contrôles de programmation */}
      <ProgrammingControls
        onAddInstruction={handleAddInstruction}
        onExecute={executeProgram}
        onReset={handleReset}
        canExecute={instructions.length > 0}
        canReset={instructions.length > 0 || mazeState.pathHistory.length > 1}
        isExecuting={isExecuting}
      />

      {/* Stats rapides */}
      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>🗺️</Text>
          <Text style={styles.statText}>{mazeState.stats.explorationPercent}%</Text>
        </View>
        {level.hasGems && (
          <View style={styles.stat}>
            <Text style={styles.statIcon}>💎</Text>
            <Text style={styles.statText}>
              {mazeState.gemsCollected}/{mazeState.totalGems}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  iconButtonText: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E53E3E',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  levelInfo: {
    alignItems: 'center',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  levelName: {
    fontSize: 14,
    color: '#4A5568',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inventoryContainer: {
    padding: 16,
    alignItems: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(91, 141, 238, 0.2)',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
});
