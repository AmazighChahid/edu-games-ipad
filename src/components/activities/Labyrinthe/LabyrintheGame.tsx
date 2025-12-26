import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { MazeGrid } from './components/MazeGrid';
import { Avatar } from './components/Avatar';
import { PathTrail } from './components/PathTrail';
import { Inventory } from './components/Inventory';
import { DirectionalControls } from './components/DirectionalControls';
import { VictoryScreen } from './components/VictoryScreen';
import { MascotBubble } from './components/MascotBubble';

import { useMazeGame } from './hooks/useMazeGame';
import { useAvatarMovement } from './hooks/useAvatarMovement';

import { LevelConfig, Direction, SessionStats } from './types';

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
  const { mazeState, gameStatus, moveAvatar, requestHint, resetLevel } = useMazeGame(level);

  const { animatedPosition, animateMove, animateBlocked, setInitialPosition } =
    useAvatarMovement();

  const [mascotMessage, setMascotMessage] = useState<string>('');
  const [showMascot, setShowMascot] = useState(true);
  const [showVictory, setShowVictory] = useState(false);

  // Calcul de la taille des cellules - adapter à l'espace disponible
  const availableWidth = SCREEN_WIDTH - PADDING * 2;
  const availableHeight = SCREEN_HEIGHT - HEADER_HEIGHT - MASCOT_HEIGHT - STATS_HEIGHT - PADDING * 2;

  // Prendre la plus petite taille pour que le labyrinthe rentre
  const cellSizeByWidth = Math.floor(availableWidth / level.width);
  const cellSizeByHeight = Math.floor(availableHeight / level.height);
  const cellSize = Math.min(cellSizeByWidth, cellSizeByHeight, 80); // Max 80px par cellule

  // Initialisation
  useEffect(() => {
    setMascotMessage("On y va ! Glisse ton doigt pour me guider !");
    setInitialPosition(mazeState.grid.start, cellSize);
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

  // Geste de swipe pour déplacement
  const swipeGesture = Gesture.Pan().onEnd((event) => {
    const { translationX, translationY } = event;
    const threshold = 30;

    let direction: Direction | null = null;

    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > threshold) direction = 'right';
      else if (translationX < -threshold) direction = 'left';
    } else {
      if (translationY > threshold) direction = 'down';
      else if (translationY < -threshold) direction = 'up';
    }

    if (direction) {
      runOnJS(handleMove)(direction);
    }
  });

  // Gestion du déplacement
  const handleMove = useCallback(
    (direction: Direction) => {
      const result = moveAvatar(direction);

      if (result.success) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        animateMove(result.newPosition!, cellSize);

        // Vérifier les interactions
        if (result.collectedItem) {
          handleItemCollection(result.collectedItem);
        }
      }
    },
    [moveAvatar, cellSize]
  );

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

  if (showVictory) {
    return (
      <VictoryScreen
        stats={mazeState.stats}
        onReplay={() => {
          resetLevel();
          setShowVictory(false);
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
      <GestureDetector gesture={swipeGesture}>
        <View style={styles.gameArea}>
          {/* Grille du labyrinthe */}
          <MazeGrid grid={mazeState.grid} cellSize={cellSize} theme={level.theme}>
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
      </GestureDetector>

      {/* Inventaire */}
      {mazeState.inventory.length > 0 && (
        <View style={styles.inventoryContainer}>
          <Inventory items={mazeState.inventory} maxSlots={3} />
        </View>
      )}

      {/* Contrôles (si mode boutons) */}
      {level.controlMode === 'buttons' && (
        <DirectionalControls onMove={handleMove} />
      )}

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
