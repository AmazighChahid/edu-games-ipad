/**
 * Écran principal du jeu Tour de Hanoï
 * Design moderne 6-10 ans - Style vectoriel/plat
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameBoard } from './components/GameBoard';
import { ParentPanel } from './components/ParentPanel';
import { VictoryModal } from './components/VictoryModal';
import { GameModeSelector } from './components/GameModeSelector';
import { useTowerOfHanoiStore, useAppStore } from '../../store';
import { Colors, Layout, Typography } from '../../constants';
import { GameMode } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const TowerOfHanoiScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    gameState,
    discCount,
    gameMode,
    hintsRemaining,
    isParentPanelOpen,
    currentHint,
    startNewGame,
    resetGame,
    setGameMode,
    useHint,
    clearHint,
    toggleParentPanel,
    getOptimal,
    getPersonalBest,
    getModeConfig,
  } = useTowerOfHanoiStore();

  const { incrementGamesCompleted } = useAppStore();

  // État local pour afficher/masquer l'aide
  const [showHelp, setShowHelp] = useState(false);

  // Animation pour le panneau parent
  const panelAnimation = useSharedValue(0);

  useEffect(() => {
    panelAnimation.value = withSpring(isParentPanelOpen ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    });
  }, [isParentPanelOpen]);

  // Initialiser une nouvelle partie au montage
  useEffect(() => {
    startNewGame(discCount, gameMode);
  }, []);

  // Gérer la victoire
  useEffect(() => {
    if (gameState.isComplete) {
      incrementGamesCompleted();
    }
  }, [gameState.isComplete]);

  const handlePlayAgain = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleGoHome = useCallback(() => {
    resetGame();
    navigation.goBack();
  }, [resetGame, navigation]);

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetGame();
  }, [resetGame]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleHelp = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowHelp(!showHelp);
    toggleParentPanel();
  }, [showHelp, toggleParentPanel]);

  const handleHint = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    useHint();
  }, [useHint]);

  const handleModeChange = useCallback((mode: GameMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGameMode(mode);
  }, [setGameMode]);

  const optimal = getOptimal();
  const personalBest = getPersonalBest();
  const modeConfig = getModeConfig();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header avec dégradé bleu */}
      <LinearGradient
        colors={['#5BA3E8', '#4A90D9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        {/* Bouton Menu */}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleBack}
          accessibilityLabel="Menu"
          accessibilityHint="Retourne au menu principal"
        >
          <Text style={styles.headerButtonIcon}>{'◀'}</Text>
          <Text style={styles.headerButtonText}>Menu</Text>
        </TouchableOpacity>

        {/* Titre et niveau */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Tour de Hanoï — Niveau {discCount - 2}</Text>
        </View>

        {/* Icônes de statut (décoratives) */}
        <View style={styles.headerIcons}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View
              key={i}
              style={[
                styles.statusDot,
                { backgroundColor: i <= discCount ? '#FFFFFF' : 'rgba(255,255,255,0.3)' },
              ]}
            />
          ))}
        </View>
      </LinearGradient>

      {/* Zone de jeu principale */}
      <View style={styles.gameArea}>
        {/* Compteur de coups et objectif */}
        <View style={styles.statsContainer}>
          <View style={styles.movesBox}>
            <Text style={styles.movesLabel}>Coups</Text>
            <Text style={styles.movesCount}>{gameState.moveCount}</Text>
          </View>
          <Text style={styles.objectiveText}>
            Objectif : {optimal} (optimal)
          </Text>
        </View>

        {/* Boutons d'action (Aide et Reset) */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.helpButton]}
            onPress={handleHelp}
            accessibilityLabel="Aide"
          >
            <Text style={styles.actionButtonIcon}>💡</Text>
            <Text style={styles.actionButtonText}>Aide</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleReset}
            accessibilityLabel="Recommencer"
          >
            <Text style={styles.actionButtonIcon}>↻</Text>
            <Text style={styles.actionButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Plateau de jeu */}
        <View style={styles.boardContainer}>
          <GameBoard currentHint={currentHint} onHintUsed={clearHint} />
        </View>
      </View>

      {/* Zone Espace Parent (panneau coulissant) */}
      <ParentPanel
        isOpen={isParentPanelOpen}
        onToggle={toggleParentPanel}
        progress={gameState.moveCount}
        optimal={optimal}
        personalBest={personalBest}
        hintsRemaining={hintsRemaining}
        maxHints={modeConfig.maxHints}
        gameMode={gameMode}
        onModeChange={handleModeChange}
        onHint={handleHint}
        hintsEnabled={modeConfig.hintsEnabled}
      />

      {/* Footer avec modes de jeu */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <GameModeSelector
          currentMode={gameMode}
          onModeChange={handleModeChange}
        />
      </View>

      {/* Modal de victoire */}
      <VictoryModal
        visible={gameState.isComplete}
        moves={gameState.moveCount}
        discCount={discCount}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  headerButtonIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 6,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  movesBox: {
    backgroundColor: Colors.neutral.surface,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    ...Layout.shadow.medium,
  },
  movesLabel: {
    fontSize: 14,
    color: Colors.neutral.textLight,
    fontWeight: '500',
  },
  movesCount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary.dark,
  },
  objectiveText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.neutral.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    ...Layout.shadow.small,
  },
  helpButton: {
    backgroundColor: Colors.button.help,
  },
  resetButton: {
    backgroundColor: Colors.button.reset,
  },
  actionButtonIcon: {
    fontSize: 18,
    marginRight: 6,
    color: '#FFFFFF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
